// ClienteDetailPage.jsx - Página de detalle de cliente
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ClienteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cliente, setCliente] = useState(null);
  const [validadores, setValidadores] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info');

  // Cargar datos del cliente
  const cargarCliente = async () => {
    try {
      const response = await fetch(`/api/clientes/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Cliente no encontrado');
        }
        throw new Error('Error al cargar cliente');
      }

      const data = await response.json();
      setCliente(data.data.cliente);
    } catch (err) {
      setError(err.message);
    }
  };

  // Cargar validadores
  const cargarValidadores = async () => {
    try {
      const response = await fetch(`/api/clientes/${id}/validadores`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setValidadores(data.data.validadores);
      }
    } catch (err) {
      console.error('Error al cargar validadores:', err);
    }
  };

  // Cargar proyectos
  const cargarProyectos = async () => {
    try {
      const response = await fetch(`/api/clientes/${id}/proyectos`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProyectos(data.data.proyectos);
      }
    } catch (err) {
      console.error('Error al cargar proyectos:', err);
    }
  };

  // Cargar todos los datos
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      await Promise.all([
        cargarCliente(),
        cargarValidadores(),
        cargarProyectos()
      ]);
      setLoading(false);
    };

    if (id) {
      cargarDatos();
    }
  }, [id]);

  // Verificar permisos
  if (!user || !['admin', 'cliente'].includes(user.rol)) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          No tienes permisos para acceder a esta página.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Cargando información del cliente...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <Link
          to="/clientes"
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ← Volver a Clientes
        </Link>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Cliente no encontrado.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Link
              to="/clientes"
              className="text-blue-600 hover:text-blue-800"
            >
              ← Clientes
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{cliente.nombre_empresa}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{cliente.nombre_empresa}</h1>
          <p className="text-gray-600">Información detallada del cliente</p>
        </div>
        
        {user.rol === 'admin' && (
          <div className="flex space-x-2">
            <Link
              to={`/clientes/${id}/editar`}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Editar Cliente
            </Link>
          </div>
        )}
      </div>

      {/* Estado */}
      <div className="mb-6">
        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
          cliente.usuario_estado === 'activo'
            ? 'bg-green-100 text-green-800'
            : cliente.usuario_estado === 'inactivo'
            ? 'bg-red-100 text-red-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {cliente.usuario_estado?.toUpperCase()}
        </span>
      </div>

      {/* Pestañas */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'info'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Información General
          </button>
          <button
            onClick={() => setActiveTab('validadores')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'validadores'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Validadores ({validadores.length})
          </button>
          <button
            onClick={() => setActiveTab('proyectos')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'proyectos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Proyectos ({proyectos.length})
          </button>
        </nav>
      </div>

      {/* Contenido de pestañas */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información básica */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Nombre de Empresa</dt>
                <dd className="text-sm text-gray-900">{cliente.nombre_empresa}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">CIF</dt>
                <dd className="text-sm text-gray-900">{cliente.cif || 'No especificado'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-sm text-gray-900">{cliente.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Sector</dt>
                <dd className="text-sm text-gray-900">{cliente.sector_actividad || 'No especificado'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Número de Empleados</dt>
                <dd className="text-sm text-gray-900">{cliente.numero_empleados || 'No especificado'}</dd>
              </div>
            </dl>
          </div>

          {/* Información de contacto */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Dirección</dt>
                <dd className="text-sm text-gray-900">{cliente.direccion_fiscal || 'No especificada'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Ciudad</dt>
                <dd className="text-sm text-gray-900">{cliente.ciudad || 'No especificada'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">País</dt>
                <dd className="text-sm text-gray-900">{cliente.pais || 'España'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                <dd className="text-sm text-gray-900">{cliente.telefono_corporativo || 'No especificado'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Sitio Web</dt>
                <dd className="text-sm text-gray-900">
                  {cliente.sitio_web ? (
                    <a 
                      href={cliente.sitio_web} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {cliente.sitio_web}
                    </a>
                  ) : 'No especificado'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Estadísticas */}
          <div className="bg-white rounded-lg shadow-sm border p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{cliente.total_asignaciones || 0}</div>
                <div className="text-sm text-gray-600">Asignaciones</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{cliente.total_validadores || 0}</div>
                <div className="text-sm text-gray-600">Validadores</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{cliente.total_actividades || 0}</div>
                <div className="text-sm text-gray-600">Actividades</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'validadores' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Validadores</h3>
              {user.rol === 'admin' && (
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  + Agregar Validador
                </button>
              )}
            </div>
          </div>
          
          {validadores.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No hay validadores asignados a este cliente.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {validadores.map((validador) => (
                <div key={validador.id} className="p-6 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900">
                      {validador.nombre} {validador.apellido}
                    </div>
                    <div className="text-sm text-gray-500">{validador.email}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Nivel: {validador.nivel_autorizacion} | 
                      {validador.puede_aprobar ? ' Puede aprobar' : ''} | 
                      {validador.puede_rechazar ? ' Puede rechazar' : ''}
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    validador.activo 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {validador.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'proyectos' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Proyectos</h3>
              {user.rol === 'admin' && (
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  + Nuevo Proyecto
                </button>
              )}
            </div>
          </div>
          
          {proyectos.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No hay proyectos registrados para este cliente.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {proyectos.map((proyecto) => (
                <div key={proyecto.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{proyecto.nombre}</h4>
                      <p className="text-sm text-gray-600 mt-1">{proyecto.descripcion}</p>
                      <div className="flex space-x-4 mt-2 text-xs text-gray-500">
                        <span>Inicio: {new Date(proyecto.fecha_inicio).toLocaleDateString('es-ES')}</span>
                        {proyecto.fecha_fin_estimada && (
                          <span>Fin estimado: {new Date(proyecto.fecha_fin_estimada).toLocaleDateString('es-ES')}</span>
                        )}
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ml-4 ${
                      proyecto.estado === 'activa'
                        ? 'bg-green-100 text-green-800'
                        : proyecto.estado === 'finalizada'
                        ? 'bg-blue-100 text-blue-800'
                        : proyecto.estado === 'pausada'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {proyecto.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClienteDetailPage;