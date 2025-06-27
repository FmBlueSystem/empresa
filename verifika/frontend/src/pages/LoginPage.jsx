import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirigir si ya está autenticado
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    const result = await login(formData.email, formData.password, formData.remember);
    if (!result.success) {
      setLoginError(result.error);
    }
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800 text-white flex items-center justify-center p-4">
      
      {/* Contenedor principal del formulario */}
      <div className="w-full max-w-md">
        
        {/* Encabezado */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
             <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
                <span className="text-white font-bold text-3xl">V</span>
              </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Acceso a Verifika</h1>
          <p className="text-blue-100 text-lg">Inicia sesión para continuar</p>
        </div>

        {/* Mensaje de Error */}
        {loginError && (
          <div className="mb-6 p-4 bg-red-500/30 border border-red-400 text-white rounded-lg text-center backdrop-blur-sm">
            {loginError}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-2">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white transition-all duration-300 backdrop-blur-sm"
              placeholder="tu.correo@bluesystem.io"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white transition-all duration-300 backdrop-blur-sm"
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                checked={formData.remember}
                onChange={handleChange}
                className="h-4 w-4 text-blue-300 bg-white/10 border-white/30 rounded focus:ring-blue-200"
              />
              <label htmlFor="remember" className="ml-2 text-blue-100">
                Recordarme
              </label>
            </div>
            <a href="#" className="text-blue-200 hover:text-white hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-blue-600 font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-gray-50 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-wait disabled:transform-none"
            >
              {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;