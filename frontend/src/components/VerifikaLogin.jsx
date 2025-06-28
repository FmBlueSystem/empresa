import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Componente de login para integración con Verifika
 * Se conecta al backend de Verifika en puerto 3001
 */
const VerifikaLogin = ({ onClose }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Función para rellenar credenciales de demo
  const fillDemoCredentials = (type = 'admin') => {
    const demoCredentials = {
      admin: { email: 'admin@bluesystem.io', password: 'admin123' },
      tecnico: { email: 'tecnico@bluesystem.io', password: 'tecnico123' },
      cliente: { email: 'cliente@bluesystem.io', password: 'cliente123' }
    };
    
    setCredentials({
      ...demoCredentials[type],
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
        
        // Redirigir al dashboard de Verifika
        navigate('/verifika/dashboard');
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
            
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="bg-purple-600 text-white py-2 px-2 rounded-lg hover:bg-purple-700 text-xs transition-all duration-200"
                title="Admin: Acceso completo al sistema"
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('tecnico')}
                className="bg-blue-600 text-white py-2 px-2 rounded-lg hover:bg-blue-700 text-xs transition-all duration-200"
                title="Técnico: Registrar y gestionar actividades"
              >
                🔧 Técnico
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('cliente')}
                className="bg-green-600 text-white py-2 px-2 rounded-lg hover:bg-green-700 text-xs transition-all duration-200"
                title="Cliente: Validar actividades técnicas"
              >
                ✅ Cliente
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
            <p className="text-sm font-medium text-blue-800 mb-3">
              🎯 Usuarios Demo Disponibles
            </p>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="bg-purple-100 rounded p-2">
                <div className="font-medium text-purple-800">👑 Admin</div>
                <div className="text-purple-700">admin@bluesystem.io / admin123</div>
              </div>
              <div className="bg-blue-100 rounded p-2">
                <div className="font-medium text-blue-800">🔧 Técnico</div>
                <div className="text-blue-700">tecnico@bluesystem.io / tecnico123</div>
              </div>
              <div className="bg-green-100 rounded p-2">
                <div className="font-medium text-green-800">✅ Cliente</div>
                <div className="text-green-700">cliente@bluesystem.io / cliente123</div>
              </div>
            </div>
            <div className="text-blue-600 mt-2 text-center font-medium">
              Click en los botones de arriba para auto-completar
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