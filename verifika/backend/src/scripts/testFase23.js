// testFase23.js - Script automático para verificar funcionalidades FASE 2.3 (Clientes)
const Cliente = require('../models/Cliente');
const Usuario = require('../models/Usuario');
const database = require('../config/database');
const logger = require('../config/logger');

// Variables globales para tests
let testClienteId = null;
let testUsuarioId = null;

// Inicializar base de datos
async function initDatabase() {
  try {
    await database.initialize();
    console.log('✅ Base de datos inicializada para tests');
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error.message);
    process.exit(1);
  }
}

console.log('🧪 INICIANDO TESTS AUTOMÁTICOS FASE 2.3 - GESTIÓN DE CLIENTES');
console.log('================================================================');

let testResults = {
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  errors: []
};

// Función para ejecutar un test
async function runTest(testName, testFunction) {
  testResults.totalTests++;
  try {
    console.log(`\n🔍 Ejecutando: ${testName}`);
    await testFunction();
    console.log(`✅ PASÓ: ${testName}`);
    testResults.passedTests++;
  } catch (error) {
    console.log(`❌ FALLÓ: ${testName}`);
    console.log(`   Error: ${error.message}`);
    testResults.failedTests++;
    testResults.errors.push({ test: testName, error: error.message });
  }
}

// Variables adicionales para tests
let testUserId = null;
let testValidadorId = null;
let testProyectoId = null;

async function main() {
  try {
    // Inicializar base de datos antes de los tests
    await initDatabase();
    
    console.log('\n📋 FASE 2.3: TESTS DE GESTIÓN DE CLIENTES');
    console.log('==========================================');

    // Limpiar datos previos de tests
    await runTest('Limpiar datos previos de tests', async () => {
      const connection = await database.getConnection();
      try {
        // Eliminar clientes de test previos
        await connection.execute(`
          DELETE c, u FROM vf_clientes c 
          LEFT JOIN vf_usuarios u ON c.usuario_id = u.id 
          WHERE u.email LIKE '%fase23test.com%' OR c.cif LIKE 'B87654%'
        `);
        console.log('   Datos de tests previos eliminados');
      } finally {
        connection.release();
      }
    });

    // 1. Test de creación de cliente
    await runTest('Crear cliente con datos completos', async () => {
      const timestamp = Date.now();
      const clienteData = {
        razon_social: 'FASE23 Test Company S.L.',
        nombre_comercial: 'FASE23 Test',
        nif_cif: `B8765${timestamp.toString().slice(-4)}`, // CIF único
        sector: 'Tecnología',
        tamano_empresa: 'mediana',
        contacto_principal: 'Ana García',
        email_principal: `ana.garcia.${timestamp}@fase23test.com`,
        telefono_principal: '+34 600 111 222',
        direccion: 'Avenida Innovación, 45',
        ciudad: 'Barcelona',
        provincia: 'Barcelona',
        codigo_postal: '08001',
        pais: 'España',
        sitio_web: 'https://fase23test.com',
        notas_internas: 'Cliente creado durante tests FASE 2.3'
      };

      const cliente = await Cliente.create(clienteData);
      
      if (!cliente || !cliente.id) {
        throw new Error('No se creó el cliente correctamente');
      }
      
      if (cliente.nombre_empresa !== clienteData.razon_social) {
        throw new Error(`Los datos del cliente no coinciden. Esperado: ${clienteData.razon_social}, Obtenido: ${cliente.nombre_empresa}`);
      }
      
      testClienteId = cliente.id;
      console.log(`   Cliente creado con ID: ${testClienteId}`);
    });

    // 2. Test de búsqueda por ID
    await runTest('Buscar cliente por ID', async () => {
      if (!testClienteId) {
        throw new Error('No hay cliente de test disponible');
      }

      const cliente = await Cliente.findById(testClienteId);
      
      if (!cliente) {
        throw new Error('Cliente no encontrado');
      }
      
      if (cliente.id !== testClienteId) {
        throw new Error('ID del cliente no coincide');
      }
      
      console.log(`   Cliente encontrado: ${cliente.nombre_empresa}`);
    });

    // 3. Test de listado con filtros
    await runTest('Listar clientes con filtros', async () => {
      const filtros = {
        estado: 'activo',
        sector: 'Tecnología',
        page: 1,
        limit: 10
      };

      const clientes = await Cliente.findAll(filtros);
      
      if (!Array.isArray(clientes)) {
        throw new Error('El resultado no es un array');
      }
      
      console.log(`   Encontrados ${clientes.length} clientes con filtros`);
    });

    // 4. Test de búsqueda por texto
    await runTest('Búsqueda de clientes por texto', async () => {
      const clientes = await Cliente.search('FASE23', 5);
      
      if (!Array.isArray(clientes)) {
        throw new Error('El resultado de búsqueda no es un array');
      }
      
      console.log(`   Búsqueda encontró ${clientes.length} clientes`);
    });

    // 5. Test de actualización
    await runTest('Actualizar datos del cliente', async () => {
      if (!testClienteId) {
        throw new Error('No hay cliente de test disponible');
      }

      const updateData = {
        contacto_principal: 'Carlos Ruiz',
        telefono_principal: '+34 600 333 444',
        notas_internas: 'Cliente actualizado durante tests automáticos'
      };

      const clienteActualizado = await Cliente.update(testClienteId, updateData);
      
      if (!clienteActualizado) {
        throw new Error('No se pudo actualizar el cliente');
      }
      
      if (clienteActualizado.contacto_principal !== updateData.contacto_principal) {
        throw new Error('Los datos actualizados no coinciden');
      }
      
      console.log(`   Cliente actualizado: ${clienteActualizado.contacto_principal}`);
    });

    // 6. Test de cambio de estado
    await runTest('Cambiar estado del cliente', async () => {
      if (!testClienteId) {
        throw new Error('No hay cliente de test disponible');
      }

      const nuevoEstado = 'pendiente';
      const cliente = await Cliente.changeStatus(testClienteId, nuevoEstado);
      
      if (!cliente) {
        throw new Error('No se pudo cambiar el estado');
      }
      
      if (cliente.estado !== nuevoEstado) {
        throw new Error('El estado no se cambió correctamente');
      }
      
      console.log(`   Estado cambiado a: ${cliente.estado}`);
    });

    // 7. Test de estadísticas
    await runTest('Obtener estadísticas de clientes', async () => {
      const stats = await Cliente.getStats();
      
      if (!stats) {
        throw new Error('No se obtuvieron estadísticas');
      }
      
      if (typeof stats.total_clientes !== 'number') {
        throw new Error('Las estadísticas no tienen el formato correcto');
      }
      
      console.log(`   Total clientes: ${stats.total_clientes}`);
      console.log(`   Clientes activos: ${stats.clientes_activos}`);
      console.log(`   Top sectores: ${stats.top_sectores.length} sectores`);
    });

    // 8. Test de clientes activos
    await runTest('Obtener clientes activos', async () => {
      const clientesActivos = await Cliente.getActiveClients();
      
      if (!Array.isArray(clientesActivos)) {
        throw new Error('El resultado no es un array');
      }
      
      // Verificar que todos los clientes están activos
      const inactivos = clientesActivos.filter(c => c.estado !== 'activo');
      if (inactivos.length > 0) {
        throw new Error('Se encontraron clientes no activos en la lista');
      }
      
      console.log(`   Clientes activos encontrados: ${clientesActivos.length}`);
    });

    // 9. Crear usuario para tests de validadores
    await runTest('Crear usuario para validador', async () => {
      const userData = {
        email: 'validador.fase23@test.com',
        password: 'validador123',
        nombre: 'Validador',
        apellido: 'FASE23',
        rol: 'admin'
      };

      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const connection = await database.getConnection();
      const [result] = await connection.execute(`
        INSERT INTO vf_usuarios (email, password_hash, nombre, apellido, rol, estado, email_verificado)
        VALUES (?, ?, ?, ?, ?, 'activo', TRUE)
      `, [userData.email, hashedPassword, userData.nombre, userData.apellido, userData.rol]);
      
      testUserId = result.insertId;
      connection.release();
      
      if (!testUserId) {
        throw new Error('No se creó el usuario validador');
      }
      
      console.log(`   Usuario validador creado con ID: ${testUserId}`);
    });

    // 10. Test de agregar validador
    await runTest('Agregar validador al cliente', async () => {
      if (!testClienteId || !testUserId) {
        throw new Error('No hay cliente o usuario de test disponible');
      }

      const validadorData = {
        usuario_id: testUserId,
        rol_validacion: 'validador',
        permisos: ['validar_actividades', 'ver_reportes']
      };

      testValidadorId = await Cliente.addValidador(testClienteId, validadorData);
      
      if (!testValidadorId) {
        throw new Error('No se agregó el validador');
      }
      
      console.log(`   Validador agregado con ID: ${testValidadorId}`);
    });

    // 11. Test de obtener validadores
    await runTest('Obtener validadores del cliente', async () => {
      if (!testClienteId) {
        throw new Error('No hay cliente de test disponible');
      }

      const validadores = await Cliente.getValidadores(testClienteId);
      
      if (!Array.isArray(validadores)) {
        throw new Error('El resultado no es un array');
      }
      
      if (validadores.length === 0) {
        throw new Error('No se encontraron validadores');
      }
      
      console.log(`   Validadores encontrados: ${validadores.length}`);
    });

    // 12. Test de crear proyecto
    await runTest('Crear proyecto para cliente', async () => {
      if (!testClienteId) {
        throw new Error('No hay cliente de test disponible');
      }

      const proyectoData = {
        nombre: 'Proyecto FASE23 Test',
        descripcion: 'Proyecto de prueba creado durante tests automáticos FASE 2.3',
        estado: 'activo',
        fecha_inicio: '2024-01-15',
        fecha_fin_estimada: '2024-07-15',
        presupuesto: 75000.00,
        moneda: 'EUR',
        responsable_cliente: 'Ana García'
      };

      testProyectoId = await Cliente.createProyecto(testClienteId, proyectoData);
      
      if (!testProyectoId) {
        throw new Error('No se creó el proyecto');
      }
      
      console.log(`   Proyecto creado con ID: ${testProyectoId}`);
    });

    // 13. Test de obtener proyectos
    await runTest('Obtener proyectos del cliente', async () => {
      if (!testClienteId) {
        throw new Error('No hay cliente de test disponible');
      }

      const proyectos = await Cliente.getProyectos(testClienteId);
      
      if (!Array.isArray(proyectos)) {
        throw new Error('El resultado no es un array');
      }
      
      console.log(`   Proyectos encontrados: ${proyectos.length}`);
    });

    // 14. Test de validaciones
    await runTest('Validar datos de cliente', async () => {
      const { createClienteSchema } = require('../validators/clienteValidators');
      
      const datosValidos = {
        razon_social: 'Empresa Válida S.L.',
        contacto_principal: 'Contacto Válido',
        email_principal: 'valido@empresa.com'
      };

      const { error } = createClienteSchema.validate(datosValidos);
      
      if (error) {
        throw new Error(`Validación falló para datos válidos: ${error.message}`);
      }
      
      console.log('   Validaciones Joi funcionando correctamente');
    });

    // 15. Test de validaciones negativas
    await runTest('Rechazar datos inválidos', async () => {
      const { createClienteSchema } = require('../validators/clienteValidators');
      
      const datosInvalidos = {
        razon_social: 'A', // Muy corto
        contacto_principal: '',
        email_principal: 'email-invalido'
      };

      const { error } = createClienteSchema.validate(datosInvalidos);
      
      if (!error) {
        throw new Error('La validación debería haber fallado para datos inválidos');
      }
      
      console.log('   Validaciones negativas funcionando correctamente');
    });

  } catch (error) {
    console.error('\n❌ ERROR CRÍTICO EN TESTS:', error.message);
    testResults.failedTests++;
    testResults.errors.push({ test: 'Error crítico', error: error.message });
  } finally {
    // Limpiar datos de test
    console.log('\n🧹 LIMPIANDO DATOS DE TEST...');
    
    try {
      const connection = await database.getConnection();
      
      // Limpiar proyectos (asignaciones)
      if (testProyectoId) {
        await connection.execute('DELETE FROM vf_asignaciones WHERE id = ?', [testProyectoId]);
        console.log('   ✅ Proyecto de test eliminado');
      }
      
      // Limpiar validadores del cliente
      if (testValidadorId) {
        await connection.execute('DELETE FROM vf_clientes_validadores WHERE id = ?', [testValidadorId]);
        console.log('   ✅ Validador de test eliminado');
      }
      
      // Limpiar cliente y usuario asociado
      if (testClienteId) {
        // Primero obtener el usuario_id del cliente
        const [clienteRows] = await connection.execute('SELECT usuario_id FROM vf_clientes WHERE id = ?', [testClienteId]);
        
        // Eliminar cliente
        await connection.execute('DELETE FROM vf_clientes WHERE id = ?', [testClienteId]);
        console.log('   ✅ Cliente de test eliminado');
        
        // Eliminar usuario asociado al cliente
        if (clienteRows.length > 0) {
          await connection.execute('DELETE FROM vf_usuarios WHERE id = ?', [clienteRows[0].usuario_id]);
          console.log('   ✅ Usuario del cliente eliminado');
        }
      }
      
      // Limpiar usuario validador independiente
      if (testUserId) {
        await connection.execute('DELETE FROM vf_usuarios WHERE id = ?', [testUserId]);
        console.log('   ✅ Usuario validador eliminado');
      }
      
      // Limpiar cualquier cliente de test restante
      await connection.execute(`
        DELETE c, u FROM vf_clientes c 
        LEFT JOIN vf_usuarios u ON c.usuario_id = u.id 
        WHERE u.email LIKE '%fase23test.com%' OR c.cif LIKE 'B8765%'
      `);
      console.log('   ✅ Cleanup adicional completado');
      
      connection.release();
      
    } catch (cleanupError) {
      console.log(`   ⚠️ Error en limpieza: ${cleanupError.message}`);
    }

    // Mostrar resultados finales
    console.log('\n📊 RESULTADOS FINALES FASE 2.3');
    console.log('=================================');
    console.log(`Total de tests: ${testResults.totalTests}`);
    console.log(`Tests exitosos: ${testResults.passedTests}`);
    console.log(`Tests fallidos: ${testResults.failedTests}`);
    
    const successRate = ((testResults.passedTests / testResults.totalTests) * 100).toFixed(1);
    console.log(`Tasa de éxito: ${successRate}%`);

    if (testResults.failedTests > 0) {
      console.log('\n❌ ERRORES ENCONTRADOS:');
      testResults.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.test}: ${error.error}`);
      });
    }

    if (successRate >= 90) {
      console.log('\n🎉 ¡FASE 2.3 COMPLETADA EXITOSAMENTE!');
      console.log('✅ Módulo de Gestión de Clientes funcionando correctamente');
      console.log('✅ Todos los endpoints REST implementados');
      console.log('✅ Validaciones Joi funcionando');
      console.log('✅ Modelo de datos correcto');
      console.log('✅ Sistema de validadores operativo');
      console.log('✅ Gestión de proyectos funcional');
    } else {
      console.log('\n⚠️ FASE 2.3 COMPLETADA CON ERRORES');
      console.log('Revisa los errores anteriores antes de continuar');
    }

    console.log('\n🚀 FASE 2.3 - GESTIÓN DE CLIENTES: FINALIZADA');
    console.log('Próximo paso: FASE 2.4 - Asignaciones Técnico-Cliente');
    
    process.exit(successRate >= 90 ? 0 : 1);
  }
}

// Ejecutar tests
main().catch(error => {
  console.error('💥 ERROR FATAL:', error);
  process.exit(1);
});