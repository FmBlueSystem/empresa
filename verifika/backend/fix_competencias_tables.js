// Script para sincronizar tablas de competencias
const mysql = require('mysql2/promise');

async function fixCompetenciasTables() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'bluesystem_user',
    password: 'secure_password_123',
    database: 'bluesystem'
  });

  console.log('🔧 Sincronizando tablas de competencias...\n');

  try {
    // Crear tabla vf_competencias_catalogo si no existe
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS vf_competencias_catalogo (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        descripcion TEXT,
        categoria VARCHAR(100) DEFAULT 'tecnica',
        nivel_requerido ENUM('basico', 'intermedio', 'avanzado', 'experto') DEFAULT 'basico',
        certificacion_requerida BOOLEAN DEFAULT FALSE,
        activo BOOLEAN DEFAULT TRUE,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uk_competencia_catalogo_nombre (nombre),
        INDEX idx_catalogo_categoria (categoria),
        INDEX idx_catalogo_activo (activo)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Tabla vf_competencias_catalogo creada/verificada');

    // Copiar datos de vf_competencias a vf_competencias_catalogo si existen
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM vf_competencias');
    const [catalogRows] = await connection.execute('SELECT COUNT(*) as count FROM vf_competencias_catalogo');
    
    if (rows[0].count > 0 && catalogRows[0].count === 0) {
      await connection.execute(`
        INSERT INTO vf_competencias_catalogo (nombre, descripcion, categoria, nivel_requerido, activo)
        SELECT nombre, descripcion, categoria, nivel_requerido, 
               CASE WHEN estado = 'activa' THEN TRUE ELSE FALSE END as activo
        FROM vf_competencias
      `);
      console.log('✅ Datos copiados de vf_competencias a vf_competencias_catalogo');
    }

    // Verificar datos
    const [finalCount] = await connection.execute('SELECT COUNT(*) as count FROM vf_competencias_catalogo');
    console.log(`📊 Total competencias en catálogo: ${finalCount[0].count}`);

    if (finalCount[0].count === 0) {
      // Insertar competencias de ejemplo en catálogo
      await connection.execute(`
        INSERT INTO vf_competencias_catalogo (nombre, descripcion, categoria, nivel_requerido) VALUES
        ('SAP ABAP', 'Programación en SAP ABAP', 'sap', 'intermedio'),
        ('SAP Fiori', 'Desarrollo de interfaces SAP Fiori', 'sap', 'avanzado'),
        ('JavaScript', 'Programación en JavaScript', 'desarrollo', 'basico'),
        ('React', 'Framework React para desarrollo frontend', 'desarrollo', 'intermedio'),
        ('Node.js', 'Desarrollo backend con Node.js', 'desarrollo', 'intermedio'),
        ('MySQL', 'Administración de bases de datos MySQL', 'base_datos', 'basico'),
        ('Docker', 'Containerización con Docker', 'infraestructura', 'intermedio'),
        ('Office 365', 'Administración de Office 365', 'office', 'basico'),
        ('SharePoint', 'Desarrollo y administración SharePoint', 'office', 'avanzado'),
        ('Power BI', 'Creación de reportes con Power BI', 'analytics', 'intermedio');
      `);
      console.log('✅ Competencias de ejemplo insertadas en catálogo');
    }

    console.log('\n🎉 Sincronización completada!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
}

fixCompetenciasTables().catch(console.error);