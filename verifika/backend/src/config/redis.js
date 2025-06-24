// redis.js - Configuración de Redis para Verifika
const { createClient } = require('redis');
const logger = require('./logger');

class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
    
    this.config = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      database: parseInt(process.env.REDIS_DB) || 0,
      retryDelayOnFailover: 100,
      enableReadyCheck: true,
      maxRetriesPerRequest: 3
    };
  }

  async initialize() {
    try {
      // Crear cliente Redis
      this.client = createClient({
        url: `redis://:${this.config.password}@${this.config.host}:${this.config.port}/${this.config.database}`
      });

      // Event listeners
      this.client.on('connect', () => {
        logger.info('🔴 Conectando a Redis...');
      });

      this.client.on('ready', () => {
        this.isConnected = true;
        logger.info('✅ Redis conectado y listo');
      });

      this.client.on('error', (error) => {
        this.isConnected = false;
        logger.error('❌ Error en Redis:', error);
      });

      this.client.on('end', () => {
        this.isConnected = false;
        logger.warn('⚠️ Conexión Redis cerrada');
      });

      this.client.on('reconnecting', () => {
        logger.info('🔄 Reconectando a Redis...');
      });

      // Conectar
      await this.client.connect();
      
      // Test inicial
      await this.ping();
      
      return this.client;
    } catch (error) {
      logger.error('❌ Error al inicializar Redis:', error);
      throw error;
    }
  }

  async ping() {
    try {
      const result = await this.client.ping();
      if (result === 'PONG') {
        logger.info('✅ Redis ping exitoso');
        return true;
      }
      return false;
    } catch (error) {
      logger.error('❌ Error en Redis ping:', error);
      throw error;
    }
  }

  // Métodos para sesiones JWT
  async setSession(userId, token, expiresIn = 3600) {
    try {
      const key = `verifika:session:${userId}`;
      await this.client.setEx(key, expiresIn, token);
      logger.info(`📝 Sesión guardada para usuario ${userId}`);
      return true;
    } catch (error) {
      logger.error('Error guardando sesión:', error);
      return false;
    }
  }

  async getSession(userId) {
    try {
      const key = `verifika:session:${userId}`;
      const token = await this.client.get(key);
      return token;
    } catch (error) {
      logger.error('Error obteniendo sesión:', error);
      return null;
    }
  }

  async deleteSession(userId) {
    try {
      const key = `verifika:session:${userId}`;
      await this.client.del(key);
      logger.info(`🗑️ Sesión eliminada para usuario ${userId}`);
      return true;
    } catch (error) {
      logger.error('Error eliminando sesión:', error);
      return false;
    }
  }

  // Métodos para tokens de invitación
  async setInvitationToken(email, token, expiresIn = 86400) { // 24 horas
    try {
      const key = `verifika:invitation:${email}`;
      await this.client.setEx(key, expiresIn, token);
      logger.info(`📧 Token de invitación guardado para ${email}`);
      return true;
    } catch (error) {
      logger.error('Error guardando token de invitación:', error);
      return false;
    }
  }

  async getInvitationToken(email) {
    try {
      const key = `verifika:invitation:${email}`;
      const token = await this.client.get(key);
      return token;
    } catch (error) {
      logger.error('Error obteniendo token de invitación:', error);
      return null;
    }
  }

  async deleteInvitationToken(email) {
    try {
      const key = `verifika:invitation:${email}`;
      await this.client.del(key);
      logger.info(`🗑️ Token de invitación eliminado para ${email}`);
      return true;
    } catch (error) {
      logger.error('Error eliminando token de invitación:', error);
      return false;
    }
  }

  // Métodos para reset password
  async setResetToken(email, token, expiresIn = 3600) { // 1 hora
    try {
      const key = `verifika:reset:${email}`;
      await this.client.setEx(key, expiresIn, token);
      logger.info(`🔐 Token de reset guardado para ${email}`);
      return true;
    } catch (error) {
      logger.error('Error guardando token de reset:', error);
      return false;
    }
  }

  async getResetToken(email) {
    try {
      const key = `verifika:reset:${email}`;
      const token = await this.client.get(key);
      return token;
    } catch (error) {
      logger.error('Error obteniendo token de reset:', error);
      return null;
    }
  }

  async deleteResetToken(email) {
    try {
      const key = `verifika:reset:${email}`;
      await this.client.del(key);
      logger.info(`🗑️ Token de reset eliminado para ${email}`);
      return true;
    } catch (error) {
      logger.error('Error eliminando token de reset:', error);
      return false;
    }
  }

  // Métodos de utilidad
  async healthCheck() {
    try {
      const start = Date.now();
      await this.client.ping();
      const latency = Date.now() - start;
      
      return {
        status: 'healthy',
        message: 'Redis connection OK',
        latency: `${latency}ms`,
        connected: this.isConnected,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: error.message,
        connected: false,
        timestamp: new Date().toISOString()
      };
    }
  }

  async getStats() {
    try {
      const info = await this.client.info();
      const memory = await this.client.info('memory');
      
      return {
        info: info.split('\r\n').reduce((acc, line) => {
          const [key, value] = line.split(':');
          if (key && value) acc[key] = value;
          return acc;
        }, {}),
        memory: memory.split('\r\n').reduce((acc, line) => {
          const [key, value] = line.split(':');
          if (key && value) acc[key] = value;
          return acc;
        }, {})
      };
    } catch (error) {
      logger.error('Error obteniendo stats de Redis:', error);
      return {};
    }
  }

  async quit() {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
      logger.info('🔒 Cliente Redis cerrado');
    }
  }
}

// Instancia singleton
const redisClient = new RedisClient();

module.exports = redisClient;