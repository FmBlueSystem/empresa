import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

/**
 * Componente LazyImage Optimizado
 * Implementa lazy loading, WebP fallback y animaciones suaves
 * Fase 2: Optimización de Performance y UX
 */
const LazyImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  placeholder = 'blur',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Intersection Observer para lazy loading
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    skip: priority // Skip lazy loading para imágenes prioritarias
  });

  // Generar srcSet para diferentes formatos y tamaños
  const generateSrcSet = (originalSrc) => {
    if (!originalSrc) return '';
    
    const basePath = originalSrc.split('.').slice(0, -1).join('.');
    const extension = originalSrc.split('.').pop();
    
    // Generar variantes WebP y tamaños
    return [
      `${basePath}.webp 1x`,
      `${basePath}@2x.webp 2x`,
      `${originalSrc} 1x`,
      `${basePath}@2x.${extension} 2x`
    ].join(', ');
  };

  // Placeholder mientras carga la imagen
  const PlaceholderComponent = () => (
    <div 
      className={`
        bg-gradient-to-br from-gray-200 to-gray-300 
        animate-pulse flex items-center justify-center
        ${className}
      `}
      style={{ width, height }}
    >
      <svg 
        className="w-8 h-8 text-gray-400" 
        fill="currentColor" 
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path 
          fillRule="evenodd" 
          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
          clipRule="evenodd" 
        />
      </svg>
    </div>
  );

  // Error fallback
  const ErrorComponent = () => (
    <div 
      className={`
        bg-red-50 border border-red-200 
        flex items-center justify-center text-red-500
        ${className}
      `}
      style={{ width, height }}
    >
      <span className="text-sm font-medium">Error al cargar imagen</span>
    </div>
  );

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad && onLoad();
  };

  const handleError = () => {
    setHasError(true);
    onError && onError();
  };

  // Variantes de animación
  const imageVariants = {
    hidden: { 
      opacity: 0, 
      scale: 1.05,
      filter: 'blur(4px)' 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  // Si hay error, mostrar componente de error
  if (hasError) {
    return <ErrorComponent />;
  }

  // Si no está en vista y no es prioritaria, mostrar placeholder
  if (!inView && !priority) {
    return (
      <div ref={ref}>
        <PlaceholderComponent />
      </div>
    );
  }

  return (
    <div ref={ref} className="relative overflow-hidden">
      {/* Placeholder mientras carga */}
      {!isLoaded && <PlaceholderComponent />}
      
      {/* Imagen principal con animación */}
      <motion.img
        src={src}
        srcSet={generateSrcSet(src)}
        alt={alt}
        width={width}
        height={height}
        className={`
          ${className}
          ${!isLoaded ? 'absolute inset-0 opacity-0' : 'relative'}
        `}
        variants={imageVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        {...props}
      />
    </div>
  );
};

/**
 * Componente especializado para avatares
 */
export const LazyAvatar = ({ 
  src, 
  alt, 
  size = 'md', 
  fallbackText = '',
  className = '',
  ...props 
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm', 
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl',
    '2xl': 'w-24 h-24 text-2xl'
  };

  const sizeClass = sizes[size] || sizes.md;

  return (
    <div className={`relative ${sizeClass} ${className}`}>
      <LazyImage
        src={src}
        alt={alt}
        className={`${sizeClass} rounded-full object-cover`}
        {...props}
      />
      {/* Fallback con iniciales */}
      {!src && fallbackText && (
        <div className={`
          ${sizeClass} rounded-full 
          bg-gradient-to-br from-blue-500 to-blue-600
          text-white font-semibold
          flex items-center justify-center
        `}>
          {fallbackText.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

/**
 * Componente especializado para héroes y banners
 */
export const LazyHeroImage = ({ 
  src, 
  alt, 
  overlay = true,
  overlayOpacity = 0.4,
  children,
  className = '',
  ...props 
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <LazyImage
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        priority={true}
        {...props}
      />
      
      {/* Overlay opcional */}
      {overlay && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-800"
          style={{ opacity: overlayOpacity }}
        />
      )}
      
      {/* Contenido superpuesto */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

export default LazyImage; 