// src/App.jsx

import React, { useEffect, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Toast from './components/common/Toast';
import LoadingSpinner from './components/common/LoadingSpinner';
import routes from './routes/routes';

// ─── Root redirect ────────────────────────────────────────────────────────────
const RootRedirect = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  const roleRoutes = {
    super_admin: '/super-admin/dashboard',
    admin: '/admin/dashboard',
    teacher: '/teacher/dashboard',
    student: '/student/dashboard',
  };

  return (
    <Navigate to={roleRoutes[user.role] || '/student/dashboard'} replace />
  );
};


const PageWrapper = ({ meta, children }) => {
  const title = meta?.title
    ? `${meta.title} • Educational Management System`
    : 'Educational Management System';

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="p-6">
      {meta?.breadcrumbs?.length > 0 && (
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


const builtRoutes = routes.map((r) => {
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
});

// ─── AppRoutes ────────────────────────────────────────────────────────────────
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<RootRedirect />} />
    {builtRoutes}
    <Route path="*" element={<Navigate to="/auth/login" replace />} />
  </Routes>
);

// ─── App ──────────────────────────────────────────────────────────────────────
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
