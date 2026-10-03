import useReveal from '../hooks/useReveal';

/* --------------------------------------------------------------- helpers */

export const formatPrice = (priceFrom) =>
  typeof priceFrom === 'number' && priceFrom > 0
    ? `From $${priceFrom.toFixed(priceFrom % 1 === 0 ? 0 : 2)}`
    : 'Complimentary';

export const formatDuration = (minutes) => {
  if (!minutes) return 'Varies';
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  return `${hours % 1 === 0 ? hours : hours.toFixed(1)} hrs`;
};

export const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(String(value).replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/* ------------------------------------------------------------ components */

/** Scroll-triggered reveal wrapper (`variant`: null | 'left' | 'right' | 'zoom'). */
export function Reveal({
  as: Tag = 'div',
  className = '',
  variant = '',
  delay = 0,
  style,
  children,
  ...rest
}) {
  const [ref, visible] = useReveal();
  const classes = ['reveal', variant ? `reveal--${variant}` : '', visible ? 'is-in' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag
      ref={ref}
      className={classes}
      style={{ '--reveal-delay': `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function Ornament({ center = false, children }) {
  return (
    <div className={`ornament${center ? ' ornament--center' : ''}`}>
      <i className="ornament__diamond" aria-hidden="true" />
      {children ? <span className="eyebrow" style={{ margin: 0 }}>{children}</span> : null}
      <i className="ornament__diamond" aria-hidden="true" />
    </div>
  );
}

export function SectionHead({ eyebrow, title, lede, center = false, children }) {
  return (
    <Reveal className={`section__head${center ? ' section__head--center' : ''}`}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      {title ? <h2>{title}</h2> : null}
      {lede ? <p className="lede">{lede}</p> : null}
      {children}
    </Reveal>
  );
}

export function Loader({ label = 'Loading' }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="loader__ring" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function Alert({ type = 'info', children }) {
  if (!children) return null;
  return (
    <p className={`alert alert--${type}`} role={type === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  );
}

export function Stars({ rating = 5 }) {
  return (
    <div className="stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} aria-hidden="true">
          {index < rating ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
}

const ICON_PATHS = {
  chat: <path d="M5 5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-8.5L5 20z" />,
  drop: <path d="M12 3c4 5 6 7.4 6 10.4A6 6 0 0 1 6 13.4C6 10.4 8 8 12 3z" />,
  sparkle: <path d="M12 3.2l1.9 5.3 5.3 1.9-5.3 1.9L12 17.6l-1.9-5.3L4.8 10.4l5.3-1.9z" />,
  crown: <path d="M4 8l3.6 3.2L12 5l4.4 6.2L20 8v9H4z" />,
  ring: (
    <>
      <path d="M9.2 6.4L12 3.4l2.8 3" />
      <circle cx="12" cy="14.2" r="5.2" />
    </>
  ),
  heart: <path d="M12 20s-7-4.6-7-9.4A3.9 3.9 0 0 1 12 8.4a3.9 3.9 0 0 1 7 2.2C19 15.4 12 20 12 20z" />,
  leaf: (
    <>
      <path d="M20 4c0 8.4-5.2 12.4-11.4 12.4H6C6 9 10.6 5.2 20 4z" />
      <path d="M6.4 20c1-5.2 4.4-8.4 9.4-9.6" />
    </>
  ),
  star: <path d="M12 4l2.4 5 5.6.8-4 4 1 5.6L12 16.8 7 19.4l1-5.6-4-4L9.6 9z" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  scissors: (
    <>
      <circle cx="6.5" cy="6.5" r="2.4" />
      <circle cx="6.5" cy="17.5" r="2.4" />
      <path d="M8.6 8.2L20 18M8.6 15.8L20 6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s6.5-5.8 6.5-11a6.5 6.5 0 1 0-13 0C5.5 15.2 12 21 12 21z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 7.4V12l3.4 2" />
    </>
  ),
  phone: <path d="M6 3.5h3l1.6 4-2.1 1.5a11 11 0 0 0 5.5 5.5l1.5-2.1 4 1.6v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4 5.7 2 2 0 0 1 6 3.5z" />,
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.6" />
      <path d="M4 7l8 6 8-6" />
    </>
  ),
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.6" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.8" cy="7.2" r="0.9" />
    </>
  ),
};

export function Icon({ name, className = 'icon', ...rest }) {
  const path = ICON_PATHS[name] || ICON_PATHS.sparkle;
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {path}
    </svg>
  );
}