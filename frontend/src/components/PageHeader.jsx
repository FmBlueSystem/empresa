import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente PageHeader - Encabezado decorativo para páginas internas
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título principal de la página
 * @param {string} props.subtitle - Subtítulo descriptivo
 * @param {string} props.breadcrumb - Navegación breadcrumb (opcional)
 * @param {boolean} props.showStats - Mostrar estadísticas (opcional)
 */
const PageHeader = ({ 
  title, 
  subtitle, 
  breadcrumb = "Inicio",
  showStats = true
}) => {
  return (
    <section className="relative pt-24 pb-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0">
        {/* Círculos decorativos */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-blue-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl"></div>
        
        {/* Patrón de puntos */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-1/4 w-2 h-2 bg-blue-primary/20 rounded-full"></div>
          <div className="absolute top-32 right-1/3 w-1 h-1 bg-indigo-500/20 rounded-full"></div>
          <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-blue-primary/20 rounded-full"></div>
          <div className="absolute bottom-32 right-1/4 w-2 h-2 bg-indigo-500/20 rounded-full"></div>
        </div>

        {/* Líneas decorativas */}
        <svg 
          className="absolute top-0 left-0 w-full h-full opacity-10" 
          viewBox="0 0 1200 400" 
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M0,200 Q300,50 600,200 T1200,200"
            stroke="url(#gradient)"
            strokeWidth="2"
            fill="none"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1C5DC4" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 container-custom text-center">
        {/* Breadcrumb */}
        <nav className="flex justify-center mb-8" aria-label="Navegación breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link 
                to="/" 
                className="hover:text-blue-primary transition-colors duration-300"
                aria-label="Volver al inicio"
              >
                {breadcrumb}
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li className="text-gray-900 font-medium" aria-current="page">
              {title}
            </li>
          </ol>
        </nav>

        {/* Título principal */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-dark leading-tight animate-fade-in">
            {title}
            <span className="block text-gradient mt-2">
              que transforman
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            {subtitle}
          </p>

          {/* Línea decorativa */}
          <div className="flex justify-center mt-8 animate-slide-up">
            <div className="w-24 h-1 bg-gradient-primary rounded-full"></div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        {showStats && (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center animate-fade-in">
              <div className="text-2xl md:text-3xl font-bold text-blue-primary mb-1">50+</div>
              <div className="text-sm text-gray-600">Proyectos</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1">10+</div>
              <div className="text-sm text-gray-600">Años</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1">98%</div>
              <div className="text-sm text-gray-600">Satisfacción</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-2xl md:text-3xl font-bold text-orange-600 mb-1">24/7</div>
              <div className="text-sm text-gray-600">Soporte</div>
            </div>
          </div>
        )}
      </div>

      {/* Flecha hacia abajo */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg 
          className="w-6 h-6 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default PageHeader;