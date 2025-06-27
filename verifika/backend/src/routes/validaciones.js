const express = require('express');
const router = express.Router();
const Validacion = require('../models/Validacion');
const Comentario = require('../models/Comentario');
const { authenticateToken, requireRole } = require('../middleware/auth');
const {
  validateCreateValidacion,
  validateUpdateValidacion,
  validateValidarActividad,
  validateRechazarActividad,
  validateEscalarValidacion,
  validateReabrirValidacion,
  validateComment,
  validateQueryFilters,
  validateReporte,
  validateIdParam
} = require('../validators/validacionValidators');

// =============================================
// MIDDLEWARE DE PERMISOS ESPECIALIZADOS
// =============================================

/**
 * Verificar si el usuario puede acceder a la validación
 */
const checkValidacionAccess = async (req, res, next) => {
  try {
    const validacionId = req.params.id;
    const usuario = req.user;

    const validacion = await Validacion.findById(validacionId);
    if (!validacion) {
      return res.status(404).json({ error: 'Validación no encontrada' });
    }

    // Admin puede acceder a todo
    if (usuario.esAdmin) {
      req.validacion = validacion;
      return next();
    }

    // Cliente solo puede acceder a validaciones de sus proyectos
    if (usuario.rol === 'cliente' && validacion.cliente_id === usuario.cliente_id) {
      req.validacion = validacion;
      return next();
    }

    // Técnico solo puede ver validaciones de sus actividades
    if (usuario.rol === 'tecnico' && validacion.tecnico_id === usuario.id) {
      req.validacion = validacion;
      return next();
    }

    // Supervisor puede acceder a validaciones escaladas a él
    if (usuario.rol === 'supervisor' && validacion.supervisor_escalado_id === usuario.id) {
      req.validacion = validacion;
      return next();
    }

    return res.status(403).json({ error: 'No tienes permisos para acceder a esta validación' });

  } catch (error) {
    console.error('Error verificando acceso a validación:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Verificar si el usuario puede modificar la validación
 */
const checkValidacionModify = async (req, res, next) => {
  try {
    const usuario = req.user;
    const validacion = req.validacion;

    // Admin puede modificar cualquier validación
    if (usuario.esAdmin) {
      return next();
    }

    // Cliente/Supervisor solo puede validar/rechazar/escalar sus validaciones
    if ((usuario.rol === 'cliente' && validacion.cliente_id === usuario.cliente_id) ||
        (usuario.rol === 'supervisor' && validacion.supervisor_escalado_id === usuario.id)) {
      return next();
    }

    return res.status(403).json({ error: 'No tienes permisos para modificar esta validación' });

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

  // Cliente solo ve validaciones de sus proyectos
  if (usuario.rol === 'cliente') {
    req.query.cliente_id = usuario.cliente_id;
  }

  // Técnico solo ve validaciones de sus actividades
  if (usuario.rol === 'tecnico') {
    req.query.tecnico_id = usuario.id;
  }

  // Supervisor ve validaciones escaladas a él + las de su organización
  if (usuario.rol === 'supervisor') {
    // Agregar lógica específica de supervisor si es necesario
    req.query.supervisor_escalado_id = usuario.id;
  }

  next();
};

// =============================================
// ENDPOINTS BÁSICOS (4)
// =============================================

/**
 * GET /api/validaciones - Listar validaciones con filtros
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

      const validaciones = await Validacion.findAll(filtros, paginacion);

      res.json({
        success: true,
        data: validaciones.map(validacion => validacion.toJSON()),
        pagination: {
          limit: paginacion.limit,
          offset: paginacion.offset,
          total: validaciones.length
        },
        filtros_aplicados: filtros
      });

    } catch (error) {
      console.error('Error obteniendo validaciones:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * GET /api/validaciones/:id - Obtener validación específica
 */
router.get('/:id',
  authenticateToken,
  validateIdParam,
  checkValidacionAccess,
  async (req, res) => {
    try {
      res.json({
        success: true,
        data: req.validacion.toJSON()
      });

    } catch (error) {
      console.error('Error obteniendo validación:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * POST /api/validaciones - Crear nueva validación
 */
router.post('/',
  authenticateToken,
  requireRole('admin', 'cliente', 'supervisor'),
  validateCreateValidacion,
  async (req, res) => {
    try {
      const validacionData = req.body;

      // Si no es admin, solo puede crear validaciones para su cliente
      if (!req.user.esAdmin && req.user.rol === 'cliente') {
        validacionData.cliente_id = req.user.cliente_id;
        validacionData.validador_id = req.user.id;
      }

      const nuevaValidacion = await Validacion.create(validacionData);

      res.status(201).json({
        success: true,
        message: 'Validación creada exitosamente',
        data: nuevaValidacion.toJSON()
      });

    } catch (error) {
      console.error('Error creando validación:', error);
      
      if (error.message.includes('actividad no existe') || 
          error.message.includes('no tiene permisos')) {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * PUT /api/validaciones/:id - Actualizar validación
 */
router.put('/:id',
  authenticateToken,
  validateIdParam,
  checkValidacionAccess,
  checkValidacionModify,
  validateUpdateValidacion,
  async (req, res) => {
    try {
      const validacionActualizada = await req.validacion.update(req.body);

      res.json({
        success: true,
        message: 'Validación actualizada exitosamente',
        data: validacionActualizada.toJSON()
      });

    } catch (error) {
      console.error('Error actualizando validación:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

// =============================================
// ENDPOINTS DE WORKFLOW (4)
// =============================================

/**
 * POST /api/validaciones/:id/validar - Aprobar actividad
 */
router.post('/:id/validar',
  authenticateToken,
  validateIdParam,
  checkValidacionAccess,
  checkValidacionModify,
  validateValidarActividad,
  async (req, res) => {
    try {
      const usuario = req.user;
      
      // Verificar que el estado permite validación
      if (!['pendiente_revision', 'en_revision', 'reabierta'].includes(req.validacion.estado)) {
        return res.status(400).json({ 
          error: `No se puede validar una actividad en estado "${req.validacion.estado}"` 
        });
      }

      await req.validacion.validar(usuario.id, req.body);

      res.json({
        success: true,
        message: 'Actividad validada exitosamente',
        data: req.validacion.toJSON()
      });

    } catch (error) {
      console.error('Error validando actividad:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * POST /api/validaciones/:id/rechazar - Rechazar con feedback
 */
router.post('/:id/rechazar',
  authenticateToken,
  validateIdParam,
  checkValidacionAccess,
  checkValidacionModify,
  validateRechazarActividad,
  async (req, res) => {
    try {
      const usuario = req.user;
      
      // Verificar que el estado permite rechazo
      if (!['pendiente_revision', 'en_revision', 'reabierta'].includes(req.validacion.estado)) {
        return res.status(400).json({ 
          error: `No se puede rechazar una actividad en estado "${req.validacion.estado}"` 
        });
      }

      await req.validacion.rechazar(usuario.id, req.body);

      res.json({
        success: true,
        message: 'Actividad rechazada',
        data: req.validacion.toJSON()
      });

    } catch (error) {
      console.error('Error rechazando actividad:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * POST /api/validaciones/:id/escalar - Escalar a supervisor
 */
router.post('/:id/escalar',
  authenticateToken,
  validateIdParam,
  checkValidacionAccess,
  checkValidacionModify,
  validateEscalarValidacion,
  async (req, res) => {
    try {
      const { supervisor_id, razon_escalamiento } = req.body;
      
      // Verificar que el estado permite escalamiento
      if (!['pendiente_revision', 'en_revision'].includes(req.validacion.estado)) {
        return res.status(400).json({ 
          error: `No se puede escalar una actividad en estado "${req.validacion.estado}"` 
        });
      }

      await req.validacion.escalar(supervisor_id, razon_escalamiento);

      res.json({
        success: true,
        message: 'Validación escalada exitosamente',
        data: req.validacion.toJSON()
      });

    } catch (error) {
      console.error('Error escalando validación:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * POST /api/validaciones/:id/reabrir - Reabrir validación (solo admin)
 */
router.post('/:id/reabrir',
  authenticateToken,
  requireRole('admin'),
  validateIdParam,
  checkValidacionAccess,
  validateReabrirValidacion,
  async (req, res) => {
    try {
      const { motivo_reapertura } = req.body;
      
      // Verificar que el estado permite reapertura
      if (!['validada', 'rechazada', 'escalada'].includes(req.validacion.estado)) {
        return res.status(400).json({ 
          error: `No se puede reabrir una actividad en estado "${req.validacion.estado}"` 
        });
      }

      await req.validacion.reabrir(motivo_reapertura);

      res.json({
        success: true,
        message: 'Validación reabierta exitosamente',
        data: req.validacion.toJSON()
      });

    } catch (error) {
      console.error('Error reabriendo validación:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

// =============================================
// ENDPOINTS DE COMENTARIOS (3)
// =============================================

/**
 * GET /api/validaciones/:id/comentarios - Listar comentarios anidados
 */
router.get('/:id/comentarios',
  authenticateToken,
  validateIdParam,
  checkValidacionAccess,
  async (req, res) => {
    try {
      const ordenamiento = req.query.orden === 'desc' ? 'DESC' : 'ASC';
      const comentarios = await Comentario.findByValidacion(req.validacion.id, ordenamiento);

      res.json({
        success: true,
        data: comentarios.map(comentario => comentario.toJSON(true)),
        total: comentarios.length,
        validacion_id: req.validacion.id
      });

    } catch (error) {
      console.error('Error obteniendo comentarios:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * POST /api/validaciones/:id/comentarios - Agregar comentario
 */
router.post('/:id/comentarios',
  authenticateToken,
  validateIdParam,
  checkValidacionAccess,
  validateComment,
  async (req, res) => {
    try {
      const comentarioData = {
        ...req.body,
        validacion_id: req.validacion.id,
        usuario_id: req.user.id
      };

      // Iniciar revisión automáticamente si es el primer comentario del validador
      if (req.validacion.estado === 'pendiente_revision' && 
          req.user.id === req.validacion.validador_id) {
        await req.validacion.iniciarRevision();
      }

      const nuevoComentario = await Comentario.create(comentarioData);

      res.status(201).json({
        success: true,
        message: 'Comentario agregado exitosamente',
        data: nuevoComentario.toJSON()
      });

    } catch (error) {
      console.error('Error agregando comentario:', error);
      
      if (error.message.includes('Máximo nivel de anidación')) {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * PUT /api/comentarios/:id - Editar comentario propio
 */
router.put('/comentarios/:id',
  authenticateToken,
  validateIdParam,
  async (req, res) => {
    try {
      const comentario = await Comentario.findById(req.params.id);
      
      if (!comentario) {
        return res.status(404).json({ error: 'Comentario no encontrado' });
      }

      // Solo el autor o admin pueden editar
      if (!req.user.esAdmin && comentario.usuario_id !== req.user.id) {
        return res.status(403).json({ error: 'Solo puedes editar tus propios comentarios' });
      }

      const comentarioActualizado = await comentario.update(req.body);

      res.json({
        success: true,
        message: 'Comentario actualizado exitosamente',
        data: comentarioActualizado.toJSON()
      });

    } catch (error) {
      console.error('Error actualizando comentario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

// =============================================
// ENDPOINTS DE DASHBOARD Y REPORTES (4)
// =============================================

/**
 * GET /api/validaciones/dashboard - Dashboard personalizado
 */
router.get('/dashboard',
  authenticateToken,
  async (req, res) => {
    try {
      const usuario = req.user;
      let clienteId = null;

      // Si es cliente, solo ver su dashboard
      if (usuario.rol === 'cliente') {
        clienteId = usuario.cliente_id;
      }

      const dashboard = await Validacion.getDashboard(clienteId);

      // Obtener actividades pendientes de validar
      const actividadesPendientes = await Validacion.findAll({
        estado: ['pendiente_revision', 'en_revision'],
        cliente_id: clienteId
      }, { limit: 10 });

      res.json({
        success: true,
        data: {
          ...dashboard,
          actividades_pendientes: actividadesPendientes.map(v => v.toJSON())
        }
      });

    } catch (error) {
      console.error('Error obteniendo dashboard:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * GET /api/validaciones/reportes/calidad - Reporte de calidad
 */
router.get('/reportes/calidad',
  authenticateToken,
  validateReporte,
  async (req, res) => {
    try {
      const usuario = req.user;
      const filtros = { ...req.query };

      // Aplicar filtros por rol
      if (!usuario.esAdmin) {
        if (usuario.rol === 'cliente') {
          filtros.cliente_id = usuario.cliente_id;
        }
      }

      const reporteCalidad = await Validacion.getReporteCalidad(filtros);

      res.json({
        success: true,
        data: reporteCalidad,
        filtros_aplicados: filtros,
        generado_en: new Date()
      });

    } catch (error) {
      console.error('Error generando reporte de calidad:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * GET /api/validaciones/reportes/tendencias - Tendencias de validación
 */
router.get('/reportes/tendencias',
  authenticateToken,
  requireRole('admin', 'supervisor'),
  validateReporte,
  async (req, res) => {
    try {
      const periodo = req.query.periodo || 30;
      const tendencias = await Validacion.getTendenciasValidacion(periodo);

      res.json({
        success: true,
        data: tendencias,
        periodo_dias: periodo,
        generado_en: new Date()
      });

    } catch (error) {
      console.error('Error generando tendencias:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * GET /api/validaciones/metricas - Métricas avanzadas
 */
router.get('/metricas',
  authenticateToken,
  validateQueryFilters,
  async (req, res) => {
    try {
      const usuario = req.user;
      let clienteId = null;

      // Aplicar filtros por rol
      if (!usuario.esAdmin && usuario.rol === 'cliente') {
        clienteId = usuario.cliente_id;
      }

      const metricas = await Validacion.getDashboard(clienteId);

      // Obtener estadísticas adicionales
      const estadisticasComentarios = await Comentario.getEstadisticasValidacion();
      const rankingUsuarios = await Comentario.getRankingUsuarios(30);

      res.json({
        success: true,
        data: {
          ...metricas,
          comentarios: estadisticasComentarios,
          usuarios_activos: rankingUsuarios
        },
        generado_en: new Date()
      });

    } catch (error) {
      console.error('Error obteniendo métricas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

// =============================================
// ENDPOINTS ADICIONALES (3)
// =============================================

/**
 * GET /api/validaciones/pendientes - Validaciones pendientes por vencer
 */
router.get('/pendientes',
  authenticateToken,
  requireRole('admin', 'cliente', 'supervisor'),
  async (req, res) => {
    try {
      const usuario = req.user;
      let clienteId = null;

      if (usuario.rol === 'cliente') {
        clienteId = usuario.cliente_id;
      }

      const validacionesPendientes = await Validacion.findAll({
        estado: ['pendiente_revision', 'en_revision'],
        proximas_vencer: true,
        cliente_id: clienteId
      });

      res.json({
        success: true,
        data: validacionesPendientes.map(v => v.toJSON()),
        total: validacionesPendientes.length
      });

    } catch (error) {
      console.error('Error obteniendo validaciones pendientes:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * GET /api/validaciones/vencidas - Validaciones vencidas
 */
router.get('/vencidas',
  authenticateToken,
  requireRole('admin', 'supervisor'),
  async (req, res) => {
    try {
      const validacionesVencidas = await Validacion.findAll({
        vencidas: true,
        estado: ['pendiente_revision', 'en_revision']
      });

      res.json({
        success: true,
        data: validacionesVencidas.map(v => v.toJSON()),
        total: validacionesVencidas.length
      });

    } catch (error) {
      console.error('Error obteniendo validaciones vencidas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * POST /api/validaciones/procesar-escalamientos - Procesar escalamientos automáticos
 */
router.post('/procesar-escalamientos',
  authenticateToken,
  requireRole('admin'),
  async (req, res) => {
    try {
      const resultado = await Validacion.procesarEscalamientosAutomaticos();

      res.json({
        success: true,
        message: 'Escalamientos procesados exitosamente',
        data: resultado
      });

    } catch (error) {
      console.error('Error procesando escalamientos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

// =============================================
// ENDPOINTS DE COMENTARIOS ADICIONALES
// =============================================

/**
 * GET /api/comentarios/:id/hilo - Obtener hilo completo de comentario
 */
router.get('/comentarios/:id/hilo',
  authenticateToken,
  validateIdParam,
  async (req, res) => {
    try {
      const comentario = await Comentario.findById(req.params.id);
      
      if (!comentario) {
        return res.status(404).json({ error: 'Comentario no encontrado' });
      }

      const hiloCompleto = await comentario.getHiloCompleto();

      res.json({
        success: true,
        data: hiloCompleto.map(c => c.toJSON()),
        total: hiloCompleto.length
      });

    } catch (error) {
      console.error('Error obteniendo hilo de comentario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * GET /api/comentarios/:id/estadisticas - Estadísticas del comentario
 */
router.get('/comentarios/:id/estadisticas',
  authenticateToken,
  validateIdParam,
  async (req, res) => {
    try {
      const comentario = await Comentario.findById(req.params.id);
      
      if (!comentario) {
        return res.status(404).json({ error: 'Comentario no encontrado' });
      }

      const estadisticas = await comentario.getEstadisticas();

      res.json({
        success: true,
        data: estadisticas
      });

    } catch (error) {
      console.error('Error obteniendo estadísticas de comentario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * DELETE /api/comentarios/:id - Eliminar comentario
 */
router.delete('/comentarios/:id',
  authenticateToken,
  validateIdParam,
  async (req, res) => {
    try {
      const comentario = await Comentario.findById(req.params.id);
      
      if (!comentario) {
        return res.status(404).json({ error: 'Comentario no encontrado' });
      }

      // Solo el autor o admin pueden eliminar
      if (!req.user.esAdmin && comentario.usuario_id !== req.user.id) {
        return res.status(403).json({ error: 'Solo puedes eliminar tus propios comentarios' });
      }

      await comentario.delete();

      res.json({
        success: true,
        message: 'Comentario eliminado exitosamente'
      });

    } catch (error) {
      console.error('Error eliminando comentario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

module.exports = router;
