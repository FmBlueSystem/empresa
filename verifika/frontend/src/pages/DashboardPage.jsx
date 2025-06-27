import React from 'react';
import { useAuth } from '../hooks/useAuth';

/**
 * Dashboard principal de Verifika - Estilo BlueSystem
 * Página de inicio con diseño púrpura consistente con la web principal
 */
const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="bluesystem-gradient min-h-screen">
      {/* Main Dashboard Content */}
      <div className="relative z-10 p-8">
        {/* Header Section */}
        <div className="bluesystem-glass p-6 rounded-2xl shadow-2xl mb-8 animate-fade-in-down">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bluesystem-glass w-16 h-16 flex items-center justify-center shadow-lg mr-4">
                <span className="text-2xl font-bold bluesystem-text-white">V</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bluesystem-text-white">Dashboard Verifika</h1>
                <p className="bluesystem-text-purple text-lg">Sistema de Validación Técnica Empresarial</p>
              </div>
            </div>
            <div className="text-right">
              <p className="bluesystem-text-white text-lg font-semibold">Bienvenido, {user?.name || 'Usuario'}</p>
              <p className="bluesystem-text-purple text-sm">{user?.email || 'admin@bluesystem.io'}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bluesystem-glass p-6 rounded-xl shadow-xl animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="bluesystem-text-purple text-sm font-medium">Técnicos Activos</p>
                <p className="text-3xl font-bold bluesystem-text-white">24</p>
              </div>
              <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl">👨‍🔧</span>
              </div>
            </div>
          </div>

          <div className="bluesystem-glass p-6 rounded-xl shadow-xl animate-fade-in-up animation-delay-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="bluesystem-text-purple text-sm font-medium">Clientes</p>
                <p className="text-3xl font-bold bluesystem-text-white">156</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bluesystem-glass p-6 rounded-xl shadow-xl animate-fade-in-up animation-delay-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="bluesystem-text-purple text-sm font-medium">Actividades Hoy</p>
                <p className="text-3xl font-bold bluesystem-text-white">42</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bluesystem-glass p-6 rounded-xl shadow-xl animate-fade-in-up animation-delay-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="bluesystem-text-purple text-sm font-medium">Reportes</p>
                <p className="text-3xl font-bold bluesystem-text-white">89</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Quick Actions */}
          <div className="bluesystem-glass p-6 rounded-xl shadow-xl animate-fade-in-left">
            <h2 className="text-2xl font-bold bluesystem-text-white mb-6">Acciones Rápidas</h2>
            <div className="space-y-4">
              <button className="w-full bg-white bg-opacity-10 hover:bg-opacity-20 bluesystem-text-white p-4 rounded-lg transition-all duration-200 text-left flex items-center">
                <span className="text-2xl mr-4">👨‍🔧</span>
                <div>
                  <p className="font-semibold">Gestionar Técnicos</p>
                  <p className="text-sm bluesystem-text-purple">Agregar, editar o asignar técnicos</p>
                </div>
              </button>
              
              <button className="w-full bg-white bg-opacity-10 hover:bg-opacity-20 bluesystem-text-white p-4 rounded-lg transition-all duration-200 text-left flex items-center">
                <span className="text-2xl mr-4">👥</span>
                <div>
                  <p className="font-semibold">Gestionar Clientes</p>
                  <p className="text-sm bluesystem-text-purple">Administrar base de clientes</p>
                </div>
              </button>
              
              <button className="w-full bg-white bg-opacity-10 hover:bg-opacity-20 bluesystem-text-white p-4 rounded-lg transition-all duration-200 text-left flex items-center">
                <span className="text-2xl mr-4">📋</span>
                <div>
                  <p className="font-semibold">Nueva Actividad</p>
                  <p className="text-sm bluesystem-text-purple">Crear nueva validación técnica</p>
                </div>
              </button>
              
              <button className="w-full bg-white bg-opacity-10 hover:bg-opacity-20 bluesystem-text-white p-4 rounded-lg transition-all duration-200 text-left flex items-center">
                <span className="text-2xl mr-4">📊</span>
                <div>
                  <p className="font-semibold">Ver Reportes</p>
                  <p className="text-sm bluesystem-text-purple">Generar informes y estadísticas</p>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bluesystem-glass p-6 rounded-xl shadow-xl animate-fade-in-right">
            <h2 className="text-2xl font-bold bluesystem-text-white mb-6">Actividad Reciente</h2>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-white bg-opacity-5 rounded-lg">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="bluesystem-text-white text-sm font-medium">Técnico Juan Pérez completó validación</p>
                  <p className="bluesystem-text-purple text-xs">Cliente: Empresa ABC - Hace 2 horas</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-white bg-opacity-5 rounded-lg">
                <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="bluesystem-text-white text-sm font-medium">Nuevo cliente registrado</p>
                  <p className="bluesystem-text-purple text-xs">Empresa XYZ - Hace 4 horas</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-white bg-opacity-5 rounded-lg">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="bluesystem-text-white text-sm font-medium">Reporte mensual generado</p>
                  <p className="bluesystem-text-purple text-xs">Sistema automático - Hace 6 horas</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-white bg-opacity-5 rounded-lg">
                <div className="w-3 h-3 bg-purple-400 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="bluesystem-text-white text-sm font-medium">Competencia actualizada</p>
                  <p className="bluesystem-text-purple text-xs">Instalaciones Eléctricas - Hace 8 horas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bluesystem-glass p-6 rounded-xl shadow-xl animate-fade-in-up">
          <h2 className="text-2xl font-bold bluesystem-text-white mb-6">Estado del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-8 h-8 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <p className="bluesystem-text-white font-semibold">Base de Datos</p>
              <p className="bluesystem-text-purple text-sm">Operacional</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-8 h-8 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <p className="bluesystem-text-white font-semibold">API Server</p>
              <p className="bluesystem-text-purple text-sm">Activo</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-8 h-8 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <p className="bluesystem-text-white font-semibold">Sincronización</p>
              <p className="bluesystem-text-purple text-sm">En línea</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="bluesystem-glass inline-flex items-center px-6 py-3 rounded-full">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
            <span className="bluesystem-text-purple text-sm font-medium">
              Verifika v1.0 - BlueSystem Enterprise - Sistema de Validación Técnica
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;