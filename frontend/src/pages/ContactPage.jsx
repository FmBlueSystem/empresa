import React from 'react';
import PageHeader from '../components/PageHeader';
import ContactForm from '../components/ContactForm';

/**
 * Página ContactPage - Contacto de BlueSystem.io
 * Diseño moderno con formulario funcional y información de contacto
 */
const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section Mejorada */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white overflow-hidden">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse"></div>
        </div>
        
        <div className="relative container-custom py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Hablemos de tu Proyecto
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed animate-slide-up">
              ¿Listo para transformar tu negocio? Nuestros expertos están aquí para convertir tu visión en realidad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2 text-blue-100">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Respuesta en 24 horas
              </div>
              <div className="flex items-center gap-2 text-blue-100">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Análisis profesional
              </div>
              <div className="flex items-center gap-2 text-blue-100">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Experiencia comprobada
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-blue-50" fill="currentColor" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
          </svg>
        </div>
      </section>

      {/* Contenido principal */}
      <main className="relative py-20">
        <div className="container-custom">
          
          {/* Grid principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
            
            {/* Información de contacto */}
            <div className="space-y-10">
              <div className="text-center lg:text-left">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Múltiples Formas
                  </span>
                  <br />de Conectar
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed animate-slide-up max-w-lg mx-auto lg:mx-0">
                  Elige la opción que más te convenga. Estamos aquí para escucharte y crear soluciones extraordinarias juntos.
                </p>
              </div>

              {/* Métodos de contacto modernizados */}
              <div className="space-y-6">
                {/* Email Card */}
                <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300 animate-slide-up overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        Correo Electrónico
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        Perfecto para consultas detalladas, presupuestos y documentación técnica.
                      </p>
                      <a 
                        href="mailto:contacto@bluesystem.io" 
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors duration-300"
                      >
                        contacto@bluesystem.io
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-green-200 transition-all duration-300 animate-slide-up overflow-hidden" style={{ animationDelay: '0.1s' }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                        Llamada Directa
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        Para consultas urgentes y asesoría inmediata con nuestros especialistas.
                      </p>
                      <a 
                        href="tel:+50672192010" 
                        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-lg transition-colors duration-300"
                      >
                        +506 7219-2010
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-purple-200 transition-all duration-300 animate-slide-up overflow-hidden" style={{ animationDelay: '0.2s' }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                        Nuestra Oficina
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        Visítanos para reuniones presenciales y workshops colaborativos.
                      </p>
                      <div className="space-y-2">
                        <p className="text-purple-600 font-semibold text-lg">
                          San José, Costa Rica
                        </p>
                        <p className="text-gray-500 text-sm">
                          Citas disponibles de lunes a viernes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horarios mejorados */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-2xl border border-gray-100 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Horarios de Atención</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="font-medium text-gray-700">Lunes - Viernes:</span>
                    <span className="font-bold text-blue-600">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="font-medium text-gray-700">Sábados:</span>
                    <span className="font-bold text-green-600">10:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="font-medium text-gray-700">Domingos:</span>
                    <span className="font-bold text-gray-400">Cerrado</span>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800 font-medium">
                      💡 Para emergencias técnicas, contamos con soporte 24/7
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario de contacto funcional */}
            <div className="space-y-10">
              <div className="text-center lg:text-left">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Cuéntanos tu Idea
                  </span>
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Completa el formulario y nuestro equipo de expertos se pondrá en contacto contigo en las próximas 24 horas para comenzar a dar vida a tu proyecto.
                </p>
              </div>
              
              <ContactForm className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 hover:shadow-3xl transition-shadow duration-300" />
            </div>
          </div>

          {/* Sección FAQ */}
          <div className="mt-24 max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Preguntas Frecuentes
                </span>
              </h2>
              <p className="text-xl text-gray-600">
                Resolvemos las dudas más comunes sobre nuestros servicios
              </p>
            </div>

            <div className="space-y-4">
              {/* FAQ Item 1 */}
              <details className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <summary className="flex justify-between items-center w-full p-8 text-left cursor-pointer hover:bg-gray-50 transition-colors">
                  <h3 className="text-xl font-semibold text-gray-900 group-open:text-blue-600">
                    ¿Cuánto tiempo toma implementar una solución SAP?
                  </h3>
                  <svg className="w-6 h-6 text-gray-400 group-open:rotate-180 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </summary>
                <div className="px-8 pb-8">
                  <p className="text-gray-600 leading-relaxed">
                    El tiempo de implementación varía según la complejidad del proyecto. Para módulos básicos, entre 3-6 meses. Para implementaciones completas, entre 8-18 meses. Realizamos un análisis detallado para darte un cronograma preciso.
                  </p>
                </div>
              </details>

              {/* FAQ Item 2 */}
              <details className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <summary className="flex justify-between items-center w-full p-8 text-left cursor-pointer hover:bg-gray-50 transition-colors">
                  <h3 className="text-xl font-semibold text-gray-900 group-open:text-blue-600">
                    ¿Ofrecen soporte post-implementación?
                  </h3>
                  <svg className="w-6 h-6 text-gray-400 group-open:rotate-180 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </summary>
                <div className="px-8 pb-8">
                  <p className="text-gray-600 leading-relaxed">
                    Sí, ofrecemos soporte técnico 24/7, actualizaciones regulares, capacitación continua y mantenimiento preventivo. Nuestro equipo se convierte en una extensión de tu empresa para garantizar el éxito a largo plazo.
                  </p>
                </div>
              </details>

              {/* FAQ Item 3 */}
              <details className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <summary className="flex justify-between items-center w-full p-8 text-left cursor-pointer hover:bg-gray-50 transition-colors">
                  <h3 className="text-xl font-semibold text-gray-900 group-open:text-blue-600">
                    ¿Pueden integrar sistemas existentes?
                  </h3>
                  <svg className="w-6 h-6 text-gray-400 group-open:rotate-180 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </summary>
                <div className="px-8 pb-8">
                  <p className="text-gray-600 leading-relaxed">
                    Absolutamente. Somos expertos en integraciones complejas. Conectamos SAP con Office 365, sistemas legacy, APIs externas y cualquier herramienta que tu empresa utilice. Mantenemos la continuidad operativa durante todo el proceso.
                  </p>
                </div>
              </details>

              {/* FAQ Item 4 */}
              <details className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <summary className="flex justify-between items-center w-full p-8 text-left cursor-pointer hover:bg-gray-50 transition-colors">
                  <h3 className="text-xl font-semibold text-gray-900 group-open:text-blue-600">
                    ¿Qué incluye la consultoría inicial?
                  </h3>
                  <svg className="w-6 h-6 text-gray-400 group-open:rotate-180 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </summary>
                <div className="px-8 pb-8">
                  <p className="text-gray-600 leading-relaxed">
                    La consultoría inicial incluye: análisis completo de procesos actuales, identificación de oportunidades de mejora, roadmap tecnológico personalizado, estimación de ROI y plan de implementación detallado.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;