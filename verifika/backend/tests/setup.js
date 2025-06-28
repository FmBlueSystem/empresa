// setup.js - Configuración global para tests de Jest
const database = require('../src/config/database');

// Configuración para Jest
beforeAll(async () => {
  // Inicializar base de datos para tests
  try {
    await database.initialize();
    console.log('✅ Base de datos inicializada para tests');
  } catch (error) {
    console.error('❌ Error inicializando base de datos para tests:', error);
    throw error;
  }
});

afterAll(async () => {
  // Cerrar conexiones después de todos los tests
  try {
    await database.close();
    console.log('✅ Conexiones de base de datos cerradas');
  } catch (error) {
    console.error('❌ Error cerrando conexiones:', error);
  }
});

// Configurar timeout global para tests
jest.setTimeout(30000);

module.exports = {};
