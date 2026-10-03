import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { navLinks, salon } from '../data/salon';
import useLockBodyScroll from '../hooks/useLockBodyScroll';

export default function Navbar() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useLockBodyScroll(open);

  const linkClass = ({ isActive }) => `nav__link${isActive ? ' is-active' : ''}`;

  return (
    <>
      <header className={`nav${solid || open ? ' nav--solid' : ''}`}>
        <div className="container nav__inner">
          <Link to="/" className="brand" aria-label={`${salon.name} — home`}>
            <img src="/logo.png" alt={salon.name} style={{ height: '76px', objectFit: 'contain' }} />
          </Link>

          <nav className="nav__links" aria-label="Main navigation">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="nav__actions">
            <a className="nav__phone" href={`tel:${salon.phoneHref}`}>
              {salon.phone}
            </a>
            <Link to="/book" className="btn btn--gold btn--sm">
              Book now
            </Link>
            <button
              type="button"
              className="nav__toggle"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span className="nav__toggle-bars" aria-hidden="true">
                <span />
                <span />
              </span>
              {open ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className={`drawer${open ? ' is-open' : ''}`} aria-hidden={!open}>
        <div className="drawer__head">
          <span className="brand">
            <img src="/logo.png" alt={salon.name} style={{ height: '64px', objectFit: 'contain' }} />
          </span>
          <button
            type="button"
            className="drawer__close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="drawer__nav" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="drawer__foot">
          <a href={`tel:${salon.phoneHref}`}>{salon.phone}</a>
          <a href={`mailto:${salon.email}`}>{salon.email}</a>
          <span>{salon.addressLines.join(' · ')}</span>
          <Link to="/book" className="btn btn--gold btn--sm" style={{ justifySelf: 'start' }}>
            Book an appointment
          </Link>
        </div>
      </div>
    </>
  );
}