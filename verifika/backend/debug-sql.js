// Script para debuggear SQL directamente
const database = require('./src/config/database');
require('dotenv').config();

async function debugSQL() {
  try {
    await database.initialize();
    
    // Query directa
    const query = 'SELECT * FROM vf_usuarios WHERE email = ? AND estado != "eliminado"';
    console.log('Ejecutando query:', query);
    console.log('Con parámetros:', ['admin@bluesystem.io']);
    
    const [rows] = await database.query(query, ['admin@bluesystem.io']);
    console.log('Rows encontradas:', rows.length);
    console.log('Primera row:', rows[0]);
    
    // También probar sin filtro de estado
    const query2 = 'SELECT * FROM vf_usuarios WHERE email = ?';
    const [rows2] = await database.query(query2, ['admin@bluesystem.io']);
    console.log('Rows sin filtro estado:', rows2.length);
    console.log('Primera row sin filtro:', rows2[0]);
    
    await database.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

debugSQL();