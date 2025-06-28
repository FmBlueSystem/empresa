import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Layout principal de Verifika - Diseño Profesional
 * Proporciona navegación moderna, sidebar elegante y estructura consistente
 */
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Detectar scroll para efectos del header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar sidebar en cambio de ruta
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠', active: location.pathname === '/dashboard' },
    { name: 'Técnicos', href: '/tecnicos', icon: '👨‍🔧', active: location.pathname.startsWith('/tecnicos') },
    { name: 'Clientes', href: '/clientes', icon: '🏢', active: location.pathname.startsWith('/clientes') },
    { name: 'Actividades', href: '/actividades', icon: '✅', active: location.pathname.startsWith('/actividades') },
    { name: 'Reportes', href: '/reportes', icon: '📈', active: location.pathname.startsWith('/reportes') },
  ];

  const getColorClasses = (color, isActive = false) => {
    const colors = {
      blue: {
        bg: isActive ? 'bg-blue-50' : 'hover:bg-blue-50',
        text: isActive ? 'text-blue-700' : 'text-gray-700 hover:text-blue-700',
        border: isActive ? 'border-blue-200' : 'border-transparent hover:border-blue-200',
        icon: isActive ? 'bg-blue-500' : 'bg-gray-400 group-hover:bg-blue-500'
      },
      indigo: {
        bg: isActive ? 'bg-indigo-50' : 'hover:bg-indigo-50',
        text: isActive ? 'text-indigo-700' : 'text-gray-700 hover:text-indigo-700',
        border: isActive ? 'border-indigo-200' : 'border-transparent hover:border-indigo-200',
        icon: isActive ? 'bg-indigo-500' : 'bg-gray-400 group-hover:bg-indigo-500'
      },
      green: {
        bg: isActive ? 'bg-green-50' : 'hover:bg-green-50',
        text: isActive ? 'text-green-700' : 'text-gray-700 hover:text-green-700',
        border: isActive ? 'border-green-200' : 'border-transparent hover:border-green-200',
        icon: isActive ? 'bg-green-500' : 'bg-gray-400 group-hover:bg-green-500'
      },
      purple: {
        bg: isActive ? 'bg-purple-50' : 'hover:bg-purple-50',
        text: isActive ? 'text-purple-700' : 'text-gray-700 hover:text-purple-700',
        border: isActive ? 'border-purple-200' : 'border-transparent hover:border-purple-200',
        icon: isActive ? 'bg-purple-500' : 'bg-gray-400 group-hover:bg-purple-500'
      },
      orange: {
        bg: isActive ? 'bg-orange-50' : 'hover:bg-orange-50',
        text: isActive ? 'text-orange-700' : 'text-gray-700 hover:text-orange-700',
        border: isActive ? 'border-orange-200' : 'border-transparent hover:border-orange-200',
        icon: isActive ? 'bg-orange-500' : 'bg-gray-400 group-hover:bg-orange-500'
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bluesystem-gradient overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white bg-opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white bg-opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-300 bg-opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Curved bottom section */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1440 320" className="w-full h-auto">
          <path 
            fill="rgba(255,255,255,0.05)" 
            fillOpacity="1" 
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 lg:flex lg:w-64 lg:flex-col fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out`}>
          <div className="flex flex-col flex-grow bluesystem-glass shadow-xl">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-6 py-6">
              <div className="flex items-center">
                <div className="bluesystem-glass w-10 h-10 flex items-center justify-center">
                  <span className="text-lg font-bold bluesystem-text-white">V</span>
                </div>
                <div className="ml-3">
                  <h1 className="text-lg font-bold bluesystem-text-white">Verifika</h1>
                  <p className="bluesystem-text-purple text-xs">BlueSystem Enterprise</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 pb-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    item.active
                      ? 'bluesystem-glass bluesystem-text-white border-white border-opacity-30'
                      : 'bluesystem-text-purple hover:bg-white hover:bg-opacity-10 hover:text-white border-transparent'
                  } group flex items-center px-4 py-3 text-sm font-medium rounded-xl border backdrop-blur-sm transition-all duration-200`}
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  {item.name}
                  {item.active && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </Link>
              ))}
            </nav>

            {/* User info */}
            <div className="flex-shrink-0 px-4 pb-6">
              <div className="bluesystem-glass p-4">
                <div className="flex items-center">
                  <div className="bluesystem-glass w-10 h-10 flex items-center justify-center">
                    <span className="text-lg">👤</span>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium bluesystem-text-white truncate">
                      {user?.nombre} {user?.apellido}
                    </p>
                    <p className="text-xs bluesystem-text-purple truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center text-xs bluesystem-text-purple">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    <span className="capitalize">{user?.rol}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bluesystem-text-purple hover:text-white text-xs font-medium px-3 py-1 rounded-lg bluesystem-glass hover:bg-opacity-20 transition-all duration-200"
                  >
                    Salir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <div className="bluesystem-glass shadow-lg lg:hidden">
            <div className="px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="bluesystem-text-white hover:text-purple-200 transition-colors"
              >
                <span className="text-xl">☰</span>
              </button>
              <div className="flex items-center">
                <div className="bluesystem-glass w-8 h-8 flex items-center justify-center">
                  <span className="text-sm font-bold bluesystem-text-white">V</span>
                </div>
                <span className="ml-2 text-sm font-medium bluesystem-text-white">Verifika</span>
              </div>
              <div className="w-6"></div> {/* Spacer for centering */}
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            <div className="relative">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

/**
 * Contenido del sidebar compartido entre móvil y desktop
 */
const SidebarContent = ({ navigation, isActiveRoute, user, getColorClasses }) => {
  return (
    <>
      {/* Header del sidebar */}
      <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-6 mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-5 h-5 bg-white rounded-md opacity-90"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Verifika</h1>
              <p className="text-xs text-gray-500">BlueSystem Enterprise</p>
            </div>
          </div>
        </div>

        {/* Navegación principal */}
        <nav className="mt-2 flex-1 px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = isActiveRoute(item.href);
            const colorClasses = getColorClasses(item.color, isActive);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl border transition-all duration-200 ${colorClasses.bg} ${colorClasses.text} ${colorClasses.border}`}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="flex-shrink-0 text-lg">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-current rounded-full opacity-60"></div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Información del usuario */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200/50 mt-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-sm">
                <div className="w-5 h-5 bg-white rounded-md opacity-90"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.nombre} {user?.apellido}
                </p>
                <p className="text-xs text-blue-600 capitalize font-medium">
                  {user?.rol}
                </p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="mt-3 text-xs text-gray-600">
              <div className="flex items-center justify-between">
                <span>Estado:</span>
                <span className="font-medium text-green-600 capitalize">{user?.estado}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer del sidebar */}
        <div className="flex-shrink-0 px-4 py-3 border-t border-gray-200/50">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              © 2024 BlueSystem.io
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Verifika v1.0.0
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;