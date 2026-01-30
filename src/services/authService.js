// src/services/authService.js

import apiClient from './api.js';

/**
 * MOCK USER DATABASE (For Testing Only)
 * Remove this when connecting to real backend
 */
const MOCK_USERS = [
  {
    userId: 'admin',
    password: 'admin123',
    user: {
      id: '1',
      userId: 'admin',
      name: 'Super Admin',
      email: 'admin@advanceitsolutions.com',
      role: 'super_admin',
      permissions: ['*'],
    },
  },
  {
    userId: 'test',
    password: 'test123',
    user: {
      id: '1.5',
      userId: 'test',
      name: 'Test Admin',
      email: 'test@advanceitsolutions.com',
      role: 'super_admin',
      permissions: ['*'],
    },
  },
  {
    userId: 'STU000001',
    password: 'STU000001',
    user: {
      id: '2',
      userId: 'STU000001',
      name: 'John Doe',
      email: 'john@student.com',
      role: 'student',
      permissions: [],
    },
  },
  {
    userId: 'TCH000001',
    password: 'TCH000001',
    user: {
      id: '3',
      userId: 'TCH000001',
      name: 'Jane Smith',
      email: 'jane@teacher.com',
      role: 'teacher',
      permissions: [],
    },
  },
];

/**
 * Authenticates a user with userId and password
 * @param {string} userId - The user's ID (e.g., STU001234, TCH001234)
 * @param {string} password - The user's password
 * @returns {Promise<Object>} Response containing user data and token
 * @throws {Error} If login fails
 */
export const login = async (userId, password) => {
  try {
    console.log('🔐 Attempting login with:', { userId, password });
    console.log(
      '📊 Available mock users:',
      MOCK_USERS.map((u) => u.userId)
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Debug: Check each user
    MOCK_USERS.forEach((u) => {
      console.log(
        `Checking user: ${u.userId} - Match ID: ${u.userId === userId}, Match Pass: ${u.password === password}`
      );
    });

    const mockUser = MOCK_USERS.find(
      (u) => u.userId === userId && u.password === password
    );

    if (!mockUser) {
      console.error(
        '❌ User not found. Credentials do not match any mock user.'
      );
      throw new Error('Invalid User ID or Password');
    }

    const mockToken = `mock_token_${Date.now()}`;

    console.log('✅ Login successful:', mockUser.user);
    console.log('🎫 Generated token:', mockToken);

    return {
      success: true,
      token: mockToken,
      user: mockUser.user,
      message: 'Login successful',
    };
  } catch (error) {
    console.error('❌ Login error:', error.message);
    throw error;
  }
};

/**
 * Logs out the current user
 * @returns {Promise<Object>} Logout response
 * @throws {Error} If logout fails
 */
export const logout = async () => {
  // If using real API:
  // await apiClient.post('/api/auth/logout');

  console.log('👋 Logged out successfully');

  // Clear authentication data from localStorage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_role');
  localStorage.removeItem('user_data');

  return { success: true };
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
  const response = await apiClient.post('/api/auth/register', {
    ...userData,
    role: 'student', // Self-registration is only for students
  });
  return response;
};

/**
 * Initiates password reset process by sending reset email
 * @param {string} email - The user's email address
 * @returns {Promise<Object>} Response confirming email sent
 * @throws {Error} If password reset request fails
 */
export const forgotPassword = async (email) => {
  // Mock response
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('📧 Password reset email sent to:', email);

  return {
    success: true,
    message: 'Password reset link sent to your email',
  };

  // Real API:
  // const response = await apiClient.post('/api/auth/forgot-password', { email });
  // return response;
};

/**
 * Resets user password using reset token
 * @param {string} token - Password reset token from email
 * @param {string} newPassword - New password to set
 * @returns {Promise<Object>} Response confirming password reset
 * @throws {Error} If password reset fails
 */
export const resetPassword = async () => {
  // Mock response
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    message: 'Password reset successful',
  };

  // Real API example (keep for reference):
  // const response = await apiClient.post('/api/auth/reset-password', {
  //   token,
  //   newPassword,
  // });
  // return response;
};
