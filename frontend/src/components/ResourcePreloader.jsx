import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente ResourcePreloader
 * Optimiza la carga de recursos críticos y preload de rutas
 * Fase 2: Optimización de Performance
 */
const ResourcePreloader = () => {
  const location = useLocation();

  useEffect(() => {
    // Preload de recursos críticos
    const preloadCriticalResources = () => {
      const criticalResources = [
        // Fuentes críticas
        {
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap',
          as: 'style',
          type: 'text/css'
        },
        // Imágenes del hero críticas
        {
          href: '/assets/hero-bg.webp',
          as: 'image',
          type: 'image/webp'
        },
        {
          href: '/assets/hero-bg.jpg',
          as: 'image',
          type: 'image/jpeg'
        },
        // Logo y favicon
        {
          href: '/bluesystem-icon.svg',
          as: 'image',
          type: 'image/svg+xml'
        }
      ];

      criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        if (resource.type) link.type = resource.type;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    };

    // Prefetch de rutas principales basado en la ubicación actual
    const prefetchRoutes = () => {
      const routePrefetchMap = {
        '/': ['/servicios', '/casos-de-exito', '/contacto'],
        '/servicios': ['/servicios/sap', '/servicios/ia', '/casos-de-exito'],
        '/casos-de-exito': ['/contacto', '/servicios'],
        '/contacto': ['/servicios', '/sobre-nosotros']
      };

      const currentRoute = location.pathname;
      const routesToPrefetch = routePrefetchMap[currentRoute] || [];

      routesToPrefetch.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    };

    // DNS prefetch para dominios externos
    const prefetchDNS = () => {
      const externalDomains = [
        'https://www.google-analytics.com',
        'https://www.googletagmanager.com',
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
      ];

      externalDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      });
    };

    // Ejecutar optimizaciones
    preloadCriticalResources();
    prefetchRoutes();
    prefetchDNS();

    // Preconnect para recursos críticos
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

  }, [location.pathname]);

  // Optimización de imágenes - crear WebP variants
  useEffect(() => {
    const createWebPVariants = () => {
      // Solo en navegadores que soportan WebP
      const supportsWebP = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      };

      if (supportsWebP()) {
        // Preload de imágenes WebP críticas
        const webpImages = [
          '/assets/services-bg.webp',
          '/assets/about-team.webp',
          '/assets/success-stories.webp'
        ];

        webpImages.forEach(src => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = src;
          link.as = 'image';
          link.type = 'image/webp';
          document.head.appendChild(link);
        });
      }
    };

    createWebPVariants();
  }, []);

  return null; // Este componente no renderiza nada visual
};

/**
 * Componente CriticalCSS
 * Inlinea CSS crítico y lazy load el resto
 */
export const CriticalCSS = () => {
  useEffect(() => {
    // CSS crítico que debe cargarse inmediatamente
    const criticalCSS = `
      /* CSS Crítico - Above the fold */
      .btn-primary {
        @apply inline-flex items-center px-6 py-3 bg-blue-primary text-white font-semibold rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl;
      }
      
      .btn-secondary {
        @apply inline-flex items-center px-6 py-3 bg-transparent text-blue-primary border-2 border-blue-primary font-semibold rounded-lg hover:bg-blue-primary hover:text-white transition-all duration-200;
      }
      
      .container-custom {
        @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
      }
      
      .section-padding {
        @apply py-16 sm:py-24;
      }
      
      .text-gradient {
        @apply bg-gradient-to-r from-blue-primary to-purple-600 bg-clip-text text-transparent;
      }

      /* Loading spinner crítico */
      .loading-spinner {
        @apply flex flex-col items-center justify-center min-h-screen;
      }
      
      .spinner {
        @apply animate-spin rounded-full h-12 w-12 border-b-2 border-blue-primary;
      }
    `;

    // Crear style tag e insertar CSS crítico
    const style = document.createElement('style');
    style.innerHTML = criticalCSS;
    style.id = 'critical-css';
    document.head.appendChild(style);

    // Lazy load del CSS no crítico
    setTimeout(() => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/assets/styles/non-critical.css';
      link.media = 'all';
      document.head.appendChild(link);
    }, 100);

  }, []);

  return null;
};

/**
 * Componente ServiceWorkerLoader
 * Registra el service worker para caching
 */
export const ServiceWorkerLoader = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nueva versión disponible
                if (confirm('Nueva versión disponible. ¿Actualizar?')) {
                  window.location.reload();
                }
              }
            });
          });
        })
        .catch((error) => {
        });
    }
  }, []);

  return null;
};

/**
 * Hook para preload inteligente basado en user behavior
 */
export const useSmartPreload = () => {
  useEffect(() => {
    let mouseTimer;
    let touchTimer;

    // Preload al hover (desktop)
    const handleMouseEnter = (e) => {
      const link = e.target.closest('a[href]');
      if (link && link.href.startsWith(window.location.origin)) {
        mouseTimer = setTimeout(() => {
          const preloadLink = document.createElement('link');
          preloadLink.rel = 'prefetch';
          preloadLink.href = link.href;
          document.head.appendChild(preloadLink);
        }, 200); // Delay para evitar preloads innecesarios
      }
    };

    // Preload al touch start (mobile)
    const handleTouchStart = (e) => {
      const link = e.target.closest('a[href]');
      if (link && link.href.startsWith(window.location.origin)) {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'prefetch';
        preloadLink.href = link.href;
        document.head.appendChild(preloadLink);
      }
    };

    const handleMouseLeave = () => {
      clearTimeout(mouseTimer);
    };

    // Event listeners
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);
    document.addEventListener('touchstart', handleTouchStart, true);

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      document.removeEventListener('touchstart', handleTouchStart, true);
      clearTimeout(mouseTimer);
    };
  }, []);
};

export default ResourcePreloader;