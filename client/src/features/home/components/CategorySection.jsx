import { Link } from 'react-router-dom';
import SafeImg from '../../../components/SafeImg.jsx';
import { referenceImages } from '../../../referenceImages.js';
import { categoryCount } from '../../../catalogueCounts.js';

const STAGING_IMAGES = {
  furniture: 'https://res.cloudinary.com/dspo5bfyg/image/upload/v1792515726/sak-nexora/products/modern-astoria-dining-table-with-toranto-chairs-511efce4-7917-4d0f-a3b5-d184ef12e7e0-1.webp',
  cutlery: 'https://res.cloudinary.com/dspo5bfyg/image/upload/v1792300878/sak-nexora/products/elara-gold-cutlery-set-a5895bc3-f749-4b8f-9ac0-81afab35c11d-1.webp',
  crockery: 'https://res.cloudinary.com/dspo5bfyg/image/upload/v1792515709/sak-nexora/products/porcelain-tea-cups-saucers-cd6ae5c9-33c1-4dc5-9896-3260f319a2e1-1.webp',
  accessories: 'https://res.cloudinary.com/dspo5bfyg/image/upload/v1792515182/sak-nexora/products/napkins-2affdbd7-cc6d-496b-9fb2-65e618baad48-1.jpg',
  'bathroom-kits': 'https://res.cloudinary.com/dspo5bfyg/image/upload/v1792515188/sak-nexora/products/wooden-bathroom-amenity-kit-95c85fab-a24c-47be-9d2b-9bf77d577de6-1.webp',
};



export default function CategorySection({ cats = [], covers = {}, categoriesError }) {
  // Ordered standard categories
  const slugs = ['furniture', 'cutlery', 'crockery', 'accessories', 'bathroom-kits'];
  const orderedCats = slugs.map((slug) => {
    const existing = cats.find((c) => c.slug === slug);
    return existing || {
      slug,
      name: slug === 'bathroom-kits' ? 'Bathroom Kits' : slug.charAt(0).toUpperCase() + slug.slice(1),
      count: categoryCount(cats, slug),
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
            const imgSrc = category.image || STAGING_IMAGES[category.slug] || referenceImages.categories[category.slug] || covers[category.slug]?.images?.[0];
            const kidsText = category.children?.length
              ? category.children.map((c) => c.name).join(' · ')
              : category.description || (category.slug === 'accessories' ? 'Everyday table and kitchen disposables, supplied in bulk.' : 'Eco-friendly guest amenity kits for Hotels and guest houses.');
            const count = categoryCount(cats, category.slug);

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
