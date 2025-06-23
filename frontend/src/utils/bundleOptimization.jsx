/**
 * Bundle Optimization Utilities
 * Implementa code splitting inteligente y lazy loading
 * Fase 2: Optimización de Performance
 */

import React, { lazy, Suspense } from 'react';

/**
 * Lazy Loading Component Wrapper
 * Envuelve componentes con lazy loading y loading states
 */
export const createLazyComponent = (
  importFunc, 
  fallback = null,
  errorBoundary = true
) => {
  const LazyComponent = lazy(importFunc);
  
  const WrappedComponent = (props) => {
    const LoadingFallback = fallback || (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-pulse text-center">
          <div className="w-8 h-8 bg-blue-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-blue-200 rounded w-24 mx-auto"></div>
        </div>
      </div>
    );

    if (errorBoundary) {
      return (
        <ErrorBoundary>
          <Suspense fallback={LoadingFallback}>
            <LazyComponent {...props} />
          </Suspense>
        </ErrorBoundary>
      );
    }

    return (
      <Suspense fallback={LoadingFallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };

  WrappedComponent.displayName = `LazyWrapper(${LazyComponent.displayName || 'Component'})`;
  return WrappedComponent;
};

/**
 * Error Boundary para componentes lazy
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lazy component loading error:', error, errorInfo);
    
    // Report to analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: `Lazy loading error: ${error.message}`,
        fatal: false
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error al cargar componente
          </h3>
          <p className="text-gray-600 mb-4">
            Hubo un problema cargando esta sección. Por favor, intenta recargar la página.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Recargar Página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Preload de componentes críticos
 */
export const preloadCriticalComponents = () => {
  const criticalImports = [
    () => import('../components/Hero'),
    () => import('../components/ServicesSection'),
    () => import('../components/Navbar'),
    () => import('../components/Footer')
  ];

  // Preload en idle time
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      criticalImports.forEach(importFunc => {
        importFunc().catch(err => 
          console.warn('Failed to preload component:', err)
        );
      });
    });
  } else {
    // Fallback para navegadores sin soporte
    setTimeout(() => {
      criticalImports.forEach(importFunc => {
        importFunc().catch(err => 
          console.warn('Failed to preload component:', err)
        );
      });
    }, 2000);
  }
};

/**
 * Dynamic Import con retry logic
 */
export const robustImport = (importFunc, maxRetries = 3) => {
  return new Promise((resolve, reject) => {
    let retries = 0;
    
    const attemptImport = () => {
      importFunc()
        .then(resolve)
        .catch(error => {
          retries++;
          
          if (retries <= maxRetries) {
            console.warn(`Import failed, retrying (${retries}/${maxRetries}):`, error);
            
            // Exponential backoff
            setTimeout(attemptImport, Math.pow(2, retries) * 1000);
          } else {
            console.error('Import failed after max retries:', error);
            reject(error);
          }
        });
    };
    
    attemptImport();
  });
};

/**
 * Route-based Code Splitting
 */
export const createLazyRoute = (routePath, importFunc) => {
  return createLazyComponent(
    () => robustImport(importFunc),
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-primary mb-4"></div>
        <p className="text-gray-600">Cargando página...</p>
      </div>
    </div>
  );
};

/**
 * Feature-based Code Splitting
 */
export const createLazyFeature = (featureName, importFunc) => {
  return createLazyComponent(
    () => robustImport(importFunc),
    <div className="p-6 text-center">
      <div className="inline-block animate-pulse">
        <div className="w-6 h-6 bg-blue-200 rounded mx-auto mb-2"></div>
        <div className="h-3 bg-blue-200 rounded w-20"></div>
      </div>
    </div>
  );
};

/**
 * Intersection Observer para lazy loading de secciones
 */
export const useLazySections = () => {
  const [loadedSections, setLoadedSections] = React.useState(new Set());
  
  const observerRef = React.useRef();
  
  React.useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.dataset.sectionId;
            if (sectionId) {
              setLoadedSections(prev => new Set(prev).add(sectionId));
            }
          }
        });
      },
      {
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0.1
      }
    );
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
  
  const registerSection = React.useCallback((element, sectionId) => {
    if (element && observerRef.current) {
      element.dataset.sectionId = sectionId;
      observerRef.current.observe(element);
    }
  }, []);
  
  const unregisterSection = React.useCallback((element) => {
    if (element && observerRef.current) {
      observerRef.current.unobserve(element);
    }
  }, []);
  
  return {
    loadedSections,
    registerSection,
    unregisterSection,
    isLoaded: (sectionId) => loadedSections.has(sectionId)
  };
};

/**
 * Performance monitoring para lazy loading
 */
export const trackLoadingPerformance = (componentName, startTime) => {
  const loadTime = performance.now() - startTime;
  
  // Log performance metrics
  console.log(`Component ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
  
  // Send to analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'timing_complete', {
      name: 'lazy_component_load',
      value: Math.round(loadTime),
      event_category: 'Performance',
      event_label: componentName
    });
  }
  
  // Performance API
  if ('PerformanceObserver' in window) {
    try {
      performance.mark(`${componentName}-loaded`);
      performance.measure(
        `${componentName}-load-time`,
        `${componentName}-start`,
        `${componentName}-loaded`
      );
    } catch (error) {
      console.warn('Performance measurement failed:', error);
    }
  }
};

/**
 * Bundle size optimization utilities
 */
export const optimizeImports = {
  // Only include imports that are actually available
  ReactMarkdown: () => import('react-markdown')
};

/**
 * Webpack bundle analyzer helper
 */
export const analyzeBundleSize = () => {
  if (import.meta.env.DEV) {
    console.group('📦 Bundle Analysis');
    console.log('Main bundle chunks:', performance.getEntriesByType('navigation'));
    console.log('Resource timing:', performance.getEntriesByType('resource'));
    console.groupEnd();
  }
};

/**
 * Resource hints para optimización
 */
export const addResourceHints = () => {
  const hints = [
    { rel: 'prefetch', href: '/assets/fonts/inter-var.woff2' },
    { rel: 'preload', href: '/assets/critical.css', as: 'style' },
    { rel: 'modulepreload', href: '/assets/vendor.js' }
  ];
  
  hints.forEach(hint => {
    const existing = document.querySelector(`link[href="${hint.href}"]`);
    if (!existing) {
      const link = document.createElement('link');
      Object.assign(link, hint);
      document.head.appendChild(link);
    }
  });
};

export default {
  createLazyComponent,
  createLazyRoute,
  createLazyFeature,
  preloadCriticalComponents,
  robustImport,
  useLazySections,
  trackLoadingPerformance,
  optimizeImports,
  analyzeBundleSize,
  addResourceHints
};