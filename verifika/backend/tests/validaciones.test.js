jest.mock('../src/config/database');
jest.mock('../src/config/redis');

const request = require('supertest');
const app = require('../server');
const db = require('../src/config/database');
const Validacion = require('../src/models/Validacion');
const Comentario = require('../src/models/Comentario');
const Notificacion = require('../src/models/Notificacion');
const { fail } = require('assert');

describe('Sistema de Validaciones - Tests Completos', () => {
  let adminToken, clienteToken, tecnicoToken;
  let testValidacion, testActividad, testCliente, testTecnico;

  beforeAll(async () => {
    // Inicializar base de datos de prueba
    await db.initialize();
    
    // Obtener tokens de autenticación
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@verifika.com', password: 'admin123' });
    adminToken = adminLogin.body.token;

    const clienteLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'cliente@test.com', password: 'cliente123' });
    clienteToken = clienteLogin.body.token;

    const tecnicoLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'tecnico@test.com', password: 'tecnico123' });
    tecnicoToken = tecnicoLogin.body.token;

    // Crear datos de prueba
    await setupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
    await db.close();
  });

  beforeEach(async () => {
    // Limpiar notificaciones entre tests
    await db.execute('DELETE FROM vf_notificaciones WHERE id > 1000');
  });

  // =============================================
  // TESTS DE MODELO VALIDACION
  // =============================================

  describe('Modelo Validacion', () => {
    test('debería crear una validación correctamente', async () => {
      const validacionData = {
        actividad_id: testActividad.id,
        validador_id: 1,
        tecnico_id: testTecnico.id,
        cliente_id: testCliente.id,
        dias_plazo: 3,
        complejidad_revision: 'moderada'
      };

      const validacion = await Validacion.create(validacionData);

      expect(validacion).toBeDefined();
      expect(validacion.id).toBeDefined();
      expect(validacion.estado).toBe('pendiente_revision');
      expect(validacion.fecha_limite).toBeDefined();
      expect(validacion.escalada_automaticamente).toBe(false);
    });

    test('debería validar una actividad correctamente', async () => {
      const datosValidacion = {
        puntuacion_general: 8.5,
        criterios_calidad: {
          funcionalidad: 9,
          codigo_calidad: 8,
          documentacion: 8
        },
        comentario_principal: 'Excelente trabajo, cumple todos los requerimientos',
        aspectos_positivos: ['Código limpio', 'Bien documentado'],
        satisfaccion_cliente: 5
      };

      await testValidacion.validar(1, datosValidacion);

      expect(testValidacion.estado).toBe('validada');
      expect(testValidacion.puntuacion_general).toBe(8.5);
      expect(testValidacion.fecha_completada).toBeDefined();
      expect(testValidacion.tiempo_revision_horas).toBeDefined();
    });

    test('debería rechazar una actividad con feedback', async () => {
      const validacion = await Validacion.create({
        actividad_id: testActividad.id,
        validador_id: 1,
        tecnico_id: testTecnico.id,
        cliente_id: testCliente.id
      });

      const datosRechazo = {
        comentario_principal: 'Necesita correcciones en validaciones de entrada',
        aspectos_mejora: ['Agregar validación de email', 'Mejorar manejo de errores'],
        requerimientos_cambios: [{
          descripcion: 'Validar formato de email en registro',
          prioridad: 'alta'
        }],
        impacto_negocio: 'medio',
        satisfaccion_cliente: 2
      };

      await validacion.rechazar(1, datosRechazo);

      expect(validacion.estado).toBe('rechazada');
      expect(validacion.aspectos_mejora).toHaveLength(2);
      expect(validacion.requerimientos_cambios).toHaveLength(1);
      expect(validacion.impacto_negocio).toBe('medio');
    });

    test('debería escalar una validación correctamente', async () => {
      const validacion = await Validacion.create({
        actividad_id: testActividad.id,
        validador_id: 1,
        tecnico_id: testTecnico.id,
        cliente_id: testCliente.id
      });

      await validacion.escalar(2, 'Complejidad técnica alta requiere revisión de supervisor');

      expect(validacion.estado).toBe('escalada');
      expect(validacion.supervisor_escalado_id).toBe(2);
      expect(validacion.escalada_automaticamente).toBe(false);
    });

    test('debería calcular tiempo de revisión correctamente', async () => {
      const validacion = await Validacion.create({
        actividad_id: testActividad.id,
        validador_id: 1,
        tecnico_id: testTecnico.id,
        cliente_id: testCliente.id
      });

      // Simular inicio de revisión hace 2 horas
      const hace2Horas = new Date(Date.now() - 2 * 60 * 60 * 1000);
      await validacion.update({ fecha_inicio_revision: hace2Horas });

      const tiempoRevision = validacion.calculateTiempoRevision();
      expect(tiempoRevision).toBeCloseTo(2, 1);
    });

    test('debería verificar si está vencida', async () => {
      const validacion = await Validacion.create({
        actividad_id: testActividad.id,
        validador_id: 1,
        tecnico_id: testTecnico.id,
        cliente_id: testCliente.id
      });

      // Simular fecha límite en el pasado
      const ayer = new Date(Date.now() - 24 * 60 * 60 * 1000);
      await validacion.update({ fecha_limite: ayer });

      expect(validacion.isVencida()).toBe(true);
    });

    test('debería obtener dashboard de validaciones', async () => {
      const dashboard = await Validacion.getDashboard(testCliente.id);

      expect(dashboard).toHaveProperty('total_validaciones');
      expect(dashboard).toHaveProperty('pendientes_revision');
      expect(dashboard).toHaveProperty('validadas');
      expect(dashboard).toHaveProperty('rechazadas');
      expect(dashboard).toHaveProperty('tasa_aprobacion');
    });

    test('debería procesar escalamientos automáticos', async () => {
      // Crear validación vencida
      const validacionVencida = await Validacion.create({
        actividad_id: testActividad.id,
        validador_id: 1,
        tecnico_id: testTecnico.id,
        cliente_id: testCliente.id
      });

      const ayer = new Date(Date.now() - 24 * 60 * 60 * 1000);
      await validacionVencida.update({ fecha_limite: ayer });

      const resultado = await Validacion.procesarEscalamientosAutomaticos();

      expect(resultado).toHaveProperty('validaciones_procesadas');
      expect(typeof resultado.escaladas).toBe('number');
    });
  });

  // =============================================
  // TESTS DE MODELO COMENTARIO
  // =============================================

  describe('Modelo Comentario', () => {
    test('debería crear un comentario correctamente', async () => {
      const comentarioData = {
        validacion_id: testValidacion.id,
        usuario_id: 1,
        comentario: 'Excelente implementación del módulo de autenticación',
        tipo_comentario: 'general'
      };

      const comentario = await Comentario.create(comentarioData);

      expect(comentario).toBeDefined();
      expect(comentario.id).toBeDefined();
      expect(comentario.nivel_anidacion).toBe(0);
      expect(comentario.hilo_raiz_id).toBeNull();
    });

    test('debería crear comentarios anidados correctamente', async () => {
      // Comentario padre
      const comentarioPadre = await Comentario.create({
        validacion_id: testValidacion.id,
        usuario_id: 1,
        comentario: '¿Cómo funciona la validación de contraseñas?',
        tipo_comentario: 'pregunta'
      });

      // Respuesta anidada
      const respuesta = await Comentario.create({
        validacion_id: testValidacion.id,
        parent_id: comentarioPadre.id,
        usuario_id: 2,
        comentario: 'La validación usa regex para verificar...',
        tipo_comentario: 'general'
      });

      expect(respuesta.nivel_anidacion).toBe(1);
      expect(respuesta.hilo_raiz_id).toBe(comentarioPadre.id);
      expect(respuesta.parent_id).toBe(comentarioPadre.id);
    });

    test('debería limitar el nivel de anidación', async () => {
      let comentario = await Comentario.create({
        validacion_id: testValidacion.id,
        usuario_id: 1,
        comentario: 'Comentario nivel 0'
      });

      // Crear 5 niveles de anidación
      for (let i = 1; i <= 5; i++) {
        comentario = await Comentario.create({
          validacion_id: testValidacion.id,
          parent_id: comentario.id,
          usuario_id: 1,
          comentario: `Comentario nivel ${i}`
        });
      }

      // Intentar crear nivel 6 (debería fallar)
      try {
        await Comentario.create({
          validacion_id: testValidacion.id,
          parent_id: comentario.id,
          usuario_id: 1,
          comentario: 'Comentario nivel 6'
        });
        fail('Debería haber lanzado error por máximo nivel de anidación');
      } catch (error) {
        expect(error.message).toContain('Máximo nivel de anidación');
      }
    });

    test('debería obtener comentarios por validación jerárquicamente', async () => {
      const comentarios = await Comentario.findByValidacion(testValidacion.id);

      expect(Array.isArray(comentarios)).toBe(true);
      comentarios.forEach(comentario => {
        expect(comentario.nivel_anidacion).toBe(0); // Solo comentarios raíz
        if (comentario.respuestas) {
          expect(Array.isArray(comentario.respuestas)).toBe(true);
        }
      });
    });

    test('debería agregar adjuntos a comentarios', async () => {
      const comentario = await Comentario.create({
        validacion_id: testValidacion.id,
        usuario_id: 1,
        comentario: 'Comentario con adjunto'
      });

      const adjuntoInfo = {
        nombre: 'screenshot.png',
        ruta: '/uploads/screenshot.png',
        tipo: 'image/png',
        tamaño: 1024
      };

      await comentario.agregarAdjunto(adjuntoInfo);

      expect(comentario.adjuntos).toHaveLength(1);
      expect(comentario.adjuntos[0].nombre).toBe('screenshot.png');
    });

    test('debería eliminar comentarios preservando estructura', async () => {
      const comentarioPadre = await Comentario.create({
        validacion_id: testValidacion.id,
        usuario_id: 1,
        comentario: 'Comentario con respuestas'
      });

      await Comentario.create({
        validacion_id: testValidacion.id,
        parent_id: comentarioPadre.id,
        usuario_id: 2,
        comentario: 'Respuesta al comentario'
      });

      // Eliminar comentario padre (debería hacer soft delete)
      await comentarioPadre.delete();

      const comentarioActualizado = await Comentario.findById(comentarioPadre.id);
      expect(comentarioActualizado.comentario).toBe('[Comentario eliminado]');
    });

    test('debería obtener estadísticas de comentarios', async () => {
      const stats = await Comentario.getEstadisticasValidacion(testValidacion.id);

      expect(stats).toHaveProperty('total_comentarios');
      expect(stats).toHaveProperty('preguntas');
      expect(stats).toHaveProperty('sugerencias');
      expect(stats).toHaveProperty('participantes_unicos');
    });
  });

  // =============================================
  // TESTS DE API REST
  // =============================================

  describe('API REST - Endpoints Básicos', () => {
    test('GET /api/validaciones - debería listar validaciones con filtros', async () => {
      const response = await request(app)
        .get('/api/validaciones')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ cliente_id: testCliente.id });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body).toHaveProperty('pagination');
    });

    test('GET /api/validaciones/:id - debería obtener validación específica', async () => {
      const response = await request(app)
        .get(`/api/validaciones/${testValidacion.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testValidacion.id);
    });

    test('POST /api/validaciones - debería crear nueva validación', async () => {
      const validacionData = {
        actividad_id: testActividad.id,
        validador_id: 1,
        tecnico_id: testTecnico.id,
        cliente_id: testCliente.id,
        dias_plazo: 5,
        complejidad_revision: 'compleja'
      };

      const response = await request(app)
        .post('/api/validaciones')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validacionData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.estado).toBe('pendiente_revision');
    });

    test('PUT /api/validaciones/:id - debería actualizar validación', async () => {
      const updateData = {
        comentario_principal: 'Comentario actualizado',
        complejidad_revision: 'simple'
      };

      const response = await request(app)
        .put(`/api/validaciones/${testValidacion.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.comentario_principal).toBe('Comentario actualizado');
    });
  });

  describe('API REST - Workflow de Validación', () => {
    test('POST /api/validaciones/:id/validar - debería validar actividad', async () => {
      const validacion = await Validacion.create({
        actividad_id: testActividad.id,
        validador_id: 1,
        tecnico_id: testTecnico.id,
        cliente_id: testCliente.id
      });

      const datosValidacion = {
        puntuacion_general: 9.0,
        criterios_calidad: {
          funcionalidad: 9,
          codigo_calidad: 9,
          documentacion: 8
        },
        comentario_principal: 'Excelente implementación',
        aspectos_positivos: ['Código muy limpio', 'Excelente documentación'],
        satisfaccion_cliente: 5
      };

      const response = await request(app)
        .post(`/api/validaciones/${validacion.id}/validar`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(datosValidacion);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.estado).toBe('validada');
    });

    test('POST /api/validaciones/:id/rechazar - debería rechazar actividad', async () => {
      const validacion = await Validacion.create({
        actividad_id: testActividad.id,
        validador_id: 1,
        tecnico_id: testTecnico.id,
        cliente_id: testCliente.id
      });

      const datosRechazo = {
        comentario_principal: 'Necesita correcciones importantes en la validación de datos',
        aspectos_mejora: ['Validación de entrada', 'Manejo de errores'],
        requerimientos_cambios: [{
          descripcion: 'Implementar validación de formato de email',
          prioridad: 'alta'
        }],
        impacto_negocio: 'alto',
        satisfaccion_cliente: 2
      };

      const response = await request(app)
        .post(`/api/validaciones/${validacion.id}/rechazar`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(datosRechazo);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.estado).toBe('rechazada');
    });

    test('POST /api/validaciones/:id/escalar - debería escalar validación', async () => {
      const validacion = await Validacion.create({
        actividad_id: testActividad.id,
        validador_id: 1,
        tecnico_id: testTecnico.id,
        cliente_id: testCliente.id
      });

      const datosEscalamiento = {
        supervisor_id: 2,
        razon_escalamiento: 'Complejidad técnica requiere revisión especializada',
        urgencia: 'alta'
      };

      const response = await request(app)
        .post(`/api/validaciones/${validacion.id}/escalar`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(datosEscalamiento);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.estado).toBe('escalada');
    });

    test('POST /api/validaciones/:id/reabrir - debería reabrir validación (solo admin)', async () => {
      const validacion = await Validacion.create({
        actividad_id: testActividad.id,
        validador_id: 1,
        tecnico_id: testTecnico.id,
        cliente_id: testCliente.id,
        estado: 'validada'
      });

      const datosReapertura = {
        motivo_reapertura: 'Se encontraron issues adicionales que requieren revisión'
      };

      const response = await request(app)
        .post(`/api/validaciones/${validacion.id}/reabrir`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(datosReapertura);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.estado).toBe('reabierta');
    });
  });

  describe('API REST - Sistema de Comentarios', () => {
    test('GET /api/validaciones/:id/comentarios - debería listar comentarios', async () => {
      const response = await request(app)
        .get(`/api/validaciones/${testValidacion.id}/comentarios`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('POST /api/validaciones/:id/comentarios - debería agregar comentario', async () => {
      const comentarioData = {
        comentario: 'Muy buena implementación del sistema de autenticación',
        tipo_comentario: 'general'
      };

      const response = await request(app)
        .post(`/api/validaciones/${testValidacion.id}/comentarios`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(comentarioData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.comentario).toBe(comentarioData.comentario);
    });

    test('POST /api/validaciones/:id/comentarios - debería crear respuesta anidada', async () => {
      // Crear comentario padre
      const comentarioPadre = await Comentario.create({
        validacion_id: testValidacion.id,
        usuario_id: 1,
        comentario: '¿Qué framework utilizaron?'
      });

      const respuestaData = {
        comentario: 'Utilizamos Express.js con autenticación JWT',
        tipo_comentario: 'general',
        parent_id: comentarioPadre.id
      };

      const response = await request(app)
        .post(`/api/validaciones/${testValidacion.id}/comentarios`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(respuestaData);

      expect(response.status).toBe(201);
      expect(response.body.data.parent_id).toBe(comentarioPadre.id);
      expect(response.body.data.nivel_anidacion).toBe(1);
    });

    test('PUT /api/comentarios/:id - debería editar comentario propio', async () => {
      const comentario = await Comentario.create({
        validacion_id: testValidacion.id,
        usuario_id: 1,
        comentario: 'Comentario original'
      });

      const updateData = {
        comentario: 'Comentario editado con información adicional'
      };

      const response = await request(app)
        .put(`/api/comentarios/${comentario.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.comentario).toBe(updateData.comentario);
      expect(response.body.data.editado).toBe(true);
    });
  });

  describe('API REST - Dashboard y Reportes', () => {
    test('GET /api/validaciones/dashboard - debería obtener dashboard', async () => {
      const response = await request(app)
        .get('/api/validaciones/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('total_validaciones');
      expect(response.body.data).toHaveProperty('actividades_pendientes');
    });

    test('GET /api/validaciones/reportes/calidad - debería generar reporte de calidad', async () => {
      const response = await request(app)
        .get('/api/validaciones/reportes/calidad')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ 
          tipo_reporte: 'calidad',
          periodo: 30 
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('GET /api/validaciones/reportes/tendencias - debería generar tendencias', async () => {
      const response = await request(app)
        .get('/api/validaciones/reportes/tendencias')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ 
          tipo_reporte: 'tendencias',
          periodo: 7 
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('GET /api/validaciones/metricas - debería obtener métricas avanzadas', async () => {
      const response = await request(app)
        .get('/api/validaciones/metricas')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('comentarios');
      expect(response.body.data).toHaveProperty('usuarios_activos');
    });
  });

  // =============================================
  // TESTS DE PERMISOS Y SEGURIDAD
  // =============================================

  describe('Permisos y Seguridad', () => {
    test('debería denegar acceso sin token', async () => {
      const response = await request(app)
        .get('/api/validaciones');

      expect(response.status).toBe(401);
    });

    test('cliente debería ver solo sus validaciones', async () => {
      const response = await request(app)
        .get('/api/validaciones')
        .set('Authorization', `Bearer ${clienteToken}`);

      expect(response.status).toBe(200);
      response.body.data.forEach(validacion => {
        expect(validacion.cliente_id).toBe(testCliente.id);
      });
    });

    test('técnico debería ver solo sus validaciones', async () => {
      const response = await request(app)
        .get('/api/validaciones')
        .set('Authorization', `Bearer ${tecnicoToken}`);

      expect(response.status).toBe(200);
      response.body.data.forEach(validacion => {
        expect(validacion.tecnico_id).toBe(testTecnico.id);
      });
    });

    test('debería denegar validación a usuario no autorizado', async () => {
      const validacion = await Validacion.create({
        actividad_id: testActividad.id,
        validador_id: 2, // Diferente cliente
        tecnico_id: testTecnico.id,
        cliente_id: 2 // Diferente cliente
      });

      const response = await request(app)
        .post(`/api/validaciones/${validacion.id}/validar`)
        .set('Authorization', `Bearer ${clienteToken}`)
        .send({
          puntuacion_general: 8.0,
          criterios_calidad: { funcionalidad: 8 },
          comentario_principal: 'Test',
          aspectos_positivos: ['Test'],
          satisfaccion_cliente: 4
        });

      expect(response.status).toBe(403);
    });

    test('solo admin debería poder reabrir validaciones', async () => {
      const response = await request(app)
        .post(`/api/validaciones/${testValidacion.id}/reabrir`)
        .set('Authorization', `Bearer ${clienteToken}`)
        .send({ motivo_reapertura: 'Test reopen' });

      expect(response.status).toBe(403);
    });
  });

  // =============================================
  // TESTS DE VALIDACIÓN DE DATOS
  // =============================================

  describe('Validación de Datos', () => {
    test('debería rechazar datos inválidos al crear validación', async () => {
      const invalidData = {
        actividad_id: 'invalid',
        validador_id: -1,
        dias_plazo: 50 // Excede límite
      };

      const response = await request(app)
        .post('/api/validaciones')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('inválidos');
    });

    test('debería rechazar puntuación fuera de rango', async () => {
      const response = await request(app)
        .post(`/api/validaciones/${testValidacion.id}/validar`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          puntuacion_general: 15, // Fuera de rango 1-10
          criterios_calidad: { funcionalidad: 8 },
          comentario_principal: 'Test',
          aspectos_positivos: ['Test'],
          satisfaccion_cliente: 4
        });

      expect(response.status).toBe(400);
    });

    test('debería rechazar comentario muy corto', async () => {
      const response = await request(app)
        .post(`/api/validaciones/${testValidacion.id}/comentarios`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          comentario: 'Hi' // Muy corto
        });

      expect(response.status).toBe(400);
    });
  });

  // =============================================
  // TESTS DE NOTIFICACIONES
  // =============================================

  describe('Sistema de Notificaciones', () => {
    test('debería crear notificación al crear validación', async () => {
      const countBefore = await db.execute('SELECT COUNT(*) as count FROM vf_notificaciones');

      await Validacion.create({
        actividad_id: testActividad.id,
        validador_id: 1,
        tecnico_id: testTecnico.id,
        cliente_id: testCliente.id
      });

      const countAfter = await db.execute('SELECT COUNT(*) as count FROM vf_notificaciones');
      expect(countAfter[0][0].count).toBeGreaterThan(countBefore[0][0].count);
    });

    test('debería crear notificación al agregar comentario', async () => {
      const countBefore = await db.execute('SELECT COUNT(*) as count FROM vf_notificaciones');

      await request(app)
        .post(`/api/validaciones/${testValidacion.id}/comentarios`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          comentario: 'Comentario que debería generar notificación'
        });

      const countAfter = await db.execute('SELECT COUNT(*) as count FROM vf_notificaciones');
      expect(countAfter[0][0].count).toBeGreaterThan(countBefore[0][0].count);
    });
  });

  // =============================================
  // FUNCIONES DE UTILIDAD
  // =============================================

  async function setupTestData() {
    // Crear cliente de prueba
    const [clienteResult] = await db.execute(
      'INSERT INTO vf_clientes (nombre, email, telefono) VALUES (?, ?, ?)',
      ['Cliente Test', 'cliente@test.com', '1234567890']
    );
    testCliente = { id: clienteResult.insertId };

    // Crear técnico de prueba
    const [tecnicoResult] = await db.execute(
      'INSERT INTO vf_tecnicos (nombre, apellidos, email, telefono) VALUES (?, ?, ?, ?)',
      ['Técnico', 'Test', 'tecnico@test.com', '1234567890']
    );
    testTecnico = { id: tecnicoResult.insertId };

    // Crear actividad de prueba
    const [actividadResult] = await db.execute(
      'INSERT INTO vf_actividades (titulo, descripcion, tecnico_id, estado) VALUES (?, ?, ?, ?)',
      ['Actividad Test', 'Descripción test', testTecnico.id, 'completada']
    );
    testActividad = { id: actividadResult.insertId };

    // Crear validación de prueba
    testValidacion = await Validacion.create({
      actividad_id: testActividad.id,
      validador_id: 1,
      tecnico_id: testTecnico.id,
      cliente_id: testCliente.id
    });
  }

  async function cleanupTestData() {
    if (testValidacion) {
      await db.execute('DELETE FROM vf_validaciones WHERE id = ?', [testValidacion.id]);
    }
    if (testActividad) {
      await db.execute('DELETE FROM vf_actividades WHERE id = ?', [testActividad.id]);
    }
    if (testTecnico) {
      await db.execute('DELETE FROM vf_tecnicos WHERE id = ?', [testTecnico.id]);
    }
    if (testCliente) {
      await db.execute('DELETE FROM vf_clientes WHERE id = ?', [testCliente.id]);
    }

    // Limpiar datos de test
    await db.execute('DELETE FROM vf_comentarios_validacion WHERE validacion_id > 1000');
    await db.execute('DELETE FROM vf_notificaciones WHERE id > 1000');
  }
});
