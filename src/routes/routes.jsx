import { lazy } from 'react';

// Lazy-loaded pages for code-splitting
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const ForgotPasswordPage = lazy(
  () => import('../pages/auth/ForgotPasswordPage')
);
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));

const SuperAdminDashboard = lazy(
  () => import('../pages/dashboards/SuperAdminDashboard')
);
const AdminDashboard = lazy(() => import('../pages/dashboards/AdminDashboard'));
const TeacherDashboard = lazy(
  () => import('../pages/dashboards/TeacherDashboard')
);
const StudentDashboard = lazy(
  () => import('../pages/dashboards/StudentDashboard')
);

// Super Admin pages
const StudentsAdmission = lazy(
  () => import('../pages/super-admin/StudentsAdmission')
);
const AddTeacher = lazy(() => import('../pages/super-admin/AddTeacher'));
const ManageUsers = lazy(() => import('../pages/super-admin/ManageUsers'));
const Reports = lazy(() => import('../pages/super-admin/Reports'));

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
