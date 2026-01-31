// src/components/layout/menus.js

import {
  Home,
  Users,
  Settings,
  BookOpen,
  Clock,
  GraduationCap,
  UserCheck,
  ClipboardList,
  Calendar,
  Library,
  MessageSquare,
  FileText,
  BarChart,
  DollarSign,
  Shield,
} from 'lucide-react';

export const superAdminMenu = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/super-admin/dashboard',
    permission: 'dashboard.view',
  },
  {
    id: 'user-management',
    label: 'User Management',
    icon: Users,
    permission: 'users.view',
    submenus: [
      {
        id: 'all-users',
        label: 'All Users',
        path: '/super-admin/users',
        permission: 'users.view',
      },
      {
        id: 'admins',
        label: 'Admins',
        path: '/super-admin/users/admins',
        permission: 'users.admin.view',
      },
      {
        id: 'special-permissions',
        label: 'Special Permissions',
        path: '/super-admin/users/special-permissions',
        permission: 'users.special.view',
      },
    ],
  },
  {
    id: 'student-setup',
    label: 'Student Setup',
    icon: GraduationCap,
    permission: 'students.view',
    submenus: [
      {
        id: 'students',
        label: 'All Students',
        path: '/super-admin/students',
        permission: 'students.view',
      },
      {
        id: 'student-admission',
        label: 'Student Admission',
        path: '/super-admin/students/admission',
        permission: 'students.create',
      },
    ],
  },
  {
    id: 'teacher-staff',
    label: 'Teacher & Staff',
    icon: UserCheck,
    permission: 'teachers.view',
    submenus: [
      {
        id: 'all-teachers',
        label: 'All Teachers',
        path: '/super-admin/teachers',
        permission: 'teachers.view',
      },
      {
        id: 'add-teacher',
        label: 'Add Teacher',
        path: '/super-admin/teachers/add',
        permission: 'teachers.create',
      },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart,
    permission: 'reports.view',
    submenus: [
      {
        id: 'student-report',
        label: 'Student Reports',
        path: '/super-admin/reports/students',
        permission: 'reports.students.view',
      },
      {
        id: 'financial-report',
        label: 'Financial Reports',
        path: '/super-admin/reports/financial',
        permission: 'reports.financial.view',
      },
    ],
  },
  {
    id: 'settings',
    label: 'System Settings',
    icon: Settings,
    permission: 'settings.view',
    submenus: [
      {
        id: 'general-settings',
        label: 'General Settings',
        path: '/super-admin/settings/general',
        permission: 'settings.general.view',
      },
    ],
  },
];

export const adminMenu = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/admin/dashboard',
    permission: 'dashboard.view',
  },
  {
    id: 'students',
    label: 'Students',
    icon: GraduationCap,
    path: '/super-admin/students',
    permission: 'students.view',
  },
  {
    id: 'teachers',
    label: 'Teachers',
    icon: UserCheck,
    path: '/super-admin/teachers',
    permission: 'teachers.view',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart,
    path: '/admin/reports',
    permission: 'reports.view',
  },
];

export const teacherMenu = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/teacher/dashboard',
    permission: 'dashboard.view',
  },
  {
    id: 'classes',
    label: 'My Classes',
    icon: BookOpen,
    path: '/teacher/classes',
    permission: 'students.view',
  },
  {
    id: 'exams',
    label: 'Exams',
    icon: ClipboardList,
    path: '/teacher/exams',
    permission: 'exam.view',
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: Calendar,
    path: '/teacher/attendance',
    permission: 'attendance.teachers.view',
  },
];

export const studentMenu = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/student/dashboard',
    permission: 'dashboard.view',
  },
  {
    id: 'results',
    label: 'My Results',
    icon: FileText,
    path: '/student/results',
    permission: 'exam.results.view',
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: Clock,
    path: '/student/attendance',
    permission: 'attendance.students.view',
  },
  {
    id: 'library',
    label: 'Library',
    icon: BookOpen,
    path: '/student/library',
    permission: 'library.view',
  },
];
