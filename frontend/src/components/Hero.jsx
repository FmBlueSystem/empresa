import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { trackServiceInterest, trackEvent } from './Analytics';

/**
 * Componente Hero - Sección principal de la página de inicio
 * Incluye título impactante, subtítulo, CTA y elementos visuales
 * Fase 2: Microanimaciones profesionales con Framer Motion
 */
const Hero = () => {
  
  // Variantes de animación para diferentes elementos
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    },
    hover: {
      scale: 1.05,
      y: -2,
      transition: {
        duration: 0.2,
        ease: 'easeInOut'
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, 0, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  // Handlers para analytics
  const handleCtaClick = (ctaType) => {
    trackEvent('hero_cta_click', {
      category: 'engagement',
      label: ctaType,
      cta_type: ctaType
    });
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Elementos decorativos de fondo animados */}
      <div className="absolute inset-0">
        {/* Círculos decorativos con animaciones suaves */}
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-white/3 rounded-full blur-3xl"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2, duration: 8, repeat: Infinity }}
        />
        
        {/* Patrón de puntos con aparición gradual */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 1, duration: 2 }}
        >
          {[
            { top: '25%', left: '25%', size: 'w-2 h-2' },
            { top: '33%', right: '33%', size: 'w-1 h-1' },
            { bottom: '25%', left: '33%', size: 'w-1.5 h-1.5' },
            { bottom: '33%', right: '25%', size: 'w-2 h-2' }
          ].map((dot, index) => (
            <motion.div
              key={index}
              className={`absolute ${dot.size} bg-white rounded-full`}
              style={{ 
                top: dot.top, 
                left: dot.left, 
                right: dot.right, 
                bottom: dot.bottom 
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: 1.5 + index * 0.3, 
                duration: 0.5,
                repeat: Infinity,
                repeatType: 'reverse',
                repeatDelay: 3
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 container-custom text-center text-white">
        <motion.div 
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Título principal con animación espectacular */}
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            variants={titleVariants}
          >
            No transformamos empresas.
            <motion.span 
              className="block text-yellow-300"
              initial={{ opacity: 0, rotateX: -90 }}
              animate={{ opacity: 1, rotateX: 0 }}
              transition={{ delay: 1, duration: 0.8, ease: 'easeOut' }}
            >
              Redefinimos industrias.
            </motion.span>
          </motion.h1>

          {/* Subtítulo con efecto de escritura */}
          <motion.p 
            className="text-lg md:text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed"
            variants={subtitleVariants}
          >
            Mientras otros implementan software, nosotros <strong>catalizamos revoluciones digitales</strong>. 
            SAP, IA y Automatización no son tecnologías... son armas de disrupción masiva.
          </motion.p>

          {/* Botones CTA con hover premium */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            variants={subtitleVariants}
          >
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link 
                to="/contacto" 
                className="btn-primary bg-white text-blue-primary hover:bg-blue-50 text-lg px-8 py-4 min-w-[220px] shadow-lg hover:shadow-xl transition-all duration-300"
                aria-label="Iniciar revolución digital con BlueSystem"
                onClick={() => handleCtaClick('iniciar_revolucion')}
              >
                Iniciar Revolución
              </Link>
            </motion.div>
            
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link 
                to="/servicios" 
                className="bg-white/10 border-2 border-white text-white hover:bg-white hover:text-blue-primary text-lg px-8 py-4 min-w-[220px] backdrop-blur-md hover:backdrop-blur-lg transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                aria-label="Descubrir armas de disrupción digital"
                onClick={() => handleCtaClick('descubrir_arsenal')}
              >
                Descubrir Arsenal
              </Link>
            </motion.div>
          </motion.div>

          {/* Indicadores de confianza con animaciones individuales */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-6 text-blue-100"
            variants={subtitleVariants}
          >
            {[
              {
                icon: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z",
                color: "text-yellow-300",
                text: "Metodología Blue Framework"
              },
              {
                icon: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                color: "text-green-300",
                text: "ROI 300%+ garantizado",
                fillRule: "evenodd",
                clipRule: "evenodd"
              },
              {
                icon: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
                color: "text-blue-300",
                text: "Disrupción certificada",
                fillRule: "evenodd",
                clipRule: "evenodd"
              }
            ].map((item, index) => (
              <React.Fragment key={index}>
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 + index * 0.2, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <motion.svg 
                    className={`w-5 h-5 ${item.color}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path 
                      d={item.icon}
                      fillRule={item.fillRule} 
                      clipRule={item.clipRule} 
                    />
                  </motion.svg>
                  <span className="font-medium">{item.text}</span>
                </motion.div>
                
                {index < 2 && (
                  <motion.div 
                    className="hidden sm:block w-px h-6 bg-blue-300"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 24, opacity: 1 }}
                    transition={{ delay: 2.5 + index * 0.2, duration: 0.3 }}
                  />
                )}
              </React.Fragment>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Flecha indicadora de scroll con animación mejorada */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: {
            delay: 3,
            duration: 0.5
          }
        }}
        whileHover={{ scale: 1.2, y: -5 }}
        onClick={() => {
          document.querySelector('#servicios')?.scrollIntoView({ 
            behavior: 'smooth' 
          });
          trackEvent('scroll_indicator_click', { 
            category: 'navigation',
            label: 'hero_to_services' 
          });
        }}
      >
        <motion.svg 
          className="w-6 h-6 text-white/70 hover:text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
          animate={{ 
            y: [0, 8, 0],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </motion.svg>
      </motion.div>
    </section>
  );
};

export default Hero; 