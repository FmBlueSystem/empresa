const Joi = require('joi');

// =============================================
// ESQUEMAS DE VALIDACIÓN PARA VALIDACIONES
// =============================================

/**
 * Esquema para crear nueva validación
 */
const createValidacionSchema = Joi.object({
  actividad_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID de actividad debe ser un número',
      'number.integer': 'El ID de actividad debe ser un número entero',
      'number.positive': 'El ID de actividad debe ser positivo',
      'any.required': 'El ID de actividad es requerido'
    }),

  validador_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID del validador debe ser un número',
      'number.integer': 'El ID del validador debe ser un número entero',
      'number.positive': 'El ID del validador debe ser positivo',
      'any.required': 'El ID del validador es requerido'
    }),

  tecnico_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID del técnico debe ser un número',
      'number.integer': 'El ID del técnico debe ser un número entero',
      'number.positive': 'El ID del técnico debe ser positivo',
      'any.required': 'El ID del técnico es requerido'
    }),

  cliente_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID del cliente debe ser un número',
      'number.integer': 'El ID del cliente debe ser un número entero',
      'number.positive': 'El ID del cliente debe ser positivo',
      'any.required': 'El ID del cliente es requerido'
    }),

  estado: Joi.string()
    .valid('pendiente_revision', 'en_revision', 'validada', 'rechazada', 'escalada', 'reabierta')
    .default('pendiente_revision')
    .messages({
      'string.base': 'El estado debe ser texto',
      'any.only': 'El estado debe ser: pendiente_revision, en_revision, validada, rechazada, escalada, reabierta'
    }),

  dias_plazo: Joi.number()
    .integer()
    .min(1)
    .max(30)
    .default(3)
    .messages({
      'number.base': 'Los días de plazo deben ser un número',
      'number.integer': 'Los días de plazo deben ser un número entero',
      'number.min': 'El plazo mínimo es 1 día',
      'number.max': 'El plazo máximo es 30 días'
    }),

  comentario_principal: Joi.string()
    .trim()
    .max(2000)
    .allow('')
    .default('')
    .messages({
      'string.base': 'El comentario debe ser texto',
      'string.max': 'El comentario no puede exceder 2000 caracteres'
    }),

  aspectos_positivos: Joi.array()
    .items(Joi.string().trim().min(1).max(200))
    .max(10)
    .default([])
    .messages({
      'array.base': 'Los aspectos positivos deben ser una lista',
      'array.max': 'No puede haber más de 10 aspectos positivos',
      'string.min': 'Cada aspecto debe tener al menos 1 caracter',
      'string.max': 'Cada aspecto no puede exceder 200 caracteres'
    }),

  aspectos_mejora: Joi.array()
    .items(Joi.string().trim().min(1).max(200))
    .max(10)
    .default([])
    .messages({
      'array.base': 'Los aspectos de mejora deben ser una lista',
      'array.max': 'No puede haber más de 10 aspectos de mejora',
      'string.min': 'Cada aspecto debe tener al menos 1 caracter',
      'string.max': 'Cada aspecto no puede exceder 200 caracteres'
    }),

  requerimientos_cambios: Joi.array()
    .items(Joi.object({
      descripcion: Joi.string().trim().min(5).max(500).required(),
      prioridad: Joi.string().valid('baja', 'media', 'alta', 'critica').default('media'),
      plazo_estimado: Joi.string().trim().max(100).optional()
    }))
    .max(15)
    .default([])
    .messages({
      'array.base': 'Los requerimientos de cambios deben ser una lista',
      'array.max': 'No puede haber más de 15 requerimientos'
    }),

  impacto_negocio: Joi.string()
    .valid('bajo', 'medio', 'alto', 'critico')
    .optional()
    .messages({
      'string.base': 'El impacto de negocio debe ser texto',
      'any.only': 'El impacto debe ser: bajo, medio, alto, critico'
    }),

  complejidad_revision: Joi.string()
    .valid('simple', 'moderada', 'compleja', 'muy_compleja')
    .default('moderada')
    .messages({
      'string.base': 'La complejidad debe ser texto',
      'any.only': 'La complejidad debe ser: simple, moderada, compleja, muy_compleja'
    })
}).messages({
  'object.unknown': 'El campo {#label} no está permitido'
});

/**
 * Esquema para actualizar validación
 */
const updateValidacionSchema = Joi.object({
  estado: Joi.string()
    .valid('pendiente_revision', 'en_revision', 'validada', 'rechazada', 'escalada', 'reabierta')
    .optional()
    .messages({
      'string.base': 'El estado debe ser texto',
      'any.only': 'El estado debe ser válido'
    }),

  puntuacion_general: Joi.number()
    .min(1.0)
    .max(10.0)
    .precision(1)
    .optional()
    .messages({
      'number.base': 'La puntuación debe ser un número',
      'number.min': 'La puntuación mínima es 1.0',
      'number.max': 'La puntuación máxima es 10.0',
      'number.precision': 'La puntuación puede tener máximo 1 decimal'
    }),

  criterios_calidad: Joi.object({
    funcionalidad: Joi.number().min(1).max(10).optional(),
    codigo_calidad: Joi.number().min(1).max(10).optional(),
    documentacion: Joi.number().min(1).max(10).optional(),
    usabilidad: Joi.number().min(1).max(10).optional(),
    rendimiento: Joi.number().min(1).max(10).optional(),
    seguridad: Joi.number().min(1).max(10).optional()
  }).optional()
    .messages({
      'object.base': 'Los criterios de calidad deben ser un objeto',
      'number.min': 'Cada criterio debe ser mínimo 1',
      'number.max': 'Cada criterio debe ser máximo 10'
    }),

  dias_plazo: Joi.number()
    .integer()
    .min(1)
    .max(30)
    .optional()
    .messages({
      'number.base': 'Los días de plazo deben ser un número',
      'number.integer': 'Los días de plazo deben ser un número entero',
      'number.min': 'El plazo mínimo es 1 día',
      'number.max': 'El plazo máximo es 30 días'
    }),

  comentario_principal: Joi.string()
    .trim()
    .max(2000)
    .allow('')
    .optional()
    .messages({
      'string.base': 'El comentario debe ser texto',
      'string.max': 'El comentario no puede exceder 2000 caracteres'
    }),

  aspectos_positivos: Joi.array()
    .items(Joi.string().trim().min(1).max(200))
    .max(10)
    .optional()
    .messages({
      'array.base': 'Los aspectos positivos deben ser una lista',
      'array.max': 'No puede haber más de 10 aspectos positivos'
    }),

  aspectos_mejora: Joi.array()
    .items(Joi.string().trim().min(1).max(200))
    .max(10)
    .optional()
    .messages({
      'array.base': 'Los aspectos de mejora deben ser una lista',
      'array.max': 'No puede haber más de 10 aspectos de mejora'
    }),

  requerimientos_cambios: Joi.array()
    .items(Joi.object({
      descripcion: Joi.string().trim().min(5).max(500).required(),
      prioridad: Joi.string().valid('baja', 'media', 'alta', 'critica').default('media'),
      plazo_estimado: Joi.string().trim().max(100).optional()
    }))
    .max(15)
    .optional()
    .messages({
      'array.base': 'Los requerimientos de cambios deben ser una lista',
      'array.max': 'No puede haber más de 15 requerimientos'
    }),

  impacto_negocio: Joi.string()
    .valid('bajo', 'medio', 'alto', 'critico')
    .optional()
    .messages({
      'string.base': 'El impacto de negocio debe ser texto',
      'any.only': 'El impacto debe ser: bajo, medio, alto, critico'
    }),

  complejidad_revision: Joi.string()
    .valid('simple', 'moderada', 'compleja', 'muy_compleja')
    .optional()
    .messages({
      'string.base': 'La complejidad debe ser texto',
      'any.only': 'La complejidad debe ser válida'
    }),

  satisfaccion_cliente: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .optional()
    .messages({
      'number.base': 'La satisfacción debe ser un número',
      'number.integer': 'La satisfacción debe ser un número entero',
      'number.min': 'La satisfacción mínima es 1',
      'number.max': 'La satisfacción máxima es 5'
    }),

  supervisor_escalado_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.base': 'El ID del supervisor debe ser un número',
      'number.integer': 'El ID del supervisor debe ser un número entero',
      'number.positive': 'El ID del supervisor debe ser positivo'
    })
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar',
  'object.unknown': 'El campo {#label} no está permitido'
});

/**
 * Esquema para validar (aprobar) actividad
 */
const validarActividadSchema = Joi.object({
  puntuacion_general: Joi.number()
    .min(1.0)
    .max(10.0)
    .precision(1)
    .required()
    .messages({
      'number.base': 'La puntuación debe ser un número',
      'number.min': 'La puntuación mínima es 1.0',
      'number.max': 'La puntuación máxima es 10.0',
      'number.precision': 'La puntuación puede tener máximo 1 decimal',
      'any.required': 'La puntuación general es requerida'
    }),

  criterios_calidad: Joi.object({
    funcionalidad: Joi.number().min(1).max(10).required(),
    codigo_calidad: Joi.number().min(1).max(10).optional(),
    documentacion: Joi.number().min(1).max(10).optional(),
    usabilidad: Joi.number().min(1).max(10).optional(),
    rendimiento: Joi.number().min(1).max(10).optional(),
    seguridad: Joi.number().min(1).max(10).optional()
  }).required()
    .messages({
      'object.base': 'Los criterios de calidad deben ser un objeto',
      'any.required': 'Los criterios de calidad son requeridos',
      'number.min': 'Cada criterio debe ser mínimo 1',
      'number.max': 'Cada criterio debe ser máximo 10'
    }),

  comentario_principal: Joi.string()
    .trim()
    .min(10)
    .max(2000)
    .required()
    .messages({
      'string.base': 'El comentario debe ser texto',
      'string.empty': 'El comentario no puede estar vacío',
      'string.min': 'El comentario debe tener al menos 10 caracteres',
      'string.max': 'El comentario no puede exceder 2000 caracteres',
      'any.required': 'El comentario principal es requerido'
    }),

  aspectos_positivos: Joi.array()
    .items(Joi.string().trim().min(1).max(200))
    .min(1)
    .max(10)
    .required()
    .messages({
      'array.base': 'Los aspectos positivos deben ser una lista',
      'array.min': 'Debe mencionar al menos 1 aspecto positivo',
      'array.max': 'No puede haber más de 10 aspectos positivos',
      'any.required': 'Los aspectos positivos son requeridos'
    }),

  satisfaccion_cliente: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      'number.base': 'La satisfacción debe ser un número',
      'number.integer': 'La satisfacción debe ser un número entero',
      'number.min': 'La satisfacción mínima es 1',
      'number.max': 'La satisfacción máxima es 5',
      'any.required': 'La satisfacción del cliente es requerida'
    }),

  recomendaciones_futuras: Joi.array()
    .items(Joi.string().trim().min(5).max(200))
    .max(5)
    .default([])
    .messages({
      'array.base': 'Las recomendaciones deben ser una lista',
      'array.max': 'No puede haber más de 5 recomendaciones',
      'string.min': 'Cada recomendación debe tener al menos 5 caracteres',
      'string.max': 'Cada recomendación no puede exceder 200 caracteres'
    })
}).messages({
  'object.unknown': 'El campo {#label} no está permitido'
});

/**
 * Esquema para rechazar actividad
 */
const rechazarActividadSchema = Joi.object({
  comentario_principal: Joi.string()
    .trim()
    .min(20)
    .max(2000)
    .required()
    .messages({
      'string.base': 'El comentario debe ser texto',
      'string.empty': 'El comentario no puede estar vacío',
      'string.min': 'El comentario debe tener al menos 20 caracteres',
      'string.max': 'El comentario no puede exceder 2000 caracteres',
      'any.required': 'El comentario de rechazo es requerido'
    }),

  aspectos_mejora: Joi.array()
    .items(Joi.string().trim().min(5).max(200))
    .min(1)
    .max(10)
    .required()
    .messages({
      'array.base': 'Los aspectos de mejora deben ser una lista',
      'array.min': 'Debe mencionar al menos 1 aspecto de mejora',
      'array.max': 'No puede haber más de 10 aspectos de mejora',
      'any.required': 'Los aspectos de mejora son requeridos'
    }),

  requerimientos_cambios: Joi.array()
    .items(Joi.object({
      descripcion: Joi.string().trim().min(10).max(500).required(),
      prioridad: Joi.string().valid('baja', 'media', 'alta', 'critica').required(),
      plazo_estimado: Joi.string().trim().max(100).optional()
    }))
    .min(1)
    .max(15)
    .required()
    .messages({
      'array.base': 'Los requerimientos de cambios deben ser una lista',
      'array.min': 'Debe especificar al menos 1 requerimiento de cambio',
      'array.max': 'No puede haber más de 15 requerimientos',
      'any.required': 'Los requerimientos de cambios son requeridos'
    }),

  impacto_negocio: Joi.string()
    .valid('bajo', 'medio', 'alto', 'critico')
    .required()
    .messages({
      'string.base': 'El impacto de negocio debe ser texto',
      'any.only': 'El impacto debe ser: bajo, medio, alto, critico',
      'any.required': 'El impacto de negocio es requerido'
    }),

  satisfaccion_cliente: Joi.number()
    .integer()
    .min(1)
    .max(3)
    .required()
    .messages({
      'number.base': 'La satisfacción debe ser un número',
      'number.integer': 'La satisfacción debe ser un número entero',
      'number.min': 'La satisfacción mínima es 1',
      'number.max': 'La satisfacción máxima para rechazo es 3',
      'any.required': 'La satisfacción del cliente es requerida'
    }),

  fecha_limite_correccion: Joi.date()
    .iso()
    .greater('now')
    .optional()
    .messages({
      'date.base': 'La fecha límite debe ser una fecha válida',
      'date.format': 'La fecha límite debe estar en formato ISO',
      'date.greater': 'La fecha límite debe ser futura'
    })
}).messages({
  'object.unknown': 'El campo {#label} no está permitido'
});

/**
 * Esquema para escalar validación
 */
const escalarValidacionSchema = Joi.object({
  supervisor_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID del supervisor debe ser un número',
      'number.integer': 'El ID del supervisor debe ser un número entero',
      'number.positive': 'El ID del supervisor debe ser positivo',
      'any.required': 'El ID del supervisor es requerido'
    }),

  razon_escalamiento: Joi.string()
    .trim()
    .min(10)
    .max(500)
    .required()
    .messages({
      'string.base': 'La razón debe ser texto',
      'string.empty': 'La razón no puede estar vacía',
      'string.min': 'La razón debe tener al menos 10 caracteres',
      'string.max': 'La razón no puede exceder 500 caracteres',
      'any.required': 'La razón de escalamiento es requerida'
    }),

  urgencia: Joi.string()
    .valid('normal', 'alta', 'critica')
    .default('normal')
    .messages({
      'string.base': 'La urgencia debe ser texto',
      'any.only': 'La urgencia debe ser: normal, alta, critica'
    }),

  dias_adicionales: Joi.number()
    .integer()
    .min(1)
    .max(7)
    .default(2)
    .messages({
      'number.base': 'Los días adicionales deben ser un número',
      'number.integer': 'Los días adicionales deben ser un número entero',
      'number.min': 'Mínimo 1 día adicional',
      'number.max': 'Máximo 7 días adicionales'
    })
}).messages({
  'object.unknown': 'El campo {#label} no está permitido'
});

/**
 * Esquema para reabrir validación
 */
const reabrirValidacionSchema = Joi.object({
  motivo_reapertura: Joi.string()
    .trim()
    .min(10)
    .max(500)
    .required()
    .messages({
      'string.base': 'El motivo debe ser texto',
      'string.empty': 'El motivo no puede estar vacío',
      'string.min': 'El motivo debe tener al menos 10 caracteres',
      'string.max': 'El motivo no puede exceder 500 caracteres',
      'any.required': 'El motivo de reapertura es requerido'
    }),

  nuevo_validador_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.base': 'El ID del nuevo validador debe ser un número',
      'number.integer': 'El ID del nuevo validador debe ser un número entero',
      'number.positive': 'El ID del nuevo validador debe ser positivo'
    }),

  dias_plazo: Joi.number()
    .integer()
    .min(1)
    .max(30)
    .default(3)
    .messages({
      'number.base': 'Los días de plazo deben ser un número',
      'number.integer': 'Los días de plazo deben ser un número entero',
      'number.min': 'El plazo mínimo es 1 día',
      'number.max': 'El plazo máximo es 30 días'
    })
}).messages({
  'object.unknown': 'El campo {#label} no está permitido'
});

/**
 * Esquema para crear comentario en validación
 */
const commentSchema = Joi.object({
  comentario: Joi.string()
    .trim()
    .min(5)
    .max(2000)
    .required()
    .messages({
      'string.base': 'El comentario debe ser texto',
      'string.empty': 'El comentario no puede estar vacío',
      'string.min': 'El comentario debe tener al menos 5 caracteres',
      'string.max': 'El comentario no puede exceder 2000 caracteres',
      'any.required': 'El comentario es requerido'
    }),

  tipo_comentario: Joi.string()
    .valid('general', 'pregunta', 'sugerencia', 'correccion', 'aprobacion')
    .default('general')
    .messages({
      'string.base': 'El tipo de comentario debe ser texto',
      'any.only': 'El tipo debe ser: general, pregunta, sugerencia, correccion, aprobacion'
    }),

  parent_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.base': 'El ID del comentario padre debe ser un número',
      'number.integer': 'El ID del comentario padre debe ser un número entero',
      'number.positive': 'El ID del comentario padre debe ser positivo'
    })
}).messages({
  'object.unknown': 'El campo {#label} no está permitido'
});

/**
 * Esquema para filtros de búsqueda avanzada de validaciones
 */
const queryFiltersSchema = Joi.object({
  // Filtros de entidad
  actividad_id: Joi.number()
    .integer()
    .positive()
    .optional(),

  validador_id: Joi.number()
    .integer()
    .positive()
    .optional(),

  tecnico_id: Joi.number()
    .integer()
    .positive()
    .optional(),

  cliente_id: Joi.number()
    .integer()
    .positive()
    .optional(),

  // Filtros de estado
  estado: Joi.alternatives()
    .try(
      Joi.string().valid('pendiente_revision', 'en_revision', 'validada', 'rechazada', 'escalada', 'reabierta'),
      Joi.array().items(Joi.string().valid('pendiente_revision', 'en_revision', 'validada', 'rechazada', 'escalada', 'reabierta')).min(1).max(6)
    )
    .optional(),

  // Filtros de fecha
  fecha_desde: Joi.date()
    .iso()
    .optional(),

  fecha_hasta: Joi.date()
    .iso()
    .optional()
    .greater(Joi.ref('fecha_desde')),

  // Filtros especiales
  proximas_vencer: Joi.boolean()
    .optional(),

  vencidas: Joi.boolean()
    .optional(),

  escaladas: Joi.boolean()
    .optional(),

  // Filtros de calidad
  puntuacion_min: Joi.number()
    .min(1.0)
    .max(10.0)
    .optional(),

  puntuacion_max: Joi.number()
    .min(1.0)
    .max(10.0)
    .optional()
    .greater(Joi.ref('puntuacion_min')),

  satisfaccion_min: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .optional(),

  satisfaccion_max: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .optional()
    .greater(Joi.ref('satisfaccion_min')),

  // Búsqueda textual
  search: Joi.string()
    .trim()
    .min(3)
    .max(200)
    .optional(),

  // Ordenamiento
  orden: Joi.string()
    .valid('fecha_asignacion', 'fecha_limite', 'estado', 'puntuacion_general', 'creado_en')
    .default('fecha_asignacion'),

  direccion: Joi.string()
    .valid('ASC', 'DESC', 'asc', 'desc')
    .default('DESC'),

  // Paginación
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20),

  offset: Joi.number()
    .integer()
    .min(0)
    .default(0),

  page: Joi.number()
    .integer()
    .min(1)
    .optional()
}).messages({
  'object.unknown': 'El parámetro {#label} no está permitido'
});

/**
 * Esquema para reportes de validación
 */
const reporteSchema = Joi.object({
  tipo_reporte: Joi.string()
    .valid('calidad', 'tendencias', 'productividad', 'dashboard')
    .required()
    .messages({
      'string.base': 'El tipo de reporte debe ser texto',
      'any.only': 'El tipo debe ser: calidad, tendencias, productividad, dashboard',
      'any.required': 'El tipo de reporte es requerido'
    }),

  periodo: Joi.number()
    .integer()
    .min(7)
    .max(365)
    .default(30)
    .messages({
      'number.base': 'El periodo debe ser un número',
      'number.integer': 'El periodo debe ser un número entero',
      'number.min': 'El periodo mínimo es 7 días',
      'number.max': 'El periodo máximo es 365 días'
    }),

  tecnico_id: Joi.number()
    .integer()
    .positive()
    .when('tipo_reporte', {
      is: 'productividad',
      then: Joi.optional(),
      otherwise: Joi.forbidden()
    }),

  cliente_id: Joi.number()
    .integer()
    .positive()
    .optional(),

  fecha_inicio: Joi.date()
    .iso()
    .optional(),

  fecha_fin: Joi.date()
    .iso()
    .optional()
    .greater(Joi.ref('fecha_inicio')),

  detallado: Joi.boolean()
    .default(false),

  incluir_comentarios: Joi.boolean()
    .default(false),

  formato: Joi.string()
    .valid('json', 'csv', 'pdf')
    .default('json')
}).messages({
  'object.unknown': 'El campo {#label} no está permitido'
});

/**
 * Esquema para validación de parámetros ID
 */
const idParamSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID debe ser un número',
      'number.integer': 'El ID debe ser un número entero',
      'number.positive': 'El ID debe ser positivo',
      'any.required': 'El ID es requerido'
    })
}).messages({
  'object.unknown': 'El parámetro {#label} no está permitido'
});

// =============================================
// FUNCIONES DE VALIDACIÓN (MIDDLEWARES)
// =============================================

/**
 * Middleware para validar creación de validación
 */
const validateCreateValidacion = (req, res, next) => {
  const { error, value } = createValidacionSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errores = error.details.map(detail => ({
      campo: detail.path.join('.'),
      mensaje: detail.message
    }));

    return res.status(400).json({
      error: 'Datos de validación inválidos',
      detalles: errores
    });
  }

  req.body = value;
  next();
};

/**
 * Middleware para validar actualización de validación
 */
const validateUpdateValidacion = (req, res, next) => {
  const { error, value } = updateValidacionSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errores = error.details.map(detail => ({
      campo: detail.path.join('.'),
      mensaje: detail.message
    }));

    return res.status(400).json({
      error: 'Datos de actualización inválidos',
      detalles: errores
    });
  }

  req.body = value;
  next();
};

/**
 * Middleware para validar aprobación de actividad
 */
const validateValidarActividad = (req, res, next) => {
  const { error, value } = validarActividadSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errores = error.details.map(detail => ({
      campo: detail.path.join('.'),
      mensaje: detail.message
    }));

    return res.status(400).json({
      error: 'Datos de validación inválidos',
      detalles: errores
    });
  }

  req.body = value;
  next();
};

/**
 * Middleware para validar rechazo de actividad
 */
const validateRechazarActividad = (req, res, next) => {
  const { error, value } = rechazarActividadSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errores = error.details.map(detail => ({
      campo: detail.path.join('.'),
      mensaje: detail.message
    }));

    return res.status(400).json({
      error: 'Datos de rechazo inválidos',
      detalles: errores
    });
  }

  req.body = value;
  next();
};

/**
 * Middleware para validar escalamiento
 */
const validateEscalarValidacion = (req, res, next) => {
  const { error, value } = escalarValidacionSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errores = error.details.map(detail => ({
      campo: detail.path.join('.'),
      mensaje: detail.message
    }));

    return res.status(400).json({
      error: 'Datos de escalamiento inválidos',
      detalles: errores
    });
  }

  req.body = value;
  next();
};

/**
 * Middleware para validar reapertura
 */
const validateReabrirValidacion = (req, res, next) => {
  const { error, value } = reabrirValidacionSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errores = error.details.map(detail => ({
      campo: detail.path.join('.'),
      mensaje: detail.message
    }));

    return res.status(400).json({
      error: 'Datos de reapertura inválidos',
      detalles: errores
    });
  }

  req.body = value;
  next();
};

/**
 * Middleware para validar comentarios
 */
const validateComment = (req, res, next) => {
  const { error, value } = commentSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errores = error.details.map(detail => ({
      campo: detail.path.join('.'),
      mensaje: detail.message
    }));

    return res.status(400).json({
      error: 'Datos de comentario inválidos',
      detalles: errores
    });
  }

  req.body = value;
  next();
};

/**
 * Middleware para validar filtros de consulta
 */
const validateQueryFilters = (req, res, next) => {
  const { error, value } = queryFiltersSchema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errores = error.details.map(detail => ({
      campo: detail.path.join('.'),
      mensaje: detail.message
    }));

    return res.status(400).json({
      error: 'Filtros de búsqueda inválidos',
      detalles: errores
    });
  }

  // Convertir page a offset si se proporciona
  if (value.page) {
    value.offset = (value.page - 1) * value.limit;
    delete value.page;
  }

  req.query = value;
  next();
};

/**
 * Middleware para validar reportes
 */
const validateReporte = (req, res, next) => {
  const { error, value } = reporteSchema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errores = error.details.map(detail => ({
      campo: detail.path.join('.'),
      mensaje: detail.message
    }));

    return res.status(400).json({
      error: 'Parámetros de reporte inválidos',
      detalles: errores
    });
  }

  req.query = value;
  next();
};

/**
 * Middleware para validar parámetros ID
 */
const validateIdParam = (req, res, next) => {
  const { error, value } = idParamSchema.validate(req.params, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errores = error.details.map(detail => ({
      campo: detail.path.join('.'),
      mensaje: detail.message
    }));

    return res.status(400).json({
      error: 'ID inválido',
      detalles: errores
    });
  }

  req.params = value;
  next();
};

module.exports = {
  // Esquemas
  createValidacionSchema,
  updateValidacionSchema,
  validarActividadSchema,
  rechazarActividadSchema,
  escalarValidacionSchema,
  reabrirValidacionSchema,
  commentSchema,
  queryFiltersSchema,
  reporteSchema,
  idParamSchema,

  // Middlewares de validación
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
};
