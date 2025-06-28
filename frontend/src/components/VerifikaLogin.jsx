import React, { useState } from 'react';

/**
 * Componente de login para integración con Verifika
 * Se conecta al backend de Verifika en puerto 3001
 */
const VerifikaLogin = ({ onClose }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Función para rellenar credenciales de demo
  const fillDemoCredentials = () => {
    setCredentials({
      email: 'admin@bluesystem.io',
      password: 'admin123',
      remember: false
    });
    setError(''); // Limpiar errores previos
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (data.success) {
        // Guardar token y datos del usuario
        localStorage.setItem('verifika_token', data.data.token);
        localStorage.setItem('verifika_user', JSON.stringify(data.data.user));
        
        // Redirigir a Verifika o mostrar mensaje de éxito
        alert(`¡Bienvenido ${data.data.user.nombre}! Acceso a Verifika autorizado.`);
        onClose();
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      setError('No se puede conectar con Verifika. ¿Está el servidor iniciado?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Acceso a Verifika
            </h2>
            <p className="text-gray-600 text-sm">
              Sistema de validación de actividades técnicas
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={credentials.email}
              onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
              placeholder="usuario@bluesystem.io"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={credentials.remember}
              onChange={(e) => setCredentials(prev => ({ ...prev, remember: e.target.checked }))}
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              Recordarme por 30 días
            </label>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Iniciando sesión...' : 'Acceder a Verifika'}
            </button>
            
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
            >
              🚀 Rellenar Credenciales Demo
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
            <p className="text-sm font-medium text-green-800 mb-2">
              🎯 Credenciales de Demo Disponibles
            </p>
            <div className="text-xs text-green-700 space-y-1">
              <div><strong>Email:</strong> admin@bluesystem.io</div>
              <div><strong>Password:</strong> admin123</div>
              <div className="text-green-600 mt-2">Click en "Rellenar Credenciales Demo" arriba</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Backend: localhost:3001 • Estado: {error ? 'Desconectado' : 'Disponible'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifikaLogin;