// src/components/layout/DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useTheme from '../../hooks/useTheme';
import {
  ChevronDown,
  ChevronRight,
  LogOut,
  User,
  Moon,
  Sun,
  Menu,
  GraduationCap,
  Shield,
  Bell,
  Clock,
} from 'lucide-react';

// Role-based menus
import { superAdminMenu, adminMenu, teacherMenu, studentMenu } from './menus';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // ================= STATE =================
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const { darkMode, toggleTheme, setDarkMode } = useTheme();

  // ================= EFFECTS =================
  // Dark mode classes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // Live Time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-expand active submenu
  useEffect(() => {
    const newExpanded = {};
    getFilteredMenuItems().forEach(menu => {
      if (menu.submenus && menu.submenus.some(s => s.path === location.pathname)) {
        newExpanded[menu.id] = true;
      }
    });
    setExpandedMenus(prev => ({ ...prev, ...newExpanded }));
  }, [location.pathname]);

  // ================= HELPERS =================
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  const formatTime = () =>
    currentTime.toLocaleString('en-US', {
      timeZone: 'Asia/Dhaka',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

  const formatDate = () =>
    currentTime.toLocaleString('en-US', {
      timeZone: 'Asia/Dhaka',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const toggleMenu = menuId => setExpandedMenus(prev => ({ ...prev, [menuId]: !prev[menuId] }));

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/auth/login');
    }
  };

  const getAllMenuItems = () => {
    const roleKey = (user?.role || '').toUpperCase();
    switch (roleKey) {
      case 'ADMIN':
        return adminMenu;
      case 'TEACHER':
        return teacherMenu;
      case 'STUDENT':
        return studentMenu;
      default:
        return superAdminMenu;
    }
  };

  const hasPermission = permission => {
    if (!permission) return true;
    if (user?.role?.toUpperCase() === 'SUPER_ADMIN') return true;
    return user?.permissions?.includes(permission);
  };

  const getFilteredMenuItems = () => {
    const allMenus = getAllMenuItems();
    return allMenus
      .filter(menu => hasPermission(menu.permission))
      .map(menu => {
        if (menu.submenus) {
          const filteredSubmenus = menu.submenus.filter(s => hasPermission(s.permission));
          if (filteredSubmenus.length) return { ...menu, submenus: filteredSubmenus };
          return null;
        }
        return menu;
      })
      .filter(Boolean);
  };

  const menuItems = getFilteredMenuItems();
  const isActiveLink = path => location.pathname === path;
  const hasActiveSubmenu = submenus => submenus?.some(s => isActiveLink(s.path));

  // Get user display name (firstName + lastName or just name)
  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.name || 'User';
  };

  // Get first name for greeting
  const getFirstName = () => {
    if (user?.firstName) return user.firstName;
    return user?.name?.split(' ')[0] || 'User';
  };

  // Get user initials
  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    const nameParts = displayName.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
    }
    return displayName.charAt(0).toUpperCase();
  };

  // ================= JSX =================
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Header */}
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
                <p className="text-xs text-gray-500 dark:text-gray-400">EMS Admin Panel</p>
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

        {/* Role Badge */}
        {!sidebarCollapsed && (
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                {user?.role?.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.length ? (
            menuItems.map(menu => {
              const MenuIcon = menu.icon;
              const isExpanded = expandedMenus[menu.id];
              const hasActive = hasActiveSubmenu(menu.submenus);

              return (
                <div key={menu.id}>
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
                      {!sidebarCollapsed && <span className="text-sm font-medium">{menu.label}</span>}
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
                        {!sidebarCollapsed && <span className="text-sm font-medium">{menu.label}</span>}
                      </div>
                      {!sidebarCollapsed && menu.submenus && (
                        <ChevronRight
                          className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        />
                      )}
                    </button>
                  )}

                  {/* Submenus */}
                  {!sidebarCollapsed && menu.submenus && isExpanded && (
                    <div className="ml-8 mt-1 space-y-1">
                      {menu.submenus.map(sub => (
                        <Link
                          key={sub.id}
                          to={sub.path}
                          className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActiveLink(sub.path)
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No menu items available</p>
            </div>
          )}
        </nav>

        {/* Footer */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Powered by <span className="font-semibold">Advance IT Solutions</span>
            </p>
            <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-1">Version 1.0.0</p>
          </div>
        )}
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
          <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
              >
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </button>
              <div className="hidden sm:block">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {getGreeting()}, {getFirstName()}!
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate()}</p>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Clock className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{formatTime()}</span>
              </div>

              {/* Dark Mode */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-gray-600" />}
              </button>

              {/* Notifications */}
              <button 
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {/* Profile Image or Initials */}
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                    {user?.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={getUserDisplayName()}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <span 
                      className="text-sm font-semibold text-white"
                      style={{ display: user?.profileImage ? 'none' : 'flex' }}
                    >
                      {getUserInitials()}
                    </span>
                  </div>
                  
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.role?.replace('_', ' ').toUpperCase()}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                    <Link
                      to="/profile"
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

        {/* Main Content */}
        <main className="min-h-[calc(100vh-8rem)] p-4 sm:p-6 lg:p-8">{children}</main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
          <div className="px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()}{' '}
              <span className="font-semibold">Advance IT Solutions</span> - EMS Admin Panel. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;