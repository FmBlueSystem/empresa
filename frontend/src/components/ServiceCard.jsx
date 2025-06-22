import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente ServiceCard - Tarjeta reutilizable para mostrar servicios
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título del servicio
 * @param {string} props.description - Descripción del servicio
 * @param {string} props.icon - Nombre del ícono a mostrar
 * @param {string} props.link - Enlace hacia más información del servicio
 * @param {Array} props.features - Lista de características del servicio
 */
const ServiceCard = ({ 
  title, 
  description, 
  icon, 
  link = "/servicios", 
  features = [] 
}) => {
  // Función para renderizar íconos SVG según el tipo
  const renderIcon = (iconType) => {
    const iconClasses = "w-12 h-12 text-blue-primary mb-4 mx-auto";
    
    switch (iconType) {
      case 'sap':
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
            <path d="M8 11h8v2H8zm0 3h6v2H8zm0-6h8v2H8z"/>
          </svg>
        );
      case 'ai':
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        );
      case 'office365':
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 3v18h18V3H3zm16 16H5V5h14v14z"/>
            <path d="M7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z"/>
          </svg>
        );
      case 'web':
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
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
    <div className="card p-8 text-center group h-full flex flex-col">
      {/* Ícono del servicio */}
      <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
        {renderIcon(icon)}
      </div>

      {/* Título del servicio */}
      <h3 className="text-2xl font-bold text-gray-dark mb-4 group-hover:text-blue-primary transition-colors duration-300">
        {title}
      </h3>

      {/* Descripción del servicio */}
      <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
        {description}
      </p>

      {/* Lista de características (si se proporciona) */}
      {features.length > 0 && (
        <ul className="text-sm text-gray-500 mb-6 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Botón de acción */}
      <div className="mt-auto">
        <Link 
          to={link} 
          className="inline-flex items-center gap-2 text-blue-primary hover:text-blue-secondary font-semibold transition-colors duration-300 group-hover:gap-3"
          aria-label={`Más información sobre ${title}`}
        >
          Más información
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard; 