import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

/**
 * Componente Navbar - Barra de navegación principal
 * Incluye logo, menú de navegación, responsive design y efectos de scroll
 */
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Efecto para detectar el scroll y cambiar el estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú móvil cuando cambia la ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Enlaces de navegación
  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/servicios', label: 'Servicios' },
    { path: '/casos-de-exito', label: 'Casos de Éxito' },
    { path: '/contacto', label: 'Contacto' }
  ];

  // Función para verificar si un enlace está activo
  const isActiveLink = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-light/90 backdrop-blur-md shadow-md border-b border-gray-200'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
            aria-label="BlueSystem - Ir al inicio"
          >
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-lg">BS</span>
            </div>
            <span 
              className={`text-xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-gray-dark' : 'text-white'
              } group-hover:text-blue-primary`}
            >
              BlueSystem.io
            </span>
          </Link>

          {/* Navegación desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `
                  font-medium transition-all duration-300 hover:text-blue-primary relative
                  ${isScrolled ? 'text-gray-dark' : 'text-white'}
                  ${isActive ? 'text-blue-primary' : ''}
                `}
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {/* Indicador de enlace activo */}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-primary rounded-full animate-slide-up"></span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Botón CTA desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              to="/contacto" 
              className="btn-primary text-sm px-6 py-2"
            >
              Contactar
            </Link>
          </div>

          {/* Botón menú móvil */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
              isScrolled ? 'text-gray-dark hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
            aria-label="Abrir menú de navegación"
            aria-expanded={isMenuOpen}
          >
            <svg 
              className={`w-6 h-6 transform transition-transform duration-300 ${
                isMenuOpen ? 'rotate-45' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menú móvil */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 bg-gray-light/90 backdrop-blur-md rounded-lg mt-2 shadow-md border border-gray-200">
            {navLinks.map((link, index) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `
                  block px-6 py-3 text-gray-dark font-medium transition-all duration-300 
                  hover:bg-blue-50 hover:text-blue-primary transform hover:translate-x-2
                  ${isActive ? 'text-blue-primary bg-blue-50 border-r-2 border-blue-primary' : ''}
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {link.label}
              </NavLink>
            ))}
            
            {/* Botón CTA móvil */}
            <div className="px-6 py-3">
              <Link 
                to="/contacto" 
                className="btn-primary w-full text-center block"
              >
                Contactar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 