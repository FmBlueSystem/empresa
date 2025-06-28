// Script para verificar el estado de las tablas de Verifika
const mysql = require('mysql2/promise');

async function checkTables() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'bluesystem_user',
    password: 'secure_password_123',
    database: 'bluesystem'
  });

  console.log('🔍 Verificando tablas de Verifika...\n');

  try {
    // Verificar si las tablas existen
    const tables = [
      'vf_usuarios',
      'vf_tecnicos_perfiles', 
      'vf_competencias',
      'vf_clientes',
      'vf_asignaciones',
      'vf_actividades',
      'vf_validaciones'
    ];

    for (const table of tables) {
      try {
        const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`✅ ${table}: ${rows[0].count} registros`);
      } catch (error) {
        console.log(`❌ ${table}: ${error.message}`);
      }
    }

    console.log('\n📊 Verificando estructura de vf_tecnicos_perfiles:');
    try {
      const [columns] = await connection.execute(`DESCRIBE vf_tecnicos_perfiles`);
      columns.forEach(col => {
        console.log(`   ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
      });
    } catch (error) {
      console.log(`❌ Error verificando estructura: ${error.message}`);
    }

    console.log('\n👥 Usuarios existentes:');
    try {
      const [users] = await connection.execute(`
        SELECT id, email, nombre, apellido, rol, estado 
        FROM vf_usuarios 
        ORDER BY id
      `);
      users.forEach(user => {
        console.log(`   ${user.id}: ${user.email} (${user.rol}) - ${user.estado}`);
      });
    } catch (error) {
      console.log(`❌ Error verificando usuarios: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await connection.end();
  }
}

checkTables().catch(console.error);