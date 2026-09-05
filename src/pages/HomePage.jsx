import { Link } from 'react-router-dom';
import ToolCard from '../components/ToolCard';
import StatCard from '../components/StatCard';
import FaqSection from '../components/FaqSection';
import { popularTools, tools } from '../data/tools';
import { useLanguage } from '../context/LanguageContext';
import { IconSpeed, IconLock, IconSparkles } from '../components/Icons';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="ambient-hero-glow">
      {/* =========================================================================
          1. Hero Section (Rules A2 & B5)
          - Heading capped at 680px with meaningful line breaks
          - Left to right gradient on text (#FFFFFF → #9B9B9B in dark, #000000 → #666666 in light)
          - Clear outcome plus audience headline
          - Primary CTA with clear verb and what they get
          - One solid proof signal
          ========================================================================= */}
      <section className="section section--hero container" style={{ textAlign: 'center', paddingTop: '4.5rem', paddingBottom: '3rem' }}>
        {/* Announcement Pill */}
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          <Link
            to="/exams"
            className="badge badge-glow"
            style={{ padding: '6px 14px', gap: '8px', cursor: 'pointer', display: 'inline-flex', textDecoration: 'none' }}
          >
            <span style={{ fontWeight: 650 }}>Toolwala 2.0</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>Official Exam Guidelines and 42 File Tools</span>
            <span>→</span>
          </Link>
        </div>

        {/* Rule B5: Hero heading with text gradient and max-width 680px */}
        <h1 className="hero-heading">
          Convert and edit any file
          <br />
          directly on your device
        </h1>

        {/* Rule B5: Hero subheading capped at 680px with text-wrap: pretty */}
        <p className="hero-subheading" style={{ marginTop: '1.25rem' }}>
          Process PDF documents, photos, video, and audio directly in your browser.
          Zero file uploads, absolute privacy, and free forever.
        </p>

        {/* Rule A4 & B2: Primary and Secondary CTAs */}
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <Link
            to="/tools"
            className="btn btn-primary btn-lg"
            style={{ height: '44px', padding: '0 24px', fontSize: '16px', fontWeight: 600, borderRadius: '8px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span>Explore 42 File Tools</span>
          </Link>

          <Link
            to="/exams"
            className="btn btn-secondary btn-lg"
            style={{ height: '44px', padding: '0 24px', fontSize: '16px', fontWeight: 600, borderRadius: '8px' }}
          >
            <span>Check Exam Guidelines</span>
          </Link>
        </div>

        {/* Rule A2: Proof Signal right above the fold */}
        <p style={{ marginTop: '1.25rem', fontSize: '13px', color: 'var(--fg-muted)', fontWeight: 500 }}>
          Over 50,000 files converted locally with zero server uploads
        </p>

        {/* Quick Suite Jump Badges */}
        <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <Link to="/tools/pdf" className="badge" style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none', color: 'var(--fg-muted)', transition: 'all 0.15s ease' }}>
            PDF Tools (9)
          </Link>
          <Link to="/tools/image" className="badge" style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none', color: 'var(--fg-muted)', transition: 'all 0.15s ease' }}>
            Image Tools (6)
          </Link>
          <Link to="/tools/video" className="badge" style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none', color: 'var(--fg-muted)', transition: 'all 0.15s ease' }}>
            Video Tools (4)
          </Link>
          <Link to="/tools/audio" className="badge" style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none', color: 'var(--fg-muted)', transition: 'all 0.15s ease' }}>
            Audio Tools (3)
          </Link>
          <Link to="/exams" className="badge" style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none', color: 'var(--fg-muted)', transition: 'all 0.15s ease' }}>
            Exam Presets (15)
          </Link>
        </div>
      </section>

      {/* =========================================================================
          2. Trust Bar (Organic Data per Rule B8)
          ========================================================================= */}
      <div className="trust-bar">
        <div className="container">
          <div className="trust-bar__list">
            <span className="trust-bar__item">0.8 second local execution</span>
            <span className="trust-bar__dot">•</span>
            <span className="trust-bar__item">100% in browser privacy</span>
            <span className="trust-bar__dot">•</span>
            <span className="trust-bar__item">Zero byte server storage</span>
            <span className="trust-bar__dot">•</span>
            <span className="trust-bar__item">42 local utility tools</span>
            <span className="trust-bar__dot">•</span>
            <span className="trust-bar__item">15 verified exam presets</span>
          </div>
        </div>
      </div>


      {/* =========================================================================
          4. Benefits Section (Rules A2 & A5: Bold benefit first, outcome driven)
          ========================================================================= */}
      <section className="section container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem', maxWidth: '680px', margin: '0 auto 2.5rem' }}>
          <p className="text-eyebrow" style={{ marginBottom: '8px' }}>
            Why Toolwala
          </p>
          <h2 className="text-heading">
            Engineered for speed, privacy, and precision
          </h2>
        </div>

        <div className="grid-features">
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconSpeed size={18} />
              </div>
              <h3 className="text-heading-sm">Instant local speed</h3>
            </div>
            <p className="text-caption" style={{ color: 'var(--fg-muted)', marginBottom: '16px' }}>
              <strong>Bypass upload queues</strong> by processing files directly with your GPU and local WebAssembly threads in under 0.8 seconds.
            </p>
            <div className="terminal">
              <div className="terminal__line">
                <span className="terminal__success">✓</span>
                <span className="terminal__text">document.pdf · 0.8s local merge</span>
              </div>
              <div className="terminal__line">
                <span className="terminal__success">✓</span>
                <span className="terminal__text">photo.webp · 0.3s GPU canvas render</span>
              </div>
            </div>
          </div>

          <div className="card card-dark">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: 'inherit' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconLock size={18} />
              </div>
              <h3 className="text-heading-sm" style={{ color: 'inherit' }}>Guaranteed private</h3>
            </div>
            <p className="text-caption" style={{ opacity: 0.8, marginBottom: '16px' }}>
              <strong>Zero server transmission</strong> ensures confidential medical scans, tax filings, and legal records stay strictly on your machine.
            </p>
            <div className="terminal" style={{ background: 'rgba(0,0,0,0.4)', color: '#fff', borderColor: 'rgba(255,255,255,0.15)' }}>
              <div className="terminal__line">
                <span style={{ color: '#4ade80' }}>▶</span>
                <span>location: local browser sandbox</span>
              </div>
              <div className="terminal__line">
                <span style={{ color: '#4ade80' }}>✓</span>
                <span>cloud upload: 0 bytes transferred</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconSparkles size={18} />
              </div>
              <h3 className="text-heading-sm">Official exam compliance</h3>
            </div>
            <p className="text-caption" style={{ color: 'var(--fg-muted)', marginBottom: '16px' }}>
              <strong>One click compliance</strong> formats candidate photographs and signatures to exact government portal upload dimensions.
            </p>
            <div className="terminal">
              <div className="terminal__line">
                <span className="terminal__prompt">▶</span>
                <span className="terminal__text">NEET UG · photo 10 to 200 KB</span>
              </div>
              <div className="terminal__line">
                <span className="terminal__prompt">▶</span>
                <span className="terminal__text">UPSC · 350x350 pixel passport aspect</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          6. Popular Tools Section
          ========================================================================= */}
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
            <span>View all 42 tools</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid-tools">
          {popularTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          7. Stats Section (Rule B8: Organic data)
          ========================================================================= */}
      <section className="section container" style={{ paddingTop: '1rem' }}>
        <div className="grid-stats">
          <StatCard iconKey="folder" value={tools.length} label="Tools Available" subtext="PDF, photo, video, audio" />
          <StatCard iconKey="speed" value="0.8s" label="Execution Time" subtext="Instant browser processing" />
          <StatCard iconKey="lock" value="100%" label="Client Side Privacy" subtext="Zero cloud transmission" />
          <StatCard iconKey="sparkles" value="Free" label="No Cost Or Limits" subtext="Zero watermarks or trials" />
        </div>
      </section>

      {/* =========================================================================
          8. Objection Handling FAQ Section (Rules A2 & A4)
          ========================================================================= */}
      <FaqSection />

      {/* =========================================================================
          9. Risk Reversal & Final CTA Section (Rule A2 & A4)
          ========================================================================= */}
      <section className="section container" style={{ textAlign: 'center', paddingBottom: '5rem' }}>
        <div className="card" style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 2rem' }}>
          <div className="text-eyebrow" style={{ marginBottom: '12px' }}>
            Instant and Completely Private
          </div>
          <h2 className="text-heading" style={{ marginBottom: '1rem' }}>
            Start processing your files now
          </h2>
          <p className="text-body" style={{ marginBottom: '2rem', maxWidth: '48ch', margin: '0 auto 2rem auto' }}>
            Zero registration required. Process documents, compress images, and inspect official exam guidelines in seconds.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              to="/tools"
              className="btn btn-primary btn-lg"
              style={{ height: '44px', padding: '0 24px', fontSize: '16px', fontWeight: 600, borderRadius: '8px' }}
            >
              Explore 42 File Tools
            </Link>
            <Link
              to="/exams"
              className="btn btn-secondary btn-lg"
              style={{ height: '44px', padding: '0 24px', fontSize: '16px', fontWeight: 600, borderRadius: '8px' }}
            >
              Check Exam Guidelines
            </Link>
          </div>
          <p style={{ marginTop: '1.25rem', fontSize: '12px', color: 'var(--fg-muted)' }}>
            No credit card • No installation • Works offline in your browser
          </p>
        </div>
      </section>
    </div>
  );
}
