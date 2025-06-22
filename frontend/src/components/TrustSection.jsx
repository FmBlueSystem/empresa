import React from 'react';

/**
 * Componente TrustSection - Sección de confianza que muestra logos de clientes
 * y testimonios para generar credibilidad
 */
const TrustSection = () => {
  // Sectores que hemos revolucionado
  const industries = [
    { name: "FinTech Revolution", logo: "FT" },
    { name: "ManufacturingNext", logo: "MN" },
    { name: "RetailDisrupt", logo: "RD" },
    { name: "HealthTech Elite", logo: "HT" },
    { name: "LogisticsPro", logo: "LP" },
    { name: "EnergyFuture", logo: "EF" }
  ];

  // Casos de transformación real
  const transformations = [
    {
      id: 1,
      text: "Pensé que estábamos comprando software SAP. En realidad, compramos una nueva empresa. BlueSystem no implementó un sistema... rediseñó nuestro ADN corporativo.",
      author: "Dr. Elena Vásquez",
      position: "CEO, FinTech Revolution",
      impact: "400% ROI en 8 meses",
      rating: 5
    },
    {
      id: 2,
      text: "Sus algoritmos de IA no solo automatizaron procesos... predijeron una crisis de supply chain 6 meses antes que sucediera. Eso nos salvó $2.3M.",
      author: "Marcus Chen",
      position: "COO, ManufacturingNext",
      impact: "Predicción salvó $2.3M",
      rating: 5
    },
    {
      id: 3,
      text: "No contratamos consultores. Contratamos profetas digitales. Cada predicción se ha cumplido. Cada implementación ha sido perfecta.",
      author: "Sarah Thompson",
      position: "CTO, RetailDisrupt",
      impact: "Cero downtime en 2 años",
      rating: 5
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-dark mb-6">
            Industrias que <span className="text-gradient">revolucionamos</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            No tenemos clientes. Tenemos <strong>cómplices de disrupción</strong> que dominan sus mercados 
            después de trabajar con nosotros.
          </p>
        </div>

        {/* Grid de logos de clientes */}
        <div className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {industries.map((industry, index) => (
              <div 
                key={industry.name}
                className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Logo de industria revolucionada */}
                <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  {industry.logo}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de testimonios */}
        <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-dark mb-4">
              Testimonios de líderes visionarios
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Cuando los CEOs más audaces hablan, el mercado escucha. Estos son sus veredictos.
            </p>
          </div>

          {/* Grid de testimonios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {transformations.map((transformation, index) => (
              <div 
                key={transformation.id}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Estrellas de rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(transformation.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Texto del testimonio */}
                <blockquote className="text-gray-600 mb-4 italic leading-relaxed">
                  "{transformation.text}"
                </blockquote>
                
                {/* Impacto medible */}
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <div className="text-sm font-semibold text-blue-primary">Impacto Medible:</div>
                  <div className="text-sm text-blue-700">{transformation.impact}</div>
                </div>

                {/* Información del autor */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                    {transformation.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-dark">{transformation.author}</div>
                    <div className="text-sm text-gray-500">{transformation.position}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estadísticas de confianza */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="animate-fade-in">
            <div className="text-4xl font-bold text-blue-primary mb-2">12</div>
            <div className="text-gray-600 font-medium">Industrias Dominadas</div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="text-4xl font-bold text-green-600 mb-2">$47M</div>
            <div className="text-gray-600 font-medium">Ahorros Generados</div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-4xl font-bold text-purple-600 mb-2">89</div>
            <div className="text-gray-600 font-medium">Días Promedio Transformación</div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="text-4xl font-bold text-orange-600 mb-2">∞</div>
            <div className="text-gray-600 font-medium">Potencial Desbloqueado</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection; 