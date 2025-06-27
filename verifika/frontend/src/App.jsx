import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ClientesPage from './pages/ClientesPage';
import ClienteDetailPage from './pages/ClienteDetailPage';
import CreateClientePage from './pages/CreateClientePage';
import ShowcasePage from './pages/ShowcasePage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

/**
 * Aplicación principal de Verifika
 * Sistema de validación de actividades técnicas con diseño BlueSystem
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta por defecto redirige a login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Página de login sin layout */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Página de demostración sin layout */}
          <Route path="/showcase" element={<ShowcasePage />} />
          
          {/* Rutas protegidas con layout */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Ruta por defecto redirige a dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Dashboard */}
            <Route path="dashboard" element={<DashboardPage />} />
            
            {/* Rutas de clientes */}
            <Route path="clientes" element={<ClientesPage />} />
            <Route path="clientes/nuevo" element={<CreateClientePage />} />
            <Route path="clientes/:id" element={<ClienteDetailPage />} />
            
            {/* Rutas futuras */}
            <Route path="tecnicos" element={<div className="card"><div className="card-body"><h2 className="text-lg font-bold text-secondary-900 mb-4">Módulo de Técnicos</h2><p className="text-secondary-600">Funcionalidad en desarrollo para FASE 2.4</p></div></div>} />
            <Route path="actividades" element={<div className="card"><div className="card-body"><h2 className="text-lg font-bold text-secondary-900 mb-4">Actividades</h2><p className="text-secondary-600">Funcionalidad en desarrollo para FASE 3</p></div></div>} />
            <Route path="reportes" element={<div className="card"><div className="card-body"><h2 className="text-lg font-bold text-secondary-900 mb-4">Reportes</h2><p className="text-secondary-600">Funcionalidad en desarrollo para FASE 4</p></div></div>} />
          </Route>
          
          {/* Ruta no encontrada */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;