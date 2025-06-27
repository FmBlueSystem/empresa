import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import axios from 'axios'

// Performance Optimization Components
import ResourcePreloader from './components/ResourcePreloader'
import { preloadCriticalComponents, createLazyRoute, addResourceHints } from './utils/bundleOptimization.jsx'

// Critical Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Application components loaded successfully

// Pages
import Home from './pages/Home'
import ServicesPage from './pages/ServicesPage'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'
import BlueConnectPage from './pages/BlueConnectPage'
import VerifikaPage from './pages/VerifikaPage'
import LoginPage from './pages/LoginPage'
import VerifikaDashboard from './pages/verifika/VerifikaDashboard'

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/servicios" element={<ServicesPage />} />
            <Route path="/blueconnect" element={<BlueConnectPage />} />
            <Route path="/verifika" element={<VerifikaPage />} />
            <Route path="/verifika/dashboard" element={<VerifikaDashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/sobre-nosotros" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </HelmetProvider>
  )
}

export default App
