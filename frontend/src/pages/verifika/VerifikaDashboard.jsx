import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import SEO from '../../components/SEO'
import verifikaAPI from '../../services/verifikaApi'

const VerifikaDashboard = () => {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    initializeDashboard()
  }, [])

  const initializeDashboard = async () => {
    try {
      // Check if user is authenticated
      if (!verifikaAPI.isAuthenticated()) {
        navigate('/login')
        return
      }

      // Get user profile
      const userResponse = await verifikaAPI.getProfile()
      if (userResponse.success) {
        setUser(userResponse.data.user)
      }

      // Get dashboard stats (if admin)
      if (verifikaAPI.isAdmin()) {
        try {
          const statsResponse = await verifikaAPI.getDashboardStats()
          if (statsResponse.success) {
            setStats(statsResponse.data.stats)
          }
        } catch (statsError) {
          console.warn('Stats not available:', statsError)
        }
      }

    } catch (error) {
      console.error('Dashboard initialization failed:', error)
      setError('Error al cargar el dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await verifikaAPI.logout()
    navigate('/login')
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando Verifika...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO 
        title="Dashboard Verifika - BlueSystem.io"
        description="Panel de control del sistema Verifika para gestión de actividades técnicas y validaciones"
        keywords="verifika, dashboard, actividades técnicas, validación, gestión"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <motion.header 
          className="bg-white shadow-sm border-b border-gray-200"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <span className="text-2xl">🔵</span>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Verifika Dashboard
                  </h1>
                  <p className="text-sm text-gray-500">Sistema de Validación de Actividades</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {user && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.nombre}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.rol}</p>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm hover:bg-red-200 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Welcome Section */}
            <motion.div className="mb-8" variants={itemVariants}>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                ¡Bienvenido, {user?.nombre}!
              </h2>
              <p className="text-gray-600">
                Acceso exitoso al sistema Verifika. Aquí podrás gestionar tus actividades técnicas.
              </p>
            </motion.div>

            {/* Quick Stats */}
            {stats && (
              <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" variants={itemVariants}>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Usuarios</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalUsers || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">👥</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Técnicos</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalTechnicians || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🔧</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Clientes</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalClients || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🏢</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Actividades</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalActivities || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📋</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Main Content Cards */}
            <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={itemVariants}>
              {/* User Role Based Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Disponibles</h3>
                <div className="space-y-3">
                  {user?.rol === 'admin' && (
                    <>
                      <button className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">👥</span>
                          <div>
                            <p className="font-medium text-gray-900">Gestionar Usuarios</p>
                            <p className="text-sm text-gray-600">Crear, editar y administrar usuarios del sistema</p>
                          </div>
                        </div>
                      </button>
                      <button className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🏢</span>
                          <div>
                            <p className="font-medium text-gray-900">Gestionar Clientes</p>
                            <p className="text-sm text-gray-600">Administrar información de clientes</p>
                          </div>
                        </div>
                      </button>
                    </>
                  )}
                  
                  <button className="w-full text-left p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📋</span>
                      <div>
                        <p className="font-medium text-gray-900">Mis Actividades</p>
                        <p className="text-sm text-gray-600">Ver y gestionar mis actividades técnicas</p>
                      </div>
                    </div>
                  </button>
                  
                  <button className="w-full text-left p-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📊</span>
                      <div>
                        <p className="font-medium text-gray-900">Reportes</p>
                        <p className="text-sm text-gray-600">Generar reportes de actividades y rendimiento</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado del Sistema</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-gray-900">Backend Verifika</span>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Conectado</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-gray-900">Base de Datos</span>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Operacional</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-gray-900">Sesión Activa</span>
                    </div>
                    <span className="text-sm text-blue-600 font-medium">Autenticado</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Development Notice */}
            <motion.div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6" variants={itemVariants}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🚧</span>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">Sistema en Desarrollo</h4>
                  <p className="text-yellow-700 text-sm">
                    Verifika está en desarrollo activo. Las funcionalidades completas se habilitarán progresivamente.
                    Actualmente disponible: autenticación, gestión de usuarios, competencias y clientes.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </>
  )
}

export default VerifikaDashboard
