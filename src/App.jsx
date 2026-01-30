// src/App.jsx

import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Toast from './components/common/Toast';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Placeholder Dashboard Components (to be replaced with actual components)
const SuperAdminDashboard = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Super Admin Dashboard
      </h1>
      <p className="text-gray-600">Welcome, Super Administrator!</p>
    </div>
  </div>
);

const AdminDashboard = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
      <p className="text-gray-600">Welcome, Administrator!</p>
    </div>
  </div>
);

const TeacherDashboard = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Teacher Dashboard
      </h1>
      <p className="text-gray-600">Welcome, Teacher!</p>
    </div>
  </div>
);

const StudentDashboard = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Student Dashboard
      </h1>
      <p className="text-gray-600">Welcome, Student!</p>
    </div>
  </div>
);

// Route Guard Component for authenticated users
const AuthenticatedRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Redirect authenticated users to their appropriate dashboard
  if (user && user.role) {
    const roleRoutes = {
      super_admin: '/super-admin/dashboard',
      admin: '/admin/dashboard',
      teacher: '/teacher/dashboard',
      student: '/student/dashboard',
    };

    const dashboardRoute = roleRoutes[user.role] || '/student/dashboard';
    return <Navigate to={dashboardRoute} replace />;
  }

  return children;
};

// Main App Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Default route - redirects based on auth status */}
      <Route
        path="/"
        element={
          <AuthenticatedRoute>
            <div>Redirecting to dashboard...</div>
          </AuthenticatedRoute>
        }
      />

      {/* Authentication Routes */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

      {/* Super Admin Routes */}
      <Route
        path="/super-admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Teacher Routes */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route - redirect to login for unknown routes */}
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toast />
      </Router>
    </AuthProvider>
  );
}

export default App;
