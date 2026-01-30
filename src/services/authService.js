// src/services/authService.js

import apiClient from './api.js';

/**
 * Authenticates a user with userId and password
 * @param {string} userId - The user's ID (e.g., STU001234, TCH001234)
 * @param {string} password - The user's password
 * @returns {Promise<Object>} Response containing user data and token
 * @throws {Error} If login fails
 */
export const login = async (userId, password) => {
  try {
    const response = await apiClient.post('/api/auth/login', {
      userId,
      password,
    });
    return response;
  } catch (error) {
    throw new Error(error.message || 'Login failed');
  }
};

/**
 * Logs out the current user
 * @returns {Promise<Object>} Logout response
 * @throws {Error} If logout fails
 */
export const logout = async () => {
  try {
    const response = await apiClient.post('/api/auth/logout');

    // Clear authentication data from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_data');

    return response;
  } catch (error) {
    throw new Error(error.message || 'Logout failed');
  }
};

/**
 * Registers a new student user
 * @param {Object} userData - User registration data
 * @param {string} userData.fullName - User's full name
 * @param {string} userData.email - User's email address
 * @param {string} userData.phone - User's phone number
 * @param {string} userData.password - User's password
 * @returns {Promise<Object>} Response containing user data
 * @throws {Error} If registration fails
 */
export const register = async (userData) => {
  try {
    const response = await apiClient.post('/api/auth/register', {
      ...userData,
      role: 'student', // Self-registration is only for students
    });
    return response;
  } catch (error) {
    throw new Error(error.message || 'Registration failed');
  }
};

/**
 * Initiates password reset process by sending reset email
 * @param {string} email - The user's email address
 * @returns {Promise<Object>} Response confirming email sent
 * @throws {Error} If password reset request fails
 */
export const forgotPassword = async (email) => {
  try {
    const response = await apiClient.post('/api/auth/forgot-password', {
      email,
    });
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to send password reset email');
  }
};

/**
 * Resets user password using reset token
 * @param {string} token - Password reset token from email
 * @param {string} newPassword - New password to set
 * @returns {Promise<Object>} Response confirming password reset
 * @throws {Error} If password reset fails
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await apiClient.post('/api/auth/reset-password', {
      token,
      newPassword,
    });
    return response;
  } catch (error) {
    throw new Error(error.message || 'Password reset failed');
  }
};
