// import { lazy } from 'react';

// // Lazy-loaded pages for code-splitting
// const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
// const ForgotPasswordPage = lazy(
//   () => import('../pages/auth/ForgotPasswordPage')
// );
// const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));

// const SuperAdminDashboard = lazy(
//   () => import('../pages/dashboards/SuperAdminDashboard')
// );
// const AdminDashboard = lazy(() => import('../pages/dashboards/AdminDashboard'));
// const TeacherDashboard = lazy(
//   () => import('../pages/dashboards/TeacherDashboard')
// );
// const StudentDashboard = lazy(
//   () => import('../pages/dashboards/StudentDashboard')
// );

// // Super Admin pages
// const StudentsAdmission = lazy(
//   () => import('../pages/super-admin/StudentsAdmission')
// );
// const AddTeacher = lazy(() => import('../pages/super-admin/AddTeacher'));
// const ManageUsers = lazy(() => import('../pages/super-admin/ManageUsers'));
// const Reports = lazy(() => import('../pages/super-admin/Reports'));

// // ── User Management sub-pages ──────────────────────────────────────────
// const UserGroupList = lazy(
//   () => import('../pages/super-admin/UserManagement/UserGroupList')
// );
// const UserRoleGroupManagement = lazy(
//   () => import('../pages/super-admin/UserManagement/UserRoleGroupManagement')
// );
// // ─────────────────────────────────────────────────────────────────────────────

// const routes = [
//   // Authentication
//   {
//     path: '/auth/login',
//     element: LoginPage,
//     title: 'Login - Advance School & College',
//   },
//   {
//     path: '/auth/forgot-password',
//     element: ForgotPasswordPage,
//     title: 'Forgot Password',
//   },
//   {
//     path: '/auth/reset-password',
//     element: ResetPasswordPage,
//     title: 'Reset Password',
//   },

//   // Dashboards
//   {
//     path: '/super-admin/dashboard',
//     element: SuperAdminDashboard,
//     protected: true,
//     allowedRoles: ['super_admin'],
//     title: 'Super Admin Dashboard',
//   },

//   // Super admin action pages
//   {
//     path: '/super-admin/students/admission',
//     element: StudentsAdmission,
//     protected: true,
//     allowedRoles: ['super_admin'],
//     title: 'Student Admission',
//   },
//   {
//     path: '/super-admin/teachers/add',
//     element: AddTeacher,
//     protected: true,
//     allowedRoles: ['super_admin'],
//     title: 'Add Teacher',
//   },
//   {
//     path: '/super-admin/users',
//     element: ManageUsers,
//     protected: true,
//     allowedRoles: ['super_admin'],
//     title: 'Manage Users',
//   },
//   {
//     path: '/super-admin/reports',
//     element: Reports,
//     protected: true,
//     allowedRoles: ['super_admin'],
//     title: 'Reports',
//   },

//   // ── User Group & Role routes ────────────────────────────────────────
//   {
//     path: '/super-admin/users/groups',
//     element: UserGroupList,
//     protected: true,
//     allowedRoles: ['super_admin'],
//     title: 'User Groups',
//   },
//   {
//     path: '/super-admin/users/roles',
//     element: UserRoleGroupManagement,
//     protected: true,
//     allowedRoles: ['super_admin'],
//     title: 'Role & Permissions',
//   },
//   // ───────────────────────────────────────────────────────────────────────────

//   {
//     path: '/admin/dashboard',
//     element: AdminDashboard,
//     protected: true,
//     allowedRoles: ['admin', 'super_admin'],
//     title: 'Admin Dashboard',
//   },
//   {
//     path: '/teacher/dashboard',
//     element: TeacherDashboard,
//     protected: true,
//     allowedRoles: ['teacher'],
//     title: 'Teacher Dashboard',
//   },
//   {
//     path: '/student/dashboard',
//     element: StudentDashboard,
//     protected: true,
//     allowedRoles: ['student'],
//     title: 'Student Dashboard',
//   },
// ];

// export default routes;


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

<<<<<<< HEAD
=======
// User Profile
const UserProfile = lazy(() => import('../pages/UserProfile/UserProfile'));

>>>>>>> ca9beb7 (Add user groups, role management, user profile and login page update)
// Super Admin pages
const StudentsAdmission = lazy(
  () => import('../pages/super-admin/StudentsAdmission')
);
const AddTeacher = lazy(() => import('../pages/super-admin/AddTeacher'));
const ManageUsers = lazy(() => import('../pages/super-admin/ManageUsers'));
const Reports = lazy(() => import('../pages/super-admin/Reports'));

// ── User Management sub-pages ──────────────────────────────────────────
const UserGroupList = lazy(
  () => import('../pages/super-admin/UserManagement/UserGroupList')
);
const UserRoleGroupManagement = lazy(
  () => import('../pages/super-admin/UserManagement/UserRoleGroupManagement')
);
// ─────────────────────────────────────────────────────────────────────────────

const routes = [
  // Authentication
  {
    path: '/auth/login',
    element: LoginPage,
    title: 'Login - Advance School & College',
  },
  {
    path: '/auth/forgot-password',
    element: ForgotPasswordPage,
    title: 'Forgot Password',
  },
  {
    path: '/auth/reset-password',
    element: ResetPasswordPage,
    title: 'Reset Password',
  },

  // ── User Profile (Accessible by all authenticated users) ───────────
  {
    path: '/profile',
    element: UserProfile,
    protected: true,
    allowedRoles: ['super_admin', 'admin', 'teacher', 'student'],
    title: 'My Profile',
  },
  // ───────────────────────────────────────────────────────────────────

  // Dashboards
  {
    path: '/super-admin/dashboard',
    element: SuperAdminDashboard,
    protected: true,
    allowedRoles: ['super_admin'],
    title: 'Super Admin Dashboard',
  },
<<<<<<< HEAD
=======

>>>>>>> ca9beb7 (Add user groups, role management, user profile and login page update)
  // Super admin action pages
  {
    path: '/super-admin/students/admission',
    element: StudentsAdmission,
    protected: true,
    allowedRoles: ['super_admin'],
    title: 'Student Admission',
<<<<<<< HEAD
    breadcrumbs: [
      { label: 'Dashboard', path: '/super-admin/dashboard' },
      { label: 'Students' },
      { label: 'Admission' },
    ],
=======
>>>>>>> ca9beb7 (Add user groups, role management, user profile and login page update)
  },
  {
    path: '/super-admin/teachers/add',
    element: AddTeacher,
    protected: true,
    allowedRoles: ['super_admin'],
    title: 'Add Teacher',
<<<<<<< HEAD
    breadcrumbs: [
      { label: 'Dashboard', path: '/super-admin/dashboard' },
      { label: 'Teachers' },
      { label: 'Add' },
    ],
=======
>>>>>>> ca9beb7 (Add user groups, role management, user profile and login page update)
  },
  {
    path: '/super-admin/users',
    element: ManageUsers,
    protected: true,
    allowedRoles: ['super_admin'],
    title: 'Manage Users',
<<<<<<< HEAD
    breadcrumbs: [
      { label: 'Dashboard', path: '/super-admin/dashboard' },
      { label: 'Users' },
    ],
=======
>>>>>>> ca9beb7 (Add user groups, role management, user profile and login page update)
  },
  {
    path: '/super-admin/reports',
    element: Reports,
    protected: true,
    allowedRoles: ['super_admin'],
    title: 'Reports',
<<<<<<< HEAD
    breadcrumbs: [
      { label: 'Dashboard', path: '/super-admin/dashboard' },
      { label: 'Reports' },
    ],
  },
=======
  },

  // ── User Group & Role routes ────────────────────────────────────────
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
  // ───────────────────────────────────────────────────────────────────────────

>>>>>>> ca9beb7 (Add user groups, role management, user profile and login page update)
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
];

export default routes;