import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import axios from 'axios'
import './App.css'

// Performance Optimization Components
import ResourcePreloader, { CriticalCSS, ServiceWorkerLoader, useSmartPreload } from './components/ResourcePreloader'
import { preloadCriticalComponents, createLazyRoute, addResourceHints } from './utils/bundleOptimization.jsx'

// UX Enhancement Components
import ErrorBoundary, { withErrorBoundary } from './components/ErrorBoundary'
import WebVitalsMonitor, { WebVitalsDashboard } from './components/WebVitalsMonitor'
import { LoadingOverlay, PageTransitionLoader, Spinner } from './components/LoadingStates'

// Critical Components (loaded immediately)
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SEO from './components/SEO'
import SchemaMarkup from './components/SchemaMarkup'
import Analytics from './components/Analytics'
import AccessibilityProvider from './components/AccessibilityProvider'

// Lazy-loaded Pages (code splitting)
const Home = createLazyRoute('/', () => import('./pages/Home'))
const ServicesPage = createLazyRoute('/servicios', () => import('./pages/ServicesPage'))
const SuccessStories = createLazyRoute('/casos-de-exito', () => import('./pages/SuccessStories'))
const ContactPage = createLazyRoute('/contacto', () => import('./pages/ContactPage'))
const AboutPage = createLazyRoute('/sobre-nosotros', () => import('./pages/AboutPage'))
const PrivacyPage = createLazyRoute('/privacidad', () => import('./pages/PrivacyPage'))
const TermsPage = createLazyRoute('/terminos', () => import('./pages/TermsPage'))
const DesarrolloWebPage = createLazyRoute('/servicios/desarrollo-web', () => import('./pages/DesarrolloWebPage'))
const VerifikaPage = createLazyRoute('/verifika', () => import('./pages/VerifikaPage'))

import PlaceholderPage from './pages/PlaceholderPage';

// Legacy Components (lazy loaded)
const Dashboard = createLazyRoute('/dashboard', () => import('./components/Dashboard'))
const Login = createLazyRoute('/login', () => import('./components/Login'))

// API configuration
const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api'

import { useAuth } from './hooks/useAuth';

import { getApiHealth } from './services/api';

function App() {
  const { user, loading: authLoading, login, logout } = useAuth();
  const [apiHealth, setApiHealth] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);

  // Initialize performance optimizations
  useSmartPreload();

  // Check API health on mount
  useEffect(() => {
    checkApiHealth();
    
    // Initialize performance optimizations
    preloadCriticalComponents();
    addResourceHints();
  }, []);

  const checkApiHealth = async () => {
    try {
      const { data } = await getApiHealth();
      setApiHealth('healthy');
    } catch (error) {
      setApiHealth('unhealthy');
      // Solo mostrar error en desarrollo, no en producción
      if (import.meta.env.DEV) {
        console.warn('⚠️ API backend no disponible - funcionando en modo frontend-only');
      }
    }
  };

  if (authLoading) {
    return (
      <div className="loading-container min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <Spinner size="large" className="mb-4" />
          <p className="text-lg font-medium text-gray-700">Cargando BlueSystem.io...</p>
          <p className="text-sm text-gray-500 mt-2">Preparando la revolución digital...</p>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <AccessibilityProvider>
        <ErrorBoundary level="page" component="App">
          <Router>
            <div className="App min-h-screen flex flex-col">
              {/* Performance Optimization Components */}
              <ResourcePreloader />
              <CriticalCSS />
              <ServiceWorkerLoader />
              
              {/* UX Enhancement Components */}
              <WebVitalsMonitor reportToAnalytics={true} />
              <PageTransitionLoader isLoading={pageLoading} />
              {import.meta.env.DEV && <WebVitalsDashboard />}
              
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
            <ErrorBoundary level="component" component="MainContent">
              <Routes>
            {/* Página principal */}
            <Route path="/" element={<Home />} />
            
            {/* Páginas principales */}
            <Route path="/servicios" element={<ServicesPage />} />
            <Route path="/casos-de-exito" element={<SuccessStories />} />
            <Route path="/verifika" element={<VerifikaPage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/sobre-nosotros" element={<AboutPage />} />
            
            {/* Subpáginas de servicios (placeholders) */}
            <Route path="/servicios/sap" element={<PlaceholderPage title="Consultoría SAP" />} />
            <Route path="/servicios/ia" element={<PlaceholderPage title="Automatización IA" />} />
            <Route path="/servicios/office365" element={<PlaceholderPage title="Office 365" />} />
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
            </ErrorBoundary>
          </main>
        
          {/* Footer */}
          <footer role="contentinfo">
            <Footer />
          </footer>
            </div>
          </Router>
        </ErrorBoundary>
      </AccessibilityProvider>
    </HelmetProvider>
  )
}

export default App