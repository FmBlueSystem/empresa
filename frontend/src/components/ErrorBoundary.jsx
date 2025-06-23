import React from 'react';

/**
 * Enhanced Error Boundary
 * Manejo avanzado de errores con logging y recuperación
 * Fase 3: User Experience Enhancements
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Actualizar state para mostrar UI de fallback
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log del error con contexto detallado
    this.logError(error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
  }

  logError = (error, errorInfo) => {
    const { component = 'Unknown', fallbackComponent = 'ErrorFallback' } = this.props;
    
    // Información del error
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      component,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      errorId: this.state.errorId,
      retryCount: this.state.retryCount
    };

    // Log local para desarrollo
    if (import.meta.env.DEV) {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.log('Error Data:', errorData);
      console.groupEnd();
    }

    // Reportar a Google Analytics si está disponible
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: `${component}: ${error.message}`,
        fatal: false,
        error_id: this.state.errorId,
        component_name: component
      });
    }

    // Enviar a servicio de logging
    this.sendErrorToService(errorData);
  };

  sendErrorToService = async (errorData) => {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorData)
      });
    } catch (err) {
      // Silently fail - no queremos errores en el error boundary
      console.warn('Failed to send error to logging service:', err);
    }
  };

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { 
        fallbackComponent: FallbackComponent,
        level = 'component', // 'page', 'component', 'section'
        showDetails = false 
      } = this.props;

      // Si se proporciona un componente de fallback personalizado
      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            onRetry={this.handleRetry}
            onReload={this.handleReload}
            retryCount={this.state.retryCount}
          />
        );
      }

      // Fallback UI por defecto basado en el nivel
      return this.renderDefaultFallback(level, showDetails);
    }

    return this.props.children;
  }

  renderDefaultFallback(level, showDetails) {
    const { error, errorInfo, retryCount } = this.state;

    const baseClasses = "flex flex-col items-center justify-center text-center p-6";
    const levelStyles = {
      page: `${baseClasses} min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50`,
      component: `${baseClasses} min-h-[300px] bg-gray-50 rounded-lg border border-gray-200`,
      section: `${baseClasses} min-h-[200px] bg-gray-50 rounded border border-gray-100`
    };

    const iconSizes = {
      page: "w-16 h-16",
      component: "w-12 h-12", 
      section: "w-8 h-8"
    };

    const titleSizes = {
      page: "text-2xl",
      component: "text-xl",
      section: "text-lg"
    };

    return (
      <div className={levelStyles[level]}>
        {/* Icono de error */}
        <div className={`${iconSizes[level]} text-red-500 mb-4`}>
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Título */}
        <h2 className={`${titleSizes[level]} font-bold text-gray-900 mb-2`}>
          {level === 'page' ? 'Oops! Algo salió mal' : 'Error al cargar contenido'}
        </h2>

        {/* Descripción */}
        <p className="text-gray-600 mb-6 max-w-md">
          {level === 'page' 
            ? 'Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado y está trabajando para solucionarlo.'
            : 'Hubo un problema cargando esta sección. Puedes intentar nuevamente.'
          }
        </p>

        {/* Acciones */}
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={this.handleRetry}
            className="px-4 py-2 bg-blue-primary text-white rounded-md hover:bg-blue-600 transition-colors"
            disabled={retryCount >= 3}
          >
            {retryCount >= 3 ? 'Muchos intentos' : 'Intentar nuevamente'}
          </button>

          {level === 'page' && (
            <button
              onClick={this.handleReload}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Recargar página
            </button>
          )}

          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-transparent text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Volver atrás
          </button>
        </div>

        {/* Detalles del error (solo en desarrollo) */}
        {showDetails && import.meta.env.DEV && (
          <details className="mt-6 max-w-2xl w-full">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Detalles técnicos
            </summary>
            <div className="mt-2 p-4 bg-gray-100 rounded text-left text-xs font-mono overflow-auto">
              <div className="mb-2">
                <strong>Error:</strong> {error?.message}
              </div>
              <div className="mb-2">
                <strong>Stack:</strong>
                <pre className="whitespace-pre-wrap">{error?.stack}</pre>
              </div>
              {errorInfo && (
                <div>
                  <strong>Component Stack:</strong>
                  <pre className="whitespace-pre-wrap">{errorInfo.componentStack}</pre>
                </div>
              )}
            </div>
          </details>
        )}

        {/* Error ID para soporte */}
        <div className="mt-4 text-xs text-gray-400">
          Error ID: {this.state.errorId}
        </div>
      </div>
    );
  }
}

/**
 * HOC para envolver componentes con Error Boundary
 */
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary 
      component={Component.displayName || Component.name}
      {...errorBoundaryProps}
    >
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

/**
 * Hook para reportar errores manualmente
 */
export const useErrorReporting = () => {
  const reportError = React.useCallback((error, context = {}) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      context,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      type: 'manual_report'
    };

    // Log local
    console.error('Manual error report:', error, context);

    // Reportar a analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: `Manual: ${error.message}`,
        fatal: false,
        context: JSON.stringify(context)
      });
    }

    // Enviar a servicio
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorData)
    }).catch(() => {
      // Silently fail
    });
  }, []);

  return { reportError };
};

/**
 * Componente de Fallback personalizado para diferentes casos
 */
export const CustomErrorFallback = ({ 
  error, 
  onRetry, 
  onReload, 
  title = "Error inesperado",
  description = "Algo salió mal. Por favor intenta nuevamente.",
  actions = ['retry', 'reload', 'back']
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 text-red-500 mb-4">
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      
      <div className="flex gap-3">
        {actions.includes('retry') && (
          <button onClick={onRetry} className="btn-primary">
            Reintentar
          </button>
        )}
        
        {actions.includes('reload') && (
          <button onClick={onReload} className="btn-secondary">
            Recargar
          </button>
        )}
        
        {actions.includes('back') && (
          <button onClick={() => window.history.back()} className="btn-secondary">
            Volver
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorBoundary;