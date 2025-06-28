const database = {
  initialize: jest.fn().mockResolvedValue(true),
  close: jest.fn().mockResolvedValue(true),
  query: jest.fn(async () => []),
  getConnection: jest.fn(async () => ({
    query: jest.fn(async () => []),
    execute: jest.fn(async () => [{ insertId: 1, affectedRows: 1 }]),
    beginTransaction: jest.fn(),
    commit: jest.fn(),
    rollback: jest.fn(),
    release: jest.fn()
  }))
};
module.exports = database;
