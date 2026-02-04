// src/pages/auth/LoginPage.jsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { validateUserId } from '../../utils/validation';
import { showSuccess, showError } from '../../utils/toast';

// ─── Responsive Styles ───────────────────────────────────────────────────────
const styles = {
  wrapper: {
    minHeight: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0f172a',
    fontFamily: "'Outfit', 'Segoe UI', sans-serif",
    overflow: 'hidden',
    position: 'relative',
    padding: '40px',
  },

  // Animated gradient orbs
  orb: (top, left, size, color, delay) => ({
    position: 'absolute',
    top,
    left,
    width: size,
    height: size,
    borderRadius: '50%',
    background: color,
    filter: 'blur(80px)',
    opacity: 0.25,
    animation: `pulse 6s ease-in-out ${delay}s infinite alternate`,
    pointerEvents: 'none',
    zIndex: 0,
  }),

  formCard: {
    width: '100%',
    maxWidth: '460px',
    background: 'rgba(30,41,59,0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(99,102,241,0.15)',
    borderRadius: '24px',
    padding: '44px 40px',
    boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
    position: 'relative',
    zIndex: 1,
  },

  // Logo section at top of form
  logoSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '32px',
    paddingBottom: '28px',
    borderBottom: '1px solid rgba(99,102,241,0.1)',
  },

  logoImage: {
    width: '120px',
    height: '120px',
    objectFit: 'contain',
    filter: 'drop-shadow(0 4px 20px rgba(99,102,241,0.4))',
  },

  schoolName: {
    color: '#fff',
    fontSize: '26px',
    fontWeight: 700,
    letterSpacing: '-0.5px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #fff, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },

  // ── Card Header ──
  cardTitle: {
    color: '#fff',
    fontSize: '28px',
    fontWeight: 700,
    letterSpacing: '-0.4px',
    marginBottom: '8px',
    textAlign: 'center',
  },

  cardSubtitle: {
    color: '#64748b',
    fontSize: '14px',
    marginBottom: '32px',
    textAlign: 'center',
  },

  // ── Input Field ──
  fieldWrapper: {
    marginBottom: '20px',
  },

  fieldLabel: {
    display: 'block',
    color: '#94a3b8',
    fontSize: '13px',
    fontWeight: 600,
    marginBottom: '8px',
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
  },

  inputRow: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },

  inputIcon: {
    position: 'absolute',
    left: '14px',
    color: '#475569',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
  },

  input: (hasError) => ({
    width: '100%',
    padding: '13px 14px 13px 42px',
    borderRadius: '12px',
    border: `1px solid ${hasError ? '#ef4444' : 'rgba(99,102,241,0.2)'}`,
    background: 'rgba(15,23,42,0.55)',
    color: '#fff',
    fontSize: '15px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  }),

  inputFocusStyle: {
    borderColor: '#6366f1',
    boxShadow: '0 0 0 3px rgba(99,102,241,0.18)',
  },

  eyeBtn: {
    position: 'absolute',
    right: '14px',
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '4px',
  },

  errorText: {
    color: '#ef4444',
    fontSize: '12px',
    marginTop: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },

  // ── Checkbox Row ──
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '28px',
    marginTop: '4px',
    flexWrap: 'wrap',
    gap: '12px',
  },

  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#94a3b8',
    fontSize: '13px',
    cursor: 'pointer',
  },

  checkbox: {
    width: '18px',
    height: '18px',
    borderRadius: '5px',
    border: '2px solid rgba(99,102,241,0.4)',
    background: 'rgba(15,23,42,0.55)',
    appearance: 'none',
    WebkitAppearance: 'none',
    cursor: 'pointer',
    accentColor: '#6366f1',
  },

  forgotLink: {
    color: '#6366f1',
    fontSize: '13px',
    fontWeight: 600,
    textDecoration: 'none',
    cursor: 'pointer',
  },

  // ── Primary Button ──
  primaryBtn: (disabled) => ({
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: disabled
      ? 'rgba(99,102,241,0.35)'
      : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 700,
    fontFamily: 'inherit',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'box-shadow 0.2s, transform 0.1s',
    boxShadow: disabled ? 'none' : '0 4px 20px rgba(99,102,241,0.4)',
  }),

  // ── Footer ──
  footer: {
    textAlign: 'center',
    marginTop: '28px',
    color: '#475569',
    fontSize: '12px',
  },
};

// ─── Media Query Styles ────────────────────────────────────────────────────────
const mediaStyles = `
/* GLOBAL RESET — removes outside margin */
  html, body {
    margin: 0 !important;
  padding: 0 !important;
  height: 100%;
  width: 100%;
  background: #0f172a !important;
  overscroll-behavior: none;
  }

  #root {
    margin: 0 !important;
    padding: 0 !important;
    min-height: 100vh;
  }

  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.25; }
    100% { transform: scale(1.1); opacity: 0.3; }
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Tablet and below */
  @media (max-width: 768px) {
    .form-card {
      padding: 32px 24px !important;
      border-radius: 20px !important;
    }
    .card-title {
      font-size: 24px !important;
    }
    .card-subtitle {
      font-size: 13px !important;
    }
    .logo-image {
      width: 100px !important;
      height: 100px !important;
    }
    .school-name {
      font-size: 22px !important;
    }
  }

  /* Small mobile */
  @media (max-width: 480px) {
    .form-card {
      padding: 28px 20px !important;
      border-radius: 18px !important;
    }
    .card-title {
      font-size: 22px !important;
    }
    .field-label {
      font-size: 12px !important;
    }
    .input-field {
      font-size: 14px !important;
      padding: 12px 14px 12px 40px !important;
    }
    .primary-button {
      font-size: 15px !important;
      padding: 13px !important;
    }
    .checkbox-row {
      flex-direction: column;
      align-items: flex-start !important;
    }
    .logo-image {
      width: 90px !important;
      height: 90px !important;
    }
    .school-name {
      font-size: 20px !important;
    }
  }

  /* Extra small mobile */
  @media (max-width: 360px) {
    .form-card {
      padding: 24px 16px !important;
    }
    .logo-image {
      width: 80px !important;
      height: 80px !important;
    }
    .school-name {
      font-size: 18px !important;
    }
  }
`;

// ─── Reusable Field Component ──────────────────────────────────────────────────
const Field = ({
  label,
  icon,
  type = 'text',
  name,
  register,
  errors,
  disabled,
  showToggle,
  showValue,
  onToggle,
  placeholder,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div style={styles.fieldWrapper}>
      <label style={styles.fieldLabel}>{label}</label>
      <div style={styles.inputRow}>
        <div style={styles.inputIcon}>{icon}</div>
        <input
          type={showToggle ? (showValue ? 'text' : 'password') : type}
          {...register(name, { required: `${label} is required` })}
          disabled={disabled}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="input-field"
          style={{
            ...styles.input(!!errors[name]),
            ...(focused ? styles.inputFocusStyle : {}),
            paddingRight: showToggle ? '42px' : '14px',
            opacity: disabled ? 0.5 : 1,
          }}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            style={styles.eyeBtn}
            tabIndex={-1}
          >
            {showValue ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {errors[name] && (
        <div style={styles.errorText}>⚠ {errors[name].message}</div>
      )}
    </div>
  );
};

// ─── Main Login Page ───────────────────────────────────────────────────────────
const LoginPage = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm();

  // ── Redirect if authenticated ──
  useEffect(() => {
    if (isAuthenticated && user) {
      const roleRoutes = {
        super_admin: '/super-admin/dashboard',
        admin: '/admin/dashboard',
        student: '/student/dashboard',
        teacher: '/teacher/dashboard',
      };
      navigate(roleRoutes[user.role] || '/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // ── Login Submit ──
  const onSubmit = async (data) => {
    setIsLoading(true);
    clearErrors();

    try {
      const userIdValidation = validateUserId(data.userId);
      if (!userIdValidation.isValid) {
        setError('userId', { message: userIdValidation.message });
        setIsLoading(false);
        return;
      }

      const response = await login(data.userId, data.password);
      showSuccess('Login successful!');

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
      navigate(roleRoutes[userRole] || '/dashboard', { replace: true });
    } catch (error) {
      showError(error.message || 'Login failed. Please try again.');
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
    <>
      <style>{mediaStyles}</style>
      <div style={styles.wrapper}>
        {/* Background Orbs */}
        <div style={styles.orb('10%', '5%', '400px', 'radial-gradient(circle, #6366f1, transparent)', 0)} />
        <div style={styles.orb('60%', '70%', '500px', 'radial-gradient(circle, #8b5cf6, transparent)', 2)} />
        <div style={styles.orb('40%', '85%', '450px', 'radial-gradient(circle, #ec4899, transparent)', 4)} />

        {/* ── Login Form Card ── */}
        <div className="form-card" style={styles.formCard}>
          {/* Logo and School Name Section */}
          <div style={styles.logoSection}>
            <img
              src="/logo.png"
              alt="School Logo"
              className="logo-image"
              style={styles.logoImage}
            />
            <h1 className="school-name" style={styles.schoolName}>
              Advance School & College
            </h1>
          </div>

          {/* Login Form Header */}
          <h2 className="card-title" style={styles.cardTitle}>
            Welcome Back
          </h2>
          <p className="card-subtitle" style={styles.cardSubtitle}>
            Sign in to your account to continue
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Field
              label="User ID"
              icon={<User size={18} />}
              type="text"
              name="userId"
              register={register}
              errors={errors}
              disabled={isLoading}
              placeholder="Enter your User ID"
            />

            <Field
              label="Password"
              icon={<Lock size={18} />}
              type="password"
              name="password"
              register={register}
              errors={errors}
              disabled={isLoading}
              showToggle
              showValue={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              placeholder="Enter your password"
            />

            <div className="checkbox-row" style={styles.checkboxRow}>
              <label style={styles.checkboxLabel}>
                <input type="checkbox" style={styles.checkbox} />
                Remember me
              </label>
              <a href="#" style={styles.forgotLink}>
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="primary-button"
              style={styles.primaryBtn(isLoading)}
              onMouseEnter={(e) => {
                if (!isLoading)
                  e.currentTarget.style.boxShadow =
                    '0 6px 28px rgba(99,102,241,0.55)';
              }}
              onMouseLeave={(e) => {
                if (!isLoading)
                  e.currentTarget.style.boxShadow =
                    '0 4px 20px rgba(99,102,241,0.4)';
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Signing In…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div style={styles.footer}>
            © 2026 Advance School & College. All rights reserved.
          </div>
        </div>
      </div>
<<<<<<< HEAD

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
=======
    </>
>>>>>>> ca9beb7 (Add user groups, role management, user profile and login page update)
  );
};

export default LoginPage;