import { useEffect, useState } from 'react';
import useParallax from '../hooks/useParallax';

/**
 * Full-bleed parallax band used between sections.
 *
 * On desktop (hover + no reduced-motion preference) we use the classic
 * `background-attachment: fixed` window effect; everywhere else the artwork is
 * moved with a requestAnimationFrame-driven layer, so phones still get depth
 * without the well-known iOS background-attachment bug.
 */
export default function ParallaxBand({
  image,
  quote,
  attribution,
  tall = false,
  className = '',
  children,
}) {
  const [useFixed, setUseFixed] = useState(false);
  const layer = useParallax(110);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const query = window.matchMedia(
      '(min-width: 901px) and (hover: hover) and (prefers-reduced-motion: no-preference)'
    );
    const update = () => setUseFixed(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return (
    <section className={`band${tall ? ' band--tall' : ''} ${className}`.trim()}>
      <div
        ref={useFixed ? undefined : layer}
        className={`band__bg parallax-layer ${useFixed ? 'band__bg--fixed' : 'band__bg--floating'}`}
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden="true"
      />
      <div className="band__scrim" aria-hidden="true" />
      <div className="band__inner">
        <div className="band__accent" aria-hidden="true" />
        {quote ? <p className="band__quote">{quote}</p> : null}
        {attribution ? <p className="band__attrib">{attribution}</p> : null}
        {children}
      </div>
    </section>
  );
}