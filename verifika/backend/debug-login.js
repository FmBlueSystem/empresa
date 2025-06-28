// Script para debuggear el login
const Usuario = require('./src/models/Usuario');
const database = require('./src/config/database');
require('dotenv').config();

async function debugLogin() {
  try {
    // Inicializar database
    await database.initialize();
    
    // Buscar usuario
    const user = await Usuario.findByEmail('admin@bluesystem.io');
    console.log('Usuario encontrado:', {
      id: user?.id,
      email: user?.email,
      nombre: user?.nombre,
      rol: user?.rol,
      estado: user?.estado,
      password_hash: user?.password_hash,
      password_hash_length: user?.password_hash?.length,
      constructor_name: user?.constructor?.name
    });
    
    if (user) {
      // Verificar contraseña
      console.log('Verificando contraseña...');
      const isValid = await user.verifyPassword('admin123');
      console.log('Password válida:', isValid);
    }
    
    await database.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

debugLogin();