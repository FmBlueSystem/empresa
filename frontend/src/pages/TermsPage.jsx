import React from 'react';
import PageHeader from '../components/PageHeader';

/**
 * Página Terms of Service - Términos de Servicio
 */
const TermsPage = () => {
  return (
    <div className="min-h-screen">
      <PageHeader 
        title="Términos de Servicio"
        subtitle="Las reglas del juego para una transformación digital exitosa"
        breadcrumb="Inicio"
        showStats={false}
      />

      <main className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto prose prose-lg prose-blue">
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-blue-primary mb-4">
                ⚖️ Términos de la Revolución Digital
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Estos términos establecen las bases de nuestra alianza estratégica para revolucionar tu industria.
              </p>
            </div>

            <h3>1. Aceptación de Términos</h3>
            <p>
              Al acceder y utilizar los servicios de BlueSystem.io, aceptas estar sujeto a estos 
              términos de servicio y todas las leyes y regulaciones aplicables.
            </p>

            <h3>2. Descripción de Servicios</h3>
            <p>BlueSystem.io proporciona:</p>
            <ul>
              <li>Consultoría e implementación de SAP</li>
              <li>Desarrollo de soluciones de inteligencia artificial</li>
              <li>Integración y personalización de Office 365</li>
              <li>Desarrollo de aplicaciones web empresariales</li>
              <li>Consultoría estratégica en transformación digital</li>
            </ul>

            <h3>3. Obligaciones del Cliente</h3>
            <p>El cliente se compromete a:</p>
            <ul>
              <li>Proporcionar información precisa y completa</li>
              <li>Cooperar en el proceso de implementación</li>
              <li>Designar personal competente para el proyecto</li>
              <li>Cumplir con los pagos según los términos acordados</li>
              <li>Mantener la confidencialidad de metodologías propietarias</li>
            </ul>

            <h3>4. Obligaciones de BlueSystem.io</h3>
            <p>Nos comprometemos a:</p>
            <ul>
              <li>Entregar servicios de calidad profesional</li>
              <li>Cumplir con los plazos acordados en el contrato</li>
              <li>Mantener la confidencialidad de información del cliente</li>
              <li>Proporcionar soporte post-implementación según lo acordado</li>
              <li>Aplicar las mejores prácticas de la industria</li>
            </ul>

            <h3>5. Propiedad Intelectual</h3>
            <p>
              BlueSystem.io retiene todos los derechos de propiedad intelectual sobre metodologías, 
              frameworks y herramientas propietarias. El cliente mantiene la propiedad de sus datos 
              y contenido empresarial.
            </p>

            <h3>6. Confidencialidad</h3>
            <p>
              Ambas partes se comprometen a mantener estricta confidencialidad sobre información 
              sensible intercambiada durante el desarrollo del proyecto.
            </p>

            <h3>7. Limitación de Responsabilidad</h3>
            <p>
              La responsabilidad de BlueSystem.io se limita al valor del contrato específico. 
              No seremos responsables por daños indirectos, incidentales o consecuenciales.
            </p>

            <h3>8. Términos de Pago</h3>
            <p>
              Los pagos se realizarán según los hitos definidos en cada contrato específico. 
              Los retrasos en pagos pueden resultar en suspensión temporal de servicios.
            </p>

            <h3>9. Resolución de Disputas</h3>
            <p>
              Cualquier disputa será resuelta preferentemente a través de mediación. Si esto no 
              es posible, se someterá a arbitraje bajo las leyes de México.
            </p>

            <h3>10. Modificaciones</h3>
            <p>
              BlueSystem.io se reserva el derecho de modificar estos términos. Los cambios 
              significativos serán comunicados con 30 días de anticipación.
            </p>

            <h3>11. Contacto Legal</h3>
            <p>Para asuntos legales, contáctanos en:</p>
            <ul>
              <li>Email: legal@bluesystem.io</li>
              <li>Teléfono: +52 55 1234 5678</li>
              <li>Dirección Legal: Ciudad de México, México</li>
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

export default TermsPage;