import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function UserMenu({ onOpenAuth }) {
  const { user, profile, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <button
        type="button"
        onClick={onOpenAuth}
        className="btn btn-outline"
        style={{
          padding: '6px 13px',
          fontSize: '12px',
          fontWeight: '600',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          border: '1px solid var(--border-hairline)',
          backgroundColor: 'var(--bg-card)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span>Sign In</span>
      </button>
    );
  }

  const displayName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    'User';
  const initial = displayName.charAt(0).toUpperCase();
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;
  const tier = profile?.tier || 'Free Tier';

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: '1px solid var(--border-hairline)',
          borderRadius: '9999px',
          padding: '2px 8px 2px 2px',
          cursor: 'pointer',
          color: 'var(--fg)',
          backgroundColor: 'var(--bg-card)',
          transition: 'all 0.15s ease',
        }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '700',
            }}
          >
            {initial}
          </div>
        )}
        <span style={{ fontSize: '12px', fontWeight: '550', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayName}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '240px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-hairline)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            zIndex: 100,
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            animation: 'fadeIn 0.1s ease',
          }}
        >
          {/* User Info Header */}
          <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-hairline)', marginBottom: '4px' }}>
            <div style={{ fontSize: '13px', fontWeight: '650', color: 'var(--fg)' }}>{displayName}</div>
            <div style={{ fontSize: '11px', color: 'var(--fg-muted)', wordBreak: 'break-all', marginTop: '2px' }}>
              {user.email}
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '6px',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                color: '#22c55e',
                fontSize: '10px',
                fontWeight: '600',
                textTransform: 'capitalize',
              }}
            >
              <span>●</span> {tier}
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--border-hairline)', margin: '4px 0' }} />

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={() => {
              setDropdownOpen(false);
              logout();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#ef4444',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
