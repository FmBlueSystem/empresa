// API service for Verifika backend integration
const VERIFIKA_BASE_URL = 'http://localhost:3001/api';

class VerifikaAPI {
  constructor() {
    this.baseURL = VERIFIKA_BASE_URL;
    this.token = localStorage.getItem('verifika_token');
  }

  // Set authorization token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('verifika_token', token);
    } else {
      localStorage.removeItem('verifika_token');
    }
  }

  // Get authorization headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: this.getHeaders(),
      credentials: 'include',
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    if (response.success && response.data.token) {
      this.setToken(response.data.token);
      localStorage.setItem('verifika_user', JSON.stringify(response.data.user));
    }

    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST'
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      this.setToken(null);
      localStorage.removeItem('verifika_user');
    }
  }

  async getProfile() {
    return await this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return await this.request('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  // User management (admin only)
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/auth/users${queryString ? `?${queryString}` : ''}`);
  }

  async createUser(userData) {
    return await this.request('/auth/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async updateUser(userId, userData) {
    return await this.request(`/auth/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async deleteUser(userId) {
    return await this.request(`/auth/users/${userId}`, {
      method: 'DELETE'
    });
  }

  // Clientes methods
  async getClientes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/clientes${queryString ? `?${queryString}` : ''}`);
  }

  async createCliente(clienteData) {
    return await this.request('/clientes', {
      method: 'POST',
      body: JSON.stringify(clienteData)
    });
  }

  async updateCliente(clienteId, clienteData) {
    return await this.request(`/clientes/${clienteId}`, {
      method: 'PUT',
      body: JSON.stringify(clienteData)
    });
  }

  async deleteCliente(clienteId) {
    return await this.request(`/clientes/${clienteId}`, {
      method: 'DELETE'
    });
  }

  // Competencias methods
  async getCompetencias(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/competencias${queryString ? `?${queryString}` : ''}`);
  }

  async createCompetencia(competenciaData) {
    return await this.request('/competencias', {
      method: 'POST',
      body: JSON.stringify(competenciaData)
    });
  }

  async updateCompetencia(competenciaId, competenciaData) {
    return await this.request(`/competencias/${competenciaId}`, {
      method: 'PUT',
      body: JSON.stringify(competenciaData)
    });
  }

  async deleteCompetencia(competenciaId) {
    return await this.request(`/competencias/${competenciaId}`, {
      method: 'DELETE'
    });
  }

  // Actividades methods (when implemented)
  async getActividades(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/actividades${queryString ? `?${queryString}` : ''}`);
  }

  async createActividad(actividadData) {
    return await this.request('/actividades', {
      method: 'POST',
      body: JSON.stringify(actividadData)
    });
  }

  async updateActividad(actividadId, actividadData) {
    return await this.request(`/actividades/${actividadId}`, {
      method: 'PUT',
      body: JSON.stringify(actividadData)
    });
  }

  async deleteActividad(actividadId) {
    return await this.request(`/actividades/${actividadId}`, {
      method: 'DELETE'
    });
  }

  // Dashboard/Stats methods
  async getDashboardStats() {
    return await this.request('/auth/stats');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token && !!localStorage.getItem('verifika_user');
  }

  // Get current user from localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem('verifika_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if current user is admin
  isAdmin() {
    const user = this.getCurrentUser();
    return user && (user.rol === 'admin' || user.esAdmin);
  }
}

// Create a singleton instance
const verifikaAPI = new VerifikaAPI();

export default verifikaAPI;
