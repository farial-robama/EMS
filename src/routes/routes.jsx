import { lazy } from 'react';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';

// Lazy-loaded pages for code-splitting
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));

const SuperAdminDashboard = lazy(() => import('../pages/dashboards/SuperAdminDashboard'));
const AdminDashboard = lazy(() => import('../pages/dashboards/AdminDashboard'));
const TeacherDashboard = lazy(() => import('../pages/dashboards/TeacherDashboard'));
const StudentDashboard = lazy(() => import('../pages/dashboards/StudentDashboard'));

// User Profile
const UserProfile = lazy(() => import('../pages/UserProfile/UserProfile'));

// Super Admin pages
const StudentsAdmission = lazy(() => import('../pages/super-admin/StudentsAdmission'));
const AddTeacher = lazy(() => import('../pages/super-admin/AddTeacher'));
const ManageUsers = lazy(() => import('../pages/super-admin/ManageUsers'));
const Reports = lazy(() => import('../pages/super-admin/Reports'));

// User Management sub-pages
const UserGroupList = lazy(() => import('../pages/super-admin/UserManagement/UserGroupList'));
const UserRoleGroupManagement = lazy(() => import('../pages/super-admin/UserManagement/UserRoleGroupManagement'));

const routes = [
  // Authentication
  { path: '/auth/login', element: LoginPage, title: 'Login - Advance School & College' },
  { path: '/auth/forgot-password', element: ForgotPasswordPage, title: 'Forgot Password' },
  { path: '/auth/reset-password', element: ResetPasswordPage, title: 'Reset Password' },
  { path: '/auth/verify-email', element: VerifyEmailPage, title: 'Verify Email' },

  // User Profile
  {
    path: '/profile',
    element: UserProfile,
    protected: true,
    allowedRoles: ['super_admin', 'admin', 'teacher', 'student'],
    title: 'My Profile',
  },

  // Dashboards
  {
    path: '/super-admin/dashboard',
    element: SuperAdminDashboard,
    protected: true,
    allowedRoles: ['super_admin'],
    title: 'Super Admin Dashboard',
  },
  {
    path: '/admin/dashboard',
    element: AdminDashboard,
    protected: true,
    allowedRoles: ['admin', 'super_admin'],
    title: 'Admin Dashboard',
  },
  {
    path: '/teacher/dashboard',
    element: TeacherDashboard,
    protected: true,
    allowedRoles: ['teacher'],
    title: 'Teacher Dashboard',
  },
  {
    path: '/student/dashboard',
    element: StudentDashboard,
    protected: true,
    allowedRoles: ['student'],
    title: 'Student Dashboard',
  },

  // Super admin action pages
  {
    path: '/super-admin/students/admission',
    element: StudentsAdmission,
    protected: true,
    allowedRoles: ['super_admin'],
    title: 'Student Admission',
    breadcrumbs: [
      { label: 'Dashboard', path: '/super-admin/dashboard' },
      { label: 'Students' },
      { label: 'Admission' },
    ],
  },
  {
    path: '/super-admin/teachers/add',
    element: AddTeacher,
    protected: true,
    allowedRoles: ['super_admin'],
    title: 'Add Teacher',
    breadcrumbs: [
      { label: 'Dashboard', path: '/super-admin/dashboard' },
      { label: 'Teachers' },
      { label: 'Add' },
    ],
  },
  {
    path: '/super-admin/users',
    element: ManageUsers,
    protected: true,
    allowedRoles: ['super_admin'],
    title: 'Manage Users',
    breadcrumbs: [
      { label: 'Dashboard', path: '/super-admin/dashboard' },
      { label: 'Users' },
    ],
  },
  {
    path: '/super-admin/reports',
    element: Reports,
    protected: true,
    allowedRoles: ['super_admin'],
    title: 'Reports',
    breadcrumbs: [
      { label: 'Dashboard', path: '/super-admin/dashboard' },
      { label: 'Reports' },
    ],
  },

  // User Group & Role routes
  {
    path: '/super-admin/users/groups',
    element: UserGroupList,
    protected: true,
    allowedRoles: ['super_admin'],
    title: 'User Groups',
  },
  {
    path: '/super-admin/users/roles',
    element: UserRoleGroupManagement,
    protected: true,
    allowedRoles: ['super_admin'],
    title: 'Role & Permissions',
  },
];

export default routes;
