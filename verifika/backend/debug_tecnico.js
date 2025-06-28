// Debug test para Tecnico.findAll
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const database = require('./src/config/database');

async function debugTecnicoFindAll() {
  try {
    await database.initialize();
    console.log('✅ Base de datos conectada');
    
    // Test directo de la consulta problemática
    console.log('📝 Ejecutando consulta directa...');
    
    // Primero verificar si las tablas existen
    console.log('📝 Verificando tablas...');
    const tables = await database.query('SHOW TABLES LIKE "vf_%"');
    console.log('📄 Tablas Verifika:', tables);
    
    // Verificar estructura de tabla
    const technicosStructure = await database.query('DESCRIBE vf_tecnicos_perfiles');
    console.log('📄 Estructura vf_tecnicos_perfiles:', technicosStructure);
    
    const usuariosStructure = await database.query('DESCRIBE vf_usuarios');
    console.log('📄 Estructura vf_usuarios:', usuariosStructure);
    
    const query = `SELECT 1 as test`;
    const params = [];
    console.log('📄 Query:', query);
    console.log('📄 Params:', params);
    console.log('📄 Param types:', params.map(p => typeof p));
    
    const result = await database.query(query, params);
    console.log('📄 Result:', result);
    
    await database.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await database.close();
    process.exit(1);
  }
}

debugTecnicoFindAll();