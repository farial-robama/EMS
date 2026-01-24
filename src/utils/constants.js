// src/utils/constants.js

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  STUDENT: 'student',
  TEACHER: 'teacher',
};

export const USER_ID_PREFIXES = {
  STUDENT: 'STU',
  TEACHER: 'TCH',
};

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  REGISTER: '/auth/register',
  VERIFY_EMAIL: '/auth/verify-email',
  GET_PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  GET_USERS: '/admin/users',
  CREATE_USER: '/admin/users',
  UPDATE_USER: '/admin/users',
  DELETE_USER: '/admin/users',
};

export const ROUTE_PATHS = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  DASHBOARD: '/dashboard',
  STUDENT_DASHBOARD: '/dashboard/student',
  TEACHER_DASHBOARD: '/dashboard/teacher',
  ADMIN_DASHBOARD: '/dashboard/admin',
  SUPER_ADMIN_DASHBOARD: '/dashboard/super-admin',
  PROFILE: '/profile',
  USERS: '/admin/users',
  COURSES: '/courses',
  GRADES: '/grades',
};

export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const STATUS_MESSAGES = {
  SUCCESS: 'Operation completed successfully',
  ERROR: 'An error occurred',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  PASSWORD_RESET_SENT: 'Password reset link sent to your email',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
};
