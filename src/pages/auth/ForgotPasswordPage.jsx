// src/pages/auth/ForgotPasswordPage.jsx

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import { forgotPassword } from '../../services/authService';
import { showSuccess, showError } from '../../utils/toast';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
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
      showSuccess('OTP sent to your email successfully!');
      setEmailSent(true);
      setSubmittedEmail(data.email);
      setCountdown(60); // 60 seconds countdown
    } catch (error) {
      showError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    try {
      await forgotPassword(submittedEmail);
      showSuccess('OTP sent again to your email!');
      setCountdown(60);
    } catch (error) {
      showError(error.message || 'Failed to resend OTP');
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

  const handleProceedToVerify = () => {
    // Navigate to verify email page with email as state
    navigate('/auth/verify-email', { state: { email: submittedEmail } });
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Back to Login Link */}
          <div className="text-center mb-6">
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-500 transition duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>

          {/* Success Card */}
          <Card className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              OTP Sent!
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We've sent a 6-digit OTP to{' '}
              <span className="font-medium text-gray-900 dark:text-white">
                {submittedEmail}
              </span>
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Check your email and enter the OTP to verify your identity.
            </p>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                onClick={handleProceedToVerify}
                variant="primary"
                fullWidth
              >
                Enter OTP
              </Button>

              {countdown > 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Resend OTP in {countdown} seconds
                </p>
              ) : (
                <Button
                  onClick={handleResend}
                  variant="outline"
                  fullWidth
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Resend OTP'}
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back to Login Link */}
        <div className="text-center mb-6">
          <Link
            to="/auth/login"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-500 transition duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>

        {/* Forgot Password Card */}
        <Card className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
            <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Forgot Password?
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Enter your email address and we'll send you an OTP
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
              {isLoading ? 'Sending...' : 'Send OTP'}
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

export default ForgotPasswordPage;