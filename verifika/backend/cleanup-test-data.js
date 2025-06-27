// cleanup-test-data.js - Limpiar datos de prueba duplicados
const database = require('./src/config/database');
const logger = require('./src/config/logger');

async function cleanupTestData() {
  let connection;
  
  try {
    await database.initialize();
    connection = await database.getConnection();
    
    console.log('🧹 Iniciando limpieza de datos de prueba...');
    
    // Eliminar usuarios de prueba
    const [result1] = await connection.execute(`
      DELETE FROM vf_usuarios 
      WHERE email LIKE '%@test.com' 
      OR email LIKE 'test%@%'
      OR email LIKE '%test%@verifika.com'
    `);
    
    console.log(`✅ Eliminados ${result1.affectedRows} usuarios de prueba`);
    
    // Eliminar clientes de prueba
    const [result2] = await connection.execute(`
      DELETE FROM vf_clientes 
      WHERE nombre_empresa LIKE '%Test%' 
      OR nombre_empresa LIKE '%TEST%'
      OR nombre_empresa LIKE 'FASE%'
    `);
    
    console.log(`✅ Eliminados ${result2.affectedRows} clientes de prueba`);
    
    // Eliminar proyectos de prueba (si la tabla existe)
    try {
      const [result3] = await connection.execute(`
        DELETE FROM vf_proyectos 
        WHERE nombre LIKE '%Test%' 
        OR nombre LIKE '%FASE%'
      `);
      console.log(`✅ Eliminados ${result3.affectedRows} proyectos de prueba`);
    } catch (error) {
      if (error.code === 'ER_NO_SUCH_TABLE') {
        console.log('⚠️ Tabla vf_proyectos no existe, omitiendo limpieza');
      } else {
        throw error;
      }
    }
    
    // Eliminar validadores de prueba (si la tabla existe)
    try {
      const [result4] = await connection.execute(`
        DELETE FROM vf_validadores 
        WHERE id > 0
      `);
      console.log(`✅ Eliminados ${result4.affectedRows} validadores de prueba`);
    } catch (error) {
      if (error.code === 'ER_NO_SUCH_TABLE') {
        console.log('⚠️ Tabla vf_validadores no existe, omitiendo limpieza');
      } else {
        throw error;
      }
    }
    
    console.log('🎉 Limpieza completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
    throw error;
  } finally {
    if (connection) connection.release();
    await database.close();
  }
}

// Ejecutar limpieza
cleanupTestData()
  .then(() => {
    console.log('✅ Proceso de limpieza finalizado');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });