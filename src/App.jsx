// src/App.jsx

import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProtectedRoute from './routes/ProtectedRoute';
import Toast from './components/common/Toast';

// Routes
import routes from './routes/routes';
import { Suspense } from 'react';
import LoadingSpinner from './components/common/LoadingSpinner';

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
  // Page wrapper adds title and breadcrumbs
  const PageWrapper = ({ meta, children }) => {
    const title = meta?.title
      ? `${meta.title} • Educational Management System`
      : 'Educational Management System';

    useEffect(() => {
      document.title = title;
    }, [title]);

    return (
      <div className="p-6">
        {meta?.breadcrumbs && meta.breadcrumbs.length > 0 && (
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              {meta.breadcrumbs.map((b, i) => (
                <li key={i} className="flex items-center">
                  {b.path ? (
                    <Link to={b.path} className="hover:underline">
                      {b.label}
                    </Link>
                  ) : (
                    <span>{b.label}</span>
                  )}
                  {i < meta.breadcrumbs.length - 1 && (
                    <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {children}
      </div>
    );
  };

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

      {/* Dynamic routes configured from src/routes/routes.jsx */}
      {routes.map((r) => {
        const Page = r.element;
        const PageWithMeta = (props) => (
          <PageWrapper meta={r}>
            <Page {...props} />
          </PageWrapper>
        );

        const pageElement = r.protected ? (
          <ProtectedRoute allowedRoles={r.allowedRoles}>
            <PageWithMeta />
          </ProtectedRoute>
        ) : (
          <PageWithMeta />
        );

        return (
          <Route
            key={r.path}
            path={r.path}
            element={
              <Suspense
                fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                }
              >
                {pageElement}
              </Suspense>
            }
          />
        );
      })}

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
