import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackContactFormSubmit } from './Analytics';

/**
 * Formulario de Contacto Funcional
 * Integrado con backend /api/contact y validación completa
 */
const ContactForm = ({ className = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
    timeline: '',
    companyType: '', // Nuevo campo para el tipo de empresa
    employeeSize: '', // Nuevo campo para el tamaño de empleados
    newsletter: false,
    website: '' // Honeypot field
  });

  const [formState, setFormState] = useState({
    isSubmitting: false,
    isSubmitted: false,
    errors: {},
    apiError: null
  });

  const services = [
    { value: 'sap', label: 'Consultoría SAP' },
    { value: 'ia', label: 'Automatización con IA' },
    { value: 'office365', label: 'Integraciones Office 365' },
    { value: 'desarrollo-web', label: 'Desarrollo de Software Integral' },
    { value: 'blueconnect', label: 'BlueConnect - Conectividad Inteligente' },
    { value: 'consultoria', label: 'Consultoría Estratégica' },
    { value: 'otro', label: 'Otro' }
  ];

  const companyTypeOptions = [
    { value: 'startup', label: 'Startup' },
    { value: 'pyme', label: 'Pequeña y Mediana Empresa (PyME)' },
    { value: 'gran-empresa', label: 'Gran Empresa / Corporación' },
    { value: 'ong', label: 'Organización sin fines de lucro (ONG)' },
    { value: 'gobierno', label: 'Entidad Gubernamental' },
    { value: 'otro', label: 'Otro' }
  ];

  const employeeSizeOptions = [
    { value: '1-10', label: '1-10 empleados' },
    { value: '11-50', label: '11-50 empleados' },
    { value: '51-200', label: '51-200 empleados' },
    { value: '201-500', label: '201-500 empleados' },
    { value: '500+', label: 'Más de 500 empleados' }
  ];

  const timelineOptions = [
    { value: 'inmediato', label: 'Inmediato (ASAP)' },
    { value: '1-3-meses', label: '1-3 meses' },
    { value: '3-6-meses', label: '3-6 meses' },
    { value: '6-12-meses', label: '6-12 meses' },
    { value: 'no-definido', label: 'No definido' }
  ];

  // Validación client-side
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'El nombre es obligatorio';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'El email debe tener un formato válido';
    }

    if (formData.phone && !/^[+]?[\d\s-()./]{10,20}$/.test(formData.phone)) {
      errors.phone = 'El teléfono debe tener un formato válido';
    }

    if (!formData.message.trim()) {
      errors.message = 'El mensaje es obligatorio';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'El mensaje debe tener al menos 10 caracteres';
    } else if (formData.message.trim().length > 1000) {
      errors.message = 'El mensaje no puede exceder 1000 caracteres';
    }

    return errors;
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formState.errors[name]) {
      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [name]: null
        }
      }));
    }
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormState(prev => ({ ...prev, errors }));
      return;
    }

    setFormState(prev => ({
      ...prev,
      isSubmitting: true,
      errors: {},
      apiError: null
    }));

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      
      const response = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.details) {
          // Errores de validación del servidor
          const serverErrors = {};
          result.details.forEach(detail => {
            serverErrors[detail.field] = detail.message;
          });
          setFormState(prev => ({
            ...prev,
            errors: serverErrors,
            isSubmitting: false
          }));
        } else {
          throw new Error(result.message || 'Error al enviar el formulario');
        }
        return;
      }

      // Éxito
      setFormState({
        isSubmitting: false,
        isSubmitted: true,
        errors: {},
        apiError: null
      });

      // Tracking analytics
      trackContactFormSubmit(formData.service || 'general');

      // Resetear formulario
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        message: '',
        timeline: '',
        companyType: '', // Nuevo campo para el tipo de empresa
        employeeSize: '', // Nuevo campo para el tamaño de empleados
        newsletter: false,
        website: ''
      });

    } catch (error) {
      // console.error('Error enviando formulario:', error);
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        apiError: error.message || 'Error al enviar el formulario. Por favor intenta nuevamente.'
      }));
    }
  };

  // Si el formulario fue enviado exitosamente
  if (formState.isSubmitted) {
    return (
      <motion.div
        className={`bg-green-50 border border-green-200 rounded-xl p-8 text-center ${className}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">
          ¡Mensaje Enviado!
        </h3>
        <p className="text-green-700 mb-4">
          Gracias por contactarnos. Hemos recibido tu consulta y te responderemos en las próximas 24 horas.
        </p>
        <button
          onClick={() => setFormState(prev => ({ ...prev, isSubmitted: false }))}
          className="btn-secondary"
        >
          Enviar Otro Mensaje
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      className={`space-y-6 ${className}`}
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Error general de API */}
      <AnimatePresence>
        {formState.apiError && (
          <motion.div
            className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {formState.apiError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Información personal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre completo *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              formState.errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Tu nombre completo"
            disabled={formState.isSubmitting}
          />
          {formState.errors.name && (
            <p className="mt-1 text-sm text-red-600">{formState.errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email corporativo *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              formState.errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="nombre@empresa.com"
            disabled={formState.isSubmitting}
          />
          {formState.errors.email && (
            <p className="mt-1 text-sm text-red-600">{formState.errors.email}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              formState.errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+506 7219-2010"
            disabled={formState.isSubmitting}
          />
          {formState.errors.phone && (
            <p className="mt-1 text-sm text-red-600">{formState.errors.phone}</p>
          )}
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
            Empresa
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Nombre de tu empresa"
            disabled={formState.isSubmitting}
          />
        </div>
      </div>

      {/* Información del proyecto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
            Servicio de interés
          </label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            disabled={formState.isSubmitting}
          >
            <option value="">Selecciona un servicio</option>
            {services.map(service => (
              <option key={service.value} value={service.value}>
                {service.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="companyType" className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de empresa
          </label>
          <select
            id="companyType"
            name="companyType"
            value={formData.companyType}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            disabled={formState.isSubmitting}
          >
            <option value="">Selecciona el tipo de empresa</option>
            {companyTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="employeeSize" className="block text-sm font-medium text-gray-700 mb-2">
          Tamaño de empleados
        </label>
        <select
          id="employeeSize"
          name="employeeSize"
          value={formData.employeeSize}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          disabled={formState.isSubmitting}
        >
          <option value="">Selecciona el tamaño de empleados</option>
          {employeeSizeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
          Timeline del proyecto
        </label>
        <select
          id="timeline"
          name="timeline"
          value={formData.timeline}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          disabled={formState.isSubmitting}
        >
          <option value="">Selecciona un timeline</option>
          {timelineOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Mensaje */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Describe tu proyecto *
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            formState.errors.message ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Cuéntanos sobre tu proyecto, desafíos actuales y objetivos..."
          disabled={formState.isSubmitting}
        />
        <div className="flex justify-between items-center mt-1">
          {formState.errors.message && (
            <p className="text-sm text-red-600">{formState.errors.message}</p>
          )}
          <p className="text-sm text-gray-500 ml-auto">
            {formData.message.length}/1000 caracteres
          </p>
        </div>
      </div>

      {/* Newsletter y honeypot */}
      <div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="newsletter"
            name="newsletter"
            checked={formData.newsletter}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            disabled={formState.isSubmitting}
          />
          <label htmlFor="newsletter" className="ml-2 text-sm text-gray-700">
            Quiero recibir actualizaciones y contenido exclusivo de BlueSystem.io
          </label>
        </div>

        {/* Honeypot field - hidden from users */}
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={handleChange}
          style={{ display: 'none' }}
          tabIndex="-1"
          autoComplete="off"
        />
      </div>

      {/* Botón de envío */}
      <div className="pt-4">
        <motion.button
          type="submit"
          disabled={formState.isSubmitting}
          className={`w-full btn-primary ${
            formState.isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
          }`}
          whileHover={!formState.isSubmitting ? { scale: 1.02 } : {}}
          whileTap={!formState.isSubmitting ? { scale: 0.98 } : {}}
        >
          {formState.isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0c5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enviando...
            </div>
          ) : (
            '🚀 Iniciar Transformación Digital'
          )}
        </motion.button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Al enviar este formulario, aceptas que BlueSystem.io se ponga en contacto contigo sobre tu consulta.
      </p>
    </motion.form>
  );
};

export default ContactForm;