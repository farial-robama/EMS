// src/pages/auth/LoginPage.jsx

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { validateUserId } from '../../utils/validation';
import { showSuccess, showError } from '../../utils/toast';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const LoginPage = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const roleRoutes = {
        super_admin: '/super-admin/dashboard',
        admin: '/admin/dashboard',
        student: '/student/dashboard',
        teacher: '/teacher/dashboard',
      };

      const dashboardRoute = roleRoutes[user.role] || '/dashboard';
      navigate(dashboardRoute, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    clearErrors();

    try {
      console.log('🎯 LoginPage: Form submitted with:', {
        userId: data.userId,
      });

      // Validate user ID format
      const userIdValidation = validateUserId(data.userId);
      if (!userIdValidation.isValid) {
        console.warn(
          '⚠️ LoginPage: Validation failed:',
          userIdValidation.message
        );
        setError('userId', { message: userIdValidation.message });
        setIsLoading(false);
        return;
      }

      console.log('✓ LoginPage: User ID validation passed');

      // Call login function
      const response = await login(data.userId, data.password);

      console.log('📊 LoginPage: Login response received:', response);

      // Show success message
      showSuccess('Login successful!');

      // Redirect based on role - FIX: Use correct role names
      const roleRoutes = {
        super_admin: '/super-admin/dashboard',
        SUPER_ADMIN: '/super-admin/dashboard',
        admin: '/admin/dashboard',
        ADMIN: '/admin/dashboard',
        student: '/student/dashboard',
        STUDENT: '/student/dashboard',
        teacher: '/teacher/dashboard',
        TEACHER: '/teacher/dashboard',
      };

      const userRole = response.user?.role || 'student';

      console.log('👤 LoginPage: User role:', userRole);

      const dashboardRoute = roleRoutes[userRole] || '/dashboard';

      console.log('🚀 LoginPage: Redirecting to:', dashboardRoute);

      navigate(dashboardRoute, { replace: true });
    } catch (error) {
      console.error('❌ LoginPage: Login failed:', error);

      // Show error message
      const errorMessage = error.message || 'Login failed. Please try again.';
      showError(errorMessage);

      // Clear password field on error
      reset({ userId: data.userId, password: '' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8 lg:py-12 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Advance IT Solutions
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Educational Management System
            </p>
            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-blue-100">
                <p className="text-lg mb-2">Streamline Your</p>
                <p className="text-lg mb-2">Educational Journey</p>
                <p className="text-sm opacity-80">
                  Manage students, teachers, and administrators with ease
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Branding */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Advance IT Solutions
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Educational Management System</p>
          </div>

          {/* Login Card */}
          <Card title="Welcome Back" className="shadow-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* User ID Field */}
              <Input
                label="User ID"
                type="text"
                name="userId"
                placeholder="Enter STU000000, TCH000000 or Admin ID"
                icon={User}
                {...register('userId', {
                  required: 'User ID is required',
                  validate: (value) =>
                    validateUserId(value).isValid ||
                    validateUserId(value).message,
                })}
                error={errors.userId?.message}
                disabled={isLoading}
              />

              {/* Password Field */}
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="Enter your password"
                icon={Lock}
                showPasswordToggle
                {...register('password', {
                  required: 'Password is required',
                })}
                error={errors.password?.message}
                disabled={isLoading}
              />

              {/* Remember Me Checkbox */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  {...register('rememberMe')}
                  disabled={isLoading}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-200"
                >
                  Remember me
                </label>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500 transition duration-200"
                >
                  Forgot your password?
                </Link>
              </div>
            </form>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>&copy; 2026 Advance IT Solutions. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
