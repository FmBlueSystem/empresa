// CreateClientePage.jsx - Página para crear nuevo cliente
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const CreateClientePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    razon_social: '',
    nif_cif: '',
    email_principal: '',
    contacto_principal: '',
    telefono_principal: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    codigo_postal: '',
    pais: 'España',
    sitio_web: '',
    sector: '',
    numero_empleados: '',
    notas_internas: ''
  });

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validar formulario
  const validarFormulario = () => {
    const errores = [];
    
    if (!formData.razon_social.trim()) {
      errores.push('La razón social es obligatoria');
    }
    
    if (!formData.email_principal.trim()) {
      errores.push('El email principal es obligatorio');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_principal)) {
      errores.push('El email principal no es válido');
    }
    
    if (!formData.contacto_principal.trim()) {
      errores.push('El contacto principal es obligatorio');
    }

    if (formData.nif_cif && !/^[A-Z]\d{8}$|^\d{8}[A-Z]$/.test(formData.nif_cif.toUpperCase())) {
      errores.push('El formato del NIF/CIF no es válido');
    }

    if (formData.codigo_postal && !/^\d{5}$/.test(formData.codigo_postal)) {
      errores.push('El código postal debe tener 5 dígitos');
    }

    if (formData.sitio_web && !/^https?:\/\/.+/.test(formData.sitio_web)) {
      errores.push('La URL del sitio web debe comenzar con http:// o https://');
    }

    if (formData.numero_empleados && (isNaN(formData.numero_empleados) || parseInt(formData.numero_empleados) < 1)) {
      errores.push('El número de empleados debe ser un número válido mayor a 0');
    }
    
    return errores;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errores = validarFormulario();
    if (errores.length > 0) {
      setError(errores.join(', '));
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Preparar datos para envío
      const dataToSend = {
        ...formData,
        numero_empleados: formData.numero_empleados ? parseInt(formData.numero_empleados) : null
      };

      const response = await fetch('/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear cliente');
      }

      const result = await response.json();
      
      // Redirigir al detalle del cliente creado
      navigate(`/clientes/${result.data.cliente.id}`, {
        state: { message: 'Cliente creado exitosamente' }
      });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Verificar permisos
  if (!user || !['admin'].includes(user.rol)) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          No tienes permisos para crear clientes.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <Link
            to="/clientes"
            className="text-blue-600 hover:text-blue-800"
          >
            ← Clientes
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">Nuevo Cliente</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Cliente</h1>
        <p className="text-gray-600">Completa la información del cliente</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Información básica */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Razón Social *
              </label>
              <input
                type="text"
                name="razon_social"
                value={formData.razon_social}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Empresa S.L."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIF/CIF
              </label>
              <input
                type="text"
                name="nif_cif"
                value={formData.nif_cif}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="B12345678"
                maxLength={9}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Principal *
              </label>
              <input
                type="email"
                name="email_principal"
                value={formData.email_principal}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="contacto@empresa.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contacto Principal *
              </label>
              <input
                type="text"
                name="contacto_principal"
                value={formData.contacto_principal}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono Principal
              </label>
              <input
                type="tel"
                name="telefono_principal"
                value={formData.telefono_principal}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+34 600 123 456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sitio Web
              </label>
              <input
                type="url"
                name="sitio_web"
                value={formData.sitio_web}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://empresa.com"
              />
            </div>
          </div>
        </div>

        {/* Información empresarial */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Empresarial</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sector
              </label>
              <select
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona un sector</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Finanzas">Finanzas</option>
                <option value="Salud">Salud</option>
                <option value="Educación">Educación</option>
                <option value="Retail">Retail</option>
                <option value="Manufactura">Manufactura</option>
                <option value="Servicios">Servicios</option>
                <option value="Construcción">Construcción</option>
                <option value="Transporte">Transporte</option>
                <option value="Energía">Energía</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Empleados
              </label>
              <input
                type="number"
                name="numero_empleados"
                value={formData.numero_empleados}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="50"
              />
            </div>
          </div>
        </div>

        {/* Información de dirección */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dirección</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <textarea
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Calle Principal, 123"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad
                </label>
                <input
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Madrid"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provincia
                </label>
                <input
                  type="text"
                  name="provincia"
                  value={formData.provincia}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Madrid"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código Postal
                </label>
                <input
                  type="text"
                  name="codigo_postal"
                  value={formData.codigo_postal}
                  onChange={handleChange}
                  maxLength={5}
                  pattern="[0-9]{5}"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="28001"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  País
                </label>
                <select
                  name="pais"
                  value={formData.pais}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="España">España</option>
                  <option value="Portugal">Portugal</option>
                  <option value="Francia">Francia</option>
                  <option value="Alemania">Alemania</option>
                  <option value="Italia">Italia</option>
                  <option value="Reino Unido">Reino Unido</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notas internas */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Adicional</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas Internas
            </label>
            <textarea
              name="notas_internas"
              value={formData.notas_internas}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Información adicional sobre el cliente..."
            />
            <p className="text-sm text-gray-500 mt-1">
              Estas notas solo serán visibles para los administradores.
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4">
          <Link
            to="/clientes"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-md text-white transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Creando...' : 'Crear Cliente'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateClientePage;