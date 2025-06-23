import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Proveedor de Accesibilidad WCAG 2.1 AA
 * Implementa controles de accesibilidad según Fase 2: Profesionalismo Avanzado
 */

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility debe usarse dentro de AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    highContrast: false,
    reducedMotion: false,
    fontSize: 'normal', // small, normal, large, xl
    focusIndicator: true,
    screenReader: false
  });

  const [isToolbarOpen, setIsToolbarOpen] = useState(false);

  // Detectar preferencias del sistema
  useEffect(() => {
    // Detectar preferencia de movimiento reducido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Detectar contraste alto
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    // Detectar si usa screen reader
    const hasScreenReader = navigator.userAgent.includes('NVDA') || 
                            navigator.userAgent.includes('JAWS') || 
                            window.speechSynthesis;

    setSettings(prev => ({
      ...prev,
      reducedMotion: prefersReducedMotion,
      highContrast: prefersHighContrast,
      screenReader: !!hasScreenReader
    }));

    // Aplicar configuraciones iniciales
    applyAccessibilitySettings({
      ...settings,
      reducedMotion: prefersReducedMotion,
      highContrast: prefersHighContrast
    });
  }, []);

  // Aplicar configuraciones de accesibilidad
  const applyAccessibilitySettings = (newSettings) => {
    const root = document.documentElement;
    
    // Contraste alto
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Movimiento reducido
    if (newSettings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Tamaño de fuente
    root.classList.remove('font-small', 'font-normal', 'font-large', 'font-xl');
    root.classList.add(`font-${newSettings.fontSize}`);

    // Indicador de foco
    if (newSettings.focusIndicator) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }

    // Anunciar cambios a screen readers
    if (newSettings.screenReader) {
      announceToScreenReader('Configuración de accesibilidad actualizada');
    }
  };

  // Función para anunciar a screen readers
  const announceToScreenReader = (message) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  // Actualizar configuración
  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applyAccessibilitySettings(newSettings);
    
    // Guardar en localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
  };

  // Cargar configuración guardada
  useEffect(() => {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        setSettings(parsedSettings);
        applyAccessibilitySettings(parsedSettings);
      } catch (error) {
        console.warn('Error cargando configuración de accesibilidad:', error);
      }
    }
  }, []);

  // Atajos de teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Alt + A: Abrir toolbar de accesibilidad
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        setIsToolbarOpen(!isToolbarOpen);
        announceToScreenReader(`Herramientas de accesibilidad ${isToolbarOpen ? 'cerradas' : 'abiertas'}`);
      }
      
      // Alt + C: Toggle contraste alto
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        updateSetting('highContrast', !settings.highContrast);
      }
      
      // Alt + M: Toggle movimiento reducido
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        updateSetting('reducedMotion', !settings.reducedMotion);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isToolbarOpen, settings]);

  const value = {
    settings,
    updateSetting,
    announceToScreenReader,
    isToolbarOpen,
    setIsToolbarOpen
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      <AccessibilityToolbar />
    </AccessibilityContext.Provider>
  );
};

// Toolbar de accesibilidad
const AccessibilityToolbar = () => {
  const { settings, updateSetting, isToolbarOpen, setIsToolbarOpen } = useAccessibility();

  const fontSizes = [
    { value: 'small', label: 'Pequeño', size: '14px' },
    { value: 'normal', label: 'Normal', size: '16px' },
    { value: 'large', label: 'Grande', size: '18px' },
    { value: 'xl', label: 'Extra Grande', size: '20px' }
  ];

  return (
    <>
      {/* Botón de accesibilidad flotante */}
      <motion.button
        className="fixed top-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        onClick={() => setIsToolbarOpen(!isToolbarOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Abrir herramientas de accesibilidad (Alt + A)"
        title="Herramientas de accesibilidad"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
      </motion.button>

      {/* Panel de accesibilidad */}
      <AnimatePresence>
        {isToolbarOpen && (
          <motion.div
            className="fixed top-16 right-4 z-40 bg-white border border-gray-200 rounded-lg shadow-xl p-6 w-80 max-h-96 overflow-y-auto"
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Accesibilidad
              </h3>
              <button
                onClick={() => setIsToolbarOpen(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                aria-label="Cerrar herramientas de accesibilidad"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Contraste alto */}
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Contraste alto
                </span>
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={(e) => updateSetting('highContrast', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  aria-describedby="contrast-help"
                />
              </label>
              <p id="contrast-help" className="text-xs text-gray-500">
                Mejora la legibilidad con colores de alto contraste
              </p>

              {/* Movimiento reducido */}
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Reducir animaciones
                </span>
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  aria-describedby="motion-help"
                />
              </label>
              <p id="motion-help" className="text-xs text-gray-500">
                Reduce las animaciones para evitar mareos
              </p>

              {/* Tamaño de fuente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamaño de texto
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {fontSizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => updateSetting('fontSize', size.value)}
                      className={`p-2 text-xs border rounded-md transition-colors ${
                        settings.fontSize === size.value
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                      style={{ fontSize: size.size }}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Indicador de foco */}
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Foco mejorado
                </span>
                <input
                  type="checkbox"
                  checked={settings.focusIndicator}
                  onChange={(e) => updateSetting('focusIndicator', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  aria-describedby="focus-help"
                />
              </label>
              <p id="focus-help" className="text-xs text-gray-500">
                Resalta mejor los elementos enfocados
              </p>
            </div>

            {/* Atajos de teclado */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Atajos de teclado
              </h4>
              <ul className="text-xs text-gray-500 space-y-1">
                <li><kbd>Alt + A</kbd>: Abrir/cerrar panel</li>
                <li><kbd>Alt + C</kbd>: Toggle contraste</li>
                <li><kbd>Alt + M</kbd>: Toggle animaciones</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccessibilityProvider; 