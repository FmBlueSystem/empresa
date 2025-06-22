const mysql = require('mysql2/promise');
const logger = require('./logger');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bluesystem_db',
  charset: 'utf8mb4',
  timezone: '+00:00',
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false
};

// Create connection pool
let pool;

const initializeDatabase = async () => {
  try {
    pool = mysql.createPool(dbConfig);
    
    // Test connection
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    
    logger.info('✅ Database connected successfully');
    logger.info(`📊 Connected to: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
    
    return pool;
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    throw error;
  }
};

// Execute query with error handling
const executeQuery = async (query, params = []) => {
  try {
    if (!pool) {
      throw new Error('Database pool not initialized');
    }
    
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    logger.error('Database query error:', {
      query: query.substring(0, 100) + '...',
      error: error.message
    });
    throw error;
  }
};

// Execute transaction
const executeTransaction = async (queries) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const results = [];
    for (const { query, params } of queries) {
      const [result] = await connection.execute(query, params);
      results.push(result);
    }
    
    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    logger.error('Transaction failed:', error);
    throw error;
  } finally {
    connection.release();
  }
};

// Check database health
const checkHealth = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return { status: 'healthy', message: 'Database connection is active' };
  } catch (error) {
    return { status: 'unhealthy', message: error.message };
  }
};

// Graceful shutdown
const closePool = async () => {
  if (pool) {
    await pool.end();
    logger.info('Database pool closed');
  }
};

module.exports = {
  pool,
  initializeDatabase,
  executeQuery,
  executeTransaction,
  checkHealth,
  closePool
}; 