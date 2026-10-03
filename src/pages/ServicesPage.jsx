import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import ParallaxBand from '../components/ParallaxBand';
import ServicesSection from '../components/ServicesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import { Reveal, SectionHead } from '../components/ui';
import { bands, salon } from '../data/salon';

const PROCESS = [
  {
    title: 'Send your request',
    body: 'Tell us the style you have in mind, your preferred date and anything we should know about your hair. You will hear back within 24 hours.',
  },
  {
    title: 'Confirm with a deposit',
    body: 'A small deposit locks in your chair and comes off your final total. You will receive the studio address and preparation notes.',
  },
  {
    title: 'Arrive and relax',
    body: 'Come washed, detangled and product-free (unless a wash is included). Tea, music and a private chair are waiting for you.',
  },
  {
    title: 'Leave with aftercare',
    body: 'You will leave with simple aftercare steps, product guidance and your next appointment already noted if you want it.',
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        image={bands.silk}
        parent="/"
        parentLabel="Home"
        title="Services & Pricing"
        lede={`Everything offered at ${salon.name} — from a first consultation to full bridal party styling.`}
      />

      <ServicesSection
        eyebrow="The service list"
        title="Seven ways we take care of your crown"
        lede="Each service is delivered one client at a time in a calm, private studio. Prices show where each service starts."
        tone="ink"
        id="list"
      />

      <ParallaxBand
        image={bands.silk}
        quote="A silk press should shine like glass — and still be healthy when you wash it out."
        attribution="Silk press & styling"
      />

      <section className="section section--plum">
        <div className="container">
          <SectionHead
            center
            eyebrow="How it works"
            title="Booking in four easy steps"
            lede="No apps, no confusion, no waiting rooms full of strangers."
          />

          <div className="split" style={{ alignItems: 'start' }}>
            <ol className="step-list">
              {PROCESS.slice(0, 2).map((step) => (
                <li className="step" key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
            <ol className="step-list" style={{ counterReset: 'step 2' }}>
              {PROCESS.slice(2).map((step) => (
                <li className="step" key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>

          <Reveal className="cta-panel" style={{ marginTop: '3rem' }}>
            <h3 style={{ margin: 0 }}>Add-ons available with any service</h3>
            <p className="lede text-center" style={{ margin: 0 }}>
              Deep conditioning treatments, scalp care, precision trims, colour gloss, hair sourcing
              and travel to your home or venue.
            </p>
            <div className="btn-row btn-row--center">
              <Link to="/book" className="btn btn--gold">
                Start a booking
              </Link>
              <Link to="/styles" className="btn btn--ghost">
                Browse styles
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <TestimonialsSection
        eyebrow="Client love"
        title="Four hundred chairs, one standard"
        lede="Reviews from across the Texas metro — Houston, Katy, Dallas, Arlington and Austin."
        limit={3}
        tone="ink"
      />
    </>
  );
}