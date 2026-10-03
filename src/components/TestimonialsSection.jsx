import { useSite } from '../context/SiteContext';
import { Reveal, SectionHead, Stars } from './ui';

export default function TestimonialsSection({
  eyebrow = 'Kind words',
  title = 'Loved by the women of Texas',
  lede = 'Real notes from real clients — grandmothers, brides, bridesmaids and little ones.',
  center = true,
  tone = 'plum',
  limit = 6,
  id = 'reviews',
}) {
  const { testimonials } = useSite();
  const shown = testimonials.slice(0, limit);

  return (
    <section className={`section section--${tone}`} id={id}>
      <div className="container">
        <SectionHead center={center} eyebrow={eyebrow} title={title} lede={lede} />

        <div className="testimonial-grid">
          {shown.map((entry, index) => (
            <Reveal key={entry.id} className="testimonial" delay={(index % 3) * 100}>
              <Stars rating={entry.rating} />
              <p className="testimonial__quote">{entry.quote}</p>
              <div style={{ marginTop: 'auto' }}>
                <div className="testimonial__author">{entry.author}</div>
                <div className="testimonial__loc">{entry.location}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}