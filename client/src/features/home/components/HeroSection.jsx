import { Link } from 'react-router-dom';
import { SECTORS, waLink, SITE } from '../../../content.js';
import { referenceImages } from '../../../referenceImages.js';
import { ArrowIcon, WhatsAppIcon } from './HomeIcons.jsx';

export default function HeroSection({ furnitureCount }) {
  return (
    <section className="hero" data-home-hero>
        <div className="hero-bg" aria-hidden="true">
          <img src={referenceImages.hero.background} alt="" fetchpriority="high" />
        </div>
        <div className="hero-grain" aria-hidden="true" />
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Hospitality supply · Peshawar</p>
            <h1>Furnish the hall.<br />Set every <em className="foil-text">table.</em></h1>
            <p className="hero-lede">Furniture, cutlery, crockery, table accessories and guest bathroom kits for banquet halls, hotels, restaurants and coffee shops — premium quality at an honest price.</p>
            <div className="btn-row">
              <Link className="btn" to="/catalogue">Browse the catalogue <ArrowIcon /></Link>
              <a className="btn btn-ghost" href={waLink()} target="_blank" rel="noreferrer"><WhatsAppIcon />Ask on WhatsApp</a>
            </div>
            <ul className="hero-sectors">
              {SECTORS.map((item) => <li key={item.key}>{item.name}</li>)}
            </ul>
          </div>

          <div className="hero-stage" aria-hidden="true">
            <svg className="hero-hex" viewBox="0 0 100 115.5" data-depth=".25"><path d="M50 2 96 28.5v58.5L50 113.5 4 87V28.5z" /></svg>
            <svg className="hero-hex hero-hex-inner" viewBox="0 0 100 115.5" data-depth=".15"><path d="M50 2 96 28.5v58.5L50 113.5 4 87V28.5z" /></svg>
            <div className="hero-halo" data-depth=".1" />
            <img className="hero-product hero-trolley" src={referenceImages.hero.trolley} alt="" data-depth=".45" />
            <img className="hero-product hero-chair-navy" src={referenceImages.hero.chairNavy} alt="" data-depth=".7" />
            <img className="hero-product hero-chair-oval" src={referenceImages.hero.chairOval} alt="" data-depth="1.1" />
            <div className="hero-medal" data-depth="1.4"><img src={referenceImages.hero.cutlery} alt="" /></div>
            <span className="hero-tag hero-tag-left" data-depth=".8"><strong>{furnitureCount}</strong> furniture pieces</span>
            <span className="hero-tag hero-tag-right" data-depth="1.1"><strong>4</strong> cutlery finishes</span>
          </div>
        </div>
        <a className="hero-cue" href="#categories" aria-label="Scroll to categories"><span /></a>
      </section>
  );
}
