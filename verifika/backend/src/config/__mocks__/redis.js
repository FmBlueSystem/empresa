const redisClient = {
  initialize: jest.fn().mockResolvedValue(true),
  quit: jest.fn().mockResolvedValue(true),
  setSession: jest.fn().mockResolvedValue(true),
  getSession: jest.fn().mockResolvedValue(null),
  deleteSession: jest.fn().mockResolvedValue(true),
  setInvitationToken: jest.fn().mockResolvedValue(true),
  getInvitationToken: jest.fn().mockResolvedValue(null),
  deleteInvitationToken: jest.fn().mockResolvedValue(true),
  setResetToken: jest.fn().mockResolvedValue(true),
  getResetToken: jest.fn().mockResolvedValue(null),
  deleteResetToken: jest.fn().mockResolvedValue(true)
};
module.exports = redisClient;
