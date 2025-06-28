const express = require('express');
const router = express.Router();
const logger = require('../config/logger');
const { cache } = require('../config/redis');
const { executeQuery } = require('../config/database');

// API Info
router.get('/', (req, res) => {
  res.json({
    name: 'BlueSystem.io API',
    version: '1.0.0',
    description: 'API REST para BlueSystem.io',
    endpoints: {
      health: '/health',
      api: '/api',
      users: '/api/users',
      auth: '/api/auth'
    },
    timestamp: new Date().toISOString()
  });
});

// Test endpoint with cache
router.get('/test', async (req, res) => {
  try {
    const cacheKey = 'api:test';

    // Try to get from cache first
    let result = await cache.get(cacheKey);

    if (!result) {
      // Generate test data
      result = {
        message: 'Test endpoint working correctly',
        timestamp: new Date().toISOString(),
        cached: false,
        random: Math.random()
      };

      // Cache for 60 seconds
      await cache.set(cacheKey, result, 60);
    } else {
      result.cached = true;
    }

    res.json(result);
  } catch (error) {
    logger.error('Test endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Test endpoint failed'
    });
  }
});

// Database test endpoint
router.get('/db-test', async (req, res) => {
  try {
    // Test database connection with a simple query
    const result = await executeQuery('SELECT 1 as test, NOW() as timestamp');

    res.json({
      message: 'Database connection successful',
      result: result[0],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Database test error:', error);
    res.status(500).json({
      error: 'Database connection failed',
      message: error.message
    });
  }
});

// Users endpoint (placeholder)
router.get('/users', async (req, res) => {
  try {
    // This would typically fetch from database
    const users = [
      {
        id: 1,
        name: 'Freddy',
        email: 'freddy@bluesystem.io',
        role: 'admin',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Usuario Demo',
        email: 'demo@bluesystem.io',
        role: 'user',
        created_at: new Date().toISOString()
      }
    ];

    res.json({
      users,
      total: users.length,
      page: 1,
      limit: 10
    });
  } catch (error) {
    logger.error('Users endpoint error:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
      message: error.message
    });
  }
});

// Auth endpoints (placeholder)
router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Missing credentials',
      message: 'Email and password are required'
    });
  }

  // This is a placeholder - implement real authentication
  if (email === 'admin@bluesystem.io' && password === 'admin123') {
    res.json({
      message: 'Login successful',
      token: 'demo-jwt-token',
      user: {
        id: 1,
        email: 'admin@bluesystem.io',
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({
      error: 'Invalid credentials',
      message: 'Email or password incorrect'
    });
  }
});

router.post('/auth/logout', (req, res) => {
  res.json({
    message: 'Logout successful'
  });
});

// Error handling for unknown API routes
router.use((req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      'GET /api',
      'GET /api/test',
      'GET /api/db-test',
      'GET /api/users',
      'POST /api/auth/login',
      'POST /api/auth/logout'
    ]
  });
});

module.exports = router;
