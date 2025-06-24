// runMigration.js - Script para ejecutar migración de esquemas
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

console.log('DB Config:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? '***' : 'NOT_SET'
});

const database = require('../config/database');
const logger = require('../config/logger');

async function runMigration() {
  try {
    logger.info('🔄 Iniciando migración de esquemas...');

    // Inicializar base de datos
    await database.initialize();

    // Leer archivo de esquema
    const schemaPath = path.join(__dirname, '../../../database/schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    // Dividir en declaraciones individuales
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    logger.info(`📝 Ejecutando ${statements.length} declaraciones SQL...`);

    // Ejecutar cada declaración
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await database.query(statement);
          logger.info(`✅ Declaración ${i + 1}/${statements.length} ejecutada`);
        } catch (error) {
          if (!error.message.includes('already exists')) {
            logger.error(`❌ Error en declaración ${i + 1}:`, error.message);
          } else {
            logger.info(`⏭️ Declaración ${i + 1} omitida (ya existe)`);
          }
        }
      }
    }

    logger.info('✅ Migración completada exitosamente');

    // Verificar tablas creadas
    const tables = await database.query("SHOW TABLES LIKE 'vf_%'");
    logger.info(`📊 Tablas de Verifika encontradas: ${tables.length}`);
    
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      logger.info(`  - ${tableName}`);
    });

    await database.close();
    process.exit(0);

  } catch (error) {
    logger.error('❌ Error en migración:', error);
    await database.close();
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runMigration();
}

module.exports = runMigration;