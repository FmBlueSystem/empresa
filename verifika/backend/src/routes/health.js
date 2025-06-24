// health.js - Rutas de health check para Verifika
const express = require('express');
const database = require('../config/database');
const redisClient = require('../config/redis');
const logger = require('../config/logger');
const { asyncHandler, sendSuccess } = require('../middleware/errorHandler');

const router = express.Router();

// GET /health - Health check básico
router.get('/', asyncHandler(async (req, res) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'verifika-api',
    version: '1.0.0',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  };

  sendSuccess(res, healthCheck, 'Servicio saludable');
}));

// GET /health/detailed - Health check detallado
router.get('/detailed', asyncHandler(async (req, res) => {
  const startTime = Date.now();
  
  // Check database connection
  const dbHealth = await database.healthCheck();
  const dbStats = await database.getStats();
  
  // Check Redis connection
  const redisHealth = await redisClient.healthCheck();
  const redisStats = await redisClient.getStats();
  
  // Memory usage
  const memoryUsage = process.memoryUsage();
  
  // Calculate response time
  const responseTime = Date.now() - startTime;
  
  // Overall health status
  const isHealthy = dbHealth.status === 'healthy' && redisHealth.status === 'healthy';
  
  const detailedHealth = {
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    service: 'verifika-api',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    responseTime: `${responseTime}ms`,
    uptime: {
      process: process.uptime(),
      formatted: formatUptime(process.uptime())
    },
    memory: {
      rss: formatBytes(memoryUsage.rss),
      heapTotal: formatBytes(memoryUsage.heapTotal),
      heapUsed: formatBytes(memoryUsage.heapUsed),
      external: formatBytes(memoryUsage.external),
      usage: `${Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)}%`
    },
    database: {
      ...dbHealth,
      stats: dbStats
    },
    redis: {
      ...redisHealth,
      stats: redisStats
    },
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
      cpuUsage: process.cpuUsage()
    }
  };

  // Log health check
  logger.info('Health check detallado ejecutado', {
    status: detailedHealth.status,
    responseTime: detailedHealth.responseTime,
    dbStatus: dbHealth.status,
    redisStatus: redisHealth.status
  });

  const statusCode = isHealthy ? 200 : 503;
  res.status(statusCode).json({
    success: isHealthy,
    message: isHealthy ? 'Todos los servicios saludables' : 'Algunos servicios no están disponibles',
    data: detailedHealth
  });
}));

// GET /health/database - Health check específico de base de datos
router.get('/database', asyncHandler(async (req, res) => {
  const dbHealth = await database.healthCheck();
  const dbStats = await database.getStats();
  
  const response = {
    ...dbHealth,
    stats: dbStats,
    connectionPool: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_NAME || 'bluesystem'
    }
  };

  const statusCode = dbHealth.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json({
    success: dbHealth.status === 'healthy',
    message: dbHealth.message,
    data: response
  });
}));

// GET /health/redis - Health check específico de Redis
router.get('/redis', asyncHandler(async (req, res) => {
  const redisHealth = await redisClient.healthCheck();
  const redisStats = await redisClient.getStats();
  
  const response = {
    ...redisHealth,
    stats: redisStats,
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      database: process.env.REDIS_DB || 0
    }
  };

  const statusCode = redisHealth.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json({
    success: redisHealth.status === 'healthy',
    message: redisHealth.message,
    data: response
  });
}));

// GET /health/metrics - Métricas básicas para monitoring
router.get('/metrics', asyncHandler(async (req, res) => {
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  
  const metrics = {
    timestamp: new Date().toISOString(),
    uptime_seconds: process.uptime(),
    memory_rss_bytes: memoryUsage.rss,
    memory_heap_total_bytes: memoryUsage.heapTotal,
    memory_heap_used_bytes: memoryUsage.heapUsed,
    memory_external_bytes: memoryUsage.external,
    memory_heap_usage_percent: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
    cpu_user_microseconds: cpuUsage.user,
    cpu_system_microseconds: cpuUsage.system,
    nodejs_version: process.version,
    process_id: process.pid
  };

  // Formato compatible con Prometheus
  if (req.headers.accept && req.headers.accept.includes('text/plain')) {
    let prometheusFormat = '';
    for (const [key, value] of Object.entries(metrics)) {
      if (typeof value === 'number') {
        prometheusFormat += `verifika_${key} ${value}\n`;
      }
    }
    res.type('text/plain').send(prometheusFormat);
  } else {
    sendSuccess(res, metrics, 'Métricas obtenidas');
  }
}));

// GET /health/readiness - Readiness probe para Kubernetes
router.get('/readiness', asyncHandler(async (req, res) => {
  try {
    // Verificar que todos los servicios críticos estén disponibles
    const dbHealth = await database.healthCheck();
    const redisHealth = await redisClient.healthCheck();
    
    const isReady = dbHealth.status === 'healthy' && redisHealth.status === 'healthy';
    
    if (isReady) {
      sendSuccess(res, {
        ready: true,
        services: {
          database: dbHealth.status,
          redis: redisHealth.status
        }
      }, 'Servicio listo');
    } else {
      res.status(503).json({
        success: false,
        message: 'Servicio no está listo',
        data: {
          ready: false,
          services: {
            database: dbHealth.status,
            redis: redisHealth.status
          }
        }
      });
    }
  } catch (error) {
    logger.error('Error en readiness check:', error);
    res.status(503).json({
      success: false,
      message: 'Error en readiness check',
      data: { ready: false }
    });
  }
}));

// GET /health/liveness - Liveness probe para Kubernetes
router.get('/liveness', asyncHandler(async (req, res) => {
  // Liveness check básico - solo verifica que el proceso esté corriendo
  sendSuccess(res, {
    alive: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  }, 'Servicio activo');
}));

// Funciones de utilidad
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  let result = '';
  if (days > 0) result += `${days}d `;
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m `;
  result += `${secs}s`;
  
  return result.trim();
}

module.exports = router;