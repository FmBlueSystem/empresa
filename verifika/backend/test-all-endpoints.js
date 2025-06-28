// Script para probar todos los endpoints de Verifika
const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
const credentials = {
  admin: { email: 'admin@bluesystem.io', password: 'admin123' },
  tecnico: { email: 'tecnico@bluesystem.io', password: 'tecnico123' },
  cliente: { email: 'cliente@bluesystem.io', password: 'cliente123' }
};

let tokens = {};

async function login(role) {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, credentials[role]);
    if (response.data.success) {
      tokens[role] = response.data.data.token;
      console.log(`✅ Login exitoso para ${role}: ${response.data.data.user.nombre}`);
      return true;
    }
  } catch (error) {
    console.log(`❌ Error login ${role}:`, error.response?.data?.message || error.message);
    return false;
  }
}

async function testEndpoint(endpoint, method = 'GET', role = 'admin', data = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${tokens[role]}`,
        'Content-Type': 'application/json'
      }
    };
    
    if (data) config.data = data;

    const response = await axios(config);
    const status = response.data.success ? '✅' : '⚠️';
    console.log(`${status} ${method} ${endpoint} - ${response.status} - ${response.data.message || 'OK'}`);
    return response.data;
  } catch (error) {
    console.log(`❌ ${method} ${endpoint} - ${error.response?.status || 'ERR'} - ${error.response?.data?.message || error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('🧪 Iniciando tests de endpoints de Verifika...\n');

  // 1. Login con todos los roles
  console.log('📝 Testing autenticación...');
  await login('admin');
  await login('tecnico');
  await login('cliente');
  console.log('');

  // 2. Health checks
  console.log('📝 Testing health checks...');
  await testEndpoint('/health', 'GET', 'admin');
  await testEndpoint('/health/detailed', 'GET', 'admin');
  console.log('');

  // 3. Endpoints de autenticación
  console.log('📝 Testing auth endpoints...');
  await testEndpoint('/api/auth/me', 'GET', 'admin');
  await testEndpoint('/api/auth/me', 'GET', 'tecnico');
  console.log('');

  // 4. Endpoints de técnicos
  console.log('📝 Testing técnicos endpoints...');
  await testEndpoint('/api/tecnicos', 'GET', 'admin');
  await testEndpoint('/api/tecnicos/stats', 'GET', 'admin');
  await testEndpoint('/api/tecnicos/available', 'GET', 'admin');
  console.log('');

  // 5. Endpoints de competencias
  console.log('📝 Testing competencias endpoints...');
  await testEndpoint('/api/competencias', 'GET', 'admin');
  await testEndpoint('/api/competencias/categories', 'GET', 'admin');
  await testEndpoint('/api/competencias/stats', 'GET', 'admin');
  console.log('');

  // 6. Endpoints de clientes
  console.log('📝 Testing clientes endpoints...');
  await testEndpoint('/api/clientes', 'GET', 'admin');
  await testEndpoint('/api/clientes/stats', 'GET', 'admin');
  console.log('');

  // 7. Endpoints de asignaciones
  console.log('📝 Testing asignaciones endpoints...');
  await testEndpoint('/api/asignaciones', 'GET', 'admin');
  await testEndpoint('/api/asignaciones/active', 'GET', 'admin');
  await testEndpoint('/api/asignaciones/stats', 'GET', 'admin');
  console.log('');

  // 8. Endpoints de actividades
  console.log('📝 Testing actividades endpoints...');
  await testEndpoint('/api/actividades', 'GET', 'admin');
  await testEndpoint('/api/actividades/stats', 'GET', 'admin');
  console.log('');

  // 9. Endpoints de validaciones
  console.log('📝 Testing validaciones endpoints...');
  await testEndpoint('/api/validaciones', 'GET', 'admin');
  await testEndpoint('/api/validaciones/stats', 'GET', 'admin');
  console.log('');

  // 10. Tests con diferentes roles
  console.log('📝 Testing permisos por rol...');
  await testEndpoint('/api/tecnicos', 'GET', 'tecnico');
  await testEndpoint('/api/clientes', 'GET', 'cliente');
  console.log('');

  console.log('🎉 Tests de endpoints completados!');
}

runTests().catch(console.error);