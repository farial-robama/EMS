// src/utils/permissions.js

/**
 * Permission Management System
 * Defines all available permissions in the EMS and provides utility helpers
 * for checking role/permission membership.
 */

// ==================== PERMISSION CATEGORIES ====================
export const PERMISSION_CATEGORIES = {
  DASHBOARD: 'dashboard',
  USERS: 'users',
  STUDENTS: 'students',
  TEACHERS: 'teachers',
  STAFF: 'staff',
  EXAM: 'exam',
  ATTENDANCE: 'attendance',
  LIBRARY: 'library',
  ACCOUNTS: 'accounts',
  SMS: 'sms',
  REPORTS: 'reports',
  SETTINGS: 'settings',
};

// ==================== ALL PERMISSIONS ====================
export const PERMISSIONS = {
  // Dashboard Permissions
  'dashboard.view': 'View Dashboard',
  'dashboard.stats': 'View Statistics',

  // User Management Permissions
  'users.view': 'View Users',
  'users.create': 'Create Users',
  'users.edit': 'Edit Users',
  'users.delete': 'Delete Users',
  'users.activate': 'Activate/Deactivate Users',
  'users.reset_password': 'Reset User Password',
  'users.admin.view': 'View Admins',
  'users.admin.create': 'Create Admins',
  'users.special.view': 'View Special Permission Users',
  'users.special.create': 'Create Special Permission Users',

  // Student Permissions
  'students.view': 'View Students',
  'students.create': 'Add Students',
  'students.edit': 'Edit Students',
  'students.delete': 'Delete Students',
  'students.promote': 'Promote Students',
  'students.portal.enable': 'Enable Student Portal',

  // Teacher Permissions
  'teachers.view': 'View Teachers',
  'teachers.create': 'Add Teachers',
  'teachers.edit': 'Edit Teachers',
  'teachers.delete': 'Delete Teachers',
  'teachers.portal.enable': 'Enable Teacher Portal',

  // Staff Permissions
  'staff.view': 'View Staff',
  'staff.create': 'Add Staff',
  'staff.edit': 'Edit Staff',
  'staff.delete': 'Delete Staff',

  // Exam Permissions
  'exam.view': 'View Exams',
  'exam.create': 'Create Exams',
  'exam.schedule.view': 'View Exam Schedule',
  'exam.schedule.create': 'Create Exam Schedule',
  'exam.results.view': 'View Exam Results',
  'exam.results.edit': 'Edit Exam Results',
  'exam.marks.create': 'Enter Marks',
  'exam.marks.edit': 'Edit Marks',

  // Attendance Permissions
  'attendance.view': 'View Attendance',
  'attendance.students.view': 'View Student Attendance',
  'attendance.students.mark': 'Mark Student Attendance',
  'attendance.teachers.view': 'View Teacher Attendance',
  'attendance.teachers.mark': 'Mark Teacher Attendance',

  // Library Permissions
  'library.view': 'View Library',
  'library.books.view': 'View Books',
  'library.books.create': 'Add Books',
  'library.books.edit': 'Edit Books',
  'library.books.delete': 'Delete Books',
  'library.issue.view': 'View Book Issues',
  'library.issue.create': 'Issue Books',
  'library.issue.return': 'Return Books',

  // Accounts Permissions
  'accounts.view': 'View Accounts',
  'accounts.income.view': 'View Income',
  'accounts.income.create': 'Add Income',
  'accounts.expense.view': 'View Expense',
  'accounts.expense.create': 'Add Expense',
  'accounts.fee.view': 'View Fee Collection',
  'accounts.fee.collect': 'Collect Fees',

  // SMS Permissions
  'sms.view': 'View SMS',
  'sms.send': 'Send SMS',
  'sms.templates.view': 'View SMS Templates',
  'sms.templates.create': 'Create SMS Templates',
  'sms.templates.edit': 'Edit SMS Templates',

  // Reports Permissions
  'reports.view': 'View Reports',
  'reports.students.view': 'View Student Reports',
  'reports.financial.view': 'View Financial Reports',
  'reports.attendance.view': 'View Attendance Reports',
  'reports.export': 'Export Reports',

  // Settings Permissions
  'settings.view': 'View Settings',
  'settings.general.view': 'View General Settings',
  'settings.general.edit': 'Edit General Settings',
  'settings.academic.view': 'View Academic Year Settings',
  'settings.academic.edit': 'Edit Academic Year Settings',
  'settings.permissions.view': 'View Permissions',
  'settings.permissions.edit': 'Edit Permissions',
};

// ==================== PERMISSION GROUPS ====================
export const PERMISSION_GROUPS = {
  dashboard: ['dashboard.view', 'dashboard.stats'],
  users: [
    'users.view',
    'users.create',
    'users.edit',
    'users.delete',
    'users.activate',
    'users.reset_password',
    'users.admin.view',
    'users.admin.create',
    'users.special.view',
    'users.special.create',
  ],
  students: [
    'students.view',
    'students.create',
    'students.edit',
    'students.delete',
    'students.promote',
    'students.portal.enable',
  ],
  teachers: [
    'teachers.view',
    'teachers.create',
    'teachers.edit',
    'teachers.delete',
    'teachers.portal.enable',
  ],
  staff: ['staff.view', 'staff.create', 'staff.edit', 'staff.delete'],
  exam: [
    'exam.view',
    'exam.create',
    'exam.schedule.view',
    'exam.schedule.create',
    'exam.results.view',
    'exam.results.edit',
    'exam.marks.create',
    'exam.marks.edit',
  ],
  attendance: [
    'attendance.view',
    'attendance.students.view',
    'attendance.students.mark',
    'attendance.teachers.view',
    'attendance.teachers.mark',
  ],
  library: [
    'library.view',
    'library.books.view',
    'library.books.create',
    'library.books.edit',
    'library.books.delete',
    'library.issue.view',
    'library.issue.create',
    'library.issue.return',
  ],
  accounts: [
    'accounts.view',
    'accounts.income.view',
    'accounts.income.create',
    'accounts.expense.view',
    'accounts.expense.create',
    'accounts.fee.view',
    'accounts.fee.collect',
  ],
  sms: [
    'sms.view',
    'sms.send',
    'sms.templates.view',
    'sms.templates.create',
    'sms.templates.edit',
  ],
  reports: [
    'reports.view',
    'reports.students.view',
    'reports.financial.view',
    'reports.attendance.view',
    'reports.export',
  ],
  settings: [
    'settings.view',
    'settings.general.view',
    'settings.general.edit',
    'settings.academic.view',
    'settings.academic.edit',
    'settings.permissions.view',
    'settings.permissions.edit',
  ],
};

// ==================== ROLE-BASED DEFAULT PERMISSIONS ====================
export const DEFAULT_ROLE_PERMISSIONS = {
  SUPER_ADMIN: Object.keys(PERMISSIONS), // All permissions

  ADMIN: [
    // Dashboard
    ...PERMISSION_GROUPS.dashboard,

    // Users (limited)
    'users.view',
    'users.special.view',
    'users.special.create',

    // Students (full)
    ...PERMISSION_GROUPS.students,

    // Teachers (full)
    ...PERMISSION_GROUPS.teachers,

    // Staff
    ...PERMISSION_GROUPS.staff,

    // Exam
    ...PERMISSION_GROUPS.exam,

    // Attendance
    ...PERMISSION_GROUPS.attendance,

    // Library
    ...PERMISSION_GROUPS.library,

    // Accounts (view only)
    'accounts.view',
    'accounts.income.view',
    'accounts.expense.view',
    'accounts.fee.view',

    // SMS
    ...PERMISSION_GROUPS.sms,

    // Reports
    ...PERMISSION_GROUPS.reports,
  ],

  TEACHER: [
    'dashboard.view',
    'students.view',
    'exam.view',
    'exam.marks.create',
    'attendance.students.view',
    'attendance.students.mark',
    'library.view',
    'library.books.view',
  ],

  STUDENT: [
    'dashboard.view',
    'exam.results.view',
    'attendance.view',
    'library.view',
    'library.books.view',
  ],
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Normalize input to an array of permission strings
 * @param {string | string[] | null | undefined} perms
 * @returns {string[]} array of permission strings
 */
const normalizeToArray = (perms) => {
  if (!perms) return [];
  if (Array.isArray(perms)) return perms.filter(Boolean);
  if (typeof perms === 'string') return [perms];
  return [];
};

/**
 * Expand a permission/group identifier to concrete permission keys
 * Accepts:
 * - individual permission keys (e.g., 'users.view')
 * - group keys (e.g., 'users') to expand from PERMISSION_GROUPS
 * - wildcard '*' which expands to all permissions
 * @param {string} key
 * @returns {string[]} array of permission keys
 */
export const expandPermissionKey = (key) => {
  if (!key) return [];
  if (key === '*') return Object.keys(PERMISSIONS);
  if (PERMISSION_GROUPS[key]) return PERMISSION_GROUPS[key];
  return [key];
};

/**
 * Check if a user's permission set grants a specific permission.
 * Supports exact match, group wildcard (e.g., 'users.*'), and global '*'.
 * @param {string[] | string} userPermissions
 * @param {string} requiredPermission
 * @returns {boolean}
 */
export const hasPermission = (userPermissions, requiredPermission) => {
  const userPerms = normalizeToArray(userPermissions);
  if (userPerms.includes('*')) return true; // super-permission

  // Exact match
  if (userPerms.includes(requiredPermission)) return true;

  // Wildcard match, e.g. 'users.*'
  for (const p of userPerms) {
    if (p.endsWith('.*')) {
      const prefix = p.slice(0, -1); // keep the trailing '.'
      if (requiredPermission.startsWith(prefix)) return true;
    }
  }

  return false;
};

/**
 * Check if the user has any of the given permissions
 * @param {string[] | string} userPermissions
 * @param {string[] | string} requiredPermissions
 * @returns {boolean}
 */
export const hasAnyPermission = (userPermissions, requiredPermissions) => {
  const required = normalizeToArray(requiredPermissions);
  return required.some((rp) => hasPermission(userPermissions, rp));
};

/**
 * Check if the user has all the given permissions
 * @param {string[] | string} userPermissions
 * @param {string[] | string} requiredPermissions
 * @returns {boolean}
 */
export const hasAllPermissions = (userPermissions, requiredPermissions) => {
  const required = normalizeToArray(requiredPermissions);
  return required.every((rp) => hasPermission(userPermissions, rp));
};

/**
 * Get permissions for a named role (case-insensitive). Returns an array.
 * If role is SUPER_ADMIN, returns all permissions.
 * @param {string} role
 * @returns {string[]}
 */
export const getRolePermissions = (role) => {
  if (!role) return [];
  const key = role.toString().toUpperCase();
  if (key === 'SUPER_ADMIN') return Object.keys(PERMISSIONS);
  return DEFAULT_ROLE_PERMISSIONS[key] || [];
};

/**
 * Convenience check to see if role/permissions indicate super-admin
 * @param {string | string[]} roleOrPermissions
 * @returns {boolean}
 */
export const isSuperAdmin = (roleOrPermissions) => {
  if (!roleOrPermissions) return false;
  if (typeof roleOrPermissions === 'string') {
    return roleOrPermissions.toUpperCase() === 'SUPER_ADMIN';
  }
  // array of permissions
  if (Array.isArray(roleOrPermissions)) return roleOrPermissions.includes('*');
  return false;
};

/**
 * Return human-friendly label for a permission key
 * @param {string} permissionKey
 * @returns {string}
 */
export const getPermissionLabel = (permissionKey) => {
  return PERMISSIONS[permissionKey] || permissionKey || '';
};

/**
 * Expand an input (single or array) that may contain group keys and return
 * a deduplicated list of concrete permission keys.
 * @param {string | string[]} keys
 * @returns {string[]}
 */
export const expandPermissions = (keys) => {
  const arr = normalizeToArray(keys);
  const result = new Set();

  for (const k of arr) {
    if (k === '*') {
      Object.keys(PERMISSIONS).forEach((p) => result.add(p));
      continue;
    }

    if (PERMISSION_GROUPS[k]) {
      PERMISSION_GROUPS[k].forEach((p) => result.add(p));
      continue;
    }

    result.add(k);
  }

  return Array.from(result);
};

export default {
  PERMISSION_CATEGORIES,
  PERMISSIONS,
  PERMISSION_GROUPS,
  DEFAULT_ROLE_PERMISSIONS,
  expandPermissionKey,
  expandPermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRolePermissions,
  isSuperAdmin,
  getPermissionLabel,
};
