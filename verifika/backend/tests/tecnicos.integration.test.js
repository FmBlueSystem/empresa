// tecnicos.integration.test.js - Tests de integración para el módulo completo de técnicos
jest.mock('../src/config/database');
jest.mock('../src/config/redis');

const request = require('supertest');
const app = require('../server');
const database = require('../src/config/database');
const redisClient = require('../src/config/redis');
const Usuario = require('../src/models/Usuario');
const Tecnico = require('../src/models/Tecnico');
const Competencia = require('../src/models/Competencia');

describe('Integración Completa - Módulo de Técnicos', () => {
  let adminToken;
  let tecnicoToken;
  let clienteToken;
  let tecnicoId;
  let competenciaNodeId;
  let competenciaReactId;
  let documentoId;

  beforeAll(async () => {
    // Inicializar servicios
    await database.initialize();
    await redisClient.initialize();

    // Obtener token admin
    const adminUser = await Usuario.findByEmail('admin@bluesystem.io');
    if (adminUser) {
      adminToken = adminUser.generateJWT();
    }

    // Crear competencias de prueba
    const competenciaNode = await Competencia.create({
      nombre: 'Node.js Avanzado',
      descripcion: 'Desarrollo backend con Node.js y Express',
      categoria: 'Backend',
      nivel_requerido: 'avanzado',
      certificacion_requerida: true
    });
    competenciaNodeId = competenciaNode.id;

    const competenciaReact = await Competencia.create({
      nombre: 'React Frontend',
      descripcion: 'Desarrollo frontend con React y TypeScript',
      categoria: 'Frontend',
      nivel_requerido: 'intermedio',
      certificacion_requerida: false
    });
    competenciaReactId = competenciaReact.id;
  });

  afterAll(async () => {
    // Limpiar todos los datos de prueba
    if (tecnicoId) {
      await database.query('DELETE FROM vf_tecnicos_documentos WHERE tecnico_id = ?', [tecnicoId]);
      await database.query('DELETE FROM vf_tecnicos_competencias WHERE tecnico_id = ?', [tecnicoId]);
      await database.query('DELETE FROM vf_tecnicos_perfiles WHERE id = ?', [tecnicoId]);
      
      const tecnico = await database.query('SELECT usuario_id FROM vf_tecnicos_perfiles WHERE id = ?', [tecnicoId]);
      if (tecnico.length > 0) {
        await database.query('DELETE FROM vf_usuarios WHERE id = ?', [tecnico[0].usuario_id]);
      }
    }

    await database.query('DELETE FROM vf_usuarios WHERE email = ?', ['fullstack.dev@integration.test']);
    await database.query('DELETE FROM vf_competencias_catalogo WHERE id IN (?, ?)', [competenciaNodeId, competenciaReactId]);

    // Cerrar conexiones
    await database.close();
    await redisClient.quit();
  });

  describe('Flujo Completo de Gestión de Técnico', () => {
    test('1. Crear técnico completo con perfil detallado', async () => {
      const nuevoTecnico = {
        usuario: {
          email: 'fullstack.dev@integration.test',
          nombre: 'Ana',
          apellido: 'Developer',
          telefono: '+34 612345678',
          password: 'SecurePass123!'
        },
        perfil: {
          numero_identificacion: '12345678Z',
          fecha_nacimiento: '1990-05-15',
          direccion: 'Calle Principal 123, 2º B',
          ciudad: 'Madrid',
          pais: 'España',
          experiencia_anos: 8,
          nivel_experiencia: 'senior',
          disponibilidad: 'disponible',
          tarifa_por_hora: 65.50,
          moneda: 'EUR',
          biografia: 'Desarrolladora Full Stack especializada en aplicaciones web modernas. Experiencia en startups y empresas tecnológicas.'
        }
      };

      const response = await request(app)
        .post('/api/tecnicos')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(nuevoTecnico)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tecnico).toHaveProperty('id');
      expect(response.body.data.tecnico.nombre).toBe('Ana');
      expect(response.body.data.tecnico.apellido).toBe('Developer');
      expect(response.body.data.tecnico.email).toBe('fullstack.dev@integration.test');
      expect(response.body.data.tecnico.ciudad).toBe('Madrid');
      expect(response.body.data.tecnico.experiencia_anos).toBe(8);
      expect(response.body.data.tecnico.nivel_experiencia).toBe('senior');
      expect(response.body.data.tecnico.tarifa_por_hora).toBe('65.50');

      tecnicoId = response.body.data.tecnico.id;

      // Obtener token del técnico creado
      const tecnicoUser = await Usuario.findByEmail('fullstack.dev@integration.test');
      tecnicoToken = tecnicoUser.generateJWT();
    });

    test('2. Agregar múltiples competencias al técnico', async () => {
      // Agregar competencia Node.js
      const responseNode = await request(app)
        .post(`/api/tecnicos/${tecnicoId}/competencias`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          competencia_id: competenciaNodeId,
          nivel_actual: 'experto',
          certificado: true,
          fecha_certificacion: '2023-01-15'
        })
        .expect(200);

      expect(responseNode.body.success).toBe(true);

      // Agregar competencia React
      const responseReact = await request(app)
        .post(`/api/tecnicos/${tecnicoId}/competencias`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          competencia_id: competenciaReactId,
          nivel_actual: 'avanzado',
          certificado: false
        })
        .expect(200);

      expect(responseReact.body.success).toBe(true);
    });

    test('3. Verificar competencias asignadas', async () => {
      const response = await request(app)
        .get(`/api/tecnicos/${tecnicoId}/competencias`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.competencias).toHaveLength(2);

      const competencias = response.body.data.competencias;
      const nodeCompetencia = competencias.find(c => c.competencia_id === competenciaNodeId);
      const reactCompetencia = competencias.find(c => c.competencia_id === competenciaReactId);

      expect(nodeCompetencia).toBeDefined();
      expect(nodeCompetencia.nivel_actual).toBe('experto');
      expect(nodeCompetencia.certificado).toBe(true);

      expect(reactCompetencia).toBeDefined();
      expect(reactCompetencia.nivel_actual).toBe('avanzado');
      expect(reactCompetencia.certificado).toBe(false);
    });

    test('4. Técnico actualiza su propio perfil', async () => {
      const actualizacion = {
        biografia: 'Desarrolladora Full Stack con 8+ años de experiencia. Especializada en React, Node.js y arquitecturas cloud. Apasionada por el código limpio y las buenas prácticas.',
        tarifa_por_hora: 70.00,
        direccion: 'Calle Nueva 456, 3º A'
      };

      const response = await request(app)
        .put(`/api/tecnicos/${tecnicoId}`)
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .send(actualizacion)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tecnico.biografia).toContain('8+ años de experiencia');
      expect(response.body.data.tecnico.tarifa_por_hora).toBe('70.00');
      expect(response.body.data.tecnico.direccion).toBe('Calle Nueva 456, 3º A');
    });

    test('5. Cambiar disponibilidad del técnico', async () => {
      // Cambiar a ocupado
      const responseOcupado = await request(app)
        .patch(`/api/tecnicos/${tecnicoId}/disponibilidad`)
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .send({ disponibilidad: 'ocupado' })
        .expect(200);

      expect(responseOcupado.body.success).toBe(true);
      expect(responseOcupado.body.data.tecnico.disponibilidad).toBe('ocupado');

      // Verificar que no aparece en técnicos disponibles
      const availableResponse = await request(app)
        .get('/api/tecnicos/available')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const availableTecnicos = availableResponse.body.data.tecnicos;
      const tecnicoFound = availableTecnicos.find(t => t.id === tecnicoId);
      expect(tecnicoFound).toBeUndefined();

      // Cambiar de vuelta a disponible
      await request(app)
        .patch(`/api/tecnicos/${tecnicoId}/disponibilidad`)
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .send({ disponibilidad: 'disponible' })
        .expect(200);
    });

    test('6. Buscar técnicos con competencias específicas', async () => {
      // Buscar técnicos con competencia Node.js
      const responseNode = await request(app)
        .get(`/api/tecnicos/available?competencias=${competenciaNodeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(responseNode.body.success).toBe(true);
      const tecnicosWithNode = responseNode.body.data.tecnicos;
      const tecnicoFound = tecnicosWithNode.find(t => t.id === tecnicoId);
      expect(tecnicoFound).toBeDefined();

      // Buscar técnicos con múltiples competencias
      const responseBoth = await request(app)
        .get(`/api/tecnicos/available?competencias=${competenciaNodeId},${competenciaReactId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(responseBoth.body.success).toBe(true);
      const tecnicosWithBoth = responseBoth.body.data.tecnicos;
      const tecnicoFoundBoth = tecnicosWithBoth.find(t => t.id === tecnicoId);
      expect(tecnicoFoundBoth).toBeDefined();
    });

    test('7. Filtrar técnicos por múltiples criterios', async () => {
      const response = await request(app)
        .get(`/api/tecnicos?ciudad=Madrid&nivel_experiencia=senior&disponibilidad=disponible`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      const tecnicos = response.body.data.tecnicos;
      const tecnicoEncontrado = tecnicos.find(t => t.id === tecnicoId);
      expect(tecnicoEncontrado).toBeDefined();
      expect(tecnicoEncontrado.ciudad).toBe('Madrid');
      expect(tecnicoEncontrado.nivel_experiencia).toBe('senior');
      expect(tecnicoEncontrado.disponibilidad).toBe('disponible');
    });

    test('8. Buscar técnicos por texto', async () => {
      const response = await request(app)
        .get('/api/tecnicos?search=Ana')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      const tecnicos = response.body.data.tecnicos;
      const tecnicoEncontrado = tecnicos.find(t => t.id === tecnicoId);
      expect(tecnicoEncontrado).toBeDefined();
    });

    test('9. Verificar perfil completo del técnico', async () => {
      const response = await request(app)
        .get(`/api/tecnicos/${tecnicoId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      const tecnico = response.body.data.tecnico;

      // Verificar datos básicos
      expect(tecnico.nombre).toBe('Ana');
      expect(tecnico.apellido).toBe('Developer');
      expect(tecnico.email).toBe('fullstack.dev@integration.test');

      // Verificar perfil técnico
      expect(tecnico.ciudad).toBe('Madrid');
      expect(tecnico.experiencia_anos).toBe(8);
      expect(tecnico.nivel_experiencia).toBe('senior');
      expect(tecnico.tarifa_por_hora).toBe('70.00');

      // Verificar competencias
      expect(tecnico.competencias).toHaveLength(2);

      // Verificar documentos (vacío por ahora)
      expect(Array.isArray(tecnico.documentos)).toBe(true);
    });

    test('10. Admin cambia estado del técnico', async () => {
      // Cambiar a inactivo
      const responseInactivo = await request(app)
        .patch(`/api/tecnicos/${tecnicoId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ estado: 'suspendido' })
        .expect(200);

      expect(responseInactivo.body.success).toBe(true);
      expect(responseInactivo.body.data.tecnico.estado).toBe('suspendido');

      // Verificar que no aparece en listados activos
      const listaResponse = await request(app)
        .get('/api/tecnicos/available')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const tecnicosDisponibles = listaResponse.body.data.tecnicos;
      const tecnicoSuspendido = tecnicosDisponibles.find(t => t.id === tecnicoId);
      expect(tecnicoSuspendido).toBeUndefined();

      // Reactivar técnico
      await request(app)
        .patch(`/api/tecnicos/${tecnicoId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ estado: 'activo' })
        .expect(200);
    });

    test('11. Verificar estadísticas actualizadas', async () => {
      const response = await request(app)
        .get('/api/tecnicos/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.stats)).toBe(true);

      // Verificar que hay al menos una entrada para nuestro técnico
      const stats = response.body.data.stats;
      const seniorStats = stats.find(s => s.nivel_experiencia === 'senior');
      expect(seniorStats).toBeDefined();
      expect(seniorStats.total).toBeGreaterThan(0);
    });
  });

  describe('Flujo de Gestión de Competencias', () => {
    test('1. Verificar competencias más demandadas', async () => {
      const response = await request(app)
        .get('/api/competencias/most-demanded?limit=5')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.competencias)).toBe(true);
      expect(response.body.data.competencias.length).toBeLessThanOrEqual(5);
    });

    test('2. Obtener técnicos por competencia específica', async () => {
      const response = await request(app)
        .get(`/api/competencias/${competenciaNodeId}/tecnicos`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.tecnicos)).toBe(true);

      const tecnicosWithNode = response.body.data.tecnicos;
      const nuestroTecnico = tecnicosWithNode.find(t => t.tecnico_id === tecnicoId);
      expect(nuestroTecnico).toBeDefined();
      expect(nuestroTecnico.nivel_actual).toBe('experto');
      expect(nuestroTecnico.certificado).toBe(true);
    });

    test('3. Verificar estadísticas de competencias', async () => {
      const response = await request(app)
        .get('/api/competencias/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.stats)).toBe(true);

      const stats = response.body.data.stats;
      const backendStats = stats.find(s => s.categoria === 'Backend');
      const frontendStats = stats.find(s => s.categoria === 'Frontend');

      expect(backendStats).toBeDefined();
      expect(frontendStats).toBeDefined();
      expect(backendStats.tecnicos_asignados).toBeGreaterThan(0);
      expect(frontendStats.tecnicos_asignados).toBeGreaterThan(0);
    });
  });

  describe('Validaciones de Seguridad y Permisos', () => {
    test('Técnico no puede ver perfil de otro técnico', async () => {
      // Crear otro técnico
      const otroTecnico = {
        usuario: {
          email: 'otro.tecnico@test.com',
          nombre: 'Pedro',
          apellido: 'Test',
          password: 'test123'
        }
      };

      const createResponse = await request(app)
        .post('/api/tecnicos')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(otroTecnico)
        .expect(201);

      const otroTecnicoId = createResponse.body.data.tecnico.id;

      // Técnico original intenta ver perfil del otro
      await request(app)
        .get(`/api/tecnicos/${otroTecnicoId}`)
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .expect(403);

      // Limpiar
      await database.query('DELETE FROM vf_tecnicos_perfiles WHERE id = ?', [otroTecnicoId]);
      await database.query('DELETE FROM vf_usuarios WHERE email = ?', ['otro.tecnico@test.com']);
    });

    test('Técnico no puede cambiar su estado', async () => {
      await request(app)
        .patch(`/api/tecnicos/${tecnicoId}/status`)
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .send({ estado: 'inactivo' })
        .expect(403);
    });

    test('Técnico no puede crear otros técnicos', async () => {
      const nuevoTecnico = {
        usuario: {
          email: 'no.autorizado@test.com',
          nombre: 'No',
          apellido: 'Autorizado'
        }
      };

      await request(app)
        .post('/api/tecnicos')
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .send(nuevoTecnico)
        .expect(403);
    });

    test('Técnico no puede ver estadísticas', async () => {
      await request(app)
        .get('/api/tecnicos/stats')
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .expect(403);
    });
  });
});