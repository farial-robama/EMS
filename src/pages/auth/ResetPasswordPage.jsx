// src/pages/auth/ResetPasswordPage.jsx

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Key, Lock, CheckCircle } from 'lucide-react';
import { resetPassword } from '../../services/authService';
import { showSuccess, showError } from '../../utils/toast';
import Input from '../../components/common/Input';
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm();

  const newPassword = watch('newPassword');

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

  // Check if token exists
  useEffect(() => {
    if (!token) {
      showError('Invalid reset link. Please request a new password reset.');
      navigate('/auth/forgot-password', { replace: true });
    }
  }, [token, navigate]);

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setError('confirmPassword', {
        message: 'Passwords do not match',
      });
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(token, data.newPassword);
      showSuccess('Password reset successfully!');
      setResetSuccess(true);
      setCountdown(2); // 2 seconds countdown
    } catch (error) {
      showError(
        error.message || 'Failed to reset password. The link may be expired.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Success Card */}
          <Card className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Password Reset Successful!
            </h2>

            <p className="text-gray-600 mb-6">
              Your password has been successfully reset. You can now log in with
              your new password.
            </p>

            <p className="text-sm text-gray-500 mb-6">
              Redirecting to login in {countdown} second
              {countdown !== 1 ? 's' : ''}...
            </p>

            <Link
              to="/auth/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
            >
              Go to Login Now
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  if (!token) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Reset Password Card */}
        <Card className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <Key className="h-6 w-6 text-blue-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Reset Your Password
          </h2>

          <p className="text-gray-600 mb-6">Enter your new password below</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* New Password Field */}
            <div>
              <Input
                label="New Password"
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                icon={Lock}
                showPasswordToggle
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
                error={errors.newPassword?.message}
                disabled={isLoading}
              />

              {/* Password Strength Indicator */}
              {passwordStrength && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">
                      Password strength:
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        passwordStrength.strength === 'strong'
                          ? 'text-green-600'
                          : passwordStrength.strength === 'medium'
                            ? 'text-yellow-600'
                            : 'text-red-600'
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
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter new password"
              icon={Lock}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
              })}
              error={errors.confirmPassword?.message}
              disabled={isLoading}
            />

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
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>&copy; 2026 Advance IT Solutions. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
