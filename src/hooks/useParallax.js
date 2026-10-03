import { useEffect, useRef } from 'react';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * The parallax workhorse.
 *
 * Adds a `--parallax-y` custom property (in pixels) to the returned element,
 * updated inside requestAnimationFrame as the element travels through the
 * viewport. Layers that are further "away" get a smaller amplitude, which is
 * what creates the sense of depth.
 *
 *   const layer = useParallax(140);
 *   <div ref={layer} className="parallax-layer" />
 *
 *   .parallax-layer { transform: translate3d(0, var(--parallax-y, 0px), 0); }
 *
 * Respects `prefers-reduced-motion` (nothing moves at all for those users).
 */
export default function useParallax(amplitude = 120, { axis = 'y' } = {}) {
  const ref = useRef(null);
  const optionsRef = useRef({ amplitude, axis });
  optionsRef.current = { amplitude, axis };

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return undefined;

    let frame = 0;

    const update = () => {
      frame = 0;
      const { amplitude: amount, axis: whichAxis } = optionsRef.current;
      const rect = element.getBoundingClientRect();
      if (rect.bottom < -240 || rect.top > window.innerHeight + 240) return;
      const travel = window.innerHeight + rect.height;
      const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / (travel / 2);
      const offset = -progress * amount;
      element.style.setProperty(
        whichAxis === 'x' ? '--parallax-x' : '--parallax-y',
        `${offset.toFixed(2)}px`
      );
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}