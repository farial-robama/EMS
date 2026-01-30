// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  login as authLogin,
  logout as authLogout,
} from '../services/authService';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  // State management
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Login function
  const login = async (userId, password) => {
    try {
      console.log('📝 AuthContext: Starting login...');
      const response = await authLogin(userId, password);

      console.log('📥 AuthContext: Received response:', response);

      // FIX: Handle both mock and real API response structures
      // Mock response: { token, user, success }
      // Real API response: { data: { token, user }, success }
      const userData = response.user || response.data?.user;
      const authToken = response.token || response.data?.token;

      console.log('🔍 AuthContext: Extracted userData:', userData);
      console.log('🔍 AuthContext: Extracted token:', authToken);

      if (!userData || !authToken) {
        console.error('❌ AuthContext: Invalid response structure:', response);
        throw new Error('Invalid response: missing user or token');
      }

      // Update state
      setUser(userData);
      setToken(authToken);
      setIsAuthenticated(true);

      console.log('✅ AuthContext: State updated successfully');
      console.log('👤 AuthContext: User role:', userData.role);

      // Save to localStorage
      localStorage.setItem('auth_token', authToken);
      localStorage.setItem('user_data', JSON.stringify(userData));

      console.log('💾 AuthContext: Saved to localStorage');

      // Return the response for LoginPage to use
      return { user: userData, token: authToken, success: true };
    } catch (error) {
      console.error('❌ AuthContext Login Error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authLogout();

      // Clear state
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);

      // Clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_role');

      // Redirect to login page
      window.location.href = '/auth/login';
    } catch (error) {
      // Even if logout API fails, clear local state
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_role');
      window.location.href = '/auth/login';
      throw error;
    }
  };

  // Check authentication status on app load
  const checkAuth = () => {
    try {
      const storedToken = localStorage.getItem('auth_token');
      const storedUserData = localStorage.getItem('user_data');

      if (storedToken && storedUserData) {
        const userData = JSON.parse(storedUserData);
        setUser(userData);
        setToken(storedToken);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // If there's an error parsing stored data, clear it
      console.error('Error restoring auth data:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_role');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has required role
  const hasRole = (allowedRoles) => {
    if (!user || !user.role) return false;
    return allowedRoles.includes(user.role);
  };

  // Check authentication on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Context value
  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// PropTypes validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
