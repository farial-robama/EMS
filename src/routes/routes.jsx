import { lazy } from 'react';

// Lazy-loaded pages for code-splitting
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));

const SuperAdminDashboard = lazy(() => import('../pages/dashboards/SuperAdminDashboard'));
const AdminDashboard = lazy(() => import('../pages/dashboards/AdminDashboard'));
const TeacherDashboard = lazy(() => import('../pages/dashboards/TeacherDashboard'));
const StudentDashboard = lazy(() => import('../pages/dashboards/StudentDashboard'));

const routes = [
  // Authentication
  {
    path: '/auth/login',
    element: LoginPage,
    title: 'Sign In',
    breadcrumbs: [{ label: 'Sign In' }],
  },
  {
    path: '/auth/forgot-password',
    element: ForgotPasswordPage,
    title: 'Forgot Password',
    breadcrumbs: [{ label: 'Forgot Password' }],
  },
  {
    path: '/auth/reset-password',
    element: ResetPasswordPage,
    title: 'Reset Password',
    breadcrumbs: [{ label: 'Reset Password' }],
  },

  // Dashboards
  {
    path: '/super-admin/dashboard',
    element: SuperAdminDashboard,
    protected: true,
    allowedRoles: ['super_admin'],
    title: 'Super Admin Dashboard',
    breadcrumbs: [{ label: 'Dashboard', path: '/super-admin/dashboard' }],
  },
  {
    path: '/admin/dashboard',
    element: AdminDashboard,
    protected: true,
    allowedRoles: ['admin', 'super_admin'],
    title: 'Admin Dashboard',
    breadcrumbs: [{ label: 'Dashboard', path: '/admin/dashboard' }],
  },
  {
    path: '/teacher/dashboard',
    element: TeacherDashboard,
    protected: true,
    allowedRoles: ['teacher'],
    title: 'Teacher Dashboard',
    breadcrumbs: [{ label: 'Dashboard', path: '/teacher/dashboard' }],
  },
  {
    path: '/student/dashboard',
    element: StudentDashboard,
    protected: true,
    allowedRoles: ['student'],
    title: 'Student Dashboard',
    breadcrumbs: [{ label: 'Dashboard', path: '/student/dashboard' }],
  },
];

export default routes;
