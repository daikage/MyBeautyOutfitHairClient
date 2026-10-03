import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useParallax, { prefersReducedMotion } from '../hooks/useParallax';
import { bands, salon } from '../data/salon';
import { useSite } from '../context/SiteContext';

/**
 * Layered parallax hero: the artwork drifts on scroll, the gold orbits follow
 * the pointer, and the copy lifts slightly for depth. All motion is disabled
 * for visitors who prefer reduced motion.
 */
export default function Hero() {
  const { content, styles } = useSite();
  const artRef = useParallax(150);
  const heroRef = useRef(null);

  useEffect(() => {
    const element = heroRef.current;
    if (!element) return undefined;
    if (prefersReducedMotion()) return undefined;
    if (typeof window.matchMedia === 'function' && window.matchMedia('(hover: none)').matches) {
      return undefined;
    }

    let frame = 0;
    const onPointerMove = (event) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const x = (event.clientX / window.innerWidth - 0.5) * 2;
        const y = (event.clientY / window.innerHeight - 0.5) * 2;
        element.style.setProperty('--pointer-x', x.toFixed(3));
        element.style.setProperty('--pointer-y', y.toFixed(3));
      });
    };

    window.addEventListener('pointermove', onPointerMove);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const words = (content.heroTitle || salon.tagline).split(/\s+/);
  const emphasisCount = Math.min(3, Math.max(1, words.length - 1));
  const lead = words.slice(0, words.length - emphasisCount).join(' ');
  const emphasis = words.slice(words.length - emphasisCount).join(' ');

  return (
    <section className="hero" ref={heroRef}>
      <div
        ref={artRef}
        className="hero__layer hero__layer--art parallax-layer"
        style={{ backgroundImage: `url(${bands.hero})` }}
        aria-hidden="true"
      />
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__scrim" aria-hidden="true" />
      <span className="hero__orbit hero__orbit--one" aria-hidden="true" />
      <span className="hero__orbit hero__orbit--two" aria-hidden="true" />
      <span className="hero__frame" aria-hidden="true" />

      <div className="hero__inner container">
        <div className="hero__content">
          <span className="eyebrow">{content.heroEyebrow || 'Texas · Luxury Hair Studio'}</span>
          <h1>
            {lead}
            {emphasis ? <em>{emphasis}</em> : null}
          </h1>
          <p className="hero__sub">{content.heroSubtitle || salon.intro}</p>

          <div className="btn-row">
            <Link to="/book" className="btn btn--gold">
              Book your chair
            </Link>
            <Link to="/styles" className="btn btn--ghost">
              Explore the style menu
            </Link>
          </div>

          <dl className="hero__meta">
            <div>
              <dt>Studio</dt>
              <dd>Private & by appointment</dd>
            </div>
            <div>
              <dt>Specialisms</dt>
              <dd>{styles.length}+ styles on the menu</dd>
            </div>
            <div>
              <dt>Home of</dt>
              <dd>{salon.name}</dd>
            </div>
          </dl>
        </div>
      </div>

      <span className="hero__scroll" aria-hidden="true">
        <span className="hero__scroll-line" />
        Scroll
      </span>
    </section>
  );
}