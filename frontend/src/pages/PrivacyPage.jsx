import React from 'react';
import PageHeader from '../components/PageHeader';

/**
 * Página Privacy Policy - Política de Privacidad
 */
const PrivacyPage = () => {
  return (
    <div className="min-h-screen">
      <PageHeader 
        title="Política de Privacidad"
        subtitle="Protegemos tu información con el mismo nivel de seguridad que usamos para revolucionar industrias"
        breadcrumb="Inicio"
        showStats={false}
      />

      <main className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto prose prose-lg prose-blue">
            
            <div className="bg-blue-50 rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-blue-primary mb-4">
                🔒 Compromiso con la Privacidad Digital
              </h2>
              <p className="text-gray-700 leading-relaxed">
                En BlueSystem.io, entendemos que la confianza es el fundamento de toda revolución digital. 
                Esta política describe cómo protegemos, procesamos y utilizamos tu información personal.
              </p>
            </div>

            <h3>1. Información que Recopilamos</h3>
            <p>Recopilamos información cuando:</p>
            <ul>
              <li>Te contactas con nosotros para consultas o servicios</li>
              <li>Te suscribes a nuestro newsletter</li>
              <li>Interactúas con nuestro sitio web</li>
              <li>Participas en nuestros eventos o webinars</li>
            </ul>

            <h3>2. Cómo Utilizamos tu Información</h3>
            <p>Utilizamos tu información para:</p>
            <ul>
              <li>Proporcionar servicios de consultoría personalizados</li>
              <li>Comunicarnos contigo sobre proyectos y actualizaciones</li>
              <li>Mejorar nuestros servicios y experiencia web</li>
              <li>Enviar contenido relevante y insights de industria</li>
            </ul>

            <h3>3. Protección de Datos</h3>
            <p>
              Implementamos medidas de seguridad técnicas y organizacionales apropiadas para proteger 
              tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.
            </p>

            <h3>4. Compartir Información</h3>
            <p>
              No vendemos, intercambiamos ni transferimos tu información personal a terceros sin tu 
              consentimiento, excepto cuando sea necesario para proporcionar nuestros servicios o 
              cumplir con obligaciones legales.
            </p>

            <h3>5. Tus Derechos</h3>
            <p>Tienes derecho a:</p>
            <ul>
              <li>Acceder a tu información personal</li>
              <li>Corregir datos inexactos</li>
              <li>Solicitar la eliminación de tus datos</li>
              <li>Oponerte al procesamiento</li>
              <li>Portabilidad de datos</li>
            </ul>

            <h3>6. Cookies y Tecnologías de Seguimiento</h3>
            <p>
              Utilizamos cookies para mejorar tu experiencia de navegación y analizar el uso del sitio. 
              Puedes controlar las cookies a través de la configuración de tu navegador.
            </p>

            <h3>7. Contacto</h3>
            <p>
              Para ejercer tus derechos o hacer preguntas sobre esta política, contáctanos en:
            </p>
            <ul>
              <li>Email: privacy@bluesystem.io</li>
              <li>Teléfono: +52 55 1234 5678</li>
              <li>Dirección: Ciudad de México, México</li>
            </ul>

            <div className="bg-gray-50 rounded-xl p-6 mt-12">
              <p className="text-sm text-gray-600 mb-0">
                <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPage;