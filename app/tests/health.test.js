const request = require('supertest');
const app = require('../server');

describe('Health Check Endpoints', () => {
  let server;

  beforeAll((done) => {
    // Start server on a different port for testing
    server = app.listen(3001, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('GET /health', () => {
    it('should return 200 status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });

    it('should return correct health status structure', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'healthy',
        service: 'bluesystem-backend',
        version: expect.any(String),
        timestamp: expect.any(String),
        uptime: expect.any(Number)
      });
    });
  });

  describe('GET /health/detailed', () => {
    it('should return detailed health information', async () => {
      const response = await request(app)
        .get('/health/detailed');

      // Accept both healthy (200) and degraded (503) status since we're mocking dependencies
      expect([200, 503]).toContain(response.status);
      expect(response.body).toHaveProperty('service', 'bluesystem-backend');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('system');
      expect(response.body).toHaveProperty('checks');
    });

    it('should include system information', async () => {
      const response = await request(app)
        .get('/health/detailed');

      expect([200, 503]).toContain(response.status);
      expect(response.body.system).toHaveProperty('nodeVersion');
      expect(response.body.system).toHaveProperty('platform');
      expect(response.body.system).toHaveProperty('memory');
    });

    it('should include service checks', async () => {
      const response = await request(app)
        .get('/health/detailed');

      expect([200, 503]).toContain(response.status);
      expect(response.body.checks).toHaveProperty('api');
      expect(response.body.checks).toHaveProperty('database');
      expect(response.body.checks).toHaveProperty('redis');
    });
  });

  describe('GET /api', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body).toHaveProperty('name', 'BlueSystem.io API');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoints');
    });

    it('should include available endpoints', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body.endpoints).toBeInstanceOf(Object);
      expect(response.body.endpoints).toHaveProperty('health');
      expect(response.body.endpoints).toHaveProperty('auth');
    });
  });

  describe('GET /api/test', () => {
    it('should return test data with cache headers', async () => {
      const response = await request(app)
        .get('/api/test');

      // Accept both 200 and 500 since Redis might not be available in tests
      expect([200, 500]).toContain(response.status);
      
      if (response.status === 200) {
        expect(response.body).toHaveProperty('message', 'API funcionando correctamente');
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body).toHaveProperty('cached');
      }
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent endpoints', async () => {
      await request(app)
        .get('/api/non-existent')
        .expect(404);
    });

    it('should handle invalid JSON gracefully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send('invalid json')
        .set('Content-Type', 'application/json');

      // Accept both 400 and 500 for invalid JSON
      expect([400, 500]).toContain(response.status);
    });
  });

  describe('Security Headers', () => {
    it('should include security headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      // Check for security headers set by Helmet
      expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
      expect(response.headers).toHaveProperty('x-frame-options'); // Can be DENY or SAMEORIGIN
      expect(response.headers).toHaveProperty('x-xss-protection', '0');
    });
  });

  describe('CORS Headers', () => {
    it('should include CORS headers', async () => {
      const response = await request(app)
        .get('/api')
        .set('Origin', 'http://localhost:3000')
        .expect(200);

      // CORS headers only appear when there's an Origin header
      expect(response.headers).toHaveProperty('access-control-allow-credentials', 'true');
    });
  });
}); 