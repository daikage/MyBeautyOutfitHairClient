import { useSite } from '../context/SiteContext';
import { Icon, Reveal, SectionHead, formatPrice } from './ui';

export default function ServicesSection({
  eyebrow = 'What we offer',
  title = 'Everything your hair needs, under one elegant roof',
  lede = 'From protective braids to glassy silk presses and bridal styling — every service is delivered one client at a time, in a calm private studio.',
  center = true,
  tone = 'ink',
  id = 'services',
}) {
  const { services } = useSite();

  return (
    <section className={`section section--${tone}`} id={id}>
      <div className="container">
        <SectionHead center={center} eyebrow={eyebrow} title={title} lede={lede} />

        <div className="service-grid">
          {services.map((service, index) => (
            <Reveal key={service.id} className="service" delay={(index % 4) * 80}>
              <div className="service__top">
                <span className="service__index">{String(index + 1).padStart(2, '0')}</span>
                <Icon name={service.icon} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className="service__price">{formatPrice(service.priceFrom)}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}