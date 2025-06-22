import React, { useState } from 'react'

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

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-icon">🔵</span>
            <h1>BlueSystem.io</h1>
          </div>
          <h2>Iniciar Sesión</h2>
          <p>Accede a tu cuenta para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <span>❌</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="tu-email@ejemplo.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Tu contraseña"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={`login-btn ${loading ? 'loading' : ''}`}
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <>
                <div className="btn-spinner"></div>
                Iniciando sesión...
              </>
            ) : (
              <>
                🚀 Iniciar Sesión
              </>
            )}
          </button>
        </form>

        <div className="login-demo">
          <div className="demo-section">
            <h3>🧪 Credenciales de Prueba</h3>
            <p>Para probar la aplicación, puedes usar:</p>
            <div className="demo-credentials">
              <div className="credential-item">
                <strong>Email:</strong> admin@bluesystem.io
              </div>
              <div className="credential-item">
                <strong>Password:</strong> admin123
              </div>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="demo-btn"
              disabled={loading}
            >
              📝 Rellenar Credenciales Demo
            </button>
          </div>
        </div>

        <div className="login-footer">
          <p>
            &copy; 2025 BlueSystem.io - Desarrollado por Freddy
          </p>
          <div className="version-info">
            <span>Frontend v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login 