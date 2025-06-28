// Test directo del modelo Competencia
const database = require('./src/config/database');
const logger = require('./src/config/logger');

async function testCompetencias() {
  try {
    console.log('🔍 Testing Competencia model directly...');
    
    // Initialize database
    await database.initialize();
    console.log('✅ Database connected');

    // Test direct query
    const [rows] = await database.query('SELECT * FROM vf_competencias_catalogo LIMIT 3');
    console.log('✅ Direct query works:', rows.length, 'rows');

    // Try to import the model
    console.log('📦 Importing Competencia model...');
    const Competencia = require('./src/models/Competencia');
    console.log('✅ Model imported successfully');

    // Test findAll method
    console.log('🔎 Testing findAll method...');
    const result = await Competencia.findAll();
    console.log('✅ findAll works:', result.competencias.length, 'competencias found');

    console.log('\n🎉 All tests passed! The model works correctly.');
    
  } catch (error) {
    console.error('❌ Error testing model:', error);
    console.error('Stack:', error.stack);
  } finally {
    await database.close();
    process.exit(0);
  }
}

testCompetencias();