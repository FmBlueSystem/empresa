// asignacionValidators.js - Validaciones Joi para módulo de asignaciones
const Joi = require('joi');

// Esquema para crear asignación
const createAsignacionSchema = Joi.object({
  tecnico_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.integer': 'El ID del técnico debe ser un número entero',
      'number.positive': 'El ID del técnico debe ser positivo',
      'any.required': 'El ID del técnico es requerido'
    }),

  cliente_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.integer': 'El ID del cliente debe ser un número entero',
      'number.positive': 'El ID del cliente debe ser positivo',
      'any.required': 'El ID del cliente es requerido'
    }),

  proyecto_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .allow(null)
    .messages({
      'number.integer': 'El ID del proyecto debe ser un número entero',
      'number.positive': 'El ID del proyecto debe ser positivo'
    }),

  tipo_asignacion: Joi.string()
    .valid('proyecto', 'soporte', 'mantenimiento', 'consultoria')
    .default('proyecto')
    .messages({
      'any.only': 'El tipo de asignación debe ser: proyecto, soporte, mantenimiento o consultoria'
    }),

  estado: Joi.string()
    .valid('activa', 'pausada', 'completada', 'cancelada')
    .default('activa')
    .messages({
      'any.only': 'El estado debe ser: activa, pausada, completada o cancelada'
    }),

  fecha_inicio: Joi.date()
    .iso()
    .required()
    .messages({
      'date.format': 'La fecha de inicio debe estar en formato ISO (YYYY-MM-DD)',
      'any.required': 'La fecha de inicio es requerida'
    }),

  fecha_fin_estimada: Joi.date()
    .iso()
    .greater(Joi.ref('fecha_inicio'))
    .required()
    .messages({
      'date.format': 'La fecha de fin estimada debe estar en formato ISO (YYYY-MM-DD)',
      'date.greater': 'La fecha de fin estimada debe ser posterior a la fecha de inicio',
      'any.required': 'La fecha de fin estimada es requerida'
    }),

  prioridad: Joi.string()
    .valid('baja', 'media', 'alta', 'critica')
    .default('media')
    .messages({
      'any.only': 'La prioridad debe ser: baja, media, alta o critica'
    }),

  horas_estimadas: Joi.number()
    .min(0)
    .max(10000)
    .default(0)
    .messages({
      'number.min': 'Las horas estimadas no pueden ser negativas',
      'number.max': 'Las horas estimadas no pueden exceder 10,000'
    }),

  competencias_requeridas: Joi.array()
    .items(Joi.string().min(2).max(100))
    .optional()
    .max(20)
    .messages({
      'array.max': 'No se pueden requerir más de 20 competencias',
      'string.min': 'Cada competencia debe tener al menos 2 caracteres',
      'string.max': 'Cada competencia no puede exceder 100 caracteres'
    }),

  descripcion: Joi.string()
    .min(10)
    .max(2000)
    .required()
    .messages({
      'string.min': 'La descripción debe tener al menos 10 caracteres',
      'string.max': 'La descripción no puede exceder 2000 caracteres',
      'any.required': 'La descripción es requerida'
    }),

  observaciones: Joi.string()
    .max(1000)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Las observaciones no pueden exceder 1000 caracteres'
    }),

  costo_estimado: Joi.number()
    .min(0)
    .max(99999999)
    .default(0)
    .messages({
      'number.min': 'El costo estimado no puede ser negativo',
      'number.max': 'El costo estimado es demasiado alto'
    }),

  tarifa_hora: Joi.number()
    .min(0)
    .max(100000)
    .default(0)
    .messages({
      'number.min': 'La tarifa por hora no puede ser negativa',
      'number.max': 'La tarifa por hora es demasiado alta'
    }),

  metadatos: Joi.object()
    .optional()
    .messages({
      'object.base': 'Los metadatos deben ser un objeto válido'
    })
});

// Esquema para actualizar asignación
const updateAsignacionSchema = Joi.object({
  estado: Joi.string()
    .valid('activa', 'pausada', 'completada', 'cancelada')
    .optional()
    .messages({
      'any.only': 'El estado debe ser: activa, pausada, completada o cancelada'
    }),

  fecha_fin_estimada: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.format': 'La fecha de fin estimada debe estar en formato ISO (YYYY-MM-DD)'
    }),

  fecha_fin_real: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.format': 'La fecha de fin real debe estar en formato ISO (YYYY-MM-DD)'
    }),

  prioridad: Joi.string()
    .valid('baja', 'media', 'alta', 'critica')
    .optional()
    .messages({
      'any.only': 'La prioridad debe ser: baja, media, alta o critica'
    }),

  horas_estimadas: Joi.number()
    .min(0)
    .max(10000)
    .optional()
    .messages({
      'number.min': 'Las horas estimadas no pueden ser negativas',
      'number.max': 'Las horas estimadas no pueden exceder 10,000'
    }),

  horas_trabajadas: Joi.number()
    .min(0)
    .max(15000)
    .optional()
    .messages({
      'number.min': 'Las horas trabajadas no pueden ser negativas',
      'number.max': 'Las horas trabajadas no pueden exceder 15,000'
    }),

  porcentaje_avance: Joi.number()
    .min(0)
    .max(100)
    .optional()
    .messages({
      'number.min': 'El porcentaje de avance no puede ser negativo',
      'number.max': 'El porcentaje de avance no puede exceder 100%'
    }),

  descripcion: Joi.string()
    .min(10)
    .max(2000)
    .optional()
    .messages({
      'string.min': 'La descripción debe tener al menos 10 caracteres',
      'string.max': 'La descripción no puede exceder 2000 caracteres'
    }),

  observaciones: Joi.string()
    .max(1000)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Las observaciones no pueden exceder 1000 caracteres'
    }),

  costo_estimado: Joi.number()
    .min(0)
    .max(99999999)
    .optional()
    .messages({
      'number.min': 'El costo estimado no puede ser negativo',
      'number.max': 'El costo estimado es demasiado alto'
    }),

  tarifa_hora: Joi.number()
    .min(0)
    .max(100000)
    .optional()
    .messages({
      'number.min': 'La tarifa por hora no puede ser negativa',
      'number.max': 'La tarifa por hora es demasiado alta'
    }),

  metadatos: Joi.object()
    .optional()
    .messages({
      'object.base': 'Los metadatos deben ser un objeto válido'
    })
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
});

// Esquema para filtros de búsqueda
const getAsignacionesQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.integer': 'La página debe ser un número entero',
      'number.min': 'La página debe ser mayor a 0'
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .messages({
      'number.integer': 'El límite debe ser un número entero',
      'number.min': 'El límite debe ser mayor a 0',
      'number.max': 'El límite no puede exceder 100'
    }),

  tecnico_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.integer': 'El ID del técnico debe ser un número entero',
      'number.positive': 'El ID del técnico debe ser positivo'
    }),

  cliente_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.integer': 'El ID del cliente debe ser un número entero',
      'number.positive': 'El ID del cliente debe ser positivo'
    }),

  proyecto_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.integer': 'El ID del proyecto debe ser un número entero',
      'number.positive': 'El ID del proyecto debe ser positivo'
    }),

  estado: Joi.string()
    .valid('activa', 'pausada', 'completada', 'cancelada')
    .optional()
    .messages({
      'any.only': 'El estado debe ser: activa, pausada, completada o cancelada'
    }),

  tipo_asignacion: Joi.string()
    .valid('proyecto', 'soporte', 'mantenimiento', 'consultoria')
    .optional()
    .messages({
      'any.only': 'El tipo de asignación debe ser: proyecto, soporte, mantenimiento o consultoria'
    }),

  prioridad: Joi.string()
    .valid('baja', 'media', 'alta', 'critica')
    .optional()
    .messages({
      'any.only': 'La prioridad debe ser: baja, media, alta o critica'
    }),

  fecha_desde: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.format': 'La fecha desde debe estar en formato ISO (YYYY-MM-DD)'
    }),

  fecha_hasta: Joi.date()
    .iso()
    .greater(Joi.ref('fecha_desde'))
    .optional()
    .messages({
      'date.format': 'La fecha hasta debe estar en formato ISO (YYYY-MM-DD)',
      'date.greater': 'La fecha hasta debe ser posterior a la fecha desde'
    }),

  search: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'La búsqueda debe tener al menos 2 caracteres',
      'string.max': 'La búsqueda no puede exceder 100 caracteres'
    }),

  sort: Joi.string()
    .valid('fecha_inicio', 'fecha_creacion', 'prioridad', 'estado', 'horas_estimadas')
    .default('fecha_inicio')
    .messages({
      'any.only': 'El ordenamiento debe ser: fecha_inicio, fecha_creacion, prioridad, estado o horas_estimadas'
    }),

  order: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .messages({
      'any.only': 'El orden debe ser: asc o desc'
    })
});

// Esquema para cambio de estado
const changeStatusSchema = Joi.object({
  estado: Joi.string()
    .valid('activa', 'pausada', 'completada', 'cancelada')
    .required()
    .messages({
      'any.only': 'El estado debe ser: activa, pausada, completada o cancelada',
      'any.required': 'El estado es requerido'
    }),

  observaciones: Joi.string()
    .max(500)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Las observaciones no pueden exceder 500 caracteres'
    })
});

// Esquema para validación de disponibilidad
const checkDisponibilidadSchema = Joi.object({
  tecnico_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.integer': 'El ID del técnico debe ser un número entero',
      'number.positive': 'El ID del técnico debe ser positivo',
      'any.required': 'El ID del técnico es requerido'
    }),

  fecha_inicio: Joi.date()
    .iso()
    .required()
    .messages({
      'date.format': 'La fecha de inicio debe estar en formato ISO (YYYY-MM-DD)',
      'any.required': 'La fecha de inicio es requerida'
    }),

  fecha_fin: Joi.date()
    .iso()
    .greater(Joi.ref('fecha_inicio'))
    .required()
    .messages({
      'date.format': 'La fecha de fin debe estar en formato ISO (YYYY-MM-DD)',
      'date.greater': 'La fecha de fin debe ser posterior a la fecha de inicio',
      'any.required': 'La fecha de fin es requerida'
    }),

  asignacion_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.integer': 'El ID de la asignación debe ser un número entero',
      'number.positive': 'El ID de la asignación debe ser positivo'
    })
});

// Esquema para validación de competencias
const checkCompetenciasSchema = Joi.object({
  tecnico_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.integer': 'El ID del técnico debe ser un número entero',
      'number.positive': 'El ID del técnico debe ser positivo',
      'any.required': 'El ID del técnico es requerido'
    }),

  competencias_requeridas: Joi.array()
    .items(Joi.string().min(2).max(100))
    .min(1)
    .max(20)
    .required()
    .messages({
      'array.min': 'Debe especificar al menos una competencia',
      'array.max': 'No se pueden validar más de 20 competencias',
      'string.min': 'Cada competencia debe tener al menos 2 caracteres',
      'string.max': 'Cada competencia no puede exceder 100 caracteres',
      'any.required': 'Las competencias requeridas son obligatorias'
    })
});

// Esquema para asignación automática
const autoAssignSchema = Joi.object({
  cliente_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.integer': 'El ID del cliente debe ser un número entero',
      'number.positive': 'El ID del cliente debe ser positivo',
      'any.required': 'El ID del cliente es requerido'
    }),

  proyecto_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .allow(null)
    .messages({
      'number.integer': 'El ID del proyecto debe ser un número entero',
      'number.positive': 'El ID del proyecto debe ser positivo'
    }),

  competencias_requeridas: Joi.array()
    .items(Joi.string().min(2).max(100))
    .min(1)
    .max(20)
    .required()
    .messages({
      'array.min': 'Debe especificar al menos una competencia requerida',
      'array.max': 'No se pueden requerir más de 20 competencias',
      'string.min': 'Cada competencia debe tener al menos 2 caracteres',
      'string.max': 'Cada competencia no puede exceder 100 caracteres',
      'any.required': 'Las competencias requeridas son obligatorias'
    }),

  fecha_inicio: Joi.date()
    .iso()
    .required()
    .messages({
      'date.format': 'La fecha de inicio debe estar en formato ISO (YYYY-MM-DD)',
      'any.required': 'La fecha de inicio es requerida'
    }),

  fecha_fin_estimada: Joi.date()
    .iso()
    .greater(Joi.ref('fecha_inicio'))
    .required()
    .messages({
      'date.format': 'La fecha de fin estimada debe estar en formato ISO (YYYY-MM-DD)',
      'date.greater': 'La fecha de fin estimada debe ser posterior a la fecha de inicio',
      'any.required': 'La fecha de fin estimada es requerida'
    }),

  horas_estimadas: Joi.number()
    .min(1)
    .max(1000)
    .required()
    .messages({
      'number.min': 'Las horas estimadas deben ser al menos 1',
      'number.max': 'Las horas estimadas no pueden exceder 1,000',
      'any.required': 'Las horas estimadas son requeridas'
    }),

  prioridad: Joi.string()
    .valid('baja', 'media', 'alta', 'critica')
    .default('media')
    .messages({
      'any.only': 'La prioridad debe ser: baja, media, alta o critica'
    }),

  criterio_seleccion: Joi.string()
    .valid('disponibilidad', 'competencias', 'carga_trabajo', 'experiencia')
    .default('competencias')
    .messages({
      'any.only': 'El criterio de selección debe ser: disponibilidad, competencias, carga_trabajo o experiencia'
    })
});

// Esquema para reporte de progreso
const reportProgressSchema = Joi.object({
  asignacion_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.integer': 'El ID de la asignación debe ser un número entero',
      'number.positive': 'El ID de la asignación debe ser positivo',
      'any.required': 'El ID de la asignación es requerido'
    }),

  porcentaje_avance: Joi.number()
    .min(0)
    .max(100)
    .required()
    .messages({
      'number.min': 'El porcentaje de avance no puede ser negativo',
      'number.max': 'El porcentaje de avance no puede exceder 100%',
      'any.required': 'El porcentaje de avance es requerido'
    }),

  horas_trabajadas: Joi.number()
    .min(0)
    .max(15000)
    .optional()
    .messages({
      'number.min': 'Las horas trabajadas no pueden ser negativas',
      'number.max': 'Las horas trabajadas no pueden exceder 15,000'
    }),

  observaciones: Joi.string()
    .max(1000)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Las observaciones no pueden exceder 1000 caracteres'
    })
});

// Esquema para validación de ID en parámetros
const idParamSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.integer': 'El ID debe ser un número entero',
      'number.positive': 'El ID debe ser positivo',
      'any.required': 'El ID es requerido'
    })
});

module.exports = {
  createAsignacionSchema,
  updateAsignacionSchema,
  getAsignacionesQuerySchema,
  changeStatusSchema,
  checkDisponibilidadSchema,
  checkCompetenciasSchema,
  autoAssignSchema,
  reportProgressSchema,
  idParamSchema
};
