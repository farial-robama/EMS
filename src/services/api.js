// src/services/api.js

import axios from 'axios';
import { toast } from 'react-toastify';

// Create an axios instance with base configuration
// This instance will be used for all API calls throughout the application
const apiClient = axios.create({
  // Base URL from environment variable for flexibility across environments
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // Timeout set to 10 seconds to prevent hanging requests
  timeout: 10000,
  // Default headers for JSON content type
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
// This interceptor runs before every request is sent
// It automatically adds the authentication token if available
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the authentication token from localStorage
    const token = localStorage.getItem('auth_token');

    // If a token exists, add it to the Authorization header
    // This ensures all authenticated requests include the Bearer token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('📤 API Request:', config.method.toUpperCase(), config.url);

    // Return the modified config to proceed with the request
    return config;
  },
  (error) => {
    // If there's an error in the request setup, reject the promise
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
// This interceptor runs after every response is received
// It handles both successful responses and errors globally
apiClient.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', response.status, response.config.url);
    // On successful response, return only the data portion
    // This simplifies response handling in components
    return response.data;
  },
  (error) => {
    console.error('❌ API Error:', error);

    // Handle different types of errors based on status codes
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized: Token is invalid or expired
          // Clear stored authentication data
          console.log('🔒 Unauthorized - Clearing auth');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_role');
          localStorage.removeItem('user_data');

          // Show error message to user
          toast.error('Session expired. Please login again.');

          // Redirect to login page
          window.location.href = '/login';
          break;

        case 403:
          // Forbidden: User doesn't have permission
          console.log('⛔ Access denied');
          toast.error(
            'Access denied. You do not have permission to perform this action.'
          );
          break;

        case 500:
          // Internal Server Error
          console.log('💥 Server error');
          toast.error('Server error occurred. Please try again later.');
          break;

        default: {
          // Other errors: Show generic message or specific message from server
          const message = data?.message || 'An error occurred';
          console.log(`⚠️ Error ${status}:`, message);
          toast.error(message);
          break;
        }
      }
    } else if (error.request) {
      // Network error: Request was made but no response received
      console.error('📡 No response from server');
      toast.error('Network error. Please check your internet connection.');
    } else {
      // Other errors: Something else happened
      console.error('⚙️ Request setup error');
      toast.error('An unexpected error occurred.');
    }

    // Return a formatted error object for component-level error handling
    return Promise.reject({
      success: false,
      message:
        error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status,
    });
  }
);

// Export the configured axios instance
// This is the main API client that should be used throughout the application
export default apiClient;
