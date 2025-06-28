// Script para crear usuarios demo completos
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function createDemoUsers() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'bluesystem_user',
    password: 'secure_password_123',
    database: 'bluesystem'
  });

  console.log('🔧 Creando usuarios demo para Verifika...\n');

  // 1. Usuario Admin (ya existe, actualizarlo)
  const adminPassword = await bcrypt.hash('admin123', 12);
  await connection.execute(`
    INSERT INTO vf_usuarios (email, password_hash, nombre, apellido, rol, estado, email_verificado) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
    password_hash = VALUES(password_hash),
    estado = VALUES(estado),
    email_verificado = VALUES(email_verificado)
  `, [
    'admin@bluesystem.io',
    adminPassword,
    'Admin',
    'BlueSystem',
    'admin',
    'activo',
    true
  ]);

  console.log('✅ Usuario Admin actualizado');
  console.log('   📧 Email: admin@bluesystem.io');
  console.log('   🔑 Password: admin123\n');

  // 2. Usuario Técnico Demo
  const tecnicoPassword = await bcrypt.hash('tecnico123', 12);
  const [tecnicoResult] = await connection.execute(`
    INSERT INTO vf_usuarios (email, password_hash, nombre, apellido, rol, estado, email_verificado) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
    password_hash = VALUES(password_hash),
    estado = VALUES(estado),
    email_verificado = VALUES(email_verificado),
    id = LAST_INSERT_ID(id)
  `, [
    'tecnico@bluesystem.io',
    tecnicoPassword,
    'Juan Carlos',
    'Técnico Demo',
    'tecnico',
    'activo',
    true
  ]);

  const tecnicoUserId = tecnicoResult.insertId || (await connection.execute(
    'SELECT id FROM vf_usuarios WHERE email = ?', ['tecnico@bluesystem.io']
  ))[0][0].id;

  // Crear perfil técnico
  await connection.execute(`
    INSERT INTO vf_tecnicos_perfiles 
    (usuario_id, ciudad, experiencia_anos, nivel_experiencia, disponibilidad, tarifa_por_hora, moneda, biografia)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    ciudad = VALUES(ciudad),
    experiencia_anos = VALUES(experiencia_anos),
    nivel_experiencia = VALUES(nivel_experiencia),
    disponibilidad = VALUES(disponibilidad),
    tarifa_por_hora = VALUES(tarifa_por_hora),
    biografia = VALUES(biografia)
  `, [
    tecnicoUserId,
    'Madrid',
    5,
    'intermedio',
    'disponible',
    45.50,
    'EUR',
    'Técnico especializado en SAP y desarrollo web. Usuario demo para testing de Verifika.'
  ]);

  console.log('✅ Usuario Técnico creado');
  console.log('   📧 Email: tecnico@bluesystem.io');
  console.log('   🔑 Password: tecnico123\n');

  // 3. Usuario Cliente Demo
  const clientePassword = await bcrypt.hash('cliente123', 12);
  const [clienteResult] = await connection.execute(`
    INSERT INTO vf_usuarios (email, password_hash, nombre, apellido, rol, estado, email_verificado) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
    password_hash = VALUES(password_hash),
    estado = VALUES(estado),
    email_verificado = VALUES(email_verificado),
    id = LAST_INSERT_ID(id)
  `, [
    'cliente@bluesystem.io',
    clientePassword,
    'María Elena',
    'Cliente Demo',
    'cliente',
    'activo',
    true
  ]);

  console.log('✅ Usuario Cliente creado');
  console.log('   📧 Email: cliente@bluesystem.io');
  console.log('   🔑 Password: cliente123\n');

  console.log('🎉 Todos los usuarios demo creados exitosamente!');
  console.log('🌐 Accede desde: http://localhost:5173/verifika');
  console.log('🔗 Backend API: http://localhost:3001/health\n');

  console.log('📋 Resumen de credenciales:');
  console.log('┌──────────────────────────────────────────────────────────┐');
  console.log('│ ADMIN   │ admin@bluesystem.io   │ admin123    │ Completo   │');
  console.log('│ TÉCNICO │ tecnico@bluesystem.io │ tecnico123  │ Con perfil │');
  console.log('│ CLIENTE │ cliente@bluesystem.io │ cliente123  │ Básico     │');
  console.log('└──────────────────────────────────────────────────────────┘');

  await connection.end();
}

createDemoUsers().catch(console.error);