// src/pages/auth/VerifyEmailPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { verifyEmail, forgotPassword } from '../../services/authService';
import { showSuccess, showError } from '../../utils/toast';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');

  // Countdown timer for resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      showError('Please enter your email first');
      navigate('/auth/forgot-password', { replace: true });
    }
  }, [email, navigate]);

  // Handle OTP input change
  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length; i++) {
      if (!isNaN(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }

    setOtp(newOtp);
    setError('');
  };

  // Verify OTP
  const handleVerify = async () => {
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await verifyEmail(email, otpString);
      showSuccess('Email verified successfully!');
      
      // Navigate to reset password page
      navigate('/auth/reset-password', { state: { email } });
    } catch (error) {
      setError(error.message || 'Invalid OTP. Please try again.');
      showError(error.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    try {
      await forgotPassword(email);
      showSuccess('New OTP sent to your email!');
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      setError('');
    } catch (error) {
      showError(error.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back to Login Link */}
        <div className="text-center mb-6">
          <Link
            to="/auth/forgot-password"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-500 transition duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        {/* Verify Email Card */}
        <Card className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Verify Your Email
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Enter the 6-digit OTP sent to
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-6">
            {email}
          </p>

          {/* OTP Input */}
          <div className="flex justify-center gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={isLoading}
                className={`w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg 
                  ${error 
                    ? 'border-red-500 dark:border-red-400' 
                    : 'border-gray-300 dark:border-gray-600'
                  } 
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                  focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors`}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 dark:text-red-400 text-sm mb-4">
              {error}
            </p>
          )}

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading || otp.join('').length !== 6}
            className="mb-4"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </Button>

          {/* Resend OTP */}
          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Resend OTP in {countdown} seconds
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={isLoading}
                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Sending...' : 'Resend OTP'}
              </button>
            )}
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Advance IT Solutions. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;