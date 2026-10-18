import { Link } from 'react-router-dom';
import { referenceImages } from '../../../referenceImages.js';

export default function HeroSection() {
  return (
    <section className="hero" data-hero="">
      <div className="hero__bg" aria-hidden="true">
        <img src={referenceImages.hero.background} alt="" loading="eager" decoding="async" fetchpriority="high" />
      </div>
      <div className="hero__grain" aria-hidden="true" />
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <p className="eyebrow" data-hero-item="" style={{ '--hero-i': 0 }}>
            Hospitality supply · Peshawar
          </p>
          <h1 className="hero__title">
            <span className="hero__line">
              <span data-hero-item="" style={{ '--hero-i': 1 }}>Furnish the hall.</span>
            </span>
            <span className="hero__line">
              <span data-hero-item="" style={{ '--hero-i': 2 }}>
                Set every <em className="foil-text foil-text--shimmer">table.</em>
              </span>
            </span>
          </h1>
          <p className="hero__lede" data-hero-item="" style={{ '--hero-i': 3 }}>
            Furniture, Cutlery, Crockery and Accessories for Banquet halls, Hotels, Restaurants and Coffee shops — premium quality at a competitive price.
          </p>
          <div className="btn-row" data-hero-item="" style={{ '--hero-i': 4 }}>
            <Link className="btn" to="/catalogue/" data-magnetic="">
              Browse the catalogue{' '}
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <a
              className="btn btn--ghost"
              href="https://wa.me/923055827170?text=Hi%20SAK%20Nexora%2C%20I%20have%20an%20enquiry."
              target="_blank"
              rel="noopener"
              data-magnetic=""
            >
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3z" />
              </svg>
              Ask on WhatsApp
            </a>
          </div>
          <ul className="hero__sectors" data-hero-item="" style={{ '--hero-i': 5 }}>
            <li>Banquet Halls</li>
            <li>Hotels</li>
            <li>Restaurants</li>
            <li>Coffee Shops</li>
          </ul>
        </div>

        <div className="hero__stage" data-hero-stage="" aria-hidden="true">
          <svg className="hero__hex" viewBox="0 0 100 115.5" data-depth=".25">
            <path d="M50 2 96 28.5v58.5L50 113.5 4 87V28.5z" pathLength="1" />
          </svg>
          <svg className="hero__hex hero__hex--inner" viewBox="0 0 100 115.5" data-depth=".15">
            <path d="M50 2 96 28.5v58.5L50 113.5 4 87V28.5z" pathLength="1" />
          </svg>
          <div className="hero__halo" data-depth=".1" />
          <img className="hero__p hero__p--trolley" src={referenceImages.hero.trolley} alt="" width="560" height="700" decoding="async" fetchpriority="low" data-depth=".45" />
          <img className="hero__p hero__p--navy" src={referenceImages.hero.chairNavy} alt="" width="500" height="660" decoding="async" fetchpriority="low" data-depth=".7" />
          <img className="hero__p hero__p--oval" src={referenceImages.hero.chairOval} alt="" width="360" height="580" decoding="async" fetchpriority="low" data-depth="1.1" />
          <div className="hero__medal" data-depth="1.4">
            <img src={referenceImages.hero.cutlery} alt="" width="260" height="260" decoding="async" fetchpriority="low" />
          </div>
        </div>
      </div>
      <a className="hero__cue" href="#categories" aria-label="Scroll to categories">
        <span />
      </a>
    </section>
  );
}
