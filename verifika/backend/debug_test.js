// Debug test manual
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const database = require('./src/config/database');
const Competencia = require('./src/models/Competencia');

async function debugTest() {
  try {
    await database.initialize();
    console.log('✅ Base de datos conectada');
    
    // Test básico de inserción
    console.log('📝 Creando competencia...');
    const result = await database.query(`
      INSERT INTO vf_competencias_catalogo (
        nombre, descripcion, categoria, nivel_requerido, certificacion_requerida, activo
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [
      'Debug Test', 'Test description', 'Debug', 'basico', false, true
    ]);
    
    console.log('📄 Result estructura:', result);
    const insertId = Array.isArray(result) ? result[0].insertId : result.insertId;
    console.log('🆔 Insert ID:', insertId);
    
    // Test de selección
    const selectResult = await database.query('SELECT * FROM vf_competencias_catalogo WHERE id = ?', [insertId]);
    console.log('📄 Select result estructura:', selectResult);
    const rows = Array.isArray(selectResult) ? selectResult[0] : selectResult;
    console.log('📄 Rows:', rows);
    
    // Test con modelo
    const competencia = await Competencia.findById(insertId);
    console.log('📦 Competencia objeto:', competencia);
    
    // Limpiar
    await database.query('DELETE FROM vf_competencias_catalogo WHERE id = ?', [insertId]);
    
    await database.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await database.close();
    process.exit(1);
  }
}

debugTest();