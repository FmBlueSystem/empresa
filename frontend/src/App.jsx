import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import axios from 'axios'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Components
import Home from './pages/Home'
import ServicesPage from './pages/ServicesPage'
import SuccessStories from './pages/SuccessStories'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import DesarrolloWebPage from './pages/DesarrolloWebPage'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import SEO from './components/SEO'
import SchemaMarkup from './components/SchemaMarkup'
import Analytics from './components/Analytics'
import AccessibilityProvider from './components/AccessibilityProvider'

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
    <HelmetProvider>
      <AccessibilityProvider>
        <Router>
          <div className="App min-h-screen flex flex-col">
            {/* Skip links para accesibilidad */}
            <a href="#main-content" className="skip-link">
              Saltar al contenido principal
            </a>
            <a href="#navigation" className="skip-link">
              Saltar a la navegación
            </a>
            
            {/* SEO Global, Schema Markup y Analytics */}
            <SEO />
            <SchemaMarkup type="organization" />
            <SchemaMarkup type="website" />
            <Analytics />
          
          {/* Barra de navegación */}
          <nav id="navigation" aria-label="Navegación principal">
            <Navbar />
          </nav>
          
          {/* Contenido principal */}
          <main id="main-content" className="flex-grow" role="main">
            <Routes>
            {/* Página principal */}
            <Route path="/" element={<Home />} />
            
            {/* Páginas principales */}
            <Route path="/servicios" element={<ServicesPage />} />
            <Route path="/casos-de-exito" element={<SuccessStories />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/sobre-nosotros" element={<AboutPage />} />
            
            {/* Subpáginas de servicios (placeholders) */}
            <Route path="/servicios/sap" element={<div className="pt-20 min-h-screen flex items-center justify-center"><h1 className="text-4xl font-bold text-gray-dark">Consultoría SAP - Próximamente</h1></div>} />
            <Route path="/servicios/ia" element={<div className="pt-20 min-h-screen flex items-center justify-center"><h1 className="text-4xl font-bold text-gray-dark">Automatización IA - Próximamente</h1></div>} />
            <Route path="/servicios/office365" element={<div className="pt-20 min-h-screen flex items-center justify-center"><h1 className="text-4xl font-bold text-gray-dark">Office 365 - Próximamente</h1></div>} />
            <Route path="/servicios/desarrollo-web" element={<DesarrolloWebPage />} />
            
            {/* Otras páginas futuras */}
            
            {/* Páginas legales */}
            <Route path="/privacidad" element={<PrivacyPage />} />
            <Route path="/terminos" element={<TermsPage />} />
            
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
          </main>
        
          {/* Footer */}
          <footer role="contentinfo">
            <Footer />
          </footer>
        </div>
      </Router>
    </AccessibilityProvider>
  </HelmetProvider>
  )
}

export default App 