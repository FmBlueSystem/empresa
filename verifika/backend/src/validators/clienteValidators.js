// clienteValidators.js - Validaciones Joi para módulo de clientes
const Joi = require('joi');

// Esquema para crear cliente
const createClienteSchema = Joi.object({
  razon_social: Joi.string()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.empty': 'La razón social es requerida',
      'string.min': 'La razón social debe tener al menos 2 caracteres',
      'string.max': 'La razón social no puede exceder 200 caracteres',
      'any.required': 'La razón social es requerida'
    }),

  nombre_comercial: Joi.string()
    .min(2)
    .max(200)
    .optional()
    .messages({
      'string.min': 'El nombre comercial debe tener al menos 2 caracteres',
      'string.max': 'El nombre comercial no puede exceder 200 caracteres'
    }),

  tipo_cliente: Joi.string()
    .valid('empresa', 'particular', 'gobierno')
    .default('empresa')
    .messages({
      'any.only': 'El tipo de cliente debe ser: empresa, particular o gobierno'
    }),

  identificacion: Joi.string()
    .min(5)
    .max(50)
    .required()
    .messages({
      'string.empty': 'La identificación es requerida',
      'string.min': 'La identificación debe tener al menos 5 caracteres',
      'string.max': 'La identificación no puede exceder 50 caracteres',
      'any.required': 'La identificación es requerida'
    }),

  tipo_identificacion: Joi.string()
    .valid('cedula', 'ruc', 'pasaporte', 'cedula_juridica')
    .default('cedula')
    .messages({
      'any.only': 'El tipo de identificación debe ser: cedula, ruc, pasaporte o cedula_juridica'
    }),

  email: Joi.string()
    .email()
    .max(100)
    .required()
    .messages({
      'string.email': 'Debe ser un email válido',
      'string.max': 'El email no puede exceder 100 caracteres',
      'any.required': 'El email es requerido'
    }),

  telefono: Joi.string()
    .pattern(/^[\d\s\-\+\(\)]+$/)
    .min(8)
    .max(20)
    .required()
    .messages({
      'string.pattern.base': 'El teléfono debe contener solo números, espacios, guiones, + y paréntesis',
      'string.min': 'El teléfono debe tener al menos 8 caracteres',
      'string.max': 'El teléfono no puede exceder 20 caracteres',
      'any.required': 'El teléfono es requerido'
    }),

  telefono_secundario: Joi.string()
    .pattern(/^[\d\s\-\+\(\)]+$/)
    .min(8)
    .max(20)
    .optional()
    .allow(null, '')
    .messages({
      'string.pattern.base': 'El teléfono secundario debe contener solo números, espacios, guiones, + y paréntesis',
      'string.min': 'El teléfono secundario debe tener al menos 8 caracteres',
      'string.max': 'El teléfono secundario no puede exceder 20 caracteres'
    }),

  direccion: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      'string.min': 'La dirección debe tener al menos 10 caracteres',
      'string.max': 'La dirección no puede exceder 500 caracteres',
      'any.required': 'La dirección es requerida'
    }),

  ciudad: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'La ciudad debe tener al menos 2 caracteres',
      'string.max': 'La ciudad no puede exceder 100 caracteres',
      'any.required': 'La ciudad es requerida'
    }),

  provincia: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'La provincia debe tener al menos 2 caracteres',
      'string.max': 'La provincia no puede exceder 100 caracteres',
      'any.required': 'La provincia es requerida'
    }),

  pais: Joi.string()
    .min(2)
    .max(100)
    .default('Costa Rica')
    .messages({
      'string.min': 'El país debe tener al menos 2 caracteres',
      'string.max': 'El país no puede exceder 100 caracteres'
    }),

  codigo_postal: Joi.string()
    .max(20)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'El código postal no puede exceder 20 caracteres'
    }),

  sitio_web: Joi.string()
    .uri()
    .max(200)
    .optional()
    .allow(null, '')
    .messages({
      'string.uri': 'Debe ser una URL válida',
      'string.max': 'El sitio web no puede exceder 200 caracteres'
    }),

  sector_industria: Joi.string()
    .valid(
      'tecnologia', 'manufactura', 'servicios', 'comercio', 'construccion',
      'agricultura', 'turismo', 'educacion', 'salud', 'financiero',
      'transporte', 'energia', 'telecomunicaciones', 'gobierno', 'otro'
    )
    .optional()
    .messages({
      'any.only': 'Sector de industria no válido'
    }),

  tamaño_empresa: Joi.string()
    .valid('pequeña', 'mediana', 'grande', 'corporativa')
    .default('mediana')
    .messages({
      'any.only': 'El tamaño de empresa debe ser: pequeña, mediana, grande o corporativa'
    }),

  contacto_principal: Joi.string()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.min': 'El contacto principal debe tener al menos 2 caracteres',
      'string.max': 'El contacto principal no puede exceder 200 caracteres',
      'any.required': 'El contacto principal es requerido'
    }),

  cargo_contacto: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .allow(null, '')
    .messages({
      'string.min': 'El cargo del contacto debe tener al menos 2 caracteres',
      'string.max': 'El cargo del contacto no puede exceder 100 caracteres'
    }),

  email_contacto: Joi.string()
    .email()
    .max(100)
    .optional()
    .allow(null, '')
    .messages({
      'string.email': 'Debe ser un email válido',
      'string.max': 'El email del contacto no puede exceder 100 caracteres'
    }),

  telefono_contacto: Joi.string()
    .pattern(/^[\d\s\-\+\(\)]+$/)
    .min(8)
    .max(20)
    .optional()
    .allow(null, '')
    .messages({
      'string.pattern.base': 'El teléfono del contacto debe contener solo números, espacios, guiones, + y paréntesis',
      'string.min': 'El teléfono del contacto debe tener al menos 8 caracteres',
      'string.max': 'El teléfono del contacto no puede exceder 20 caracteres'
    }),

  calificacion_cliente: Joi.string()
    .valid('A', 'B', 'C', 'D')
    .default('B')
    .messages({
      'any.only': 'La calificación del cliente debe ser: A, B, C o D'
    }),

  limite_credito: Joi.number()
    .min(0)
    .max(999999999)
    .default(0)
    .messages({
      'number.min': 'El límite de crédito no puede ser negativo',
      'number.max': 'El límite de crédito es demasiado alto'
    }),

  condiciones_pago: Joi.number()
    .valid(15, 30, 45, 60, 90)
    .default(30)
    .messages({
      'any.only': 'Las condiciones de pago deben ser: 15, 30, 45, 60 o 90 días'
    }),

  descuento_corporativo: Joi.number()
    .min(0)
    .max(50)
    .default(0)
    .messages({
      'number.min': 'El descuento corporativo no puede ser negativo',
      'number.max': 'El descuento corporativo no puede exceder 50%'
    }),

  observaciones: Joi.string()
    .max(1000)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Las observaciones no pueden exceder 1000 caracteres'
    }),

  metadatos: Joi.object()
    .optional()
    .messages({
      'object.base': 'Los metadatos deben ser un objeto válido'
    })
});

// Esquema para actualizar cliente
const updateClienteSchema = Joi.object({
  razon_social: Joi.string()
    .min(2)
    .max(200)
    .optional()
    .messages({
      'string.min': 'La razón social debe tener al menos 2 caracteres',
      'string.max': 'La razón social no puede exceder 200 caracteres'
    }),

  nombre_comercial: Joi.string()
    .min(2)
    .max(200)
    .optional()
    .allow(null, '')
    .messages({
      'string.min': 'El nombre comercial debe tener al menos 2 caracteres',
      'string.max': 'El nombre comercial no puede exceder 200 caracteres'
    }),

  tipo_cliente: Joi.string()
    .valid('empresa', 'particular', 'gobierno')
    .optional()
    .messages({
      'any.only': 'El tipo de cliente debe ser: empresa, particular o gobierno'
    }),

  identificacion: Joi.string()
    .min(5)
    .max(50)
    .optional()
    .messages({
      'string.min': 'La identificación debe tener al menos 5 caracteres',
      'string.max': 'La identificación no puede exceder 50 caracteres'
    }),

  tipo_identificacion: Joi.string()
    .valid('cedula', 'ruc', 'pasaporte', 'cedula_juridica')
    .optional()
    .messages({
      'any.only': 'El tipo de identificación debe ser: cedula, ruc, pasaporte o cedula_juridica'
    }),

  email: Joi.string()
    .email()
    .max(100)
    .optional()
    .messages({
      'string.email': 'Debe ser un email válido',
      'string.max': 'El email no puede exceder 100 caracteres'
    }),

  telefono: Joi.string()
    .pattern(/^[\d\s\-\+\(\)]+$/)
    .min(8)
    .max(20)
    .optional()
    .messages({
      'string.pattern.base': 'El teléfono debe contener solo números, espacios, guiones, + y paréntesis',
      'string.min': 'El teléfono debe tener al menos 8 caracteres',
      'string.max': 'El teléfono no puede exceder 20 caracteres'
    }),

  telefono_secundario: Joi.string()
    .pattern(/^[\d\s\-\+\(\)]+$/)
    .min(8)
    .max(20)
    .optional()
    .allow(null, '')
    .messages({
      'string.pattern.base': 'El teléfono secundario debe contener solo números, espacios, guiones, + y paréntesis',
      'string.min': 'El teléfono secundario debe tener al menos 8 caracteres',
      'string.max': 'El teléfono secundario no puede exceder 20 caracteres'
    }),

  direccion: Joi.string()
    .min(10)
    .max(500)
    .optional()
    .messages({
      'string.min': 'La dirección debe tener al menos 10 caracteres',
      'string.max': 'La dirección no puede exceder 500 caracteres'
    }),

  ciudad: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'La ciudad debe tener al menos 2 caracteres',
      'string.max': 'La ciudad no puede exceder 100 caracteres'
    }),

  provincia: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'La provincia debe tener al menos 2 caracteres',
      'string.max': 'La provincia no puede exceder 100 caracteres'
    }),

  pais: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'El país debe tener al menos 2 caracteres',
      'string.max': 'El país no puede exceder 100 caracteres'
    }),

  codigo_postal: Joi.string()
    .max(20)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'El código postal no puede exceder 20 caracteres'
    }),

  sitio_web: Joi.string()
    .uri()
    .max(200)
    .optional()
    .allow(null, '')
    .messages({
      'string.uri': 'Debe ser una URL válida',
      'string.max': 'El sitio web no puede exceder 200 caracteres'
    }),

  sector_industria: Joi.string()
    .valid(
      'tecnologia', 'manufactura', 'servicios', 'comercio', 'construccion',
      'agricultura', 'turismo', 'educacion', 'salud', 'financiero',
      'transporte', 'energia', 'telecomunicaciones', 'gobierno', 'otro'
    )
    .optional()
    .allow(null, '')
    .messages({
      'any.only': 'Sector de industria no válido'
    }),

  tamaño_empresa: Joi.string()
    .valid('pequeña', 'mediana', 'grande', 'corporativa')
    .optional()
    .messages({
      'any.only': 'El tamaño de empresa debe ser: pequeña, mediana, grande o corporativa'
    }),

  contacto_principal: Joi.string()
    .min(2)
    .max(200)
    .optional()
    .messages({
      'string.min': 'El contacto principal debe tener al menos 2 caracteres',
      'string.max': 'El contacto principal no puede exceder 200 caracteres'
    }),

  cargo_contacto: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .allow(null, '')
    .messages({
      'string.min': 'El cargo del contacto debe tener al menos 2 caracteres',
      'string.max': 'El cargo del contacto no puede exceder 100 caracteres'
    }),

  email_contacto: Joi.string()
    .email()
    .max(100)
    .optional()
    .allow(null, '')
    .messages({
      'string.email': 'Debe ser un email válido',
      'string.max': 'El email del contacto no puede exceder 100 caracteres'
    }),

  telefono_contacto: Joi.string()
    .pattern(/^[\d\s\-\+\(\)]+$/)
    .min(8)
    .max(20)
    .optional()
    .allow(null, '')
    .messages({
      'string.pattern.base': 'El teléfono del contacto debe contener solo números, espacios, guiones, + y paréntesis',
      'string.min': 'El teléfono del contacto debe tener al menos 8 caracteres',
      'string.max': 'El teléfono del contacto no puede exceder 20 caracteres'
    }),

  calificacion_cliente: Joi.string()
    .valid('A', 'B', 'C', 'D')
    .optional()
    .messages({
      'any.only': 'La calificación del cliente debe ser: A, B, C o D'
    }),

  limite_credito: Joi.number()
    .min(0)
    .max(999999999)
    .optional()
    .messages({
      'number.min': 'El límite de crédito no puede ser negativo',
      'number.max': 'El límite de crédito es demasiado alto'
    }),

  condiciones_pago: Joi.number()
    .valid(15, 30, 45, 60, 90)
    .optional()
    .messages({
      'any.only': 'Las condiciones de pago deben ser: 15, 30, 45, 60 o 90 días'
    }),

  descuento_corporativo: Joi.number()
    .min(0)
    .max(50)
    .optional()
    .messages({
      'number.min': 'El descuento corporativo no puede ser negativo',
      'number.max': 'El descuento corporativo no puede exceder 50%'
    }),

  observaciones: Joi.string()
    .max(1000)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Las observaciones no pueden exceder 1000 caracteres'
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
const getClientesQuerySchema = Joi.object({
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

  estado: Joi.string()
    .valid('activo', 'inactivo', 'suspendido', 'prospecto')
    .optional()
    .messages({
      'any.only': 'El estado debe ser: activo, inactivo, suspendido o prospecto'
    }),

  tipo_cliente: Joi.string()
    .valid('empresa', 'particular', 'gobierno')
    .optional()
    .messages({
      'any.only': 'El tipo de cliente debe ser: empresa, particular o gobierno'
    }),

  sector_industria: Joi.string()
    .valid(
      'tecnologia', 'manufactura', 'servicios', 'comercio', 'construccion',
      'agricultura', 'turismo', 'educacion', 'salud', 'financiero',
      'transporte', 'energia', 'telecomunicaciones', 'gobierno', 'otro'
    )
    .optional()
    .messages({
      'any.only': 'Sector de industria no válido'
    }),

  tamaño_empresa: Joi.string()
    .valid('pequeña', 'mediana', 'grande', 'corporativa')
    .optional()
    .messages({
      'any.only': 'El tamaño de empresa debe ser: pequeña, mediana, grande o corporativa'
    }),

  ciudad: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'La ciudad debe tener al menos 2 caracteres',
      'string.max': 'La ciudad no puede exceder 100 caracteres'
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
    .valid('razon_social', 'fecha_creacion', 'estado', 'ciudad', 'total_proyectos')
    .default('razon_social')
    .messages({
      'any.only': 'El ordenamiento debe ser: razon_social, fecha_creacion, estado, ciudad o total_proyectos'
    }),

  order: Joi.string()
    .valid('asc', 'desc')
    .default('asc')
    .messages({
      'any.only': 'El orden debe ser: asc o desc'
    })
});

// Esquema para cambio de estado
const changeStatusSchema = Joi.object({
  estado: Joi.string()
    .valid('activo', 'inactivo', 'suspendido', 'prospecto')
    .required()
    .messages({
      'any.only': 'El estado debe ser: activo, inactivo, suspendido o prospecto',
      'any.required': 'El estado es requerido'
    })
});

// Esquema para asignar validador
const asignarValidadorSchema = Joi.object({
  usuario_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.integer': 'El ID del usuario debe ser un número entero',
      'number.positive': 'El ID del usuario debe ser positivo',
      'any.required': 'El ID del usuario es requerido'
    })
});

// Esquema para crear proyecto
const createProyectoSchema = Joi.object({
  nombre: Joi.string()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.min': 'El nombre del proyecto debe tener al menos 2 caracteres',
      'string.max': 'El nombre del proyecto no puede exceder 200 caracteres',
      'any.required': 'El nombre del proyecto es requerido'
    }),

  descripcion: Joi.string()
    .min(10)
    .max(1000)
    .optional()
    .allow(null, '')
    .messages({
      'string.min': 'La descripción debe tener al menos 10 caracteres',
      'string.max': 'La descripción no puede exceder 1000 caracteres'
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
    .optional()
    .messages({
      'date.format': 'La fecha de fin estimada debe estar en formato ISO (YYYY-MM-DD)',
      'date.greater': 'La fecha de fin estimada debe ser posterior a la fecha de inicio'
    }),

  presupuesto_estimado: Joi.number()
    .min(0)
    .max(999999999)
    .optional()
    .messages({
      'number.min': 'El presupuesto estimado no puede ser negativo',
      'number.max': 'El presupuesto estimado es demasiado alto'
    }),

  estado: Joi.string()
    .valid('planificacion', 'activo', 'pausado', 'completado', 'cancelado')
    .default('planificacion')
    .messages({
      'any.only': 'El estado del proyecto debe ser: planificacion, activo, pausado, completado o cancelado'
    }),

  prioridad: Joi.string()
    .valid('baja', 'media', 'alta', 'critica')
    .default('media')
    .messages({
      'any.only': 'La prioridad debe ser: baja, media, alta o critica'
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
  createClienteSchema,
  updateClienteSchema,
  getClientesQuerySchema,
  changeStatusSchema,
  asignarValidadorSchema,
  createProyectoSchema,
  idParamSchema
};
