import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import VerifikaLogin from '../components/VerifikaLogin';

/**
 * Página de presentación de Verifika - Sistema de validación de actividades técnicas
 */
const VerifikaPage = () => {
  const [showLogin, setShowLogin] = useState(false);

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

  return (
    <>
      {/* SEO específico para Verifika */}
      <SEO 
        title="Verifika - Sistema de Validación de Actividades Técnicas"
        description="Verifika es nuestro sistema innovador para la gestión y validación de actividades técnicas diarias. Permite a técnicos registrar sus actividades, a clientes validarlas, y a administradores gestionar todo el proceso con métricas y reportes en tiempo real."
        keywords="verifika, validación actividades, gestión técnicos, sistema seguimiento, control calidad, automatización"
        ogImage="/images/verifika-og.jpg"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        
        {/* Hero Section Moderno */}
        <section className="relative bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800 text-white overflow-hidden">
          {/* Patrón de fondo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-600 animate-pulse"></div>
          </div>
          
          <div className="relative container-custom py-24 lg:py-32">
            <motion.div 
              className="text-center max-w-5xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                className="inline-flex items-center gap-2 bg-blue-900/30 text-blue-100 px-4 py-2 rounded-full text-sm font-medium mb-6"
                variants={itemVariants}
              >
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                Proyecto I+D en Desarrollo - Innovación BlueSystem
              </motion.div>
              
              <motion.h1 
                className="text-5xl lg:text-6xl font-bold mb-6"
                variants={itemVariants}
              >
                <span className="bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                  Verifika
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
                  El Futuro de la Gestión Técnica
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed"
                variants={itemVariants}
              >
                Nuestro proyecto de investigación y desarrollo para revolucionar la validación de actividades técnicas.
                Mientras perfeccionamos esta innovación, seguimos entregando soluciones empresariales probadas.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                variants={itemVariants}
              >
                <motion.button
                  onClick={() => setShowLogin(true)}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Acceder a Demo
                </motion.button>
                <Link 
                  to="/contacto"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
                >
                  Más Información
                </Link>
              </motion.div>
            </motion.div>
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
            
            {/* Sección: Qué es Verifika */}
            <motion.section 
              className="mb-20"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div className="max-w-4xl mx-auto text-center mb-12" variants={itemVariants}>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  ¿Qué es <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Verifika</span>?
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  Nuestro proyecto de investigación y desarrollo para crear el futuro de la gestión técnica. 
                  Mientras perfeccionamos esta innovación, BlueSystem continúa entregando soluciones empresariales 
                  probadas en SAP, automatización IA y desarrollo web.
                </p>
              </motion.div>

              {/* Características principales */}
              <motion.div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto" variants={itemVariants}>
                <div className="group text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">Para Técnicos</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Registra actividades diarias con detalles, horarios, archivos adjuntos y auto-cálculo de horas trabajadas.
                    </p>
                  </div>
                </div>

                <div className="group text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-green-200 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">Para Clientes</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Valida o rechaza actividades con comentarios, mantén control de calidad y seguimiento en tiempo real.
                    </p>
                  </div>
                </div>

                <div className="group text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-purple-200 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">Para Administradores</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Gestiona usuarios, asignaciones, métricas de productividad y genera reportes ejecutivos completos.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.section>

          {/* Sección: Funcionalidades */}
          <section className="mb-20">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-dark mb-6">
                Funcionalidades Principales
              </h2>
              <p className="text-xl text-gray-600">
                Un sistema completo diseñado para optimizar cada aspecto de la gestión técnica
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-dark mb-2">Auto-cálculo de Horas</h3>
                    <p className="text-gray-600">Cálculo automático de horas trabajadas basado en hora de inicio y fin.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-dark mb-2">Gestión de Archivos</h3>
                    <p className="text-gray-600">Upload de fotos, PDFs y documentos con preview y almacenamiento seguro.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-dark mb-2">Sistema de Competencias</h3>
                    <p className="text-gray-600">Gestión completa de competencias técnicas y certificaciones profesionales.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7H4l5-5v5zM12 2v20" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-dark mb-2">Workflow de Validación</h3>
                    <p className="text-gray-600">Proceso estructurado de aprobación/rechazo con comentarios y historial.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-dark mb-2">Dashboards Ejecutivos</h3>
                    <p className="text-gray-600">KPIs en tiempo real, métricas de productividad y análisis de rendimiento.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-dark mb-2">Exportación Avanzada</h3>
                    <p className="text-gray-600">Genera reportes en Excel/PDF con filtros personalizados y datos detallados.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7H4l5-5v5zM13 2v20" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-dark mb-2">Notificaciones Inteligentes</h3>
                    <p className="text-gray-600">Alertas automáticas por email y sistema de recordatorios configurables.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-dark mb-2">Seguridad Avanzada</h3>
                    <p className="text-gray-600">Sistema de autenticación seguro, roles de usuario y auditoría completa de acciones.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sección: Estado del Proyecto */}
          <section className="mb-20">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 border border-blue-100">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-dark mb-4">
                    Estado del Desarrollo
                  </h2>
                  <p className="text-xl text-gray-600">
                    Sistema de validación de actividades técnicas
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-white rounded-xl shadow-soft">
                    <div className="text-3xl font-bold text-green-600 mb-2">35%</div>
                    <div className="text-sm text-gray-600">Completado</div>
                    <div className="text-xs text-gray-500 mt-1">Autenticación + Técnicos + Competencias</div>
                  </div>
                  <div className="text-center p-6 bg-white rounded-xl shadow-soft">
                    <div className="text-3xl font-bold text-blue-600 mb-2">168</div>
                    <div className="text-sm text-gray-600">Tareas Identificadas</div>
                    <div className="text-xs text-gray-500 mt-1">Backend, Frontend, Testing</div>
                  </div>
                  <div className="text-center p-6 bg-white rounded-xl shadow-soft">
                    <div className="text-3xl font-bold text-purple-600 mb-2">16</div>
                    <div className="text-sm text-gray-600">Semanas Estimadas</div>
                    <div className="text-xs text-gray-500 mt-1">Hasta Go-Live Completo</div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-soft">
                    <h3 className="text-xl font-bold text-gray-dark mb-4">✅ Componentes Implementados:</h3>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Servidor web robusto</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Base de datos estructurada</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Autenticación segura</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Sistema de roles y permisos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Gestión de usuarios</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Sistema de competencias</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Carga de documentos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Validación de datos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Gestión de sesiones</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Sistema de logs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Middleware de Seguridad</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Tests Unitarios e Integración</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-soft">
                    <h3 className="text-xl font-bold text-gray-dark mb-4">🚀 Próximas Fases:</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                        <span className="font-medium">FASE 2.3 - Gestión de Clientes</span>
                        <span className="text-sm text-gray-500">(19 tareas - 2 semanas)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">FASE 3 - Actividades y Validaciones</span>
                        <span className="text-sm text-gray-500">(45 tareas - 4 semanas)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="font-medium">FASE 4 - Dashboard y Reportes</span>
                        <span className="text-sm text-gray-500">(25 tareas - 3 semanas)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                        <span className="font-medium">FASE 5 - Frontend React</span>
                        <span className="text-sm text-gray-500">(30 tareas - 3.5 semanas)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sección: Integración con BlueSystem */}
          <section className="mb-20">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-dark mb-6">
                Integración con BlueSystem
              </h2>
              <p className="text-xl text-gray-600">
                Verifika se integra perfectamente con nuestra infraestructura existente
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-xl p-8 shadow-soft border border-gray-100">
                <h3 className="text-xl font-bold text-gray-dark mb-4">Características Principales</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Interfaz intuitiva y fácil de usar
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Integración perfecta con sistemas existentes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Base de datos segura y confiable
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Sistema de autenticación seguro
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-soft border border-gray-100">
                <h3 className="text-xl font-bold text-gray-dark mb-4">Beneficios Clave</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <strong>Automatización:</strong> Reduce tiempo de validación manual
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <strong>Transparencia:</strong> Seguimiento en tiempo real de actividades
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <strong>Eficiencia:</strong> Optimiza procesos de validación
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <strong>Trazabilidad:</strong> Historial completo de actividades
                  </li>
                </ul>
              </div>
            </div>
          </section>

            {/* Call to Action modernizado */}
            <motion.section 
              className="text-center"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div 
                className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-12 border border-indigo-100"
                variants={itemVariants}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  El Futuro de la <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Gestión Técnica</span>
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Verifika representa nuestra inversión en I+D para revolucionar la industria. 
                  Mientras desarrollamos esta innovación, seguimos entregando valor con nuestras soluciones probadas.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    onClick={() => setShowLogin(true)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Acceder a Demo
                  </motion.button>
                  <Link 
                    to="/contacto" 
                    className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-600 hover:text-white transition-all duration-300"
                  >
                    Solicitar Información
                  </Link>
                </div>
              </motion.div>
            </motion.section>
          </div>
        </main>
      </div>

      {/* Modal de Login */}
      {showLogin && (
        <VerifikaLogin onClose={() => setShowLogin(false)} />
      )}
    </>
  );
};

export default VerifikaPage;