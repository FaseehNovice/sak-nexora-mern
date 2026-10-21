import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCategories, useFetch } from '../hooks';
import stagingCatalogue from '../data/staging-catalogue.json';
import ProductCard from '../components/ProductCard.jsx';
import SafeImg from '../components/SafeImg.jsx';
import ContactCtaSection from '../features/home/components/ContactCtaSection.jsx';

const TILE_IMAGES = {
  chairs: 'https://res.cloudinary.com/dspo5bfyg/image/upload/v1792515610/sak-nexora/products/atrium-chair-blue-cd7d43f1-8e4a-4bd9-bb9b-d01661f334dd-1.webp',
  'sofas-seating': 'https://res.cloudinary.com/dspo5bfyg/image/upload/v1792515647/sak-nexora/products/turkish-style-sofa-with-ottoman-d7ab49ad-5073-48a6-afe2-b8abebeeaed8-1.webp',
  tables: 'https://res.cloudinary.com/dspo5bfyg/image/upload/v1792515722/sak-nexora/products/veneta-dining-table-set-04b854eb-bc50-4e44-96bd-06a6736130e4-1.webp',
  'tea-trolleys': 'https://res.cloudinary.com/dspo5bfyg/image/upload/v1792515660/sak-nexora/products/euro-gold-3-tier-tea-trolley-73109e76-324b-45e9-9217-bc6f262ac697-1.webp',
  'storage-decor': 'https://res.cloudinary.com/dspo5bfyg/image/upload/v1792515609/sak-nexora/products/ebony-chester-6d87384c-6fde-480e-b096-47a19372596a-1.webp',
  'cutlery-shine': 'https://res.cloudinary.com/dspo5bfyg/image/upload/v1792515682/sak-nexora/products/vittoria-cutlery-set-4adbdffa-f68e-485d-8141-e1b554650979-1.webp',
  'cutlery-matte': 'https://res.cloudinary.com/dspo5bfyg/image/upload/v1792515681/sak-nexora/products/dolce-matte-cutlery-set-2437a295-379e-4532-9e8f-b9418c2172d9-1.webp',
  'cutlery-gold': 'https://res.cloudinary.com/dspo5bfyg/image/upload/v1792515681/sak-nexora/products/hammered-gold-cutlery-set-94f30d0f-a3a4-4f75-94c0-0174f1423ae4-1.webp',
  'cutlery-matte-gold': 'https://res.cloudinary.com/dspo5bfyg/image/upload/v1792515682/sak-nexora/products/milano-matte-gold-cutlery-set-a94c7ab9-6649-4944-bec0-fd7d2cb203ff-1.webp',
  'buffet-servingware': 'https://res.cloudinary.com/dspo5bfyg/image/upload/v1792300878/sak-nexora/products/elara-gold-cutlery-set-a5895bc3-f749-4b8f-9ac0-81afab35c11d-1.webp',
  melamine: 'https://res.cloudinary.com/dspo5bfyg/image/upload/v1792515708/sak-nexora/products/melamine-dinner-plates-175d39f4-b776-4cdb-a123-17a8cf742b83-1.webp',
  porcelain: 'https://res.cloudinary.com/dspo5bfyg/image/upload/v1792515708/sak-nexora/products/porcelain-dinner-plates-391c207b-913a-44ca-8f60-15729e525797-1.webp',
  'pizza-pans-plates': 'https://res.cloudinary.com/dspo5bfyg/image/upload/v1792515708/sak-nexora/products/porcelain-dinner-plates-391c207b-913a-44ca-8f60-15729e525797-1.webp'
};

function categoryHref(targetSlug) {
  const cat = stagingCatalogue.categories.find((c) => c.slug === targetSlug);
  if (!cat) return `/catalogue/${targetSlug}`;
  if (!cat.parentSlug) return `/catalogue/${cat.slug}`;
  return `/catalogue/${cat.parentSlug}/${cat.slug}`;
}

export default function CatalogueOverview() {
  const { data: categories } = useCategories();
  const { data: accessoriesResult } = useFetch('/products?category=accessories&limit=60', []);
  const { data: bathroomResult } = useFetch('/products?category=bathroom-kits&limit=60', []);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Reveal all elements for catalogue overview
    const $$ = (sel) => Array.prototype.slice.call(document.querySelectorAll(sel));
    $$('[data-reveal], [data-unmask]').forEach((el) => el.classList.add('is-revealed'));
  }, [categories]);

  useEffect(() => {
    const hero = document.querySelector('.page-hero[data-hero]');
    hero?.classList.add('is-entered');
  }, []);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/catalogue?s=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const roots = categories.filter((c) => !c.parentSlug && !c.parent);
  const totalItems = roots.reduce((acc, c) => acc + (c.count || 0), 0) || 301;

  const accessoriesProducts = accessoriesResult?.items || stagingCatalogue.products.filter(
    (p) => p.categorySlug === 'accessories' || p.category?.slug === 'accessories'
  );
  const bathroomProducts = bathroomResult?.items || stagingCatalogue.products.filter(
    (p) => p.categorySlug === 'bathroom-kits' || p.category?.slug === 'bathroom-kits'
  );

  return (
    <main id="main" className="site-main" tabIndex="-1">
      <section className="page-hero" data-hero="">
        <div className="page-hero__bg" aria-hidden="true">
          <img
            src="/staging/wp-content/themes/sak-nexora/assets/images/sectors/restaurant.webp"
            alt=""
            decoding="async"
            fetchpriority="high"
          />
        </div>
        <svg className="page-hero__hex" viewBox="0 0 100 115.5" aria-hidden="true">
          <path d="M50 2 96 28.5v58.5L50 113.5 4 87V28.5z" fill="none" stroke="currentColor" strokeWidth="0.5" pathLength="1" />
        </svg>
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb" data-hero-item="" style={{ '--hero-i': 0 }}>
            <Link to="/">Home</Link>
            <span aria-hidden="true" />
            <span aria-current="page">Catalogue</span>
          </nav>
          <p className="eyebrow" data-hero-item="" style={{ '--hero-i': 1 }}>
            The catalogue
          </p>
          <h1 data-hero-item="" style={{ '--hero-i': 2 }}>
            Everything we supply, <span className="foil-text italic">in one place.</span>
          </h1>
          <p className="lede" data-hero-item="" style={{ '--hero-i': 3 }}>
            {totalItems} items across furniture, cutlery, crockery, accessories and bathroom kits. Add what you need to your list and send it to us for a quote.
          </p>
          <div className="page-hero__extra" data-hero-item="" style={{ '--hero-i': 4 }}>
            <form className="search" role="search" onSubmit={onSearchSubmit}>
              <label className="sr-only" htmlFor="search-1">
                Search the catalogue
              </label>
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                id="search-1"
                type="search"
                name="s"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search chairs, cutlery, napkins…"
                autoComplete="off"
              />
              <button className="btn btn--sm" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      <nav className="cat-jump" aria-label="Jump to a category">
        <div className="wrap chips">
          <a className="chip" href="#cat-furniture">
            Furniture <small>179</small>
          </a>
          <a className="chip" href="#cat-cutlery">
            Cutlery <small>82</small>
          </a>
          <a className="chip" href="#cat-crockery">
            Crockery <small>25</small>
          </a>
          <a className="chip" href="#cat-accessories">
            Accessories <small>11</small>
          </a>
          <a className="chip" href="#cat-bathroom-kits">
            Bathroom Kits <small>4</small>
          </a>
        </div>
      </nav>

      {/* Furniture */}
      <section className="section cat-block" id="cat-furniture">
        <div className="wrap">
          <div className="section-head section-head--split">
            <div>
              <p className="eyebrow" data-reveal="up">179 items</p>
              <h2 data-reveal="up" style={{ '--reveal-i': 1 }}>Furniture</h2>
              <p data-reveal="up" style={{ '--reveal-i': 2 }}>
                Chairs, sofas and tables for Banquet Halls, hotel lobbies, Restaurants and cafés.
              </p>
            </div>
            <Link className="link-arrow" to="/catalogue/furniture" data-reveal="fade">
              All furniture{' '}
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>

          <div className="sub-grid">
            {[
              { slug: 'chairs', name: 'Chairs', count: 39 },
              { slug: 'sofas-seating', name: 'Sofas & Seating', count: 11 },
              { slug: 'tables', name: 'Tables', count: 103 },
              { slug: 'tea-trolleys', name: 'Tea Trolleys', count: 12 },
              { slug: 'storage-decor', name: 'Storage & Décor', count: 14 }
            ].map((sub, idx) => (
              <Link
                key={sub.slug}
                className="sub-tile"
                to={`/catalogue/furniture/${sub.slug}`}
                data-reveal="up"
                style={{ '--reveal-i': idx }}
                data-tilt=""
              >
                <span className="sub-tile__media">
                  <SafeImg src={TILE_IMAGES[sub.slug]} alt="" />
                </span>
                <span className="sub-tile__body">
                  <strong>{sub.name}</strong>
                  <small>{sub.count} items</small>
                </span>
                <span className="sub-tile__go" aria-hidden="true">
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cutlery */}
      <section className="section cat-block section--paper" id="cat-cutlery">
        <div className="wrap">
          <div className="section-head section-head--split">
            <div>
              <p className="eyebrow" data-reveal="up">82 items</p>
              <h2 data-reveal="up" style={{ '--reveal-i': 1 }}>Cutlery</h2>
              <p data-reveal="up" style={{ '--reveal-i': 2 }}>
                SS-304 (18/8) stainless steel cutlery in four finishes, sold as sets for 4 to 12 settings.
              </p>
            </div>
            <Link className="link-arrow" to="/catalogue/cutlery" data-reveal="fade">
              All cutlery{' '}
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>

          <div className="sub-grid">
            {[
              { slug: 'cutlery-shine', name: 'Shine', count: 21 },
              { slug: 'cutlery-matte', name: 'Matte', count: 21 },
              { slug: 'cutlery-gold', name: 'Gold', count: 20 },
              { slug: 'cutlery-matte-gold', name: 'Matte Gold', count: 20 }
            ].map((sub, idx) => (
              <Link
                key={sub.slug}
                className="sub-tile"
                to={`/catalogue/cutlery/${sub.slug}`}
                data-reveal="up"
                style={{ '--reveal-i': idx }}
                data-tilt=""
              >
                <span className="sub-tile__media">
                  <SafeImg src={TILE_IMAGES[sub.slug]} alt="" />
                </span>
                <span className="sub-tile__body">
                  <strong>{sub.name}</strong>
                  <small>{sub.count} items</small>
                </span>
                <span className="sub-tile__go" aria-hidden="true">
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Crockery */}
      <section className="section cat-block" id="cat-crockery">
        <div className="wrap">
          <div className="section-head section-head--split">
            <div>
              <p className="eyebrow" data-reveal="up">25 items</p>
              <h2 data-reveal="up" style={{ '--reveal-i': 1 }}>Crockery</h2>
              <p data-reveal="up" style={{ '--reveal-i': 2 }}>
                Melamine for busy service, porcelain for fine dining, and pizza pans and plates for serving.
              </p>
            </div>
            <Link className="link-arrow" to="/catalogue/crockery" data-reveal="fade">
              All crockery{' '}
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>

          <div className="sub-grid">
            {[
              { slug: 'melamine', name: 'Melamine', count: 4 },
              { slug: 'porcelain', name: 'Porcelain', count: 5 },
              { slug: 'pizza-pans-plates', name: 'Pizza Pans & Plates', count: 0 },
              { slug: 'buffet-servingware', name: 'Buffet & Servingware', count: 16 }
            ].map((sub, idx) => (
              <Link
                key={sub.slug}
                className="sub-tile"
                to={`/catalogue/crockery/${sub.slug}`}
                data-reveal="up"
                style={{ '--reveal-i': idx }}
                data-tilt=""
              >
                <span className="sub-tile__media">
                  <SafeImg src={TILE_IMAGES[sub.slug]} alt="" />
                </span>
                <span className="sub-tile__body">
                  <strong>{sub.name}</strong>
                  <small>{sub.count} items</small>
                </span>
                <span className="sub-tile__go" aria-hidden="true">
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Accessories */}
      <section className="section cat-block section--paper" id="cat-accessories">
        <div className="wrap">
          <div className="section-head section-head--split">
            <div>
              <p className="eyebrow" data-reveal="up">25 items</p>
              <h2 data-reveal="up" style={{ '--reveal-i': 1 }}>Accessories</h2>
              <p data-reveal="up" style={{ '--reveal-i': 2 }}>
                Everyday table and kitchen disposables, supplied in bulk.
              </p>
            </div>
            <Link className="link-arrow" to="/catalogue/accessories" data-reveal="fade">
              All accessories{' '}
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>

          <div className="grid">
            {accessoriesProducts.map((product, idx) => (
              <ProductCard key={product.id || product._id || product.slug} p={product} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Bathroom Kits */}
      <section className="section cat-block" id="cat-bathroom-kits">
        <div className="wrap">
          <div className="section-head section-head--split">
            <div>
              <p className="eyebrow" data-reveal="up">4 items</p>
              <h2 data-reveal="up" style={{ '--reveal-i': 1 }}>Bathroom Kits</h2>
              <p data-reveal="up" style={{ '--reveal-i': 2 }}>
                Eco-friendly guest amenity kits for Hotels and guest houses.
              </p>
            </div>
            <Link className="link-arrow" to="/catalogue/bathroom-kits" data-reveal="fade">
              All bathroom kits{' '}
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>

          <div className="grid">
            {bathroomProducts.map((product, idx) => (
              <ProductCard key={product.id || product._id || product.slug} p={product} index={idx} />
            ))}
          </div>
        </div>
      </section>

      <ContactCtaSection />
    </main>
  );
}
