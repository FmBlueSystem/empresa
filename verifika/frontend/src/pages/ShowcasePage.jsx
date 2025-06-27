import React from 'react';

/**
 * Página de demostración de las mejoras de diseño de Verifika
 * Muestra todos los componentes y estilos mejorados
 */
const ShowcasePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <div className="w-8 h-8 bg-white rounded-lg opacity-90"></div>
            </div>
            <div className="ml-4">
              <h1 className="text-4xl font-bold text-gray-900">Verifika</h1>
              <p className="text-blue-600 text-lg">BlueSystem Enterprise</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Diseño Profesional Mejorado
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sistema de validación de actividades técnicas con diseño moderno, 
            consistente y profesional que refleja la calidad de BlueSystem.
          </p>
        </div>

        {/* Características principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 animate-fade-in-up">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md mb-6">
              <div className="text-2xl">🎨</div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Diseño Moderno</h3>
            <p className="text-gray-600 mb-4">
              Interfaz completamente renovada con glassmorphism, gradientes suaves y 
              elementos visuales que transmiten profesionalismo.
            </p>
            <div className="flex items-center text-blue-600 text-sm font-medium">
              <span>Ver mejoras</span>
              <div className="w-4 h-4 bg-blue-600 rounded-sm opacity-70 ml-2"></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md mb-6">
              <div className="text-2xl">⚡</div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Animaciones Fluidas</h3>
            <p className="text-gray-600 mb-4">
              Transiciones suaves y animaciones CSS modernas que mejoran la 
              experiencia de usuario sin sacrificar rendimiento.
            </p>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <span>Explorar</span>
              <div className="w-4 h-4 bg-green-600 rounded-sm opacity-70 ml-2"></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md mb-6">
              <div className="text-2xl">📱</div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Responsive Design</h3>
            <p className="text-gray-600 mb-4">
              Optimizado para todos los dispositivos con navegación adaptativa 
              y experiencia consistente en móvil, tablet y desktop.
            </p>
            <div className="flex items-center text-purple-600 text-sm font-medium">
              <span>Probar</span>
              <div className="w-4 h-4 bg-purple-600 rounded-sm opacity-70 ml-2"></div>
            </div>
          </div>
        </div>

        {/* Componentes de ejemplo */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Componentes Mejorados
          </h3>
          
          {/* Cards de información */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="glass-card-dark bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <div className="w-5 h-5 bg-white rounded-md opacity-90"></div>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <h4 className="text-sm font-medium text-blue-100 mb-1">Usuarios Activos</h4>
              <p className="text-2xl font-bold">1,247</p>
              <p className="text-xs text-blue-200 mt-1">+12% este mes</p>
            </div>

            <div className="glass-card-dark bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <div className="w-5 h-5 bg-white rounded-md opacity-90"></div>
                </div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <h4 className="text-sm font-medium text-green-100 mb-1">Validaciones</h4>
              <p className="text-2xl font-bold">3,891</p>
              <p className="text-xs text-green-200 mt-1">Completadas hoy</p>
            </div>

            <div className="glass-card-dark bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <div className="w-5 h-5 bg-white rounded-md opacity-90"></div>
                </div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
              <h4 className="text-sm font-medium text-purple-100 mb-1">Eficiencia</h4>
              <p className="text-2xl font-bold">98.5%</p>
              <p className="text-xs text-purple-200 mt-1">Promedio semanal</p>
            </div>

            <div className="glass-card-dark bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <div className="w-5 h-5 bg-white rounded-md opacity-90"></div>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <h4 className="text-sm font-medium text-orange-100 mb-1">Satisfacción</h4>
              <p className="text-2xl font-bold">4.9/5</p>
              <p className="text-xs text-orange-200 mt-1">Rating promedio</p>
            </div>
          </div>

          {/* Navegación mejorada */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h4 className="text-xl font-bold text-gray-900 mb-6">Navegación Moderna</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { name: 'Dashboard', icon: '📊', color: 'blue', desc: 'Panel principal' },
                { name: 'Clientes', icon: '🏢', color: 'indigo', desc: 'Directorio empresarial' },
                { name: 'Técnicos', icon: '👨‍🔧', color: 'green', desc: 'Personal técnico' },
                { name: 'Actividades', icon: '✅', color: 'purple', desc: 'Validación diaria' },
                { name: 'Reportes', icon: '📈', color: 'orange', desc: 'Análisis y métricas' }
              ].map((item, index) => (
                <div key={item.name} className={`group p-4 rounded-xl border transition-all duration-200 hover:bg-${item.color}-50 hover:border-${item.color}-200 cursor-pointer`}>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`flex-shrink-0 text-lg`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <div className="w-4 h-4 bg-white rounded-sm opacity-90"></div>
            </div>
            <span className="text-lg font-bold text-gray-900">BlueSystem Enterprise</span>
          </div>
          <p className="text-gray-600 mb-2">
            Verifika v1.0.0 - Sistema de validación técnica empresarial
          </p>
          <p className="text-sm text-gray-500">
            © 2024 BlueSystem.io - Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShowcasePage; 