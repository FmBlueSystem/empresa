const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import configurations and routes
const logger = require('./config/logger');
const database = require('./config/database');
const redis = require('./config/redis');

// Import routes
const healthRoutes = require('./routes/health');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: NODE_ENV === 'production' ? 
    [process.env.FRONTEND_URL, process.env.DOMAIN] : 
    ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
app.use(morgan('combined', {
  stream: { write: message => logger.info(message.trim()) }
}));

// Routes
app.use('/health', healthRoutes);
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'BlueSystem.io API',
    version: '1.0.0',
    status: 'running',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  
  if (NODE_ENV === 'development') {
    res.status(500).json({
      error: 'Internal server error',
      message: err.message,
      stack: err.stack
    });
  } else {
    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong'
    });
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  
  // Close database connections
  if (database.pool) {
    await database.pool.end();
  }
  
  // Close Redis connection
  if (redis.client) {
    await redis.client.quit();
  }
  
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  
  // Close database connections
  if (database.pool) {
    await database.pool.end();
  }
  
  // Close Redis connection
  if (redis.client) {
    await redis.client.quit();
  }
  
  process.exit(0);
});

// Start server only if not in test environment and not imported as module
if (process.env.NODE_ENV !== 'test' && require.main === module) {
  const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 BlueSystem.io Backend running on port ${PORT}`);
    logger.info(`📊 Environment: ${NODE_ENV}`);
    logger.info(`🕐 Started at: ${new Date().toISOString()}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    server.close(() => {
      process.exit(1);
    });
  });
}

module.exports = app; 