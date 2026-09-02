import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="header__logo" aria-label="Toolwala Home">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ shapeRendering: 'geometricPrecision' }}>
                <path d="M3.5 4.5 L11 12 L3.5 19.5" stroke="currentColor" strokeWidth="3.4" strokeLinecap="square" />
                <path d="M13 4.5 L20.5 12 L13 19.5" stroke="currentColor" strokeWidth="3.4" strokeLinecap="square" />
              </svg>
              <span className="header__logo-text">Toolwala</span>
            </Link>
            <p>
              Toolwala is the fastest and most secure file operations platform. Merge, split, convert, and compress
              documents, images, videos, audio files, and view official exam specifications — all processed locally in your browser.
            </p>
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
                <li><Link to="/tools/document">Document</Link></li>
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
                <li><a href="#privacy">Privacy First</a></li>
                <li><a href="#security">Client-Side</a></li>
              </ul>
            </div>

            <div className="footer__column">
              <div className="footer__column-title">About</div>
              <ul>
                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                <li><a href="#privacy">Privacy</a></li>
                <li><a href="#terms">Terms</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span className="footer__copyright">© {year} Toolwala. All rights reserved.</span>
          <div className="footer__links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
