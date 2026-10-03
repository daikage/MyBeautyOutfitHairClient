import { Link } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import PageHero from '../components/PageHero';
import { Icon, Reveal } from '../components/ui';
import { bands, salon } from '../data/salon';

export default function BookPage() {
  return (
    <>
      <PageHero
        image={bands.hero}
        parent="/"
        parentLabel="Home"
        title="Book Your Appointment"
        lede="Send your request below and you will hear back within 24 hours with availability, preparation notes and your deposit link."
      />

      <section className="section section--ink">
        <div className="container split" style={{ alignItems: 'start' }}>
          <Reveal className="form-card">
            <span className="eyebrow">Appointment request</span>
            <h2 style={{ fontSize: 'clamp(1.7rem, 3vw, 2.4rem)' }}>Tell us about your hair</h2>
            <p className="field__hint" style={{ marginBottom: '1.6rem' }}>
              Fields marked * are required. Add a phone number or email so we can confirm.
            </p>
            <BookingForm />
          </Reveal>

          <Reveal className="info-card" variant="right">
            <h3>Studio details</h3>

            <div style={{ marginTop: '1.2rem' }}>
              <div className="info-row">
                <span className="info-row__label">
                  <Icon name="phone" className="icon" style={{ width: 16, height: 16 }} />
                </span>
                <span className="info-row__value">
                  <a href={`tel:${salon.phoneHref}`}>{salon.phone}</a>
                </span>
              </div>
              <div className="info-row">
                <span className="info-row__label">
                  <Icon name="mail" className="icon" style={{ width: 16, height: 16 }} />
                </span>
                <span className="info-row__value">
                  <a href={`mailto:${salon.email}`}>{salon.email}</a>
                </span>
              </div>
              <div className="info-row">
                <span className="info-row__label">
                  <Icon name="pin" className="icon" style={{ width: 16, height: 16 }} />
                </span>
                <span className="info-row__value">
                  {salon.addressLines.join(' · ')}
                  <br />
                  <span className="muted">{salon.mapNote}</span>
                </span>
              </div>
            </div>

            <h4 style={{ marginTop: '2rem' }}>Opening hours</h4>
            <ul className="hours-table">
              {salon.hours.map((entry) => (
                <li key={entry.day}>
                  <span>{entry.day}</span>
                  <time>{entry.time}</time>
                </li>
              ))}
            </ul>

            <h4 style={{ marginTop: '2rem' }}>Where you will be</h4>
            <p style={{ fontSize: '0.94rem' }}>{salon.serviceArea}</p>
            <p style={{ fontSize: '0.94rem' }}>{salon.travelNote}</p>

            <p className="field__hint" style={{ marginTop: '1.4rem' }}>
              {salon.policyNote}
            </p>

            <div className="btn-row" style={{ marginTop: '1.6rem' }}>
              <Link to="/styles" className="btn btn--ghost btn--sm">
                Browse styles first
              </Link>
              <a className="btn btn--gold btn--sm" href={`tel:${salon.phoneHref}`}>
                Call instead
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}