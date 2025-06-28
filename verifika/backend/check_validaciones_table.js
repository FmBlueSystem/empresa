// Script para verificar estructura de tabla vf_validaciones
const mysql = require('mysql2/promise');

async function checkValidacionesTable() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'bluesystem_user',
    password: 'secure_password_123',
    database: 'bluesystem'
  });

  console.log('🔍 Verificando estructura de vf_validaciones...\n');

  try {
    // Verificar estructura de la tabla
    const [columns] = await connection.execute(`DESCRIBE vf_validaciones`);
    console.log('📊 Estructura de vf_validaciones:');
    columns.forEach(col => {
      console.log(`   ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
    });

    console.log('\n📝 Registros en vf_validaciones:');
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM vf_validaciones');
    console.log(`   Total registros: ${rows[0].count}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkValidacionesTable().catch(console.error);