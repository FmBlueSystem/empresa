import React from 'react';

/**
 * Componente ServiceDetail - Tarjeta detallada para mostrar servicios individuales
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título del servicio
 * @param {string} props.description - Descripción detallada del servicio
 * @param {string} props.icon - Nombre del ícono del servicio
 * @param {Array} props.features - Lista de características principales
 * @param {Array} props.technologies - Tecnologías utilizadas
 * @param {string} props.link - Enlace para más información
 */
const ServiceDetail = ({ 
  title, 
  description, 
  icon, 
  features = [], 
  technologies = [], 
  link = "#" 
}) => {
  // Función para renderizar íconos SVG según el tipo de servicio
  const renderServiceIcon = (iconType) => {
    const iconClasses = "w-16 h-16 text-white";
    
    switch (iconType) {
      case 'sap':
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
            <path d="M8 10h8v2H8zm0 3h6v2H8zm0-6h8v2H8z" fill="white"/>
            <circle cx="10" cy="14" r="1" fill="currentColor"/>
            <circle cx="14" cy="14" r="1" fill="currentColor"/>
          </svg>
        );
      case 'ai':
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
            <circle cx="12" cy="12" r="3" fill="white"/>
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="white" strokeWidth="2"/>
            <path d="M8 8l1 1 3-3 3 3 1-1" stroke="currentColor" strokeWidth="1" fill="none"/>
          </svg>
        );
      case 'office365':
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 3v18h18V3H3zm16 16H5V5h14v14z"/>
            <rect x="7" y="7" width="10" height="2" rx="1" fill="white"/>
            <rect x="7" y="11" width="10" height="2" rx="1" fill="white"/>
            <rect x="7" y="15" width="7" height="2" rx="1" fill="white"/>
            <rect x="16" y="15" width="1" height="2" rx="0.5" fill="white"/>
            <path d="M9 9v6l3-3z" fill="currentColor"/>
          </svg>
        );
      case 'web':
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
            <path d="M4 12h16M12 4v16" stroke="white" strokeWidth="2"/>
            <path d="M8.5 4.5c0 8 1.5 15 3.5 15s3.5-7 3.5-15" stroke="white" strokeWidth="1" fill="none"/>
            <path d="M8.5 19.5c0-8 1.5-15 3.5-15s3.5 7 3.5 15" stroke="white" strokeWidth="1" fill="none"/>
            <circle cx="7" cy="9" r="1" fill="white"/>
            <circle cx="17" cy="15" r="1" fill="white"/>
          </svg>
        );
      default:
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200">
      {/* Gradiente de fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Contenido principal */}
      <div className="relative z-10 p-8">
        {/* Ícono del servicio */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
            {renderServiceIcon(icon)}
          </div>
        </div>

        {/* Título del servicio */}
        <h3 className="text-2xl font-bold text-gray-dark mb-4 text-center group-hover:text-blue-primary transition-colors duration-300">
          {title}
        </h3>

        {/* Descripción del servicio */}
        <p className="text-gray-600 leading-relaxed mb-6 text-center">
          {description}
        </p>

        {/* Lista de características principales */}
        {features.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
              Características Principales
            </h4>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-gray-600 leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tecnologías utilizadas */}
        {technologies.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
              Tecnologías
            </h4>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Botón de acción */}
        <div className="text-center pt-4">
          <a 
            href={link}
            className="inline-flex items-center gap-2 bg-gradient-primary text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-primary/30"
            aria-label={`Saber más sobre ${title}`}
          >
            Saber más
            <svg 
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Elemento decorativo inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    </div>
  );
};

export default ServiceDetail;