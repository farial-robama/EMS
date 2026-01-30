// src/components/layout/DashboardLayout.jsx

import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Settings,
  FileText,
  Award,
  User,
  ClipboardList,
  ChevronDown,
  LogOut,
  Key,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../utils/constants';
import { showSuccess } from '../../utils/toast';
import Button from '../common/Button';

// Role-specific color themes
const roleThemes = {
  [USER_ROLES.SUPER_ADMIN]: {
    primary: 'bg-blue-900',
    secondary: 'bg-blue-800',
    accent: 'text-blue-100',
    hover: 'hover:bg-blue-700',
    active: 'bg-blue-700',
  },
  [USER_ROLES.ADMIN]: {
    primary: 'bg-teal-900',
    secondary: 'bg-teal-800',
    accent: 'text-teal-100',
    hover: 'hover:bg-teal-700',
    active: 'bg-teal-700',
  },
  [USER_ROLES.STUDENT]: {
    primary: 'bg-green-900',
    secondary: 'bg-green-800',
    accent: 'text-green-100',
    hover: 'hover:bg-green-700',
    active: 'bg-green-700',
  },
  [USER_ROLES.TEACHER]: {
    primary: 'bg-purple-900',
    secondary: 'bg-purple-800',
    accent: 'text-purple-100',
    hover: 'hover:bg-purple-700',
    active: 'bg-purple-700',
  },
};

// Navigation items by role
const getNavigationItems = (role) => {
  const baseItems = [
    {
      name: 'Dashboard',
      href: `/${role}/dashboard`,
      icon: LayoutDashboard,
    },
  ];

  const roleSpecificItems = {
    [USER_ROLES.SUPER_ADMIN]: [
      { name: 'User Management', href: '/super-admin/users', icon: Users },
      { name: 'Students', href: '/super-admin/students', icon: GraduationCap },
      { name: 'Teachers', href: '/super-admin/teachers', icon: BookOpen },
      { name: 'Settings', href: '/super-admin/settings', icon: Settings },
    ],
    [USER_ROLES.ADMIN]: [
      { name: 'User Management', href: '/admin/users', icon: Users },
      { name: 'Students', href: '/admin/students', icon: GraduationCap },
      { name: 'Teachers', href: '/admin/teachers', icon: BookOpen },
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ],
    [USER_ROLES.STUDENT]: [
      { name: 'My Courses', href: '/student/courses', icon: BookOpen },
      { name: 'Assignments', href: '/student/assignments', icon: FileText },
      { name: 'Grades', href: '/student/grades', icon: Award },
      { name: 'Profile', href: '/student/profile', icon: User },
    ],
    [USER_ROLES.TEACHER]: [
      { name: 'My Classes', href: '/teacher/classes', icon: BookOpen },
      { name: 'Students', href: '/teacher/students', icon: Users },
      { name: 'Assignments', href: '/teacher/assignments', icon: FileText },
      { name: 'Gradebook', href: '/teacher/gradebook', icon: ClipboardList },
      { name: 'Profile', href: '/teacher/profile', icon: User },
    ],
  };

  return [...baseItems, ...(roleSpecificItems[role] || [])];
};

// Get user avatar color based on name
const getAvatarColor = (name) => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
  ];
  const index = name ? name.length % colors.length : 0;
  return colors[index];
};

const DashboardLayout = ({ children, role, userName }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const theme = roleThemes[role] || roleThemes[USER_ROLES.STUDENT];
  const navigationItems = getNavigationItems(role);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await logout();
        showSuccess('Logged out successfully');
        navigate('/auth/login');
      } catch (error) {
        // Logout will redirect anyway
        console.error('Logout error:', error);
      }
    }
  };

  const isActiveRoute = (href) => {
    return location.pathname === href;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className={`${theme.primary} px-6 py-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-xl font-bold text-white">EMS Portal</h1>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-white hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? `${theme.active} text-white`
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-400 group-hover:text-white'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navbar */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Logo for larger screens */}
              <div className="hidden lg:block">
                <h1 className="text-lg font-semibold text-gray-900">
                  Educational Management System
                </h1>
              </div>

              {/* User profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-3 text-sm focus:outline-none"
                >
                  <div className="flex items-center space-x-3">
                    {/* User avatar */}
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-medium text-sm ${getAvatarColor(
                        userName
                      )}`}
                    >
                      {userName ? userName.charAt(0).toUpperCase() : 'U'}
                    </div>

                    {/* User info */}
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium text-gray-900">
                        {userName || 'User'}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {role?.replace('_', ' ') || 'User'}
                      </div>
                    </div>

                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </button>

                {/* Dropdown menu */}
                {profileDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                      <div className="py-1">
                        <Link
                          to={`/${role}/profile`}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <User className="mr-3 h-4 w-4" />
                          View Profile
                        </Link>
                        <Link
                          to={`/${role}/change-password`}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <Key className="mr-3 h-4 w-4" />
                          Change Password
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.oneOf(Object.values(USER_ROLES)),
  userName: PropTypes.string,
};

export default DashboardLayout;
