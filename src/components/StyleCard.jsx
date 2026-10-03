import { Reveal, formatDuration, formatPrice } from './ui';

/**
 * A single style in the menu grid. Rendered as a button so it is reachable by
 * keyboard and screen readers; clicking opens the detail modal.
 */
export default function StyleCard({ style, index = 0, onSelect }) {
  return (
    <Reveal as="button" type="button" className="style-card" delay={(index % 4) * 90} onClick={() => onSelect(style)}>
      <span className="style-card__media">
        <img src={style.imageUrl} alt={style.name} loading="lazy" decoding="async" />
        {style.featured ? <span className="style-card__badge">Signature</span> : null}
      </span>
      <span className="style-card__body">
        <span className="style-card__cat">{style.category}</span>
        <span className="style-card__name">{style.name}</span>
        <span className="style-card__desc">{style.description}</span>
        <span className="style-card__foot">
          <span className="style-card__price">{formatPrice(style.priceFrom)}</span>
          <span className="style-card__time">
            {formatDuration(style.durationMinutes)} · View
          </span>
        </span>
      </span>
    </Reveal>
  );
}