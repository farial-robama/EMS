// src/pages/auth/SignupPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  User,
  Mail,
  Phone,
  Lock,
  GraduationCap,
  ArrowLeft,
} from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { showSuccess, showError } from '../../utils/toast';
import { register } from '../../services/authService';
import { validateEmail, validatePassword } from '../../utils/validation';

const SignupPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        message: 'Passwords do not match',
      });
      return;
    }

    // Validate email format
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
      setError('email', { message: emailValidation.message });
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      setError('password', { message: passwordValidation.message });
      return;
    }

    setIsLoading(true);

    try {
      await register({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      showSuccess(
        'Registration successful! Please check your email for verification.'
      );
      navigate('/auth/login');
    } catch (error) {
      showError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back to Login Link */}
        <div className="text-center mb-6">
          <Link
            to="/auth/login"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 transition duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Link>
        </div>

        {/* Registration Card */}
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <GraduationCap className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Join Our Learning Community
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Create your student account to access courses and resources
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name Field */}
            <Input
              label="Full Name"
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              icon={User}
              {...registerField('fullName', {
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Full name must be at least 2 characters',
                },
              })}
              error={errors.fullName?.message}
              disabled={isLoading}
            />

            {/* Email Field */}
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email address"
              icon={Mail}
              {...registerField('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address',
                },
              })}
              error={errors.email?.message}
              disabled={isLoading}
            />

            {/* Phone Field */}
            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              icon={Phone}
              {...registerField('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[+]?[1-9][\d]{0,15}$/,
                  message: 'Please enter a valid phone number',
                },
              })}
              error={errors.phone?.message}
              disabled={isLoading}
            />

            {/* Password Field */}
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Create a strong password"
              icon={Lock}
              showPasswordToggle
              {...registerField('password', {
                required: 'Password is required',
                validate: (value) => {
                  const validation = validatePassword(value);
                  return validation.isValid || validation.message;
                },
              })}
              error={errors.password?.message}
              disabled={isLoading}
            />

            {/* Confirm Password Field */}
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              icon={Lock}
              {...registerField('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
              error={errors.confirmPassword?.message}
              disabled={isLoading}
            />

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  {...registerField('terms', {
                    required: 'You must accept the terms and conditions',
                  })}
                  disabled={isLoading}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-700">
                  I agree to the{' '}
                  <Link
                    to="/terms"
                    className="text-green-600 hover:text-green-500 font-medium"
                  >
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link
                    to="/privacy"
                    className="text-green-600 hover:text-green-500 font-medium"
                  >
                    Privacy Policy
                  </Link>
                </label>
                {errors.terms && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.terms.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/auth/login"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>&copy; 2026 Advance IT Solutions. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
