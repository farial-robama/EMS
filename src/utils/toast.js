// src/utils/toast.js

import { toast } from 'react-toastify';

/**
 * Shows a success toast notification
 * @param {string} message - The message to display
 */
export const showSuccess = (message) => {
  toast.success(message);
};

/**
 * Shows an error toast notification
 * @param {string} message - The message to display
 */
export const showError = (message) => {
  toast.error(message);
};

/**
 * Shows an info toast notification
 * @param {string} message - The message to display
 */
export const showInfo = (message) => {
  toast.info(message);
};

/**
 * Shows a warning toast notification
 * @param {string} message - The message to display
 */
export const showWarning = (message) => {
  toast.warning(message);
};
