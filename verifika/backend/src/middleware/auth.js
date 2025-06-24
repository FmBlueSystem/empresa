// auth.js - Middleware de autenticación y autorización para Verifika
const Usuario = require('../models/Usuario');
const redisClient = require('../config/redis');
const logger = require('../config/logger');

// Middleware para verificar autenticación JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido',
        code: 'TOKEN_REQUIRED'
      });
    }

    // Verificar JWT
    const decoded = Usuario.verifyJWT(token);
    
    // Verificar que el token esté en Redis (no ha sido revocado)
    const storedToken = await redisClient.getSession(decoded.id);
    if (!storedToken || storedToken !== token) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado',
        code: 'TOKEN_INVALID'
      });
    }

    // Obtener usuario actual de la base de datos
    const user = await Usuario.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    // Verificar que el usuario esté activo
    if (!user.esActivo) {
      return res.status(403).json({
        success: false,
        message: 'Usuario inactivo',
        code: 'USER_INACTIVE'
      });
    }

    // Agregar usuario a la request
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    logger.error('Error en autenticación:', error);
    
    if (error.message === 'Token expirado') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Token inválido',
      code: 'TOKEN_INVALID'
    });
  }
};

// Middleware para verificar roles específicos
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
        code: 'NOT_AUTHENTICATED'
      });
    }

    if (!roles.includes(req.user.rol)) {
      logger.logAuth('access_denied', req.user.id, {
        requiredRoles: roles,
        userRole: req.user.rol,
        endpoint: req.originalUrl
      });

      return res.status(403).json({
        success: false,
        message: 'Permisos insuficientes',
        code: 'INSUFFICIENT_PERMISSIONS',
        requiredRoles: roles,
        userRole: req.user.rol
      });
    }

    next();
  };
};

// Middleware para verificar que el usuario es administrador
const requireAdmin = requireRole('admin');

// Middleware para verificar que el usuario es técnico
const requireTecnico = requireRole('tecnico');

// Middleware para verificar que el usuario es cliente
const requireCliente = requireRole('cliente');

// Middleware para verificar que el usuario es validador
const requireValidador = requireRole('validador', 'admin');

// Middleware para verificar que el usuario puede gestionar técnicos
const requireTecnicoManager = requireRole('admin');

// Middleware para verificar que el usuario puede validar actividades
const requireActivityValidator = requireRole('validador', 'admin');

// Middleware para verificar que el usuario puede crear actividades
const requireActivityCreator = requireRole('tecnico');

// Middleware para verificar que el usuario puede ver/editar su propio perfil o es admin
const requireOwnerOrAdmin = (req, res, next) => {
  const targetUserId = parseInt(req.params.id || req.params.userId);
  const currentUserId = req.user.id;
  const isAdmin = req.user.esAdmin;

  if (targetUserId === currentUserId || isAdmin) {
    next();
  } else {
    logger.logAuth('access_denied_ownership', req.user.id, {
      targetUserId,
      currentUserId,
      endpoint: req.originalUrl
    });

    return res.status(403).json({
      success: false,
      message: 'Solo puedes acceder a tu propio perfil',
      code: 'ACCESS_DENIED_OWNERSHIP'
    });
  }
};

// Middleware para logging de acceso a endpoints sensibles
const logSensitiveAccess = (action) => {
  return (req, res, next) => {
    logger.logAuth('sensitive_access', req.user.id, {
      action,
      endpoint: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    next();
  };
};

// Middleware para verificar límites de rate limiting por rol
const checkRoleBasedRateLimit = (req, res, next) => {
  // Los admins tienen límites más altos
  if (req.user && req.user.esAdmin) {
    req.rateLimit = {
      max: 500, // 500 requests por ventana
      windowMs: 15 * 60 * 1000 // 15 minutos
    };
  } else if (req.user && req.user.esTecnico) {
    req.rateLimit = {
      max: 200, // 200 requests por ventana
      windowMs: 15 * 60 * 1000
    };
  } else {
    req.rateLimit = {
      max: 100, // 100 requests por ventana (default)
      windowMs: 15 * 60 * 1000
    };
  }
  
  next();
};

// Middleware para verificar estado del usuario en operaciones críticas
const requireActiveUser = (req, res, next) => {
  if (!req.user.esActivo) {
    return res.status(403).json({
      success: false,
      message: 'Tu cuenta no está activa. Contacta al administrador.',
      code: 'USER_NOT_ACTIVE',
      userStatus: req.user.estado
    });
  }
  next();
};

// Middleware para verificar email verificado en operaciones sensibles
const requireVerifiedEmail = (req, res, next) => {
  if (!req.user.email_verificado) {
    return res.status(403).json({
      success: false,
      message: 'Debes verificar tu email para realizar esta acción',
      code: 'EMAIL_NOT_VERIFIED'
    });
  }
  next();
};

// Función para revocar token (logout)
const revokeToken = async (userId) => {
  try {
    await redisClient.deleteSession(userId);
    logger.logAuth('token_revoked', userId);
    return true;
  } catch (error) {
    logger.error('Error al revocar token:', error);
    return false;
  }
};

// Función para revocar todos los tokens de un usuario
const revokeAllUserTokens = async (userId) => {
  try {
    // En una implementación más compleja, aquí buscaríamos todos los tokens del usuario
    await redisClient.deleteSession(userId);
    logger.logAuth('all_tokens_revoked', userId);
    return true;
  } catch (error) {
    logger.error('Error al revocar todos los tokens:', error);
    return false;
  }
};

// Middleware para verificar permisos específicos de recursos
const checkResourcePermission = (resourceType) => {
  return async (req, res, next) => {
    const user = req.user;
    const resourceId = req.params.id;

    try {
      switch (resourceType) {
        case 'tecnico':
          // Solo admins pueden gestionar técnicos, o el técnico su propio perfil
          if (user.esAdmin || (user.esTecnico && user.id === parseInt(resourceId))) {
            next();
          } else {
            throw new Error('Sin permisos para gestionar este técnico');
          }
          break;

        case 'actividad':
          // Verificar que el técnico solo pueda ver/editar sus propias actividades
          // Esta lógica se implementaría consultando la base de datos
          if (user.esAdmin || user.esValidador) {
            next();
          } else if (user.esTecnico) {
            // Aquí iría la lógica para verificar que la actividad pertenece al técnico
            next();
          } else {
            throw new Error('Sin permisos para acceder a esta actividad');
          }
          break;

        default:
          next();
      }
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: error.message,
        code: 'RESOURCE_ACCESS_DENIED'
      });
    }
  };
};

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireTecnico,
  requireCliente,
  requireValidador,
  requireTecnicoManager,
  requireActivityValidator,
  requireActivityCreator,
  requireOwnerOrAdmin,
  requireActiveUser,
  requireVerifiedEmail,
  logSensitiveAccess,
  checkRoleBasedRateLimit,
  checkResourcePermission,
  revokeToken,
  revokeAllUserTokens
};