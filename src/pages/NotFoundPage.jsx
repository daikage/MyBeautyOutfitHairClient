import { Link } from 'react-router-dom';
import { Reveal } from '../components/ui';
import { bands } from '../data/salon';

export default function NotFoundPage() {
  return (
    <section
      className="page-hero"
      style={{ backgroundImage: `url(${bands.locs})`, minHeight: '70vh', display: 'grid', alignItems: 'center' }}
    >
      <div className="page-hero__scrim" aria-hidden="true" />
      <div className="container page-hero__inner text-center" style={{ marginInline: 'auto' }}>
        <Reveal>
          <span className="eyebrow">404 · page not found</span>
          <h1>This chair is empty</h1>
          <p className="lede" style={{ marginInline: 'auto' }}>
            The page you were looking for has moved or never existed. Let us get you back to something
            beautiful.
          </p>
          <div className="btn-row btn-row--center" style={{ marginTop: '1.6rem' }}>
            <Link to="/" className="btn btn--gold">
              Back home
            </Link>
            <Link to="/styles" className="btn btn--ghost">
              Browse the style menu
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}