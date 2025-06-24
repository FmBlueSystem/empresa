// authValidators.js - Esquemas de validación para autenticación en Verifika
const Joi = require('joi');

// Validaciones comunes
const emailSchema = Joi.string()
  .email({ tlds: { allow: false } })
  .min(5)
  .max(255)
  .required()
  .messages({
    'string.email': 'El email debe tener un formato válido',
    'string.min': 'El email debe tener al menos 5 caracteres',
    'string.max': 'El email no puede tener más de 255 caracteres',
    'any.required': 'El email es requerido'
  });

const passwordSchema = Joi.string()
  .min(8)
  .max(128)
  .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
  .required()
  .messages({
    'string.min': 'La contraseña debe tener al menos 8 caracteres',
    'string.max': 'La contraseña no puede tener más de 128 caracteres',
    'string.pattern.base': 'La contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial',
    'any.required': 'La contraseña es requerida'
  });

const nombreSchema = Joi.string()
  .min(2)
  .max(100)
  .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)
  .required()
  .messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre no puede tener más de 100 caracteres',
    'string.pattern.base': 'El nombre solo puede contener letras y espacios',
    'any.required': 'El nombre es requerido'
  });

const apellidoSchema = Joi.string()
  .min(2)
  .max(100)
  .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)
  .required()
  .messages({
    'string.min': 'El apellido debe tener al menos 2 caracteres',
    'string.max': 'El apellido no puede tener más de 100 caracteres',
    'string.pattern.base': 'El apellido solo puede contener letras y espacios',
    'any.required': 'El apellido es requerido'
  });

const telefonoSchema = Joi.string()
  .pattern(/^[+]?[\d\s-()]+$/)
  .min(9)
  .max(20)
  .optional()
  .messages({
    'string.pattern.base': 'El teléfono debe tener un formato válido',
    'string.min': 'El teléfono debe tener al menos 9 caracteres',
    'string.max': 'El teléfono no puede tener más de 20 caracteres'
  });

const rolSchema = Joi.string()
  .valid('admin', 'tecnico', 'cliente', 'validador')
  .required()
  .messages({
    'any.only': 'El rol debe ser uno de: admin, tecnico, cliente, validador',
    'any.required': 'El rol es requerido'
  });

// Schema para login
const loginSchema = Joi.object({
  email: emailSchema,
  password: Joi.string().required().messages({
    'any.required': 'La contraseña es requerida'
  }),
  remember: Joi.boolean().optional().default(false)
});

// Schema para registro de usuario
const registerSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
  nombre: nombreSchema,
  apellido: apellidoSchema,
  telefono: telefonoSchema,
  rol: rolSchema,
  metadatos: Joi.object().optional()
});

// Schema para crear usuario (admin)
const createUserSchema = Joi.object({
  email: emailSchema,
  nombre: nombreSchema,
  apellido: apellidoSchema,
  telefono: telefonoSchema,
  rol: rolSchema,
  estado: Joi.string()
    .valid('activo', 'inactivo', 'pendiente', 'suspendido')
    .optional()
    .default('pendiente'),
  enviar_invitacion: Joi.boolean().optional().default(true),
  metadatos: Joi.object().optional()
});

// Schema para invitar usuario
const inviteUserSchema = Joi.object({
  email: emailSchema,
  nombre: nombreSchema,
  apellido: apellidoSchema,
  rol: rolSchema,
  mensaje_personalizado: Joi.string().max(500).optional(),
  expira_en_horas: Joi.number().integer().min(1).max(168).optional().default(24) // máximo 7 días
});

// Schema para activar cuenta con token de invitación
const activateAccountSchema = Joi.object({
  token: Joi.string().required().messages({
    'any.required': 'El token de activación es requerido'
  }),
  password: passwordSchema
});

// Schema para solicitar reset de contraseña
const requestPasswordResetSchema = Joi.object({
  email: emailSchema
});

// Schema para reset de contraseña
const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    'any.required': 'El token de reset es requerido'
  }),
  password: passwordSchema
});

// Schema para cambiar contraseña (usuario autenticado)
const changePasswordSchema = Joi.object({
  current_password: Joi.string().required().messages({
    'any.required': 'La contraseña actual es requerida'
  }),
  new_password: passwordSchema
});

// Schema para actualizar perfil de usuario
const updateProfileSchema = Joi.object({
  nombre: nombreSchema,
  apellido: apellidoSchema,
  telefono: telefonoSchema,
  metadatos: Joi.object().optional()
});

// Schema para actualizar usuario (admin)
const updateUserSchema = Joi.object({
  nombre: nombreSchema,
  apellido: apellidoSchema,
  telefono: telefonoSchema,
  estado: Joi.string()
    .valid('activo', 'inactivo', 'pendiente', 'suspendido')
    .optional(),
  email_verificado: Joi.boolean().optional(),
  metadatos: Joi.object().optional()
}).min(1); // Al menos un campo debe estar presente

// Schema para verificar email
const verifyEmailSchema = Joi.object({
  token: Joi.string().required().messages({
    'any.required': 'El token de verificación es requerido'
  })
});

// Schema para reenviar verificación de email
const resendVerificationSchema = Joi.object({
  email: emailSchema
});

// Schema para búsqueda/filtrado de usuarios
const getUsersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
  search: Joi.string().min(2).max(100).optional(),
  rol: Joi.string().valid('admin', 'tecnico', 'cliente', 'validador').optional(),
  estado: Joi.string().valid('activo', 'inactivo', 'pendiente', 'suspendido').optional(),
  sort: Joi.string()
    .valid('nombre', 'apellido', 'email', 'fecha_creacion', 'fecha_ultimo_login')
    .optional()
    .default('fecha_creacion'),
  order: Joi.string().valid('asc', 'desc').optional().default('desc')
});

// Schema para obtener estadísticas
const getStatsQuerySchema = Joi.object({
  periodo: Joi.string()
    .valid('dia', 'semana', 'mes', 'año')
    .optional()
    .default('mes'),
  fecha_inicio: Joi.date().iso().optional(),
  fecha_fin: Joi.date().iso().min(Joi.ref('fecha_inicio')).optional()
});

// Función helper para validar ID de parámetros de ruta
const validateId = (value, helpers) => {
  const id = parseInt(value);
  if (isNaN(id) || id <= 0) {
    return helpers.error('any.invalid');
  }
  return id;
};

const idParamSchema = Joi.object({
  id: Joi.custom(validateId).required().messages({
    'any.invalid': 'El ID debe ser un número entero positivo',
    'any.required': 'El ID es requerido'
  })
});

module.exports = {
  // Esquemas principales
  loginSchema,
  registerSchema,
  createUserSchema,
  inviteUserSchema,
  activateAccountSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
  updateUserSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  
  // Esquemas de query
  getUsersQuerySchema,
  getStatsQuerySchema,
  
  // Esquemas de parámetros
  idParamSchema,
  
  // Esquemas reutilizables
  emailSchema,
  passwordSchema,
  nombreSchema,
  apellidoSchema,
  telefonoSchema,
  rolSchema
};