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
      title: "Desarrollo de Software Integral",
      description: "Dominamos todas las plataformas: web modernas, aplicaciones móviles nativas, software de escritorio y arquitecturas cloud-native. Con tecnologías como React, Flutter, Electron y microservicios, creamos ecosistemas digitales que conquistan cada dispositivo y plataforma donde opera tu empresa.",
      icon: "web",
      features: [
        "Desarrollo Web: React, Vue.js, PWAs empresariales",
        "Aplicaciones Móviles: React Native, Flutter, nativo iOS/Android",
        "Software de Escritorio: Electron, .NET, aplicaciones cross-platform",
        "Backend Enterprise: APIs escalables, microservicios, cloud-native",
        "Integración multiplataforma con SAP, Office 365 y sistemas legacy"
      ],
      technologies: ["React", "Flutter", "Electron", "Node.js", "TypeScript", "Docker", "AWS/Azure"],
      link: "/servicios/desarrollo-web"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section Moderno */}
      <section className="relative bg-gradient-to-br from-purple-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-600 animate-pulse"></div>
        </div>
        
        <div className="relative container-custom py-24 lg:py-32">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              <span className="bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                Arsenal de Soluciones
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
                Empresariales
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed animate-slide-up">
              Transformamos desafíos empresariales en ventajas competitivas. Cada solución está diseñada para impulsar tu crecimiento y eficiencia operativa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2 text-blue-100">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Metodología Blue Framework
              </div>
              <div className="flex items-center gap-2 text-blue-100">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Tecnologías avanzadas
              </div>
              <div className="flex items-center gap-2 text-blue-100">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Resultados garantizados
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
          
          {/* Introducción de servicios modernizada */}
          <div className="text-center mb-20">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
                Bienvenido al <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Blue Framework</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-12 animate-slide-up max-w-4xl mx-auto">
                Nuestra metodología convierte desafíos tecnológicos en ventajas competitivas. 
                Cada implementación sigue nuestro protocolo B.L.U.E. que garantiza resultados excepcionales.
              </p>
              
              {/* Indicadores Blue Framework modernizados */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    <strong>B</strong>reakthrough
                  </h3>
                  <p className="text-sm text-gray-600">Pensamiento disruptivo</p>
                </div>
                
                <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-green-200 transition-all duration-300 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    <strong>L</strong>aser-focused
                  </h3>
                  <p className="text-sm text-gray-600">Ejecución precisa</p>
                </div>
                
                <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-purple-200 transition-all duration-300 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    <strong>U</strong>nstoppable
                  </h3>
                  <p className="text-sm text-gray-600">Innovación continua</p>
                </div>
                
                <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-orange-200 transition-all duration-300 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    <strong>E</strong>xcellence
                  </h3>
                  <p className="text-sm text-gray-600">Amplificación de resultados</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de servicios modernizada */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Nuestros Servicios
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Soluciones especializadas diseñadas para transformar tu empresa y acelerar tu crecimiento
              </p>
            </div>

            {/* Grid de servicios con diseño moderno */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {services.map((service, index) => (
                <div 
                  key={service.id} 
                  className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-indigo-200 transition-all duration-300 animate-slide-up overflow-hidden"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <ServiceDetail {...service} />
                  </div>
                </div>
              ))}
            </div>
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
                  href="/recursos/battle-plan-bluesystem.pdf" 
                  className="btn-secondary text-lg px-8 py-4"
                  target="_blank"
                  rel="noopener noreferrer"
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