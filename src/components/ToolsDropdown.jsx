import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function ToolsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const isToolsActive = location.pathname.startsWith('/tools') || location.pathname.startsWith('/tool/');

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const categories = [
    {
      id: 'pdf',
      name: 'PDF Tools',
      desc: 'Merge, Split, Compress & Convert',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      count: '9 Tools',
    },
    {
      id: 'image',
      name: 'Image Tools',
      desc: 'Convert, Compress, Crop & Resize',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
      count: '6 Tools',
    },
    {
      id: 'video',
      name: 'Video Tools',
      desc: 'Trim, Mute, Extract & Format',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      ),
      count: '4 Tools',
    },
    {
      id: 'audio',
      name: 'Audio Tools',
      desc: 'Trim, Convert & Extract Waveforms',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      ),
      count: '3 Tools',
    },
  ];

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        className={`header__nav-link ${isToolsActive || isOpen ? 'header__nav-link--active' : ''}`}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '6px 12px',
          whiteSpace: 'nowrap',
        }}
        aria-expanded={isOpen}
      >
        <span>Tools</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            opacity: 0.7,
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Translucent Glassmorphic Mega-Menu Popover */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            left: 0,
            width: '380px',
            backgroundColor: 'var(--bg-card)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid var(--border-hairline)',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-overlay)',
            padding: '10px',
            zIndex: 100,
            animation: 'fadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/tools/${cat.id}`}
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  color: 'var(--fg)',
                  backgroundColor: 'transparent',
                  border: '1px solid transparent',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                  e.currentTarget.style.borderColor = 'var(--border-hairline)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>{cat.icon}</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' }}>{cat.name}</span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--fg-muted)', lineHeight: '1.3' }}>
                  {cat.desc}
                </span>
              </Link>
            ))}
          </div>

          <div
            style={{
              marginTop: '8px',
              paddingTop: '8px',
              borderTop: '1px solid var(--border-hairline)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: '6px',
              paddingRight: '6px',
            }}
          >
            <Link
              to="/tools"
              onClick={() => setIsOpen(false)}
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--fg)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 6px',
                borderRadius: '6px',
              }}
            >
              <span>Explore all 24+ tools</span>
              <span style={{ fontSize: '14px' }}>→</span>
            </Link>
            <span style={{ fontSize: '11px', color: 'var(--fg-muted)' }}>100% Client-Side</span>
          </div>
        </div>
      )}
    </div>
  );
}
