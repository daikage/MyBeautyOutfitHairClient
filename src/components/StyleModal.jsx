import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useLockBodyScroll from '../hooks/useLockBodyScroll';
import { formatDuration, formatPrice } from './ui';

const AFTERCARE = [
  'Style consultation and scalp check before we start',
  'Wash, treatment and blow-dry available as an add-on',
  'Aftercare notes and product advice to take home',
];

export default function StyleModal({ style, onClose }) {
  const panelRef = useRef(null);
  const open = Boolean(style);

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    panelRef.current?.focus();
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!style) return null;

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-label={`${style.name} details`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal__panel" ref={panelRef} tabIndex={-1}>
        <button type="button" className="modal__close" onClick={onClose} aria-label="Close details">
          ✕
        </button>

        <div className="modal__media">
          <img src={style.imageUrl} alt={style.name} />
        </div>

        <div className="modal__body">
          <span className="eyebrow">{style.category}</span>
          <h2>{style.name}</h2>
          <p>{style.description}</p>

          <dl className="modal__meta">
            <div>
              <dt>Investment</dt>
              <dd>{formatPrice(style.priceFrom)}</dd>
            </div>
            <div>
              <dt>Chair time</dt>
              <dd>{formatDuration(style.durationMinutes)}</dd>
            </div>
            <div>
              <dt>Studio</dt>
              <dd>Private · Texas</dd>
            </div>
          </dl>

          <ul className="check-list" style={{ marginBottom: '1.8rem' }}>
            {AFTERCARE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="btn-row">
            <Link to={`/book?style=${style.slug}`} className="btn btn--gold" onClick={onClose}>
              Request this style
            </Link>
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Keep browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}