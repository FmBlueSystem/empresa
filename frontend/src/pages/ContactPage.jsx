import React from 'react';
import PageHeader from '../components/PageHeader';
import ContactForm from '../components/ContactForm';

/**
 * Página ContactPage - Contacto de BlueSystem.io (placeholder)
 * Estructura preparada para formulario de contacto futuro
 */
const ContactPage = () => {
  return (
    <div className="min-h-screen">
      {/* Encabezado de la página */}
      <PageHeader 
        title="El Comando de Operaciones"
        subtitle="Donde se forjan las alianzas que cambian industrias. No vendemos servicios... reclutamos cómplices de disrupción."
        breadcrumb="Inicio"
        showStats={false}
      />

      {/* Contenido principal */}
      <main className="section-padding bg-white">
        <div className="container-custom">
          
          {/* Grid principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            
            {/* Información de contacto */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-dark mb-6 animate-fade-in">
                  El BlueSystem Manifesto
                </h2>
                <div className="text-lg text-gray-600 leading-relaxed animate-slide-up space-y-4">
                  <p><strong>Nosotros no creemos en la evolución... creemos en la revolución.</strong></p>
                  <p>Mientras el mundo implementa "mejores prácticas", nosotros inventamos las prácticas que el mundo seguirá mañana.</p>
                  <p>Tu competencia contrata consultores. Tú estás a punto de aliarte con <strong>arquitectos del futuro</strong>.</p>
                </div>
              </div>

              {/* Métodos de contacto */}
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-xl animate-slide-up">
                  <div className="w-12 h-12 bg-blue-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-dark mb-2">Línea Directa de Disrupción</h3>
                    <p className="text-gray-600 mb-2">Canal prioritario para visionarios</p>
                    <a 
                      href="mailto:contacto@bluesystem.io" 
                      className="text-blue-primary hover:text-blue-secondary transition-colors duration-300 font-medium"
                    >
                      contacto@bluesystem.io
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-green-50 rounded-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-dark mb-2">Hotline Estratégica</h3>
                    <p className="text-gray-600 mb-2">Para emergencias competitivas y dominio urgente</p>
                    <a 
                      href="tel:+525512345678" 
                      className="text-green-600 hover:text-green-700 transition-colors duration-300 font-medium"
                    >
                      +52 55 1234 5678
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-purple-50 rounded-xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-dark mb-2">Centro de Comando</h3>
                    <p className="text-gray-600 mb-2">Donde se planean las revoluciones digitales</p>
                    <p className="text-purple-600 font-medium">
                      Ciudad de México • El Epicentro de LATAM
                    </p>
                  </div>
                </div>
              </div>

              {/* Horarios */}
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-dark mb-4">Horarios de Atención</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Lunes - Viernes:</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábados:</span>
                    <span className="font-medium">10:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingos:</span>
                    <span className="font-medium">Cerrado</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario de contacto funcional */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-dark mb-4">
                  Inicia tu Transformación Digital
                </h2>
                <p className="text-gray-600 mb-8">
                  Completa el formulario y nuestro equipo te contactará en las próximas 24 horas 
                  para discutir cómo podemos revolucionar tu empresa.
                </p>
                
                <ContactForm className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100" />
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-dark mb-4">
                    Portal de Reclutamiento Elite
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Estamos forjando una interfaz de IA que evaluará tu potencial disruptivo 
                    y te emparejará con el arquitecto de revoluciones que tu empresa necesita. 
                    Solo los visionarios pasarán el filtro.
                  </p>

                  {/* Características del formulario futuro */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-6 h-6 bg-blue-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">Evaluación de potencial disruptivo</span>
                    </div>
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-6 h-6 bg-blue-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">Matching con especialistas elite</span>
                    </div>
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-6 h-6 bg-blue-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">Estrategia de dominio personalizada</span>
                    </div>
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-6 h-6 bg-blue-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">Intel competitivo en tiempo real</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-4">
                      ¿Tu empresa está lista para dominar? Comienza aquí:
                    </p>
                    <a 
                      href="mailto:contacto@bluesystem.io" 
                      className="btn-primary text-lg px-8 py-3"
                    >
                      Solicitar Audiencia
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;