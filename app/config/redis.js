const redis = require('redis');
const logger = require('./logger');

// Redis configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: process.env.REDIS_DB || 0,
  retryDelayOnFailover: 100,
  enableReadyCheck: true,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
  connectTimeout: 10000,
  commandTimeout: 5000
};

// Create Redis client
let client;

const initializeRedis = async () => {
  try {
    // Create client with configuration
    client = redis.createClient({
      socket: {
        host: redisConfig.host,
        port: redisConfig.port,
        connectTimeout: redisConfig.connectTimeout,
        commandTimeout: redisConfig.commandTimeout,
        keepAlive: redisConfig.keepAlive
      },
      password: redisConfig.password,
      database: redisConfig.db,
      retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          logger.error('Redis connection refused');
          return new Error('Redis connection refused');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          logger.error('Redis retry time exhausted');
          return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
          logger.error('Redis max attempts reached');
          return undefined;
        }
        // Reconnect after
        return Math.min(options.attempt * 100, 3000);
      }
    });

    // Event listeners
    client.on('connect', () => {
      logger.info('🔄 Redis connecting...');
    });

    client.on('ready', () => {
      logger.info('✅ Redis connected successfully');
      logger.info(`📊 Connected to: ${redisConfig.host}:${redisConfig.port}/${redisConfig.db}`);
    });

    client.on('error', (error) => {
      logger.error('❌ Redis connection error:', error);
    });

    client.on('end', () => {
      logger.warn('🔌 Redis connection ended');
    });

    client.on('reconnecting', () => {
      logger.info('🔄 Redis reconnecting...');
    });

    // Connect to Redis
    await client.connect();
    
    return client;
  } catch (error) {
    logger.error('❌ Redis initialization failed:', error);
    throw error;
  }
};

// Cache operations
const cache = {
  // Get value from cache
  get: async (key) => {
    try {
      if (!client || !client.isOpen) {
        logger.warn('Redis client not available for GET operation');
        return null;
      }
      
      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error(`Redis GET error for key ${key}:`, error);
      return null;
    }
  },

  // Set value in cache
  set: async (key, value, ttl = 3600) => {
    try {
      if (!client || !client.isOpen) {
        logger.warn('Redis client not available for SET operation');
        return false;
      }
      
      await client.setEx(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error(`Redis SET error for key ${key}:`, error);
      return false;
    }
  },

  // Delete key from cache
  del: async (key) => {
    try {
      if (!client || !client.isOpen) {
        logger.warn('Redis client not available for DEL operation');
        return false;
      }
      
      await client.del(key);
      return true;
    } catch (error) {
      logger.error(`Redis DEL error for key ${key}:`, error);
      return false;
    }
  },

  // Check if key exists
  exists: async (key) => {
    try {
      if (!client || !client.isOpen) {
        return false;
      }
      
      const exists = await client.exists(key);
      return exists === 1;
    } catch (error) {
      logger.error(`Redis EXISTS error for key ${key}:`, error);
      return false;
    }
  },

  // Set TTL for key
  expire: async (key, ttl) => {
    try {
      if (!client || !client.isOpen) {
        return false;
      }
      
      await client.expire(key, ttl);
      return true;
    } catch (error) {
      logger.error(`Redis EXPIRE error for key ${key}:`, error);
      return false;
    }
  }
};

// Check Redis health
const checkHealth = async () => {
  try {
    if (!client || !client.isOpen) {
      return { status: 'unhealthy', message: 'Redis client not connected' };
    }
    
    await client.ping();
    return { status: 'healthy', message: 'Redis connection is active' };
  } catch (error) {
    return { status: 'unhealthy', message: error.message };
  }
};

// Graceful shutdown
const closeConnection = async () => {
  if (client && client.isOpen) {
    await client.quit();
    logger.info('Redis connection closed');
  }
};

module.exports = {
  client,
  initializeRedis,
  cache,
  checkHealth,
  closeConnection
}; 