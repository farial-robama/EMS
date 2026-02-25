// src/pages/auth/LoginPage.jsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { validateUserId } from '../../utils/validation';
import { showSuccess, showError } from '../../utils/toast';

const ROLE_ROUTES = {
  super_admin: '/super-admin/dashboard',
  admin:       '/admin/dashboard',
  teacher:     '/teacher/dashboard',
  student:     '/student/dashboard',
};
const getRouteForRole = (role) => ROLE_ROUTES[role] || '/dashboard';

const REMEMBER_KEY        = 'ems_remembered_user';
const saveRememberedUser  = (id) => { try { localStorage.setItem(REMEMBER_KEY, id); } catch (_) {} };
const loadRememberedUser  = ()   => { try { return localStorage.getItem(REMEMBER_KEY) || ''; } catch (_) { return ''; } };
const clearRememberedUser = ()   => { try { localStorage.removeItem(REMEMBER_KEY); } catch (_) {} };

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: #0f172a;
  }

  .lr {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Outfit', sans-serif;
    background: #0f172a;
    overflow: hidden;
  }

  /* Orbs */
  .lr-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    opacity: 0;
    animation: orbIn 1.2s ease forwards;
    pointer-events: none;
  }

  .lr-orb-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(99,102,241,0.28), transparent 70%);
    top: -10%; left: -8%;
    animation-delay: 0s;
  }

  .lr-orb-2 {
    width: 420px; height: 420px;
    background: radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%);
    bottom: -5%; right: 5%;
    animation-delay: 0.2s;
  }

  .lr-orb-3 {
    width: 280px; height: 280px;
    background: radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%);
    top: 40%; right: 20%;
    animation-delay: 0.4s;
  }

  @keyframes orbIn { to { opacity: 1; } }

  /* Dot grid */
  .lr-grid {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(99,102,241,0.12) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
  }

  /* Card */
  .lc {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 380px;
    animation: cardIn 0.7s cubic-bezier(0.16,1,0.3,1) both;
    animation-delay: 0.15s;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .lc-inner {
    position: relative;
    background: rgba(15, 23, 42, 0.75);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(99,102,241,0.18);
    border-radius: 20px;
    padding: 36px 36px 30px;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.03) inset,
      0 32px 80px rgba(0,0,0,0.5),
      0 0 60px rgba(99,102,241,0.07);
  }

  /* Top accent bar */
  .lc-inner::before {
    content: '';
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(139,92,246,0.7), transparent);
    border-radius: 0 0 4px 4px;
  }

  /* Header */
  .lh {
    display: flex;
    align-items: center;
    gap: 13px;
    margin-bottom: 28px;
  }

  .lh-logo {
    width: 44px; height: 44px;
    border-radius: 12px;
    object-fit: contain;
    padding: 6px;
    background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15));
    border: 1px solid rgba(99,102,241,0.25);
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(99,102,241,0.2);
  }

  .lh-logo-fallback {
    width: 44px; height: 44px;
    border-radius: 12px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 20px;
    box-shadow: 0 4px 16px rgba(99,102,241,0.35);
  }

  .lh-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    color: #f1f5f9;
    line-height: 1;
    letter-spacing: -0.3px;
  }

  .lh-sub {
    font-size: 11.5px;
    color: rgba(148,163,184,0.7);
    font-weight: 400;
    margin-top: 3px;
    letter-spacing: 0.2px;
  }

  /* Divider */
  .ld {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99,102,241,0.15), rgba(99,102,241,0.15), transparent);
    margin-bottom: 24px;
  }

  /* Fields */
  .lf { margin-bottom: 14px; }

  .lf-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 10.5px;
    font-weight: 600;
    color: rgba(148,163,184,0.6);
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .lf-wrap { position: relative; display: flex; align-items: center; }

  .lf-icon {
    position: absolute;
    left: 13px;
    color: rgba(99,102,241,0.4);
    display: flex;
    align-items: center;
    pointer-events: none;
    transition: color 0.25s;
  }

  .lf-wrap:focus-within .lf-icon { color: #818cf8; }

  .lf-input {
    width: 100%;
    padding: 12px 13px 12px 40px;
    border-radius: 10px;
    border: 1px solid rgba(99,102,241,0.12);
    background: rgba(99,102,241,0.04);
    color: #e2e8f0;
    font-size: 14px;
    font-family: 'Outfit', sans-serif;
    font-weight: 400;
    outline: none;
    transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
    -webkit-appearance: none;
    letter-spacing: 0.1px;
  }

  .lf-input::placeholder { color: rgba(148,163,184,0.3); }

  .lf-input:focus {
    border-color: rgba(99,102,241,0.5);
    background: rgba(99,102,241,0.07);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1), 0 1px 3px rgba(0,0,0,0.2);
  }

  .lf-input.err { border-color: rgba(248,113,113,0.4); background: rgba(239,68,68,0.04); }
  .lf-input:disabled { opacity: 0.35; cursor: not-allowed; }

  .lf-eye {
    position: absolute; right: 12px;
    background: none; border: none;
    color: rgba(148,163,184,0.35);
    cursor: pointer;
    display: flex; align-items: center; padding: 3px;
    transition: color 0.2s;
    border-radius: 4px;
  }
  .lf-eye:hover { color: #818cf8; }

  .lf-err {
    font-size: 11px;
    color: #f87171;
    margin-top: 5px;
    display: flex; align-items: center; gap: 4px;
  }

  /* Remember + forgot */
  .lb-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 6px 0 20px;
  }

  .lb-check {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
  }

  .lb-box {
    width: 16px; height: 16px;
    border-radius: 4px;
    border: 1px solid rgba(99,102,241,0.25);
    background: rgba(99,102,241,0.05);
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    position: relative;
    transition: all 0.18s;
    flex-shrink: 0;
  }

  .lb-box:checked {
    background: #6366f1;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99,102,241,0.2);
  }

  .lb-box:checked::after {
    content: '';
    position: absolute;
    left: 3.5px; top: 1px;
    width: 4.5px; height: 8px;
    border: 2px solid #fff;
    border-top: none;
    border-left: none;
    transform: rotate(45deg);
  }

  .lb-box:disabled { opacity: 0.35; cursor: not-allowed; }

  .lb-text {
    font-size: 12.5px;
    color: rgba(148,163,184,0.55);
    font-weight: 400;
  }

  .lb-forgot {
    font-size: 12.5px;
    color: #818cf8;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.2s;
  }
  .lb-forgot:hover { color: #a5b4fc; text-decoration: none; }

  /* Button */
  .ls-btn {
    position: relative;
    width: 100%;
    padding: 13px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #7c3aed 100%);
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    letter-spacing: 0.2px;
    transition: transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(99,102,241,0.4), 0 1px 3px rgba(0,0,0,0.2);
    overflow: hidden;
  }

  .ls-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent 50%);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .ls-btn:hover:not(:disabled)::before { opacity: 1; }
  .ls-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(99,102,241,0.5), 0 2px 6px rgba(0,0,0,0.25);
  }
  .ls-btn:active:not(:disabled) { transform: translateY(0); }
  .ls-btn:disabled {
    background: rgba(99,102,241,0.22);
    cursor: not-allowed;
    box-shadow: none;
    color: rgba(255,255,255,0.35);
  }

  /* Footer */
  .lfoot {
    margin-top: 22px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .lfoot-line {
    flex: 1;
    height: 1px;
    background: rgba(99,102,241,0.08);
  }

  .lfoot-text {
    font-size: 10.5px;
    color: rgba(148,163,184,0.3);
    font-weight: 300;
    white-space: nowrap;
  }

  /* Loading */
  .l-loading {
    position: fixed; inset: 0;
    background: #0f172a;
    display: flex; align-items: center; justify-content: center;
    flex-direction: column;
    gap: 14px;
  }

  .l-loading-text {
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    color: rgba(148,163,184,0.4);
    letter-spacing: 0.5px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 440px) {
    .lc { padding: 0 16px; }
    .lc-inner { padding: 28px 24px 24px; }
  }
`;

const Field = ({ label, name, icon, type = 'text', register, errors, disabled, showToggle, showValue, onToggle, placeholder }) => (
  <div className="lf">
    <div className="lf-label">{icon}{label}</div>
    <div className="lf-wrap">
      <span className="lf-icon">{icon}</span>
      <input
        type={showToggle ? (showValue ? 'text' : 'password') : type}
        className={`lf-input${errors[name] ? ' err' : ''}`}
        placeholder={placeholder}
        disabled={disabled}
        {...register(name, { required: `${label} is required` })}
      />
      {showToggle && (
        <button type="button" className="lf-eye" onClick={onToggle} tabIndex={-1}>
          {showValue ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      )}
    </div>
    {errors[name] && <div className="lf-err">⚠ {errors[name].message}</div>}
  </div>
);

const LoginPage = () => {
  const { login, isAuthenticated, isLoading: authLoading, user } = useAuth();
  const navigate = useNavigate();

  const rememberedUser = loadRememberedUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe,   setRememberMe]   = useState(!!rememberedUser);
  const [logoError,    setLogoError]    = useState(false);

  const { register, handleSubmit, formState: { errors }, setError, clearErrors, reset } = useForm({
    defaultValues: { userId: rememberedUser, password: '' },
  });

  useEffect(() => {
    document.body.style.background = '#0f172a';
    document.documentElement.style.background = '#0f172a';
    return () => {
      document.body.style.background = '';
      document.documentElement.style.background = '';
    };
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated && user?.role) {
      navigate(getRouteForRole(user.role), { replace: true });
    }
  }, [authLoading, isAuthenticated, user?.role, navigate]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    clearErrors();
    try {
      const validation = validateUserId(data.userId);
      if (!validation.isValid) {
        setError('userId', { message: validation.message });
        setIsSubmitting(false);
        return;
      }
      rememberMe ? saveRememberedUser(data.userId) : clearRememberedUser();
      const result = await login(data.userId, data.password);
      showSuccess('Login successful!');
      navigate(getRouteForRole(result.user.role), { replace: true });
    } catch (err) {
      showError(err.message || 'Login failed. Please try again.');
      reset({ userId: data.userId, password: '' });
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="l-loading">
        <style>{css}</style>
        <Loader2 size={28} style={{ color: '#6366f1', animation: 'spin 1s linear infinite' }} />
        <span className="l-loading-text">Restoring session…</span>
      </div>
    );
  }

  return (
    <div className="lr">
      <style>{css}</style>

      <div className="lr-orb lr-orb-1" />
      <div className="lr-orb lr-orb-2" />
      <div className="lr-orb lr-orb-3" />
      <div className="lr-grid" />

      <div className="lc">
        <div className="lc-inner">

          <div className="lh">
            {logoError ? (
              <div className="lh-logo-fallback">🎓</div>
            ) : (
              <img src="/logo.png" alt="Logo" className="lh-logo" onError={() => setLogoError(true)} />
            )}
            <div>
              <div className="lh-title">Sign in</div>
              <div className="lh-sub">EMS · Admin Panel</div>
            </div>
          </div>

          <div className="ld" />

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Field
              label="User ID" name="userId"
              icon={<User size={14} />} type="text"
              register={register} errors={errors}
              disabled={isSubmitting} placeholder="e.g. ADM0629"
            />
            <Field
              label="Password" name="password"
              icon={<Lock size={14} />} type="password"
              register={register} errors={errors}
              disabled={isSubmitting} showToggle
              showValue={showPassword}
              onToggle={() => setShowPassword((v) => !v)}
              placeholder="Enter your password"
            />

            <div className="lb-row">
              <label className="lb-check">
                <input
                  type="checkbox" className="lb-box"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isSubmitting}
                />
                <span className="lb-text">Remember me</span>
              </label>
              <Link to="/auth/forgot-password" className="lb-forgot">Forgot password?</Link>
            </div>

            <button type="submit" className="ls-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />Signing in…</>
              ) : (
                <>Sign In <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <div className="lfoot">
            <div className="lfoot-line" />
            <span className="lfoot-text">© 2026 Advance School &amp; College</span>
            <div className="lfoot-line" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;