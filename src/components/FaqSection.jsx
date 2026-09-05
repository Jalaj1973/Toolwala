import { useState } from 'react';

/**
 * FaqSection — Landing Page Design Objection Handling (Rules A2, A4, A7)
 *
 * Requirements:
 * - 6 to 12 questions addressing real customer objections.
 * - Written benefit-first with specific numbers.
 * - No hyphens in text (Rule B1).
 * - Plain question and answer form for AEO & SEO (Rule A7).
 */
export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Do my files ever get uploaded to an external server?',
      a: 'Never. All conversion and editing tools run exclusively in your browser using modern WebAssembly and JavaScript engines. Your files never leave your machine, guaranteeing absolute privacy and compliance with strict data protection standards.',
    },
    {
      q: 'Are the exam document specifications officially verified?',
      a: 'Yes. Every exam preset, including NEET UG, JEE Main, UPSC Civil Services, and GATE, is cross checked directly against the current year official candidate information bulletins published by NTA, UPSC, and IIT bodies.',
    },
    {
      q: 'What is the maximum file size I can process?',
      a: 'Because processing happens on your local hardware instead of a constrained cloud server, you can process large PDF documents and video files up to 2 GB with zero queue delays or server timeout errors.',
    },
    {
      q: 'Can I use Toolwala offline without an active internet connection?',
      a: 'Yes. Once the web application is loaded in your browser cache, the processing scripts execute locally on your device, allowing you to crop photos, merge PDFs, and trim audio even without network connectivity.',
    },
    {
      q: 'Do I need to create an account or provide payment information?',
      a: 'No account or credit card is required. You can access all 42 tools and exam presets immediately for free. Registered accounts are completely optional for users who want to sync preferences across sessions.',
    },
    {
      q: 'Will resizing degrade the quality of my photographs or signatures?',
      a: 'No. The image engine uses high fidelity bicubic interpolation and intelligent canvas compression to meet strict kilobyte ceilings while retaining sharp clarity for official verification.',
    },
    {
      q: 'Which file formats are supported across the suite?',
      a: 'The suite supports PDF documents, JPG, PNG, WebP, SVG rasterization, MP4, WebM, MOV, MP3, WAV, AAC, and DOCX documents with instant conversions.',
    },
    {
      q: 'How does local processing compare in speed to cloud converters?',
      a: 'Local processing is typically three to five times faster because you bypass the lengthy upload and download stages. A standard document merges in under 0.8 seconds directly inside your browser.',
    },
  ];

  return (
    <section className="section container" style={{ maxWidth: '820px', margin: '0 auto', paddingTop: '48px', paddingBottom: '64px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <p className="text-eyebrow" style={{ marginBottom: '12px' }}>
          Frequently Asked Questions
        </p>
        <h2 className="text-heading" style={{ fontSize: '32px', lineHeight: '38px' }}>
          Common Questions and Objections
        </h2>
        <p className="text-body" style={{ marginTop: '12px' }}>
          Everything you need to know about our local architecture, privacy guarantees, and exam presets.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              style={{
                border: '1px solid var(--border)',
                borderRadius: '12px',
                background: 'var(--bg-surface)',
                overflow: 'hidden',
                transition: 'border-color 0.2s cubic-bezier(0.32, 0.72, 0, 1)',
              }}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: 'var(--fg)',
                  fontSize: '15px',
                  fontWeight: 600,
                  gap: '12px',
                }}
                aria-expanded={isOpen}
              >
                <span>{faq.q}</span>
                <span
                  style={{
                    fontSize: '18px',
                    lineHeight: '1',
                    color: 'var(--fg-muted)',
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s cubic-bezier(0.32, 0.72, 0, 1)',
                    flexShrink: 0,
                  }}
                >
                  +
                </span>
              </button>

              {isOpen && (
                <div
                  style={{
                    padding: '0 20px 18px 20px',
                    fontSize: '14px',
                    lineHeight: '22px',
                    color: 'var(--fg-muted)',
                  }}
                >
                  <p style={{ margin: 0, textWrap: 'pretty' }}>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
