import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import axios from 'axios'
import './App.css'

// Components
import Dashboard from './components/Dashboard'
import Login from './components/Login'

// API configuration
const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [apiHealth, setApiHealth] = useState(null)

  // Check API health on mount
  useEffect(() => {
    checkApiHealth()
  }, [])

  const checkApiHealth = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/test`)
      setApiHealth('healthy')
      console.log('✅ API conectada:', response.data)
    } catch (error) {
      setApiHealth('unhealthy')
      console.error('❌ Error connecting to API:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials)
      setUser(response.data.user)
      localStorage.setItem('token', response.data.token)
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      }
    }
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('token')
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando BlueSystem.io...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <div className="logo-section">
              <h1 className="logo">
                <span className="logo-icon">🔵</span>
                BlueSystem.io
              </h1>
              <div className="status-indicators">
                <span className={`status-indicator ${apiHealth}`}>
                  API: {apiHealth === 'healthy' ? '✅' : '❌'}
                </span>
              </div>
            </div>
            
            <nav className="main-nav">
              <Link to="/" className="nav-link">Dashboard</Link>
              {user && (
                <div className="user-section">
                  <span className="user-info">
                    👋 Hola, {user.email}
                  </span>
                  <button onClick={handleLogout} className="logout-btn">
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </nav>
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route 
              path="/" 
              element={
                user ? (
                  <Dashboard user={user} apiBaseUrl={API_BASE_URL} />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              } 
            />
            <Route 
              path="/login" 
              element={<Login onLogin={handleLogin} />} 
            />
          </Routes>
        </main>

        <footer className="app-footer">
          <div className="footer-content">
            <p>
              &copy; 2025 BlueSystem.io - Desarrollado por Freddy
            </p>
            <div className="footer-links">
              <span>v1.0.0</span>
              <span>•</span>
              <a 
                href="https://github.com/FmBlueSystem/empresa" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App 