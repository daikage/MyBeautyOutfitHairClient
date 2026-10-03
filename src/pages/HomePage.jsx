import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ParallaxBand from '../components/ParallaxBand';
import ServicesSection from '../components/ServicesSection';
import StyleGallery from '../components/StyleGallery';
import TestimonialsSection from '../components/TestimonialsSection';
import { Alert, Icon, Loader, Reveal, SectionHead } from '../components/ui';
import { useSite } from '../context/SiteContext';
import { bands, salon } from '../data/salon';

const PROMISES = [
  'One client at a time — your chair, your music, your pace.',
  'Tension-free braiding that protects your edges and your time.',
  'Healthy-hair first: every service begins with a scalp and hair check.',
  'Aftercare coaching so your style still looks fresh weeks later.',
];

export default function HomePage() {
  const { featured, categories, status, error, reload, styles } = useSite();

  return (
    <>
      <Hero />

      {/* ---------------------------------------------------------- welcome */}
      <section className="section section--ink">
        <div className="container split">
          <Reveal variant="left">
            <span className="eyebrow">Welcome to the studio</span>
            <h2>
              Hair that respects your time, <em>your edges</em> and your style
            </h2>
            <p className="lede">
              {salon.name} is a private Texas studio where {styles.length}+ signature styles live on
              the menu — knotless braids, goddess braids, soft locs, HD lace installs, silk presses,
              natural hair care and bridal styling.
            </p>
            <ul className="check-list" style={{ margin: '1.8rem 0 2rem' }}>
              {PROMISES.map((promise) => (
                <li key={promise}>{promise}</li>
              ))}
            </ul>
            <div className="btn-row">
              <Link to="/about" className="btn btn--ghost">
                Meet your stylist
              </Link>
              <Link to="/services" className="link-underline" style={{ alignSelf: 'center' }}>
                See all services
              </Link>
            </div>
          </Reveal>

          <Reveal className="split__media" variant="right">
            <div className="frame">
              <img src={bands.studio} alt="The private studio, styled in gold and deep plum" />
            </div>
            <div className="media-badge">
              By appointment only
              <span>Private · Texas</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------- signature styles */}
      <section className="section section--ink" id="signature">
        <div className="container">
          <SectionHead
            center
            eyebrow="Signature styles"
            title="The looks our clients keep coming back for"
            lede="Tap any style to see the details, chair time and starting price — then request it in one step."
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
            <StyleGallery
              styles={featured}
              categories={categories}
              limit={8}
              showSearch={false}
              showFilters={false}
            />
          )}

          <div className="text-center" style={{ marginTop: '2.8rem' }}>
            <Link to="/styles" className="btn btn--gold">
              See the full style menu
            </Link>
          </div>
        </div>
      </section>

      <ParallaxBand
        image={bands.braids}
        quote="Beautiful hair should never cost you your hairline. Every braid is installed with intention."
        attribution={`${salon.name} · Braids & twists`}
        tall
      />

      <ServicesSection />

      {/* ------------------------------------------------ browse by family */}
      <section className="section section--plum" id="families">
        <div className="container">
          <SectionHead
            center
            eyebrow="Choose your look"
            title="Browse the menu by style family"
            lede="Seven families, one studio. Not sure which suits your hair and lifestyle? We will help you decide at your consultation."
          />

          <div className="grid-3">
            {categories.map((category, index) => (
              <Reveal key={category.name} className="service" delay={(index % 3) * 90}>
                <div className="service__top">
                  <span className="service__index">{String(index + 1).padStart(2, '0')}</span>
                  <Icon name="sparkle" />
                </div>
                <h3>{category.name}</h3>
                <p>{category.blurb}</p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    marginTop: '0.6rem',
                  }}
                >
                  <span className="service__price">{category.count} styles</span>
                  <Link
                    to={`/styles?category=${encodeURIComponent(category.name)}`}
                    className="link-underline"
                  >
                    View
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ParallaxBand
        image={bands.bridal}
        quote="Every bride deserves hair that lasts from the vows to the very last dance."
        attribution="Bridal & event styling · Trials available"
      />

      <TestimonialsSection />

      {/* ------------------------------------------------------------ book */}
      <section className="section section--ink" id="book">
        <div className="container">
          <Reveal className="cta-panel">
            <span className="eyebrow">Your chair is waiting</span>
            <h2>Ready when you are</h2>
            <p className="lede text-center">
              Send a request with your preferred date and the style you have in mind. You will get a
              reply within 24 hours with availability and next steps.
            </p>
            <div className="btn-row btn-row--center">
              <Link to="/book" className="btn btn--gold">
                Request an appointment
              </Link>
              <a className="btn btn--ghost" href={`tel:${salon.phoneHref}`}>
                Call {salon.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}