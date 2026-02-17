// src/services/authService.js
import apiClient from './api';

/**
 * Register a new user
 */
export const registerUser = async (payload) => {
  const response = await apiClient.post('/auth/register', payload);
  return response.data;
};

/**
 * Login user
 */
export const loginUser = async (payload) => {
  const response = await apiClient.post('/auth/login', payload);
  return response.data;
  // return response.data.data;
};

/**
 * Refresh token
 */
export const refreshToken = async (token) => {
  const response = await apiClient.post('/auth/refresh-token', { token });
  return response.data;
};

/**
 * Forgot password - request OTP
 */
export const forgotPassword = async (email) => {
  const response = await apiClient.post('/auth/forgot-password', { email });
  return response.data;
};

/**
 * Verify email OTP
 */
export const verifyEmail = async (email, otp) => {
  const response = await apiClient.post('/auth/verify-email', { email, otp });
  return response.data;
};

/**
 * Reset password
 */
export const resetPassword = async (email, newPassword) => {
  const response = await apiClient.post('/auth/reset-password', { email, newPassword });
  return response.data;
};

/**
 * Change password
 */
export const changePassword = async (userId, oldPassword, newPassword) => {
  const response = await apiClient.post('/auth/change-password', {
    userId,
    oldPassword,
    newPassword,
  });
  return response.data;
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  const response = await apiClient.post('/auth/logout');
  return response.data;
};
