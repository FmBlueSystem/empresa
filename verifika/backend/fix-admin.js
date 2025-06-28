// Script para arreglar el usuario admin
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function fixAdmin() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'bluesystem_user',
    password: 'secure_password_123',
    database: 'bluesystem'
  });

  // Verificar usuarios existentes
  const [users] = await connection.execute('SELECT * FROM vf_usuarios WHERE email = ?', ['admin@bluesystem.io']);
  console.log('Usuario encontrado:', users[0]);

  if (users.length > 0) {
    const user = users[0];
    console.log('Password hash actual:', user.password_hash);
    
    // Verificar si la contraseña actual funciona
    const passwordTest = await bcrypt.compare('admin123', user.password_hash || '');
    console.log('Password test result:', passwordTest);
    
    if (!passwordTest || !user.password_hash) {
      console.log('Actualizando password...');
      const newPasswordHash = await bcrypt.hash('admin123', 12);
      
      await connection.execute(
        'UPDATE vf_usuarios SET password_hash = ?, estado = ?, email_verificado = ? WHERE email = ?',
        [newPasswordHash, 'activo', true, 'admin@bluesystem.io']
      );
      
      console.log('✅ Password actualizado');
    }
  } else {
    console.log('Creando nuevo usuario admin...');
    const passwordHash = await bcrypt.hash('admin123', 12);
    
    await connection.execute(
      'INSERT INTO vf_usuarios (email, password_hash, nombre, apellido, rol, estado, email_verificado) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['admin@bluesystem.io', passwordHash, 'Admin', 'BlueSystem', 'admin', 'activo', true]
    );
    
    console.log('✅ Usuario admin creado');
  }

  // Verificar resultado final
  const [finalUser] = await connection.execute('SELECT * FROM vf_usuarios WHERE email = ?', ['admin@bluesystem.io']);
  console.log('Usuario final:', {
    id: finalUser[0].id,
    email: finalUser[0].email,
    nombre: finalUser[0].nombre,
    rol: finalUser[0].rol,
    estado: finalUser[0].estado,
    email_verificado: finalUser[0].email_verificado,
    password_hash_length: finalUser[0].password_hash?.length
  });

  await connection.end();
}

fixAdmin().catch(console.error);