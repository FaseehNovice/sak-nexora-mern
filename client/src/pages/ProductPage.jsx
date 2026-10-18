import { Fragment, useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCategories, useFetch } from '../hooks';
import { useEnquiry } from '../context/EnquiryContext.jsx';
import stagingCatalogue from '../data/staging-catalogue.json';
import SafeImg from '../components/SafeImg.jsx';
import ProductCard from '../components/ProductCard.jsx';

function categoryHref(targetSlug) {
  const cat = stagingCatalogue.categories.find((c) => c.slug === targetSlug);
  if (!cat) return `/catalogue/${targetSlug}`;
  if (!cat.parentSlug) return `/catalogue/${cat.slug}`;
  return `/catalogue/${cat.parentSlug}/${cat.slug}`;
}

export default function ProductPage() {
  const { slug } = useParams();
  const { data: apiProduct, loading } = useFetch(`/products/${slug}`, [slug]);
  const { data: categories } = useCategories();
  const { add, has } = useEnquiry();

  // Find product from API or staging fallback
  const fallbackProduct = stagingCatalogue.products.find((p) => p.slug === slug);
  const p = apiProduct || fallbackProduct;

  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const touchStartRef = useRef(0);

  const images = p?.images?.length ? p.images : (p?.image ? [p.image] : []);
  const title = p?.title || p?.name || 'Product';
  const categorySlug = p?.categorySlug || p?.category?.slug || '';
  const currentCat = stagingCatalogue.categories.find((c) => c.slug === categorySlug);
  const parentCat = currentCat?.parentSlug ? stagingCatalogue.categories.find((c) => c.slug === currentCat.parentSlug) : null;
  const rootCat = parentCat?.parentSlug ? stagingCatalogue.categories.find((c) => c.slug === parentCat.parentSlug) : (parentCat || currentCat);

  // Related products
  const relatedProducts = stagingCatalogue.products
    .filter((item) => item.categorySlug === categorySlug && item.slug !== slug)
    .slice(0, 10);

  useEffect(() => {
    setImageIndex(0);
    setQuantity(1);
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (p) {
      document.title = `${title} · SAK Nexora`;
    }
  }, [p, title]);

  const showImage = (idx) => {
    if (!images.length) return;
    setImageIndex((idx + images.length) % images.length);
  };

  if (!p && loading) {
    return (
      <div className="wrap page">
        <p className="muted">Loading item…</p>
      </div>
    );
  }

  if (!p) {
    return (
      <div className="wrap page">
        <p className="notice notice--bad" role="alert">Item not found.</p>
        <Link to="/catalogue" className="btn">
          Back to the catalogue
        </Link>
      </div>
    );
  }

  const itemId = p.id || p._id || p.slug;
  const isInList = has(itemId);
  const itemUrl = `${window.location.origin}/products/${slug}/`;
  const waUrl = `https://wa.me/923055827170?text=${encodeURIComponent(`Hi SAK Nexora, I'd like a quote for: ${title} ${itemUrl}`)}`;

  const specsList = Array.isArray(p.specs)
    ? p.specs
    : Array.isArray(p.specifications)
    ? p.specifications
    : typeof p.specs === 'object' && p.specs !== null
    ? Object.entries(p.specs).map(([label, value]) => ({ label, value }))
    : [];

  return (
    <main id="main" className="site-main" tabIndex="-1">
      <div className="item-top">
        <div className="wrap">
          <nav className="crumbs crumbs--light" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true" />
            <Link to="/catalogue">Catalogue</Link>
            {rootCat && rootCat.slug !== currentCat?.slug && (
              <>
                <span aria-hidden="true" />
                <Link to={categoryHref(rootCat.slug)}>{rootCat.name}</Link>
              </>
            )}
            {parentCat && parentCat.slug !== rootCat?.slug && (
              <>
                <span aria-hidden="true" />
                <Link to={categoryHref(parentCat.slug)}>{parentCat.name}</Link>
              </>
            )}
            {currentCat && (
              <>
                <span aria-hidden="true" />
                <Link to={categoryHref(currentCat.slug)}>{currentCat.name}</Link>
              </>
            )}
          </nav>
        </div>
      </div>

      <article className="section section--tight item">
        <div className="wrap item__grid">
          <div
            className="item__gallery"
            data-gallery=""
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') showImage(imageIndex - 1);
              if (e.key === 'ArrowRight') showImage(imageIndex + 1);
            }}
          >
            <div
              className="item__main"
              onTouchStart={(e) => {
                touchStartRef.current = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                const delta = e.changedTouches[0].clientX - touchStartRef.current;
                if (Math.abs(delta) > 40) showImage(imageIndex + (delta < 0 ? 1 : -1));
              }}
            >
              {images.map((src, idx) => (
                <figure
                  key={src + idx}
                  className={`item__slide ${idx === imageIndex ? 'is-active' : ''}`}
                  data-slide={idx}
                  aria-hidden={idx !== imageIndex}
                >
                  <SafeImg
                    src={src}
                    alt={idx === 0 ? title : `${title} — photo ${idx + 1}`}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    fetchPriority={idx === 0 ? 'high' : 'auto'}
                  />
                </figure>
              ))}
              {images.length > 1 && (
                <>
                  <button
                    className="item__arrow item__arrow--prev"
                    type="button"
                    data-gal-prev=""
                    aria-label="Previous photo"
                    onClick={() => showImage(imageIndex - 1)}
                  >
                    <svg className="icon flip" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>
                  <button
                    className="item__arrow item__arrow--next"
                    type="button"
                    data-gal-next=""
                    aria-label="Next photo"
                    onClick={() => showImage(imageIndex + 1)}
                  >
                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="item__thumbs" role="tablist" aria-label="Photos">
                {images.map((src, idx) => (
                  <button
                    key={src + idx}
                    className={`item__thumb ${idx === imageIndex ? 'is-active' : ''}`}
                    type="button"
                    role="tab"
                    aria-selected={idx === imageIndex}
                    data-thumb={idx}
                    aria-label={`Photo ${idx + 1}`}
                    onClick={() => showImage(idx)}
                  >
                    <SafeImg src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="item__info">
            {currentCat && (
              <Link className="eyebrow item__cat" to={categoryHref(currentCat.slug)}>
                {currentCat.name}
              </Link>
            )}
            <h1 className="item__title">{title}</h1>

            <p className="badge">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M3 17 17 3l4 4L7 21z" />
                <path d="m7 13 2 2M10 10l2 2M13 7l2 2" />
              </svg>{' '}
              Can be customised — size, fabric, top or finish
            </p>

            {p.finish && <p className="badge">Finish: {p.finish}</p>}

            <div className="item__desc">
              {(p.description || 'Send us your quantities and we will quote it directly.').split(/\n\n+/).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {specsList.length > 0 && (
              <dl className="specs">
                {specsList.map((spec, i) => (
                  <div className="specs__row" key={spec.label || i}>
                    <dt>{spec.label || spec.name}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="item__order">
              <div className="item__qty">
                <label htmlFor="item-qty">Quantity</label>
                <div className="qty qty--light">
                  <button
                    type="button"
                    data-qty-step="-1"
                    aria-label="Fewer"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                      <path d="M5 12h14" />
                    </svg>
                  </button>
                  <input
                    id="item-qty"
                    type="number"
                    min="1"
                    max="100000"
                    value={quantity}
                    inputMode="numeric"
                    data-item-qty=""
                    onChange={(e) => setQuantity(Math.max(1, Math.min(100000, Number(e.target.value) || 1)))}
                  />
                  <button
                    type="button"
                    data-qty-step="1"
                    aria-label="More"
                    onClick={() => setQuantity((q) => Math.min(100000, q + 1))}
                  >
                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                </div>
              </div>

              <button
                className={`btn item__add ${isInList ? 'is-in' : ''}`}
                type="button"
                data-add-item=""
                data-id={itemId}
                data-title={title}
                data-url={itemUrl}
                data-thumb={images[0] || ''}
                data-with-qty=""
                onClick={() => add(p, quantity)}
              >
                <svg className="icon i-add" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <svg className="icon i-done" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d="m5 12 5 5 9-10" />
                </svg>
                <span data-add-label="">
                  {isInList ? 'Add more to enquiry list' : 'Add to enquiry list'}
                </span>
              </button>
            </div>

            <div className="btn-row item__alt">
              <a
                className="btn btn--wa"
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic=""
              >
                <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path
                    fill="currentColor"
                    d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3z"
                  />
                </svg>{' '}
                Ask about this item
              </a>
              <a className="btn btn--ghost" href="tel:+923299342123">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
                </svg>{' '}
                +92 329-9342123
              </a>
            </div>

            <p className="item__note">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z" />
                <circle cx="8" cy="8" r="1.5" />
              </svg>{' '}
              Prices depend on quantity and finish — send your list and we reply with a quote.
            </p>
          </div>
        </div>
      </article>

      {relatedProducts.length > 0 && (
        <section className="section section--paper related" aria-labelledby="related-title">
          <div className="wrap">
            <div className="section-head section-head--split">
              <div>
                <p className="eyebrow">{currentCat?.name || 'Related'}</p>
                <h2 id="related-title">More like this</h2>
              </div>
              {currentCat && (
                <Link className="link-arrow" to={categoryHref(currentCat.slug)}>
                  See all{' '}
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
          <div className="rail">
            <div className="rail__track" data-rail="">
              {relatedProducts.map((relItem) => (
                <ProductCard
                  key={relItem.id || relItem._id || relItem.slug}
                  p={relItem}
                  className="rail__item"
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
