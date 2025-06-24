// auth.js - Rutas de autenticación para Verifika
const express = require('express');
const rateLimit = require('express-rate-limit');
const Usuario = require('../models/Usuario');
const redisClient = require('../config/redis');
const logger = require('../config/logger');
const { 
  authenticateToken, 
  requireAdmin, 
  requireOwnerOrAdmin,
  revokeToken,
  revokeAllUserTokens
} = require('../middleware/auth');
const { 
  AppError, 
  ValidationError, 
  AuthenticationError, 
  NotFoundError,
  DuplicateError,
  asyncHandler,
  validateRequest,
  sendSuccess 
} = require('../middleware/errorHandler');
const {
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
  getUsersQuerySchema,
  idParamSchema
} = require('../validators/authValidators');

const router = express.Router();

// Rate limiting específico para autenticación
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos por IP
  message: {
    success: false,
    message: 'Demasiados intentos de login. Intenta en 15 minutos.',
    code: 'TOO_MANY_LOGIN_ATTEMPTS'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // No aplicar rate limit en desarrollo para admins
    return process.env.NODE_ENV === 'development' && 
           req.body.email === 'admin@bluesystem.io';
  }
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 solicitudes por IP
  message: {
    success: false,
    message: 'Demasiadas solicitudes de reset. Intenta en 1 hora.',
    code: 'TOO_MANY_RESET_ATTEMPTS'
  }
});

// ============================================
// RUTAS PÚBLICAS (sin autenticación)
// ============================================

// POST /api/auth/login - Iniciar sesión
router.post('/login', 
  authLimiter,
  validateRequest(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password, remember } = req.body;

    // Buscar usuario por email
    const user = await Usuario.findByEmail(email);
    if (!user) {
      logger.logAuth('login_failed', null, { email, reason: 'user_not_found' });
      throw new AuthenticationError('Credenciales inválidas');
    }

    // Verificar contraseña
    const isValidPassword = await user.verifyPassword(password);
    if (!isValidPassword) {
      logger.logAuth('login_failed', user.id, { email, reason: 'invalid_password' });
      throw new AuthenticationError('Credenciales inválidas');
    }

    // Verificar que el usuario esté activo
    if (!user.esActivo) {
      logger.logAuth('login_failed', user.id, { email, reason: 'user_inactive', estado: user.estado });
      throw new AuthenticationError(`Cuenta ${user.estado}. Contacta al administrador.`);
    }

    // Generar JWT
    const token = user.generateJWT();
    
    // Guardar token en Redis
    const expiresIn = remember ? 30 * 24 * 3600 : 24 * 3600; // 30 días o 24 horas
    await redisClient.setSession(user.id, token, expiresIn);

    // Actualizar último login
    await user.updateLastLogin();

    logger.logAuth('login_success', user.id, { email });

    sendSuccess(res, {
      user: user.toJSON(),
      token,
      expiresIn: expiresIn * 1000 // milisegundos para el frontend
    }, 'Login exitoso');
  })
);

// POST /api/auth/register - Registro público (si está habilitado)
router.post('/register',
  validateRequest(registerSchema),
  asyncHandler(async (req, res) => {
    // Verificar si el registro público está habilitado
    const allowPublicRegistration = process.env.ALLOW_PUBLIC_REGISTRATION === 'true';
    if (!allowPublicRegistration) {
      throw new AppError('El registro público no está habilitado', 403, 'REGISTRATION_DISABLED');
    }

    const userData = req.body;
    
    // Solo permitir registro como técnico en registro público
    if (userData.rol !== 'tecnico') {
      throw new ValidationError('Solo se permite registro como técnico');
    }

    try {
      const user = await Usuario.create(userData);
      
      // Enviar email de verificación (implementar después)
      // await sendVerificationEmail(user);

      sendSuccess(res, {
        user: user.toJSON(),
        message: 'Cuenta creada. Revisa tu email para verificar la cuenta.'
      }, 'Registro exitoso', 201);
    } catch (error) {
      if (error.message.includes('ya está registrado')) {
        throw new DuplicateError('Email');
      }
      throw error;
    }
  })
);

// POST /api/auth/activate - Activar cuenta con token de invitación
router.post('/activate',
  validateRequest(activateAccountSchema),
  asyncHandler(async (req, res) => {
    const { token, password } = req.body;

    // Verificar token en Redis
    // Esto requiere implementar lógica de tokens de activación
    // Por ahora, simularemos que el token es válido

    // En implementación real, extraer email del token
    const email = 'user@example.com'; // placeholder
    
    const user = await Usuario.findByEmail(email);
    if (!user) {
      throw new NotFoundError('Usuario');
    }

    // Actualizar contraseña y activar usuario
    await user.updatePassword(password);
    user.estado = 'activo';
    user.email_verificado = true;
    await user.save();

    logger.logAuth('account_activated', user.id, { email });

    sendSuccess(res, {
      user: user.toJSON()
    }, 'Cuenta activada exitosamente');
  })
);

// POST /api/auth/forgot-password - Solicitar reset de contraseña
router.post('/forgot-password',
  passwordResetLimiter,
  validateRequest(requestPasswordResetSchema),
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await Usuario.findByEmail(email);
    if (!user) {
      // Por seguridad, siempre responder éxito
      sendSuccess(res, {}, 'Si el email existe, recibirás instrucciones de reset');
      return;
    }

    // Generar token de reset
    const resetToken = require('crypto').randomBytes(32).toString('hex');
    
    // Guardar token en Redis con expiración de 1 hora
    await redisClient.setResetToken(email, resetToken, 3600);

    // Enviar email con token (implementar después)
    // await sendPasswordResetEmail(user, resetToken);

    logger.logAuth('password_reset_requested', user.id, { email });

    sendSuccess(res, {}, 'Si el email existe, recibirás instrucciones de reset');
  })
);

// POST /api/auth/reset-password - Reset de contraseña con token
router.post('/reset-password',
  validateRequest(resetPasswordSchema),
  asyncHandler(async (req, res) => {
    const { token, password } = req.body;

    // En implementación real, extraer email del token
    const email = 'user@example.com'; // placeholder
    
    // Verificar token en Redis
    const storedToken = await redisClient.getResetToken(email);
    if (!storedToken || storedToken !== token) {
      throw new ValidationError('Token de reset inválido o expirado');
    }

    const user = await Usuario.findByEmail(email);
    if (!user) {
      throw new NotFoundError('Usuario');
    }

    // Actualizar contraseña
    await user.updatePassword(password);
    
    // Eliminar token de reset
    await redisClient.deleteResetToken(email);
    
    // Revocar todas las sesiones existentes
    await revokeAllUserTokens(user.id);

    logger.logAuth('password_reset_completed', user.id, { email });

    sendSuccess(res, {}, 'Contraseña actualizada exitosamente');
  })
);

// ============================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ============================================

// POST /api/auth/logout - Cerrar sesión
router.post('/logout',
  authenticateToken,
  asyncHandler(async (req, res) => {
    await revokeToken(req.user.id);
    
    logger.logAuth('logout', req.user.id, { email: req.user.email });
    
    sendSuccess(res, {}, 'Sesión cerrada exitosamente');
  })
);

// POST /api/auth/logout-all - Cerrar todas las sesiones
router.post('/logout-all',
  authenticateToken,
  asyncHandler(async (req, res) => {
    await revokeAllUserTokens(req.user.id);
    
    logger.logAuth('logout_all', req.user.id, { email: req.user.email });
    
    sendSuccess(res, {}, 'Todas las sesiones cerradas exitosamente');
  })
);

// GET /api/auth/me - Obtener perfil del usuario actual
router.get('/me',
  authenticateToken,
  asyncHandler(async (req, res) => {
    sendSuccess(res, {
      user: req.user.toJSON()
    }, 'Perfil obtenido exitosamente');
  })
);

// PUT /api/auth/me - Actualizar perfil del usuario actual
router.put('/me',
  authenticateToken,
  validateRequest(updateProfileSchema),
  asyncHandler(async (req, res) => {
    const user = req.user;
    
    // Actualizar campos
    Object.assign(user, req.body);
    await user.save();

    logger.logAuth('profile_updated', user.id, { email: user.email });

    sendSuccess(res, {
      user: user.toJSON()
    }, 'Perfil actualizado exitosamente');
  })
);

// POST /api/auth/change-password - Cambiar contraseña del usuario actual
router.post('/change-password',
  authenticateToken,
  validateRequest(changePasswordSchema),
  asyncHandler(async (req, res) => {
    const { current_password, new_password } = req.body;
    const user = req.user;

    // Verificar contraseña actual
    const isValidPassword = await user.verifyPassword(current_password);
    if (!isValidPassword) {
      throw new ValidationError('Contraseña actual incorrecta');
    }

    // Actualizar contraseña
    await user.updatePassword(new_password);
    
    // Revocar todas las sesiones excepto la actual
    await revokeAllUserTokens(user.id);
    
    // Crear nueva sesión
    const newToken = user.generateJWT();
    await redisClient.setSession(user.id, newToken, 24 * 3600);

    logger.logAuth('password_changed', user.id, { email: user.email });

    sendSuccess(res, {
      token: newToken
    }, 'Contraseña actualizada exitosamente');
  })
);

// ============================================
// RUTAS DE ADMINISTRACIÓN (solo admins)
// ============================================

// GET /api/auth/users - Listar usuarios (admin)
router.get('/users',
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const query = getUsersQuerySchema.validate(req.query).value;
    
    const filters = {
      search: query.search,
      rol: query.rol,
      estado: query.estado,
      limit: query.limit,
      offset: (query.page - 1) * query.limit
    };

    const users = await Usuario.findAll(filters);
    
    // En implementación real, obtener total count para paginación
    const total = users.length; // placeholder

    sendSuccess(res, {
      users: users.map(user => user.toJSON()),
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit)
      }
    }, 'Usuarios obtenidos exitosamente');
  })
);

// POST /api/auth/users - Crear usuario (admin)
router.post('/users',
  authenticateToken,
  requireAdmin,
  validateRequest(createUserSchema),
  asyncHandler(async (req, res) => {
    const userData = req.body;
    
    try {
      const user = await Usuario.create(userData, req.user.id);
      
      // Enviar invitación si se solicita
      if (userData.enviar_invitacion) {
        // await sendInvitationEmail(user);
      }

      sendSuccess(res, {
        user: user.toJSON()
      }, 'Usuario creado exitosamente', 201);
    } catch (error) {
      if (error.message.includes('ya está registrado')) {
        throw new DuplicateError('Email');
      }
      throw error;
    }
  })
);

// GET /api/auth/users/:id - Obtener usuario específico (admin)
router.get('/users/:id',
  authenticateToken,
  requireOwnerOrAdmin,
  validateRequest(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const user = await Usuario.findById(req.params.id);
    if (!user) {
      throw new NotFoundError('Usuario');
    }

    sendSuccess(res, {
      user: user.toJSON()
    }, 'Usuario obtenido exitosamente');
  })
);

// PUT /api/auth/users/:id - Actualizar usuario (admin)
router.put('/users/:id',
  authenticateToken,
  requireAdmin,
  validateRequest(idParamSchema, 'params'),
  validateRequest(updateUserSchema),
  asyncHandler(async (req, res) => {
    const user = await Usuario.findById(req.params.id);
    if (!user) {
      throw new NotFoundError('Usuario');
    }

    // Actualizar campos
    Object.assign(user, req.body);
    await user.save();

    logger.logAuth('user_updated_by_admin', user.id, {
      updatedBy: req.user.id,
      changes: Object.keys(req.body)
    });

    sendSuccess(res, {
      user: user.toJSON()
    }, 'Usuario actualizado exitosamente');
  })
);

// DELETE /api/auth/users/:id - Eliminar usuario (admin)
router.delete('/users/:id',
  authenticateToken,
  requireAdmin,
  validateRequest(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const user = await Usuario.findById(req.params.id);
    if (!user) {
      throw new NotFoundError('Usuario');
    }

    // No permitir eliminar el último admin
    if (user.esAdmin) {
      const adminCount = (await Usuario.findAll({ rol: 'admin', estado: 'activo' })).length;
      if (adminCount <= 1) {
        throw new ValidationError('No se puede eliminar el último administrador');
      }
    }

    await user.delete();
    await revokeAllUserTokens(user.id);

    logger.logAuth('user_deleted_by_admin', user.id, {
      deletedBy: req.user.id,
      email: user.email
    });

    sendSuccess(res, {}, 'Usuario eliminado exitosamente');
  })
);

// GET /api/auth/stats - Estadísticas de usuarios (admin)
router.get('/stats',
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const stats = await Usuario.getStats();

    sendSuccess(res, {
      stats
    }, 'Estadísticas obtenidas exitosamente');
  })
);

module.exports = router;