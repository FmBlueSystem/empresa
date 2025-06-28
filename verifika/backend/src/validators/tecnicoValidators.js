// tecnicoValidators.js - Esquemas de validación Joi para técnicos
const Joi = require('joi');

// Esquema para crear técnico
const createTecnicoSchema = Joi.object({
  // Datos del usuario
  usuario: Joi.object({
    usuario_id: Joi.number().integer().positive().optional(),
    email: Joi.string().email().required().messages({
      'string.email': 'El email debe tener un formato válido',
      'any.required': 'El email es obligatorio'
    }),
    nombre: Joi.string().min(2).max(100).required().messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres',
      'any.required': 'El nombre es obligatorio'
    }),
    apellido: Joi.string().min(2).max(100).required().messages({
      'string.min': 'El apellido debe tener al menos 2 caracteres',
      'string.max': 'El apellido no puede exceder 100 caracteres',
      'any.required': 'El apellido es obligatorio'
    }),
    telefono: Joi.string().pattern(/^[+]?[\d\s\-()]{8,20}$/).optional().messages({
      'string.pattern.base': 'El teléfono debe tener un formato válido'
    }),
    password: Joi.string().min(6).optional().messages({
      'string.min': 'La contraseña debe tener al menos 6 caracteres'
    })
  }).required(),

  // Datos del perfil técnico
  perfil: Joi.object({
    numero_identificacion: Joi.string().max(50).optional(),
    fecha_nacimiento: Joi.date().max('now').optional().messages({
      'date.max': 'La fecha de nacimiento no puede ser futura'
    }),
    direccion: Joi.string().max(500).optional(),
    ciudad: Joi.string().max(100).optional(),
    pais: Joi.string().max(100).default('España'),
    experiencia_anos: Joi.number().integer().min(0).max(50).default(0).messages({
      'number.min': 'Los años de experiencia no pueden ser negativos',
      'number.max': 'Los años de experiencia no pueden exceder 50'
    }),
    nivel_experiencia: Joi.string().valid('junior', 'intermedio', 'senior', 'experto').default('junior'),
    disponibilidad: Joi.string().valid('disponible', 'ocupado', 'vacaciones', 'inactivo').default('disponible'),
    tarifa_por_hora: Joi.number().precision(2).min(0).max(9999.99).optional().messages({
      'number.min': 'La tarifa por hora no puede ser negativa',
      'number.max': 'La tarifa por hora no puede exceder 9999.99'
    }),
    moneda: Joi.string().length(3).uppercase().default('EUR').messages({
      'string.length': 'La moneda debe ser un código de 3 letras'
    }),
    biografia: Joi.string().max(1000).optional().messages({
      'string.max': 'La biografía no puede exceder 1000 caracteres'
    })
  }).optional()
});

// Esquema para actualizar técnico
const updateTecnicoSchema = Joi.object({
  numero_identificacion: Joi.string().max(50).optional(),
  fecha_nacimiento: Joi.date().max('now').optional().messages({
    'date.max': 'La fecha de nacimiento no puede ser futura'
  }),
  direccion: Joi.string().max(500).optional(),
  ciudad: Joi.string().max(100).optional(),
  pais: Joi.string().max(100).optional(),
  experiencia_anos: Joi.number().integer().min(0).max(50).optional().messages({
    'number.min': 'Los años de experiencia no pueden ser negativos',
    'number.max': 'Los años de experiencia no pueden exceder 50'
  }),
  nivel_experiencia: Joi.string().valid('junior', 'intermedio', 'senior', 'experto').optional(),
  disponibilidad: Joi.string().valid('disponible', 'ocupado', 'vacaciones', 'inactivo').optional(),
  tarifa_por_hora: Joi.number().precision(2).min(0).max(9999.99).optional().allow(null).messages({
    'number.min': 'La tarifa por hora no puede ser negativa',
    'number.max': 'La tarifa por hora no puede exceder 9999.99'
  }),
  moneda: Joi.string().length(3).uppercase().optional().messages({
    'string.length': 'La moneda debe ser un código de 3 letras'
  }),
  biografia: Joi.string().max(1000).optional().allow(null).messages({
    'string.max': 'La biografía no puede exceder 1000 caracteres'
  }),
  foto_perfil: Joi.string().uri().optional().allow(null).messages({
    'string.uri': 'La foto de perfil debe ser una URL válida'
  })
});

// Esquema para filtros de búsqueda
const searchTecnicosSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  disponibilidad: Joi.string().valid('disponible', 'ocupado', 'vacaciones', 'inactivo').optional(),
  nivel_experiencia: Joi.string().valid('junior', 'intermedio', 'senior', 'experto').optional(),
  ciudad: Joi.string().max(100).optional(),
  competencia_id: Joi.number().integer().positive().optional(),
  search: Joi.string().max(100).optional().messages({
    'string.max': 'El término de búsqueda no puede exceder 100 caracteres'
  })
});

// Esquema para cambiar estado
const changeStatusSchema = Joi.object({
  estado: Joi.string().valid('activo', 'inactivo', 'pendiente', 'suspendido').required().messages({
    'any.required': 'El estado es obligatorio',
    'any.only': 'El estado debe ser: activo, inactivo, pendiente o suspendido'
  })
});

// Esquema para agregar competencia
const addCompetenciaSchema = Joi.object({
  competencia_id: Joi.number().integer().positive().required().messages({
    'any.required': 'El ID de la competencia es obligatorio',
    'number.positive': 'El ID de la competencia debe ser un número positivo'
  }),
  nivel_actual: Joi.string().valid('basico', 'intermedio', 'avanzado', 'experto').default('basico'),
  certificado: Joi.boolean().default(false),
  fecha_certificacion: Joi.date().max('now').optional().when('certificado', {
    is: true,
    then: Joi.required().messages({
      'any.required': 'La fecha de certificación es obligatoria cuando está certificado'
    })
  }),
  fecha_vencimiento: Joi.date().min('now').optional().messages({
    'date.min': 'La fecha de vencimiento debe ser futura'
  })
});

// Esquema para upload de documento
const uploadDocumentoSchema = Joi.object({
  tipo_documento: Joi.string().valid('cv', 'certificacion', 'identificacion', 'seguridad', 'otro').required().messages({
    'any.required': 'El tipo de documento es obligatorio'
  }),
  descripcion: Joi.string().max(500).optional().messages({
    'string.max': 'La descripción no puede exceder 500 caracteres'
  }),
  fecha_vencimiento: Joi.date().min('now').optional().messages({
    'date.min': 'La fecha de vencimiento debe ser futura'
  })
});

// Esquema para disponibilidad
const updateDisponibilidadSchema = Joi.object({
  disponibilidad: Joi.string().valid('disponible', 'ocupado', 'vacaciones', 'inactivo').required().messages({
    'any.required': 'La disponibilidad es obligatoria'
  }),
  fecha_inicio: Joi.date().optional(),
  fecha_fin: Joi.date().min(Joi.ref('fecha_inicio')).optional().messages({
    'date.min': 'La fecha fin debe ser posterior a la fecha inicio'
  }),
  observaciones: Joi.string().max(200).optional().messages({
    'string.max': 'Las observaciones no pueden exceder 200 caracteres'
  })
});

// Middleware de validación
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true,
      convert: true 
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      return res.status(400).json({
        success: false,
        message: 'Errores de validación en los datos enviados',
        errors: errorDetails
      });
    }

    req.validatedData = value;
    next();
  };
};

// Middleware de validación para query parameters
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, { 
      abortEarly: false,
      stripUnknown: true,
      convert: true 
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      return res.status(400).json({
        success: false,
        message: 'Errores de validación en los parámetros de consulta',
        errors: errorDetails
      });
    }

    req.validatedQuery = value;
    next();
  };
};

module.exports = {
  createTecnicoSchema,
  updateTecnicoSchema,
  searchTecnicosSchema,
  changeStatusSchema,
  addCompetenciaSchema,
  uploadDocumentoSchema,
  updateDisponibilidadSchema,
  validateRequest,
  validateQuery
};