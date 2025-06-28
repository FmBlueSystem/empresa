import React from 'react';

/**
 * Componente de spinner de carga con diferentes tamaños y estilos
 * Utiliza el diseño BlueSystem consistente
 */
const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary',
  className = '',
  text = null,
  centered = true 
}) => {
  
  // Tamaños disponibles
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4', 
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16'
  };

  // Colores disponibles
  const colors = {
    primary: 'border-primary-500',
    secondary: 'border-secondary-500',
    white: 'border-white',
    success: 'border-success-500',
    warning: 'border-warning-500',
    danger: 'border-danger-500'
  };

  const spinnerClasses = `
    loading-spinner
    ${sizes[size]}
    ${colors[color]}
    ${className}
  `.trim();

  const content = (
    <div className={`flex items-center gap-3 ${centered ? 'justify-center' : ''}`}>
      <div className={spinnerClasses}></div>
      {text && (
        <span className="text-sm text-secondary-600 animate-pulse-soft">
          {text}
        </span>
      )}
    </div>
  );

  if (centered) {
    return (
      <div className="flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return content;
};

/**
 * Spinner de página completa
 */
export const FullPageSpinner = ({ text = "Cargando..." }) => (
  <div className="min-h-screen flex items-center justify-center bg-secondary-50">
    <div className="text-center space-y-4">
      <LoadingSpinner size="xl" text={text} />
      <div className="text-xs text-secondary-400">
        Verifika Platform
      </div>
    </div>
  </div>
);

/**
 * Spinner inline para botones
 */
export const ButtonSpinner = ({ size = 'sm', className = '' }) => (
  <LoadingSpinner 
    size={size} 
    color="white" 
    centered={false}
    className={className}
  />
);

/**
 * Skeleton loader para contenido
 */
export const SkeletonLoader = ({ lines = 3, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    <div className="skeleton skeleton-title"></div>
    {Array.from({ length: lines }).map((_, index) => (
      <div key={index} className="skeleton skeleton-text"></div>
    ))}
  </div>
);

/**
 * Card skeleton para listas
 */
export const CardSkeleton = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="card">
        <div className="flex items-start space-x-4">
          <div className="skeleton w-12 h-12 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="skeleton h-5 w-3/4"></div>
            <div className="skeleton h-4 w-1/2"></div>
            <div className="skeleton h-3 w-full"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default LoadingSpinner;