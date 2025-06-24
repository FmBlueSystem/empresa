// errorHandler.js - Middleware de manejo de errores para Verifika
const logger = require('../config/logger');

// Clase para errores de aplicación personalizados
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = {}) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Errores específicos de Verifika
class ValidationError extends AppError {
  constructor(message, details = {}) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'No autorizado') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Permisos insuficientes') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Recurso') {
    super(`${resource} no encontrado`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

class DuplicateError extends AppError {
  constructor(field = 'Recurso') {
    super(`${field} ya existe`, 409, 'DUPLICATE_ERROR');
    this.name = 'DuplicateError';
  }
}

class BusinessLogicError extends AppError {
  constructor(message, details = {}) {
    super(message, 422, 'BUSINESS_LOGIC_ERROR', details);
    this.name = 'BusinessLogicError';
  }
}

// Middleware principal de manejo de errores
const errorHandler = (error, req, res, next) => {
  let err = { ...error };
  err.message = error.message;

  // Log del error
  logger.error('Error en aplicación:', {
    error: err.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user ? req.user.id : 'anonymous',
    timestamp: new Date().toISOString()
  });

  // Errores de MongoDB/MySQL
  if (error.code === 'ER_DUP_ENTRY') {
    const message = 'Recurso duplicado';
    err = new DuplicateError(message);
  }

  // Errores de validación de MySQL
  if (error.code === 'ER_BAD_NULL_ERROR') {
    const message = 'Campo requerido faltante';
    err = new ValidationError(message);
  }

  // Errores de constraint de foreign key
  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    const message = 'Referencia inválida en base de datos';
    err = new ValidationError(message);
  }

  // Errores de JWT
  if (error.name === 'JsonWebTokenError') {
    const message = 'Token JWT inválido';
    err = new AuthenticationError(message);
  }

  if (error.name === 'TokenExpiredError') {
    const message = 'Token JWT expirado';
    err = new AuthenticationError(message);
  }

  // Errores de validación de Joi
  if (error.name === 'ValidationError' && error.details) {
    const message = 'Error de validación';
    const details = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context?.value
    }));
    err = new ValidationError(message, { fields: details });
  }

  // Errores de Redis
  if (error.message && error.message.includes('Redis')) {
    const message = 'Error de conexión con cache';
    err = new AppError(message, 503, 'CACHE_ERROR');
  }

  // Errores de base de datos de conexión
  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    const message = 'Error de conexión con base de datos';
    err = new AppError(message, 503, 'DATABASE_ERROR');
  }

  // Errores de archivo/upload
  if (error.code === 'LIMIT_FILE_SIZE') {
    const message = 'Archivo demasiado grande';
    err = new ValidationError(message);
  }

  if (error.code === 'LIMIT_FILE_COUNT') {
    const message = 'Demasiados archivos';
    err = new ValidationError(message);
  }

  // Errores de email
  if (error.code === 'EAUTH' || error.responseCode === 535) {
    const message = 'Error de autenticación de email';
    err = new AppError(message, 503, 'EMAIL_ERROR');
  }

  // Preparar respuesta de error
  const response = {
    success: false,
    message: err.message || 'Error interno del servidor',
    code: err.code || 'INTERNAL_ERROR',
    timestamp: new Date().toISOString()
  };

  // En desarrollo, incluir más detalles
  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
    response.details = err.details;
  }

  // Incluir detalles específicos para errores de validación
  if (err.details && Object.keys(err.details).length > 0) {
    response.details = err.details;
  }

  // Código de estado HTTP
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json(response);
};

// Middleware para capturar rutas no encontradas
const notFound = (req, res, next) => {
  const error = new NotFoundError(`Ruta ${req.originalUrl}`);
  next(error);
};

// Middleware para validar request body
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { 
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, ''),
        value: detail.context?.value
      }));

      return next(new ValidationError('Datos de entrada inválidos', { fields: details }));
    }

    next();
  };
};

// Middleware para capturar errores async
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Función para crear respuestas de éxito consistentes
const sendSuccess = (res, data = {}, message = 'Operación exitosa', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

// Función para crear respuestas paginadas
const sendPaginatedResponse = (res, data, pagination, message = 'Datos obtenidos') => {
  res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total: pagination.total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(pagination.total / pagination.limit),
      hasNextPage: pagination.page < Math.ceil(pagination.total / pagination.limit),
      hasPrevPage: pagination.page > 1
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  // Clases de error
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  DuplicateError,
  BusinessLogicError,

  // Middlewares
  errorHandler,
  notFound,
  validateRequest,
  asyncHandler,

  // Utilidades de respuesta
  sendSuccess,
  sendPaginatedResponse
};