import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Dashboard({ user, apiBaseUrl }) {
  const [systemInfo, setSystemInfo] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load system health
      const healthResponse = await axios.get('/health/detailed')
      setSystemInfo(healthResponse.data)

      // Load users
      const usersResponse = await axios.get(`${apiBaseUrl}/users`)
      setUsers(usersResponse.data.users)

    } catch (error) {
      setError('Error cargando datos del dashboard')
    } finally {
      setLoading(false)
    }
  }

  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return '#10b981'
      case 'degraded': return '#f59e0b'
      case 'unhealthy': return '#ef4444'
      default: return '#6b7280'
    }
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>❌ Error</h2>
        <p>{error}</p>
        <button onClick={loadDashboardData} className="retry-btn">
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>📊 Dashboard de BlueSystem.io</h2>
        <p className="welcome-message">
          Bienvenido de vuelta, <strong>{user.email}</strong>
        </p>
      </div>

      <div className="dashboard-grid">
        {/* System Health */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>🏥 Estado del Sistema</h3>
            <div 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(systemInfo?.status) }}
            >
              {systemInfo?.status || 'unknown'}
            </div>
          </div>
          <div className="card-content">
            {systemInfo && (
              <div className="system-metrics">
                <div className="metric">
                  <span className="metric-label">Uptime:</span>
                  <span className="metric-value">
                    {formatUptime(systemInfo.uptime)}
                  </span>
                </div>
                <div className="metric">
                  <span className="metric-label">Memoria:</span>
                  <span className="metric-value">
                    {systemInfo.system?.memory?.used}MB / {systemInfo.system?.memory?.total}MB
                  </span>
                </div>
                <div className="metric">
                  <span className="metric-label">Node.js:</span>
                  <span className="metric-value">
                    {systemInfo.system?.nodeVersion}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Services Status */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>🔧 Estado de Servicios</h3>
          </div>
          <div className="card-content">
            {systemInfo?.checks && (
              <div className="services-list">
                {Object.entries(systemInfo.checks).map(([service, status]) => (
                  <div key={service} className="service-item">
                    <span className="service-name">{service.toUpperCase()}</span>
                    <div 
                      className="service-status"
                      style={{ backgroundColor: getStatusColor(status.status) }}
                    >
                      {status.status === 'healthy' ? '✅' : '❌'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Users List */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>👥 Usuarios del Sistema</h3>
            <span className="count-badge">{users.length}</span>
          </div>
          <div className="card-content">
            <div className="users-list">
              {users.map(user => (
                <div key={user.id} className="user-item">
                  <div className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                  <div className={`user-role role-${user.role}`}>
                    {user.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>⚡ Acciones Rápidas</h3>
          </div>
          <div className="card-content">
            <div className="quick-actions">
              <button 
                className="action-btn primary"
                onClick={loadDashboardData}
              >
                🔄 Actualizar Dashboard
              </button>
              <button 
                className="action-btn secondary"
                onClick={() => window.open('/health/detailed', '_blank')}
              >
                📋 Ver Health Check
              </button>
              <button 
                className="action-btn secondary"
                onClick={() => {}}
              >
                🔍 Log Sistema
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-footer">
        <p className="last-updated">
          Última actualización: {new Date().toLocaleString('es-ES')}
        </p>
      </div>
    </div>
  )
}

export default Dashboard