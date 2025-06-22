import React from 'react';
import PageHeader from '../components/PageHeader';

/**
 * Página SuccessStories - Casos de éxito de BlueSystem.io (placeholder)
 * Estructura preparada para futura implementación de casos de éxito reales
 */
const SuccessStories = () => {
  return (
    <div className="min-h-screen">
      {/* Encabezado de la página */}
      <PageHeader 
        title="Casos de Éxito"
        subtitle="Descubre cómo hemos transformado empresas con nuestras soluciones tecnológicas innovadoras"
        breadcrumb="Inicio"
        showStats={false}
      />

      {/* Contenido principal */}
      <main className="section-padding bg-white">
        <div className="container-custom">
          
          {/* Contenido placeholder elegante */}
          <div className="text-center max-w-4xl mx-auto">
            
            {/* Ícono principal */}
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 bg-gradient-primary rounded-full flex items-center justify-center shadow-2xl animate-float">
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>

            {/* Título principal */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-dark mb-6 animate-fade-in">
              Próximamente
            </h2>

            {/* Descripción */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed animate-slide-up">
              Estamos preparando una increíble galería de casos de éxito que muestran 
              cómo nuestras soluciones han transformado empresas de diferentes industrias.
            </p>

            {/* Características futuras */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="p-6 bg-blue-50 rounded-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="w-12 h-12 bg-blue-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-dark mb-2">Estudios Detallados</h3>
                <p className="text-gray-600 text-sm">Análisis profundo de cada implementación y sus resultados medibles</p>
              </div>

              <div className="p-6 bg-green-50 rounded-xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-dark mb-2">Resultados Reales</h3>
                <p className="text-gray-600 text-sm">Métricas concretas de mejora en eficiencia y reducción de costos</p>
              </div>

              <div className="p-6 bg-purple-50 rounded-xl animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-dark mb-2">Testimonios</h3>
                <p className="text-gray-600 text-sm">Palabras directas de nuestros clientes sobre su experiencia</p>
              </div>
            </div>

            {/* Indicadores de progreso */}
            <div className="bg-gray-50 rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-dark mb-6">Lo que estamos preparando</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-primary mb-2">15+</div>
                  <div className="text-sm text-gray-600">Casos documentados</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">5</div>
                  <div className="text-sm text-gray-600">Industrias</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">40%</div>
                  <div className="text-sm text-gray-600">Promedio de mejora</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">100%</div>
                  <div className="text-sm text-gray-600">Satisfacción</div>
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-dark mb-4">
                ¿Quieres ser parte de nuestros casos de éxito?
              </h3>
              <p className="text-gray-600 mb-6">
                Conversemos sobre cómo podemos transformar tu empresa con nuestras soluciones.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contacto" 
                  className="btn-primary text-lg px-8 py-3"
                >
                  Iniciar Proyecto
                </a>
                <a 
                  href="/servicios" 
                  className="btn-secondary text-lg px-8 py-3"
                >
                  Ver Servicios
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuccessStories;