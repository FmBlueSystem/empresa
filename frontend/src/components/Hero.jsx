import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente Hero - Sección principal de la página de inicio
 * Incluye título impactante, subtítulo, CTA y elementos visuales
 */
const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0">
        {/* Círculos decorativos animados */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-bounce-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Patrón de puntos */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 container-custom text-center text-white">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Título principal */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            No transformamos empresas.
            <span className="block text-yellow-300 animate-slide-up">
              Redefinimos industrias.
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="text-lg md:text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Mientras otros implementan software, nosotros <strong>catalizamos revoluciones digitales</strong>. 
            SAP, IA y Automatización no son tecnologías... son armas de disrupción masiva.
          </p>

          {/* Botones CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-up">
            <Link 
              to="/contacto" 
              className="btn-primary bg-white text-blue-primary hover:bg-blue-50 text-lg px-8 py-4 min-w-[220px]"
              aria-label="Iniciar revolución digital con BlueSystem"
            >
              Iniciar Revolución
            </Link>
            
            <Link 
              to="/servicios" 
              className="btn-secondary border-white text-white hover:bg-white hover:text-blue-primary text-lg px-8 py-4 min-w-[220px]"
              aria-label="Descubrir armas de disrupción digital"
            >
              Descubrir Arsenal
            </Link>
          </div>

          {/* Indicadores de confianza */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-blue-100 animate-slide-up">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium">Metodología Blue Framework</span>
            </div>
            
            <div className="hidden sm:block w-px h-6 bg-blue-300"></div>
            
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">ROI 300%+ garantizado</span>
            </div>
            
            <div className="hidden sm:block w-px h-6 bg-blue-300"></div>
            
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Disrupción certificada</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flecha indicadora de scroll */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg 
          className="w-6 h-6 text-white/70" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero; 