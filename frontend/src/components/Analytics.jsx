import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente de Analytics para Google Analytics 4
 * Implementa las recomendaciones del informe para análisis de usuario
 */
const Analytics = () => {
  const location = useLocation();

  // Configuración de Google Analytics
  const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

  useEffect(() => {
    // Solo ejecutar en producción o si GA_MEASUREMENT_ID está configurado
    if (import.meta.env.PROD && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
      // Cargar Google Analytics 4 dinámicamente
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      script.async = true;
      document.head.appendChild(script);

      // Inicializar gtag
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;

      gtag('js', new Date());
      gtag('config', GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
        // Configuraciones de privacidad
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false
      });

      // Limpiar script al desmontar
      return () => {
        const existingScript = document.querySelector(`script[src*="${GA_MEASUREMENT_ID}"]`);
        if (existingScript) {
          document.head.removeChild(existingScript);
        }
      };
    }
  }, []);

  // Trackear cambios de página
  useEffect(() => {
    if (window.gtag && import.meta.env.PROD) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }, [location]);

  return null; // Componente sin renderizado visual
};

/**
 * Funciones de utilidad para tracking de eventos personalizados
 */
export const trackEvent = (eventName, parameters = {}) => {
  if (window.gtag && import.meta.env.PROD) {
    window.gtag('event', eventName, {
      event_category: parameters.category || 'engagement',
      event_label: parameters.label || '',
      value: parameters.value || 0,
      ...parameters
    });
  }
};

export const trackConversion = (conversionName, value = 0, currency = 'MXN') => {
  if (window.gtag && import.meta.env.PROD) {
    window.gtag('event', 'conversion', {
      send_to: `${import.meta.env.VITE_GA_MEASUREMENT_ID}/${conversionName}`,
      value: value,
      currency: currency
    });
  }
};

export const trackUserEngagement = (engagementType, details = {}) => {
  trackEvent('user_engagement', {
    category: 'engagement',
    label: engagementType,
    engagement_type: engagementType,
    ...details
  });
};

// Tracking específico para BlueSystem según el informe
export const trackServiceInterest = (serviceName) => {
  trackEvent('service_interest', {
    category: 'services',
    label: serviceName,
    service_name: serviceName
  });
};

export const trackContactFormSubmit = (formType = 'contact') => {
  trackEvent('form_submit', {
    category: 'lead_generation',
    label: formType,
    form_type: formType
  });
};

export const trackDownload = (fileName, fileType = 'resource') => {
  trackEvent('file_download', {
    category: 'downloads',
    label: fileName,
    file_name: fileName,
    file_type: fileType
  });
};

export const trackQuoteRequest = (serviceType = 'general') => {
  trackEvent('quote_request', {
    category: 'lead_generation',
    label: serviceType,
    service_type: serviceType
  });
};

export const trackNewsletterSignup = (source = 'website') => {
  trackEvent('newsletter_signup', {
    category: 'lead_generation',
    label: source,
    signup_source: source
  });
};

export default Analytics; 