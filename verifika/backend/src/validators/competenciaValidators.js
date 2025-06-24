// competenciaValidators.js - Esquemas de validación Joi para competencias
const Joi = require('joi');

// Esquema para crear competencia
const createCompetenciaSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required().messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre no puede exceder 100 caracteres',
    'any.required': 'El nombre es obligatorio'
  }),
  descripcion: Joi.string().max(500).optional().allow(null).messages({
    'string.max': 'La descripción no puede exceder 500 caracteres'
  }),
  categoria: Joi.string().max(50).optional().allow(null).messages({
    'string.max': 'La categoría no puede exceder 50 caracteres'
  }),
  nivel_requerido: Joi.string().valid('basico', 'intermedio', 'avanzado', 'experto').default('basico'),
  certificacion_requerida: Joi.boolean().default(false),
  activo: Joi.boolean().default(true)
});

// Esquema para actualizar competencia
const updateCompetenciaSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).optional().messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre no puede exceder 100 caracteres'
  }),
  descripcion: Joi.string().max(500).optional().allow(null).messages({
    'string.max': 'La descripción no puede exceder 500 caracteres'
  }),
  categoria: Joi.string().max(50).optional().allow(null).messages({
    'string.max': 'La categoría no puede exceder 50 caracteres'
  }),
  nivel_requerido: Joi.string().valid('basico', 'intermedio', 'avanzado', 'experto').optional(),
  certificacion_requerida: Joi.boolean().optional(),
  activo: Joi.boolean().optional()
});

// Esquema para filtros de búsqueda
const searchCompetenciasSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(50),
  categoria: Joi.string().max(50).optional(),
  nivel_requerido: Joi.string().valid('basico', 'intermedio', 'avanzado', 'experto').optional(),
  certificacion_requerida: Joi.boolean().optional(),
  activo: Joi.boolean().default(true),
  search: Joi.string().max(100).optional().messages({
    'string.max': 'El término de búsqueda no puede exceder 100 caracteres'
  })
});

// Esquema para cambiar estado
const changeStatusSchema = Joi.object({
  activo: Joi.boolean().required().messages({
    'any.required': 'El estado activo es obligatorio'
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
  createCompetenciaSchema,
  updateCompetenciaSchema,
  searchCompetenciasSchema,
  changeStatusSchema,
  validateRequest,
  validateQuery
};