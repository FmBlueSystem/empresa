// asignaciones.js - Rutas para gestión de asignaciones técnico-cliente en Verifika
const express = require('express');
const Asignacion = require('../models/Asignacion');
const { 
  authenticateToken, 
  requireAdmin, 
  requireOwnerOrAdmin 
} = require('../middleware/auth');
const { 
  AppError, 
  ValidationError, 
  NotFoundError,
  BusinessLogicError,
  asyncHandler,
  validateRequest,
  sendSuccess
} = require('../middleware/errorHandler');
const {
  createAsignacionSchema,
  updateAsignacionSchema,
  getAsignacionesQuerySchema,
  changeStatusSchema,
  checkDisponibilidadSchema,
  checkCompetenciasSchema,
  autoAssignSchema,
  reportProgressSchema,
  idParamSchema
} = require('../validators/asignacionValidators');

const router = express.Router();

// ============================================
// RUTAS PÚBLICAS (lectura con autenticación)
// ============================================

// GET /api/asignaciones - Listar asignaciones con filtros
router.get('/',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const query = getAsignacionesQuerySchema.validate(req.query).value;
    
    // Calcular offset para paginación
    const offset = (query.page - 1) * query.limit;
    
    const filtros = {
      tecnico_id: query.tecnico_id,
      cliente_id: query.cliente_id,
      proyecto_id: query.proyecto_id,
      estado: query.estado,
      tipo_asignacion: query.tipo_asignacion,
      prioridad: query.prioridad,
      fecha_desde: query.fecha_desde,
      fecha_hasta: query.fecha_hasta,
      search: query.search,
      sort: query.sort,
      order: query.order,
      limit: query.limit,
      offset: offset
    };

    // Filtrar por usuario si no es admin
    if (!req.user.esAdmin) {
      if (req.user.rol === 'tecnico') {
        filtros.tecnico_id = req.user.id;
      } else if (req.user.rol === 'cliente') {
        filtros.cliente_id = req.user.cliente_id; // Asumiendo relación usuario-cliente
      }
    }

    const asignaciones = await Asignacion.findAll(filtros);
    
    const hasMore = asignaciones.length === query.limit;

    sendSuccess(res, {
      asignaciones: asignaciones.map(asignacion => asignacion.toJSON()),
      pagination: {
        page: query.page,
        limit: query.limit,
        hasMore,
        total: asignaciones.length
      },
      filtros: {
        tecnico_id: query.tecnico_id,
        cliente_id: query.cliente_id,
        estado: query.estado,
        tipo_asignacion: query.tipo_asignacion,
        prioridad: query.prioridad,
        search: query.search
      }
    }, 'Asignaciones obtenidas exitosamente');
  })
);

// GET /api/asignaciones/active - Obtener asignaciones activas
router.get('/active',
  authenticateToken,
  asyncHandler(async (req, res) => {
    let asignacionesActivas;
    
    if (req.user.esAdmin) {
      asignacionesActivas = await Asignacion.findActive();
    } else if (req.user.rol === 'tecnico') {
      asignacionesActivas = await Asignacion.findByTecnico(req.user.id, { estado: 'activa' });
    } else {
      asignacionesActivas = await Asignacion.findByCliente(req.user.cliente_id, { estado: 'activa' });
    }

    sendSuccess(res, {
      asignaciones: asignacionesActivas.map(asignacion => asignacion.toJSON())
    }, 'Asignaciones activas obtenidas exitosamente');
  })
);

// GET /api/asignaciones/stats - Estadísticas de asignaciones (solo admin)
router.get('/stats',
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const stats = await Asignacion.getStats();

    sendSuccess(res, {
      stats
    }, 'Estadísticas de asignaciones obtenidas exitosamente');
  })
);

// GET /api/asignaciones/:id - Obtener asignación específica
router.get('/:id',
  authenticateToken,
  validateRequest(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const asignacion = await Asignacion.findById(req.params.id);
    
    if (!asignacion) {
      throw new NotFoundError('Asignación');
    }

    // Verificar permisos de acceso
    if (!req.user.esAdmin) {
      if (req.user.rol === 'tecnico' && asignacion.tecnico_id !== req.user.id) {
        throw new AppError('No tiene permisos para ver esta asignación', 403);
      }
      if (req.user.rol === 'cliente' && asignacion.cliente_id !== req.user.cliente_id) {
        throw new AppError('No tiene permisos para ver esta asignación', 403);
      }
    }

    sendSuccess(res, {
      asignacion: asignacion.toJSON()
    }, 'Asignación obtenida exitosamente');
  })
);

// ============================================
// RUTAS PROTEGIDAS (requieren admin)
// ============================================

// POST /api/asignaciones - Crear nueva asignación
router.post('/',
  authenticateToken,
  requireAdmin,
  validateRequest(createAsignacionSchema),
  asyncHandler(async (req, res) => {
    try {
      const asignacion = await Asignacion.create(req.body, req.user.id);

      sendSuccess(res, {
        asignacion: asignacion.toJSON()
      }, 'Asignación creada exitosamente', 201);
    } catch (error) {
      if (error.message.includes('no encontrado') || error.message.includes('no tiene')) {
        throw new BusinessLogicError(error.message);
      }
      if (error.message.includes('no disponible')) {
        throw new ValidationError(error.message);
      }
      throw error;
    }
  })
);

// PUT /api/asignaciones/:id - Actualizar asignación
router.put('/:id',
  authenticateToken,
  requireAdmin,
  validateRequest(idParamSchema, 'params'),
  validateRequest(updateAsignacionSchema),
  asyncHandler(async (req, res) => {
    const asignacion = await Asignacion.findById(req.params.id);
    
    if (!asignacion) {
      throw new NotFoundError('Asignación');
    }

    await asignacion.update(req.body);

    sendSuccess(res, {
      asignacion: asignacion.toJSON()
    }, 'Asignación actualizada exitosamente');
  })
);

// PATCH /api/asignaciones/:id/status - Cambiar estado de la asignación
router.patch('/:id/status',
  authenticateToken,
  validateRequest(idParamSchema, 'params'),
  validateRequest(changeStatusSchema),
  asyncHandler(async (req, res) => {
    const asignacion = await Asignacion.findById(req.params.id);
    
    if (!asignacion) {
      throw new NotFoundError('Asignación');
    }

    // Verificar permisos: admin o técnico asignado
    if (!req.user.esAdmin && req.user.id !== asignacion.tecnico_id) {
      throw new AppError('No tiene permisos para cambiar el estado de esta asignación', 403);
    }

    await asignacion.changeStatus(req.body.estado, req.user.id);

    // Agregar observaciones si se proporcionan
    if (req.body.observaciones) {
      await asignacion.update({ observaciones: req.body.observaciones });
    }

    sendSuccess(res, {
      asignacion: asignacion.toJSON()
    }, 'Estado de la asignación actualizado exitosamente');
  })
);

// ============================================
// RUTAS DE ASIGNACIONES POR TÉCNICO
// ============================================

// GET /api/asignaciones/tecnico/:tecnicoId - Obtener asignaciones de un técnico
router.get('/tecnico/:tecnicoId',
  authenticateToken,
  validateRequest(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const tecnicoId = parseInt(req.params.tecnicoId);

    // Verificar permisos: admin o el propio técnico
    if (!req.user.esAdmin && req.user.id !== tecnicoId) {
      throw new AppError('No tiene permisos para ver las asignaciones de este técnico', 403);
    }

    const filtros = {
      estado: req.query.estado,
      tipo_asignacion: req.query.tipo_asignacion,
      prioridad: req.query.prioridad,
      limit: req.query.limit,
      offset: req.query.offset
    };

    const asignaciones = await Asignacion.findByTecnico(tecnicoId, filtros);

    sendSuccess(res, {
      asignaciones: asignaciones.map(asignacion => asignacion.toJSON()),
      tecnico_id: tecnicoId
    }, 'Asignaciones del técnico obtenidas exitosamente');
  })
);

// ============================================
// RUTAS DE ASIGNACIONES POR CLIENTE
// ============================================

// GET /api/asignaciones/cliente/:clienteId - Obtener asignaciones de un cliente
router.get('/cliente/:clienteId',
  authenticateToken,
  validateRequest(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const clienteId = parseInt(req.params.clienteId);

    // Verificar permisos: admin o el propio cliente
    if (!req.user.esAdmin && req.user.cliente_id !== clienteId) {
      throw new AppError('No tiene permisos para ver las asignaciones de este cliente', 403);
    }

    const filtros = {
      estado: req.query.estado,
      tipo_asignacion: req.query.tipo_asignacion,
      prioridad: req.query.prioridad,
      limit: req.query.limit,
      offset: req.query.offset
    };

    const asignaciones = await Asignacion.findByCliente(clienteId, filtros);

    sendSuccess(res, {
      asignaciones: asignaciones.map(asignacion => asignacion.toJSON()),
      cliente_id: clienteId
    }, 'Asignaciones del cliente obtenidas exitosamente');
  })
);

// ============================================
// RUTAS DE VALIDACIÓN Y HERRAMIENTAS
// ============================================

// POST /api/asignaciones/check-disponibilidad - Verificar disponibilidad de técnico
router.post('/check-disponibilidad',
  authenticateToken,
  requireAdmin,
  validateRequest(checkDisponibilidadSchema),
  asyncHandler(async (req, res) => {
    const { tecnico_id, fecha_inicio, fecha_fin, asignacion_id } = req.body;

    const disponibilidad = await Asignacion.checkTecnicoDisponibilidad(
      tecnico_id, 
      fecha_inicio, 
      fecha_fin
    );

    sendSuccess(res, {
      tecnico_id,
      fecha_inicio,
      fecha_fin,
      disponible: disponibilidad.available,
      razon: disponibilidad.reason,
      asignacion_excluida: asignacion_id
    }, 'Verificación de disponibilidad completada');
  })
);

// POST /api/asignaciones/check-competencias - Verificar competencias de técnico
router.post('/check-competencias',
  authenticateToken,
  validateRequest(checkCompetenciasSchema),
  asyncHandler(async (req, res) => {
    const { tecnico_id, competencias_requeridas } = req.body;

    const validacion = await Asignacion.validateCompetencias(
      tecnico_id, 
      competencias_requeridas
    );

    sendSuccess(res, {
      tecnico_id,
      competencias_requeridas,
      valido: validacion.valid,
      competencias_faltantes: validacion.missing,
      competencias_disponibles: validacion.available
    }, 'Verificación de competencias completada');
  })
);

// POST /api/asignaciones/auto-assign - Asignación automática de técnico
router.post('/auto-assign',
  authenticateToken,
  requireAdmin,
  validateRequest(autoAssignSchema),
  asyncHandler(async (req, res) => {
    const {
      cliente_id,
      proyecto_id,
      competencias_requeridas,
      fecha_inicio,
      fecha_fin_estimada,
      horas_estimadas,
      prioridad,
      criterio_seleccion
    } = req.body;

    // Buscar técnicos disponibles con las competencias requeridas
    const candidatos = await findTecnicosCandidatos({
      competencias_requeridas,
      fecha_inicio,
      fecha_fin_estimada,
      criterio_seleccion
    });

    if (candidatos.length === 0) {
      throw new BusinessLogicError('No se encontraron técnicos disponibles con las competencias requeridas');
    }

    // Seleccionar el mejor candidato según el criterio
    const tecnicoSeleccionado = seleccionarMejorCandidato(candidatos, criterio_seleccion);

    // Crear la asignación automáticamente
    const asignacionData = {
      tecnico_id: tecnicoSeleccionado.id,
      cliente_id,
      proyecto_id,
      tipo_asignacion: 'proyecto',
      fecha_inicio,
      fecha_fin_estimada,
      horas_estimadas,
      prioridad,
      competencias_requeridas,
      descripcion: `Asignación automática - Cliente ID: ${cliente_id}`,
      metadatos: {
        asignacion_automatica: true,
        criterio_seleccion,
        candidatos_evaluados: candidatos.length
      }
    };

    const asignacion = await Asignacion.create(asignacionData, req.user.id);

    sendSuccess(res, {
      asignacion: asignacion.toJSON(),
      tecnico_seleccionado: {
        id: tecnicoSeleccionado.id,
        nombre: tecnicoSeleccionado.nombre,
        puntuacion: tecnicoSeleccionado.puntuacion
      },
      candidatos_evaluados: candidatos.length,
      criterio_usado: criterio_seleccion
    }, 'Asignación automática creada exitosamente', 201);
  })
);

// ============================================
// RUTAS DE PROGRESO Y REPORTES
// ============================================

// POST /api/asignaciones/:id/progress - Reportar progreso de asignación
router.post('/:id/progress',
  authenticateToken,
  validateRequest(idParamSchema, 'params'),
  validateRequest(reportProgressSchema),
  asyncHandler(async (req, res) => {
    const asignacion = await Asignacion.findById(req.params.id);
    
    if (!asignacion) {
      throw new NotFoundError('Asignación');
    }

    // Verificar permisos: admin o técnico asignado
    if (!req.user.esAdmin && req.user.id !== asignacion.tecnico_id) {
      throw new AppError('No tiene permisos para reportar progreso en esta asignación', 403);
    }

    const { porcentaje_avance, horas_trabajadas, observaciones } = req.body;

    await asignacion.update({
      porcentaje_avance,
      horas_trabajadas: horas_trabajadas || asignacion.horas_trabajadas,
      observaciones: observaciones || asignacion.observaciones
    });

    // Auto-completar si llega al 100%
    if (porcentaje_avance === 100 && asignacion.estado === 'activa') {
      await asignacion.changeStatus('completada', req.user.id);
    }

    sendSuccess(res, {
      asignacion: asignacion.toJSON()
    }, 'Progreso de asignación actualizado exitosamente');
  })
);

// GET /api/asignaciones/:id/progress - Obtener progreso calculado automáticamente
router.get('/:id/progress',
  authenticateToken,
  validateRequest(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const asignacion = await Asignacion.findById(req.params.id);
    
    if (!asignacion) {
      throw new NotFoundError('Asignación');
    }

    // Verificar permisos de acceso
    if (!req.user.esAdmin) {
      if (req.user.rol === 'tecnico' && asignacion.tecnico_id !== req.user.id) {
        throw new AppError('No tiene permisos para ver el progreso de esta asignación', 403);
      }
      if (req.user.rol === 'cliente' && asignacion.cliente_id !== req.user.cliente_id) {
        throw new AppError('No tiene permisos para ver el progreso de esta asignación', 403);
      }
    }

    const progreso = await asignacion.calculateProgress();

    sendSuccess(res, {
      asignacion_id: asignacion.id,
      progreso_calculado: progreso,
      progreso_manual: {
        porcentaje_avance: asignacion.porcentaje_avance,
        horas_trabajadas: asignacion.horas_trabajadas
      }
    }, 'Progreso de asignación calculado exitosamente');
  })
);

// ============================================
// RUTAS DE BÚSQUEDA AVANZADA
// ============================================

// GET /api/asignaciones/search/advanced - Búsqueda avanzada de asignaciones
router.get('/search/advanced',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const {
      tecnico_nombre,
      cliente_nombre,
      proyecto_nombre,
      fecha_inicio_desde,
      fecha_inicio_hasta,
      horas_min,
      horas_max,
      porcentaje_min,
      porcentaje_max,
      competencia
    } = req.query;

    // Construir filtros básicos
    const filtros = {};
    
    if (req.query.estado) filtros.estado = req.query.estado;
    if (req.query.prioridad) filtros.prioridad = req.query.prioridad;
    if (req.query.tipo_asignacion) filtros.tipo_asignacion = req.query.tipo_asignacion;

    let asignaciones = await Asignacion.findAll(filtros);

    // Aplicar filtros avanzados (simulado - en producción sería en la query)
    if (tecnico_nombre) {
      asignaciones = asignaciones.filter(a => 
        a.tecnico_nombre?.toLowerCase().includes(tecnico_nombre.toLowerCase()) ||
        a.tecnico_apellido?.toLowerCase().includes(tecnico_nombre.toLowerCase())
      );
    }

    if (cliente_nombre) {
      asignaciones = asignaciones.filter(a => 
        a.cliente_razon_social?.toLowerCase().includes(cliente_nombre.toLowerCase())
      );
    }

    if (proyecto_nombre) {
      asignaciones = asignaciones.filter(a => 
        a.proyecto_nombre?.toLowerCase().includes(proyecto_nombre.toLowerCase())
      );
    }

    if (horas_min || horas_max) {
      asignaciones = asignaciones.filter(a => {
        const horas = a.horas_estimadas || 0;
        return (!horas_min || horas >= horas_min) && (!horas_max || horas <= horas_max);
      });
    }

    if (porcentaje_min || porcentaje_max) {
      asignaciones = asignaciones.filter(a => {
        const porcentaje = a.porcentaje_avance || 0;
        return (!porcentaje_min || porcentaje >= porcentaje_min) && 
               (!porcentaje_max || porcentaje <= porcentaje_max);
      });
    }

    sendSuccess(res, {
      asignaciones: asignaciones.map(asignacion => asignacion.toJSON()),
      total: asignaciones.length,
      criterios_busqueda: {
        tecnico_nombre,
        cliente_nombre,
        proyecto_nombre,
        fecha_inicio_desde,
        fecha_inicio_hasta,
        horas_min,
        horas_max,
        porcentaje_min,
        porcentaje_max,
        competencia
      }
    }, 'Búsqueda avanzada completada exitosamente');
  })
);

// ============================================
// FUNCIONES AUXILIARES
// ============================================

// Función para encontrar técnicos candidatos
async function findTecnicosCandidatos(criterios) {
  const { competencias_requeridas, fecha_inicio, fecha_fin_estimada, criterio_seleccion } = criterios;
  
  // Esta sería una implementación más compleja en producción
  // Por simplicidad, simulamos la búsqueda
  const candidatos = [];
  
  // Aquí iría la lógica para:
  // 1. Buscar técnicos con las competencias requeridas
  // 2. Verificar disponibilidad en el período
  // 3. Calcular puntuación según criterio de selección
  
  return candidatos;
}

// Función para seleccionar el mejor candidato
function seleccionarMejorCandidato(candidatos, criterio) {
  if (candidatos.length === 0) return null;
  
  // Ordenar candidatos según el criterio
  switch (criterio) {
    case 'disponibilidad':
      return candidatos.sort((a, b) => a.carga_trabajo - b.carga_trabajo)[0];
    case 'competencias':
      return candidatos.sort((a, b) => b.competencias_match - a.competencias_match)[0];
    case 'experiencia':
      return candidatos.sort((a, b) => b.años_experiencia - a.años_experiencia)[0];
    case 'carga_trabajo':
      return candidatos.sort((a, b) => a.asignaciones_activas - b.asignaciones_activas)[0];
    default:
      return candidatos[0];
  }
}

module.exports = router;
