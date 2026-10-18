import { Link } from 'react-router-dom';
import ProductCard from '../../../components/ProductCard.jsx';
import { ArrowIcon } from './HomeIcons.jsx';

const TABS = [
  { slug: 'chairs', label: 'Chairs' },
  { slug: 'tables', label: 'Tables' },
  { slug: 'sofas-seating', label: 'Sofas & Seating' },
  { slug: 'tea-trolleys', label: 'Tea Trolleys' },
];

export default function FeaturedSection({ tab, setTab, tabProducts }) {
  return (
    <section className="section section-light featured">
        <div className="wrap">
          <div className="section-head featured-head" data-reveal="up">
            <div>
              <p className="eyebrow">From the catalogue</p>
              <h2>Furniture that sets the tone.</h2>
            </div>
            <div className="tabs" role="group" aria-label="Furniture type">
              {TABS.map((item) => <button key={item.slug} type="button" aria-pressed={tab === item.slug} className={tab === item.slug ? 'on' : ''} onClick={() => setTab(item.slug)}>{item.label}</button>)}
            </div>
          </div>
          {tabProducts.error && <p className="notice err" role="alert">{tabProducts.error}</p>}
          <div className="grid featured-grid" aria-label={TABS.find((item) => item.slug === tab)?.label}>
            {(tabProducts.data?.items || []).slice(0, 4).map((product) => <div key={product._id} data-reveal="up"><ProductCard p={product} /></div>)}
          </div>
          {tabProducts.data && <p className="center"><Link className="link-arrow" to={`/catalogue/furniture/${tab}`}>View all {TABS.find((item) => item.slug === tab)?.label.toLowerCase()} ({tabProducts.data.total}) <ArrowIcon /></Link></p>}
        </div>
      </section>
  );
}
