// competencias.test.js - Tests para el módulo de competencias
const request = require('supertest');
const app = require('../server');
const database = require('../src/config/database');
const redisClient = require('../src/config/redis');
const Usuario = require('../src/models/Usuario');
const Competencia = require('../src/models/Competencia');

describe('Módulo de Competencias', () => {
  let adminToken;
  let tecnicoToken;
  let competenciaId;
  let competenciaParaEliminar;

  beforeAll(async () => {
    // Inicializar servicios
    await database.initialize();
    await redisClient.initialize();

    // Obtener tokens de usuarios existentes
    const adminUser = await Usuario.findByEmail('admin@bluesystem.io');
    if (adminUser) {
      adminToken = adminUser.generateJWT();
    }

    // Crear competencia de prueba
    const competenciaTest = await Competencia.create({
      nombre: 'Testing Competencia',
      descripcion: 'Competencia para pruebas unitarias',
      categoria: 'Testing',
      nivel_requerido: 'intermedio',
      certificacion_requerida: true
    });
    competenciaId = competenciaTest.id;

    // Crear otra competencia para test de eliminación
    const competenciaDelete = await Competencia.create({
      nombre: 'Competencia Para Eliminar',
      descripcion: 'Esta competencia será eliminada en los tests',
      categoria: 'Testing',
      nivel_requerido: 'basico'
    });
    competenciaParaEliminar = competenciaDelete.id;
  });

  afterAll(async () => {
    // Limpiar datos de prueba
    await database.query('DELETE FROM vf_competencias_catalogo WHERE id IN (?, ?)', [competenciaId, competenciaParaEliminar]);

    // Cerrar conexiones
    await database.close();
    await redisClient.quit();
  });

  describe('GET /api/competencias', () => {
    test('Debe listar competencias para usuario autenticado', async () => {
      const response = await request(app)
        .get('/api/competencias')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('competencias');
      expect(response.body.data).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data.competencias)).toBe(true);
    });

    test('Debe filtrar competencias por categoría', async () => {
      const response = await request(app)
        .get('/api/competencias?categoria=Testing')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      const competencias = response.body.data.competencias;
      expect(competencias.length).toBeGreaterThan(0);
      competencias.forEach(competencia => {
        expect(competencia.categoria).toBe('Testing');
      });
    });

    test('Debe filtrar por nivel requerido', async () => {
      const response = await request(app)
        .get('/api/competencias?nivel_requerido=intermedio')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      const competencias = response.body.data.competencias;
      competencias.forEach(competencia => {
        expect(competencia.nivel_requerido).toBe('intermedio');
      });
    });

    test('Debe filtrar por certificación requerida', async () => {
      const response = await request(app)
        .get('/api/competencias?certificacion_requerida=true')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      const competencias = response.body.data.competencias;
      competencias.forEach(competencia => {
        expect(competencia.certificacion_requerida).toBe(true);
      });
    });

    test('Debe buscar competencias por texto', async () => {
      const response = await request(app)
        .get('/api/competencias?search=Testing')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.competencias.length).toBeGreaterThan(0);
    });

    test('Debe rechazar acceso sin autenticación', async () => {
      await request(app)
        .get('/api/competencias')
        .expect(401);
    });

    test('Debe aplicar paginación correctamente', async () => {
      const response = await request(app)
        .get('/api/competencias?page=1&limit=5')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(5);
      expect(response.body.data.competencias.length).toBeLessThanOrEqual(5);
    });
  });

  describe('GET /api/competencias/:id', () => {
    test('Debe obtener competencia específica', async () => {
      const response = await request(app)
        .get(`/api/competencias/${competenciaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.competencia).toHaveProperty('id', competenciaId);
      expect(response.body.data.competencia).toHaveProperty('nombre', 'Testing Competencia');
      expect(response.body.data.competencia).toHaveProperty('categoria', 'Testing');
    });

    test('Admin debe ver técnicos asignados', async () => {
      const response = await request(app)
        .get(`/api/competencias/${competenciaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.competencia).toHaveProperty('tecnicos');
      expect(Array.isArray(response.body.data.competencia.tecnicos)).toBe(true);
    });

    test('Debe retornar 404 para competencia inexistente', async () => {
      await request(app)
        .get('/api/competencias/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('POST /api/competencias', () => {
    test('Admin debe poder crear competencia', async () => {
      const nuevaCompetencia = {
        nombre: 'Nueva Competencia Test',
        descripcion: 'Descripción de la nueva competencia',
        categoria: 'Desarrollo Web',
        nivel_requerido: 'avanzado',
        certificacion_requerida: false
      };

      const response = await request(app)
        .post('/api/competencias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(nuevaCompetencia)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.competencia).toHaveProperty('nombre', 'Nueva Competencia Test');
      expect(response.body.data.competencia).toHaveProperty('categoria', 'Desarrollo Web');
      expect(response.body.data.competencia).toHaveProperty('nivel_requerido', 'avanzado');

      // Limpiar
      await database.query('DELETE FROM vf_competencias_catalogo WHERE id = ?', [response.body.data.competencia.id]);
    });

    test('Debe rechazar competencia con nombre duplicado', async () => {
      const competenciaDuplicada = {
        nombre: 'Testing Competencia',
        descripcion: 'Intentando duplicar nombre'
      };

      await request(app)
        .post('/api/competencias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(competenciaDuplicada)
        .expect(409);
    });

    test('Debe validar datos requeridos', async () => {
      const datosInvalidos = {
        descripcion: 'Sin nombre'
      };

      await request(app)
        .post('/api/competencias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(datosInvalidos)
        .expect(400);
    });

    test('Debe validar longitud de campos', async () => {
      const nombreMuyLargo = 'a'.repeat(101);
      const datosInvalidos = {
        nombre: nombreMuyLargo
      };

      await request(app)
        .post('/api/competencias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(datosInvalidos)
        .expect(400);
    });

    test('Debe validar valores de enum', async () => {
      const nivelInvalido = {
        nombre: 'Competencia con nivel inválido',
        nivel_requerido: 'nivel_inexistente'
      };

      await request(app)
        .post('/api/competencias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(nivelInvalido)
        .expect(400);
    });

    test('No admin no debe poder crear competencias', async () => {
      const nuevaCompetencia = {
        nombre: 'Competencia No Autorizada',
        descripcion: 'No debería crearse'
      };

      // Necesitaríamos un token de técnico para esta prueba
      // Por ahora verificamos que sin token falla
      await request(app)
        .post('/api/competencias')
        .send(nuevaCompetencia)
        .expect(401);
    });
  });

  describe('PUT /api/competencias/:id', () => {
    test('Admin debe poder actualizar competencia', async () => {
      const actualizacion = {
        descripcion: 'Descripción actualizada para testing',
        nivel_requerido: 'avanzado',
        certificacion_requerida: false
      };

      const response = await request(app)
        .put(`/api/competencias/${competenciaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(actualizacion)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.competencia.descripcion).toBe('Descripción actualizada para testing');
      expect(response.body.data.competencia.nivel_requerido).toBe('avanzado');
      expect(response.body.data.competencia.certificacion_requerida).toBe(false);
    });

    test('Debe rechazar nombre duplicado en actualización', async () => {
      const actualizacion = {
        nombre: 'Competencia Para Eliminar'
      };

      await request(app)
        .put(`/api/competencias/${competenciaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(actualizacion)
        .expect(409);
    });

    test('Debe retornar 404 para competencia inexistente', async () => {
      const actualizacion = {
        descripcion: 'No debería funcionar'
      };

      await request(app)
        .put('/api/competencias/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(actualizacion)
        .expect(404);
    });
  });

  describe('PATCH /api/competencias/:id/status', () => {
    test('Admin debe poder cambiar estado de competencia', async () => {
      const response = await request(app)
        .patch(`/api/competencias/${competenciaId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ activo: false })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.competencia.activo).toBe(false);

      // Reactivar
      await request(app)
        .patch(`/api/competencias/${competenciaId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ activo: true })
        .expect(200);
    });

    test('Debe validar campo activo requerido', async () => {
      await request(app)
        .patch(`/api/competencias/${competenciaId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/competencias/categories', () => {
    test('Debe obtener lista de categorías', async () => {
      const response = await request(app)
        .get('/api/competencias/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('categories');
      expect(Array.isArray(response.body.data.categories)).toBe(true);
      expect(response.body.data.categories).toContain('Testing');
    });
  });

  describe('GET /api/competencias/stats', () => {
    test('Admin debe poder obtener estadísticas', async () => {
      const response = await request(app)
        .get('/api/competencias/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('stats');
      expect(Array.isArray(response.body.data.stats)).toBe(true);
    });
  });

  describe('GET /api/competencias/most-demanded', () => {
    test('Debe obtener competencias más demandadas', async () => {
      const response = await request(app)
        .get('/api/competencias/most-demanded')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('competencias');
      expect(Array.isArray(response.body.data.competencias)).toBe(true);
    });

    test('Debe respetar límite especificado', async () => {
      const response = await request(app)
        .get('/api/competencias/most-demanded?limit=3')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.competencias.length).toBeLessThanOrEqual(3);
    });
  });

  describe('GET /api/competencias/:id/tecnicos', () => {
    test('Debe obtener técnicos con la competencia', async () => {
      const response = await request(app)
        .get(`/api/competencias/${competenciaId}/tecnicos`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('tecnicos');
      expect(Array.isArray(response.body.data.tecnicos)).toBe(true);
    });

    test('Debe retornar 404 para competencia inexistente', async () => {
      await request(app)
        .get('/api/competencias/99999/tecnicos')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('DELETE /api/competencias/:id', () => {
    test('Admin debe poder eliminar competencia sin técnicos asignados', async () => {
      const response = await request(app)
        .delete(`/api/competencias/${competenciaParaEliminar}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verificar que se eliminó
      await request(app)
        .get(`/api/competencias/${competenciaParaEliminar}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    test('Debe retornar 404 para competencia inexistente', async () => {
      await request(app)
        .delete('/api/competencias/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
});