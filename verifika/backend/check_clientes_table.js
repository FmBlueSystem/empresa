// Script para verificar estructura de tabla vf_clientes
const mysql = require('mysql2/promise');

async function checkClientesTable() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'bluesystem_user',
    password: 'secure_password_123',
    database: 'bluesystem'
  });

  console.log('🔍 Verificando estructura de vf_clientes...\n');

  try {
    // Verificar estructura de la tabla
    const [columns] = await connection.execute(`DESCRIBE vf_clientes`);
    console.log('📊 Estructura de vf_clientes:');
    columns.forEach(col => {
      console.log(`   ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
    });

    console.log('\n📝 Registros en vf_clientes:');
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM vf_clientes');
    console.log(`   Total registros: ${rows[0].count}`);

    if (rows[0].count > 0) {
      const [samples] = await connection.execute('SELECT * FROM vf_clientes LIMIT 3');
      console.log('\n   Datos de ejemplo:');
      samples.forEach((row, i) => {
        console.log(`     ${i+1}. ID: ${row.id}, Razón Social: ${row.razon_social || 'N/A'}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkClientesTable().catch(console.error);