// Script para verificar estructura de tabla vf_asignaciones
const mysql = require('mysql2/promise');

async function checkAsignacionesTable() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'bluesystem_user',
    password: 'secure_password_123',
    database: 'bluesystem'
  });

  console.log('🔍 Verificando estructura de vf_asignaciones...\n');

  try {
    // Verificar estructura de la tabla
    const [columns] = await connection.execute(`DESCRIBE vf_asignaciones`);
    console.log('📊 Estructura de vf_asignaciones:');
    columns.forEach(col => {
      console.log(`   ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
    });

    console.log('\n📝 Registros en vf_asignaciones:');
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM vf_asignaciones');
    console.log(`   Total registros: ${rows[0].count}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkAsignacionesTable().catch(console.error);