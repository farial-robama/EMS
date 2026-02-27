
// src/components/layout/DashboardLayout.jsx
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useTheme from '../../hooks/useTheme';
import {
  ChevronDown, LogOut, User,
  Moon, Sun, Menu, GraduationCap,
  Shield, Bell, Clock,
} from 'lucide-react';
import { superAdminMenu, adminMenu, teacherMenu, studentMenu } from './menus';
import { toast } from 'react-toastify';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const navRef = useRef(null);
  const savedScrollRef = useRef(0); 

  // ── Role / menu helpers ────────────────────────────────────────────────────
  const getUserRole = useCallback(() => {
    if (!user?.role) return '';
    return user.role.toUpperCase().replace(/\s+/g, '_').replace(/-+/g, '_');
  }, [user?.role]);

  const getAllMenuItems = useCallback(() => {
    switch (getUserRole()) {
      case 'ADMIN':       return adminMenu;
      case 'TEACHER':     return teacherMenu;
      case 'STUDENT':     return studentMenu;
      case 'SUPER_ADMIN': return superAdminMenu;
      default:            return superAdminMenu;
    }
  }, [getUserRole]);

  const hasPermission = useCallback((permission) => {
    if (!permission) return true;
    if (getUserRole() === 'SUPER_ADMIN') return true;
    return Array.isArray(user?.permissions) ? user.permissions.includes(permission) : false;
  }, [getUserRole, user?.permissions]);

  const menuItems = useMemo(() => {
    return getAllMenuItems()
      .filter((m) => hasPermission(m.permission))
      .map((menu) => {
        if (menu.submenus) {
          const filtered = menu.submenus.filter((s) => hasPermission(s.permission));
          return filtered.length ? { ...menu, submenus: filtered } : null;
        }
        return menu;
      })
      .filter(Boolean);
  }, [getAllMenuItems, hasPermission]);

  // ── Auto-expand active menu on route change ────────────────────────────────
  useEffect(() => {
    const toExpand = {};
    menuItems.forEach((menu) => {
      if (!menu.submenus) return;
      menu.submenus.forEach((sub) => {
        if (sub.path && sub.path === location.pathname) toExpand[menu.id] = true;
        if (sub.isNested && sub.submenus) {
          sub.submenus.forEach((leaf) => {
            if (leaf.path === location.pathname) {
              toExpand[menu.id] = true;
              toExpand[sub.id] = true;
            }
          });
        }
      });
    });
    if (Object.keys(toExpand).length) {
      setExpandedMenus((prev) => {
        const changed = Object.keys(toExpand).some((k) => !prev[k]);
        return changed ? { ...prev, ...toExpand } : prev;
      });
    }
  }, [location.pathname, menuItems]);

  // ── Save sidebar scroll position continuously (passive, zero perf cost) ───
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onScroll = () => { savedScrollRef.current = nav.scrollTop; };
    nav.addEventListener('scroll', onScroll, { passive: true });
    return () => nav.removeEventListener('scroll', onScroll);
  }, []);

  
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const id = requestAnimationFrame(() => {
      nav.scrollTop = savedScrollRef.current;
    });
    return () => cancelAnimationFrame(id);
  }, [location.pathname, expandedMenus]);

  // ── Misc effects ───────────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('#profile-dropdown-wrapper')) setShowProfileDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const toggleMenu = useCallback((menuId) => {
    setExpandedMenus((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
  }, []);

  
const handleLogout = () => {
  if (window.confirm('Are you sure you want to logout?')) {
    logout();
    navigate('/auth/login', { state: { loggedOut: true } });
  }
};


  // ── Display helpers ────────────────────────────────────────────────────────
  
  const getGreeting = () => {
    const h = currentTime.getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    if (h < 21) return 'Good Evening';
    return 'Good Night';
  };

  const formatTime = () => currentTime.toLocaleString('en-US', {
    timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
  });
  const formatDate = () => currentTime.toLocaleString('en-US', {
    timeZone: 'Asia/Dhaka', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const isActiveLink = (path) => location.pathname === path;
  const hasActiveSubmenu = (submenus) => submenus?.some((s) => {
    if (s.path && isActiveLink(s.path)) return true;
    if (s.isNested && s.submenus) return s.submenus.some((l) => isActiveLink(l.path));
    return false;
  });

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) return `${user.firstName} ${user.lastName}`;
    return user?.name || 'User';
  };
  const getFirstName = () => user?.firstName || user?.name?.split(' ')[0] || 'User';
  const getUserInitials = () => {
    const parts = getUserDisplayName().split(' ');
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0][0].toUpperCase();
  };
  const getRoleBadgeColor = () => {
    switch (getUserRole()) {
      case 'SUPER_ADMIN': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'ADMIN':       return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'TEACHER':     return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'STUDENT':     return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      default:            return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    // <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
    <div className="fixed inset-0 flex bg-gray-50 dark:bg-gray-900 overflow-hidden">

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col
          bg-white dark:bg-gray-800
          border-r border-gray-200 dark:border-gray-700
          transition-all duration-300
          ${sidebarCollapsed ? 'w-16' : 'w-64'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700 min-h-[64px]">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <GraduationCap size={18} className="text-white" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate leading-tight">
                  Advance IT Solutions
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">EMS Admin Panel</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hidden lg:flex items-center justify-center flex-shrink-0"
          >
            <Menu size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Role badge */}
        {!sidebarCollapsed && (
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor()}`}>
              <Shield size={12} />
              {user?.role?.replace(/_/g, ' ').toUpperCase() || 'USER'}
            </span>
          </div>
        )}

        {/* Nav */}
        <nav
          ref={navRef}
          className="flex-1 overflow-y-auto py-2 px-2"
          style={{ overflowAnchor: 'none' }}
        >
          {menuItems.length ? menuItems.map((menu) => {
            const MenuIcon   = menu.icon;
            const isExpanded = !!expandedMenus[menu.id];
            const hasActive  = hasActiveSubmenu(menu.submenus);

            return (
              <div key={menu.id} className="mb-0.5">

                {/* Top-level: direct link or collapsible group */}
                {menu.path ? (
                  <Link
                    to={menu.path}
                    onClick={() => setSidebarOpen(false)}
                    title={sidebarCollapsed ? menu.label : ''}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${
                      isActiveLink(menu.path)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {MenuIcon && <MenuIcon size={16} className="flex-shrink-0" />}
                    {!sidebarCollapsed && <span className="truncate">{menu.label}</span>}
                  </Link>
                ) : (
                  <button
                    onClick={() => toggleMenu(menu.id)}
                    title={sidebarCollapsed ? menu.label : ''}
                    className={`w-full flex items-center justify-between gap-2.5 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${
                      hasActive || isExpanded
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {MenuIcon && <MenuIcon size={16} className="flex-shrink-0" />}
                      {!sidebarCollapsed && <span className="truncate">{menu.label}</span>}
                    </div>
                    {!sidebarCollapsed && menu.submenus && (
                      <ChevronDown
                        size={14}
                        className={`flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
                      />
                    )}
                  </button>
                )}

                {/* Submenu — smooth height-based collapse */}
                {!sidebarCollapsed && menu.submenus && (
                  <div
                    className="overflow-hidden transition-all duration-200"
                    style={{ maxHeight: isExpanded ? '1000px' : '0px' }}
                  >
                    <div className="mt-0.5 ml-3 pl-2.5 border-l-2 border-gray-200 dark:border-gray-600 py-0.5 space-y-0.5">
                      {menu.submenus.map((sub) => {

                        /* ── 3-level nested submenu ── */
                        if (sub.isNested && sub.submenus) {
                          const nestedExpanded  = !!expandedMenus[sub.id];
                          const nestedHasActive = sub.submenus.some((l) => isActiveLink(l.path));
                          return (
                            <div key={sub.id}>
                              <button
                                onClick={() => toggleMenu(sub.id)}
                                className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
                                  nestedHasActive || nestedExpanded
                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                }`}
                              >
                                <span className="truncate">{sub.label}</span>
                                <ChevronDown
                                  size={12}
                                  className={`flex-shrink-0 transition-transform duration-200 ${nestedExpanded ? 'rotate-0' : '-rotate-90'}`}
                                />
                              </button>

                              <div
                                className="overflow-hidden transition-all duration-200"
                                style={{ maxHeight: nestedExpanded ? '600px' : '0px' }}
                              >
                                <div className="mt-0.5 ml-3 pl-2.5 border-l-2 border-gray-100 dark:border-gray-700 py-0.5 space-y-0.5">
                                  {sub.submenus.map((leaf) => (
                                    <Link
                                      key={leaf.id || leaf.path}
                                      to={leaf.path}
                                      onClick={() => setSidebarOpen(false)}
                                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
                                        isActiveLink(leaf.path)
                                          ? 'bg-blue-600 text-white font-medium'
                                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                      }`}
                                    >
                                      {leaf.icon && <leaf.icon size={13} className="flex-shrink-0 opacity-70" />}
                                      <span className="truncate">{leaf.label}</span>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        }

                        /* ── Regular submenu link ── */
                        return (
                          <Link
                            key={sub.id || sub.path}
                            to={sub.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
                              isActiveLink(sub.path)
                                ? 'bg-blue-600 text-white font-medium'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                            }`}
                          >
                            {sub.icon && <sub.icon size={14} className="flex-shrink-0" />}
                            <span className="truncate">{sub.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          }) : (
            <div className="px-3 py-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">No menu items available</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Role: {getUserRole() || 'Unknown'}</p>
            </div>
          )}
        </nav>

        {/* Sidebar footer */}
        {!sidebarCollapsed && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center">Powered by Advance IT Solutions</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center">Version 1.0.0</p>
          </div>
        )}
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 min-h-[64px] z-20">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
            >
              <Menu size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
                {getGreeting()}, {getFirstName()}!
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{formatDate()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Clock */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Clock size={14} className="text-gray-500 dark:text-gray-400" />
              <span className="text-xs font-mono text-gray-700 dark:text-gray-300">{formatTime()}</span>
            </div>

            {/* Theme */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode
                ? <Sun  size={18} className="text-yellow-400" />
                : <Moon size={18} className="text-gray-600" />}
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Bell size={18} className="text-gray-600 dark:text-gray-300" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Profile */}
            <div id="profile-dropdown-wrapper" className="relative">
              <button
                onClick={() => setShowProfileDropdown((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <span className="text-white text-sm font-bold">{getUserInitials()}</span>
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
                    {getUserDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                    {user?.role?.replace(/_/g, ' ').toUpperCase()}
                  </p>
                </div>
                <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setShowProfileDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <User size={16} /> View Profile
                  </Link>
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="px-6 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} Advance IT Solutions — EMS Admin Panel. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;