const express = require('express');
const router = express.Router();
const logger = require('../config/logger');
// const database = require('../config/database');
// const redis = require('../config/redis');

// Basic health check
router.get('/', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'bluesystem-backend',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: {
        used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
        total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
        external: Math.round((process.memoryUsage().external / 1024 / 1024) * 100) / 100
      },
      cpu: {
        usage: process.cpuUsage()
      }
    };

    res.status(200).json(health);
  } catch (error) {
    logger.error('Health check error:', error);
    res.status(503).json({
      status: 'unhealthy',
      message: 'Service unavailable',
      timestamp: new Date().toISOString()
    });
  }
});

// Detailed health check with dependencies
router.get('/detailed', async (req, res) => {
  try {
    const checks = {
      api: { status: 'healthy', message: 'API is running' },
      database: { status: 'unknown', message: 'Not checked' },
      redis: { status: 'unknown', message: 'Not checked' }
    };

    // Check database (disabled for local dev)
    // try {
    //   const dbHealth = await database.checkHealth();
    //   checks.database = dbHealth;
    // } catch (error) {
    //   checks.database = { status: 'unhealthy', message: error.message };
    // }
    checks.database = { status: 'disabled', message: 'Database checks disabled for local development' };

    // Check Redis (disabled for local dev)
    // try {
    //   const redisHealth = await redis.checkHealth();
    //   checks.redis = redisHealth;
    // } catch (error) {
    //   checks.redis = { status: 'unhealthy', message: error.message };
    // }
    checks.redis = { status: 'disabled', message: 'Redis checks disabled for local development' };

    // Determine overall status (considering API as main indicator for local dev)
    const overallStatus = checks.api.status === 'healthy' ? 'healthy' : 'degraded';

    const healthReport = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      service: 'bluesystem-backend',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      checks,
      system: {
        memory: {
          used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
          total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
          rss: Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
          external: Math.round((process.memoryUsage().external / 1024 / 1024) * 100) / 100
        },
        cpu: process.cpuUsage(),
        platform: process.platform,
        nodeVersion: process.version,
        pid: process.pid
      }
    };

    const statusCode = overallStatus === 'healthy' ? 200 : 503;
    res.status(statusCode).json(healthReport);

  } catch (error) {
    logger.error('Detailed health check error:', error);
    res.status(503).json({
      status: 'unhealthy',
      message: 'Health check failed',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Liveness probe
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString()
  });
});

// Readiness probe
router.get('/ready', async (req, res) => {
  try {
    // For local development, service is always ready
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      message: 'Service is ready to accept traffic (local development mode)'
    });
  } catch (error) {
    logger.error('Readiness check error:', error);
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      message: 'Service not ready'
    });
  }
});

module.exports = router; 