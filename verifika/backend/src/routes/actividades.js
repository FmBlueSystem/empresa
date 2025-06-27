const express = require('express');
const router = express.Router();
const Actividad = require('../models/Actividad');
const { authenticateToken, requireRole } = require('../middleware/auth');
const {
  validateCreateActividad,
  validateUpdateActividad,
  validateChangeStatus,
  validateTimeTracking,
  validateEvidenceUpload,
  validateQueryFilters,
  validateReporte,
  validateIdParam,
  validateEnlaceExterno
} = require('../validators/actividadValidators');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configuración de multer para upload de archivos
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/actividades');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `actividad-${req.params.id}-${uniqueSuffix}${extension}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5 // máximo 5 archivos por request
  },
  fileFilter: (req, file, cb) => {
    const tiposPermitidos = [
      'image/jpeg', 'image/png', 'image/gif',
      'application/pdf', 'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (tiposPermitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'), false);
    }
  }
});

// =============================================
// MIDDLEWARE DE PERMISOS ESPECIALIZADOS
// =============================================

/**
 * Verificar si el usuario puede acceder a la actividad
 */
const checkActividadAccess = async (req, res, next) => {
  try {
    const actividadId = req.params.id;
    const usuario = req.user;

    const actividad = await Actividad.findById(actividadId);
    if (!actividad) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }

    // Admin puede acceder a todo
    if (usuario.esAdmin) {
      req.actividad = actividad;
      return next();
    }

    // Técnico solo puede acceder a sus actividades
    if (usuario.rol === 'tecnico' && actividad.tecnico_id === usuario.id) {
      req.actividad = actividad;
      return next();
    }

    // Cliente solo puede acceder a actividades de sus proyectos
    if (usuario.rol === 'cliente' && actividad.cliente_id === usuario.cliente_id) {
      req.actividad = actividad;
      return next();
    }

    return res.status(403).json({ error: 'No tienes permisos para acceder a esta actividad' });

  } catch (error) {
    console.error('Error verificando acceso a actividad:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Verificar si el usuario puede modificar la actividad
 */
const checkActividadModify = async (req, res, next) => {
  try {
    const usuario = req.user;
    const actividad = req.actividad;

    // Admin puede modificar cualquier actividad
    if (usuario.esAdmin) {
      return next();
    }

    // Técnico solo puede modificar sus propias actividades
    if (usuario.rol === 'tecnico' && actividad.tecnico_id === usuario.id) {
      return next();
    }

    return res.status(403).json({ error: 'No tienes permisos para modificar esta actividad' });

  } catch (error) {
    console.error('Error verificando permisos de modificación:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Aplicar filtros automáticos por rol
 */
const applyRoleFilters = (req, res, next) => {
  const usuario = req.user;

  // Admin puede ver todo sin filtros
  if (usuario.esAdmin) {
    return next();
  }

  // Técnico solo ve sus actividades
  if (usuario.rol === 'tecnico') {
    req.query.tecnico_id = usuario.id;
  }

  // Cliente solo ve actividades de sus proyectos
  if (usuario.rol === 'cliente') {
    req.query.cliente_id = usuario.cliente_id;
  }

  next();
};

// =============================================
// ENDPOINTS BÁSICOS (5)
// =============================================

/**
 * GET /api/actividades - Listar actividades con filtros
 */
router.get('/', 
  authenticateToken,
  validateQueryFilters,
  applyRoleFilters,
  async (req, res) => {
    try {
      const filtros = req.query;
      const paginacion = {
        limit: filtros.limit,
        offset: filtros.offset
      };

      delete filtros.limit;
      delete filtros.offset;

      const actividades = await Actividad.findAll(filtros, paginacion);

      res.json({
        success: true,
        data: actividades.map(actividad => actividad.toJSON()),
        pagination: {
          limit: paginacion.limit,
          offset: paginacion.offset,
          total: actividades.length
        },
        filtros_aplicados: filtros
      });

    } catch (error) {
      console.error('Error obteniendo actividades:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * GET /api/actividades/:id - Obtener actividad específica
 */
router.get('/:id',
  authenticateToken,
  validateIdParam,
  checkActividadAccess,
  async (req, res) => {
    try {
      res.json({
        success: true,
        data: req.actividad.toJSON()
      });

    } catch (error) {
      console.error('Error obteniendo actividad:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * POST /api/actividades - Crear nueva actividad
 */
router.post('/',
  authenticateToken,
  requireRole('admin', 'tecnico'),
  validateCreateActividad,
  async (req, res) => {
    try {
      const actividadData = {
        ...req.body,
        creado_por: req.user.id
      };

      // Si no es admin, solo puede crear actividades para sí mismo
      if (!req.user.esAdmin && req.user.rol === 'tecnico') {
        actividadData.tecnico_id = req.user.id;
      }

      const nuevaActividad = await Actividad.create(actividadData);

      res.status(201).json({
        success: true,
        message: 'Actividad creada exitosamente',
        data: nuevaActividad.toJSON()
      });

    } catch (error) {
      console.error('Error creando actividad:', error);
      
      if (error.message.includes('asignación no existe') || 
          error.message.includes('técnico no está asignado')) {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * PUT /api/actividades/:id - Actualizar actividad
 */
router.put('/:id',
  authenticateToken,
  validateIdParam,
  checkActividadAccess,
  checkActividadModify,
  validateUpdateActividad,
  async (req, res) => {
    try {
      const actividadActualizada = await req.actividad.update(req.body);

      res.json({
        success: true,
        message: 'Actividad actualizada exitosamente',
        data: actividadActualizada.toJSON()
      });

    } catch (error) {
      console.error('Error actualizando actividad:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * DELETE /api/actividades/:id - Eliminar actividad
 */
router.delete('/:id',
  authenticateToken,
  requireRole('admin'),
  validateIdParam,
  checkActividadAccess,
  async (req, res) => {
    try {
      await req.actividad.delete();

      res.json({
        success: true,
        message: 'Actividad eliminada exitosamente'
      });

    } catch (error) {
      console.error('Error eliminando actividad:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

// =============================================
// ENDPOINTS POR ENTIDAD (3)
// =============================================

/**
 * GET /api/actividades/asignacion/:id - Actividades de una asignación
 */
router.get('/asignacion/:id',
  authenticateToken,
  validateIdParam,
  validateQueryFilters,
  applyRoleFilters,
  async (req, res) => {
    try {
      const asignacionId = req.params.id;
      const filtros = { ...req.query, asignacion_id: asignacionId };

      const actividades = await Actividad.findByAsignacion(asignacionId, filtros);

      res.json({
        success: true,
        data: actividades.map(actividad => actividad.toJSON()),
        asignacion_id: asignacionId,
        total: actividades.length
      });

    } catch (error) {
      console.error('Error obteniendo actividades por asignación:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * GET /api/actividades/tecnico/:id - Actividades de un técnico
 */
router.get('/tecnico/:id',
  authenticateToken,
  validateIdParam,
  validateQueryFilters,
  async (req, res) => {
    try {
      const tecnicoId = req.params.id;
      const usuario = req.user;

      // Verificar permisos: admin o el propio técnico
      if (!usuario.esAdmin && usuario.id !== parseInt(tecnicoId)) {
        return res.status(403).json({ error: 'No tienes permisos para ver actividades de otro técnico' });
      }

      const filtros = { ...req.query, tecnico_id: tecnicoId };
      const actividades = await Actividad.findByTecnico(tecnicoId, filtros);

      res.json({
        success: true,
        data: actividades.map(actividad => actividad.toJSON()),
        tecnico_id: tecnicoId,
        total: actividades.length
      });

    } catch (error) {
      console.error('Error obteniendo actividades por técnico:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * GET /api/actividades/cliente/:id - Actividades de proyectos del cliente
 */
router.get('/cliente/:id',
  authenticateToken,
  validateIdParam,
  validateQueryFilters,
  async (req, res) => {
    try {
      const clienteId = req.params.id;
      const usuario = req.user;

      // Verificar permisos: admin o el propio cliente
      if (!usuario.esAdmin && usuario.cliente_id !== parseInt(clienteId)) {
        return res.status(403).json({ error: 'No tienes permisos para ver actividades de otro cliente' });
      }

      const filtros = { ...req.query, cliente_id: clienteId };
      const actividades = await Actividad.findByCliente(clienteId, filtros);

      res.json({
        success: true,
        data: actividades.map(actividad => actividad.toJSON()),
        cliente_id: clienteId,
        total: actividades.length
      });

    } catch (error) {
      console.error('Error obteniendo actividades por cliente:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

// =============================================
// ENDPOINTS DE CRONÓMETRO (4)
// =============================================

/**
 * POST /api/actividades/:id/cronometro/iniciar - Iniciar tracking tiempo
 */
router.post('/:id/cronometro/iniciar',
  authenticateToken,
  validateIdParam,
  checkActividadAccess,
  checkActividadModify,
  validateTimeTracking,
  async (req, res) => {
    try {
      const { descripcion_actual } = req.body;
      
      await req.actividad.iniciarCronometro(descripcion_actual);

      res.json({
        success: true,
        message: 'Cronómetro iniciado exitosamente',
        data: req.actividad.toJSON()
      });

    } catch (error) {
      console.error('Error iniciando cronómetro:', error);
      
      if (error.message.includes('cronómetro activo')) {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * POST /api/actividades/:id/cronometro/pausar - Pausar cronómetro
 */
router.post('/:id/cronometro/pausar',
  authenticateToken,
  validateIdParam,
  checkActividadAccess,
  checkActividadModify,
  validateTimeTracking,
  async (req, res) => {
    try {
      const { razon_pausa } = req.body;
      
      await req.actividad.pausarCronometro(razon_pausa);

      res.json({
        success: true,
        message: 'Cronómetro pausado exitosamente',
        data: req.actividad.toJSON()
      });

    } catch (error) {
      console.error('Error pausando cronómetro:', error);
      
      if (error.message.includes('cronómetro no está activo')) {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * POST /api/actividades/:id/cronometro/reanudar - Reanudar cronómetro
 */
router.post('/:id/cronometro/reanudar',
  authenticateToken,
  validateIdParam,
  checkActividadAccess,
  checkActividadModify,
  async (req, res) => {
    try {
      await req.actividad.reanudarCronometro();

      res.json({
        success: true,
        message: 'Cronómetro reanudado exitosamente',
        data: req.actividad.toJSON()
      });

    } catch (error) {
      console.error('Error reanudando cronómetro:', error);
      
      if (error.message.includes('cronómetro activo')) {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * POST /api/actividades/:id/cronometro/finalizar - Finalizar y guardar tiempo
 */
router.post('/:id/cronometro/finalizar',
  authenticateToken,
  validateIdParam,
  checkActividadAccess,
  checkActividadModify,
  validateTimeTracking,
  async (req, res) => {
    try {
      const { resumen_trabajo, tiempo_efectivo_horas, porcentaje_completado } = req.body;
      
      await req.actividad.finalizarCronometro(resumen_trabajo, tiempo_efectivo_horas, porcentaje_completado);

      res.json({
        success: true,
        message: 'Cronómetro finalizado exitosamente',
        data: req.actividad.toJSON()
      });

    } catch (error) {
      console.error('Error finalizando cronómetro:', error);
      
      if (error.message.includes('cronómetro no está activo')) {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

// =============================================
// ENDPOINTS DE EVIDENCIAS (4)
// =============================================

/**
 * POST /api/actividades/:id/evidencias - Subir archivo/evidencia
 */
router.post('/:id/evidencias',
  authenticateToken,
  validateIdParam,
  checkActividadAccess,
  checkActividadModify,
  upload.array('archivos', 5),
  validateEvidenceUpload,
  async (req, res) => {
    try {
      const { tipo, descripcion } = req.body;
      const archivos = req.files;

      if (!archivos || archivos.length === 0) {
        return res.status(400).json({ error: 'No se han proporcionado archivos' });
      }

      const evidenciasAgregadas = [];

      for (const archivo of archivos) {
        const archivoInfo = {
          nombre: archivo.originalname,
          ruta: archivo.path,
          tipo: tipo,
          tamaño: archivo.size,
          descripcion: descripcion || ''
        };

        if (tipo === 'captura') {
          await req.actividad.agregarCaptura(archivoInfo);
        } else {
          await req.actividad.agregarArchivo(archivoInfo);
        }

        evidenciasAgregadas.push({
          nombre: archivo.originalname,
          tipo: tipo,
          tamaño: archivo.size
        });
      }

      res.json({
        success: true,
        message: 'Evidencias subidas exitosamente',
        data: {
          actividad: req.actividad.toJSON(),
          evidencias_agregadas: evidenciasAgregadas
        }
      });

    } catch (error) {
      console.error('Error subiendo evidencias:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * GET /api/actividades/:id/evidencias - Listar evidencias
 */
router.get('/:id/evidencias',
  authenticateToken,
  validateIdParam,
  checkActividadAccess,
  async (req, res) => {
    try {
      const evidencias = {
        archivos_adjuntos: req.actividad.archivos_adjuntos,
        capturas_pantalla: req.actividad.capturas_pantalla,
        enlaces_externos: req.actividad.enlaces_externos
      };

      res.json({
        success: true,
        data: evidencias,
        total_archivos: evidencias.archivos_adjuntos.length,
        total_capturas: evidencias.capturas_pantalla.length,
        total_enlaces: evidencias.enlaces_externos.length
      });

    } catch (error) {
      console.error('Error listando evidencias:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * GET /api/actividades/:id/evidencias/:evidenciaId/download - Descargar archivo
 */
router.get('/:id/evidencias/:evidenciaId/download',
  authenticateToken,
  validateIdParam,
  checkActividadAccess,
  async (req, res) => {
    try {
      const evidenciaId = parseInt(req.params.evidenciaId);
      
      // Buscar en archivos adjuntos
      let archivo = req.actividad.archivos_adjuntos.find(a => a.id === evidenciaId);
      
      // Si no está en archivos, buscar en capturas
      if (!archivo) {
        archivo = req.actividad.capturas_pantalla.find(c => c.id === evidenciaId);
      }

      if (!archivo) {
        return res.status(404).json({ error: 'Archivo no encontrado' });
      }

      // Verificar que el archivo existe en el sistema
      try {
        await fs.access(archivo.ruta);
      } catch (error) {
        return res.status(404).json({ error: 'Archivo no disponible en el servidor' });
      }

      // Enviar archivo
      res.download(archivo.ruta, archivo.nombre);

    } catch (error) {
      console.error('Error descargando archivo:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * DELETE /api/actividades/:id/evidencias/:evidenciaId - Eliminar evidencia
 */
router.delete('/:id/evidencias/:evidenciaId',
  authenticateToken,
  validateIdParam,
  checkActividadAccess,
  checkActividadModify,
  async (req, res) => {
    try {
      const evidenciaId = parseInt(req.params.evidenciaId);
      
      await req.actividad.eliminarArchivo(evidenciaId);

      res.json({
        success: true,
        message: 'Evidencia eliminada exitosamente'
      });

    } catch (error) {
      console.error('Error eliminando evidencia:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

// =============================================
// ENDPOINTS DE VALIDACIÓN (3)
// =============================================

/**
 * POST /api/actividades/:id/validar - Aprobar actividad
 */
router.post('/:id/validar',
  authenticateToken,
  validateIdParam,
  checkActividadAccess,
  validateChangeStatus,
  async (req, res) => {
    try {
      const usuario = req.user;
      const { puntuacion_calidad, observaciones } = req.body;

      // Solo admin o cliente propietario pueden validar
      if (!usuario.esAdmin && usuario.rol !== 'cliente') {
        return res.status(403).json({ error: 'Solo administradores y clientes pueden validar actividades' });
      }

      await req.actividad.validar(usuario.id, puntuacion_calidad, observaciones);

      res.json({
        success: true,
        message: 'Actividad validada exitosamente',
        data: req.actividad.toJSON()
      });

    } catch (error) {
      console.error('Error validando actividad:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * POST /api/actividades/:id/rechazar - Rechazar con observaciones
 */
router.post('/:id/rechazar',
  authenticateToken,
  validateIdParam,
  checkActividadAccess,
  validateChangeStatus,
  async (req, res) => {
    try {
      const usuario = req.user;
      const { observaciones, puntos_mejora } = req.body;

      // Solo admin o cliente propietario pueden rechazar
      if (!usuario.esAdmin && usuario.rol !== 'cliente') {
        return res.status(403).json({ error: 'Solo administradores y clientes pueden rechazar actividades' });
      }

      await req.actividad.rechazar(usuario.id, observaciones, puntos_mejora);

      res.json({
        success: true,
        message: 'Actividad rechazada',
        data: req.actividad.toJSON()
      });

    } catch (error) {
      console.error('Error rechazando actividad:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * GET /api/actividades/pendientes-validacion - Actividades pendientes validación
 */
router.get('/pendientes-validacion',
  authenticateToken,
  requireRole('admin', 'cliente'),
  validateQueryFilters,
  async (req, res) => {
    try {
      const usuario = req.user;
      let clienteId = null;

      // Si es cliente, solo ver sus actividades
      if (usuario.rol === 'cliente') {
        clienteId = usuario.cliente_id;
      }

      const actividades = await Actividad.findPendientesValidacion(clienteId);

      res.json({
        success: true,
        data: actividades.map(actividad => actividad.toJSON()),
        total: actividades.length
      });

    } catch (error) {
      console.error('Error obteniendo actividades pendientes:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

// =============================================
// ENDPOINTS DE REPORTES (3)
// =============================================

/**
 * GET /api/actividades/reportes/productividad - Reporte productividad técnico
 */
router.get('/reportes/productividad',
  authenticateToken,
  requireRole('admin'),
  validateReporte,
  async (req, res) => {
    try {
      const { tecnico_id, fecha_inicio, fecha_fin } = req.query;

      const reporte = await Actividad.getReporteProductividad(tecnico_id, fecha_inicio, fecha_fin);

      if (!reporte) {
        return res.status(404).json({ error: 'No se encontraron datos para el reporte' });
      }

      res.json({
        success: true,
        data: reporte,
        periodo: { fecha_inicio, fecha_fin },
        tecnico_id
      });

    } catch (error) {
      console.error('Error generando reporte de productividad:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * GET /api/actividades/reportes/tiempo - Reporte tiempo por proyecto
 */
router.get('/reportes/tiempo',
  authenticateToken,
  validateReporte,
  async (req, res) => {
    try {
      const usuario = req.user;
      const filtros = {
        fecha_desde: req.query.fecha_inicio,
        fecha_hasta: req.query.fecha_fin
      };

      // Aplicar filtros por rol
      if (!usuario.esAdmin) {
        if (usuario.rol === 'cliente') {
          filtros.cliente_id = usuario.cliente_id;
        } else if (usuario.rol === 'tecnico') {
          filtros.tecnico_id = usuario.id;
        }
      }

      if (req.query.cliente_id && usuario.esAdmin) {
        filtros.cliente_id = req.query.cliente_id;
      }

      const estadisticas = await Actividad.getEstadisticas(filtros);

      res.json({
        success: true,
        data: estadisticas,
        periodo: { fecha_inicio: req.query.fecha_inicio, fecha_fin: req.query.fecha_fin },
        filtros_aplicados: filtros
      });

    } catch (error) {
      console.error('Error generando reporte de tiempo:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * GET /api/actividades/stats - Estadísticas generales
 */
router.get('/stats',
  authenticateToken,
  requireRole('admin'),
  validateQueryFilters,
  async (req, res) => {
    try {
      const filtros = req.query;
      const estadisticas = await Actividad.getEstadisticas(filtros);

      res.json({
        success: true,
        data: estadisticas,
        filtros_aplicados: filtros
      });

    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

// =============================================
// ENDPOINTS ADICIONALES
// =============================================

/**
 * PATCH /api/actividades/:id/status - Cambiar estado
 */
router.patch('/:id/status',
  authenticateToken,
  validateIdParam,
  checkActividadAccess,
  validateChangeStatus,
  async (req, res) => {
    try {
      const usuario = req.user;
      const { estado, observaciones } = req.body;

      // Verificar permisos específicos por estado
      if (estado === 'validada' || estado === 'rechazada') {
        if (!usuario.esAdmin && usuario.rol !== 'cliente') {
          return res.status(403).json({ error: 'Solo administradores y clientes pueden validar/rechazar' });
        }
      } else {
        // Para otros estados, verificar permisos de modificación
        if (!usuario.esAdmin && req.actividad.tecnico_id !== usuario.id) {
          return res.status(403).json({ error: 'No tienes permisos para cambiar el estado de esta actividad' });
        }
      }

      await req.actividad.changeStatus(estado, observaciones, usuario.id);

      res.json({
        success: true,
        message: `Estado cambiado a ${estado} exitosamente`,
        data: req.actividad.toJSON()
      });

    } catch (error) {
      console.error('Error cambiando estado:', error);
      
      if (error.message.includes('Transición inválida') || error.message.includes('Estado inválido')) {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * POST /api/actividades/:id/enlaces - Agregar enlace externo
 */
router.post('/:id/enlaces',
  authenticateToken,
  validateIdParam,
  checkActividadAccess,
  checkActividadModify,
  validateEnlaceExterno,
  async (req, res) => {
    try {
      await req.actividad.agregarEnlace(req.body);

      res.json({
        success: true,
        message: 'Enlace agregado exitosamente',
        data: req.actividad.toJSON()
      });

    } catch (error) {
      console.error('Error agregando enlace:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * GET /api/actividades/cronometro/activos - Actividades con cronómetro activo
 */
router.get('/cronometro/activos',
  authenticateToken,
  applyRoleFilters,
  async (req, res) => {
    try {
      const usuario = req.user;
      let tecnicoId = null;

      // Si es técnico, solo sus cronómetros activos
      if (usuario.rol === 'tecnico') {
        tecnicoId = usuario.id;
      }

      const actividades = await Actividad.findActivasConCronometro(tecnicoId);

      res.json({
        success: true,
        data: actividades.map(actividad => actividad.toJSON()),
        total: actividades.length
      });

    } catch (error) {
      console.error('Error obteniendo cronómetros activos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

module.exports = router;
