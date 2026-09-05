import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  // Modes: 'signin' | 'signup' | 'verify_sent' | 'forgot'
  const [mode, setMode] = useState('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { login, register, loginOAuth, sendPasswordReset, isConfigured } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setSuccessMsg('');
      setLoading(false);
    } else {
      // Reset state on close after animation
      setTimeout(() => {
        setMode('signin');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
      }, 200);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (!isConfigured) {
      setErrorMsg('Supabase Anon Key is missing. Please add VITE_SUPABASE_ANON_KEY to your .env file.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await login(email, password);
      if (error) {
        setErrorMsg(error.message);
      } else if (data?.user) {
        setSuccessMsg('Signed in successfully!');
        setTimeout(() => onClose(), 600);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (!isConfigured) {
      setErrorMsg('Supabase Anon Key is missing. Please add VITE_SUPABASE_ANON_KEY to your .env file.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await register(email, password, fullName);
      if (error) {
        setErrorMsg(error.message);
      } else if (data?.user) {
        // If Supabase has email confirmation enabled
        if (data.user.identities && data.user.identities.length === 0) {
          setErrorMsg('An account with this email already exists. Please sign in instead.');
        } else {
          setMode('verify_sent');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to register account.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    if (!isConfigured) {
      setErrorMsg('Supabase Anon Key is missing. Please add VITE_SUPABASE_ANON_KEY to your .env file.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const { error } = await sendPasswordReset(email);
      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg('Password reset instructions have been sent to your email.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    if (!isConfigured) {
      setErrorMsg('Supabase Anon Key is missing. Please add VITE_SUPABASE_ANON_KEY to your .env file.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const { error } = await loginOAuth(provider);
      if (error) setErrorMsg(error.message);
    } catch (err) {
      setErrorMsg(err.message || `Failed to sign in with ${provider}.`);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.15s ease',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '430px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-hairline)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--fg-muted)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            borderRadius: '6px',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* 1. EMAIL VERIFICATION CONFIRMATION SCREEN */}
        {mode === 'verify_sent' ? (
          <div style={{ padding: '36px 28px', textAlign: 'center' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(34, 197, 94, 0.12)',
                color: '#22c55e',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--fg)', margin: 0 }}>
              Verify your Email
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--fg-muted)', lineHeight: '1.5', marginTop: '10px', marginBottom: '20px' }}>
              A confirmation link has been sent to <strong>{email}</strong>.
              <br />
              Please check your inbox (and spam folder) and click the link to confirm your account.
            </p>
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg('');
                setSuccessMsg('You can sign in as soon as you confirm your email.');
              }}
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px', fontSize: '13px', fontWeight: '600' }}
            >
              Back to Sign In
            </button>
          </div>
        ) : mode === 'forgot' ? (
          /* 2. FORGOT PASSWORD SCREEN */
          <div style={{ padding: '28px 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '19px', fontWeight: '700', color: 'var(--fg)', margin: 0 }}>
                Reset your Password
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--fg-muted)', marginTop: '6px', marginBottom: 0 }}>
                Enter your registered email address and we'll send you a password reset link.
              </p>
            </div>

            {errorMsg && (
              <div style={{ marginBottom: '14px', padding: '8px 12px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#ef4444', fontSize: '12px' }}>
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div style={{ marginBottom: '14px', padding: '8px 12px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.25)', color: '#22c55e', fontSize: '12px' }}>
                {successMsg}
              </div>
            )}

            <form onSubmit={handleForgot} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--fg)', marginBottom: '6px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    fontSize: '13px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-hairline)',
                    backgroundColor: 'var(--bg-input)',
                    color: 'var(--fg)',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ padding: '10px', fontSize: '13px', fontWeight: '600' }}
              >
                {loading ? 'Sending link...' : 'Send Reset Link'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--fg-muted)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  marginTop: '4px',
                }}
              >
                ← Back to Sign In
              </button>
            </form>
          </div>
        ) : (
          /* 3. MAIN SIGN IN / SIGN UP SCREEN */
          <>
            {/* Modal Header */}
            <div style={{ padding: '24px 24px 16px', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', marginBottom: '10px' }}>
                <span className="header__logo-badge" style={{ width: '38px', height: '38px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="13 17 18 12 13 7" />
                    <polyline points="6 17 11 12 6 7" />
                  </svg>
                </span>
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--fg)', margin: 0 }}>
                {mode === 'signup' ? 'Create your Toolwala Account' : 'Welcome back'}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--fg-muted)', marginTop: '6px', marginBottom: 0 }}>
                {mode === 'signup'
                  ? 'Sign up with email to activate your cloud profile'
                  : 'Sign in to access your account'}
              </p>
            </div>

            {/* Segmented Tabs: Sign In / Create Account */}
            <div
              style={{
                display: 'flex',
                margin: '0 24px 16px',
                backgroundColor: 'var(--bg-muted)',
                padding: '3px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-hairline)',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                style={{
                  flex: 1,
                  padding: '7px 0',
                  border: 'none',
                  borderRadius: 'calc(var(--radius-md) - 2px)',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backgroundColor: mode === 'signin' ? 'var(--bg-card)' : 'transparent',
                  color: mode === 'signin' ? 'var(--fg)' : 'var(--fg-muted)',
                  boxShadow: mode === 'signin' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                style={{
                  flex: 1,
                  padding: '7px 0',
                  border: 'none',
                  borderRadius: 'calc(var(--radius-md) - 2px)',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backgroundColor: mode === 'signup' ? 'var(--bg-card)' : 'transparent',
                  color: mode === 'signup' ? 'var(--fg)' : 'var(--fg-muted)',
                  boxShadow: mode === 'signup' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                Sign Up
              </button>
            </div>

            {/* Content Container */}
            <div style={{ padding: '0 24px 24px' }}>
              {/* OAuth Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <button
                  type="button"
                  onClick={() => handleOAuth('google')}
                  disabled={loading}
                  className="btn btn-outline"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '9px 12px',
                    fontSize: '13px',
                    fontWeight: '550',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.57.38-2.27V6.58H1.25A11.95 11.95 0 0 0 0 12c0 1.92.45 3.74 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  Google
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuth('github')}
                  disabled={loading}
                  className="btn btn-outline"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '9px 12px',
                    fontSize: '13px',
                    fontWeight: '550',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.607.069-.607 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  GitHub
                </button>
              </div>

              {/* Divider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  margin: '16px 0',
                  color: 'var(--fg-muted)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-hairline)' }} />
                <span>or continue with email</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-hairline)' }} />
              </div>

              {/* Error & Success Alerts */}
              {errorMsg && (
                <div
                  style={{
                    marginBottom: '12px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: '#ef4444',
                    fontSize: '12px',
                    lineHeight: 1.4,
                  }}
                >
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div
                  style={{
                    marginBottom: '12px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.25)',
                    color: '#22c55e',
                    fontSize: '12px',
                    lineHeight: 1.4,
                  }}
                >
                  {successMsg}
                </div>
              )}

              {/* Form: Sign In vs Sign Up */}
              <form
                onSubmit={mode === 'signup' ? handleSignUp : handleSignIn}
                style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                {mode === 'signup' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--fg)', marginBottom: '6px' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        fontSize: '13px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-hairline)',
                        backgroundColor: 'var(--bg-input)',
                        color: 'var(--fg)',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--fg)', marginBottom: '6px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      fontSize: '13px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-hairline)',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--fg)',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--fg)', margin: 0 }}>
                      Password
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setErrorMsg('');
                          setSuccessMsg('');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#3b82f6',
                          fontSize: '11px',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 36px 9px 12px',
                        fontSize: '13px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-hairline)',
                        backgroundColor: 'var(--bg-input)',
                        color: 'var(--fg)',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--fg-muted)',
                        cursor: 'pointer',
                        padding: '2px',
                        display: 'flex',
                      }}
                    >
                      {showPassword ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {mode === 'signup' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--fg)', marginBottom: '6px' }}>
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        fontSize: '13px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-hairline)',
                        backgroundColor: 'var(--bg-input)',
                        color: 'var(--fg)',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{
                    marginTop: '6px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    fontWeight: '600',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {loading ? (
                    <>
                      <span
                        style={{
                          width: '14px',
                          height: '14px',
                          border: '2px solid currentColor',
                          borderTopColor: 'transparent',
                          borderRadius: '50%',
                          display: 'inline-block',
                          animation: 'spin 0.6s linear infinite',
                        }}
                      />
                      <span>Processing...</span>
                    </>
                  ) : mode === 'signup' ? (
                    'Register with Email'
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
