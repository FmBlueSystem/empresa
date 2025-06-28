// Script temporal para crear usuario admin
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function createAdmin() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'bluesystem_user',
    password: 'secure_password_123',
    database: 'bluesystem'
  });

  // Hash de la contraseña
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 12);

  // Crear usuario admin
  const query = `
    INSERT INTO vf_usuarios (email, password_hash, nombre, apellido, rol, estado, email_verificado) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
    password_hash = VALUES(password_hash),
    estado = VALUES(estado),
    email_verificado = VALUES(email_verificado)
  `;

  await connection.execute(query, [
    'admin@bluesystem.io',
    hashedPassword,
    'Admin',
    'BlueSystem',
    'admin',
    'activo',
    true
  ]);

  console.log('✅ Usuario admin creado exitosamente');
  console.log('📧 Email: admin@bluesystem.io');
  console.log('🔑 Password: admin123');

  await connection.end();
}

createAdmin().catch(console.error);