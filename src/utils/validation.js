// src/utils/validation.js

export const validateUserId = (userId) => {
  if (!userId || userId.trim() === '') {
    return { isValid: false, message: 'User ID is required' };
  }

  const trimmedId = userId.trim();

  // Check for Student ID format: STU + 6 digits
  const studentPattern = /^STU\d{6}$/;
  if (studentPattern.test(trimmedId)) {
    return { isValid: true };
  }

  // Check for Teacher ID format: TCH + 6 digits
  const teacherPattern = /^TCH\d{6}$/;
  if (teacherPattern.test(trimmedId)) {
    return { isValid: true };
  }

  // Allow admin usernames (alphanumeric, 3-20 chars)
  const adminPattern = /^[a-zA-Z0-9]{3,20}$/;
  if (adminPattern.test(trimmedId)) {
    return { isValid: true };
  }

  return {
    isValid: false,
    message:
      'Invalid User ID format. Use STU000000, TCH000000, or admin username',
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
