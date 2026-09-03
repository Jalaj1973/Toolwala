import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import SearchModal from './SearchModal';
import { useLanguage } from '../context/LanguageContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { t } = useLanguage();

  // Keyboard shortcut Cmd+K / Ctrl+K for search
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="header">
        <div className="header__inner">
          {/* Brand Logo */}
          <Link to="/" className="header__logo" aria-label="Toolwala Home">
            <span className="header__logo-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="13 17 18 12 13 7" />
                <polyline points="6 17 11 12 6 7" />
              </svg>
            </span>
            <span className="header__logo-text">Toolwala</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="header__nav" aria-label="Primary navigation">
            <NavLink
              to="/exams"
              className={({ isActive }) =>
                `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
              }
            >
              <span>Exam Specs</span>
              <span className="badge badge-glow" style={{ fontSize: '10px', padding: '1px 6px' }}>
                🎯 15
              </span>
            </NavLink>
            <NavLink
              to="/tools"
              className={({ isActive }) =>
                `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
              }
            >
              {t('allTools')}
            </NavLink>
            <NavLink
              to="/tools/pdf"
              className={({ isActive }) =>
                `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
              }
            >
              PDF
            </NavLink>
            <NavLink
              to="/tools/image"
              className={({ isActive }) =>
                `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
              }
            >
              {t('categoryImage')}
            </NavLink>
            <NavLink
              to="/tools/video"
              className={({ isActive }) =>
                `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
              }
            >
              {t('categoryVideo')}
            </NavLink>
            <NavLink
              to="/tools/audio"
              className={({ isActive }) =>
                `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
              }
            >
              {t('categoryAudio')}
            </NavLink>
          </nav>

          {/* Action Tools */}
          <div className="header__actions">
            {/* Shadcn Command Search Trigger */}
            <button
              className="search-trigger-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search tools (⌘K)"
              title="Quick Search (⌘K)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span style={{ fontSize: '12px' }}>Search...</span>
              <span className="kbd-badge">⌘K</span>
            </button>

            {/* Language Selector Popover */}
            <LanguageSelector />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* GitHub Link */}
            <a
              href="https://github.com/Jalaj1973/Toolwala"
              target="_blank"
              rel="noopener noreferrer"
              className="theme-toggle"
              aria-label="View on GitHub"
              title="GitHub"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.607.069-.607 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              className="header__mobile-toggle"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Global Command Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Drawer Navigation */}
      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`} onClick={() => setMenuOpen(false)}>
        <div className="mobile-menu__drawer" onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '650' }}>
              <span className="header__logo-badge" style={{ width: '28px', height: '28px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="13 17 18 12 13 7" />
                  <polyline points="6 17 11 12 6 7" />
                </svg>
              </span>
              <span>Toolwala</span>
            </div>
            <button className="theme-toggle" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              ✕
            </button>
          </div>

          <nav className="mobile-menu__nav">
            <Link to="/exams" className="mobile-menu__link" onClick={() => setMenuOpen(false)}>
              Exam Specs 🎯
            </Link>
            <Link to="/tools" className="mobile-menu__link" onClick={() => setMenuOpen(false)}>
              {t('allTools')}
            </Link>
            <Link to="/tools/pdf" className="mobile-menu__link" onClick={() => setMenuOpen(false)}>
              PDF Tools
            </Link>
            <Link to="/tools/image" className="mobile-menu__link" onClick={() => setMenuOpen(false)}>
              Image Tools
            </Link>
            <Link to="/tools/video" className="mobile-menu__link" onClick={() => setMenuOpen(false)}>
              Video Tools
            </Link>
            <Link to="/tools/audio" className="mobile-menu__link" onClick={() => setMenuOpen(false)}>
              Audio Tools
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
