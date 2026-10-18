import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../../components/ProductCard.jsx';

const TABS = [
  { slug: 'chairs', label: 'Chairs', id: 0 },
  { slug: 'tables', label: 'Tables', id: 1 },
  { slug: 'sofas-seating', label: 'Sofas & Seating', id: 2 },
  { slug: 'tea-trolleys', label: 'Tea Trolleys', id: 3 },
];

export default function FeaturedSection({ tab, setTab, tabProducts }) {
  const tabsRef = useRef(null);
  const railRef = useRef(null);

  // Sliding ink indicator
  useEffect(() => {
    const bar = tabsRef.current;
    if (!bar) return;
    const selected = bar.querySelector('[aria-selected="true"]');
    const ink = bar.querySelector('.tabs__ink');
    if (selected && ink) {
      ink.style.width = `${selected.offsetWidth}px`;
      ink.style.transform = `translateX(${selected.offsetLeft}px)`;
    }
  }, [tab]);

  const currentTab = TABS.find((item) => item.slug === tab) || TABS[0];

  const scrollRail = (direction) => {
    const track = railRef.current;
    if (!track) return;
    const card = track.querySelector('.card');
    const step = (card ? card.offsetWidth : 300) + 18;
    track.scrollBy({ left: direction * step * 2, behavior: 'smooth' });
  };

  const items = tabProducts.data?.items || [];

  return (
    <section className="section section--light featured" aria-labelledby="featured-title">
      <div className="wrap">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow" data-reveal="up">From the catalogue</p>
            <h2 id="featured-title" data-reveal="up" style={{ '--reveal-i': 1 }}>
              Furniture that sets the tone.
            </h2>
          </div>
          <div className="tabs" role="tablist" aria-label="Furniture type" data-tabs="" data-reveal="fade" ref={tabsRef}>
            {TABS.map((item) => (
              <button
                key={item.slug}
                className="tab"
                type="button"
                role="tab"
                id={`ftab-${item.id}`}
                aria-controls={`fpanel-${item.id}`}
                aria-selected={tab === item.slug}
                tabIndex={tab === item.slug ? 0 : -1}
                onClick={() => setTab(item.slug)}
              >
                {item.label}
              </button>
            ))}
            <span className="tabs__ink" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="rail" role="tabpanel" id={`fpanel-${currentTab.id}`} aria-labelledby={`ftab-${currentTab.id}`}>
        <div className="rail__track" data-rail="" ref={railRef}>
          {items.slice(0, 10).map((product) => (
            <ProductCard key={product._id || product.id} p={product} className="rail__item" />
          ))}

          <div className="rail__more card">
            <Link className="rail__more-inner" to={`/catalogue/furniture/${tab}/`}>
              <span className="eyebrow">More in</span>
              <strong>{currentTab.label}</strong>
              <span className="icon-circle">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        <div className="wrap rail__controls">
          <button
            className="icon-btn"
            type="button"
            data-rail-prev=""
            aria-label="Previous items"
            onClick={() => scrollRail(-1)}
          >
            <svg className="icon flip" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
          <button
            className="icon-btn"
            type="button"
            data-rail-next=""
            aria-label="Next items"
            onClick={() => scrollRail(1)}
          >
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
