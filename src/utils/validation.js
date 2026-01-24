// src/utils/validation.js

export const validateUserId = (userId) => {
  if (!userId) {
    return { isValid: false, message: 'User ID is required' };
  }

  const studentRegex = /^STU\d{6}$/;
  const teacherRegex = /^TCH\d{6}$/;
  const adminRegex = /^ADM\d{6}$/; // Assuming admin format

  if (
    studentRegex.test(userId) ||
    teacherRegex.test(userId) ||
    adminRegex.test(userId)
  ) {
    return { isValid: true, message: '' };
  }

  return {
    isValid: false,
    message: 'Invalid User ID format. Must be STU/ADM/TCH followed by 6 digits',
  };
};

export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = new RegExp('[!@#$%^&*()_+-=\\[\\]{};"\'\\\\|,.<>/?]').test(
    password
  );

  if (password.length < minLength) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long',
    };
  }
  if (!hasUppercase) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter',
    };
  }
  if (!hasLowercase) {
    return {
      isValid: false,
      message: 'Password must contain at least one lowercase letter',
    };
  }
  if (!hasNumber) {
    return {
      isValid: false,
      message: 'Password must contain at least one number',
    };
  }
  if (!hasSymbol) {
    return {
      isValid: false,
      message: 'Password must contain at least one special character',
    };
  }

  return { isValid: true, message: '' };
};

export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }

  return { isValid: true, message: '' };
};

export const validateRequired = (value) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, message: 'This field is required' };
  }

  return { isValid: true, message: '' };
};
