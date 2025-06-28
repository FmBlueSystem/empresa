// clientes.test.js - Tests unitarios para módulo de clientes
jest.mock('../src/config/database');
jest.mock('../src/config/redis');

const request = require('supertest');
const app = require('../server');
const Cliente = require('../src/models/Cliente');
const Usuario = require('../src/models/Usuario');

describe('Módulo de Clientes - Tests Unitarios', () => {
  let adminToken;
  let adminUser;
  let tecnicoToken;
  let tecnicoUser;
  let clienteCreado;

  beforeAll(async () => {
    // Limpiar datos de test previos
    try {
      await Cliente.findAll().then(clientes => {
        return Promise.all(clientes.map(c => c.delete()));
      });
    } catch (error) {
      // Ignorar errores de limpieza
    }

    // Crear usuario admin para tests
    try {
      adminUser = await Usuario.create({
        email: 'admin.clientes@test.com',
        password: 'admin123',
        nombre: 'Admin',
        apellido: 'Clientes',
        rol: 'admin'
      });
    } catch (error) {
      adminUser = await Usuario.findByEmail('admin.clientes@test.com');
    }

    // Crear usuario técnico para tests
    try {
      tecnicoUser = await Usuario.create({
        email: 'tecnico.clientes@test.com',
        password: 'tecnico123',
        nombre: 'Técnico',
        apellido: 'Clientes',
        rol: 'tecnico'
      });
    } catch (error) {
      tecnicoUser = await Usuario.findByEmail('tecnico.clientes@test.com');
    }

    // Obtener tokens de autenticación
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin.clientes@test.com',
        password: 'admin123'
      });
    adminToken = adminRes.body.data.token;

    const tecnicoRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'tecnico.clientes@test.com',
        password: 'tecnico123'
      });
    tecnicoToken = tecnicoRes.body.data.token;
  });

  describe('POST /api/clientes - Crear cliente', () => {
    test('Admin puede crear cliente válido', async () => {
      const clienteData = {
        razon_social: 'Empresa Test S.A.',
        nombre_comercial: 'Empresa Test',
        tipo_cliente: 'empresa',
        identificacion: '3-101-123456',
        tipo_identificacion: 'cedula_juridica',
        email: 'contacto@empresatest.com',
        telefono: '+506 2222-3333',
        direccion: 'San José, Costa Rica, Calle Central',
        ciudad: 'San José',
        provincia: 'San José',
        pais: 'Costa Rica',
        sector_industria: 'tecnologia',
        tamaño_empresa: 'mediana',
        contacto_principal: 'Juan Pérez',
        cargo_contacto: 'Gerente General',
        email_contacto: 'juan.perez@empresatest.com',
        telefono_contacto: '+506 8888-9999'
      };

      const response = await request(app)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(clienteData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.cliente).toHaveProperty('id');
      expect(response.body.data.cliente.razon_social).toBe(clienteData.razon_social);
      expect(response.body.data.cliente.email).toBe(clienteData.email);
      expect(response.body.data.cliente.estado).toBe('activo');

      // Guardar cliente creado para tests posteriores
      clienteCreado = response.body.data.cliente;
    });

    test('Técnico no puede crear cliente', async () => {
      const clienteData = {
        razon_social: 'Cliente No Permitido',
        identificacion: '1-1111-1111',
        email: 'nopermitido@test.com',
        telefono: '+506 1111-1111',
        direccion: 'Dirección test',
        ciudad: 'San José',
        provincia: 'San José',
        contacto_principal: 'Test User'
      };

      await request(app)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .send(clienteData)
        .expect(403);
    });

    test('Fallan validaciones con datos inválidos', async () => {
      const clienteInvalido = {
        razon_social: 'A', // Muy corto
        identificacion: '123', // Muy corto
        email: 'email-invalido', // Email inválido
        telefono: '123', // Muy corto
        direccion: 'Dir', // Muy corto
        ciudad: 'A', // Muy corto
        provincia: 'A', // Muy corto
        contacto_principal: 'A' // Muy corto
      };

      const response = await request(app)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(clienteInvalido)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('validación');
    });

    test('No permite duplicados por email', async () => {
      const clienteDuplicado = {
        razon_social: 'Otra Empresa S.A.',
        identificacion: '3-102-654321',
        email: 'contacto@empresatest.com', // Email ya usado
        telefono: '+506 3333-4444',
        direccion: 'Otra dirección test',
        ciudad: 'Cartago',
        provincia: 'Cartago',
        contacto_principal: 'María González'
      };

      const response = await request(app)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(clienteDuplicado)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('ya existe');
    });
  });

  describe('GET /api/clientes - Listar clientes', () => {
    test('Usuario autenticado puede listar clientes', async () => {
      const response = await request(app)
        .get('/api/clientes')
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.clientes)).toBe(true);
      expect(response.body.data).toHaveProperty('pagination');
    });

    test('Filtros de búsqueda funcionan', async () => {
      const response = await request(app)
        .get('/api/clientes')
        .query({
          search: 'Empresa Test',
          tipo_cliente: 'empresa',
          estado: 'activo',
          limit: 10
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.clientes.length).toBeGreaterThan(0);
      expect(response.body.data.filtros.search).toBe('Empresa Test');
    });

    test('Paginación funciona correctamente', async () => {
      const response = await request(app)
        .get('/api/clientes')
        .query({
          page: 1,
          limit: 5,
          sort: 'razon_social',
          order: 'asc'
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(5);
    });

    test('Sin autenticación no puede acceder', async () => {
      await request(app)
        .get('/api/clientes')
        .expect(401);
    });
  });

  describe('GET /api/clientes/:id - Obtener cliente específico', () => {
    test('Admin puede ver cliente completo', async () => {
      const response = await request(app)
        .get(`/api/clientes/${clienteCreado.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.cliente.id).toBe(clienteCreado.id);
      expect(response.body.data.cliente).toHaveProperty('email');
      expect(response.body.data.cliente).toHaveProperty('telefono');
    });

    test('Técnico ve información limitada', async () => {
      const response = await request(app)
        .get(`/api/clientes/${clienteCreado.id}`)
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.cliente.id).toBe(clienteCreado.id);
      expect(response.body.data.cliente.razon_social).toBeDefined();
      // No debe tener información sensible como email completo
    });

    test('Cliente inexistente retorna 404', async () => {
      await request(app)
        .get('/api/clientes/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('PUT /api/clientes/:id - Actualizar cliente', () => {
    test('Admin puede actualizar cliente', async () => {
      const datosActualizacion = {
        razon_social: 'Empresa Test Actualizada S.A.',
        telefono: '+506 2222-4444',
        observaciones: 'Cliente actualizado en tests'
      };

      const response = await request(app)
        .put(`/api/clientes/${clienteCreado.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(datosActualizacion)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.cliente.razon_social).toBe(datosActualizacion.razon_social);
      expect(response.body.data.cliente.telefono).toBe(datosActualizacion.telefono);
      expect(response.body.data.cliente.observaciones).toBe(datosActualizacion.observaciones);
    });

    test('Técnico no puede actualizar cliente', async () => {
      await request(app)
        .put(`/api/clientes/${clienteCreado.id}`)
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .send({ razon_social: 'Intento no permitido' })
        .expect(403);
    });

    test('Validaciones en actualización', async () => {
      const datosInvalidos = {
        email: 'email-invalido',
        telefono: '123'
      };

      await request(app)
        .put(`/api/clientes/${clienteCreado.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(datosInvalidos)
        .expect(400);
    });
  });

  describe('PATCH /api/clientes/:id/status - Cambiar estado', () => {
    test('Admin puede cambiar estado', async () => {
      const response = await request(app)
        .patch(`/api/clientes/${clienteCreado.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ estado: 'suspendido' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.cliente.estado).toBe('suspendido');
    });

    test('Estado inválido es rechazado', async () => {
      await request(app)
        .patch(`/api/clientes/${clienteCreado.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ estado: 'estado_invalido' })
        .expect(400);
    });

    test('Técnico no puede cambiar estado', async () => {
      await request(app)
        .patch(`/api/clientes/${clienteCreado.id}/status`)
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .send({ estado: 'activo' })
        .expect(403);
    });
  });

  describe('GET /api/clientes/active - Clientes activos', () => {
    beforeAll(async () => {
      // Reactivar cliente para test
      await request(app)
        .patch(`/api/clientes/${clienteCreado.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ estado: 'activo' });
    });

    test('Retorna solo clientes activos', async () => {
      const response = await request(app)
        .get('/api/clientes/active')
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.clientes)).toBe(true);
      
      // Todos los clientes deben estar activos
      response.body.data.clientes.forEach(cliente => {
        expect(cliente.estado).toBe('activo');
      });
    });
  });

  describe('GET /api/clientes/stats - Estadísticas', () => {
    test('Admin puede ver estadísticas', async () => {
      const response = await request(app)
        .get('/api/clientes/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.stats).toHaveProperty('total_clientes');
      expect(response.body.data.stats).toHaveProperty('clientes_activos');
      expect(response.body.data.stats).toHaveProperty('empresas');
    });

    test('Técnico no puede ver estadísticas', async () => {
      await request(app)
        .get('/api/clientes/stats')
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .expect(403);
    });
  });

  describe('Gestión de proyectos del cliente', () => {
    test('Puede obtener proyectos del cliente', async () => {
      const response = await request(app)
        .get(`/api/clientes/${clienteCreado.id}/proyectos`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.proyectos)).toBe(true);
      expect(response.body.data.cliente_info.id).toBe(clienteCreado.id);
    });

    test('Admin puede crear proyecto para cliente', async () => {
      const proyectoData = {
        nombre: 'Proyecto Test',
        descripcion: 'Descripción del proyecto de prueba',
        fecha_inicio: '2025-07-01',
        fecha_fin_estimada: '2025-12-31',
        presupuesto_estimado: 50000,
        estado: 'planificacion',
        prioridad: 'media'
      };

      const response = await request(app)
        .post(`/api/clientes/${clienteCreado.id}/proyectos`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(proyectoData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.proyecto.nombre).toBe(proyectoData.nombre);
      expect(response.body.data.proyecto.cliente_id).toBe(clienteCreado.id);
    });
  });

  describe('Gestión de validadores', () => {
    test('Puede obtener validadores del cliente', async () => {
      const response = await request(app)
        .get(`/api/clientes/${clienteCreado.id}/validadores`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.validadores)).toBe(true);
    });

    test('Admin puede asignar validador', async () => {
      const response = await request(app)
        .post(`/api/clientes/${clienteCreado.id}/validadores`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ usuario_id: tecnicoUser.id })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.cliente_id).toBe(clienteCreado.id);
      expect(response.body.data.usuario_id).toBe(tecnicoUser.id);
    });
  });

  describe('Gestión de documentos', () => {
    test('Puede obtener documentos del cliente', async () => {
      const response = await request(app)
        .get(`/api/clientes/${clienteCreado.id}/documentos`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.documentos)).toBe(true);
    });

    test('Técnico no puede ver documentos privados', async () => {
      await request(app)
        .get(`/api/clientes/${clienteCreado.id}/documentos`)
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .expect(403);
    });
  });

  describe('Estadísticas del cliente', () => {
    test('Puede obtener estadísticas específicas', async () => {
      const response = await request(app)
        .get(`/api/clientes/${clienteCreado.id}/estadisticas`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.estadisticas).toHaveProperty('total_proyectos');
      expect(response.body.data.estadisticas).toHaveProperty('proyectos_activos');
      expect(response.body.data.cliente_info.id).toBe(clienteCreado.id);
    });
  });

  describe('Búsqueda avanzada', () => {
    test('Búsqueda avanzada funciona correctamente', async () => {
      const response = await request(app)
        .get('/api/clientes/search/advanced')
        .query({
          razon_social: 'Empresa Test',
          estado: 'activo',
          sector: 'tecnologia',
          tamaño: 'mediana'
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.clientes)).toBe(true);
      expect(response.body.data.criterios_busqueda).toHaveProperty('razon_social');
    });
  });

  describe('DELETE /api/clientes/:id - Eliminar cliente', () => {
    test('Admin puede eliminar cliente (soft delete)', async () => {
      const response = await request(app)
        .delete(`/api/clientes/${clienteCreado.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verificar que fue soft delete (estado = inactivo)
      const clienteEliminado = await Cliente.findById(clienteCreado.id);
      expect(clienteEliminado.estado).toBe('inactivo');
    });

    test('Técnico no puede eliminar cliente', async () => {
      await request(app)
        .delete(`/api/clientes/${clienteCreado.id}`)
        .set('Authorization', `Bearer ${tecnicoToken}`)
        .expect(403);
    });
  });

  afterAll(async () => {
    // Limpiar datos de test
    try {
      if (clienteCreado) {
        const cliente = await Cliente.findById(clienteCreado.id);
        if (cliente) await cliente.delete();
      }
      
      if (adminUser) await adminUser.delete();
      if (tecnicoUser) await tecnicoUser.delete();
    } catch (error) {
      console.warn('Error en limpieza de tests:', error.message);
    }
  });
});

// Tests específicos del modelo Cliente
describe('Modelo Cliente - Tests Unitarios', () => {
  let clienteTest;

  beforeAll(async () => {
    // Crear cliente para tests del modelo
    clienteTest = await Cliente.create({
      razon_social: 'Cliente Modelo Test',
      identificacion: '3-999-999999',
      email: 'modelo@test.com',
      telefono: '+506 9999-9999',
      direccion: 'Dirección modelo test',
      ciudad: 'Test City',
      provincia: 'Test Province',
      contacto_principal: 'Test Contact'
    });
  });

  test('findById retorna cliente correctamente', async () => {
    const cliente = await Cliente.findById(clienteTest.id);
    expect(cliente).toBeTruthy();
    expect(cliente.razon_social).toBe('Cliente Modelo Test');
  });

  test('findByEmail encuentra cliente por email', async () => {
    const cliente = await Cliente.findByEmail('modelo@test.com');
    expect(cliente).toBeTruthy();
    expect(cliente.id).toBe(clienteTest.id);
  });

  test('findByIdentificacion encuentra cliente', async () => {
    const cliente = await Cliente.findByIdentificacion('3-999-999999');
    expect(cliente).toBeTruthy();
    expect(cliente.id).toBe(clienteTest.id);
  });

  test('update actualiza campos correctamente', async () => {
    await clienteTest.update({
      telefono: '+506 8888-8888',
      observaciones: 'Actualizado en test'
    });

    expect(clienteTest.telefono).toBe('+506 8888-8888');
    expect(clienteTest.observaciones).toBe('Actualizado en test');
  });

  test('changeStatus cambia estado correctamente', async () => {
    await clienteTest.changeStatus('suspendido');
    expect(clienteTest.estado).toBe('suspendido');
  });

  test('toJSON retorna objeto correcto', async () => {
    const json = clienteTest.toJSON();
    expect(json).toHaveProperty('id');
    expect(json).toHaveProperty('razon_social');
    expect(json).toHaveProperty('email');
    expect(json).not.toHaveProperty('password');
  });

  afterAll(async () => {
    // Limpiar cliente de test
    if (clienteTest) {
      await clienteTest.delete();
    }
  });
});
