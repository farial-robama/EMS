// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  loginUser as authLogin,
  logoutUser as authLogout,
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



  // ✅ ADD THIS - Log every state change
  useEffect(() => {
    console.log('📊 AuthContext STATE CHANGED:', {
      isAuthenticated,
      hasUser: !!user,
      userRole: user?.role,
      hasToken: !!token
    });
  }, [isAuthenticated, user, token]);






  // Update localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user_data', JSON.stringify(user));
    }
  }, [user]);

  // Login function
//   const login = async (userId, password) => {
//   try {
//     const response = await authLogin({ userId, password });

//     // response is already data
//     const userData = response.user;
//     const authToken = response.accessToken; // or response.token depending on backend

//     if (!userData || !authToken) {
//       throw new Error('Invalid response: missing user or token');
//     }

//     // Update state
//     setUser(userData);
//     setToken(authToken);
//     setIsAuthenticated(true);

//     // Save to localStorage
//     localStorage.setItem('auth_token', authToken);
//     localStorage.setItem('user_data', JSON.stringify(userData));
//     localStorage.setItem('user_role', userData.role);

//     console.log('✅ AuthContext: Login successful', userData);

//     return { user: userData, token: authToken, success: true };
//   } catch (error) {
//     console.error('❌ AuthContext Login Error:', error);
//     throw error;
//   }
// };


// Login function
const login = async (userId, password) => {
  try {
    console.log('🔐 AuthContext: Starting login...', { userId });
    const response = await authLogin({ userId, password });

    console.log('📦 AuthContext: Login response:', response);

    // ✅ FIX: Backend wraps everything in a 'data' object
    
    const userData = response.user;
const authToken = response.accessToken;

    console.log('👤 AuthContext: User data:', userData);
    console.log('🔑 AuthContext: Token:', authToken);

    if (!userData || !authToken) {
      console.error('❌ Missing data:', { userData, authToken, fullResponse: response });
      throw new Error('Invalid response: missing user or token');
    }

    // Update state
    setUser(userData);
    setToken(authToken);
    setIsAuthenticated(true);

    console.log('✅ AuthContext: State updated');
    console.log('   - isAuthenticated:', true);
    console.log('   - user:', userData);
    console.log('   - user.role:', userData.role);

    // Save to localStorage
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('user_data', JSON.stringify(userData));
    localStorage.setItem('user_role', userData.role);

    console.log('💾 AuthContext: Saved to localStorage');
    console.log('✅ AuthContext: Login successful', userData);

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

  // Update user profile function
  const updateUserProfile = (updatedData) => {
    console.log('🔄 AuthContext: Updating user profile...');
    console.log('📝 AuthContext: Updated data:', updatedData);
    
    setUser(prevUser => {
      const newUser = {
        ...prevUser,
        ...updatedData
      };
      console.log('✅ AuthContext: User updated to:', newUser);
      return newUser;
    });
  };

  // Update profile image function
  const updateProfileImage = (imageUrl) => {
    console.log('🖼️ AuthContext: Updating profile image:', imageUrl);
    
    setUser(prevUser => ({
      ...prevUser,
      profileImage: imageUrl
    }));
  };

  // Refresh user data from API
  const refreshUserData = async () => {
    try {
      if (!user || !user._id || !token) {
        console.warn('⚠️ Cannot refresh user data: missing user ID or token');
        return;
      }

      console.log('🔄 AuthContext: Refreshing user data from API...');
      
      // Call your API to get updated user data
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/${user._id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const result = await response.json();
      const updatedUser = result.data;

      console.log('✅ AuthContext: User data refreshed:', updatedUser);
      
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      console.error('❌ AuthContext: Error refreshing user data:', error);
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
        
        console.log('✅ AuthContext: Restored auth from localStorage');
        console.log('👤 AuthContext: User:', userData);
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
    updateUserProfile,
    updateProfileImage,
    refreshUserData,
    setUser, // For manual updates if needed
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// PropTypes validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};