jest.mock('../src/config/database');
jest.mock('../src/config/redis');

const request = require('supertest');
const app = require('../server');
const database = require('../src/config/database');
const Actividad = require('../src/models/Actividad');

describe('API Actividades - FASE 4 Tests', () => {
  let adminToken;
  let tecnicoToken;
  let clienteToken;
  let testActividad;
  let testAsignacionId = 1;
  let testTecnicoId = 1;

  beforeAll(async () => {
    // Login como admin
    const adminResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@verifika.com',
        password: 'admin123'
      });
    
    if (adminResponse.status === 200) {
      adminToken = adminResponse.body.data.token;
    }

    // Login como técnico
    const tecnicoResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'juan.perez@verifika.com',
        password: 'tecnico123'
      });
    
    if (tecnicoResponse.status === 200) {
      tecnicoToken = tecnicoResponse.body.data.token;
    }
  });

  afterAll(async () => {
    // Limpiar datos de prueba
    try {
      await database.execute('DELETE FROM vf_actividades WHERE titulo LIKE "%TEST%"');
    } catch (error) {
      console.log('Error limpiando datos de prueba:', error.message);
    }
  });

  describe('POST /api/actividades - Crear actividad', () => {
    test('Debe crear una nueva actividad como admin', async () => {
      if (!adminToken) {
        console.log('Admin token no disponible, saltando test');
        return;
      }

      const nuevaActividad = {
        asignacion_id: testAsignacionId,
        tecnico_id: testTecnicoId,
        titulo: 'TEST - Actividad de prueba unitaria',
        descripcion: 'Descripción de prueba para testing automatizado',
        tipo_actividad: 'desarrollo',
        estado: 'pendiente',
        prioridad: 'media',
        tiempo_estimado_horas: 8.5,
        competencias_utilizadas: ['JavaScript', 'Node.js', 'Testing'],
        herramientas_utilizadas: ['VS Code', 'Jest', 'Postman']
      };

      const response = await request(app)
        .post('/api/actividades')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(nuevaActividad);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.titulo).toBe(nuevaActividad.titulo);
      expect(response.body.data.asignacion_id).toBe(nuevaActividad.asignacion_id);
      expect(response.body.data.tecnico_id).toBe(nuevaActividad.tecnico_id);
      expect(response.body.data.estado).toBe('pendiente');

      testActividad = response.body.data;
    });

    test('Debe fallar al crear actividad sin autenticación', async () => {
      const response = await request(app)
        .post('/api/actividades')
        .send({
          asignacion_id: testAsignacionId,
          tecnico_id: testTecnicoId,
          titulo: 'TEST - Sin auth'
        });

      expect(response.status).toBe(401);
    });

    test('Debe fallar con datos inválidos', async () => {
      if (!adminToken) return;

      const response = await request(app)
        .post('/api/actividades')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          asignacion_id: 'invalid',
          titulo: 'AB' // Muy corto
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('inválidos');
    });
  });

  describe('GET /api/actividades - Listar actividades', () => {
    test('Debe listar actividades como admin', async () => {
      if (!adminToken) return;

      const response = await request(app)
        .get('/api/actividades')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('Debe aplicar filtros correctamente', async () => {
      if (!adminToken) return;

      const response = await request(app)
        .get('/api/actividades?estado=pendiente&limit=5')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeLessThanOrEqual(5);
    });

    test('Técnico debe ver solo sus actividades', async () => {
      if (!tecnicoToken) return;

      const response = await request(app)
        .get('/api/actividades')
        .set('Authorization', `Bearer ${tecnicoToken}`);

      expect(response.status).toBe(200);
      // Verificar que todas las actividades pertenecen al técnico
      if (response.body.data.length > 0) {
        response.body.data.forEach(actividad => {
          expect(actividad.tecnico_id).toBe(testTecnicoId);
        });
      }
    });
  });

  describe('GET /api/actividades/:id - Obtener actividad específica', () => {
    test('Debe obtener actividad por ID como admin', async () => {
      if (!adminToken || !testActividad) return;

      const response = await request(app)
        .get(`/api/actividades/${testActividad.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(testActividad.id);
      expect(response.body.data.titulo).toBe(testActividad.titulo);
    });

    test('Debe fallar con ID inexistente', async () => {
      if (!adminToken) return;

      const response = await request(app)
        .get('/api/actividades/99999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/actividades/:id - Actualizar actividad', () => {
    test('Debe actualizar actividad como admin', async () => {
      if (!adminToken || !testActividad) return;

      const datosActualizacion = {
        titulo: 'TEST - Actividad actualizada',
        descripcion: 'Descripción actualizada en test',
        prioridad: 'alta'
      };

      const response = await request(app)
        .put(`/api/actividades/${testActividad.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(datosActualizacion);

      expect(response.status).toBe(200);
      expect(response.body.data.titulo).toBe(datosActualizacion.titulo);
      expect(response.body.data.prioridad).toBe(datosActualizacion.prioridad);
    });
  });

  describe('Cronómetro - Tracking de tiempo', () => {
    test('Debe iniciar cronómetro correctamente', async () => {
      if (!tecnicoToken || !testActividad) return;

      const response = await request(app)
        .post(`/api/actividades/${testActividad.id}/cronometro/iniciar`)
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .send({
          accion: 'iniciar',
          descripcion_actual: 'Iniciando trabajo en actividad de test'
        });

      expect(response.status).toBe(200);
      expect(response.body.data.cronometro_activo).toBe(true);
      expect(response.body.data.estado).toBe('progreso');
    });

    test('Debe pausar cronómetro', async () => {
      if (!tecnicoToken || !testActividad) return;

      const response = await request(app)
        .post(`/api/actividades/${testActividad.id}/cronometro/pausar`)
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .send({
          accion: 'pausar',
          razon_pausa: 'Reunión de equipo'
        });

      expect(response.status).toBe(200);
      expect(response.body.data.cronometro_activo).toBe(false);
    });

    test('Debe reanudar cronómetro', async () => {
      if (!tecnicoToken || !testActividad) return;

      const response = await request(app)
        .post(`/api/actividades/${testActividad.id}/cronometro/reanudar`)
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body.data.cronometro_activo).toBe(true);
    });

    test('Debe finalizar cronómetro', async () => {
      if (!tecnicoToken || !testActividad) return;

      const response = await request(app)
        .post(`/api/actividades/${testActividad.id}/cronometro/finalizar`)
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .send({
          accion: 'finalizar',
          resumen_trabajo: 'Trabajo de testing completado exitosamente',
          tiempo_efectivo_horas: 2.5,
          porcentaje_completado: 100
        });

      expect(response.status).toBe(200);
      expect(response.body.data.cronometro_activo).toBe(false);
      expect(response.body.data.estado).toBe('completada');
    });
  });

  describe('PATCH /api/actividades/:id/status - Cambiar estado', () => {
    test('Admin debe poder cambiar cualquier estado', async () => {
      if (!adminToken || !testActividad) return;

      const response = await request(app)
        .patch(`/api/actividades/${testActividad.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          estado: 'validada',
          observaciones: 'Actividad aprobada por admin en testing'
        });

      expect(response.status).toBe(200);
      expect(response.body.data.estado).toBe('validada');
    });
  });

  describe('GET /api/actividades/stats - Estadísticas', () => {
    test('Debe obtener estadísticas como admin', async () => {
      if (!adminToken) return;

      const response = await request(app)
        .get('/api/actividades/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('total_actividades');
      expect(response.body.data).toHaveProperty('actividades_completadas');
      expect(response.body.data).toHaveProperty('total_horas_trabajadas');
    });

    test('No debe permitir estadísticas a no-admin', async () => {
      if (!tecnicoToken) return;

      const response = await request(app)
        .get('/api/actividades/stats')
        .set('Authorization', `Bearer ${tecnicoToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/actividades/asignacion/:id - Actividades por asignación', () => {
    test('Debe obtener actividades de una asignación', async () => {
      if (!adminToken) return;

      const response = await request(app)
        .get(`/api/actividades/asignacion/${testAsignacionId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/actividades/tecnico/:id - Actividades por técnico', () => {
    test('Técnico debe poder ver sus propias actividades', async () => {
      if (!tecnicoToken) return;

      const response = await request(app)
        .get(`/api/actividades/tecnico/${testTecnicoId}`)
        .set('Authorization', `Bearer ${tecnicoToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('Técnico no debe ver actividades de otro técnico', async () => {
      if (!tecnicoToken) return;

      const response = await request(app)
        .get('/api/actividades/tecnico/99999')
        .set('Authorization', `Bearer ${tecnicoToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/actividades/cronometro/activos - Cronómetros activos', () => {
    test('Debe listar cronómetros activos', async () => {
      if (!adminToken) return;

      const response = await request(app)
        .get('/api/actividades/cronometro/activos')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/actividades/:id/enlaces - Agregar enlace externo', () => {
    test('Debe agregar enlace externo', async () => {
      if (!tecnicoToken || !testActividad) return;

      const enlace = {
        url: 'https://github.com/empresa/proyecto-test',
        titulo: 'Repositorio del proyecto',
        descripcion: 'Código fuente en GitHub'
      };

      const response = await request(app)
        .post(`/api/actividades/${testActividad.id}/enlaces`)
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .send(enlace);

      expect(response.status).toBe(200);
      expect(response.body.data.enlaces_externos).toContainEqual(
        expect.objectContaining({
          url: enlace.url,
          titulo: enlace.titulo
        })
      );
    });
  });

  describe('GET /api/actividades/pendientes-validacion - Pendientes validación', () => {
    test('Admin debe ver actividades pendientes', async () => {
      if (!adminToken) return;

      const response = await request(app)
        .get('/api/actividades/pendientes-validacion')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Validaciones de datos', () => {
    test('Debe validar título mínimo', async () => {
      if (!adminToken) return;

      const response = await request(app)
        .post('/api/actividades')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          asignacion_id: testAsignacionId,
          tecnico_id: testTecnicoId,
          titulo: 'AB' // Muy corto
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('inválidos');
    });

    test('Debe validar tiempo estimado positivo', async () => {
      if (!adminToken) return;

      const response = await request(app)
        .post('/api/actividades')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          asignacion_id: testAsignacionId,
          tecnico_id: testTecnicoId,
          titulo: 'TEST - Tiempo inválido',
          tiempo_estimado_horas: -5
        });

      expect(response.status).toBe(400);
    });

    test('Debe validar porcentaje en rango 0-100', async () => {
      if (!adminToken || !testActividad) return;

      const response = await request(app)
        .put(`/api/actividades/${testActividad.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          porcentaje_completado: 150 // Inválido
        });

      expect(response.status).toBe(400);
    });

    test('Debe validar prioridad válida', async () => {
      if (!adminToken || !testActividad) return;

      const response = await request(app)
        .put(`/api/actividades/${testActividad.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          prioridad: 'urgentisima' // Inválido
        });

      expect(response.status).toBe(400);
    });
  });

  describe('Cleanup - Eliminar actividad de prueba', () => {
    test('Debe eliminar actividad como admin', async () => {
      if (!adminToken || !testActividad) return;

      const response = await request(app)
        .delete(`/api/actividades/${testActividad.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});

// Tests unitarios para el modelo Actividad
describe('Modelo Actividad - Tests Unitarios', () => {
  
  describe('Validaciones de negocio', () => {
    test('getDuracionFormateada debe formatear correctamente', () => {
      const actividad = new Actividad({
        id: 1,
        fecha_inicio: new Date('2025-01-01T09:00:00'),
        fecha_fin: new Date('2025-01-01T12:30:00')
      });

      const duracion = actividad.getDuracionFormateada();
      expect(duracion).toBe('3h 30m');
    });

    test('isAtrasada debe detectar actividades atrasadas', () => {
      const actividad = new Actividad({
        id: 1,
        fecha_fin_estimada: new Date('2020-01-01'), // Fecha pasada
        estado: 'progreso'
      });

      expect(actividad.isAtrasada()).toBe(true);
    });

    test('toJSON debe incluir campos calculados', () => {
      const actividad = new Actividad({
        id: 1,
        titulo: 'Test',
        archivos_adjuntos: [],
        capturas_pantalla: [],
        fecha_inicio: new Date()
      });

      const json = actividad.toJSON();
      expect(json).toHaveProperty('total_evidencias');
      expect(json).toHaveProperty('duracion_formateada');
      expect(json).toHaveProperty('atrasada');
    });
  });

  describe('Cálculos automáticos', () => {
    test('calcularTiempoTrabajado debe calcular horas correctas', () => {
      const actividad = new Actividad({
        id: 1,
        fecha_inicio: new Date('2025-01-01T09:00:00'),
        fecha_fin: new Date('2025-01-01T17:00:00')
      });

      const tiempo = actividad.calcularTiempoTrabajado();
      expect(tiempo).toBe(8); // 8 horas
    });
  });
});
