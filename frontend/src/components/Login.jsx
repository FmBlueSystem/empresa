import React, { useState } from 'react'
import { motion } from 'framer-motion'

function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await onLogin(credentials)
      
      if (!result.success) {
        setError(result.message || 'Error de inicio de sesión')
      }
    } catch (error) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  const fillDemoCredentials = () => {
    setCredentials({
      email: 'admin@bluesystem.io',
      password: 'admin123'
    })
  }

  const isFormValid = credentials.email && credentials.password

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div 
        className="bg-white rounded-xl shadow-2xl max-w-md w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="p-8 pb-6" variants={itemVariants}>
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl">🔵</span>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                BlueSystem.io
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-gray-600 text-sm">
              Accede a tu cuenta para continuar
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div className="px-8 pb-8" variants={itemVariants}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
              <span>❌</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu-email@ejemplo.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu contraseña"
                required
                disabled={loading}
              />
            </div>

            <motion.button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  🚀 Iniciar Sesión
                </>
              )}
            </motion.button>
          </form>

          {/* Demo Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center justify-center gap-2">
                🧪 Credenciales de Prueba
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Para probar la aplicación, puedes usar:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="font-medium">Email:</span>
                    <span className="text-blue-600">admin@bluesystem.io</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Password:</span>
                    <span className="text-blue-600">admin123</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={fillDemoCredentials}
                disabled={loading}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                📝 Rellenar Credenciales Demo
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500 mb-2">
              &copy; 2025 BlueSystem.io - Desarrollado por Freddy
            </p>
            <div className="text-xs text-gray-400">
              Frontend v1.0.0
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login
