import { Link, useParams, useSearchParams } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import stagingCatalogue from '../data/staging-catalogue.json';
import ProductCard from '../components/ProductCard.jsx';
import ContactCtaSection from '../features/home/components/ContactCtaSection.jsx';

const CatalogueOverview = lazy(() => import('./CatalogueOverview.jsx'));

const CATEGORY_COVERS = {
  furniture: 'https://stage.saknexora.198.251.65.48.nip.io/wp-content/themes/sak-nexora/assets/images/sectors/restaurant.webp',
  chairs: 'https://stage.saknexora.198.251.65.48.nip.io/wp-content/uploads/2026/10/atrium-chair-blue-1-1400x900.webp',
  'sofas-seating': 'https://stage.saknexora.198.251.65.48.nip.io/wp-content/uploads/2026/10/turkish-style-sofa-with-ottoman-1-1400x900.webp',
  tables: 'https://stage.saknexora.198.251.65.48.nip.io/wp-content/uploads/2026/10/veneta-dining-table-set-1-1000x667.webp',
  'tea-trolleys': 'https://stage.saknexora.198.251.65.48.nip.io/wp-content/uploads/2026/10/euro-gold-3-tier-tea-trolley-1-1024x683.webp',
  'storage-decor': 'https://stage.saknexora.198.251.65.48.nip.io/wp-content/uploads/2026/10/ebony-chester-1-1000x667.webp',
  cutlery: 'https://stage.saknexora.198.251.65.48.nip.io/wp-content/uploads/2026/10/elara-gold-cutlery-set-1-1400x900.webp',
  'cutlery-shine': 'https://stage.saknexora.198.251.65.48.nip.io/wp-content/uploads/2026/10/vittoria-cutlery-set-1-1400x900.webp',
  'cutlery-matte': 'https://stage.saknexora.198.251.65.48.nip.io/wp-content/uploads/2026/10/dolce-matte-cutlery-set-1-1400x900.webp',
  'cutlery-gold': 'https://stage.saknexora.198.251.65.48.nip.io/wp-content/uploads/2026/10/hammered-gold-cutlery-set-1-1400x900.webp',
  'cutlery-matte-gold': 'https://stage.saknexora.198.251.65.48.nip.io/wp-content/uploads/2026/10/milano-matte-gold-cutlery-set-1-1400x900.webp',
  'buffet-servingware': 'https://stage.saknexora.198.251.65.48.nip.io/wp-content/uploads/2026/10/elara-gold-cutlery-set-1-1400x900.webp',
  crockery: 'https://stage.saknexora.198.251.65.48.nip.io/wp-content/uploads/2026/10/porcelain-dinner-plates-1-640x640.webp',
  melamine: 'https://stage.saknexora.198.251.65.48.nip.io/wp-content/uploads/2026/10/melamine-dinner-plates-1-640x523.webp',
  porcelain: 'https://stage.saknexora.198.251.65.48.nip.io/wp-content/uploads/2026/10/porcelain-dinner-plates-1-640x640.webp',
  'pizza-pans-plates': 'https://stage.saknexora.198.251.65.48.nip.io/wp-content/uploads/2026/10/porcelain-dinner-plates-1-640x640.webp',
  accessories: 'https://stage.saknexora.198.251.65.48.nip.io/wp-content/uploads/2026/10/napkins-1-640x640.webp',
  'bathroom-kits': 'https://stage.saknexora.198.251.65.48.nip.io/wp-content/uploads/2026/10/wooden-bathroom-amenity-kit-1-1400x900.webp'
};

function categoryHref(targetSlug) {
  const cat = stagingCatalogue.categories.find((c) => c.slug === targetSlug);
  if (!cat) return `/catalogue/${targetSlug}`;
  return cat.path;
}

function categorySlugs(targetSlug) {
  const slugs = [targetSlug];
  for (let index = 0; index < slugs.length; index += 1) {
    stagingCatalogue.categories
      .filter((category) => category.parentSlug === slugs[index])
      .forEach((category) => slugs.push(category.slug));
  }
  return slugs;
}

function categoryCount(targetSlug) {
  const slugs = new Set(categorySlugs(targetSlug));
  return stagingCatalogue.products.filter((product) => slugs.has(product.categorySlug)).length;
}

export default function Catalogue() {
  const params = useParams();
  const [sp, setSp] = useSearchParams();
  const query = sp.get('s') || sp.get('q') || '';

  if (!params.parent && !query) {
    return (
      <Suspense fallback={<div className="wrap page"><p className="muted">Loading catalogue…</p></div>}>
        <CatalogueOverview />
      </Suspense>
    );
  }

  return (
    <CategoryListing
      routeSlugs={[params.parent, params.child, params.leaf].filter(Boolean)}
      sp={sp}
      setSp={setSp}
      query={query}
    />
  );
}

function CategoryListing({ routeSlugs, sp, setSp, query }) {
  const page = parseInt(sp.get('page'), 10) || 1;

  // Find category path
  const currentSlug = routeSlugs.at(-1);
  const currentCat = stagingCatalogue.categories.find((c) => c.slug === currentSlug);
  const rootCat = routeSlugs[0] ? stagingCatalogue.categories.find((c) => c.slug === routeSlugs[0]) : null;
  const parentCat = currentCat?.parentSlug ? stagingCatalogue.categories.find((c) => c.slug === currentCat.parentSlug) : null;

  // Determine subcategory chips
  const currentChildren = currentCat
    ? stagingCatalogue.categories.filter((c) => c.parentSlug === currentCat.slug)
    : [];
  const group = currentChildren.length ? currentCat : parentCat || currentCat;
  const groupChildren = group
    ? stagingCatalogue.categories.filter((c) => c.parentSlug === group.slug)
    : [];

  // Filter products
  let filteredProducts = stagingCatalogue.products;
  if (query) {
    const q = query.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.categorySlug?.toLowerCase().includes(q) ||
        p.category?.name?.toLowerCase().includes(q)
    );
  } else if (currentCat) {
    const includedSlugs = new Set(categorySlugs(currentCat.slug));
    filteredProducts = filteredProducts.filter((p) => includedSlugs.has(p.categorySlug));
  }

  const perPage = 24;
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / perPage) || 1;
  const pagedProducts = filteredProducts.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    // Reveal newly mounted cards
    const $$ = (sel) => Array.prototype.slice.call(document.querySelectorAll(sel));
    $$('[data-reveal], [data-unmask]').forEach((el) => el.classList.add('is-revealed'));
    const hero = document.querySelector('.page-hero[data-hero]');
    hero?.classList.add('is-entered');
  }, [pagedProducts, page]);

  const goPage = (n) => {
    const nextSp = new URLSearchParams(sp);
    nextSp.set('page', n);
    setSp(nextSp);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const coverImg = (currentSlug && CATEGORY_COVERS[currentSlug]) ||
    (rootCat && CATEGORY_COVERS[rootCat.slug]) ||
    CATEGORY_COVERS.furniture;

  const eyebrowText = query
    ? 'Catalogue'
    : parentCat
    ? parentCat.name
    : 'Catalogue';

  const headingText = query
    ? `Search: ${query}`
    : currentCat?.name || 'Catalogue';

  const ledeText = query
    ? `Found ${totalItems} results matching “${query}”.`
    : currentCat?.description || 'SS-304 (18/8) stainless steel cutlery in four finishes, sold as sets for 4 to 12 settings.';

  return (
    <>
      <section className="page-hero" data-hero="">
        <div className="page-hero__bg" aria-hidden="true">
          <img src={coverImg} alt="" decoding="async" fetchpriority="high" />
        </div>
        <svg className="page-hero__hex" viewBox="0 0 100 115.5" aria-hidden="true">
          <path d="M50 2 96 28.5v58.5L50 113.5 4 87V28.5z" fill="none" stroke="currentColor" strokeWidth="0.5" pathLength="1" />
        </svg>
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb" data-hero-item="" style={{ '--hero-i': 0 }}>
            <Link to="/">Home</Link>
            <span aria-hidden="true" />
            <Link to="/catalogue">Catalogue</Link>
            {parentCat && (
              <>
                <span aria-hidden="true" />
                <Link to={categoryHref(parentCat.slug)}>{parentCat.name}</Link>
              </>
            )}
            <span aria-hidden="true" />
            <span aria-current="page">{currentCat ? currentCat.name : query ? 'Search' : 'All'}</span>
          </nav>

          <p className="eyebrow" data-hero-item="" style={{ '--hero-i': 1 }}>
            {eyebrowText}
          </p>
          <h1 data-hero-item="" style={{ '--hero-i': 2 }}>
            {headingText}
          </h1>
          <p className="lede" data-hero-item="" style={{ '--hero-i': 3 }}>
            {ledeText}
          </p>
        </div>
      </section>

      <section className="section section--tight cat-page">
        <div className="wrap">
          {group && groupChildren.length > 0 && (
            <div className="cat-bar">
              <nav className="chips" aria-label="Sub-categories">
                <Link
                  className="chip"
                  to={categoryHref(group.slug)}
                  aria-current={currentCat?.slug === group.slug ? 'page' : undefined}
                >
                  All <small>{categoryCount(group.slug)}</small>
                </Link>
                {groupChildren.map((child) => (
                  <Link
                    key={child.slug}
                    className="chip"
                    to={categoryHref(child.slug)}
                    aria-current={currentCat?.slug === child.slug ? 'page' : undefined}
                  >
                    {child.name} <small>{categoryCount(child.slug)}</small>
                  </Link>
                ))}
              </nav>
              <p className="cat-bar__count">Showing {totalItems} items</p>
            </div>
          )}

          {(!group || groupChildren.length === 0) && (
            <div className="cat-bar">
              <p className="cat-bar__count">Showing {totalItems} items</p>
            </div>
          )}

          {pagedProducts.length === 0 ? (
            <div className="empty">
              <p>Nothing matches those items yet.</p>
              <Link className="btn btn--ghost" to="/catalogue">
                Browse all products
              </Link>
            </div>
          ) : (
            <div className="grid">
              {pagedProducts.map((product, idx) => (
                <ProductCard
                  key={product.id || product._id || product.slug}
                  p={product}
                  index={idx % 4}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="navigation pagination" aria-label="Posts">
              <h2 className="screen-reader-text">Posts pagination</h2>
              <div className="nav-links">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
                  if (n === page) {
                    return (
                      <span key={n} aria-current="page" className="page-numbers current">
                        {n}
                      </span>
                    );
                  }
                  return (
                    <button
                      key={n}
                      type="button"
                      className="page-numbers"
                      onClick={() => goPage(n)}
                    >
                      {n}
                    </button>
                  );
                })}
                {page < totalPages && (
                  <button
                    type="button"
                    className="next page-numbers"
                    onClick={() => goPage(page + 1)}
                  >
                    <span className="sr-only">Next page</span>
                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>
                )}
              </div>
            </nav>
          )}
        </div>
      </section>

      <ContactCtaSection />
    </>
  );
}
