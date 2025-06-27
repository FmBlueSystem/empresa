import React from 'react';

/**
 * Página BlueConnect - Servicios de Conectividad Inteligente
 * Inspirado en BCNetwork con diseño moderno y consistencia visual de BlueSystem
 */
const BlueConnectPage = () => {
  // Servicios de conectividad
  const connectivityServices = [
    {
      id: 1,
      title: "Infraestructura de Red Empresarial",
      description: "Diseñamos e implementamos redes corporativas de alto rendimiento que escalan con tu negocio. Desde switches enterprise hasta access points Wi-Fi 6E, creamos la columna vertebral digital que tu empresa necesita.",
      icon: "network",
      features: [
        "Switches y routers enterprise (Cisco, Fortinet)",
        "Access points Wi-Fi 6E de alta densidad",
        "Cableado estructurado Cat 6A/7",
        "Segmentación de red VLAN avanzada",
        "Redundancia y alta disponibilidad"
      ],
      technologies: ["Cisco", "Fortinet", "Ubiquiti", "Aruba", "Meraki"]
    },
    {
      id: 2,
      title: "Conectividad Cloud Híbrida",
      description: "Integramos perfectamente tus recursos on-premise con la nube, creando un ecosistema digital fluido. Conectividad segura, rápida y confiable entre todos tus sistemas empresariales.",
      icon: "cloud",
      features: [
        "VPN empresarial site-to-site",
        "Conectividad directa AWS/Azure (ExpressRoute/Direct Connect)",
        "SD-WAN para optimización de tráfico",
        "Load balancing inteligente",
        "Failover automático multi-ISP"
      ],
      technologies: ["AWS Direct Connect", "Azure ExpressRoute", "VMware SD-WAN", "Fortinet SDWAN", "Cisco Meraki"]
    },
    {
      id: 3,
      title: "Seguridad de Red Avanzada",
      description: "Protegemos tu infraestructura con las últimas tecnologías de ciberseguridad. Monitoreo 24/7, detección de amenazas en tiempo real y respuesta automatizada a incidentes.",
      icon: "security",
      features: [
        "Firewall Next-Generation (NGFW)",
        "Sistemas IPS/IDS avanzados",
        "Zero Trust Network Access (ZTNA)",
        "SOC con monitoreo 24/7",
        "Análisis de comportamiento con IA"
      ],
      technologies: ["Fortinet FortiGate", "Palo Alto", "CrowdStrike", "Splunk", "Cisco SecureX"]
    },
    {
      id: 4,
      title: "Localización Indoor Inteligente",
      description: "Tecnología de posicionamiento interior para espacios corporativos. Analytics de movimiento, optimización de espacios y experiencias personalizadas para empleados y visitantes.",
      icon: "location",
      features: [
        "Posicionamiento indoor submétrico",
        "Analytics de ocupación y movimiento",
        "Navegación interior para visitantes",
        "Optimización de espacios de trabajo",
        "Integración con sistemas de seguridad"
      ],
      technologies: ["Situm", "Cisco DNA Spaces", "HPE Aruba Location Services", "Bluetooth 5.0", "WiFi RTT"]
    },
    {
      id: 5,
      title: "Digital Signage & IoT Empresarial",
      description: "Señalización digital inteligente y ecosistema IoT integrado. Transformamos espacios corporativos en entornos digitales interactivos y eficientes.",
      icon: "iot",
      features: [
        "Pantallas digitales interactivas",
        "Gestión centralizada de contenido",
        "Sensores IoT para ambientes inteligentes",
        "Automatización de edificios",
        "Dashboard de analytics en tiempo real"
      ],
      technologies: ["Samsung MagicINFO", "LG webOS", "Cisco IoT", "Microsoft Azure IoT", "AWS IoT Core"]
    },
    {
      id: 6,
      title: "Soporte y Mantenimiento Proactivo",
      description: "Monitoreo continuo y mantenimiento predictivo de tu infraestructura. Nuestro NOC identifica y resuelve problemas antes de que afecten a tu negocio.",
      icon: "support",
      features: [
        "NOC 24/7 con ingenieros certificados",
        "Monitoreo proactivo automatizado",
        "Mantenimiento predictivo con IA",
        "SLA garantizado de disponibilidad",
        "Reportes ejecutivos mensuales"
      ],
      technologies: ["SolarWinds", "PRTG", "Nagios", "Splunk", "ServiceNow"]
    }
  ];

  // Casos de uso empresariales
  const useCases = [
    {
      industry: "Retail",
      challenge: "Conectividad entre múltiples sucursales",
      solution: "SD-WAN + WiFi 6E + Analytics de ubicación",
      result: "40% mejora en experiencia cliente"
    },
    {
      industry: "Manufactura",
      challenge: "IoT industrial y conectividad OT/IT",
      solution: "Red segmentada + Edge computing + Monitoreo 24/7",
      result: "25% reducción en tiempo de inactividad"
    },
    {
      industry: "Oficinas Corporativas",
      challenge: "Trabajo híbrido y espacios inteligentes",
      solution: "Localización indoor + Digital signage + ZTNA",
      result: "60% optimización de espacios"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white overflow-hidden">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse"></div>
        </div>
        
        <div className="relative container-custom py-24 lg:py-32">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 animate-fade-in">
              <svg className="w-6 h-6 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-blue-100 font-medium">Nuevo Servicio</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                BlueConnect
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
                Arquitectura de Conectividad Inteligente
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed animate-slide-up">
              Transformamos tu infraestructura de red en una ventaja competitiva. Conectividad empresarial inteligente, segura y escalable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2 text-blue-100">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Monitoreo 24/7
              </div>
              <div className="flex items-center gap-2 text-blue-100">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Tecnologías enterprise
              </div>
              <div className="flex items-center gap-2 text-blue-100">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                SLA garantizado
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
          
          {/* Introducción */}
          <div className="text-center mb-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
                Conectividad <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Empresarial</span> del Futuro
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed animate-slide-up max-w-3xl mx-auto">
                Infraestructura de red que se adapta, escala y evoluciona con tu negocio. 
                Desde conectividad básica hasta ecosistemas digitales inteligentes.
              </p>
            </div>
          </div>

          {/* Grid de servicios */}
          <div className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {connectivityServices.map((service, index) => (
                <div 
                  key={service.id} 
                  className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300 animate-slide-up overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="flex items-start gap-6 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {service.icon === 'network' && (
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clipRule="evenodd" />
                          </svg>
                        )}
                        {service.icon === 'cloud' && (
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                          </svg>
                        )}
                        {service.icon === 'security' && (
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        {service.icon === 'location' && (
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        )}
                        {service.icon === 'iot' && (
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                        {service.icon === 'support' && (
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-1.106-1.106A6.003 6.003 0 004 10c0 .639.1 1.255.283 1.836l1.555-1.555zM10 8a2 2 0 100 4 2 2 0 000-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-6">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    {/* Características */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Características principales:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-600">
                            <svg className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tecnologías */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Tecnologías:</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.technologies.map((tech, idx) => (
                          <span 
                            key={idx} 
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Casos de uso */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Casos de Éxito
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Resultados reales en empresas que confiaron en BlueConnect
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {useCases.map((useCase, index) => (
                <div 
                  key={index}
                  className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-indigo-200 transition-all duration-300 animate-slide-up overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                      {useCase.industry}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Desafío:</span>
                        <p className="text-gray-700 mt-1">{useCase.challenge}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Solución:</span>
                        <p className="text-gray-700 mt-1">{useCase.solution}</p>
                      </div>
                      <div className="pt-2 border-t border-gray-100">
                        <span className="text-sm font-medium text-green-600 uppercase tracking-wide">Resultado:</span>
                        <p className="text-green-700 font-semibold mt-1">{useCase.result}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to action */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-12 text-center">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                ¿Listo para transformar tu <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">conectividad</span>?
              </h3>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
                Nuestros especialistas en conectividad están listos para diseñar la arquitectura de red que llevará tu empresa al siguiente nivel.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contacto" 
                  className="btn-primary text-lg px-8 py-4"
                >
                  Consulta Gratuita
                </a>
                <a 
                  href="mailto:blueconnect@bluesystem.io" 
                  className="btn-secondary text-lg px-8 py-4"
                >
                  Solicitar Demo
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

export default BlueConnectPage;