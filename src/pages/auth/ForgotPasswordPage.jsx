// src/pages/auth/ForgotPasswordPage.jsx

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle } from 'lucide-react';
import { forgotPassword } from '../../services/authService';
import { showSuccess, showError } from '../../utils/toast';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Countdown timer for resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      await forgotPassword(data.email);
      showSuccess('Password reset email sent successfully!');
      setEmailSent(true);
      setSubmittedEmail(data.email);
      setCountdown(60); // 60 seconds countdown
    } catch (error) {
      showError(error.message || 'Failed to send password reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    try {
      await forgotPassword(submittedEmail);
      showSuccess('Password reset email sent again!');
      setCountdown(60);
    } catch (error) {
      showError(error.message || 'Failed to resend password reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setEmailSent(false);
    setCountdown(0);
    setSubmittedEmail('');
    reset();
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Back to Login Link */}
          <div className="text-center mb-6">
            <Link
              to="/auth/login"
              className="text-sm text-blue-600 hover:text-blue-500 transition duration-200"
            >
              ← Back to Login
            </Link>
          </div>

          {/* Success Card */}
          <Card className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Reset Link Sent!
            </h2>

            <p className="text-gray-600 mb-6">
              We've sent a password reset link to{' '}
              <span className="font-medium text-gray-900">
                {submittedEmail}
              </span>
            </p>

            <p className="text-sm text-gray-500 mb-6">
              Check your email and follow the instructions to reset your
              password.
            </p>

            {/* Resend Button */}
            <div className="space-y-4">
              {countdown > 0 ? (
                <p className="text-sm text-gray-500">
                  Resend available in {countdown} seconds
                </p>
              ) : (
                <Button
                  onClick={handleResend}
                  variant="outline"
                  fullWidth
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Resend Reset Link'}
                </Button>
              )}

              <Button onClick={handleBackToForm} variant="secondary" fullWidth>
                Try Different Email
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back to Login Link */}
        <div className="text-center mb-6">
          <Link
            to="/auth/login"
            className="text-sm text-blue-600 hover:text-blue-500 transition duration-200"
          >
            ← Back to Login
          </Link>
        </div>

        {/* Forgot Password Card */}
        <Card className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Forgot Password?
          </h2>

          <p className="text-gray-600 mb-6">
            Enter your email address and we'll send you a reset link
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your registered email"
              icon={Mail}
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address',
                },
              })}
              error={errors.email?.message}
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
              {isLoading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPasswordPage;
