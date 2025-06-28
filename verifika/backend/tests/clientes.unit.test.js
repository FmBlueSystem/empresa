// clientes.unit.test.js - Tests unitarios para el modelo Cliente
jest.mock('../src/config/database');

const Cliente = require('../src/models/Cliente');
const database = require('../src/config/database');
const bcrypt = require('bcryptjs');

describe('Modelo Cliente - Tests Unitarios', () => {
  let testClienteId;
  let testUserId;

  beforeAll(async () => {
    // Asegurar que la base de datos esté inicializada
    await database.initialize();
  });

  afterEach(async () => {
    // Limpiar datos de test después de cada test
    const connection = await database.getConnection();
    try {
      if (testClienteId) {
        await connection.execute('DELETE FROM vf_clientes WHERE id = ?', [testClienteId]);
        testClienteId = null;
      }
      if (testUserId) {
        await connection.execute('DELETE FROM vf_usuarios WHERE id = ?', [testUserId]);
        testUserId = null;
      }
    } finally {
      connection.release();
    }
  });

  describe('Cliente.create()', () => {
    test('debería crear un cliente correctamente', async () => {
      const clienteData = {
        razon_social: 'Unit Test Company S.L.',
        email_principal: `unit.${Date.now()}@test.com`,
        contacto_principal: 'Unit Test Contact',
        sector: 'Tecnología',
        ciudad: 'Madrid',
        numero_empleados: 25
      };

      const cliente = await Cliente.create(clienteData);
      testClienteId = cliente.id;
      testUserId = cliente.usuario_id;

      expect(cliente).toBeDefined();
      expect(cliente.id).toBeDefined();
      expect(cliente.nombre_empresa).toBe(clienteData.razon_social);
      expect(cliente.email).toBe(clienteData.email_principal);
    });

    test('debería manejar datos opcionales nulos', async () => {
      const clienteData = {
        razon_social: 'Minimal Test Company',
        email_principal: `minimal.${Date.now()}@test.com`,
        contacto_principal: 'Minimal Contact'
      };

      const cliente = await Cliente.create(clienteData);
      testClienteId = cliente.id;
      testUserId = cliente.usuario_id;

      expect(cliente).toBeDefined();
      expect(cliente.id).toBeDefined();
      expect(cliente.nombre_empresa).toBe(clienteData.razon_social);
    });
  });

  describe('Cliente.findById()', () => {
    test('debería encontrar cliente por ID', async () => {
      // Crear cliente primero
      const clienteData = {
        razon_social: 'FindById Test Company',
        email_principal: `findbyid.${Date.now()}@test.com`,
        contacto_principal: 'FindById Contact'
      };

      const clienteCreado = await Cliente.create(clienteData);
      testClienteId = clienteCreado.id;
      testUserId = clienteCreado.usuario_id;

      // Buscar cliente
      const clienteEncontrado = await Cliente.findById(testClienteId);

      expect(clienteEncontrado).toBeDefined();
      expect(clienteEncontrado.id).toBe(testClienteId);
      expect(clienteEncontrado.nombre_empresa).toBe(clienteData.razon_social);
    });

    test('debería retornar null para ID inexistente', async () => {
      const cliente = await Cliente.findById(99999);
      expect(cliente).toBeNull();
    });

    test('debería incluir conteos de relaciones', async () => {
      // Crear cliente
      const clienteData = {
        razon_social: 'Relations Test Company',
        email_principal: `relations.${Date.now()}@test.com`,
        contacto_principal: 'Relations Contact'
      };

      const clienteCreado = await Cliente.create(clienteData);
      testClienteId = clienteCreado.id;
      testUserId = clienteCreado.usuario_id;

      // Buscar cliente con relaciones
      const cliente = await Cliente.findById(testClienteId);

      expect(cliente.total_asignaciones).toBeDefined();
      expect(cliente.total_validadores).toBeDefined();
      expect(cliente.total_actividades).toBeDefined();
      expect(typeof cliente.total_asignaciones).toBe('number');
    });
  });

  describe('Cliente.findAll()', () => {
    test('debería listar clientes sin filtros', async () => {
      const clientes = await Cliente.findAll({ limit: 10 });
      
      expect(Array.isArray(clientes)).toBe(true);
      expect(clientes.length).toBeLessThanOrEqual(10);
    });

    test('debería aplicar filtros correctamente', async () => {
      // Crear cliente con sector específico
      const clienteData = {
        razon_social: 'Filter Test Company',
        email_principal: `filter.${Date.now()}@test.com`,
        contacto_principal: 'Filter Contact',
        sector: 'Educación'
      };

      const clienteCreado = await Cliente.create(clienteData);
      testClienteId = clienteCreado.id;
      testUserId = clienteCreado.usuario_id;

      // Buscar con filtro de sector
      const clientes = await Cliente.findAll({ 
        sector: 'Educación',
        limit: 10 
      });
      
      expect(Array.isArray(clientes)).toBe(true);
      // Verificar que los clientes filtrados tienen el sector correcto
      clientes.forEach(cliente => {
        if (cliente.sector_actividad) {
          expect(cliente.sector_actividad).toBe('Educación');
        }
      });
    });

    test('debería aplicar paginación', async () => {
      const page1 = await Cliente.findAll({ page: 1, limit: 5 });
      const page2 = await Cliente.findAll({ page: 2, limit: 5 });
      
      expect(Array.isArray(page1)).toBe(true);
      expect(Array.isArray(page2)).toBe(true);
      expect(page1.length).toBeLessThanOrEqual(5);
      expect(page2.length).toBeLessThanOrEqual(5);
    });
  });

  describe('Cliente.update()', () => {
    test('debería actualizar campos del cliente', async () => {
      // Crear cliente
      const clienteData = {
        razon_social: 'Update Test Company',
        email_principal: `update.${Date.now()}@test.com`,
        contacto_principal: 'Update Contact'
      };

      const clienteCreado = await Cliente.create(clienteData);
      testClienteId = clienteCreado.id;
      testUserId = clienteCreado.usuario_id;

      // Actualizar cliente
      const updateData = {
        telefono_corporativo: '+34 600 123 456',
        ciudad: 'Valencia',
        numero_empleados: 100
      };

      const clienteActualizado = await Cliente.update(testClienteId, updateData);

      expect(clienteActualizado).toBeDefined();
      expect(clienteActualizado.telefono_corporativo).toBe(updateData.telefono_corporativo);
      expect(clienteActualizado.ciudad).toBe(updateData.ciudad);
      expect(clienteActualizado.numero_empleados).toBe(updateData.numero_empleados);
    });

    test('debería fallar con campos vacíos', async () => {
      await expect(Cliente.update(1, {})).rejects.toThrow('No hay campos para actualizar');
    });
  });

  describe('Cliente.search()', () => {
    test('debería buscar clientes por término', async () => {
      // Crear cliente con nombre específico
      const clienteData = {
        razon_social: 'SearchableCompany S.L.',
        email_principal: `searchable.${Date.now()}@test.com`,
        contacto_principal: 'Searchable Contact'
      };

      const clienteCreado = await Cliente.create(clienteData);
      testClienteId = clienteCreado.id;
      testUserId = clienteCreado.usuario_id;

      // Buscar cliente
      const resultados = await Cliente.search('SearchableCompany', 10);
      
      expect(Array.isArray(resultados)).toBe(true);
      expect(resultados.length).toBeGreaterThan(0);
      
      const encontrado = resultados.find(c => c.id === testClienteId);
      expect(encontrado).toBeDefined();
    });

    test('debería limitar resultados correctamente', async () => {
      const resultados = await Cliente.search('Company', 3);
      
      expect(Array.isArray(resultados)).toBe(true);
      expect(resultados.length).toBeLessThanOrEqual(3);
    });
  });

  describe('Cliente.getStats()', () => {
    test('debería obtener estadísticas correctas', async () => {
      const stats = await Cliente.getStats();

      expect(stats).toBeDefined();
      expect(typeof stats.total_clientes).toBe('number');
      expect(typeof stats.clientes_activos).toBe('number');
      expect(Array.isArray(stats.top_sectores)).toBe(true);
      expect(Array.isArray(stats.top_ciudades)).toBe(true);
      
      // Verificar estructura de top sectores
      if (stats.top_sectores.length > 0) {
        expect(stats.top_sectores[0]).toHaveProperty('sector');
        expect(stats.top_sectores[0]).toHaveProperty('cantidad');
      }
    });
  });

  describe('Cliente.getActiveClients()', () => {
    test('debería obtener solo clientes activos', async () => {
      const clientesActivos = await Cliente.getActiveClients();
      
      expect(Array.isArray(clientesActivos)).toBe(true);
      
      // Verificar que todos tienen la estructura correcta
      clientesActivos.forEach(cliente => {
        expect(cliente).toHaveProperty('id');
        expect(cliente).toHaveProperty('nombre_empresa');
      });
    });
  });

  describe('Cliente.addValidador()', () => {
    test('debería agregar validador a cliente', async () => {
      // Crear cliente y usuario validador
      const clienteData = {
        razon_social: 'Validador Test Company',
        email_principal: `validador.${Date.now()}@test.com`,
        contacto_principal: 'Validador Contact'
      };

      const clienteCreado = await Cliente.create(clienteData);
      testClienteId = clienteCreado.id;

      // Crear usuario para validador
      const hashedPassword = await bcrypt.hash('validador123', 10);
      const connection = await database.getConnection();
      
      try {
        const [userResult] = await connection.execute(`
          INSERT INTO vf_usuarios (email, password_hash, nombre, apellido, rol, estado, email_verificado)
          VALUES (?, ?, ?, ?, 'admin', 'activo', TRUE)
        `, [`validador.${Date.now()}@test.com`, hashedPassword, 'Validador', 'Test']);
        
        testUserId = userResult.insertId;

        // Agregar validador
        const validadorData = {
          usuario_id: testUserId,
          rol_validacion: 'validador',
          puede_aprobar: true,
          puede_rechazar: true
        };

        const validadorId = await Cliente.addValidador(testClienteId, validadorData);

        expect(validadorId).toBeDefined();
        expect(typeof validadorId).toBe('number');

        // Limpiar validador
        await connection.execute('DELETE FROM vf_clientes_validadores WHERE id = ?', [validadorId]);
      } finally {
        connection.release();
      }
    });
  });

  describe('Cliente.getValidadores()', () => {
    test('debería obtener validadores del cliente', async () => {
      // Crear cliente
      const clienteData = {
        razon_social: 'Get Validadores Test Company',
        email_principal: `getvalidadores.${Date.now()}@test.com`,
        contacto_principal: 'Get Validadores Contact'
      };

      const clienteCreado = await Cliente.create(clienteData);
      testClienteId = clienteCreado.id;
      testUserId = clienteCreado.usuario_id;

      // Obtener validadores (debería estar vacío inicialmente)
      const validadores = await Cliente.getValidadores(testClienteId);
      
      expect(Array.isArray(validadores)).toBe(true);
      // Para un cliente nuevo, no debería tener validadores
      expect(validadores.length).toBe(0);
    });
  });

  describe('Cliente.getProyectos()', () => {
    test('debería obtener proyectos del cliente', async () => {
      // Crear cliente
      const clienteData = {
        razon_social: 'Get Proyectos Test Company',
        email_principal: `getproyectos.${Date.now()}@test.com`,
        contacto_principal: 'Get Proyectos Contact'
      };

      const clienteCreado = await Cliente.create(clienteData);
      testClienteId = clienteCreado.id;
      testUserId = clienteCreado.usuario_id;

      // Obtener proyectos (debería estar vacío inicialmente)
      const proyectos = await Cliente.getProyectos(testClienteId);
      
      expect(Array.isArray(proyectos)).toBe(true);
      // Para un cliente nuevo, no debería tener proyectos
      expect(proyectos.length).toBe(0);
    });
  });
});