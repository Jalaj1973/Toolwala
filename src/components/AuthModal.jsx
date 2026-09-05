import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showConfigNotice, setShowConfigNotice] = useState(false);

  const { loginWithEmail, registerWithEmail, loginWithOAuth, isConfigured } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setSuccessMsg('');
      setLoading(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please provide both email and password');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isSignUp) {
        const { error } = await registerWithEmail(email, password);
        if (error) {
          setErrorMsg(error.message);
        } else {
          setSuccessMsg(
            isConfigured
              ? 'Account created! Please check your email to confirm your registration.'
              : 'Demo account created successfully! You are now signed in.'
          );
          if (!isConfigured) {
            setTimeout(() => onClose(), 1200);
          }
        }
      } else {
        const { error } = await loginWithEmail(email, password);
        if (error) {
          setErrorMsg(error.message);
        } else {
          setSuccessMsg('Welcome back! Signed in successfully.');
          setTimeout(() => onClose(), 800);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { error } = await loginWithOAuth(provider);
      if (error) {
        setErrorMsg(error.message);
      } else if (!isConfigured) {
        setSuccessMsg(`Signed in with ${provider} (Demo Mode)`);
        setTimeout(() => onClose(), 800);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to authenticate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
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
          maxWidth: '420px',
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

        {/* Modal Header */}
        <div style={{ padding: '24px 24px 16px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', marginBottom: '12px' }}>
            <span className="header__logo-badge" style={{ width: '38px', height: '38px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="13 17 18 12 13 7" />
                <polyline points="6 17 11 12 6 7" />
              </svg>
            </span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--fg)', margin: 0 }}>
            {isSignUp ? 'Create your Toolwala Account' : 'Welcome back to Toolwala'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--fg-muted)', marginTop: '6px', marginBottom: 0 }}>
            {isSignUp
              ? 'Sign up to sync your presets and access cloud features'
              : 'Sign in to access your saved presets and tools'}
          </p>
        </div>

        {/* Supabase Config Notice Banner (if anon key missing) */}
        {!isConfigured && (
          <div
            style={{
              margin: '0 24px 12px',
              padding: '10px 12px',
              backgroundColor: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              color: 'var(--fg-muted)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: '600', color: '#3b82f6' }}>⚡ Supabase Connected (qqxydjgy...)</span>
              <button
                type="button"
                onClick={() => setShowConfigNotice((p) => !p)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  cursor: 'pointer',
                  fontSize: '11px',
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >
                {showConfigNotice ? 'Hide' : 'Info'}
              </button>
            </div>
            {showConfigNotice && (
              <p style={{ margin: '6px 0 0', lineHeight: 1.4 }}>
                Your project ref is set! To enable live auth, add your <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env</code>. Until then, you can use the form or social buttons in <strong>Demo Mode</strong>.
              </p>
            )}
          </div>
        )}

        {/* Tabs: Sign In / Sign Up */}
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
              setIsSignUp(false);
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
              backgroundColor: !isSignUp ? 'var(--bg-card)' : 'transparent',
              color: !isSignUp ? 'var(--fg)' : 'var(--fg-muted)',
              boxShadow: !isSignUp ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
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
              backgroundColor: isSignUp ? 'var(--bg-card)' : 'transparent',
              color: isSignUp ? 'var(--fg)' : 'var(--fg-muted)',
              boxShadow: isSignUp ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Create Account
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '0 24px 24px' }}>
          {/* Social OAuth Buttons */}
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
            <span>or with email</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-hairline)' }} />
          </div>

          {/* Error & Success Messages */}
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

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--fg)',
                  marginBottom: '6px',
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
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
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--fg)',
                  marginBottom: '6px',
                }}
              >
                Password
              </label>
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
              ) : isSignUp ? (
                'Create Free Account'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Privacy Note */}
          <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '11px', color: 'var(--fg-muted)' }}>
            Toolwala runs conversions locally in your browser.
            <br />
            No uploaded files or documents are ever sent to external servers.
          </div>
        </div>
      </div>
    </div>
  );
}
