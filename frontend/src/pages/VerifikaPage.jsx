import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';

/**
 * Página de presentación de Verifika - Sistema de validación de actividades técnicas
 */
const VerifikaPage = () => {
  return (
    <>
      {/* SEO específico para Verifika */}
      <SEO 
        title="Verifika - Sistema de Validación de Actividades Técnicas"
        description="Verifika es nuestro sistema innovador para la gestión y validación de actividades técnicas diarias. Permite a técnicos registrar sus actividades, a clientes validarlas, y a administradores gestionar todo el proceso con métricas y reportes en tiempo real."
        keywords="verifika, validación actividades, gestión técnicos, sistema seguimiento, control calidad, automatización"
        ogImage="/images/verifika-og.jpg"
      />

      <div className="min-h-screen">
        {/* Header de la página */}
        <PageHeader
          title="Verifika"
          subtitle="Sistema Inteligente de Validación de Actividades Técnicas"
          description="Revoluciona la gestión de tu equipo técnico con nuestro sistema completo de seguimiento, validación y reportes en tiempo real."
          breadcrumbs={[
            { label: 'Inicio', path: '/' },
            { label: 'Verifika', path: '/verifika' }
          ]}
        />

        {/* Contenido principal */}
        <div className="container-custom py-16">
          
          {/* Sección: Qué es Verifika */}
          <section className="mb-20">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                FASE 2.2 Completada - Módulo de Técnicos Operativo
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-dark mb-6">
                ¿Qué es Verifika?
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Verifika es nuestro sistema web completo para la gestión y validación de actividades técnicas diarias. 
                Una solución integral que permite optimizar la productividad, asegurar la calidad del trabajo y 
                mantener una comunicación transparente entre técnicos, clientes y administradores.
              </p>
            </div>

            {/* Características principales */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center p-6 bg-white rounded-xl shadow-soft border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-dark mb-3">Para Técnicos</h3>
                <p className="text-gray-600">
                  Registra actividades diarias con detalles, horarios, archivos adjuntos y auto-cálculo de horas trabajadas.
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-xl shadow-soft border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-dark mb-3">Para Clientes</h3>
                <p className="text-gray-600">
                  Valida o rechaza actividades con comentarios, mantén control de calidad y seguimiento en tiempo real.
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-xl shadow-soft border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-dark mb-3">Para Administradores</h3>
                <p className="text-gray-600">
                  Gestiona usuarios, asignaciones, métricas de productividad y genera reportes ejecutivos completos.
                </p>
              </div>
            </div>
          </section>

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

          {/* Call to Action */}
          <section className="text-center">
            <div className="max-w-4xl mx-auto bg-gradient-primary rounded-2xl p-8 md:p-12 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                ¿Listo para Revolucionar tu Gestión Técnica?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Verifika estará disponible próximamente. Mantente informado sobre nuestro progreso y 
                sé el primero en acceder cuando esté listo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/contacto" 
                  className="btn-secondary bg-white text-blue-600 hover:bg-gray-50"
                >
                  Solicitar Demo
                </Link>
                <Link 
                  to="/contacto"
                  className="btn-secondary border-white text-white hover:bg-white hover:text-blue-600"
                >
                  Más Información
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default VerifikaPage;