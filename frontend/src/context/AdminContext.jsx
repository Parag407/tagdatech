import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('tagda_admin_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Validate session token on app load
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await api.get('/auth/verify');
        if (response.data.success) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error('Session verification failed:', error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleLogin = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      if (response.data.success) {
        const { token: receivedToken, user: receivedUser } = response.data;
        localStorage.setItem('tagda_admin_token', receivedToken);
        setToken(receivedToken);
        setUser(receivedUser);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Login failed. Please check credentials.' };
    } catch (error) {
      const errMsg = error.response?.data?.error || 'Authentication error occurred';
      return { success: false, error: errMsg };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tagda_admin_token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AdminContext.Provider value={{ user, isAuthenticated, loading, login: handleLogin, logout: handleLogout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
