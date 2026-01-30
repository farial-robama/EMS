// src/routes/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check if user has required role
  const hasRequiredRole = user && user.role && allowedRoles.includes(user.role);

  // Show access denied page if authenticated but role not allowed
  if (!hasRequiredRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Access Denied Card */}
          <Card className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <Lock className="h-6 w-6 text-red-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h2>

            <p className="text-gray-600 mb-6">
              You don't have permission to access this page. Please contact your
              administrator if you believe this is an error.
            </p>

            <div className="space-y-4">
              <Button
                onClick={() => window.history.back()}
                variant="primary"
                fullWidth
              >
                Go Back
              </Button>

              <Button
                onClick={() => (window.location.href = '/auth/login')}
                variant="outline"
                fullWidth
              >
                Sign Out
              </Button>
            </div>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>&copy; 2026 Advance IT Solutions. All rights reserved.</p>
          </div>
        </div>
      </div>
    );
  }

  // Render children if authenticated and has required role
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoute;
