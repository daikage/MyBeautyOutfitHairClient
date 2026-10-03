import { Link } from 'react-router-dom';
import { Reveal } from './ui';

/** Slimmer hero used at the top of every page except the home page. */
export default function PageHero({ image, eyebrow, title, lede, parent, parentLabel, children }) {
  return (
    <section className="page-hero" style={image ? { backgroundImage: `url(${image})` } : undefined}>
      <div className="page-hero__scrim" aria-hidden="true" />
      <div className="container page-hero__inner">
        {parent ? (
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to={parent}>{parentLabel}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{title}</span>
          </nav>
        ) : (
          <span className="eyebrow">{eyebrow}</span>
        )}
        <Reveal>
          <h1>{title}</h1>
          {lede ? <p className="lede">{lede}</p> : null}
          {children}
        </Reveal>
      </div>
    </section>
  );
}