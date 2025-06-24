// testAuth.js - Test rápido del sistema de autenticación
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const database = require('../config/database');
const redisClient = require('../config/redis');
const Usuario = require('../models/Usuario');
const logger = require('../config/logger');

async function testAuth() {
  try {
    logger.info('🧪 Iniciando tests de autenticación...');

    // Inicializar servicios
    await database.initialize();
    await redisClient.initialize();

    // Test 1: Verificar usuario admin
    logger.info('📝 Test 1: Verificar usuario admin...');
    const admin = await Usuario.findByEmail('admin@bluesystem.io');
    if (admin) {
      logger.info(`✅ Usuario admin encontrado: ${admin.nombreCompleto}`);
      logger.info(`   - Rol: ${admin.rol}`);
      logger.info(`   - Estado: ${admin.estado}`);
      logger.info(`   - Email verificado: ${admin.email_verificado}`);
    } else {
      logger.error('❌ Usuario admin no encontrado');
    }

    // Test 2: Generar JWT
    logger.info('📝 Test 2: Generar JWT...');
    if (admin) {
      const token = admin.generateJWT();
      logger.info(`✅ JWT generado exitosamente: ${token.substring(0, 50)}...`);
      
      // Test 3: Verificar JWT
      logger.info('📝 Test 3: Verificar JWT...');
      const decoded = Usuario.verifyJWT(token);
      logger.info(`✅ JWT verificado exitosamente para: ${decoded.email}`);
    }

    // Test 4: Verificar contraseña
    logger.info('📝 Test 4: Verificar contraseña...');
    if (admin) {
      const isValid = await admin.verifyPassword('password');
      logger.info(`✅ Verificación de contraseña: ${isValid ? 'CORRECTA' : 'INCORRECTA'}`);
    }

    // Test 5: Guardar token en Redis
    logger.info('📝 Test 5: Guardar token en Redis...');
    if (admin) {
      const token = admin.generateJWT();
      const saved = await redisClient.setSession(admin.id, token, 3600);
      logger.info(`✅ Token guardado en Redis: ${saved}`);
      
      // Test 6: Recuperar token de Redis
      logger.info('📝 Test 6: Recuperar token de Redis...');
      const retrievedToken = await redisClient.getSession(admin.id);
      logger.info(`✅ Token recuperado: ${retrievedToken ? 'ÉXITO' : 'FALLO'}`);
    }

    // Test 7: Estadísticas de usuarios
    logger.info('📝 Test 7: Estadísticas de usuarios...');
    const stats = await Usuario.getStats();
    logger.info(`✅ Estadísticas obtenidas:`);
    stats.forEach(stat => {
      logger.info(`   - ${stat.rol} (${stat.estado}): ${stat.total}`);
    });

    logger.info('🎉 Todos los tests de autenticación completados exitosamente');

    await database.close();
    await redisClient.quit();
    process.exit(0);

  } catch (error) {
    logger.error('❌ Error en tests de autenticación:', error);
    await database.close();
    await redisClient.quit();
    process.exit(1);
  }
}

// Ejecutar tests
testAuth();