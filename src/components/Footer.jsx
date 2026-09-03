import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="header__logo" aria-label="Toolwala Home">
              <span className="header__logo-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="13 17 18 12 13 7" />
                  <polyline points="6 17 11 12 6 7" />
                </svg>
              </span>
              <span className="header__logo-text">Toolwala</span>
            </Link>
            <p>
              The fastest and most secure in-browser utility suite. Convert, merge, split, compress, and edit documents, images, videos, audio, and view official exam requirements 100% locally.
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-glow" style={{ fontSize: '11px', color: '#22c55e', borderColor: 'rgba(34, 197, 94, 0.3)' }}>
                ● 100% Client-Side Privacy
              </span>
            </div>
          </div>

          <div className="footer__columns">
            <div className="footer__column">
              <div className="footer__column-title">Tools</div>
              <ul>
                <li><Link to="/exams">Exam Specs 🎯</Link></li>
                <li><Link to="/tools/pdf">PDF Tools</Link></li>
                <li><Link to="/tools/image">Image Tools</Link></li>
                <li><Link to="/tools/video">Video Tools</Link></li>
                <li><Link to="/tools/audio">Audio Tools</Link></li>
                <li><Link to="/tools/document">Document Tools</Link></li>
              </ul>
            </div>

            <div className="footer__column">
              <div className="footer__column-title">Popular</div>
              <ul>
                <li><Link to="/tool/pdf-merge">Merge PDF</Link></li>
                <li><Link to="/tool/pdf-split">Split PDF</Link></li>
                <li><Link to="/tool/image-convert">Convert Image</Link></li>
                <li><Link to="/tool/pdf-compress">Compress PDF</Link></li>
                <li><Link to="/tool/image-resize">Resize Image</Link></li>
                <li><Link to="/tool/video-trim">Trim Video</Link></li>
              </ul>
            </div>

            <div className="footer__column">
              <div className="footer__column-title">Features</div>
              <ul>
                <li><Link to="/tools">All Tools</Link></li>
                <li><Link to="/exams">Exam Directory</Link></li>
                <li><a href="#privacy">Zero File Storage</a></li>
                <li><a href="#security">Local Memory Execution</a></li>
              </ul>
            </div>

            <div className="footer__column">
              <div className="footer__column-title">Project</div>
              <ul>
                <li><a href="https://github.com/Jalaj1973/Toolwala" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
                <li><a href="https://github.com/Jalaj1973/Toolwala/issues" target="_blank" rel="noopener noreferrer">Report Issue</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span className="footer__copyright">© {year} Toolwala. Built with React & Vite.</span>
          <div className="footer__links">
            <a href="https://github.com/Jalaj1973/Toolwala" target="_blank" rel="noopener noreferrer">
              Open Source
            </a>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
