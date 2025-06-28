import React from 'react';
import ServiceCard from './ServiceCard';

/**
 * Componente ServicesSection - Sección que muestra todos los servicios principales
 * Utiliza el componente ServiceCard para mostrar cada servicio de forma consistente
 */
const ServicesSection = () => {
  // Datos de los servicios principales
  const services = [
    {
      id: 1,
      title: "SAP: El Destructor de Silos",
      description: "No integramos SAP. Demolemos las barreras organizacionales y construimos imperios de datos unificados.",
      icon: "sap",
      link: "/servicios/sap",
      features: [
        "Revolución S/4HANA en tiempo real",
        "Aniquilación de legacy systems",
        "Rediseño radical de workflows"
      ]
    },
    {
      id: 2,
      title: "IA: La Máquina de Ventajas",
      description: "Mientras tu competencia contrata humanos, nosotros entrenamos ejércitos de algoritmos que nunca duermen.",
      icon: "ai",
      link: "/servicios/ia",
      features: [
        "Robots que piensan y ejecutan",
        "Predicción del futuro empresarial",
        "Decisiones sin emociones humanas"
      ]
    },
    {
      id: 3,
      title: "Office 365: El Neuroglificador",
      description: "Convertimos Office 365 en el sistema nervioso central que conecta cada neurona de tu organización.",
      icon: "office365",
      link: "/servicios/office365",
      features: [
        "Power Platform armado hasta los dientes",
        "SharePoint como cerebro colectivo",
        "Teams como red neuronal empresarial"
      ]
    },
    {
      id: 4,
      title: "Software Integral: Omnipresencia Digital",
      description: "No desarrollamos apps. Conquistamos ecosistemas completos: web, móvil, escritorio y cloud en una sola ofensiva.",
      icon: "web",
      link: "/servicios/desarrollo-web",
      features: [
        "Multiplataforma weaponizada",
        "Nativo + Cross-platform dominante",
        "Cloud-native invencible"
      ]
    },
    {
      id: 5,
      title: "BlueConnect: La Red Suprema",
      description: "Mientras otros conectan cables, nosotros tejemos ecosistemas digitales inteligentes que anticipan y responden.",
      icon: "network",
      link: "/blueconnect",
      features: [
        "Infraestructura que evoluciona sola",
        "Seguridad que nunca duerme",
        "IoT que piensa antes de actuar"
      ]
    }
  ];

  return (
    <section className="section-padding bg-gray-light" id="servicios">
      <div className="container-custom">
        {/* Encabezado de la sección */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-dark mb-6">
            Nuestro <span className="text-gradient">Arsenal</span> de Disrupción
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Cada &quot;servicio&quot; es un <strong>catalizador de revolución</strong>. No vendemos software, 
            fabricamos ventajas competitivas que convierten a nuestros clientes en depredadores de mercado.
          </p>
        </div>

        {/* Grid de servicios - Layout adaptativo para 5 servicios */}
        <div className="mb-12">
          {/* Primera fila: 4 servicios principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {services.slice(0, 4).map((service, index) => (
              <div 
                key={service.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ServiceCard {...service} />
              </div>
            ))}
          </div>
          
          {/* Segunda fila: BlueConnect centrado */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <ServiceCard {...services[4]} />
            </div>
          </div>
        </div>

        {/* Sección de valor agregado */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Contenido de texto */}
            <div>
              <h3 className="text-3xl font-bold text-gray-dark mb-6">
                The Blue Framework: Nuestra Metodología Secreta
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-dark mb-1">B - Breakthrough Thinking</h4>
                    <p className="text-gray-600">Quebramos paradigmas antes de construir soluciones. Pensamiento disruptivo es nuestro ADN.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-dark mb-1">L - Laser-focused Execution</h4>
                    <p className="text-gray-600">Precisión quirúrgica en cada implementación. Cero desperdicios, máximo impacto.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-dark mb-1">U - Unstoppable Innovation</h4>
                    <p className="text-gray-600">Evolución constante. Tus sistemas se vuelven más inteligentes con cada actualización.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Beneficios clave */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-primary rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-dark">ROI Comprobable</h4>
                </div>
                <p className="text-gray-600 text-sm">Retorno de inversión medible y documentado en cada proyecto</p>
              </div>
              
              <div className="p-6 bg-green-50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-dark">Entrega Predecible</h4>
                </div>
                <p className="text-gray-600 text-sm">Metodología probada con cronogramas realistas y transparentes</p>
              </div>
              
              <div className="p-6 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-dark">Calidad Consistente</h4>
                </div>
                <p className="text-gray-600 text-sm">Estándares de calidad mantenidos en todos nuestros proyectos</p>
              </div>
              
              <div className="p-6 bg-orange-50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-dark">Mejora Continua</h4>
                </div>
                <p className="text-gray-600 text-sm">Optimización constante de procesos y resultados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection; 