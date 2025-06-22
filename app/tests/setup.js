// Jest setup file for mocking external dependencies

// Mock MySQL database connection
jest.mock('../config/database', () => ({
  getConnection: jest.fn(() => Promise.resolve({
    query: jest.fn(() => Promise.resolve([{ id: 1, name: 'test' }])),
    release: jest.fn()
  })),
  query: jest.fn(() => Promise.resolve([{ id: 1, name: 'test' }]))
}));

// Mock Redis connection
jest.mock('../config/redis', () => ({
  get: jest.fn(() => Promise.resolve(null)),
  set: jest.fn(() => Promise.resolve('OK')),
  del: jest.fn(() => Promise.resolve(1)),
  ping: jest.fn(() => Promise.resolve('PONG')),
  quit: jest.fn(() => Promise.resolve())
}));

// Mock logger to avoid file system operations
jest.mock('../config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '3306';
process.env.DB_USER = 'test';
process.env.DB_PASSWORD = 'test';
process.env.DB_NAME = 'test_db';
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';
process.env.REDIS_PASSWORD = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only';
process.env.API_KEY = 'test-api-key';
process.env.SESSION_SECRET = 'test-session-secret';

// Global test timeout
jest.setTimeout(10000); 