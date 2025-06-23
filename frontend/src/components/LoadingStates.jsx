import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Loading States & Skeleton Screens
 * Componentes de carga optimizados para UX
 * Fase 3: User Experience Enhancements
 */

/**
 * Skeleton Base Component
 */
const SkeletonBase = ({ 
  className = "", 
  width = "100%", 
  height = "1rem",
  rounded = "rounded",
  animated = true 
}) => (
  <div
    className={`
      bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
      ${rounded} ${className}
      ${animated ? 'animate-pulse bg-size-200 bg-pos-0 animate-shimmer' : ''}
    `}
    style={{ width, height }}
  />
);

/**
 * Text Skeleton
 */
export const SkeletonText = ({ 
  lines = 1, 
  className = "",
  lastLineWidth = "75%"
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <SkeletonBase
        key={index}
        width={index === lines - 1 ? lastLineWidth : "100%"}
        height="0.75rem"
      />
    ))}
  </div>
);

/**
 * Card Skeleton
 */
export const SkeletonCard = ({ 
  showImage = true, 
  showTitle = true, 
  showDescription = true,
  className = ""
}) => (
  <div className={`p-6 border border-gray-200 rounded-lg ${className}`}>
    {showImage && (
      <SkeletonBase 
        height="12rem" 
        className="mb-4" 
        rounded="rounded-lg"
      />
    )}
    
    {showTitle && (
      <SkeletonBase 
        height="1.25rem" 
        width="60%" 
        className="mb-3"
      />
    )}
    
    {showDescription && (
      <SkeletonText lines={3} lastLineWidth="80%" />
    )}
  </div>
);

/**
 * Hero Section Skeleton
 */
export const SkeletonHero = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
    <div className="text-center max-w-4xl mx-auto px-4">
      {/* Title skeleton */}
      <div className="mb-6">
        <SkeletonBase height="3rem" width="80%" className="mx-auto mb-4" />
        <SkeletonBase height="3rem" width="60%" className="mx-auto" />
      </div>
      
      {/* Subtitle skeleton */}
      <SkeletonText lines={2} className="max-w-2xl mx-auto mb-8" />
      
      {/* Buttons skeleton */}
      <div className="flex gap-4 justify-center">
        <SkeletonBase height="3rem" width="9rem" rounded="rounded-lg" />
        <SkeletonBase height="3rem" width="9rem" rounded="rounded-lg" />
      </div>
    </div>
  </div>
);

/**
 * Services Grid Skeleton
 */
export const SkeletonServicesGrid = ({ items = 4 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
    {Array.from({ length: items }).map((_, index) => (
      <SkeletonCard 
        key={index}
        showImage={false}
        className="hover:shadow-lg transition-shadow"
      />
    ))}
  </div>
);

/**
 * Navigation Skeleton
 */
export const SkeletonNavigation = () => (
  <nav className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center">
          {/* Logo skeleton */}
          <SkeletonBase width="2.5rem" height="2.5rem" rounded="rounded-lg" />
        </div>
        
        <div className="flex items-center space-x-8">
          {/* Menu items skeleton */}
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBase key={index} width="5rem" height="1rem" />
          ))}
          
          {/* CTA button skeleton */}
          <SkeletonBase width="7rem" height="2.5rem" rounded="rounded-lg" />
        </div>
      </div>
    </div>
  </nav>
);

/**
 * Spinner Component
 */
export const Spinner = ({ 
  size = "medium", 
  color = "blue", 
  className = "",
  label = "Cargando..." 
}) => {
  const sizes = {
    small: "w-4 h-4",
    medium: "w-8 h-8", 
    large: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const colors = {
    blue: "border-blue-primary",
    white: "border-white",
    gray: "border-gray-600"
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`
          ${sizes[size]} 
          border-2 ${colors[color]} border-t-transparent 
          rounded-full animate-spin
        `}
        role="status"
        aria-label={label}
      />
      {label && (
        <span className="mt-2 text-sm text-gray-600 sr-only">{label}</span>
      )}
    </div>
  );
};

/**
 * Pulsing Dots Loader
 */
export const PulsingDots = ({ 
  color = "blue-primary", 
  size = "medium",
  className = "" 
}) => {
  const sizes = {
    small: "w-1 h-1",
    medium: "w-2 h-2",
    large: "w-3 h-3"
  };

  return (
    <div className={`flex space-x-1 justify-center items-center ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${sizes[size]} bg-${color} rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.1
          }}
        />
      ))}
    </div>
  );
};

/**
 * Progress Bar
 */
export const ProgressBar = ({ 
  progress = 0, 
  className = "",
  showPercentage = false,
  color = "blue",
  height = "h-2"
}) => {
  const colors = {
    blue: "bg-blue-primary",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500"
  };

  return (
    <div className={className}>
      <div className={`w-full bg-gray-200 rounded-full ${height}`}>
        <motion.div
          className={`${height} ${colors[color]} rounded-full transition-all duration-300`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-center mt-2 text-sm text-gray-600">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

/**
 * Loading Overlay
 */
export const LoadingOverlay = ({ 
  isVisible = false, 
  message = "Cargando...",
  backdrop = true,
  children,
  spinner = "default"
}) => {
  const SpinnerComponent = {
    default: Spinner,
    dots: PulsingDots
  };

  const CurrentSpinner = SpinnerComponent[spinner] || Spinner;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`
            fixed inset-0 z-50 flex items-center justify-center
            ${backdrop ? 'bg-black bg-opacity-50' : ''}
          `}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white rounded-lg p-8 shadow-xl text-center max-w-sm"
          >
            <CurrentSpinner size="large" className="mb-4" />
            <p className="text-gray-700 font-medium">{message}</p>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Page Transition Loader
 */
export const PageTransitionLoader = ({ isLoading = false }) => (
  <AnimatePresence>
    {isLoading && (
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        exit={{ scaleX: 0 }}
        className="fixed top-0 left-0 right-0 h-1 bg-blue-primary origin-left z-50"
        style={{ transformOrigin: '0%' }}
      />
    )}
  </AnimatePresence>
);

/**
 * Lazy Loading Wrapper with Skeleton
 */
export const LazyWrapper = ({ 
  isLoading, 
  skeleton, 
  children, 
  fallback,
  error 
}) => {
  if (error) {
    return fallback || (
      <div className="p-8 text-center text-red-600">
        Error al cargar contenido
      </div>
    );
  }

  if (isLoading) {
    return skeleton || <SkeletonCard />;
  }

  return children;
};

/**
 * Infinite Loading Component
 */
export const InfiniteLoader = ({ 
  hasMore = true, 
  isLoading = false,
  onLoadMore,
  threshold = 100 
}) => {
  const loaderRef = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading && onLoadMore) {
          onLoadMore();
        }
      },
      { rootMargin: `${threshold}px` }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, isLoading, onLoadMore, threshold]);

  if (!hasMore) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay más contenido para cargar
      </div>
    );
  }

  return (
    <div ref={loaderRef} className="flex justify-center py-8">
      {isLoading ? (
        <Spinner size="medium" />
      ) : (
        <div className="text-gray-500">Cargando más contenido...</div>
      )}
    </div>
  );
};

/**
 * Hook para manejar estados de carga
 */
export const useLoadingState = (initialState = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState);
  const [error, setError] = React.useState(null);

  const startLoading = React.useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const stopLoading = React.useCallback(() => {
    setIsLoading(false);
  }, []);

  const setLoadingError = React.useCallback((error) => {
    setIsLoading(false);
    setError(error);
  }, []);

  const reset = React.useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
    reset
  };
};

/**
 * CSS personalizado para animaciones (a incluir en index.css)
 */
export const loadingStyles = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .animate-shimmer {
    animation: shimmer 1.5s ease-in-out infinite;
    background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
    background-size: 200% 100%;
  }

  .bg-size-200 { background-size: 200% 100%; }
  .bg-pos-0 { background-position: -200% 0; }
`;

export default {
  SkeletonBase,
  SkeletonText,
  SkeletonCard,
  SkeletonHero,
  SkeletonServicesGrid,
  SkeletonNavigation,
  Spinner,
  PulsingDots,
  ProgressBar,
  LoadingOverlay,
  PageTransitionLoader,
  LazyWrapper,
  InfiniteLoader,
  useLoadingState
};