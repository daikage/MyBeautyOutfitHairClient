import { Link } from 'react-router-dom';
import { navLinks, salon } from '../data/salon';
import { useSite } from '../context/SiteContext';
import { Icon } from './ui';

export default function Footer() {
  const { categories } = useSite();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <span className="brand" style={{ marginBottom: '1.2rem' }}>
              <img src="/logo.png" alt={salon.name} style={{ height: '62px', objectFit: 'contain' }} />
            </span>
            <p>{salon.intro}</p>
            <div className="socials">
              <a href={salon.instagramUrl} aria-label="Instagram" rel="noreferrer" target="_blank">
                IG
              </a>
              <a href={`mailto:${salon.email}`} aria-label="Email the studio">
                @
              </a>
              <a href={`tel:${salon.phoneHref}`} aria-label="Call the studio">
                ✆
              </a>
            </div>
          </div>

          <div>
            <h4>Explore</h4>
            <ul className="footer__list">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
              <li>
                <Link to="/admin">Stylist log in</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Style menu</h4>
            <ul className="footer__list">
              {categories.slice(0, 6).map((category) => (
                <li key={category.name}>
                  <Link to={`/styles?category=${encodeURIComponent(category.name)}`}>
                    {category.name}
                    {category.count ? ` (${category.count})` : ''}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Visit the studio</h4>
            <ul className="footer__list">
              {salon.addressLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
              <li>
                <a href={`tel:${salon.phoneHref}`}>{salon.phone}</a>
              </li>
              <li>
                <a href={`mailto:${salon.email}`}>{salon.email}</a>
              </li>
            </ul>
            <ul className="footer__hours" style={{ marginTop: '1.2rem' }}>
              {salon.hours.map((entry) => (
                <li key={entry.day}>
                  <span>{entry.day}</span>
                  <time>{entry.time}</time>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>
            © {year} {salon.name}. All rights reserved.
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Icon name="scissors" className="icon" style={{ width: 16, height: 16 }} />
            Handcrafted with love for Mum in Texas.
          </span>
          <span>{salon.serviceArea}</span>
        </div>
      </div>
    </footer>
  );
}