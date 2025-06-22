import React from 'react';
import PageHeader from '../components/PageHeader';
import ServiceDetail from '../components/ServiceDetail';

/**
 * Página de Servicios - Muestra todos los servicios de BlueSystem de forma detallada
 * Utiliza PageHeader para el encabezado y ServiceDetail para cada servicio
 */
const ServicesPage = () => {
  // Datos detallados de los servicios
  const services = [
    {
      id: 1,
      title: "Consultoría SAP",
      description: "Maximizamos la eficiencia operativa de tu empresa con implementaciones y optimizaciones de SAP. Nuestros especialistas certificados en SAP Business One y SAP HANA te acompañan desde la planificación hasta el go-live, asegurando una migración exitosa que transforme tus procesos de negocio y potencie tu crecimiento empresarial.",
      icon: "sap",
      features: [
        "Implementación SAP S/4HANA Cloud y On-Premise",
        "Migración desde sistemas legacy a SAP",
        "Optimización de procesos financieros y operativos",
        "Capacitación especializada para equipos",
        "Soporte post-implementación 24/7"
      ],
      technologies: ["SAP HANA", "SAP B1", "ABAP", "Fiori", "SAP Cloud Platform"],
      link: "/servicios/sap"
    },
    {
      id: 2,
      title: "Automatización con IA",
      description: "Transformamos tus procesos empresariales con soluciones de inteligencia artificial personalizadas. Desarrollamos bots inteligentes, sistemas de análisis predictivo y flujos de trabajo automatizados que reducen costos operativos, minimizan errores humanos y aceleran la toma de decisiones estratégicas en tu organización.",
      icon: "ai",
      features: [
        "Desarrollo de chatbots inteligentes",
        "Análisis predictivo y machine learning",
        "Automatización de procesos (RPA)",
        "Reconocimiento de documentos (OCR/AI)",
        "Integración con sistemas existentes"
      ],
      technologies: ["Python", "TensorFlow", "OpenAI GPT", "Azure AI", "Power Automate"],
      link: "/servicios/ia"
    },
    {
      id: 3,
      title: "Integraciones Office 365",
      description: "Conectamos tu ecosistema empresarial con la plataforma Microsoft 365 para potenciar la colaboración y productividad. Desarrollamos soluciones personalizadas con Power Platform, SharePoint y Teams que unifican tus datos, automatizan workflows y crean experiencias digitales intuitivas para tus equipos de trabajo.",
      icon: "office365",
      features: [
        "Desarrollo con Power Platform (Apps, Automate, BI)",
        "Personalización avanzada de SharePoint",
        "Integraciones con Microsoft Teams",
        "Conectores personalizados con Graph API",
        "Migración y sincronización de datos"
      ],
      technologies: ["Power Apps", "Power Automate", "SharePoint", "Microsoft Graph", "Azure"],
      link: "/servicios/office365"
    },
    {
      id: 4,
      title: "Desarrollo Web Empresarial",
      description: "Creamos aplicaciones web modernas, escalables y seguras diseñadas específicamente para las necesidades de tu negocio. Utilizando tecnologías de vanguardia como React, Node.js y arquitecturas cloud-native, desarrollamos soluciones que optimizan tus operaciones y ofrecen experiencias excepcionales a tus usuarios.",
      icon: "web",
      features: [
        "Desarrollo Full-Stack con React y Node.js",
        "APIs RESTful y GraphQL escalables",
        "Arquitectura cloud-native y microservicios",
        "Paneles administrativos personalizados",
        "Integración con bases de datos empresariales"
      ],
      technologies: ["React", "Node.js", "TypeScript", "Docker", "AWS/Azure"],
      link: "/servicios/desarrollo-web"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Encabezado de la página */}
      <PageHeader 
        title="Arsenal de Disrupción"
        subtitle="No vendemos servicios. Fabricamos ventajas competitivas que convierten empresas en depredadores de mercado."
        breadcrumb="Inicio"
      />

      {/* Contenido principal */}
      <main className="section-padding bg-white">
        <div className="container-custom">
          
          {/* Introducción de servicios */}
          <div className="text-center mb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-dark mb-6">
                Bienvenido al <span className="text-gradient">Blue Framework</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Nuestra metodología secreta convierte tecnología ordinaria en <strong>armas de disrupción masiva</strong>. 
                Cada implementación sigue nuestro protocolo B.L.U.E. que garantiza dominio competitivo total.
              </p>
              
              {/* Indicadores de valor */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-blue-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-sm font-medium text-gray-700"><strong>B</strong>reakthrough Thinking</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-sm font-medium text-gray-700"><strong>L</strong>aser-focused Execution</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-sm font-medium text-gray-700"><strong>U</strong>nstoppable Innovation</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-sm font-medium text-gray-700"><strong>E</strong>xcellence Amplified</div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de servicios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <ServiceDetail {...service} />
              </div>
            ))}
          </div>

          {/* Sección de llamada a la acción */}
          <div className="mt-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-3xl font-bold text-gray-dark mb-4">
                ¿Listo para ser el depredador de tu industria?
              </h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                No vendemos implementaciones. Forjamos imperios digitales. 
                El primer paso hacia tu dominio total comienza con una conversación.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contacto" 
                  className="btn-primary text-lg px-8 py-4"
                >
                  Iniciar Dominación
                </a>
                <a 
                  href="#" 
                  className="btn-secondary text-lg px-8 py-4"
                >
                  Descargar Battle Plan
                </a>
              </div>
            </div>
          </div>

          {/* Elementos decorativos */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 -left-10 w-20 h-20 bg-blue-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServicesPage;