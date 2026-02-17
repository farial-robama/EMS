// src/pages/auth/ResetPasswordPage.jsx

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Key, Lock, CheckCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { resetPassword } from '../../services/authService';
import { showSuccess, showError } from '../../utils/toast';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

// Password strength calculation
const calculatePasswordStrength = (password) => {
  let score = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    symbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/.test(password),
  };

  // Count true checks
  const trueCount = Object.values(checks).filter(Boolean).length;
  score = trueCount;

  let strength = 'weak';
  let color = 'bg-red-500';

  if (score >= 5) {
    strength = 'strong';
    color = 'bg-green-500';
  } else if (score >= 3) {
    strength = 'medium';
    color = 'bg-yellow-500';
  }

  return { score, strength, color, checks };
};

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm();

  const newPassword = watch('newPassword');

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      showError('Please complete email verification first');
      navigate('/auth/forgot-password', { replace: true });
    }
  }, [email, navigate]);

  // Calculate password strength when newPassword changes
  useEffect(() => {
    if (newPassword) {
      setPasswordStrength(calculatePasswordStrength(newPassword));
    } else {
      setPasswordStrength(null);
    }
  }, [newPassword]);

  // Countdown timer for redirect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (resetSuccess && countdown === 0) {
      navigate('/auth/login', { replace: true });
    }
    return () => clearTimeout(timer);
  }, [countdown, resetSuccess, navigate]);

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setError('confirmPassword', {
        message: 'Passwords do not match',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await resetPassword(email, data.newPassword);
      showSuccess('Password reset successfully!');
      setResetSuccess(true);
      setCountdown(5); // 5 seconds countdown
    } catch (error) {
      showError(
        error.message || 'Failed to reset password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Success Card */}
          <Card className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Password Reset Successful!
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your password has been successfully reset. You can now log in with
              your new password.
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Redirecting to login in {countdown} second
              {countdown !== 1 ? 's' : ''}...
            </p>

            <Link
              to="/auth/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
            >
              Go to Login Now
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back Link */}
        <div className="text-center mb-6">
          <Link
            to="/auth/verify-email"
            state={{ email }}
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-500 transition duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        {/* Reset Password Card */}
        <Card>
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
              <Key className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Reset Your Password
            </h2>

            <p className="text-gray-600 dark:text-gray-400">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* New Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  {...register('newPassword', {
                    required: 'New password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters long',
                    },
                    validate: (value) => {
                      const strength = calculatePasswordStrength(value);
                      if (strength.score < 3) {
                        return 'Password must contain uppercase, lowercase, number, and symbol';
                      }
                      return true;
                    },
                  })}
                  disabled={isLoading}
                  placeholder="Enter new password"
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.newPassword.message}
                </p>
              )}

              {/* Password Strength Indicator */}
              {passwordStrength && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Password strength:
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        passwordStrength.strength === 'strong'
                          ? 'text-green-600 dark:text-green-400'
                          : passwordStrength.strength === 'medium'
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {passwordStrength.strength.charAt(0).toUpperCase() +
                        passwordStrength.strength.slice(1)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.color
                      }`}
                      style={{
                        width: `${(passwordStrength.score / 5) * 100}%`,
                      }}
                    ></div>
                  </div>
                  
                  {/* Password Requirements */}
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Password must contain:</p>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className={passwordStrength.checks.length ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}>
                        ✓ 8+ characters
                      </div>
                      <div className={passwordStrength.checks.uppercase ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}>
                        ✓ Uppercase letter
                      </div>
                      <div className={passwordStrength.checks.lowercase ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}>
                        ✓ Lowercase letter
                      </div>
                      <div className={passwordStrength.checks.number ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}>
                        ✓ Number
                      </div>
                      <div className={passwordStrength.checks.symbol ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}>
                        ✓ Special character
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                  })}
                  disabled={isLoading}
                  placeholder="Re-enter new password"
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Advance IT Solutions. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;