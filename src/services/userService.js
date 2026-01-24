// src/services/userService.js

import apiClient from './api.js';

/**
 * Creates a new user in the system
 * @param {Object} userData - User creation data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email address
 * @param {string} userData.role - User's role (student, teacher, admin)
 * @returns {Promise<Object>} Response containing generated userId and password
 * @throws {Error} If user creation fails
 */
export const createUser = async (userData) => {
  try {
    const response = await apiClient.post('/api/users/create', {
      name: userData.name,
      email: userData.email,
      role: userData.role,
    });
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to create user');
  }
};

/**
 * Retrieves all users with optional filtering and pagination
 * @param {Object} filters - Filter and pagination options
 * @param {string} [filters.role] - Filter by user role
 * @param {string} [filters.status] - Filter by user status
 * @param {string} [filters.search] - Search term for name or email
 * @param {number} [filters.page] - Page number for pagination
 * @param {number} [filters.limit] - Number of users per page
 * @returns {Promise<Object>} Response containing users list and pagination info
 * @throws {Error} If fetching users fails
 */
export const getAllUsers = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.role) params.append('role', filters.role);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const queryString = params.toString();
    const url = queryString ? `/api/users?${queryString}` : '/api/users';

    const response = await apiClient.get(url);
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch users');
  }
};

/**
 * Retrieves a specific user by their ID
 * @param {string} id - User's unique identifier
 * @returns {Promise<Object>} User details
 * @throws {Error} If fetching user fails
 */
export const getUserById = async (id) => {
  try {
    const response = await apiClient.get(`/api/users/${id}`);
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch user details');
  }
};

/**
 * Updates an existing user's information
 * @param {string} id - User's unique identifier
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Update confirmation response
 * @throws {Error} If user update fails
 */
export const updateUser = async (id, userData) => {
  try {
    const response = await apiClient.put(`/api/users/${id}`, userData);
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to update user');
  }
};

/**
 * Deletes a user from the system
 * @param {string} id - User's unique identifier
 * @returns {Promise<Object>} Deletion confirmation response
 * @throws {Error} If user deletion fails
 */
export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`/api/users/${id}`);
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to delete user');
  }
};

/**
 * Resets a user's password and returns the new password
 * @param {string} id - User's unique identifier
 * @returns {Promise<Object>} Response containing new password
 * @throws {Error} If password reset fails
 */
export const resetUserPassword = async (id) => {
  try {
    const response = await apiClient.put('/api/users/reset-password', {
      userId: id,
    });
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to reset user password');
  }
};

/**
 * Toggles a user's active/inactive status
 * @param {string} id - User's unique identifier
 * @param {string} status - New status ('active' or 'inactive')
 * @returns {Promise<Object>} Status update confirmation response
 * @throws {Error} If status update fails
 */
export const toggleUserStatus = async (id, status) => {
  try {
    const response = await apiClient.put(`/api/users/${id}`, {
      status,
    });
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to update user status');
  }
};
