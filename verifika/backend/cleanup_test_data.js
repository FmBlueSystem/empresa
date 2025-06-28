// Limpiar datos de test existentes
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const database = require('./src/config/database');

async function cleanupTestData() {
  try {
    await database.initialize();
    console.log('🧹 Limpiando datos de test...');
    
    // Limpiar competencias de test
    await database.query("DELETE FROM vf_competencias_catalogo WHERE nombre = 'Testing FASE 2.2'");
    
    // Limpiar usuarios de test
    await database.query("DELETE FROM vf_usuarios WHERE email = 'test.fase22@verifika.com'");
    
    console.log('✅ Datos de test limpiados');
    await database.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error limpiando datos:', error);
    await database.close();
    process.exit(1);
  }
}

cleanupTestData();