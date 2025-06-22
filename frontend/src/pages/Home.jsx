import React from 'react';
import Hero from '../components/Hero';
import ServicesSection from '../components/ServicesSection';
import TrustSection from '../components/TrustSection';

/**
 * Página Home - Página principal del sitio web BlueSystem.io
 * Integra todos los componentes principales: Hero, Servicios, Confianza
 */
const Home = () => {
  return (
    <main className="min-h-screen">
      {/* Sección Hero principal */}
      <Hero />
      
      {/* Sección de servicios */}
      <ServicesSection />
      
      {/* Sección de confianza y testimonios */}
      <TrustSection />
    </main>
  );
};

export default Home; 