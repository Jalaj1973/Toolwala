import { Link } from 'react-router-dom';
import ToolCard from '../components/ToolCard';
import StatCard from '../components/StatCard';
import { popularTools, tools } from '../data/tools';
import { useLanguage } from '../context/LanguageContext';
import { IconSpeed, IconLock, IconSparkles } from '../components/Icons';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="ambient-hero-glow">
      {/* Hero Section - Centered & Focused without ambiguous dropzone */}
      <section className="section section--hero container" style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto', padding: '4.5rem 1.5rem 3rem' }}>
        {/* Announcement Badge */}
        <div style={{ marginBottom: '18px', display: 'flex', justifyContent: 'center' }}>
          <Link
            to="/exams"
            className="badge badge-glow"
            style={{ padding: '6px 14px', gap: '8px', cursor: 'pointer', display: 'inline-flex', textDecoration: 'none' }}
          >
            <span style={{ fontWeight: 650 }}>✨ Toolwala 2.0</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>Official Exam Specs & 42+ File Tools</span>
            <span>→</span>
          </Link>
        </div>

        <h1 className="text-heading-lg" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.25rem)', lineHeight: '1.15', letterSpacing: '-0.035em', textBalance: 'balance', margin: '0 auto' }}>
          {t('heroTitle')}
        </h1>

        <p className="text-body" style={{ marginTop: '1.25rem', maxWidth: '54ch', margin: '1.25rem auto 0', fontSize: '1.0625rem', color: 'var(--fg-muted)', lineHeight: '1.6' }}>
          {t('heroDesc')}
        </p>

        <div style={{ marginTop: '2.25rem', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <Link to="/tools" className="btn btn-primary btn-lg" style={{ height: '44px', padding: '0 22px', fontSize: '14px', borderRadius: '10px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span>{t('exploreTools')}</span>
          </Link>

          <Link to="/exams" className="btn btn-secondary btn-lg" style={{ height: '44px', padding: '0 22px', fontSize: '14px', borderRadius: '10px' }}>
            <span>Exam Specs</span>
          </Link>
        </div>

        {/* Quick Suite Jump Links */}
        <div style={{ marginTop: '2.25rem', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <Link to="/tools/pdf" className="badge" style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none', color: 'var(--fg-muted)', transition: 'all 0.15s ease' }}>
            📄 PDF Tools (9)
          </Link>
          <Link to="/tools/image" className="badge" style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none', color: 'var(--fg-muted)', transition: 'all 0.15s ease' }}>
            🖼️ Image Tools (6)
          </Link>
          <Link to="/tools/video" className="badge" style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none', color: 'var(--fg-muted)', transition: 'all 0.15s ease' }}>
            🎬 Video Tools (4)
          </Link>
          <Link to="/tools/audio" className="badge" style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none', color: 'var(--fg-muted)', transition: 'all 0.15s ease' }}>
            🎵 Audio Tools (3)
          </Link>
        </div>
      </section>

      {/* Trust Strip */}
      <div className="trust-bar">
        <div className="container">
          <div className="trust-bar__list">
            <span className="trust-bar__item">⚡ {t('trust1')}</span>
            <span className="trust-bar__dot">•</span>
            <span className="trust-bar__item">🔒 {t('trust2')}</span>
            <span className="trust-bar__dot">•</span>
            <span className="trust-bar__item">🌐 {t('trust3')}</span>
            <span className="trust-bar__dot">•</span>
            <span className="trust-bar__item">🛡️ {t('trust4')}</span>
            <span className="trust-bar__dot">•</span>
            <span className="trust-bar__item">🎯 {t('trust5')}</span>
          </div>
        </div>
      </div>

      {/* Bento Feature Cards Section */}
      <section className="section container" style={{ paddingTop: '1rem' }}>
        <div className="grid-features">
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconSpeed size={18} />
              </div>
              <h3 className="text-heading-sm">{t('fastTitle')}</h3>
            </div>
            <p className="text-caption" style={{ color: 'var(--fg-muted)', marginBottom: '16px' }}>
              {t('fastDesc')}
            </p>
            <div className="terminal">
              <div className="terminal__line">
                <span className="terminal__success">✓</span>
                <span className="terminal__text">document.pdf · 0.8s local execution</span>
              </div>
              <div className="terminal__line">
                <span className="terminal__success">✓</span>
                <span className="terminal__text">photo.webp · 0.3s GPU canvas render</span>
              </div>
            </div>
          </div>

          <div className="card card-dark">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: 'inherit' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconLock size={18} />
              </div>
              <h3 className="text-heading-sm" style={{ color: 'inherit' }}>{t('secureTitle')}</h3>
            </div>
            <p className="text-caption" style={{ opacity: 0.8, marginBottom: '16px' }}>
              {t('secureDesc')}
            </p>
            <div className="terminal" style={{ background: 'rgba(0,0,0,0.4)', color: '#fff', borderColor: 'rgba(255,255,255,0.15)' }}>
              <div className="terminal__line">
                <span style={{ color: '#4ade80' }}>▶</span>
                <span>location: local browser memory</span>
              </div>
              <div className="terminal__line">
                <span style={{ color: '#4ade80' }}>✓</span>
                <span>network transmission: 0 bytes</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconSparkles size={18} />
              </div>
              <h3 className="text-heading-sm">{t('toolsTitle')}</h3>
            </div>
            <p className="text-caption" style={{ color: 'var(--fg-muted)', marginBottom: '16px' }}>
              {t('toolsDesc')}
            </p>
            <div className="terminal">
              <div className="terminal__line">
                <span className="terminal__prompt">▶</span>
                <span className="terminal__text">docx → pdf (mammoth)</span>
              </div>
              <div className="terminal__line">
                <span className="terminal__prompt">▶</span>
                <span className="terminal__text">audio.mp3 → wav (web-audio)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section id="popular-tools" className="section container" style={{ paddingTop: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div className="text-eyebrow" style={{ marginBottom: '8px' }}>
              {t('mostUsed')}
            </div>
            <h2 className="text-heading">
              {t('popularHeading')}
            </h2>
            <p className="text-body" style={{ marginTop: '4px', maxWidth: '60ch' }}>
              {t('popularSub')}
            </p>
          </div>
          <Link to="/tools" className="btn btn-outline btn-sm">
            <span>View all 42+ tools</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid-tools">
          {popularTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="section container" style={{ paddingTop: '1rem' }}>
        <div className="grid-stats">
          <StatCard iconKey="folder" value={tools.length} label={t('statsTools')} subtext="PDF, Image, Video, Audio" />
          <StatCard iconKey="speed" value="< 1s" label={t('statsTime')} subtext="Instant local execution" />
          <StatCard iconKey="lock" value="100%" label={t('statsPrivacy')} subtext="No file uploads required" />
          <StatCard iconKey="sparkles" value="Free" label={t('statsFree')} subtext="No limits or watermarks" />
        </div>
      </section>

      {/* Ready CTA Section */}
      <section className="section container" style={{ textAlign: 'center', paddingBottom: '5rem' }}>
        <div className="card" style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 2rem' }}>
          <div className="text-eyebrow" style={{ marginBottom: '12px' }}>
            ⚡ Instant & Private
          </div>
          <h2 className="text-heading" style={{ marginBottom: '1rem' }}>
            {t('readyTitle')}
          </h2>
          <p className="text-body" style={{ marginBottom: '2rem', maxWidth: '44ch', margin: '0 auto 2rem auto' }}>
            Transform documents, images, and media files directly in your web browser with zero wait times.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/tools" className="btn btn-primary btn-lg">
              {t('browseAll')}
            </Link>
            <Link to="/exams" className="btn btn-secondary btn-lg">
              Check Exam Guidelines
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
