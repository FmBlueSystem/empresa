import React from 'react';

/**
 * Página About - Sobre BlueSystem.io
 * Historia, equipo y filosofía de la empresa con diseño moderno
 */
const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section Moderno */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800 text-white overflow-hidden">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-600 animate-pulse"></div>
        </div>
        
        <div className="relative container-custom py-24 lg:py-32">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              <span className="bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                Los Arquitectos
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
                del Futuro
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed animate-slide-up">
              Conoce a los visionarios que están redefiniendo el panorama tecnológico empresarial y forjando el mañana digital de Costa Rica.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2 text-blue-100">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Innovación disruptiva
              </div>
              <div className="flex items-center gap-2 text-blue-100">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Experiencia mundial
              </div>
              <div className="flex items-center gap-2 text-blue-100">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Resultados comprobados
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
          
          {/* Nuestra historia modernizada */}
          <div className="max-w-5xl mx-auto mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
                Nuestra <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Revolución</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-slide-up">
                La historia de cómo transformamos la frustración en innovación disruptiva
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {/* Card 1 - El Problema */}
              <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-red-200 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">
                    La Frustración
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    <strong>BlueSystem.io nació de una realidad dolorosa:</strong> ver cómo las empresas más brillantes eran limitadas por consultorías tradicionales que implementaban "mejores prácticas" obsoletas.
                  </p>
                </div>
              </div>

              {/* Card 2 - La Decisión */}
              <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    La Revolución
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Mientras el mundo se conformaba con evolución incremental, nosotros decidimos catalizar <strong>revoluciones digitales</strong>. No adaptamos tecnología a procesos antiguos... rediseñamos realidades desde cero.
                  </p>
                </div>
              </div>

              {/* Card 3 - El Resultado */}
              <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-green-200 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                    La Disrupción
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Cada implementación de SAP, algoritmo de IA e integración de Office 365 no es solo una solución técnica... es un <strong>acto de disrupción premeditada</strong> que convierte clientes en depredadores de mercado.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Blue Framework modernizado */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Los 4 Pilares del <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Blue Framework</span>
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Nuestra metodología distintiva que convierte desafíos en ventajas competitivas
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300 animate-slide-up overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-2xl">B</span>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    <strong>B</strong>reakthrough Thinking
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Quebramos paradigmas antes de construir soluciones. Cada proyecto comienza 
                    cuestionando "¿por qué las cosas son como son?" para encontrar verdaderas innovaciones.
                  </p>
                </div>
              </div>

              <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-green-200 transition-all duration-300 animate-slide-up overflow-hidden" style={{ animationDelay: '0.1s' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-2xl">L</span>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                    <strong>L</strong>aser-focused Execution
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Precisión quirúrgica en cada implementación. Cero desperdicios, máximo impacto. 
                    Nuestros proyectos terminan antes de lo prometido con resultados que superan expectativas.
                  </p>
                </div>
              </div>

              <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-purple-200 transition-all duration-300 animate-slide-up overflow-hidden" style={{ animationDelay: '0.2s' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-2xl">U</span>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                    <strong>U</strong>nstoppable Innovation
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Evolución constante. Tus sistemas se vuelven más inteligentes con cada 
                    actualización. La innovación no se detiene en el go-live, se acelera.
                  </p>
                </div>
              </div>

              <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-orange-200 transition-all duration-300 animate-slide-up overflow-hidden" style={{ animationDelay: '0.3s' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-2xl">E</span>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
                    <strong>E</strong>xcellence Amplified
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Estándares de clase mundial en cada entrega. Lo que para otros es excelencia, 
                    para nosotros es el punto de partida hacia la supremacía tecnológica.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Nuestro equipo modernizado */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                El Consejo de <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Visionarios</span>
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Cada miembro de nuestro equipo es un especialista que no solo domina tecnología, sino que entiende cómo usar esa tecnología para redefinir industrias.
              </p>
            </div>

            {/* Stats modernizadas */}
            <div className="group bg-white p-12 rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                
                <h4 className="text-3xl font-bold text-gray-900 mb-6 group-hover:text-indigo-600 transition-colors">
                  Perfiles del Equipo Elite
                </h4>
                <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                  Estamos preparando una galería de nuestros arquitectos digitales con sus credenciales, especializaciones y casos de éxito más impactantes.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="text-center group/stat">
                    <div className="text-4xl font-bold text-blue-600 mb-2 group-hover/stat:scale-110 transition-transform duration-300">15+</div>
                    <div className="text-gray-600 font-medium">Certificaciones SAP</div>
                  </div>
                  <div className="text-center group/stat">
                    <div className="text-4xl font-bold text-green-600 mb-2 group-hover/stat:scale-110 transition-transform duration-300">8</div>
                    <div className="text-gray-600 font-medium">Expertos en IA</div>
                  </div>
                  <div className="text-center group/stat">
                    <div className="text-4xl font-bold text-purple-600 mb-2 group-hover/stat:scale-110 transition-transform duration-300">12</div>
                    <div className="text-gray-600 font-medium">Arquitectos Cloud</div>
                  </div>
                  <div className="text-center group/stat">
                    <div className="text-4xl font-bold text-orange-600 mb-2 group-hover/stat:scale-110 transition-transform duration-300">5+</div>
                    <div className="text-gray-600 font-medium">Años de Experiencia</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to action modernizado */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-12 text-center">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                ¿Listo para unirte a la <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">revolución</span>?
              </h3>
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                No contratamos empleados... reclutamos cómplices de disrupción. 
                Si crees que tu talento puede redefinir industrias, queremos conocerte.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contacto" 
                  className="btn-primary text-lg px-8 py-4"
                >
                  Iniciar Conversación
                </a>
                <a 
                  href="mailto:careers@bluesystem.io" 
                  className="btn-secondary text-lg px-8 py-4"
                >
                  Únete al Equipo
                </a>
              </div>
            </div>
          </div>

          {/* Elementos decorativos */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 -left-10 w-20 h-20 bg-indigo-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-10 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;