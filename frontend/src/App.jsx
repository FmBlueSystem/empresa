import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import axios from 'axios'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Components
import Home from './pages/Home'
import ServicesPage from './pages/ServicesPage'
import SuccessStories from './pages/SuccessStories'
import ContactPage from './pages/ContactPage'
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
      const response = await axios.get(`${API_BASE_URL}/test`, { timeout: 2000 })
      setApiHealth('healthy')
      console.log('✅ API conectada:', response.data)
    } catch (error) {
      setApiHealth('unhealthy')
      // Solo mostrar error en desarrollo, no en producción
      if (import.meta.env.DEV) {
        console.warn('⚠️ API backend no disponible - funcionando en modo frontend-only')
      }
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
      <div className="App min-h-screen flex flex-col">
        {/* Barra de navegación */}
        <Navbar />
        
        {/* Contenido principal */}
        <div className="flex-grow">
          <Routes>
            {/* Página principal */}
            <Route path="/" element={<Home />} />
            
            {/* Páginas principales */}
            <Route path="/servicios" element={<ServicesPage />} />
            <Route path="/casos-de-exito" element={<SuccessStories />} />
            <Route path="/contacto" element={<ContactPage />} />
            
            {/* Subpáginas de servicios (placeholders) */}
            <Route path="/servicios/sap" element={<div className="pt-20 min-h-screen flex items-center justify-center"><h1 className="text-4xl font-bold text-gray-dark">Consultoría SAP - Próximamente</h1></div>} />
            <Route path="/servicios/ia" element={<div className="pt-20 min-h-screen flex items-center justify-center"><h1 className="text-4xl font-bold text-gray-dark">Automatización IA - Próximamente</h1></div>} />
            <Route path="/servicios/office365" element={<div className="pt-20 min-h-screen flex items-center justify-center"><h1 className="text-4xl font-bold text-gray-dark">Office 365 - Próximamente</h1></div>} />
            <Route path="/servicios/desarrollo-web" element={<div className="pt-20 min-h-screen flex items-center justify-center"><h1 className="text-4xl font-bold text-gray-dark">Desarrollo Web - Próximamente</h1></div>} />
            
            {/* Otras páginas futuras */}
            <Route path="/sobre-nosotros" element={<div className="pt-20 min-h-screen flex items-center justify-center"><h1 className="text-4xl font-bold text-gray-dark">Sobre Nosotros - Próximamente</h1></div>} />
            
            {/* Páginas legales */}
            <Route path="/privacidad" element={<div className="pt-20 min-h-screen flex items-center justify-center"><h1 className="text-4xl font-bold text-gray-dark">Política de Privacidad - Próximamente</h1></div>} />
            <Route path="/terminos" element={<div className="pt-20 min-h-screen flex items-center justify-center"><h1 className="text-4xl font-bold text-gray-dark">Términos de Servicio - Próximamente</h1></div>} />
            
            {/* Rutas del sistema (legacy) */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            
            {/* Página 404 */}
            <Route path="*" element={
              <div className="pt-20 min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-dark mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-8">Página no encontrada</p>
                  <a href="/" className="btn-primary">Volver al inicio</a>
                </div>
              </div>
            } />
          </Routes>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </Router>
  )
}

export default App 