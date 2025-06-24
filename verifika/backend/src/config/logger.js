// logger.js - Configuración de Winston para Verifika
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Crear directorio de logs si no existe
const logDir = path.join(__dirname, '../../logs');

// Configuración de formato personalizado
const customFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    // Agregar stack trace si existe
    if (stack) {
      log += `\n${stack}`;
    }
    
    // Agregar metadata adicional
    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }
    
    return log;
  })
);

// Configuración de transports
const transports = [
  // Console transport para desarrollo
  new winston.transports.Console({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.colorize(),
      customFormat
    )
  }),

  // Archivo para todos los logs
  new DailyRotateFile({
    filename: path.join(logDir, 'verifika-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    level: 'info',
    format: customFormat
  }),

  // Archivo específico para errores
  new DailyRotateFile({
    filename: path.join(logDir, 'verifika-error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '30d',
    level: 'error',
    format: customFormat
  }),

  // Archivo para requests HTTP
  new DailyRotateFile({
    filename: path.join(logDir, 'verifika-access-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '7d',
    level: 'http',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  })
];

// Crear instancia de logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  defaultMeta: { 
    service: 'verifika-api',
    version: '1.0.0'
  },
  transports
});

// Métodos de utilidad específicos para Verifika
logger.logRequest = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      userId: req.user?.id || 'anonymous'
    });
  });
  
  next();
};

logger.logAuth = (action, userId, details = {}) => {
  logger.info(`Auth: ${action}`, {
    userId,
    action,
    timestamp: new Date().toISOString(),
    ...details
  });
};

logger.logTecnico = (action, tecnicoId, adminId, details = {}) => {
  logger.info(`Técnico: ${action}`, {
    tecnicoId,
    adminId,
    action,
    timestamp: new Date().toISOString(),
    ...details
  });
};

logger.logValidation = (action, actividadId, validadorId, details = {}) => {
  logger.info(`Validación: ${action}`, {
    actividadId,
    validadorId,
    action,
    timestamp: new Date().toISOString(),
    ...details
  });
};

// Manejo de errores no capturados
logger.on('error', (error) => {
  console.error('Error en logger:', error);
});

module.exports = logger;