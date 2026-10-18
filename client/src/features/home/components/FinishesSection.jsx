import { useState } from 'react';
import { Link } from 'react-router-dom';

const FINISHES_DATA = [
  {
    id: 0,
    slug: 'cutlery-shine',
    name: 'Shine',
    alt: 'Elara Cutlery Set',
    image: 'https://stage.saknexora.198.251.65.48.nip.io/wp-content/uploads/2026/10/elara-cutlery-set-1-1200x1200.webp',
    gradient: 'linear-gradient(135deg,#f4f4f2,#9a9a98 45%,#ffffff 60%,#8d8d8b)',
  },
  {
    id: 1,
    slug: 'cutlery-matte',
    name: 'Matte',
    alt: 'Elara Matte Cutlery Set',
    image: 'https://stage.saknexora.198.251.65.48.nip.io/wp-content/uploads/2026/10/elara-matte-cutlery-set-1-1200x1200.webp',
    gradient: 'linear-gradient(135deg,#c9c9c6,#9b9b97 50%,#bdbdb9)',
  },
  {
    id: 2,
    slug: 'cutlery-gold',
    name: 'Gold',
    alt: 'Elara Gold Cutlery Set',
    image: 'https://stage.saknexora.198.251.65.48.nip.io/wp-content/uploads/2026/10/elara-gold-cutlery-set-1-1200x1200.webp',
    gradient: 'linear-gradient(135deg,#ffe9a8,#c8963a 45%,#fff2c4 60%,#a6762a)',
  },
  {
    id: 3,
    slug: 'cutlery-matte-gold',
    name: 'Matte Gold',
    alt: 'Elara Matte Gold Cutlery Set',
    image: 'https://stage.saknexora.198.251.65.48.nip.io/wp-content/uploads/2026/10/elara-matte-gold-cutlery-set-1-1200x1200.webp',
    gradient: 'linear-gradient(135deg,#d9b97e,#a98447 50%,#cfae70)',
  },
];

export default function FinishesSection() {
  const [activeFinish, setActiveFinish] = useState(0);

  return (
    <section className="section section--ink2 finishes" aria-labelledby="finishes-title" data-finishes="">
      <div className="wrap finishes__grid">
        <div className="finishes__stage" data-unmask="">
          {FINISHES_DATA.map((item) => (
            <figure
              key={item.id}
              className={`finishes__img ${activeFinish === item.id ? 'is-active' : ''}`}
              data-finish-img={item.id}
            >
              <img
                src={item.image}
                alt={item.alt}
                width="1200"
                height="1200"
                loading="lazy"
              />
            </figure>
          ))}
          <span className="finishes__ring" aria-hidden="true" />
        </div>

        <div className="finishes__copy">
          <p className="eyebrow" data-reveal="up">Cutlery</p>
          <h2 id="finishes-title" data-reveal="up" style={{ '--reveal-i': 1 }}>
            One design. <span className="foil-text">Four finishes.</span>
          </h2>
          <p className="lede" data-reveal="up" style={{ '--reveal-i': 2 }}>
            Every range comes in mirror shine, brushed matte, gold and matte gold, in multiple settings — so a banquet hall and a fine-dining room can both match their tables.
          </p>

          <div className="swatches" role="radiogroup" aria-label="Finish" data-reveal="up" style={{ '--reveal-i': 3 }}>
            {FINISHES_DATA.map((item) => (
              <button
                key={item.id}
                className={`swatch ${activeFinish === item.id ? 'is-active' : ''}`}
                type="button"
                role="radio"
                aria-checked={activeFinish === item.id}
                data-finish={item.id}
                onClick={() => setActiveFinish(item.id)}
              >
                <span className="swatch__dot" style={{ background: item.gradient }} />
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          <ul className="finishes__facts" data-reveal="up" style={{ '--reveal-i': 4 }}>
            <li>
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M6 3h12l3 6-9 12L3 9z" />
                <path d="M3 9h18M9 3l3 18 3-18" />
              </svg>
              Food-grade stainless steel
            </li>
            <li>
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="m12 3 9 5-9 5-9-5z" />
                <path d="m3 13 9 5 9-5" />
              </svg>
              Sets for multiple settings
            </li>
            <li>
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
              </svg>
              Dishwasher safe
            </li>
          </ul>

          <div className="btn-row" data-reveal="up" style={{ '--reveal-i': 5 }}>
            <Link className="btn" to="/catalogue/cutlery/" data-finish-link="">
              See all cutlery{' '}
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
