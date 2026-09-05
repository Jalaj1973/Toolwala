import { useEffect, useRef, useState } from 'react';

/**
 * TaglineReveal — Mandatory Landing Page Design Component (Rule B11)
 *
 * Requirements:
 * - Minimum two lines of text.
 * - Max-width capped at 680px with meaningful line breaks.
 * - Words start at 25-35% opacity.
 * - As the section scrolls into view, words activate one at a time in reading order.
 * - Uses custom cubic-bezier(0.32, 0.72, 0, 1) transition.
 * - Uses IntersectionObserver (no unthrottled scroll listener).
 */
export default function TaglineReveal({
  text = 'Your files never touch a remote server. Complete privacy and instant file conversions executed entirely on your device.',
}) {
  const containerRef = useRef(null);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);

  const words = text.split(' ');

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Create an observer that tracks scroll depth across the section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Ratio between 0.15 and 0.85 mapped to total words
            const ratio = Math.min(Math.max((entry.intersectionRatio - 0.15) / 0.7, 0), 1);
            const targetIndex = Math.floor(ratio * words.length);
            setActiveWordIndex(targetIndex);
          }
        });
      },
      {
        threshold: Array.from({ length: 30 }, (_, i) => i / 30),
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [words.length]);

  return (
    <section
      ref={containerRef}
      className="section container"
      style={{
        paddingTop: '64px',
        paddingBottom: '64px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '680px',
          margin: '0 auto',
        }}
      >
        <p
          className="text-eyebrow"
          style={{
            marginBottom: '16px',
            color: 'var(--fg-muted)',
          }}
        >
          Security by Architecture
        </p>

        <h2
          style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            lineHeight: '1.25',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            margin: '0 auto',
          }}
        >
          {words.map((word, i) => {
            const isRevealed = i <= activeWordIndex;
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  marginRight: '0.28em',
                  opacity: isRevealed ? 1 : 0.28,
                  color: isRevealed ? 'var(--fg)' : 'var(--fg-muted)',
                  transform: isRevealed ? 'translateY(0)' : 'translateY(2px)',
                  transition: 'opacity 0.45s cubic-bezier(0.32, 0.72, 0, 1), transform 0.45s cubic-bezier(0.32, 0.72, 0, 1)',
                  willChange: 'opacity, transform',
                }}
              >
                {word}
              </span>
            );
          })}
        </h2>
      </div>
    </section>
  );
}
