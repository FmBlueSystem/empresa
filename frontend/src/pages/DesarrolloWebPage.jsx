import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/SchemaMarkup';

/**
 * Página de Desarrollo Web Empresarial
 * Servicio especializado en aplicaciones web modernas, escalables y seguras
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

  // Datos del servicio
  const technologies = [
    { name: 'React', icon: '⚛️', description: 'Interfaces interactivas y modernas' },
    { name: 'Node.js', icon: '🟢', description: 'Backend escalable y performante' },
    { name: 'TypeScript', icon: '🔷', description: 'Código robusto y mantenible' },
    { name: 'Docker', icon: '🐳', description: 'Contenedores y DevOps' },
    { name: 'AWS/Azure', icon: '☁️', description: 'Arquitectura cloud-native' },
    { name: 'PostgreSQL', icon: '🐘', description: 'Base de datos empresarial' }
  ];

  const features = [
    {
      title: 'Full-Stack Development',
      description: 'Desarrollo completo desde frontend hasta backend con las mejores tecnologías',
      icon: '🚀'
    },
    {
      title: 'APIs RESTful & GraphQL',
      description: 'Interfaces de programación escalables y eficientes para integración empresarial',
      icon: '🔌'
    },
    {
      title: 'Arquitectura Cloud-Native',
      description: 'Aplicaciones diseñadas para la nube con microservicios y contenedores',
      icon: '☁️'
    },
    {
      title: 'Paneles Administrativos',
      description: 'Dashboards personalizados para gestión y análisis de datos empresariales',
      icon: '📊'
    },
    {
      title: 'Seguridad Empresarial',
      description: 'Autenticación robusta, autorización y cumplimiento de estándares de seguridad',
      icon: '🔒'
    },
    {
      title: 'Integración Legacy',
      description: 'Conectores con sistemas existentes (SAP, ERP, CRM) sin interrupciones',
      icon: '🔗'
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
      {/* SEO específico para Desarrollo Web */}
      <SEO 
        title="Desarrollo Web Empresarial - Aplicaciones Escalables | BlueSystem"
        description="Desarrollo de aplicaciones web modernas, escalables y seguras para empresas. React, Node.js, Cloud-Native. Transformamos tu visión en software de clase mundial."
        keywords="desarrollo web empresarial, aplicaciones web escalables, React Node.js, software empresarial, aplicaciones cloud"
        ogImage="/images/desarrollo-web-og.jpg"
      />
      
      <SchemaMarkup 
        type="service" 
        data={{
          name: "Desarrollo Web Empresarial",
          description: "Aplicaciones web modernas, escalables y seguras diseñadas para empresas",
          provider: "BlueSystem",
          areaServed: "México",
          availableChannel: "https://bluesystem.io/contacto"
        }}
      />

      {/* Header de la página */}
      <PageHeader 
        title="Desarrollo Web Empresarial"
        subtitle="No creamos sitios web. Forjamos ecosistemas digitales que convierten procesos empresariales en ventajas competitivas demoledoras."
        breadcrumb="Servicios / Desarrollo Web"
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
                Mientras otros construyen páginas web, nosotros <span className="text-gradient">fabricamos imperios digitales</span>
              </motion.h2>
              
              <motion.p 
                className="text-lg text-gray-600 leading-relaxed mb-8"
                variants={itemVariants}
              >
                Cada línea de código que escribimos está diseñada para <strong>catapultar tu empresa</strong> hacia el dominio total de tu industria. 
                No vendemos desarrollo web... entregamos <strong>armas de disrupción masiva</strong> disfrazadas de aplicaciones elegantes.
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

        {/* Tecnologías y Stack */}
        <section className="section-padding bg-gradient-to-br from-blue-50 to-indigo-50">
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
                Arsenal Tecnológico de <span className="text-gradient">Última Generación</span>
              </motion.h3>
              <motion.p 
                className="text-lg text-gray-600 max-w-3xl mx-auto"
                variants={itemVariants}
              >
                Utilizamos únicamente tecnologías que han demostrado su poder destructivo en los campos de batalla más exigentes del desarrollo empresarial.
              </motion.p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-2 md:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {technologies.map((tech, index) => (
                <motion.div 
                  key={index}
                  className="card p-6 text-center hover:shadow-xl transition-all duration-300"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="text-4xl mb-4">{tech.icon}</div>
                  <h4 className="text-xl font-bold text-gray-dark mb-2">{tech.name}</h4>
                  <p className="text-gray-600 text-sm">{tech.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Características principales */}
        <section className="section-padding">
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
                Capacidades de <span className="text-gradient">Aniquilación Competitiva</span>
              </motion.h3>
              <motion.p 
                className="text-lg text-gray-600 max-w-3xl mx-auto"
                variants={itemVariants}
              >
                Cada funcionalidad está meticulosamente diseñada para convertir tu empresa en el depredador dominante de tu industria.
              </motion.p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="card p-6 hover:shadow-xl transition-all duration-300"
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h4 className="text-xl font-bold text-gray-dark mb-3">{feature.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
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
                Protocolo <span className="text-gradient">Blue Development</span>
              </motion.h3>
              <motion.p 
                className="text-lg text-gray-600 max-w-3xl mx-auto"
                variants={itemVariants}
              >
                Nuestra metodología secreta de 5 fases que convierte ideas empresariales en software de dominación absoluta.
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
                    <div className="text-3xl font-bold text-green-600 mb-2">850+</div>
                    <div className="text-sm text-gray-600">Comunidades Impactadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">2,400+</div>
                    <div className="text-sm text-gray-600">Personas Capacitadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
                    <div className="text-sm text-gray-600">Reducción Brecha Digital</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">150+</div>
                    <div className="text-sm text-gray-600">Organizaciones Aliadas</div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700 text-center">
                    <strong>🏆 Reconocimiento ONU 2024:</strong><br/>
                    "Mejor Iniciativa de Inclusión Digital en Latinoamérica"
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