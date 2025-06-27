import React, { useEffect, useCallback } from 'react';
import { onLCP, onFID, onCLS, onFCP, onTTFB } from 'web-vitals';

/**
 * Web Vitals Monitor
 * Monitorea y reporta Core Web Vitals en tiempo real
 * Fase 3: User Experience Enhancements
 */
const WebVitalsMonitor = ({ 
  reportToAnalytics = true,
  logToConsole = false,
  threshold = {
    LCP: 2500,    // Largest Contentful Paint
    FID: 100,     // First Input Delay
    CLS: 0.1,     // Cumulative Layout Shift
    FCP: 1800,    // First Contentful Paint
    TTFB: 800     // Time to First Byte
  }
}) => {
  
  const getRating = useCallback((name, value) => {
    const thresholds = {
      LCP: { good: 2500, needs_improvement: 4000 },
      FID: { good: 100, needs_improvement: 300 },
      CLS: { good: 0.1, needs_improvement: 0.25 },
      FCP: { good: 1800, needs_improvement: 3000 },
      TTFB: { good: 800, needs_improvement: 1800 }
    };
    const metricThresholds = thresholds[name] || { good: 0, needs_improvement: 0 };
    if (value <= metricThresholds.good) return 'good';
    if (value <= metricThresholds.needs_improvement) return 'needs-improvement';
    return 'poor';
  }, []);

  const sendToCustomEndpoint = useCallback(async (metric, rating) => {
    if (!import.meta.env.PROD) return;

    try {
      await fetch('/api/analytics/web-vitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          metric: metric.name,
          value: metric.value,
          delta: metric.delta,
          rating,
          url: window.location.pathname,
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
          sessionId: getSessionId()
        })
      });
    } catch (error) {
      // Silently fail - no interrumpir experiencia del usuario
    }
  }, []);

  const getSessionId = useCallback(() => {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }, []);

  const analyzeResourceTiming = useCallback((resources) => {
    const stats = {
      script: { count: 0, totalSize: 0, avgDuration: 0 },
      stylesheet: { count: 0, totalSize: 0, avgDuration: 0 },
      image: { count: 0, totalSize: 0, avgDuration: 0 },
      fetch: { count: 0, totalSize: 0, avgDuration: 0 }
    };

    resources.forEach(resource => {
      const type = getResourceType(resource);
      if (stats[type]) {
        stats[type].count++;
        stats[type].totalSize += resource.transferSize || 0;
        stats[type].avgDuration += resource.duration;
      }
    });

    // Calcular promedios
    Object.values(stats).forEach(stat => {
      if (stat.count > 0) {
        stat.avgDuration = stat.avgDuration / stat.count;
      }
    });

    return stats;
  }, []);

  const getResourceType = useCallback((resource) => {
    const initiatorType = resource.initiatorType;
    
    if (initiatorType === 'script') return 'script';
    if (initiatorType === 'link' || initiatorType === 'css') return 'stylesheet';
    if (initiatorType === 'img') return 'image';
    if (initiatorType === 'fetch' || initiatorType === 'xmlhttprequest') return 'fetch';
    
    return 'other';
  }, []);

  const registerCustomMetrics = useCallback(() => {
    // Navigation Timing
    if ('PerformanceObserver' in window) {
      try {
        // Observer para navigation timing
        const navObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              const metrics = {
                dns_lookup: entry.domainLookupEnd - entry.domainLookupStart,
                tcp_connect: entry.connectEnd - entry.connectStart,
                tls_handshake: entry.secureConnectionStart > 0 ? 
                  entry.connectEnd - entry.secureConnectionStart : 0,
                server_response: entry.responseStart - entry.requestStart,
                dom_content_loaded: entry.domContentLoadedEventEnd - entry.navigationStart,
                window_load: entry.loadEventEnd - entry.navigationStart
              };

              // Reportar métricas de navegación
              Object.entries(metrics).forEach(([name, value]) => {
                if (value > 0) {
                  window.dispatchEvent(new CustomEvent('customMetricMeasured', {
                    detail: {
                      name: `navigation_${name}`,
                      value,
                      timestamp: Date.now()
                    }
                  }));
                }
              });
            }
          }
        });

        navObserver.observe({ entryTypes: ['navigation'] });

        // Observer para resource timing
        const resourceObserver = new PerformanceObserver((list) => {
          const resources = list.getEntries();
          const resourceStats = analyzeResourceTiming(resources);
          
          // Reportar estadísticas de recursos
          Object.entries(resourceStats).forEach(([type, stats]) => {
            window.dispatchEvent(new CustomEvent('resourceStatsUpdated', {
              detail: {
                resourceType: type,
                stats,
                timestamp: Date.now()
              }
            }));
          });
        });

        resourceObserver.observe({ entryTypes: ['resource'] });

      } catch (error) {
      }
    }

    // Long Tasks Observer
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            // Tasks que duran más de 50ms
            if (entry.duration > 50) {
              window.dispatchEvent(new CustomEvent('longTaskDetected', {
                detail: {
                  duration: entry.duration,
                  startTime: entry.startTime,
                  timestamp: Date.now()
                }
              }));

              // Reportar a analytics si es significativo (>100ms)
              if (entry.duration > 100 && typeof gtag !== 'undefined') {
                gtag('event', 'long_task', {
                  event_category: 'Performance',
                  event_label: 'main_thread_blocking',
                  value: Math.round(entry.duration),
                  custom_map: {
                    task_duration: 'metric3'
                  }
                });
              }
            }
          }
        });

        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (error) {
      }
    }
  }, [analyzeResourceTiming, getResourceType]); // Dependencies for useCallback

  const handleMetric = useCallback((metric) => {
    const { name, value, delta, id, entries } = metric;

    // Determinar rating basado en thresholds
    const rating = getRating(name, value);

    // Reportar a Google Analytics si está disponible
    if (reportToAnalytics && typeof gtag !== 'undefined') {
      gtag('event', name, {
        event_category: 'Web Vitals',
        event_label: id,
        value: Math.round(value),
        custom_map: {
          metric_id: 'dimension1',
          metric_value: 'metric1',
          metric_delta: 'metric2'
        }
      });

      // Event personalizado con más detalle
      gtag('event', 'web_vitals_detailed', {
        event_category: 'Performance',
        metric_name: name,
        metric_value: value,
        metric_delta: delta,
        metric_rating: rating,
        metric_id: id,
        page_url: window.location.pathname
      });
    }

    // Dispatch custom event para otros listeners
    window.dispatchEvent(new CustomEvent('webVitalMeasured', {
      detail: {
        name,
        value,
        delta,
        rating,
        id,
        entries,
        timestamp: Date.now()
      }
    }));

    // Enviar a endpoint personalizado si está configurado
    sendToCustomEndpoint(metric, rating);
  }, [logToConsole, reportToAnalytics, getRating, sendToCustomEndpoint, getSessionId]); // Added dependencies

  useEffect(() => {
    // Initialize web-vitals monitoring
    onLCP(handleMetric);
    onFID(handleMetric);
    onCLS(handleMetric);
    onFCP(handleMetric);
    onTTFB(handleMetric);

    // Register custom metrics
    registerCustomMetrics();

    // Cleanup function
    return () => {
      // The web-vitals library automatically cleans up observers.
      // No explicit cleanup needed here for web-vitals functions.
    };
  }, [handleMetric, registerCustomMetrics]);

  // Este componente no renderiza nada visible
  return null;
};

/**
 * Hook para acceder a métricas de Web Vitals en componentes
 */
export const useWebVitals = () => {
  const [metrics, setMetrics] = React.useState({});
  const [customMetrics, setCustomMetrics] = React.useState({});

  React.useEffect(() => {
    const handleWebVital = (event) => {
      setMetrics(prev => ({
        ...prev,
        [event.detail.name]: event.detail
      }));
    };

    const handleCustomMetric = (event) => {
      setCustomMetrics(prev => ({
        ...prev,
        [event.detail.name]: event.detail
      }));
    };

    window.addEventListener('webVitalMeasured', handleWebVital);
    window.addEventListener('customMetricMeasured', handleCustomMetric);

    return () => {
      window.removeEventListener('webVitalMeasured', handleWebVital);
      window.removeEventListener('customMetricMeasured', handleCustomMetric);
    };
  }, []);

  return { metrics, customMetrics };
};

/**
 * Componente de Dashboard para mostrar métricas en desarrollo
 */
export const WebVitalsDashboard = () => {
  const { metrics, customMetrics } = useWebVitals();

  if (!import.meta.env.DEV) {
    return null; // Solo mostrar en desarrollo
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm text-xs border z-50">
      <h3 className="font-bold mb-2 text-blue-600">Web Vitals Monitor</h3>
      
      <div className="space-y-2">
        {Object.entries(metrics).map(([name, data]) => (
          <div key={name} className="flex justify-between items-center">
            <span className="font-medium">{name}:</span>
            <div className="text-right">
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                data.rating === 'good' ? 'bg-green-500' :
                data.rating === 'needs-improvement' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></span>
              <span>{data.value.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      {Object.keys(customMetrics).length > 0 && (
        <>
          <hr className="my-2" />
          <h4 className="font-semibold text-gray-600">Custom Metrics</h4>
          <div className="space-y-1 text-xs">
            {Object.entries(customMetrics).map(([name, data]) => (
              <div key={name} className="flex justify-between">
                <span>{name.replace('navigation_', '')}:</span>
                <span>{data.value.toFixed(0)}ms</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WebVitalsMonitor;