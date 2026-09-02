import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSelector() {
  const { lang, setLang, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLangObj = languages.find((l) => l.code === lang) || languages[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        className="theme-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change Language"
        title="Change Language"
        style={{
          width: 'auto',
          padding: '0 10px',
          gap: '6px',
          fontSize: '13px',
          fontWeight: 500,
        }}
      >
        <span>🌐</span>
        <span>{currentLangObj.nativeName}</span>
        <span style={{ fontSize: '10px', opacity: 0.6 }}>▼</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            zIndex: 100,
            minWidth: '160px',
            maxHeight: '280px',
            overflowY: 'auto',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-hairline)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-overlay)',
            padding: '4px',
          }}
        >
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                border: 'none',
                background: lang === l.code ? 'rgba(0,0,0,0.06)' : 'transparent',
                color: 'var(--fg)',
                fontSize: '13px',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span>{l.nativeName}</span>
              <span style={{ fontSize: '11px', color: 'var(--fg-faint)' }}>{l.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
