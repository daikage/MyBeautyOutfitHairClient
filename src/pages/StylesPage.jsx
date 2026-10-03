import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import StyleGallery from '../components/StyleGallery';
import { Alert, Loader, Reveal, SectionHead } from '../components/ui';
import { useSite } from '../context/SiteContext';
import { bands, salon } from '../data/salon';

const NOTES = [
  'Prices are starting points — length, density and hair supplied can change the final total.',
  'Bring your own bundles or let us source them; we will advise on quality and quantity.',
  'Hair should arrive washed, detangled and product-free unless a wash is added to your service.',
  'A small deposit secures your chair and comes off the total on the day.',
];

export default function StylesPage() {
  const { styles, categories, status, error, reload } = useSite();

  return (
    <>
      <PageHero
        image={bands.locs}
        parent="/"
        parentLabel="Home"
        title="The Style Menu"
        lede="Braids and twists, locs, weaves and wigs, natural hair care, silk presses, bridal styling and little-queen styles — all created in a private Texas studio."
      />

      <section className="section section--ink">
        <div className="container">
          <SectionHead
            eyebrow="African American hair artistry"
            title="Choose the look that suits your lifestyle"
            lede="Filter by family, search by name, then open any style to see what is included, how long you will be in the chair and where the pricing starts."
          />

          {status === 'error' ? (
            <Alert type="error">
              {error}{' '}
              <button type="button" className="link-underline" onClick={reload}>
                Try again
              </button>
            </Alert>
          ) : null}

          {status === 'loading' ? (
            <Loader label="Loading the style menu" />
          ) : (
            <StyleGallery styles={styles} categories={categories} syncUrl />
          )}
        </div>
      </section>

      <section className="section section--plum">
        <div className="container split">
          <Reveal>
            <span className="eyebrow">Good to know</span>
            <h2>Before your appointment</h2>
            <ul className="check-list" style={{ marginTop: '1.6rem' }}>
              {NOTES.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
            <div className="btn-row" style={{ marginTop: '2rem' }}>
              <Link to="/book" className="btn btn--gold">
                Request a style
              </Link>
              <a className="btn btn--ghost" href={`tel:${salon.phoneHref}`}>
                Ask a question
              </a>
            </div>
          </Reveal>

          <Reveal className="info-card">
            <h3>Studio hours</h3>
            <ul className="hours-table" style={{ marginTop: '1.2rem' }}>
              {salon.hours.map((entry) => (
                <li key={entry.day}>
                  <span>{entry.day}</span>
                  <time>{entry.time}</time>
                </li>
              ))}
            </ul>
            <p className="field__hint" style={{ marginTop: '1.4rem' }}>
              {salon.policyNote}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}