import { Link } from 'react-router-dom';
import SafeImg from '../../../components/SafeImg.jsx';
import { referenceImages } from '../../../referenceImages.js';

const STAGING_IMAGES = {
  furniture: 'https://stage.saknexora.198.251.65.48.nip.io/wp-content/uploads/2026/10/modern-astoria-dining-table-with-toranto-chairs-1.webp',
  cutlery: 'https://stage.saknexora.198.251.65.48.nip.io/wp-content/uploads/2026/10/elara-gold-cutlery-set-1-640x640.webp',
  crockery: 'https://stage.saknexora.198.251.65.48.nip.io/wp-content/uploads/2026/10/porcelain-tea-cups-saucers-1-640x640.webp',
  accessories: 'https://stage.saknexora.198.251.65.48.nip.io/wp-content/uploads/2026/10/napkins-1-640x640.webp',
  'bathroom-kits': 'https://stage.saknexora.198.251.65.48.nip.io/wp-content/uploads/2026/10/wooden-bathroom-amenity-kit-1-640x640.webp',
};

const DEFAULT_COUNTS = {
  furniture: 179,
  cutlery: 82,
  crockery: 9,
  accessories: 9,
  'bathroom-kits': 1,
};

export default function CategorySection({ cats = [], covers = {}, categoriesError }) {
  // Ordered standard categories
  const slugs = ['furniture', 'cutlery', 'crockery', 'accessories', 'bathroom-kits'];
  const orderedCats = slugs.map((slug) => {
    const existing = cats.find((c) => c.slug === slug);
    return existing || {
      slug,
      name: slug === 'bathroom-kits' ? 'Bathroom Kits' : slug.charAt(0).toUpperCase() + slug.slice(1),
      count: DEFAULT_COUNTS[slug] || 0,
      children: [],
      description: '',
    };
  });

  return (
    <section className="section section--light cats" id="categories">
      <div className="wrap">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow" data-reveal="up">One supplier, five ranges</p>
            <h2 data-reveal="up" style={{ '--reveal-i': 1 }}>
              Everything for your <span className="italic">Business and Venue</span>
            </h2>
          </div>
          <Link className="link-arrow" to="/catalogue/" data-reveal="fade">
            See the full catalogue{' '}
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        {categoriesError && <p className="notice err" role="alert">{categoriesError}</p>}

        <div className="bento">
          {orderedCats.map((category, index) => {
            const imgSrc = STAGING_IMAGES[category.slug] || referenceImages.categories[category.slug] || covers[category.slug]?.images?.[0];
            const kidsText = category.children?.length
              ? category.children.map((c) => c.name).join(' · ')
              : category.description || (category.slug === 'accessories' ? 'Everyday table and kitchen disposables, supplied in bulk.' : 'Eco-friendly guest amenity kits for Hotels and guest houses.');
            const count = category.count || DEFAULT_COUNTS[category.slug] || 0;

            return (
              <Link
                key={category.slug}
                to={`/catalogue/${category.slug}/`}
                className={`bento__tile bento__tile--${category.slug}`}
                data-reveal="up"
                style={{ '--reveal-i': index }}
                data-tilt=""
              >
                <span className="bento__media">
                  <SafeImg src={imgSrc} alt={category.name} loading="lazy" />
                </span>
                <span className="bento__shade" aria-hidden="true" />
                <span className="bento__glare" aria-hidden="true" />
                <span className="bento__body">
                  <span className="bento__count">{count} {count === 1 ? 'item' : 'items'}</span>
                  <span className="bento__name">{category.name}</span>
                  <span className="bento__kids">{kidsText}</span>
                  <span className="bento__go" aria-hidden="true">
                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
