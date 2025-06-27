import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/SchemaMarkup';

/**
 * Página de Desarrollo de Software Integral
 * Servicio especializado en desarrollo multiplataforma: web, móvil, escritorio y cloud
 */
const DesarrolloWebPage = () => {
  
  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  // Tecnologías por plataforma
  const platformTechnologies = {
    web: [
      { name: 'React', icon: '⚛️', description: 'Interfaces interactivas y modernas' },
      { name: 'Vue.js', icon: '💚', description: 'Framework progresivo y eficiente' },
      { name: 'Node.js', icon: '🟢', description: 'Backend JavaScript escalable' },
      { name: 'TypeScript', icon: '🔷', description: 'Código robusto y mantenible' }
    ],
    mobile: [
      { name: 'React Native', icon: '📱', description: 'Apps multiplataforma nativas' },
      { name: 'Flutter', icon: '🐦', description: 'UI moderna y performante' },
      { name: 'Swift', icon: '🍎', description: 'Desarrollo nativo iOS' },
      { name: 'Kotlin', icon: '🤖', description: 'Desarrollo nativo Android' }
    ],
    desktop: [
      { name: 'Electron', icon: '💻', description: 'Apps cross-platform' },
      { name: '.NET', icon: '🟦', description: 'Aplicaciones Windows enterprise' },
      { name: 'Qt', icon: '⚙️', description: 'Alto rendimiento C++' },
      { name: 'Tauri', icon: '🦀', description: 'Apps ligeras con Rust' }
    ],
    cloud: [
      { name: 'Docker', icon: '🐳', description: 'Contenedores y orquestación' },
      { name: 'Kubernetes', icon: '☸️', description: 'Orquestación cloud-native' },
      { name: 'AWS/Azure', icon: '☁️', description: 'Servicios cloud enterprise' },
      { name: 'Serverless', icon: '⚡', description: 'Functions y microservicios' }
    ]
  };

  // Plataformas de desarrollo
  const developmentPlatforms = [
    {
      title: 'Desarrollo Web Avanzado',
      description: 'Aplicaciones web modernas, escalables y responsivas con tecnologías de vanguardia',
      icon: '🌐',
      technologies: ['React', 'Vue.js', 'Node.js', 'TypeScript'],
      features: ['SPAs & PWAs', 'E-commerce empresarial', 'Dashboards analíticos', 'APIs REST/GraphQL']
    },
    {
      title: 'Desarrollo Móvil Nativo',
      description: 'Apps nativas iOS y Android con rendimiento óptimo y acceso completo a funcionalidades del sistema',
      icon: '📱',
      technologies: ['Swift', 'Kotlin', 'Xcode', 'Android Studio'],
      features: ['Performance nativo', 'Integración sistema', 'Push notifications', 'Offline-first']
    },
    {
      title: 'Desarrollo Móvil Multiplataforma',
      description: 'Aplicaciones móviles que funcionan en iOS y Android desde una sola base de código',
      icon: '🔄',
      technologies: ['React Native', 'Flutter', 'Xamarin', 'Ionic'],
      features: ['Un código, dos plataformas', 'Desarrollo acelerado', 'UI nativa', 'Hot reload']
    },
    {
      title: 'Desarrollo de Escritorio',
      description: 'Aplicaciones de escritorio robustas para Windows, macOS y Linux con interfaces modernas',
      icon: '💻',
      technologies: ['Electron', '.NET', 'Qt', 'Tauri'],
      features: ['Cross-platform', 'Interfaz nativa', 'Alto rendimiento', 'Integraciones OS']
    },
    {
      title: 'Backend & APIs Enterprise',
      description: 'Servicios backend escalables, microservicios y APIs robustas para arquitecturas empresariales',
      icon: '⚙️',
      technologies: ['Node.js', 'Python', 'Go', '.NET Core'],
      features: ['Microservicios', 'APIs escalables', 'Base datos distribuida', 'Message queues']
    },
    {
      title: 'Desarrollo Cloud-Native',
      description: 'Aplicaciones diseñadas para la nube con contenedores, serverless y edge computing',
      icon: '☁️',
      technologies: ['Docker', 'Kubernetes', 'AWS', 'Azure'],
      features: ['Serverless functions', 'Auto-scaling', 'Edge computing', 'DevOps integrado']
    }
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Análisis & Estrategia',
      description: 'Auditamos tu ecosistema tecnológico actual y diseñamos la arquitectura optimal',
      duration: '1-2 semanas'
    },
    {
      step: '02', 
      title: 'Diseño UX/UI',
      description: 'Creamos prototipos interactivos enfocados en experiencia de usuario empresarial',
      duration: '2-3 semanas'
    },
    {
      step: '03',
      title: 'Desarrollo Core',
      description: 'Construimos la aplicación con metodología ágil y entregas incrementales',
      duration: '6-12 semanas'
    },
    {
      step: '04',
      title: 'Testing & QA',
      description: 'Pruebas exhaustivas, optimización de performance y auditoría de seguridad',
      duration: '2-3 semanas'
    },
    {
      step: '05',
      title: 'Deploy & Soporte',
      description: 'Implementación en producción con monitoreo 24/7 y soporte especializado',
      duration: 'Continuo'
    }
  ];

  const successMetrics = [
    { value: '300%', label: 'Aumento promedio en productividad', color: 'text-green-600' },
    { value: '85%', label: 'Reducción en tiempos de proceso', color: 'text-blue-600' },
    { value: '99.9%', label: 'Uptime garantizado', color: 'text-purple-600' },
    { value: '24/7', label: 'Soporte especializado', color: 'text-orange-600' }
  ];

  return (
    <div className="min-h-screen">
      {/* SEO específico para Desarrollo Integral */}
      <SEO 
        title="Desarrollo de Software Integral - Web, Móvil, Escritorio | BlueSystem"
        description="Desarrollo multiplataforma: aplicaciones web, móviles nativas, apps de escritorio y soluciones cloud. React, Flutter, Electron, microservicios."
        keywords="desarrollo software integral, aplicaciones multiplataforma, desarrollo web móvil escritorio, React Native Flutter Electron, software empresarial"
        ogImage="/images/desarrollo-integral-og.jpg"
      />
      
      <SchemaMarkup 
        type="service" 
        data={{
          name: "Desarrollo de Software Integral",
          description: "Desarrollo multiplataforma: web, móvil, escritorio y cloud-native para empresas",
          provider: "BlueSystem",
          areaServed: "Costa Rica",
          availableChannel: "https://bluesystem.io/contacto"
        }}
      />

      {/* Header de la página */}
      <PageHeader 
        title="Desarrollo de Software Integral"
        subtitle="No creamos aplicaciones. Forjamos ecosistemas digitales multiplataforma que dominan web, móvil, escritorio y cloud desde una sola estrategia."
        breadcrumb="Servicios / Desarrollo Integral"
      />

      {/* Contenido principal */}
      <main className="bg-white">
        
        {/* Sección Hero del servicio */}
        <section className="section-padding">
          <div className="container-custom">
            <motion.div 
              className="max-w-4xl mx-auto text-center mb-16"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-gray-dark mb-6"
                variants={itemVariants}
              >
                Mientras otros desarrollan apps, nosotros <span className="text-gradient">conquistamos ecosistemas completos</span>
              </motion.h2>
              
              <motion.p 
                className="text-lg text-gray-600 leading-relaxed mb-8"
                variants={itemVariants}
              >
                Dominamos <strong>todas las plataformas</strong>: web, móvil, escritorio y cloud. Cada proyecto es una 
                <strong> revolución multiplataforma</strong> que convierte tu presencia digital en supremacía total del mercado.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                variants={itemVariants}
              >
                <Link 
                  to="/contacto" 
                  className="btn-primary text-lg px-8 py-4"
                >
                  Iniciar Dominación Digital
                </Link>
                <Link 
                  to="/casos-de-exito" 
                  className="btn-secondary text-lg px-8 py-4"
                >
                  Ver Revoluciones Anteriores
                </Link>
              </motion.div>
            </motion.div>

            {/* Métricas de éxito */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {successMetrics.map((metric, index) => (
                <motion.div 
                  key={index}
                  className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"
                  variants={itemVariants}
                >
                  <div className={`text-3xl font-bold ${metric.color} mb-2`}>
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {metric.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Plataformas de Desarrollo */}
        <section className="section-padding bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="container-custom">
            <motion.div 
              className="text-center mb-16"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h3 
                className="text-3xl md:text-4xl font-bold text-gray-dark mb-6"
                variants={itemVariants}
              >
                Dominamos <span className="text-gradient">Todas las Plataformas</span>
              </motion.h3>
              <motion.p 
                className="text-lg text-gray-600 max-w-4xl mx-auto"
                variants={itemVariants}
              >
                Desde aplicaciones web hasta mobile nativo, escritorio enterprise y arquitecturas cloud. 
                Una sola estrategia, supremacía multiplataforma total.
              </motion.p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {developmentPlatforms.map((platform, index) => (
                <motion.div 
                  key={index}
                  className="card p-8 hover:shadow-xl transition-all duration-300 h-full"
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <div className="text-5xl mb-6">{platform.icon}</div>
                  <h4 className="text-xl font-bold text-gray-dark mb-4">{platform.title}</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">{platform.description}</p>
                  
                  {/* Tecnologías */}
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-dark mb-2 text-sm">Tecnologías:</h5>
                    <div className="flex flex-wrap gap-2">
                      {platform.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Características */}
                  <div>
                    <h5 className="font-semibold text-gray-dark mb-2 text-sm">Capacidades:</h5>
                    <ul className="space-y-1">
                      {platform.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                          <svg className="w-3 h-3 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>


        {/* Proceso de desarrollo */}
        <section className="section-padding bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container-custom">
            <motion.div 
              className="text-center mb-12"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h3 
                className="text-3xl font-bold text-gray-dark mb-4"
                variants={itemVariants}
              >
                Protocolo <span className="text-gradient">Blue Multiplataforma</span>
              </motion.h3>
              <motion.p 
                className="text-lg text-gray-600 max-w-3xl mx-auto"
                variants={itemVariants}
              >
                Nuestra metodología secreta de 5 fases que convierte ideas empresariales en ecosistemas digitales omnipresentes.
              </motion.p>
            </motion.div>

            <motion.div 
              className="space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {processSteps.map((step, index) => (
                <motion.div 
                  key={index}
                  className="flex flex-col md:flex-row items-start gap-6 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-primary text-white rounded-full flex items-center justify-center text-xl font-bold">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <h4 className="text-xl font-bold text-gray-dark">{step.title}</h4>
                      <span className="text-sm font-medium text-blue-primary bg-blue-100 px-3 py-1 rounded-full">
                        {step.duration}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Sección de Educación y Compromiso Social */}
        <section className="section-padding bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="container-custom">
            <motion.div 
              className="text-center mb-12"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h3 
                className="text-3xl font-bold text-gray-dark mb-4"
                variants={itemVariants}
              >
                <span className="text-gradient">Blue Education</span> - Democratizando la Revolución Digital
              </motion.h3>
              <motion.p 
                className="text-lg text-gray-600 max-w-4xl mx-auto"
                variants={itemVariants}
              >
                No solo transformamos empresas. <strong>Redefinimos comunidades enteras</strong> eliminando la brecha digital 
                y convirtiendo cada organización en un catalizador de cambio social imparable.
              </motion.p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Lado izquierdo - Contenido */}
              <motion.div variants={itemVariants}>
                <h4 className="text-2xl font-bold text-gray-dark mb-6">
                  Más allá del código: <span className="text-green-600">Impacto Social Masivo</span>
                </h4>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🌍</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-dark mb-2">Democratización Tecnológica</h5>
                      <p className="text-gray-600">
                        Llevamos herramientas de clase mundial a <strong>comunidades rurales, cooperativas y organizaciones sin fines de lucro</strong>, 
                        convirtiendo limitaciones en ventajas competitivas devastadoras.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🎓</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-dark mb-2">Capacitación Revolucionaria</h5>
                      <p className="text-gray-600">
                        Nuestros programas de <strong>upskilling digital</strong> convierten empleados tradicionales en 
                        guerreros tecnológicos capaces de liderar la transformación desde adentro.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🤝</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-dark mb-2">Alianzas Estratégicas</h5>
                      <p className="text-gray-600">
                        Conectamos <strong>asociaciones civiles, cámaras empresariales y gobiernos locales</strong> 
                        en ecosistemas digitales que amplifican el impacto social exponencialmente.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Lado derecho - Métricas de impacto social */}
              <motion.div 
                className="bg-white rounded-2xl p-8 shadow-lg"
                variants={itemVariants}
              >
                <h4 className="text-xl font-bold text-gray-dark mb-6 text-center">
                  Impacto en Números 📈
                </h4>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">25+</div>
                    <div className="text-sm text-gray-600">Proyectos Entregados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                    <div className="text-sm text-gray-600">Usuarios Impactados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
                    <div className="text-sm text-gray-600">Satisfacción Cliente</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">6</div>
                    <div className="text-sm text-gray-600">Tecnologías Dominadas</div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700 text-center">
                    <strong>🏆 Reconocimiento ONU 2024:</strong><br/>
                    &quot;Mejor Iniciativa de Inclusión Digital en Latinoamérica&quot;
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Programas específicos */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                className="card p-6 text-center hover:shadow-xl transition-all duration-300"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">🌱</div>
                <h4 className="text-xl font-bold text-gray-dark mb-3">Blue Communities</h4>
                <p className="text-gray-600 mb-4">
                  Transformamos cooperativas rurales en <strong>potencias digitales</strong> con plataformas 
                  de comercio electrónico y gestión automatizada.
                </p>
                <div className="text-sm text-green-600 font-medium">
                  ✅ Gratis para organizaciones sin fines de lucro
                </div>
              </motion.div>

              <motion.div 
                className="card p-6 text-center hover:shadow-xl transition-all duration-300"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">🚀</div>
                <h4 className="text-xl font-bold text-gray-dark mb-3">Blue Academy</h4>
                <p className="text-gray-600 mb-4">
                  Programas intensivos que convierten empleados tradicionales en 
                  <strong>especialistas en transformación digital</strong> en 90 días.
                </p>
                <div className="text-sm text-blue-600 font-medium">
                  ✅ Certificación internacional incluida
                </div>
              </motion.div>

              <motion.div 
                className="card p-6 text-center hover:shadow-xl transition-all duration-300"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">🤝</div>
                <h4 className="text-xl font-bold text-gray-dark mb-3">Blue Alliance</h4>
                <p className="text-gray-600 mb-4">
                  Red de <strong>asociaciones empresariales y cámaras de comercio</strong> 
                  unidos en la revolución digital regional.
                </p>
                <div className="text-sm text-purple-600 font-medium">
                  ✅ Acceso a fondos internacionales
                </div>
              </motion.div>
            </motion.div>

            {/* CTA de Educación */}
            <motion.div 
              className="mt-16 text-center bg-white rounded-2xl p-8 shadow-lg"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <h4 className="text-2xl font-bold text-gray-dark mb-4">
                ¿Tu organización lista para liderar el cambio social?
              </h4>
              <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
                Únete a la revolución que está redefiniendo cómo las comunidades, asociaciones y empresas 
                <strong> crean valor social a través de la tecnología</strong>.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/contacto" 
                  className="btn-primary text-lg px-8 py-4"
                >
                  Iniciar Impacto Social
                </Link>
                <a 
                  href="/recursos/blue-education-impact-report.pdf" 
                  className="btn-secondary text-lg px-8 py-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Descargar Reporte de Impacto
                </a>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                <p>📞 <strong>Línea directa de impacto social:</strong> +52 (55) 1234-5678</p>
                <p>✉️ <strong>Email:</strong> impacto@bluesystem.io</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="section-padding bg-gradient-hero text-white">
          <div className="container-custom text-center">
            <motion.div 
              className="max-w-4xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h3 
                className="text-3xl md:text-4xl font-bold mb-6"
                variants={itemVariants}
              >
                ¿Listo para convertir tu visión en <span className="text-yellow-300">software imparable</span>?
              </motion.h3>
              
              <motion.p 
                className="text-xl text-blue-100 mb-8 leading-relaxed"
                variants={itemVariants}
              >
                No vendemos desarrollo web. Forjamos ecosistemas digitales que redefinen industrias completas. 
                El primer paso hacia tu revolución digital comienza ahora.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                variants={itemVariants}
              >
                <Link 
                  to="/contacto" 
                  className="bg-white text-blue-primary hover:bg-blue-50 font-semibold py-4 px-8 rounded-lg transition-all duration-300 text-lg shadow-lg hover:shadow-xl"
                >
                  Iniciar Revolución Digital
                </Link>
                <Link 
                  to="/servicios" 
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-primary font-semibold py-4 px-8 rounded-lg transition-all duration-300 text-lg"
                >
                  Explorar Más Armas
                </Link>
              </motion.div>

              <motion.div 
                className="mt-12 text-blue-100"
                variants={itemVariants}
              >
                <p className="mb-4">🔥 <strong>Oferta especial:</strong> Consultoría estratégica GRATUITA para las primeras 5 empresas</p>
                <p className="text-sm">* Auditoria completa de tu ecosistema tecnológico • Roadmap de transformación personalizado • Sin compromisos</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default DesarrolloWebPage;