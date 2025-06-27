// database.js - Configuración de conexión MySQL para Verifika
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const logger = require('./logger');

class Database {
  constructor() {
    this.pool = null;
    
    // Debug environment variables
    console.log('Database config debug:', {
      DB_HOST: process.env.DB_HOST,
      DB_USER: process.env.DB_USER,
      DB_PASSWORD: process.env.DB_PASSWORD ? '***SET***' : 'NOT_SET',
      DB_NAME: process.env.DB_NAME
    });
    
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'bluesystem',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'bluesystem',
      connectionLimit: 10,
      charset: 'utf8mb4',
      timezone: 'local'
    };
  }

  async initialize() {
    try {
      this.pool = mysql.createPool(this.config);
      logger.info('🗄️ Pool de conexiones MySQL creado para Verifika');
      
      // Test inicial de conexión
      await this.testConnection();
      
      return this.pool;
    } catch (error) {
      logger.error('❌ Error al inicializar base de datos:', error);
      throw error;
    }
  }

  async testConnection() {
    try {
      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();
      logger.info('✅ Conexión a MySQL validada');
      return true;
    } catch (error) {
      logger.error('❌ Error en conexión MySQL:', error);
      throw error;
    }
  }

  async query(sql, params = []) {
    try {
      // Validar parámetros antes de ejecutar
      const cleanParams = params.map(param => param === undefined ? null : param);
      
      // Debug para queries problemáticas
      if (cleanParams.some(param => param === undefined)) {
        logger.error('❌ Parámetros undefined detectados:', { sql, params: cleanParams });
        throw new Error('Query contiene parámetros undefined');
      }
      
      const [rows] = await this.pool.execute(sql, cleanParams);
      return rows;
    } catch (error) {
      logger.error('❌ Error en query:', { sql, params, error: error.message });
      throw error;
    }
  }

  async getConnection() {
    return await this.pool.getConnection();
  }

  async beginTransaction() {
    const connection = await this.pool.getConnection();
    await connection.beginTransaction();
    return connection;
  }

  async commitTransaction(connection) {
    await connection.commit();
    connection.release();
  }

  async rollbackTransaction(connection) {
    await connection.rollback();
    connection.release();
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      logger.info('🔒 Pool de conexiones MySQL cerrado');
    }
  }

  // Métodos específicos para Verifika
  async healthCheck() {
    try {
      const [rows] = await this.pool.execute('SELECT 1 as health_check');
      return {
        status: 'healthy',
        message: 'MySQL connection OK',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async getStats() {
    try {
      const [stats] = await this.pool.execute(`
        SELECT 
          VARIABLE_NAME,
          VARIABLE_VALUE
        FROM INFORMATION_SCHEMA.GLOBAL_STATUS 
        WHERE VARIABLE_NAME IN ('Connections', 'Threads_connected', 'Uptime')
      `);
      
      return stats.reduce((acc, stat) => {
        acc[stat.VARIABLE_NAME] = stat.VARIABLE_VALUE;
        return acc;
      }, {});
    } catch (error) {
      logger.error('Error obteniendo stats de MySQL:', error);
      return {};
    }
  }
}

// Instancia singleton
const database = new Database();

module.exports = database;