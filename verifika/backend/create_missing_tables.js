// Script para crear tablas faltantes en Verifika
const mysql = require('mysql2/promise');

async function createMissingTables() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'bluesystem_user',
    password: 'secure_password_123',
    database: 'bluesystem'
  });

  console.log('🛠️ Creando tablas faltantes de Verifika...\n');

  try {
    // Crear tabla vf_competencias
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS vf_competencias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        descripcion TEXT,
        categoria VARCHAR(100) NOT NULL DEFAULT 'tecnica',
        nivel_requerido ENUM('basico', 'intermedio', 'avanzado', 'experto') DEFAULT 'basico',
        estado ENUM('activa', 'inactiva') DEFAULT 'activa',
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uk_competencia_nombre (nombre),
        INDEX idx_categoria (categoria),
        INDEX idx_estado (estado)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Tabla vf_competencias creada');

    // Crear tabla vf_tecnicos_competencias
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS vf_tecnicos_competencias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tecnico_id INT NOT NULL,
        competencia_id INT NOT NULL,
        nivel_obtenido ENUM('basico', 'intermedio', 'avanzado', 'experto') DEFAULT 'basico',
        fecha_obtencion DATE,
        certificado_url VARCHAR(255),
        comentarios TEXT,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uk_tecnico_competencia (tecnico_id, competencia_id),
        FOREIGN KEY (tecnico_id) REFERENCES vf_tecnicos_perfiles(id) ON DELETE CASCADE,
        FOREIGN KEY (competencia_id) REFERENCES vf_competencias(id) ON DELETE CASCADE,
        INDEX idx_tecnico_id (tecnico_id),
        INDEX idx_competencia_id (competencia_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Tabla vf_tecnicos_competencias creada');

    // Insertar competencias de ejemplo
    await connection.execute(`
      INSERT IGNORE INTO vf_competencias (nombre, descripcion, categoria, nivel_requerido) VALUES
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
    console.log('✅ Competencias de ejemplo insertadas');

    // Verificar las tablas creadas
    const [competencias] = await connection.execute('SELECT COUNT(*) as count FROM vf_competencias');
    console.log(`📊 Total competencias: ${competencias[0].count}`);

    console.log('\n🎉 Tablas creadas exitosamente!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
}

createMissingTables().catch(console.error);