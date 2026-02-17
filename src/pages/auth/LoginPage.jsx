// src/pages/auth/LoginPage.jsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { validateUserId } from '../../utils/validation';
import { showSuccess, showError } from '../../utils/toast';

// ... [keep all your styles exactly as they are] ...

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
  footer: {
    textAlign: 'center',
    marginTop: '28px',
    color: '#475569',
    fontSize: '12px',
  },
};

const mediaStyles = `
html, body { margin: 0 !important; padding: 0 !important; height: 100%; width: 100%; background: #0f172a !important; overscroll-behavior: none; }
#root { margin: 0 !important; padding: 0 !important; min-height: 100vh; }

@keyframes pulse { 0% { transform: scale(1); opacity: 0.25; } 100% { transform: scale(1.1); opacity: 0.3; } }
@keyframes spin { to { transform: rotate(360deg); } }
`;

const Field = ({ label, icon, type = 'text', name, register, errors, disabled, showToggle, showValue, onToggle, placeholder }) => {
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
          <button type="button" onClick={onToggle} style={styles.eyeBtn} tabIndex={-1}>
            {showValue ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {errors[name] && <div style={styles.errorText}>⚠ {errors[name].message}</div>}
    </div>
  );
};

// ─── Main Login Page ───────────────────────────────────────────────────────────
const LoginPage = () => {
  console.log('🔄 LoginPage RENDERED');
  
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, setError, clearErrors, reset } = useForm();

  console.log('📊 LoginPage Current State:', { 
    isAuthenticated, 
    hasUser: !!user, 
    userRole: user?.role 
  });

  // ✅ FIRST useEffect - Watch auth state
  // useEffect(() => {
  //   console.log('👁️ useEffect TRIGGERED - Auth state:', { isAuthenticated, user: user?.role });
    
  //   if (isAuthenticated && user?.role) {
  //     console.log('✅ CONDITIONS MET - Will navigate now');
      
  //     const roleRoutes = {
  //       super_admin: '/super-admin/dashboard',
  //       admin: '/admin/dashboard',
  //       student: '/student/dashboard',
  //       teacher: '/teacher/dashboard',
  //     };
      
  //     const targetRoute = roleRoutes[user.role] || '/dashboard';
  //     console.log('🎯 Target route:', targetRoute);
  //     console.log('🚀 Calling navigate()...');
      
  //     navigate(targetRoute, { replace: true });
      
  //     console.log('✅ navigate() called');
  //   } else {
  //     console.log('❌ CONDITIONS NOT MET:', {
  //       isAuthenticated,
  //       hasUser: !!user,
  //       userRole: user?.role
  //     });
  //   }
  // }, [isAuthenticated, user, navigate]);

  // const onSubmit = async (data) => {
  //   console.log('📝 Form submitted:', { userId: data.userId });
  //   setIsLoading(true);
  //   clearErrors();
    
  //   try {
  //     const userIdValidation = validateUserId(data.userId);
  //     if (!userIdValidation.isValid) {
  //       setError('userId', { message: userIdValidation.message });
  //       setIsLoading(false);
  //       return;
  //     }

  //     console.log('🔐 Calling login()...');
  //     const result = await login(data.userId, data.password);
  //     console.log('✅ Login returned:', result);
      
  //     showSuccess('Login successful!');
  //     console.log('⏳ Waiting for useEffect to trigger navigation...');
      
  //   } catch (error) {
  //     console.error('❌ Login failed:', error);
  //     showError(error.message || 'Login failed. Please try again.');
  //     reset({ userId: data.userId, password: '' });
  //     setIsLoading(false);
  //   }
  // };


  // LoginPage.jsx - Replace your useEffect and onSubmit

useEffect(() => {
  // Don't do anything while auth is still being checked
  if (isLoading) return; // ADD THIS LINE
  
  if (isAuthenticated && user?.role) {
    const roleRoutes = {
      super_admin: '/super-admin/dashboard',
      admin: '/admin/dashboard',
      student: '/student/dashboard',
      teacher: '/teacher/dashboard',
    };
    navigate(roleRoutes[user.role] || '/dashboard', { replace: true });
  }
}, [isAuthenticated, user, navigate, isLoading]); // add isLoading to deps

const onSubmit = async (data) => {
  console.log('🎯 onSubmit called with:', data); 
  setIsLoading(true);
  clearErrors();
  
  try {
    const userIdValidation = validateUserId(data.userId);
    if (!userIdValidation.isValid) {
      setError('userId', { message: userIdValidation.message });
      setIsLoading(false);
      return;
    }

    const result = await login(data.userId, data.password);
    showSuccess('Login successful!');
    
    // Navigate immediately using result — don't wait for useEffect
    const roleRoutes = {
      super_admin: '/super-admin/dashboard',
      admin: '/admin/dashboard',
      student: '/student/dashboard',
      teacher: '/teacher/dashboard',
    };
    const role = result.user?.role;
    navigate(roleRoutes[role] || '/dashboard', { replace: true });

  } catch (error) {
    showError(error.message || 'Login failed. Please try again.');
    reset({ userId: data.userId, password: '' });
    setIsLoading(false); // Only reset loading on error
  }
};

  console.log('🎨 Rendering LoginPage UI');
  return (
    <div style={styles.wrapper}>
      <style>{mediaStyles}</style>
      
      <div style={styles.orb('10%', '5%', '400px', 'radial-gradient(circle, #6366f1, transparent)', 0)} />
      <div style={styles.orb('60%', '70%', '500px', 'radial-gradient(circle, #8b5cf6, transparent)', 2)} />
      <div style={styles.orb('40%', '85%', '450px', 'radial-gradient(circle, #ec4899, transparent)', 4)} />

      <div style={styles.formCard}>
        <div style={styles.logoSection}>
          <img src="/logo.png" alt="School Logo" style={styles.logoImage} />
          <h1 style={styles.schoolName}>Advance School & College</h1>
        </div>

        <h2 style={styles.cardTitle}>Welcome Back</h2>
        <p style={styles.cardSubtitle}>Sign in to your account to continue</p>

        {/* <form onSubmit={handleSubmit(onSubmit)}> */}
          <form onSubmit={handleSubmit(onSubmit, (errors) => {
  console.log('❌ Form validation errors:', errors); // ADD THIS
})}>
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

          <div style={styles.checkboxRow}>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" style={styles.checkbox} />
              Remember me
            </label>
            <Link to="/auth/forgot-password" style={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>

          {/* <button type="submit" disabled={isLoading} style={styles.primaryBtn(isLoading)}> */}
          <button 
  type="submit" 
  onClick={() => console.log('🖱️ Button clicked!')}  // ADD THIS
  disabled={isLoading} 
  style={styles.primaryBtn(isLoading)}
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

      
        <div style={styles.footer}>© 2026 Advance School & College. All rights reserved.</div>
      </div>
    </div>
  );
};

export default LoginPage;




// src/pages/auth/LoginPage.jsx
// import React, { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useNavigate, Link } from 'react-router-dom';
// import { User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';
// import { validateUserId } from '../../utils/validation';
// import { showSuccess, showError } from '../../utils/toast';

// // ─── Responsive Styles ───────────────────────────────────────────────────────
// const styles = {
//   wrapper: {
//     minHeight: '100vh',
//     height: '100vh',
//     maxHeight: '100dvh',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     background: '#0f172a',
//     fontFamily: "'Outfit', 'Segoe UI', sans-serif",
//     overflow: 'hidden',
//     position: 'relative',
//     padding: '20px',
//   },

//   // Animated gradient orbs
//   orb: (top, left, size, color, delay) => ({
//     position: 'absolute',
//     top,
//     left,
//     width: size,
//     height: size,
//     borderRadius: '50%',
//     background: color,
//     filter: 'blur(80px)',
//     opacity: 0.25,
//     animation: `pulse 6s ease-in-out ${delay}s infinite alternate`,
//     pointerEvents: 'none',
//     zIndex: 0,
//   }),

//   formCard: {
//     width: '100%',
//     maxWidth: '440px',
//     maxHeight: 'calc(100vh - 40px)',
//     overflowY: 'auto',
//     background: 'rgba(30,41,59,0.7)',
//     backdropFilter: 'blur(20px)',
//     WebkitBackdropFilter: 'blur(20px)',
//     border: '1px solid rgba(99,102,241,0.15)',
//     borderRadius: '20px',
//     padding: '32px 32px',
//     boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
//     position: 'relative',
//     zIndex: 1,
//   },

//   logoSection: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     gap: '12px',
//     marginBottom: '24px',
//     paddingBottom: '20px',
//     borderBottom: '1px solid rgba(99,102,241,0.1)',
//   },

//   logoImage: {
//     width: '90px',
//     height: '90px',
//     objectFit: 'contain',
//     filter: 'drop-shadow(0 4px 20px rgba(99,102,241,0.4))',
//   },

//   schoolName: {
//     color: '#fff',
//     fontSize: '22px',
//     fontWeight: 700,
//     letterSpacing: '-0.5px',
//     textAlign: 'center',
//     background: 'linear-gradient(135deg, #fff, #a78bfa)',
//     WebkitBackgroundClip: 'text',
//     WebkitTextFillColor: 'transparent',
//   },

//   cardTitle: {
//     color: '#fff',
//     fontSize: '24px',
//     fontWeight: 700,
//     letterSpacing: '-0.4px',
//     marginBottom: '6px',
//     textAlign: 'center',
//   },

//   cardSubtitle: {
//     color: '#64748b',
//     fontSize: '13px',
//     marginBottom: '24px',
//     textAlign: 'center',
//   },

//   fieldWrapper: {
//     marginBottom: '16px',
//   },

//   fieldLabel: {
//     display: 'block',
//     color: '#94a3b8',
//     fontSize: '12px',
//     fontWeight: 600,
//     marginBottom: '6px',
//     letterSpacing: '0.3px',
//     textTransform: 'uppercase',
//   },

//   inputRow: {
//     position: 'relative',
//     display: 'flex',
//     alignItems: 'center',
//   },

//   inputIcon: {
//     position: 'absolute',
//     left: '12px',
//     color: '#475569',
//     zIndex: 1,
//     display: 'flex',
//     alignItems: 'center',
//   },

//   input: (hasError) => ({
//     width: '100%',
//     padding: '11px 12px 11px 38px',
//     borderRadius: '10px',
//     border: `1px solid ${hasError ? '#ef4444' : 'rgba(99,102,241,0.2)'}`,
//     background: 'rgba(15,23,42,0.55)',
//     color: '#fff',
//     fontSize: '14px',
//     fontFamily: 'inherit',
//     outline: 'none',
//     transition: 'border-color 0.2s, box-shadow 0.2s',
//     boxSizing: 'border-box',
//   }),

//   inputFocusStyle: {
//     borderColor: '#6366f1',
//     boxShadow: '0 0 0 3px rgba(99,102,241,0.18)',
//   },

//   eyeBtn: {
//     position: 'absolute',
//     right: '12px',
//     background: 'none',
//     border: 'none',
//     color: '#64748b',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     padding: '4px',
//   },

//   errorText: {
//     color: '#ef4444',
//     fontSize: '11px',
//     marginTop: '5px',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '4px',
//   },

//   checkboxRow: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: '20px',
//     marginTop: '4px',
//     flexWrap: 'wrap',
//     gap: '10px',
//   },

//   checkboxLabel: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     color: '#94a3b8',
//     fontSize: '12px',
//     cursor: 'pointer',
//     userSelect: 'none',
//   },

//   checkbox: {
//     width: '16px',
//     height: '16px',
//     borderRadius: '4px',
//     border: '2px solid rgba(99,102,241,0.4)',
//     background: 'rgba(15,23,42,0.55)',
//     cursor: 'pointer',
//     accentColor: '#6366f1',
//   },

//   forgotLink: {
//     color: '#6366f1',
//     fontSize: '12px',
//     fontWeight: 600,
//     textDecoration: 'none',
//     cursor: 'pointer',
//   },

//   primaryBtn: (disabled) => ({
//     width: '100%',
//     padding: '12px',
//     borderRadius: '10px',
//     border: 'none',
//     background: disabled
//       ? 'rgba(99,102,241,0.35)'
//       : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
//     color: '#fff',
//     fontSize: '15px',
//     fontWeight: 700,
//     fontFamily: 'inherit',
//     cursor: disabled ? 'not-allowed' : 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: '8px',
//     transition: 'box-shadow 0.2s, transform 0.1s',
//     boxShadow: disabled ? 'none' : '0 4px 20px rgba(99,102,241,0.4)',
//   }),

//   footer: {
//     textAlign: 'center',
//     marginTop: '20px',
//     color: '#475569',
//     fontSize: '11px',
//   },
// };

// // ─── Media Query Styles ────────────────────────────────────────────────────────
// const mediaStyles = `
// html, body { 
//   margin: 0 !important; 
//   padding: 0 !important; 
//   height: 100%; 
//   width: 100%; 
//   background: #0f172a !important; 
//   overflow: hidden !important;
// }

// #root { 
//   margin: 0 !important; 
//   padding: 0 !important; 
//   height: 100vh;
//   overflow: hidden !important;
// }

// /* Custom scrollbar for form card only */
// .login-card-scroll::-webkit-scrollbar {
//   width: 6px;
// }

// .login-card-scroll::-webkit-scrollbar-track {
//   background: rgba(15,23,42,0.3);
//   border-radius: 10px;
// }

// .login-card-scroll::-webkit-scrollbar-thumb {
//   background: rgba(99,102,241,0.3);
//   border-radius: 10px;
// }

// .login-card-scroll::-webkit-scrollbar-thumb:hover {
//   background: rgba(99,102,241,0.5);
// }

// @keyframes pulse { 
//   0% { transform: scale(1); opacity: 0.25; } 
//   100% { transform: scale(1.1); opacity: 0.3; } 
// }

// @keyframes spin { 
//   to { transform: rotate(360deg); } 
// }

// /* Responsive adjustments */
// @media (max-height: 700px) {
//   .login-card-scroll {
//     max-height: calc(100vh - 30px) !important;
//   }
// }

// @media (max-height: 600px) {
//   .login-card-scroll {
//     max-height: calc(100vh - 20px) !important;
//     padding: 24px 28px !important;
//   }
// }
// `;

// // ─── Reusable Field Component ──────────────────────────────────────────────────
// const Field = ({ label, icon, type = 'text', name, register, errors, disabled, showToggle, showValue, onToggle, placeholder }) => {
//   const [focused, setFocused] = useState(false);

//   return (
//     <div style={styles.fieldWrapper}>
//       <label style={styles.fieldLabel}>{label}</label>
//       <div style={styles.inputRow}>
//         <div style={styles.inputIcon}>{icon}</div>
//         <input
//           type={showToggle ? (showValue ? 'text' : 'password') : type}
//           {...register(name, { required: `${label} is required` })}
//           disabled={disabled}
//           placeholder={placeholder}
//           onFocus={() => setFocused(true)}
//           onBlur={() => setFocused(false)}
//           className="input-field"
//           style={{
//             ...styles.input(!!errors[name]),
//             ...(focused ? styles.inputFocusStyle : {}),
//             paddingRight: showToggle ? '38px' : '12px',
//             opacity: disabled ? 0.5 : 1,
//           }}
//         />
//         {showToggle && (
//           <button type="button" onClick={onToggle} style={styles.eyeBtn} tabIndex={-1}>
//             {showValue ? <EyeOff size={16} /> : <Eye size={16} />}
//           </button>
//         )}
//       </div>
//       {errors[name] && <div style={styles.errorText}>⚠ {errors[name].message}</div>}
//     </div>
//   );
// };

// // ─── Main Login Page ───────────────────────────────────────────────────────────
// const LoginPage = () => {
//   const { login, isAuthenticated, user } = useAuth();
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);

//   const { register, handleSubmit, formState: { errors }, setError, clearErrors, reset, setValue } = useForm();

//   // Load saved credentials on mount
//   useEffect(() => {
//     const savedUserId = localStorage.getItem('remembered_userId');
//     const savedRememberMe = localStorage.getItem('remember_me') === 'true';
    
//     if (savedUserId && savedRememberMe) {
//       setValue('userId', savedUserId);
//       setRememberMe(true);
//     }
//   }, [setValue]);

//   // Redirect if already authenticated
//   useEffect(() => {
//     if (isAuthenticated && user) {
//       const roleRoutes = {
//         super_admin: '/super-admin/dashboard',
//         admin: '/admin/dashboard',
//         student: '/student/dashboard',
//         teacher: '/teacher/dashboard',
//       };
//       navigate(roleRoutes[user.role] || '/dashboard', { replace: true });
//     }
//   }, [isAuthenticated, user, navigate]);

//   const handleRememberMeChange = (e) => {
//     setRememberMe(e.target.checked);
//   };

//   const onSubmit = async (data) => {
//     setIsLoading(true);
//     clearErrors();
    
//     try {
//       const userIdValidation = validateUserId(data.userId);
//       if (!userIdValidation.isValid) {
//         setError('userId', { message: userIdValidation.message });
//         setIsLoading(false);
//         return;
//       }

//       const response = await login(data.userId, data.password);
      
//       // Handle Remember Me
//       if (rememberMe) {
//         localStorage.setItem('remembered_userId', data.userId);
//         localStorage.setItem('remember_me', 'true');
//       } else {
//         localStorage.removeItem('remembered_userId');
//         localStorage.removeItem('remember_me');
//       }
      
//       showSuccess('Login successful!');
      
//       const roleRoutes = {
//         super_admin: '/super-admin/dashboard',
//         admin: '/admin/dashboard',
//         student: '/student/dashboard',
//         teacher: '/teacher/dashboard',
//       };
      
//       const userRole = response.user?.role || 'student';
//       navigate(roleRoutes[userRole] || '/dashboard', { replace: true });
//     } catch (error) {
//       showError(error.message || 'Login failed. Please try again.');
//       reset({ userId: data.userId, password: '' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div style={styles.wrapper}>
//       <style>{mediaStyles}</style>
      
//       {/* Background Orbs */}
//       <div style={styles.orb('10%', '5%', '400px', 'radial-gradient(circle, #6366f1, transparent)', 0)} />
//       <div style={styles.orb('60%', '70%', '500px', 'radial-gradient(circle, #8b5cf6, transparent)', 2)} />
//       <div style={styles.orb('40%', '85%', '450px', 'radial-gradient(circle, #ec4899, transparent)', 4)} />

//       {/* Login Form Card */}
//       <div style={styles.formCard} className="login-card-scroll">
//         <div style={styles.logoSection}>
//           <img src="/logo.png" alt="School Logo" style={styles.logoImage} />
//           <h1 style={styles.schoolName}>Advance School & College</h1>
//         </div>

//         <h2 style={styles.cardTitle}>Welcome Back</h2>
//         <p style={styles.cardSubtitle}>Sign in to your account to continue</p>

//         <form onSubmit={handleSubmit(onSubmit)}>
//           <Field
//             label="User ID"
//             icon={<User size={16} />}
//             type="text"
//             name="userId"
//             register={register}
//             errors={errors}
//             disabled={isLoading}
//             placeholder="Enter your User ID"
//           />

//           <Field
//             label="Password"
//             icon={<Lock size={16} />}
//             type="password"
//             name="password"
//             register={register}
//             errors={errors}
//             disabled={isLoading}
//             showToggle
//             showValue={showPassword}
//             onToggle={() => setShowPassword(!showPassword)}
//             placeholder="Enter your password"
//           />

//           <div style={styles.checkboxRow}>
//             <label style={styles.checkboxLabel}>
//               <input 
//                 type="checkbox" 
//                 style={styles.checkbox}
//                 checked={rememberMe}
//                 onChange={handleRememberMeChange}
//                 disabled={isLoading}
//               />
//               Remember me
//             </label>
//             <Link to="/auth/forgot-password" style={styles.forgotLink}>
//               Forgot password?
//             </Link>
//           </div>

//           <button type="submit" disabled={isLoading} style={styles.primaryBtn(isLoading)}>
//             {isLoading ? (
//               <>
//                 <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> 
//                 Signing In…
//               </>
//             ) : (
//               'Sign In'
//             )}
//           </button>
//         </form>

//         <div style={styles.footer}>© 2026 Advance School & College. All rights reserved.</div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;






// ============================================================
// DIAGNOSTIC LOGIN PAGE
// Drop this in place of your LoginPage.jsx temporarily.
// It strips everything to bare minimum and shows you EXACTLY
// what's happening at each step via an on-screen log panel.
// ============================================================

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { validateUserId } from '../../utils/validation';

// // ── tiny logger that writes to screen AND console ──────────
// const createLogger = (setLogs) => (emoji, msg, data) => {
//   const line = `${emoji} ${msg}${data ? ': ' + JSON.stringify(data) : ''}`;
//   console.log(line);
//   setLogs(prev => [...prev, { id: Date.now() + Math.random(), text: line }]);
// };

// // ──────────────────────────────────────────────────────────
// const LoginDiagnostic = () => {
//   const { login, isAuthenticated, user, isLoading: authLoading } = useAuth();
//   const navigate = useNavigate();

//   const [userId, setUserId]       = useState('');
//   const [password, setPassword]   = useState('');
//   const [submitting, setSubmitting] = useState(false);
//   const [logs, setLogs]           = useState([]);
//   const log = createLogger(setLogs);

//   // ── 1. Log every auth state change ───────────────────────
//   useEffect(() => {
//     log('📊', 'AuthContext state changed', {
//       isAuthenticated,
//       authLoading,
//       role: user?.role ?? null,
//     });
//   }, [isAuthenticated, user, authLoading]);

//   // ── 2. Navigation effect ──────────────────────────────────
//   useEffect(() => {
//     log('👁️', 'Nav effect fired', { authLoading, isAuthenticated, role: user?.role });

//     if (authLoading) {
//       log('⏳', 'Skipping nav — auth still loading');
//       return;
//     }
//     if (isAuthenticated && user?.role) {
//       const routes = {
//         super_admin : '/super-admin/dashboard',
//         admin       : '/admin/dashboard',
//         student     : '/student/dashboard',
//         teacher     : '/teacher/dashboard',
//       };
//       const target = routes[user.role] ?? '/dashboard';
//       log('🚀', 'Navigating to', target);
//       navigate(target, { replace: true });
//     }
//   }, [isAuthenticated, user, authLoading, navigate]);

//   // ── 3. Plain submit handler (no react-hook-form) ──────────
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     log('🖱️', 'Form submitted', { userId, passwordLen: password.length });

//     if (!userId || !password) {
//       log('❌', 'Validation failed — empty fields');
//       return;
//     }

//     // ── 3a. validateUserId ──────────────────────────────────
//     log('🔍', 'Running validateUserId', { userId });
//     let validation;
//     try {
//       validation = validateUserId(userId);
//       log('📋', 'validateUserId result', validation);
//     } catch (err) {
//       log('💥', 'validateUserId THREW AN ERROR', { message: err.message });
//       return;
//     }

//     if (!validation.isValid) {
//       log('❌', 'validateUserId rejected', { reason: validation.message });
//       return;
//     }

//     // ── 3b. Call login() ────────────────────────────────────
//     setSubmitting(true);
//     log('🔐', 'Calling login()...');

//     try {
//       const result = await login(userId, password);
//       log('✅', 'login() returned', result);

//       const role = result?.user?.role;
//       log('👤', 'Role from result', { role });

//       if (!role) {
//         log('⚠️', 'No role in result — checking AuthContext state instead');
//       }

//       const routes = {
//         super_admin : '/super-admin/dashboard',
//         admin       : '/admin/dashboard',
//         student     : '/student/dashboard',
//         teacher     : '/teacher/dashboard',
//       };
//       const target = routes[role] ?? '/dashboard';
//       log('🚀', 'Navigating directly to', target);
//       navigate(target, { replace: true });

//     } catch (err) {
//       log('❌', 'login() threw', { message: err.message, stack: err.stack?.slice(0, 200) });
//       setSubmitting(false);
//     }
//   };

//   // ── UI ────────────────────────────────────────────────────
//   return (
//     <div style={ui.page}>
//       <div style={ui.card}>
//         <h2 style={ui.title}>🔬 Login Diagnostic</h2>
//         <p style={ui.sub}>Minimal form — no react-hook-form, no style complexity</p>

//         <form onSubmit={handleSubmit} style={ui.form}>
//           <label style={ui.label}>User ID</label>
//           <input
//             style={ui.input}
//             value={userId}
//             onChange={e => setUserId(e.target.value)}
//             placeholder="Enter User ID"
//             autoComplete="username"
//           />

//           <label style={ui.label}>Password</label>
//           <input
//             style={ui.input}
//             type="password"
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//             placeholder="Enter password"
//             autoComplete="current-password"
//           />

//           <button
//             type="submit"
//             disabled={submitting}
//             style={{ ...ui.btn, opacity: submitting ? 0.5 : 1 }}
//             onClick={() => log('🖱️', 'Button onClick fired')}
//           >
//             {submitting ? 'Signing in…' : 'Sign In'}
//           </button>
//         </form>

//         {/* Live log panel */}
//         <div style={ui.logBox}>
//           <div style={ui.logHeader}>
//             📋 Live Log
//             <button onClick={() => setLogs([])} style={ui.clearBtn}>clear</button>
//           </div>
//           {logs.length === 0 && (
//             <div style={ui.logEmpty}>Waiting for activity…</div>
//           )}
//           {logs.map(l => (
//             <div key={l.id} style={ui.logLine}>{l.text}</div>
//           ))}
//         </div>

//         {/* Auth state snapshot */}
//         <div style={ui.snapshot}>
//           <strong>AuthContext snapshot:</strong><br />
//           isAuthenticated: <code>{String(isAuthenticated)}</code><br />
//           authLoading: <code>{String(authLoading)}</code><br />
//           user.role: <code>{user?.role ?? 'null'}</code>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ── Bare-bones styles (no backdrop-filter, no z-index games) ─
// const ui = {
//   page: {
//     minHeight: '100vh',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     background: '#0f172a',
//     fontFamily: 'monospace',
//     padding: '20px',
//     boxSizing: 'border-box',
//   },
//   card: {
//     width: '100%',
//     maxWidth: '520px',
//     background: '#1e293b',
//     border: '1px solid #334155',
//     borderRadius: '12px',
//     padding: '32px',
//     color: '#e2e8f0',
//   },
//   title: {
//     margin: '0 0 4px',
//     fontSize: '20px',
//     color: '#f8fafc',
//   },
//   sub: {
//     margin: '0 0 24px',
//     fontSize: '12px',
//     color: '#64748b',
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '8px',
//     marginBottom: '20px',
//   },
//   label: {
//     fontSize: '12px',
//     color: '#94a3b8',
//     textTransform: 'uppercase',
//     letterSpacing: '0.05em',
//     marginTop: '8px',
//   },
//   input: {
//     padding: '10px 12px',
//     borderRadius: '8px',
//     border: '1px solid #475569',
//     background: '#0f172a',
//     color: '#f1f5f9',
//     fontSize: '14px',
//     outline: 'none',
//   },
//   btn: {
//     marginTop: '12px',
//     padding: '12px',
//     borderRadius: '8px',
//     border: 'none',
//     background: '#6366f1',
//     color: '#fff',
//     fontSize: '15px',
//     fontWeight: 700,
//     cursor: 'pointer',
//   },
//   logBox: {
//     background: '#0f172a',
//     border: '1px solid #1e3a5f',
//     borderRadius: '8px',
//     padding: '12px',
//     maxHeight: '260px',
//     overflowY: 'auto',
//     fontSize: '11px',
//     lineHeight: '1.7',
//     marginBottom: '16px',
//   },
//   logHeader: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     color: '#38bdf8',
//     fontWeight: 700,
//     marginBottom: '8px',
//     fontSize: '12px',
//   },
//   clearBtn: {
//     background: 'none',
//     border: '1px solid #334155',
//     color: '#64748b',
//     borderRadius: '4px',
//     padding: '2px 8px',
//     cursor: 'pointer',
//     fontSize: '11px',
//   },
//   logEmpty: {
//     color: '#475569',
//     fontStyle: 'italic',
//   },
//   logLine: {
//     color: '#cbd5e1',
//     borderBottom: '1px solid #1e293b',
//     paddingBottom: '2px',
//     wordBreak: 'break-all',
//   },
//   snapshot: {
//     background: '#0f172a',
//     border: '1px solid #334155',
//     borderRadius: '8px',
//     padding: '12px',
//     fontSize: '12px',
//     lineHeight: '1.8',
//     color: '#94a3b8',
//   },
// };

// export default LoginDiagnostic;