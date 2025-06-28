const Joi = require('joi');

// =============================================
// ESQUEMAS DE VALIDACIÓN PARA ACTIVIDADES
// =============================================

/**
 * Esquema para crear nueva actividad
 */
const createActividadSchema = Joi.object({
  asignacion_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID de asignación debe ser un número',
      'number.integer': 'El ID de asignación debe ser un número entero',
      'number.positive': 'El ID de asignación debe ser positivo',
      'any.required': 'El ID de asignación es requerido'
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

  titulo: Joi.string()
    .trim()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.base': 'El título debe ser texto',
      'string.empty': 'El título no puede estar vacío',
      'string.min': 'El título debe tener al menos 5 caracteres',
      'string.max': 'El título no puede exceder 200 caracteres',
      'any.required': 'El título es requerido'
    }),

  descripcion: Joi.string()
    .trim()
    .max(5000)
    .allow('')
    .default('')
    .messages({
      'string.base': 'La descripción debe ser texto',
      'string.max': 'La descripción no puede exceder 5000 caracteres'
    }),

  tipo_actividad: Joi.string()
    .valid('desarrollo', 'diseño', 'testing', 'documentacion', 'reunion', 'soporte', 'otro')
    .default('desarrollo')
    .messages({
      'string.base': 'El tipo de actividad debe ser texto',
      'any.only': 'El tipo de actividad debe ser: desarrollo, diseño, testing, documentacion, reunion, soporte, otro'
    }),

  estado: Joi.string()
    .valid('pendiente', 'progreso', 'completada', 'validada', 'rechazada')
    .default('pendiente')
    .messages({
      'string.base': 'El estado debe ser texto',
      'any.only': 'El estado debe ser: pendiente, progreso, completada, validada, rechazada'
    }),

  prioridad: Joi.string()
    .valid('baja', 'media', 'alta', 'critica')
    .default('media')
    .messages({
      'string.base': 'La prioridad debe ser texto',
      'any.only': 'La prioridad debe ser: baja, media, alta, critica'
    }),

  fecha_inicio: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.base': 'La fecha de inicio debe ser una fecha válida',
      'date.format': 'La fecha de inicio debe estar en formato ISO'
    }),

  fecha_fin: Joi.date()
    .iso()
    .optional()
    .greater(Joi.ref('fecha_inicio'))
    .messages({
      'date.base': 'La fecha de fin debe ser una fecha válida',
      'date.format': 'La fecha de fin debe estar en formato ISO',
      'date.greater': 'La fecha de fin debe ser posterior a la fecha de inicio'
    }),

  tiempo_estimado_horas: Joi.number()
    .positive()
    .max(500)
    .precision(2)
    .optional()
    .messages({
      'number.base': 'El tiempo estimado debe ser un número',
      'number.positive': 'El tiempo estimado debe ser positivo',
      'number.max': 'El tiempo estimado no puede exceder 500 horas',
      'number.precision': 'El tiempo estimado puede tener máximo 2 decimales'
    }),

  tiempo_trabajado_horas: Joi.number()
    .min(0)
    .max(500)
    .precision(2)
    .default(0)
    .messages({
      'number.base': 'El tiempo trabajado debe ser un número',
      'number.min': 'El tiempo trabajado no puede ser negativo',
      'number.max': 'El tiempo trabajado no puede exceder 500 horas',
      'number.precision': 'El tiempo trabajado puede tener máximo 2 decimales'
    }),

  cronometro_activo: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': 'El estado del cronómetro debe ser verdadero o falso'
    }),

  porcentaje_completado: Joi.number()
    .min(0)
    .max(100)
    .precision(2)
    .default(0)
    .messages({
      'number.base': 'El porcentaje debe ser un número',
      'number.min': 'El porcentaje no puede ser menor a 0',
      'number.max': 'El porcentaje no puede ser mayor a 100',
      'number.precision': 'El porcentaje puede tener máximo 2 decimales'
    }),

  hitos_completados: Joi.array()
    .items(Joi.string().trim().min(1).max(200))
    .max(50)
    .default([])
    .messages({
      'array.base': 'Los hitos deben ser una lista',
      'array.max': 'No puede haber más de 50 hitos',
      'string.min': 'Cada hito debe tener al menos 1 caracter',
      'string.max': 'Cada hito no puede exceder 200 caracteres'
    }),

  competencias_utilizadas: Joi.array()
    .items(Joi.string().trim().min(1).max(100))
    .max(20)
    .default([])
    .messages({
      'array.base': 'Las competencias deben ser una lista',
      'array.max': 'No puede haber más de 20 competencias',
      'string.min': 'Cada competencia debe tener al menos 1 caracter',
      'string.max': 'Cada competencia no puede exceder 100 caracteres'
    }),

  herramientas_utilizadas: Joi.array()
    .items(Joi.string().trim().min(1).max(100))
    .max(30)
    .default([])
    .messages({
      'array.base': 'Las herramientas deben ser una lista',
      'array.max': 'No puede haber más de 30 herramientas',
      'string.min': 'Cada herramienta debe tener al menos 1 caracter',
      'string.max': 'Cada herramienta no puede exceder 100 caracteres'
    }),

  dificultad_percibida: Joi.string()
    .valid('muy_facil', 'facil', 'medio', 'dificil', 'muy_dificil')
    .optional()
    .messages({
      'string.base': 'La dificultad debe ser texto',
      'any.only': 'La dificultad debe ser: muy_facil, facil, medio, dificil, muy_dificil'
    }),

  satisfaccion_tecnico: Joi.number()
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

  enlaces_externos: Joi.array()
    .items(Joi.object({
      url: Joi.string().uri().required(),
      titulo: Joi.string().trim().min(1).max(200).required(),
      descripcion: Joi.string().trim().max(500).default('')
    }))
    .max(10)
    .default([])
    .messages({
      'array.base': 'Los enlaces deben ser una lista',
      'array.max': 'No puede haber más de 10 enlaces'
    }),

  creado_por: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.base': 'El ID del creador debe ser un número',
      'number.integer': 'El ID del creador debe ser un número entero',
      'number.positive': 'El ID del creador debe ser positivo'
    })
}).messages({
  'object.unknown': 'El campo {#label} no está permitido'
});

/**
 * Esquema para actualizar actividad
 */
const updateActividadSchema = Joi.object({
  titulo: Joi.string()
    .trim()
    .min(5)
    .max(200)
    .optional()
    .messages({
      'string.base': 'El título debe ser texto',
      'string.min': 'El título debe tener al menos 5 caracteres',
      'string.max': 'El título no puede exceder 200 caracteres'
    }),

  descripcion: Joi.string()
    .trim()
    .max(5000)
    .allow('')
    .optional()
    .messages({
      'string.base': 'La descripción debe ser texto',
      'string.max': 'La descripción no puede exceder 5000 caracteres'
    }),

  tipo_actividad: Joi.string()
    .valid('desarrollo', 'diseño', 'testing', 'documentacion', 'reunion', 'soporte', 'otro')
    .optional()
    .messages({
      'string.base': 'El tipo de actividad debe ser texto',
      'any.only': 'El tipo de actividad debe ser: desarrollo, diseño, testing, documentacion, reunion, soporte, otro'
    }),

  prioridad: Joi.string()
    .valid('baja', 'media', 'alta', 'critica')
    .optional()
    .messages({
      'string.base': 'La prioridad debe ser texto',
      'any.only': 'La prioridad debe ser: baja, media, alta, critica'
    }),

  fecha_inicio: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.base': 'La fecha de inicio debe ser una fecha válida',
      'date.format': 'La fecha de inicio debe estar en formato ISO'
    }),

  fecha_fin: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.base': 'La fecha de fin debe ser una fecha válida',
      'date.format': 'La fecha de fin debe estar en formato ISO'
    }),

  tiempo_estimado_horas: Joi.number()
    .positive()
    .max(500)
    .precision(2)
    .optional()
    .messages({
      'number.base': 'El tiempo estimado debe ser un número',
      'number.positive': 'El tiempo estimado debe ser positivo',
      'number.max': 'El tiempo estimado no puede exceder 500 horas',
      'number.precision': 'El tiempo estimado puede tener máximo 2 decimales'
    }),

  tiempo_trabajado_horas: Joi.number()
    .min(0)
    .max(500)
    .precision(2)
    .optional()
    .messages({
      'number.base': 'El tiempo trabajado debe ser un número',
      'number.min': 'El tiempo trabajado no puede ser negativo',
      'number.max': 'El tiempo trabajado no puede exceder 500 horas',
      'number.precision': 'El tiempo trabajado puede tener máximo 2 decimales'
    }),

  porcentaje_completado: Joi.number()
    .min(0)
    .max(100)
    .precision(2)
    .optional()
    .messages({
      'number.base': 'El porcentaje debe ser un número',
      'number.min': 'El porcentaje no puede ser menor a 0',
      'number.max': 'El porcentaje no puede ser mayor a 100',
      'number.precision': 'El porcentaje puede tener máximo 2 decimales'
    }),

  hitos_completados: Joi.array()
    .items(Joi.string().trim().min(1).max(200))
    .max(50)
    .optional()
    .messages({
      'array.base': 'Los hitos deben ser una lista',
      'array.max': 'No puede haber más de 50 hitos'
    }),

  competencias_utilizadas: Joi.array()
    .items(Joi.string().trim().min(1).max(100))
    .max(20)
    .optional()
    .messages({
      'array.base': 'Las competencias deben ser una lista',
      'array.max': 'No puede haber más de 20 competencias'
    }),

  herramientas_utilizadas: Joi.array()
    .items(Joi.string().trim().min(1).max(100))
    .max(30)
    .optional()
    .messages({
      'array.base': 'Las herramientas deben ser una lista',
      'array.max': 'No puede haber más de 30 herramientas'
    }),

  dificultad_percibida: Joi.string()
    .valid('muy_facil', 'facil', 'medio', 'dificil', 'muy_dificil')
    .optional()
    .messages({
      'string.base': 'La dificultad debe ser texto',
      'any.only': 'La dificultad debe ser: muy_facil, facil, medio, dificil, muy_dificil'
    }),

  satisfaccion_tecnico: Joi.number()
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

  enlaces_externos: Joi.array()
    .items(Joi.object({
      id: Joi.number().optional(),
      url: Joi.string().uri().required(),
      titulo: Joi.string().trim().min(1).max(200).required(),
      descripcion: Joi.string().trim().max(500).default('')
    }))
    .max(10)
    .optional()
    .messages({
      'array.base': 'Los enlaces deben ser una lista',
      'array.max': 'No puede haber más de 10 enlaces'
    })
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar',
  'object.unknown': 'El campo {#label} no está permitido'
});

/**
 * Esquema para cambio de estado
 */
const changeStatusSchema = Joi.object({
  estado: Joi.string()
    .valid('pendiente', 'progreso', 'completada', 'validada', 'rechazada')
    .required()
    .messages({
      'string.base': 'El estado debe ser texto',
      'any.only': 'El estado debe ser: pendiente, progreso, completada, validada, rechazada',
      'any.required': 'El estado es requerido'
    }),

  observaciones: Joi.string()
    .trim()
    .max(2000)
    .allow('')
    .default('')
    .messages({
      'string.base': 'Las observaciones deben ser texto',
      'string.max': 'Las observaciones no pueden exceder 2000 caracteres'
    }),

  puntuacion_calidad: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .when('estado', {
      is: 'validada',
      then: Joi.optional(),
      otherwise: Joi.forbidden()
    })
    .messages({
      'number.base': 'La puntuación debe ser un número',
      'number.integer': 'La puntuación debe ser un número entero',
      'number.min': 'La puntuación mínima es 1',
      'number.max': 'La puntuación máxima es 5',
      'any.forbidden': 'La puntuación solo se permite al validar'
    }),

  puntos_mejora: Joi.array()
    .items(Joi.string().trim().min(5).max(200))
    .max(10)
    .when('estado', {
      is: 'rechazada',
      then: Joi.optional(),
      otherwise: Joi.forbidden()
    })
    .messages({
      'array.base': 'Los puntos de mejora deben ser una lista',
      'array.max': 'No puede haber más de 10 puntos de mejora',
      'string.min': 'Cada punto debe tener al menos 5 caracteres',
      'string.max': 'Cada punto no puede exceder 200 caracteres',
      'any.forbidden': 'Los puntos de mejora solo se permiten al rechazar'
    })
}).messages({
  'object.unknown': 'El campo {#label} no está permitido'
});

/**
 * Esquema para tracking de tiempo (cronómetro)
 */
const timeTrackingSchema = Joi.object({
  accion: Joi.string()
    .valid('iniciar', 'pausar', 'reanudar', 'finalizar')
    .required()
    .messages({
      'string.base': 'La acción debe ser texto',
      'any.only': 'La acción debe ser: iniciar, pausar, reanudar, finalizar',
      'any.required': 'La acción es requerida'
    }),

  descripcion_actual: Joi.string()
    .trim()
    .max(500)
    .when('accion', {
      is: 'iniciar',
      then: Joi.optional(),
      otherwise: Joi.forbidden()
    })
    .messages({
      'string.base': 'La descripción debe ser texto',
      'string.max': 'La descripción no puede exceder 500 caracteres',
      'any.forbidden': 'La descripción solo se permite al iniciar'
    }),

  razon_pausa: Joi.string()
    .trim()
    .max(200)
    .when('accion', {
      is: 'pausar',
      then: Joi.optional(),
      otherwise: Joi.forbidden()
    })
    .messages({
      'string.base': 'La razón debe ser texto',
      'string.max': 'La razón no puede exceder 200 caracteres',
      'any.forbidden': 'La razón solo se permite al pausar'
    }),

  resumen_trabajo: Joi.string()
    .trim()
    .max(1000)
    .when('accion', {
      is: 'finalizar',
      then: Joi.optional(),
      otherwise: Joi.forbidden()
    })
    .messages({
      'string.base': 'El resumen debe ser texto',
      'string.max': 'El resumen no puede exceder 1000 caracteres',
      'any.forbidden': 'El resumen solo se permite al finalizar'
    }),

  tiempo_efectivo_horas: Joi.number()
    .positive()
    .max(24)
    .precision(2)
    .when('accion', {
      is: 'finalizar',
      then: Joi.optional(),
      otherwise: Joi.forbidden()
    })
    .messages({
      'number.base': 'El tiempo efectivo debe ser un número',
      'number.positive': 'El tiempo efectivo debe ser positivo',
      'number.max': 'El tiempo efectivo no puede exceder 24 horas',
      'number.precision': 'El tiempo efectivo puede tener máximo 2 decimales',
      'any.forbidden': 'El tiempo efectivo solo se permite al finalizar'
    }),

  porcentaje_completado: Joi.number()
    .min(0)
    .max(100)
    .precision(2)
    .when('accion', {
      is: 'finalizar',
      then: Joi.optional(),
      otherwise: Joi.forbidden()
    })
    .messages({
      'number.base': 'El porcentaje debe ser un número',
      'number.min': 'El porcentaje no puede ser menor a 0',
      'number.max': 'El porcentaje no puede ser mayor a 100',
      'number.precision': 'El porcentaje puede tener máximo 2 decimales',
      'any.forbidden': 'El porcentaje solo se permite al finalizar'
    })
}).messages({
  'object.unknown': 'El campo {#label} no está permitido'
});

/**
 * Esquema para validación de evidencias
 */
const evidenceUploadSchema = Joi.object({
  tipo: Joi.string()
    .valid('captura', 'documento', 'codigo', 'otro')
    .required()
    .messages({
      'string.base': 'El tipo debe ser texto',
      'any.only': 'El tipo debe ser: captura, documento, codigo, otro',
      'any.required': 'El tipo es requerido'
    }),

  descripcion: Joi.string()
    .trim()
    .max(500)
    .default('')
    .messages({
      'string.base': 'La descripción debe ser texto',
      'string.max': 'La descripción no puede exceder 500 caracteres'
    }),

  // Validaciones para archivos (se aplicarán en el middleware)
  tamaño_maximo: Joi.number()
    .default(10485760) // 10MB
    .messages({
      'number.base': 'El tamaño máximo debe ser un número'
    }),

  tipos_permitidos: Joi.array()
    .items(Joi.string())
    .default(['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
    .messages({
      'array.base': 'Los tipos permitidos deben ser una lista'
    })
}).messages({
  'object.unknown': 'El campo {#label} no está permitido'
});

/**
 * Esquema para filtros de búsqueda avanzada
 */
const queryFiltersSchema = Joi.object({
  // Filtros de entidad
  asignacion_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.base': 'El ID de asignación debe ser un número',
      'number.integer': 'El ID de asignación debe ser un número entero',
      'number.positive': 'El ID de asignación debe ser positivo'
    }),

  tecnico_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.base': 'El ID del técnico debe ser un número',
      'number.integer': 'El ID del técnico debe ser un número entero',
      'number.positive': 'El ID del técnico debe ser positivo'
    }),

  cliente_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.base': 'El ID del cliente debe ser un número',
      'number.integer': 'El ID del cliente debe ser un número entero',
      'number.positive': 'El ID del cliente debe ser positivo'
    }),

  // Filtros de estado
  estado: Joi.alternatives()
    .try(
      Joi.string().valid('pendiente', 'progreso', 'completada', 'validada', 'rechazada'),
      Joi.array().items(Joi.string().valid('pendiente', 'progreso', 'completada', 'validada', 'rechazada')).min(1).max(5)
    )
    .optional()
    .messages({
      'alternatives.match': 'El estado debe ser válido o una lista de estados válidos',
      'array.min': 'Debe proporcionar al menos un estado',
      'array.max': 'No puede filtrar por más de 5 estados'
    }),

  tipo_actividad: Joi.string()
    .valid('desarrollo', 'diseño', 'testing', 'documentacion', 'reunion', 'soporte', 'otro')
    .optional()
    .messages({
      'string.base': 'El tipo de actividad debe ser texto',
      'any.only': 'El tipo de actividad debe ser válido'
    }),

  prioridad: Joi.string()
    .valid('baja', 'media', 'alta', 'critica')
    .optional()
    .messages({
      'string.base': 'La prioridad debe ser texto',
      'any.only': 'La prioridad debe ser válida'
    }),

  // Filtros de fecha
  fecha_desde: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.base': 'La fecha desde debe ser una fecha válida',
      'date.format': 'La fecha desde debe estar en formato ISO'
    }),

  fecha_hasta: Joi.date()
    .iso()
    .optional()
    .greater(Joi.ref('fecha_desde'))
    .messages({
      'date.base': 'La fecha hasta debe ser una fecha válida',
      'date.format': 'La fecha hasta debe estar en formato ISO',
      'date.greater': 'La fecha hasta debe ser posterior a la fecha desde'
    }),

  // Filtros de tiempo
  tiempo_min: Joi.number()
    .min(0)
    .max(500)
    .precision(2)
    .optional()
    .messages({
      'number.base': 'El tiempo mínimo debe ser un número',
      'number.min': 'El tiempo mínimo no puede ser negativo',
      'number.max': 'El tiempo mínimo no puede exceder 500 horas'
    }),

  tiempo_max: Joi.number()
    .min(0)
    .max(500)
    .precision(2)
    .optional()
    .greater(Joi.ref('tiempo_min'))
    .messages({
      'number.base': 'El tiempo máximo debe ser un número',
      'number.min': 'El tiempo máximo no puede ser negativo',
      'number.max': 'El tiempo máximo no puede exceder 500 horas',
      'number.greater': 'El tiempo máximo debe ser mayor al mínimo'
    }),

  // Búsqueda textual
  search: Joi.string()
    .trim()
    .min(3)
    .max(200)
    .optional()
    .messages({
      'string.base': 'El término de búsqueda debe ser texto',
      'string.min': 'El término debe tener al menos 3 caracteres',
      'string.max': 'El término no puede exceder 200 caracteres'
    }),

  // Filtros especiales
  con_evidencias: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'El filtro de evidencias debe ser verdadero o falso'
    }),

  validado_por: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.base': 'El ID del validador debe ser un número',
      'number.integer': 'El ID del validador debe ser un número entero',
      'number.positive': 'El ID del validador debe ser positivo'
    }),

  cronometro_activo: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'El filtro de cronómetro debe ser verdadero o falso'
    }),

  // Ordenamiento
  orden: Joi.string()
    .valid('fecha_inicio', 'tiempo_trabajado_horas', 'prioridad', 'estado', 'puntuacion_calidad', 'creado_en')
    .default('creado_en')
    .messages({
      'string.base': 'El orden debe ser texto',
      'any.only': 'El orden debe ser un campo válido'
    }),

  direccion: Joi.string()
    .valid('ASC', 'DESC', 'asc', 'desc')
    .default('DESC')
    .messages({
      'string.base': 'La dirección debe ser texto',
      'any.only': 'La dirección debe ser ASC o DESC'
    }),

  // Paginación
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .messages({
      'number.base': 'El límite debe ser un número',
      'number.integer': 'El límite debe ser un número entero',
      'number.min': 'El límite mínimo es 1',
      'number.max': 'El límite máximo es 100'
    }),

  offset: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'El offset debe ser un número',
      'number.integer': 'El offset debe ser un número entero',
      'number.min': 'El offset no puede ser negativo'
    }),

  page: Joi.number()
    .integer()
    .min(1)
    .optional()
    .messages({
      'number.base': 'La página debe ser un número',
      'number.integer': 'La página debe ser un número entero',
      'number.min': 'La página mínima es 1'
    })
}).messages({
  'object.unknown': 'El parámetro {#label} no está permitido'
});

/**
 * Esquema para validación de reportes
 */
const reporteSchema = Joi.object({
  tipo_reporte: Joi.string()
    .valid('productividad', 'tiempo', 'calidad', 'resumen')
    .required()
    .messages({
      'string.base': 'El tipo de reporte debe ser texto',
      'any.only': 'El tipo debe ser: productividad, tiempo, calidad, resumen',
      'any.required': 'El tipo de reporte es requerido'
    }),

  tecnico_id: Joi.number()
    .integer()
    .positive()
    .when('tipo_reporte', {
      is: 'productividad',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .messages({
      'number.base': 'El ID del técnico debe ser un número',
      'number.integer': 'El ID del técnico debe ser un número entero',
      'number.positive': 'El ID del técnico debe ser positivo',
      'any.required': 'El ID del técnico es requerido para reportes de productividad'
    }),

  cliente_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.base': 'El ID del cliente debe ser un número',
      'number.integer': 'El ID del cliente debe ser un número entero',
      'number.positive': 'El ID del cliente debe ser positivo'
    }),

  fecha_inicio: Joi.date()
    .iso()
    .required()
    .messages({
      'date.base': 'La fecha de inicio debe ser una fecha válida',
      'date.format': 'La fecha de inicio debe estar en formato ISO',
      'any.required': 'La fecha de inicio es requerida'
    }),

  fecha_fin: Joi.date()
    .iso()
    .required()
    .greater(Joi.ref('fecha_inicio'))
    .messages({
      'date.base': 'La fecha de fin debe ser una fecha válida',
      'date.format': 'La fecha de fin debe estar en formato ISO',
      'date.greater': 'La fecha de fin debe ser posterior a la fecha de inicio',
      'any.required': 'La fecha de fin es requerida'
    }),

  detallado: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': 'El flag detallado debe ser verdadero o falso'
    }),

  incluir_estadisticas: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'El flag de estadísticas debe ser verdadero o falso'
    })
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

/**
 * Esquema para agregar enlaces externos
 */
const enlaceExternoSchema = Joi.object({
  url: Joi.string()
    .uri()
    .required()
    .messages({
      'string.base': 'La URL debe ser texto',
      'string.uri': 'La URL debe ser válida',
      'any.required': 'La URL es requerida'
    }),

  titulo: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .required()
    .messages({
      'string.base': 'El título debe ser texto',
      'string.empty': 'El título no puede estar vacío',
      'string.min': 'El título debe tener al menos 1 caracter',
      'string.max': 'El título no puede exceder 200 caracteres',
      'any.required': 'El título es requerido'
    }),

  descripcion: Joi.string()
    .trim()
    .max(500)
    .default('')
    .messages({
      'string.base': 'La descripción debe ser texto',
      'string.max': 'La descripción no puede exceder 500 caracteres'
    })
}).messages({
  'object.unknown': 'El campo {#label} no está permitido'
});

// =============================================
// FUNCIONES DE VALIDACIÓN
// =============================================

/**
 * Middleware para validar creación de actividad
 */
const validateCreateActividad = (req, res, next) => {
  const { error, value } = createActividadSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errores = error.details.map(detail => ({
      campo: detail.path.join('.'),
      mensaje: detail.message
    }));

    return res.status(400).json({
      error: 'Datos de actividad inválidos',
      detalles: errores
    });
  }

  req.body = value;
  next();
};

/**
 * Middleware para validar actualización de actividad
 */
const validateUpdateActividad = (req, res, next) => {
  const { error, value } = updateActividadSchema.validate(req.body, {
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
 * Middleware para validar cambio de estado
 */
const validateChangeStatus = (req, res, next) => {
  const { error, value } = changeStatusSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errores = error.details.map(detail => ({
      campo: detail.path.join('.'),
      mensaje: detail.message
    }));

    return res.status(400).json({
      error: 'Datos de cambio de estado inválidos',
      detalles: errores
    });
  }

  req.body = value;
  next();
};

/**
 * Middleware para validar tracking de tiempo
 */
const validateTimeTracking = (req, res, next) => {
  const { error, value } = timeTrackingSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errores = error.details.map(detail => ({
      campo: detail.path.join('.'),
      mensaje: detail.message
    }));

    return res.status(400).json({
      error: 'Datos de cronómetro inválidos',
      detalles: errores
    });
  }

  req.body = value;
  next();
};

/**
 * Middleware para validar upload de evidencias
 */
const validateEvidenceUpload = (req, res, next) => {
  const { error, value } = evidenceUploadSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errores = error.details.map(detail => ({
      campo: detail.path.join('.'),
      mensaje: detail.message
    }));

    return res.status(400).json({
      error: 'Datos de evidencia inválidos',
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

/**
 * Middleware para validar enlaces externos
 */
const validateEnlaceExterno = (req, res, next) => {
  const { error, value } = enlaceExternoSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errores = error.details.map(detail => ({
      campo: detail.path.join('.'),
      mensaje: detail.message
    }));

    return res.status(400).json({
      error: 'Datos de enlace inválidos',
      detalles: errores
    });
  }

  req.body = value;
  next();
};

module.exports = {
  // Esquemas
  createActividadSchema,
  updateActividadSchema,
  changeStatusSchema,
  timeTrackingSchema,
  evidenceUploadSchema,
  queryFiltersSchema,
  reporteSchema,
  idParamSchema,
  enlaceExternoSchema,

  // Middlewares de validación
  validateCreateActividad,
  validateUpdateActividad,
  validateChangeStatus,
  validateTimeTracking,
  validateEvidenceUpload,
  validateQueryFilters,
  validateReporte,
  validateIdParam,
  validateEnlaceExterno
};
