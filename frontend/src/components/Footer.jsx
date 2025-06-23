import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente Footer - Pie de página con información de contacto, enlaces y redes sociales
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-dark text-white">
      {/* Sección principal del footer */}
      <div className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Información de la empresa */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-blue-primary mb-4">BlueSystem.io</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Transformamos ideas en soluciones digitales que impulsan el crecimiento empresarial. 
                  Especialistas en consultoría SAP, automatización con IA y desarrollo web empresarial.
                </p>
              </div>

              {/* Información de contacto */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <a 
                    href="mailto:contacto@bluesystem.io" 
                    className="text-gray-300 hover:text-blue-primary transition-colors duration-300"
                  >
                    contacto@bluesystem.io
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Ciudad de México, México</span>
                </div>

                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <a 
                    href="tel:+525512345678" 
                    className="text-gray-300 hover:text-blue-primary transition-colors duration-300"
                  >
                    +52 55 1234 5678
                  </a>
                </div>
              </div>
            </div>

            {/* Enlaces de navegación */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Navegación</h4>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/" 
                    className="text-gray-300 hover:text-blue-primary transition-colors duration-300 flex items-center gap-2"
                  >
                    <span>Inicio</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/servicios" 
                    className="text-gray-300 hover:text-blue-primary transition-colors duration-300 flex items-center gap-2"
                  >
                    <span>Servicios</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contacto" 
                    className="text-gray-300 hover:text-blue-primary transition-colors duration-300 flex items-center gap-2"
                  >
                    <span>Contacto</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/sobre-nosotros" 
                    className="text-gray-300 hover:text-blue-primary transition-colors duration-300 flex items-center gap-2"
                  >
                    <span>Sobre Nosotros</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Servicios */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Servicios</h4>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/servicios/sap" 
                    className="text-gray-300 hover:text-blue-primary transition-colors duration-300"
                  >
                    Consultoría SAP
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/servicios/ia" 
                    className="text-gray-300 hover:text-blue-primary transition-colors duration-300"
                  >
                    Automatización IA
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/servicios/office365" 
                    className="text-gray-300 hover:text-blue-primary transition-colors duration-300"
                  >
                    Office 365
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/servicios/desarrollo-web" 
                    className="text-gray-300 hover:text-blue-primary transition-colors duration-300"
                  >
                    Desarrollo Web
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Redes sociales */}
          <div className="mt-12 pt-8 border-t border-gray-600">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              
              {/* Enlaces de redes sociales */}
              <div className="flex items-center gap-6">
                <span className="text-gray-300 font-medium">Síguenos:</span>
                <div className="flex gap-4">
                  <a 
                    href="https://linkedin.com/company/bluesystem" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-600 hover:bg-blue-primary rounded-full flex items-center justify-center transition-colors duration-300"
                    aria-label="Síguenos en LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                    </svg>
                  </a>

                  <a 
                    href="https://twitter.com/bluesystem" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-600 hover:bg-blue-primary rounded-full flex items-center justify-center transition-colors duration-300"
                    aria-label="Síguenos en Twitter"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>

                  <a 
                    href="https://github.com/bluesystem" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-600 hover:bg-blue-primary rounded-full flex items-center justify-center transition-colors duration-300"
                    aria-label="Síguenos en GitHub"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Newsletter */}
              <div className="flex items-center gap-4">
                <span className="text-gray-300 font-medium whitespace-nowrap">Newsletter:</span>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="tu@email.com" 
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-blue-primary focus:outline-none focus:ring-2 focus:ring-blue-primary/30 transition-colors duration-300"
                  />
                  <button className="btn-primary px-6 py-2 text-sm">
                    Suscribirse
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de copyright */}
      <div className="bg-gray-800 py-4">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div>
              © {currentYear} BlueSystem.io. Todos los derechos reservados.
            </div>
            <div className="flex gap-6">
              <Link 
                to="/privacidad" 
                className="hover:text-blue-primary transition-colors duration-300"
              >
                Política de Privacidad
              </Link>
              <Link 
                to="/terminos" 
                className="hover:text-blue-primary transition-colors duration-300"
              >
                Términos de Servicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 