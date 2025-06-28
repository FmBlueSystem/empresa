// Script para crear endpoint de login de prueba
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

const app = express();

app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));
app.use(express.json());

// Configuración de BD
const dbConfig = {
  host: 'localhost',
  user: 'bluesystem_user',
  password: 'secure_password_123',
  database: 'bluesystem'
};

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Test API funcionando',
    timestamp: new Date().toISOString()
  });
});

// Login endpoint simplificado
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password });

    // Conectar a BD
    const connection = await mysql.createConnection(dbConfig);
    
    // Buscar usuario
    const [users] = await connection.execute(
      'SELECT * FROM vf_usuarios WHERE email = ?',
      [email]
    );
    
    console.log('Users found:', users.length);
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    const user = users[0];
    console.log('User data:', {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
      estado: user.estado,
      hash_length: user.password_hash?.length
    });
    
    // Verificar contraseña
    const isValid = await bcrypt.compare(password, user.password_hash);
    console.log('Password valid:', isValid);
    
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña incorrecta'
      });
    }
    
    // Generar token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        rol: user.rol 
      },
      'verifika_jwt_secret_development_2024_bluesystem_costa_rica',
      { expiresIn: '24h' }
    );
    
    await connection.end();
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
          rol: user.rol,
          estado: user.estado,
          email_verificado: user.email_verificado
        },
        token
      },
      message: 'Login exitoso'
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Endpoint para verificar token
app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, 'verifika_jwt_secret_development_2024_bluesystem_costa_rica');
    
    const connection = await mysql.createConnection(dbConfig);
    const [users] = await connection.execute(
      'SELECT * FROM vf_usuarios WHERE id = ?',
      [decoded.id]
    );
    await connection.end();
    
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    const user = users[0];
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
          rol: user.rol,
          estado: user.estado,
          email_verificado: user.email_verificado
        }
      }
    });
    
  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(401).json({
      success: false,
      message: 'Token inválido',
      error: error.message
    });
  }
});

// Logout (simple)
app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout exitoso'
  });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`🚀 Test API corriendo en puerto ${PORT}`);
  console.log(`📋 Endpoints disponibles:`);
  console.log(`   GET  http://localhost:${PORT}/health`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   GET  http://localhost:${PORT}/api/auth/me`);
  console.log(`   POST http://localhost:${PORT}/api/auth/logout`);
});