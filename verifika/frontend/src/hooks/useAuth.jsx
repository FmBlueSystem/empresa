import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Usuarios de prueba para desarrollo
const DEMO_USERS = {
  'admin@bluesystem.io': { password: 'admin123', name: 'Admin BlueSystem', role: 'admin' },
  'admin@bluesystem.com': { password: 'admin123', name: 'Admin BlueSystem', role: 'admin' },
  'user@test.com': { password: 'test123', name: 'Usuario Test', role: 'user' }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay una sesión guardada al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem('verifika_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('verifika_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, remember = false) => {
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar credenciales
      const demoUser = DEMO_USERS[email];
      if (!demoUser || demoUser.password !== password) {
        return { 
          success: false, 
          error: 'Credenciales incorrectas. Usa admin@bluesystem.io / admin123' 
        };
      }

      const userData = {
        id: 1,
        email: email,
        name: demoUser.name,
        role: demoUser.role,
        loginTime: new Date().toISOString()
      };

      setUser(userData);
      
      // Guardar en localStorage si se selecciona "recordarme"
      if (remember) {
        localStorage.setItem('verifika_user', JSON.stringify(userData));
      }
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        error: 'Error de conexión. Intenta nuevamente.' 
      };
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem('verifika_user');
      return { success: true };
    } catch (error) {
      console.error('Error en logout:', error);
      return { success: false, error: 'Error al cerrar sesión' };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};