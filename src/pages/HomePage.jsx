import { Link } from 'react-router-dom';
import FileDropzone from '../components/FileDropzone';
import ToolCard from '../components/ToolCard';
import StatCard from '../components/StatCard';
import { popularTools, tools } from '../data/tools';
import { useLanguage } from '../context/LanguageContext';
import { IconSpeed, IconLock, IconSparkles } from '../components/Icons';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div>
      {/* Hero Section */}
      <section className="section section--hero container">
        <div className="grid-2col">
          <div style={{ paddingTop: '1.5rem' }}>
            <div className="text-eyebrow" style={{ marginBottom: '12px' }}>
              {t('badge')}
            </div>
            <h1 className="text-heading-lg" style={{ textBalance: 'balance' }}>
              {t('heroTitle')}
            </h1>
            <p className="text-body" style={{ marginTop: '1.25rem', maxWidth: '48ch' }}>
              {t('heroDesc')}
            </p>
            <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <Link to="/tools" className="btn btn-primary btn-lg">
                {t('exploreTools')}
              </Link>
              <a href="#popular-tools" className="btn btn-secondary btn-lg">
                {t('popularTools')}
              </a>
            </div>
          </div>

          <div style={{ width: '100%' }}>
            <FileDropzone />
          </div>
        </div>
      </section>

      {/* Rainbow Divider */}
      <div className="container">
        <div className="rainbow-divider" />
      </div>

      {/* Trust Bar */}
      <div className="trust-bar">
        <div className="container">
          <div className="trust-bar__list">
            <span className="trust-bar__item">{t('trust1')}</span>
            <span className="trust-bar__dot">•</span>
            <span className="trust-bar__item">{t('trust2')}</span>
            <span className="trust-bar__dot">•</span>
            <span className="trust-bar__item">{t('trust3')}</span>
            <span className="trust-bar__dot">•</span>
            <span className="trust-bar__item">{t('trust4')}</span>
            <span className="trust-bar__dot">•</span>
            <span className="trust-bar__item">{t('trust5')}</span>
          </div>
        </div>
      </div>

      {/* Feature Cards Section */}
      <section className="section container">
        <div className="grid-features">
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <IconSpeed size={20} />
              <h3 className="text-heading-sm">{t('fastTitle')}</h3>
            </div>
            <p className="text-caption" style={{ color: 'var(--fg-muted)', marginBottom: '16px' }}>
              {t('fastDesc')}
            </p>
            <div className="terminal">
              <div className="terminal__line">
                <span className="terminal__success">✓</span>
                <span className="terminal__text">document.pdf · 0.8s</span>
              </div>
              <div className="terminal__line">
                <span className="terminal__success">✓</span>
                <span className="terminal__text">photo.webp · 0.3s</span>
              </div>
            </div>
          </div>

          <div className="card card-dark">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'inherit' }}>
              <IconLock size={20} />
              <h3 className="text-heading-sm" style={{ color: 'inherit' }}>{t('secureTitle')}</h3>
            </div>
            <p className="text-caption text-muted" style={{ marginBottom: '16px' }}>
              {t('secureDesc')}
            </p>
            <div className="terminal" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
              <div className="terminal__line">
                <span style={{ color: '#4ade80' }}>▶</span>
                <span>location: local browser</span>
              </div>
              <div className="terminal__line">
                <span style={{ color: '#4ade80' }}>✓</span>
                <span>network uploads: 0 bytes</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <IconSparkles size={20} />
              <h3 className="text-heading-sm">{t('toolsTitle')}</h3>
            </div>
            <p className="text-caption" style={{ color: 'var(--fg-muted)', marginBottom: '16px' }}>
              {t('toolsDesc')}
            </p>
            <div className="terminal">
              <div className="terminal__line">
                <span className="terminal__prompt">▶</span>
                <span className="terminal__text">docx → pdf</span>
              </div>
              <div className="terminal__line">
                <span className="terminal__prompt">▶</span>
                <span className="terminal__text">heic → jpg</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section id="popular-tools" className="section container" style={{ paddingTop: 0 }}>
        <div className="text-eyebrow" style={{ marginBottom: '12px' }}>
          {t('mostUsed')}
        </div>
        <h2 className="text-heading" style={{ marginBottom: '8px' }}>
          {t('popularHeading')}
        </h2>
        <p className="text-body" style={{ marginBottom: '2rem', maxWidth: '60ch' }}>
          {t('popularSub')}
        </p>

        <div className="grid-tools">
          {popularTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="section container">
        <div className="grid-stats">
          <StatCard iconKey="folder" value={tools.length} label={t('statsTools')} subtext="PDF, Image, Video, Audio" />
          <StatCard iconKey="speed" value="< 1s" label={t('statsTime')} subtext="Instant local execution" />
          <StatCard iconKey="lock" value="100%" label={t('statsPrivacy')} subtext="No file uploads required" />
          <StatCard iconKey="sparkles" value="Free" label={t('statsFree')} subtext="No limits or watermarks" />
        </div>
      </section>

      {/* Ready CTA Section */}
      <section className="section container" style={{ textAlign: 'center' }}>
        <div className="text-eyebrow" style={{ marginBottom: '12px' }}>
          {t('badge')}
        </div>
        <h2 className="text-heading" style={{ marginBottom: '1.5rem' }}>
          {t('readyTitle')}
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <Link to="/tools" className="btn btn-primary btn-lg">
            {t('browseAll')}
          </Link>
        </div>
      </section>
    </div>
  );
}
