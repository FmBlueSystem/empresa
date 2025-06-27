// server.js - Entry point para Verifika API
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Importar configuraciones
const logger = require('./src/config/logger');
const database = require('./src/config/database');
const redisClient = require('./src/config/redis');

// Importar middleware
const { errorHandler, notFound } = require('./src/middleware/errorHandler');

// Importar rutas
const authRoutes = require('./src/routes/auth');
const tecnicosRoutes = require('./src/routes/tecnicos');
const competenciasRoutes = require('./src/routes/competencias');
const clientesRoutes = require('./src/routes/clientes');
const asignacionesRoutes = require('./src/routes/asignaciones');
const actividadesRoutes = require('./src/routes/actividades');
const validacionesRoutes = require('./src/routes/validaciones');
const healthRoutes = require('./src/routes/health');

// Crear app Express
const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: {
    success: false,
    message: 'Demasiadas solicitudes, intenta más tarde'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Middleware de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:']
    }
  }
}));

// Middleware general
app.use(compression());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5174',
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(limiter);

// Crear directorio de uploads si no existe
const uploadsDir = path.join(__dirname, 'uploads');
if (!require('fs').existsSync(uploadsDir)) {
  require('fs').mkdirSync(uploadsDir, { recursive: true });
}

// Servir archivos estáticos
app.use('/uploads', express.static(uploadsDir));

// Rutas de la API
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tecnicos', tecnicosRoutes);
app.use('/api/competencias', competenciasRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/asignaciones', asignacionesRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/validaciones', validacionesRoutes);

// Ruta por defecto
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Verifika API v1.0.0',
    timestamp: new Date().toISOString(),
    documentation: '/api/docs'
  });
});

// Middleware para rutas no encontradas
app.use(notFound);

// Middleware de manejo de errores
app.use(errorHandler);

// Función para inicializar el servidor
async function startServer() {
  try {
    // Inicializar base de datos
    await database.initialize();
    logger.info('📊 Base de datos MySQL inicializada');

    // Inicializar Redis
    await redisClient.initialize();
    logger.info('🔴 Redis inicializado');

    // Iniciar servidor
    app.listen(PORT, () => {
      logger.info(`🚀 Verifika API iniciado en puerto ${PORT}`);
      logger.info(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5174'}`);
      logger.info(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`⚡ Health check: http://localhost:${PORT}/health`);
    });

  } catch (error) {
    logger.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
}

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Manejo de cierre graceful
process.on('SIGTERM', async () => {
  logger.info('🛑 SIGTERM recibido, cerrando servidor...');
  await database.close();
  await redisClient.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('🛑 SIGINT recibido, cerrando servidor...');
  await database.close();
  await redisClient.quit();
  process.exit(0);
});

// Iniciar servidor
startServer();

module.exports = app;
