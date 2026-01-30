// src/components/layout/DashboardLayout.jsx

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ChevronDown,
  ChevronRight,
  LogOut,
  User,
  Moon,
  Sun,
  Menu,
  X,
  Home,
  Users,
  Settings,
  BookOpen,
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
  Bell,
  Clock,
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // State Management
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Load theme preference from localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Get dynamic greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  // Format time for Asia/Dhaka timezone
  const formatTime = () => {
    return currentTime.toLocaleString('en-US', {
      timeZone: 'Asia/Dhaka',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  // Format date
  const formatDate = () => {
    return currentTime.toLocaleString('en-US', {
      timeZone: 'Asia/Dhaka',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Toggle menu expansion
  const toggleMenu = (menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  // Handle logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  // SUPER ADMIN MENU STRUCTURE
  const menuItems = [
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
        {
          id: 'student-promotion',
          label: 'Student Promotion',
          path: '/super-admin/students/promotion',
          permission: 'students.promote',
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
        {
          id: 'staff',
          label: 'Staff Members',
          path: '/super-admin/staff',
          permission: 'staff.view',
        },
      ],
    },
    {
      id: 'exam-result',
      label: 'Exam & Result',
      icon: ClipboardList,
      permission: 'exam.view',
      submenus: [
        {
          id: 'exam-schedule',
          label: 'Exam Schedule',
          path: '/super-admin/exam/schedule',
          permission: 'exam.schedule.view',
        },
        {
          id: 'exam-results',
          label: 'Exam Results',
          path: '/super-admin/exam/results',
          permission: 'exam.results.view',
        },
        {
          id: 'mark-entry',
          label: 'Mark Entry',
          path: '/super-admin/exam/marks',
          permission: 'exam.marks.create',
        },
      ],
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: Calendar,
      permission: 'attendance.view',
      submenus: [
        {
          id: 'student-attendance',
          label: 'Student Attendance',
          path: '/super-admin/attendance/students',
          permission: 'attendance.students.view',
        },
        {
          id: 'teacher-attendance',
          label: 'Teacher Attendance',
          path: '/super-admin/attendance/teachers',
          permission: 'attendance.teachers.view',
        },
      ],
    },
    {
      id: 'library',
      label: 'Library',
      icon: Library,
      permission: 'library.view',
      submenus: [
        {
          id: 'books',
          label: 'Books',
          path: '/super-admin/library/books',
          permission: 'library.books.view',
        },
        {
          id: 'issue-return',
          label: 'Issue/Return',
          path: '/super-admin/library/issue-return',
          permission: 'library.issue.view',
        },
      ],
    },
    {
      id: 'accounts',
      label: 'Accounts',
      icon: DollarSign,
      permission: 'accounts.view',
      submenus: [
        {
          id: 'income',
          label: 'Income',
          path: '/super-admin/accounts/income',
          permission: 'accounts.income.view',
        },
        {
          id: 'expense',
          label: 'Expense',
          path: '/super-admin/accounts/expense',
          permission: 'accounts.expense.view',
        },
        {
          id: 'fee-collection',
          label: 'Fee Collection',
          path: '/super-admin/accounts/fee-collection',
          permission: 'accounts.fee.view',
        },
      ],
    },
    {
      id: 'sms-setup',
      label: 'SMS Setup',
      icon: MessageSquare,
      permission: 'sms.view',
      submenus: [
        {
          id: 'sms-templates',
          label: 'SMS Templates',
          path: '/super-admin/sms/templates',
          permission: 'sms.templates.view',
        },
        {
          id: 'send-sms',
          label: 'Send SMS',
          path: '/super-admin/sms/send',
          permission: 'sms.send',
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
        {
          id: 'attendance-report',
          label: 'Attendance Reports',
          path: '/super-admin/reports/attendance',
          permission: 'reports.attendance.view',
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
        {
          id: 'academic-year',
          label: 'Academic Year',
          path: '/super-admin/settings/academic-year',
          permission: 'settings.academic.view',
        },
        {
          id: 'permissions',
          label: 'Permissions',
          path: '/super-admin/settings/permissions',
          permission: 'settings.permissions.view',
        },
      ],
    },
  ];

  // Check if menu should be visible based on user permissions
  const hasPermission = (permission) => {
    // For Super Admin, always return true
    if (user?.role === 'SUPER_ADMIN') return true;

    // For other users, check their permissions
    return user?.permissions?.includes(permission) || false;
  };

  // Check if current path is active
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  // Check if menu has active submenu
  const hasActiveSubmenu = (submenus) => {
    return submenus?.some((submenu) => isActiveLink(submenu.path));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ==================== SIDEBAR ==================== */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Sidebar Header - Institute Info */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900 dark:text-white">
                  Advance IT Solutions
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  EMS Admin Panel
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hidden lg:block"
          >
            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {menuItems.map((menu) => {
            // Check permission
            if (!hasPermission(menu.permission)) return null;

            const MenuIcon = menu.icon;
            const isExpanded = expandedMenus[menu.id];
            const hasActive = hasActiveSubmenu(menu.submenus);

            return (
              <div key={menu.id}>
                {/* Main Menu Item */}
                {menu.path ? (
                  <Link
                    to={menu.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActiveLink(menu.path)
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <MenuIcon className="h-5 w-5 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="text-sm font-medium">{menu.label}</span>
                    )}
                  </Link>
                ) : (
                  <button
                    onClick={() => toggleMenu(menu.id)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors ${
                      hasActive || isExpanded
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MenuIcon className="h-5 w-5 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <span className="text-sm font-medium">
                          {menu.label}
                        </span>
                      )}
                    </div>
                    {!sidebarCollapsed && menu.submenus && (
                      <ChevronRight
                        className={`h-4 w-4 transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      />
                    )}
                  </button>
                )}

                {/* Submenus */}
                {!sidebarCollapsed && menu.submenus && isExpanded && (
                  <div className="ml-8 mt-1 space-y-1">
                    {menu.submenus.map((submenu) => {
                      if (!hasPermission(submenu.permission)) return null;

                      return (
                        <Link
                          key={submenu.id}
                          to={submenu.path}
                          className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActiveLink(submenu.path)
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                        >
                          {submenu.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer - Powered By */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Powered by{' '}
              <span className="font-semibold">Advance IT Solutions</span>
            </p>
            <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-1">
              Version 1.0.0
            </p>
          </div>
        )}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* ==================== MAIN CONTENT WRAPPER ==================== */}
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        {/* ==================== HEADER ==================== */}
        <header className="sticky top-0 z-30 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Left - Mobile Menu + Greeting */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
              >
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </button>

              <div className="hidden sm:block">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {getGreeting()}, {user?.name?.split(' ')[0]}!
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate()}
                </p>
              </div>
            </div>

            {/* Right - Time, Theme, Notifications, Profile */}
            <div className="flex items-center gap-3">
              {/* Live Time */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Clock className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {formatTime()}
                </span>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.role?.replace('_', ' ')}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </button>

                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                    <Link
                      to="/super-admin/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <User className="h-4 w-4" />
                      View Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ==================== MAIN CONTENT AREA ==================== */}
        <main className="min-h-[calc(100vh-8rem)] p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* ==================== FOOTER ==================== */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
          <div className="px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()}{' '}
              <span className="font-semibold">Advance IT Solutions</span> - EMS
              Admin Panel. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
