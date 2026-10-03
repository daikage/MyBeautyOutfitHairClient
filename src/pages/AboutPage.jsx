import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import ParallaxBand from '../components/ParallaxBand';
import TestimonialsSection from '../components/TestimonialsSection';
import { Icon, Reveal, SectionHead } from '../components/ui';
import { bands, salon } from '../data/salon';

const VALUES = [
  {
    icon: 'heart',
    title: 'Care before speed',
    body: 'We would rather take an extra hour than rush your parts, your edges or your comfort.',
  },
  {
    icon: 'leaf',
    title: 'Healthy hair always',
    body: 'Every appointment starts with a scalp and hair check, and tension-free technique on every braid.',
  },
  {
    icon: 'star',
    title: 'A private, calm space',
    body: 'One guest at a time in a quiet studio with refreshments, music you choose and no waiting room.',
  },
  {
    icon: 'sparkle',
    title: 'Detail obsessed',
    body: 'Neat parts, seamless melts, glassy finishes and photographs worth framing.',
  },
];

const EXPERIENCE = [
  'Private studio, by appointment only, so your time is truly yours.',
  'Braiding, twisting, loc care, installs and silk presses under one roof.',
  'Travel service available to your home, hotel or venue across Texas.',
  'Kid-friendly appointments and matching mother-and-daughter sessions.',
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        image={bands.studio}
        parent="/"
        parentLabel="Home"
        title="The Studio"
        lede={salon.intro}
      />

      <section className="section section--ink">
        <div className="container split split--wide-media">
          <Reveal variant="left">
            <span className="eyebrow">{salon.stylistRole}</span>
            <h2>Hello, I am {salon.stylist} — and I have been doing this work my whole life</h2>
            {salon.bio.map((paragraph) => (
              <p key={paragraph} className="lede">
                {paragraph}
              </p>
            ))}
            <p className="signature">“Your hair is never just hair to me.”</p>
            <div className="btn-row" style={{ marginTop: '1.6rem' }}>
              <Link to="/book" className="btn btn--gold">
                Book with me
              </Link>
              <a className="btn btn--ghost" href={`tel:${salon.phoneHref}`}>
                {salon.phone}
              </a>
            </div>
          </Reveal>

          <Reveal className="split__media" variant="right">
            <div className="frame">
              <img src={bands.silk} alt="Signature silk press styling" />
            </div>
            <div className="media-badge">
              {salon.stats[0].value} years
              <span>Styling Texas hair</span>
            </div>
          </Reveal>
        </div>

        <div className="container">
          <div className="stats">
            {salon.stats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 80}>
                <div className="stat__value">{stat.value}</div>
                <div className="stat__label">{stat.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ParallaxBand
        image={bands.locs}
        quote="Neat parts, healthy edges, and hair that still looks beautiful six weeks later."
        attribution="Loc care & maintenance"
        tall
      />

      <section className="section section--plum">
        <div className="container">
          <SectionHead
            center
            eyebrow="What you can expect"
            title="The standard in every single appointment"
            lede="These four promises never change, no matter which style you choose."
          />

          <div className="grid-4">
            {VALUES.map((value, index) => (
              <Reveal key={value.title} className="service" delay={(index % 4) * 80}>
                <div className="service__top">
                  <span className="service__index">{String(index + 1).padStart(2, '0')}</span>
                  <Icon name={value.icon} />
                </div>
                <h3>{value.title}</h3>
                <p>{value.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container split">
          <Reveal>
            <span className="eyebrow">The experience</span>
            <h2>An appointment that feels like a gift to yourself</h2>
            <p className="lede">
              {salon.serviceArea} {salon.travelNote}
            </p>
            <ul className="check-list" style={{ marginTop: '1.6rem' }}>
              {EXPERIENCE.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="split__media">
            <div className="frame">
              <img src={bands.bridal} alt="Bridal styling detail" />
            </div>
          </Reveal>
        </div>
      </section>

      <TestimonialsSection
        eyebrow="Kind words"
        title="What clients say afterwards"
        lede="Because the best review is a client who comes back with her daughter."
        tone="ink"
      />
    </>
  );
}