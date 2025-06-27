// clientes.integration.test.js - Tests de integración para clientes
const request = require('supertest');
const app = require('../server');
const database = require('../src/config/database');
const bcrypt = require('bcryptjs');

describe('API Clientes - Tests de Integración', () => {
  let authToken;
  let testClienteId;
  let testUserId;

  beforeAll(async () => {
    // Asegurar que la base de datos esté inicializada
    await database.initialize();
    
    // Crear usuario admin para tests
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const connection = await database.getConnection();
    
    try {
      // Eliminar usuario si existe
      await connection.execute('DELETE FROM vf_usuarios WHERE email = ?', ['admin.integration@verifika.com']);
      
      // Crear usuario admin
      const [result] = await connection.execute(`
        INSERT INTO vf_usuarios (email, password_hash, nombre, apellido, rol, estado, email_verificado)
        VALUES (?, ?, ?, ?, ?, 'activo', TRUE)
      `, ['admin.integration@verifika.com', hashedPassword, 'Admin', 'Integration', 'admin']);
      
      testUserId = result.insertId;
      
      // Simular login para obtener token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin.integration@verifika.com',
          password: 'admin123'
        });
      
      authToken = loginResponse.body.data.token;
    } finally {
      connection.release();
    }
  });

  afterAll(async () => {
    // Limpiar datos de test
    const connection = await database.getConnection();
    try {
      if (testClienteId) {
        await connection.execute('DELETE FROM vf_clientes WHERE id = ?', [testClienteId]);
      }
      if (testUserId) {
        await connection.execute('DELETE FROM vf_usuarios WHERE id = ?', [testUserId]);
      }
    } finally {
      connection.release();
    }
  });

  describe('POST /api/clientes - Crear Cliente', () => {
    test('debería crear un cliente exitosamente', async () => {
      const clienteData = {
        razon_social: 'Empresa Integration Test S.L.',
        email_principal: `integration.${Date.now()}@test.com`,
        contacto_principal: 'Juan Pérez',
        sector: 'Tecnología',
        ciudad: 'Madrid',
        numero_empleados: 50
      };

      const response = await request(app)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(clienteData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.cliente).toBeDefined();
      expect(response.body.data.cliente.nombre_empresa).toBe(clienteData.razon_social);
      
      testClienteId = response.body.data.cliente.id;
    });

    test('debería fallar con datos inválidos', async () => {
      const clienteInvalido = {
        razon_social: 'A', // Muy corto
        email_principal: 'email-invalido'
      };

      const response = await request(app)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(clienteInvalido)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('debería fallar sin autenticación', async () => {
      const clienteData = {
        razon_social: 'Empresa Sin Auth',
        email_principal: 'noauth@test.com',
        contacto_principal: 'Test'
      };

      await request(app)
        .post('/api/clientes')
        .send(clienteData)
        .expect(401);
    });
  });

  describe('GET /api/clientes - Listar Clientes', () => {
    test('debería listar clientes con paginación', async () => {
      const response = await request(app)
        .get('/api/clientes')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.clientes).toBeDefined();
      expect(Array.isArray(response.body.data.clientes)).toBe(true);
    });

    test('debería filtrar clientes por sector', async () => {
      const response = await request(app)
        .get('/api/clientes')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ sector: 'Tecnología' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/clientes/:id - Obtener Cliente', () => {
    test('debería obtener un cliente por ID', async () => {
      if (!testClienteId) {
        console.log('Saltando test - no hay cliente de test');
        return;
      }

      const response = await request(app)
        .get(`/api/clientes/${testClienteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.cliente.id).toBe(testClienteId);
    });

    test('debería fallar con ID inválido', async () => {
      const response = await request(app)
        .get('/api/clientes/invalid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('debería fallar con cliente no encontrado', async () => {
      const response = await request(app)
        .get('/api/clientes/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/clientes/:id - Actualizar Cliente', () => {
    test('debería actualizar un cliente exitosamente', async () => {
      if (!testClienteId) {
        console.log('Saltando test - no hay cliente de test');
        return;
      }

      const updateData = {
        telefono_corporativo: '+34 600 987 654',
        ciudad: 'Barcelona'
      };

      const response = await request(app)
        .put(`/api/clientes/${testClienteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.cliente.telefono_corporativo).toBe(updateData.telefono_corporativo);
    });
  });

  describe('GET /api/clientes/stats - Estadísticas', () => {
    test('debería obtener estadísticas de clientes', async () => {
      const response = await request(app)
        .get('/api/clientes/stats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.total_clientes).toBeDefined();
      expect(typeof response.body.data.total_clientes).toBe('number');
    });
  });

  describe('GET /api/clientes/active - Clientes Activos', () => {
    test('debería obtener clientes activos', async () => {
      const response = await request(app)
        .get('/api/clientes/active')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.clientes)).toBe(true);
    });
  });

  describe('GET /api/clientes/search - Búsqueda', () => {
    test('debería buscar clientes por término', async () => {
      const response = await request(app)
        .get('/api/clientes/search')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ q: 'Integration', limit: 5 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.clientes)).toBe(true);
    });

    test('debería fallar sin término de búsqueda', async () => {
      const response = await request(app)
        .get('/api/clientes/search')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('debería fallar con término muy corto', async () => {
      const response = await request(app)
        .get('/api/clientes/search')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ q: 'A' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Seguridad y Autenticación', () => {
    test('debería fallar sin token de autenticación', async () => {
      await request(app)
        .get('/api/clientes')
        .expect(401);
    });

    test('debería fallar con token inválido', async () => {
      await request(app)
        .get('/api/clientes')
        .set('Authorization', 'Bearer token_invalido')
        .expect(401);
    });
  });
});