// tecnicos.test.js - Tests para el módulo de técnicos
jest.mock('../src/config/database');
jest.mock('../src/config/redis');

const request = require('supertest');
const app = require('../server');
const database = require('../src/config/database');
const redisClient = require('../src/config/redis');
const Usuario = require('../src/models/Usuario');
const Tecnico = require('../src/models/Tecnico');

describe('Módulo de Técnicos', () => {
  let adminToken;
  let tecnicoToken;
  let clienteToken;
  let tecnicoId;
  let competenciaId;

  beforeAll(async () => {
    // Inicializar servicios
    await database.initialize();
    await redisClient.initialize();

    // Crear usuarios de prueba
    const adminUser = await Usuario.findByEmail('admin@bluesystem.io');
    if (adminUser) {
      adminToken = adminUser.generateJWT();
    }

    // Crear usuario técnico de prueba
    const tecnicoData = {
      email: 'tecnico.test@verifika.com',
      password: 'test123',
      nombre: 'Juan',
      apellido: 'Pérez',
      telefono: '123456789'
    };

    const perfilData = {
      ciudad: 'Madrid',
      experiencia_anos: 5,
      nivel_experiencia: 'intermedio',
      tarifa_por_hora: 45.00
    };

    const tecnico = await Tecnico.create(perfilData, tecnicoData);
    tecnicoId = tecnico.id;

    const tecnicoUser = await Usuario.findByEmail(tecnicoData.email);
    tecnicoToken = tecnicoUser.generateJWT();

    // Crear competencia de prueba
    const [competenciaResult] = await database.query(`
      INSERT INTO vf_competencias_catalogo (nombre, descripcion, categoria)
      VALUES ('Node.js Testing', 'Competencia para testing', 'Desarrollo Web')
    `);
    competenciaId = competenciaResult.insertId;
  });

  afterAll(async () => {
    // Limpiar datos de prueba
    await database.query('DELETE FROM vf_tecnicos_competencias WHERE tecnico_id = ?', [tecnicoId]);
    await database.query('DELETE FROM vf_tecnicos_perfiles WHERE id = ?', [tecnicoId]);
    await database.query('DELETE FROM vf_usuarios WHERE email = ?', ['tecnico.test@verifika.com']);
    await database.query('DELETE FROM vf_competencias_catalogo WHERE id = ?', [competenciaId]);

    // Cerrar conexiones
    await database.close();
    await redisClient.quit();
  });

  describe('GET /api/tecnicos', () => {
    test('Debe listar técnicos para admin', async () => {
      const response = await request(app)
        .get('/api/tecnicos')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('tecnicos');
      expect(response.body.data).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data.tecnicos)).toBe(true);
    });

    test('Debe filtrar técnicos por ciudad', async () => {
      const response = await request(app)
        .get('/api/tecnicos?ciudad=Madrid')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tecnicos.length).toBeGreaterThan(0);
    });

    test('Debe rechazar acceso sin autenticación', async () => {
      await request(app)
        .get('/api/tecnicos')
        .expect(401);
    });
  });

  describe('GET /api/tecnicos/:id', () => {
    test('Debe obtener técnico específico para admin', async () => {
      const response = await request(app)
        .get(`/api/tecnicos/${tecnicoId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tecnico).toHaveProperty('id', tecnicoId);
      expect(response.body.data.tecnico).toHaveProperty('nombre', 'Juan');
      expect(response.body.data.tecnico).toHaveProperty('competencias');
      expect(response.body.data.tecnico).toHaveProperty('documentos');
    });

    test('Técnico debe poder ver su propio perfil', async () => {
      const response = await request(app)
        .get(`/api/tecnicos/${tecnicoId}`)
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tecnico.id).toBe(tecnicoId);
    });

    test('Debe retornar 404 para técnico inexistente', async () => {
      await request(app)
        .get('/api/tecnicos/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('POST /api/tecnicos', () => {
    test('Admin debe poder crear técnico', async () => {
      const nuevoTecnico = {
        usuario: {
          email: 'nuevo.tecnico@verifika.com',
          nombre: 'María',
          apellido: 'González',
          telefono: '987654321'
        },
        perfil: {
          ciudad: 'Barcelona',
          experiencia_anos: 3,
          nivel_experiencia: 'junior',
          tarifa_por_hora: 35.00
        }
      };

      const response = await request(app)
        .post('/api/tecnicos')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(nuevoTecnico)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tecnico).toHaveProperty('nombre', 'María');
      expect(response.body.data.tecnico).toHaveProperty('email', 'nuevo.tecnico@verifika.com');

      // Limpiar
      await database.query('DELETE FROM vf_tecnicos_perfiles WHERE usuario_id = ?', [response.body.data.tecnico.usuario_id]);
      await database.query('DELETE FROM vf_usuarios WHERE email = ?', ['nuevo.tecnico@verifika.com']);
    });

    test('Debe rechazar datos inválidos', async () => {
      const datosInvalidos = {
        usuario: {
          email: 'email-invalido',
          nombre: 'A'
        }
      };

      await request(app)
        .post('/api/tecnicos')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(datosInvalidos)
        .expect(400);
    });

    test('Técnico no debe poder crear otros técnicos', async () => {
      const nuevoTecnico = {
        usuario: {
          email: 'otro.tecnico@verifika.com',
          nombre: 'Pedro',
          apellido: 'López'
        }
      };

      await request(app)
        .post('/api/tecnicos')
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .send(nuevoTecnico)
        .expect(403);
    });
  });

  describe('PUT /api/tecnicos/:id', () => {
    test('Admin debe poder actualizar técnico', async () => {
      const actualizacion = {
        ciudad: 'Valencia',
        experiencia_anos: 6,
        tarifa_por_hora: 50.00
      };

      const response = await request(app)
        .put(`/api/tecnicos/${tecnicoId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(actualizacion)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tecnico.ciudad).toBe('Valencia');
      expect(response.body.data.tecnico.experiencia_anos).toBe(6);
      expect(response.body.data.tecnico.tarifa_por_hora).toBe('50.00');
    });

    test('Técnico debe poder actualizar su propio perfil', async () => {
      const actualizacion = {
        biografia: 'Desarrollador Full Stack con experiencia en React y Node.js'
      };

      const response = await request(app)
        .put(`/api/tecnicos/${tecnicoId}`)
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .send(actualizacion)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tecnico.biografia).toContain('Desarrollador Full Stack');
    });
  });

  describe('PATCH /api/tecnicos/:id/status', () => {
    test('Admin debe poder cambiar estado del técnico', async () => {
      const response = await request(app)
        .patch(`/api/tecnicos/${tecnicoId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ estado: 'inactivo' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tecnico.estado).toBe('inactivo');

      // Revertir estado
      await request(app)
        .patch(`/api/tecnicos/${tecnicoId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ estado: 'activo' })
        .expect(200);
    });

    test('Técnico no debe poder cambiar su propio estado', async () => {
      await request(app)
        .patch(`/api/tecnicos/${tecnicoId}/status`)
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .send({ estado: 'inactivo' })
        .expect(403);
    });
  });

  describe('GET /api/tecnicos/available', () => {
    test('Debe obtener técnicos disponibles', async () => {
      const response = await request(app)
        .get('/api/tecnicos/available')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('tecnicos');
      expect(Array.isArray(response.body.data.tecnicos)).toBe(true);
    });

    test('Debe filtrar por competencias requeridas', async () => {
      // Primero agregar competencia al técnico
      await request(app)
        .post(`/api/tecnicos/${tecnicoId}/competencias`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          competencia_id: competenciaId,
          nivel_actual: 'intermedio'
        })
        .expect(200);

      const response = await request(app)
        .get(`/api/tecnicos/available?competencias=${competenciaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tecnicos.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Gestión de Competencias', () => {
    test('Debe agregar competencia a técnico', async () => {
      const response = await request(app)
        .post(`/api/tecnicos/${tecnicoId}/competencias`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          competencia_id: competenciaId,
          nivel_actual: 'avanzado',
          certificado: true
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test('Debe obtener competencias del técnico', async () => {
      const response = await request(app)
        .get(`/api/tecnicos/${tecnicoId}/competencias`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('competencias');
      expect(Array.isArray(response.body.data.competencias)).toBe(true);
    });

    test('Técnico debe poder gestionar sus propias competencias', async () => {
      const response = await request(app)
        .post(`/api/tecnicos/${tecnicoId}/competencias`)
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .send({
          competencia_id: competenciaId,
          nivel_actual: 'experto'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('PATCH /api/tecnicos/:id/disponibilidad', () => {
    test('Debe actualizar disponibilidad del técnico', async () => {
      const response = await request(app)
        .patch(`/api/tecnicos/${tecnicoId}/disponibilidad`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ disponibilidad: 'vacaciones' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tecnico.disponibilidad).toBe('vacaciones');

      // Revertir
      await request(app)
        .patch(`/api/tecnicos/${tecnicoId}/disponibilidad`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ disponibilidad: 'disponible' })
        .expect(200);
    });

    test('Técnico debe poder actualizar su propia disponibilidad', async () => {
      const response = await request(app)
        .patch(`/api/tecnicos/${tecnicoId}/disponibilidad`)
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .send({ disponibilidad: 'ocupado' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tecnico.disponibilidad).toBe('ocupado');
    });
  });

  describe('GET /api/tecnicos/stats', () => {
    test('Admin debe poder obtener estadísticas', async () => {
      const response = await request(app)
        .get('/api/tecnicos/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('stats');
      expect(Array.isArray(response.body.data.stats)).toBe(true);
    });

    test('Técnico no debe poder obtener estadísticas', async () => {
      await request(app)
        .get('/api/tecnicos/stats')
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .expect(403);
    });
  });
});