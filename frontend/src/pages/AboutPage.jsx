import React from 'react';
import PageHeader from '../components/PageHeader';

/**
 * Página About - Sobre BlueSystem.io
 * Historia, equipo y filosofía de la empresa
 */
const AboutPage = () => {
  return (
    <div className="min-h-screen">
      {/* Encabezado de la página */}
      <PageHeader 
        title="Los Arquitectos del Futuro"
        subtitle="Conoce a los visionarios que están redefiniendo el panorama tecnológico empresarial"
        breadcrumb="Inicio"
        showStats={false}
      />

      {/* Contenido principal */}
      <main className="section-padding bg-white">
        <div className="container-custom">
          
          {/* Nuestra historia */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-dark mb-8 text-center">
              Nuestra <span className="text-gradient">Revolución</span>
            </h2>
            
            <div className="prose prose-lg prose-blue mx-auto text-gray-600 leading-relaxed">
              <p className="text-xl mb-6">
                <strong>BlueSystem.io nació de una frustración:</strong> ver cómo las empresas más 
                brillantes eran limitadas por consultorías tradicionales que implementaban "mejores prácticas" obsoletas.
              </p>
              
              <p className="mb-6">
                Mientras el mundo se conformaba con evolución incremental, nosotros decidimos 
                catalizar <strong>revoluciones digitales</strong>. No creemos en adaptar tecnología a procesos 
                antiguos... creemos en rediseñar realidades empresariales desde cero.
              </p>
              
              <p className="mb-6">
                Cada implementación de SAP, cada algoritmo de IA, cada integración de Office 365 
                que desarrollamos no es solo una solución técnica... es un <strong>acto de disrupción 
                premeditada</strong> que convierte a nuestros clientes en depredadores de sus mercados.
              </p>
            </div>
          </div>

          {/* Nuestros principios */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 mb-20">
            <h3 className="text-3xl font-bold text-gray-dark mb-8 text-center">
              Los 4 Pilares de la Revolución Blue
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-blue-primary rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">B</span>
                </div>
                <h4 className="text-xl font-bold text-gray-dark mb-3">Breakthrough Thinking</h4>
                <p className="text-gray-600">
                  Quebramos paradigmas antes de construir soluciones. Cada proyecto comienza 
                  cuestionando "¿por qué las cosas son como son?"
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">L</span>
                </div>
                <h4 className="text-xl font-bold text-gray-dark mb-3">Laser-focused Execution</h4>
                <p className="text-gray-600">
                  Precisión quirúrgica en cada implementación. Cero desperdicios, máximo impacto. 
                  Nuestros proyectos terminan antes de lo prometido.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">U</span>
                </div>
                <h4 className="text-xl font-bold text-gray-dark mb-3">Unstoppable Innovation</h4>
                <p className="text-gray-600">
                  Evolución constante. Tus sistemas se vuelven más inteligentes con cada 
                  actualización. La innovación no se detiene en el go-live.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
                <h4 className="text-xl font-bold text-gray-dark mb-3">Excellence Amplified</h4>
                <p className="text-gray-600">
                  Estándares de clase mundial en cada entrega. Lo que para otros es excelencia, 
                  para nosotros es el punto de partida.
                </p>
              </div>
            </div>
          </div>

          {/* Nuestro equipo */}
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-dark mb-6">
              El Consejo de <span className="text-gradient">Visionarios</span>
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
              Cada miembro de nuestro equipo es un especialista que no solo domina tecnología, 
              sino que entiende cómo usar esa tecnología para redefinir industrias.
            </p>

            {/* Placeholder para perfiles de equipo */}
            <div className="bg-gray-50 rounded-2xl p-12">
              <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              
              <h4 className="text-2xl font-bold text-gray-dark mb-4">
                Perfiles del Equipo
              </h4>
              <p className="text-gray-600 mb-6">
                Estamos preparando una galería de nuestros arquitectos digitales con sus 
                credenciales, especializaciones y casos de éxito más impactantes.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-primary mb-1">15+</div>
                  <div className="text-sm text-gray-600">Certificaciones SAP</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">8</div>
                  <div className="text-sm text-gray-600">Expertos en IA</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">12</div>
                  <div className="text-sm text-gray-600">Arquitectos Cloud</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">25+</div>
                  <div className="text-sm text-gray-600">Años de Experiencia</div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-dark mb-6">
              ¿Listo para unirte a la revolución?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              No contratamos empleados... reclutamos cómplices de disrupción. 
              Si crees que tu talento puede redefinir industrias, queremos conocerte.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contacto" 
                className="btn-primary text-lg px-8 py-3"
              >
                Iniciar Conversación
              </a>
              <a 
                href="mailto:careers@bluesystem.io" 
                className="btn-secondary text-lg px-8 py-3"
              >
                Únete al Equipo
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;