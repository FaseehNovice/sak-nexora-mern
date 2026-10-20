import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCategories } from '../hooks';
import { useEnquiry } from '../context/EnquiryContext.jsx';
import Brand from './Brand.jsx';

export default function Header() {
  const { data: categories } = useCategories();
  const { count, listOpen, setListOpen, menuOpen, setMenuOpen } = useEnquiry();
  const [megaOpen, setMegaOpen] = useState(false);
  const { pathname } = useLocation();
  const headerRef = useRef(null);
  const megaRef = useRef(null);
  const openTimer = useRef(null);
  const closeTimer = useRef(null);

  // Close mega and mobile menu on route change
  useEffect(() => {
    setMegaOpen(false);
    setMenuOpen(false);
  }, [pathname, setMenuOpen]);

  // Sticky and tuck behavior on scroll
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return undefined;

    let stuck = false;
    let lastY = window.scrollY;
    let queued = false;

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        const y = window.scrollY;
        const nextStuck = stuck ? y > 24 : y > 80;
        if (nextStuck !== stuck) {
          stuck = nextStuck;
          header.classList.toggle('is-stuck', stuck);
        }

        const busy = megaRef.current?.classList.contains('is-open') || menuOpen || listOpen;
        if (y < 480 || y < lastY - 6) {
          header.classList.remove('is-tucked');
        } else if (y > lastY + 6 && !busy) {
          header.classList.add('is-tucked');
        }
        lastY = y;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [menuOpen, listOpen]);

  const handlePointerEnterMega = () => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      clearTimeout(closeTimer.current);
      openTimer.current = setTimeout(() => setMegaOpen(true), 90);
    }
  };

  const handlePointerLeaveMega = () => {
    clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 220);
  };

  // Pre-mapped counts and subcategories
  const furnitureCat = categories.find((c) => c.slug === 'furniture');
  const cutleryCat = categories.find((c) => c.slug === 'cutlery');
  const crockeryCat = categories.find((c) => c.slug === 'crockery');
  const accessoriesCat = categories.find((c) => c.slug === 'accessories');
  const bathroomKitsCat = categories.find((c) => c.slug === 'bathroom-kits');

  return (
    <header className="site-header" data-header="" ref={headerRef}>
      <div className="site-header__bar wrap">
        <Link className="site-header__logo" to="/" aria-label="SAK Nexora — home">
          <Brand className="logo--header" id="sakg-h" />
        </Link>

        <nav className="site-nav" aria-label="Main">
          <ul className="site-nav__list">
            <li className="site-nav__item">
              <NavLink className="site-nav__link" to="/" end>
                Home
              </NavLink>
            </li>
            <li className="site-nav__item">
              <NavLink className="site-nav__link" to="/about/">
                About
              </NavLink>
            </li>
            <li
              className={`site-nav__item has-mega ${megaOpen ? 'is-open' : ''}`}
              ref={megaRef}
              onPointerEnter={handlePointerEnterMega}
              onPointerLeave={handlePointerLeaveMega}
            >
              <NavLink className="site-nav__link" to="/catalogue/">
                Catalogue
              </NavLink>
              <button
                className="site-nav__toggle"
                type="button"
                aria-expanded={megaOpen}
                aria-controls="mega-catalogue"
                data-mega-toggle=""
                onClick={() => setMegaOpen(!megaOpen)}
              >
                <span className="sr-only">Show catalogue categories</span>
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <div className="mega" id="mega-catalogue" data-mega="">
                <div className="mega__inner wrap">
                  <div className="mega__col">
                    <Link className="mega__head" to="/catalogue/furniture/">
                      Furniture <span>{furnitureCat?.count ?? 179}</span>
                    </Link>
                    <ul>
                      <li><Link to="/catalogue/furniture/chairs/">Chairs</Link></li>
                      <li><Link to="/catalogue/furniture/sofas-seating/">Sofas &amp; Seating</Link></li>
                      <li><Link to="/catalogue/furniture/tables/">Tables</Link></li>
                      <li><Link to="/catalogue/furniture/tea-trolleys/">Tea Trolleys</Link></li>
                      <li><Link to="/catalogue/furniture/storage-decor/">Storage &amp; Décor</Link></li>
                    </ul>
                  </div>
                  <div className="mega__col">
                    <Link className="mega__head" to="/catalogue/cutlery/">
                      Cutlery <span>{cutleryCat?.count ?? 82}</span>
                    </Link>
                    <ul>
                      <li><Link to="/catalogue/cutlery/cutlery-shine/">Shine</Link></li>
                      <li><Link to="/catalogue/cutlery/cutlery-matte/">Matte</Link></li>
                      <li><Link to="/catalogue/cutlery/cutlery-gold/">Gold</Link></li>
                      <li><Link to="/catalogue/cutlery/cutlery-matte-gold/">Matte Gold</Link></li>
                    </ul>
                  </div>
                  <div className="mega__col">
                    <Link className="mega__head" to="/catalogue/crockery/">
                      Crockery <span>{crockeryCat?.count ?? 25}</span>
                    </Link>
                    <ul>
                      <li><Link to="/catalogue/crockery/melamine/">Melamine</Link></li>
                      <li><Link to="/catalogue/crockery/porcelain/">Porcelain</Link></li>
                      <li><Link to="/catalogue/crockery/pizza-pans-plates/">Pizza Pans &amp; Plates</Link></li>
                      <li><Link to="/catalogue/crockery/buffet-servingware/">Buffet &amp; Servingware</Link></li>
                    </ul>
                  </div>
                  <div className="mega__col">
                    <Link className="mega__head" to="/catalogue/accessories/">
                      Accessories <span>{accessoriesCat?.count ?? 11}</span>
                    </Link>
                    <p>Everyday table and kitchen disposables, supplied in bulk.</p>
                  </div>
                  <div className="mega__col">
                    <Link className="mega__head" to="/catalogue/bathroom-kits/">
                      Bathroom Kits <span>{bathroomKitsCat?.count ?? 4}</span>
                    </Link>
                    <p>Eco-friendly guest amenity kits for Hotels and guest houses.</p>
                  </div>
                  <Link className="mega__all" to="/catalogue/">
                    <span className="eyebrow">Full catalogue</span>
                    <strong>See everything we supply</strong>
                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </li>
            <li className="site-nav__item">
              <NavLink className="site-nav__link" to="/faqs/">
                FAQs
              </NavLink>
            </li>
            <li className="site-nav__item">
              <NavLink className="site-nav__link" to="/contact/">
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="site-header__actions">
          <button
            className="list-btn"
            type="button"
            data-list-open=""
            aria-controls="enquiry-list"
            aria-expanded={listOpen}
            onClick={() => setListOpen(true)}
          >
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1z" />
              <path d="M8 6H6a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-2" />
              <path d="M9 12h6M9 16h4" />
            </svg>
            <span className="list-btn__label">Enquiry list</span>
            <span className="list-count" data-list-count="" aria-live="polite">
              {count}
            </span>
          </button>
          <a
            className="btn btn--sm site-header__cta"
            href="https://wa.me/923055827170?text=Hi%20SAK%20Nexora%2C%20I%20have%20an%20enquiry."
            target="_blank"
            rel="noopener"
            data-magnetic=""
          >
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3z" />
            </svg>
            <span>WhatsApp</span>
          </a>
          <button
            className="menu-btn"
            type="button"
            data-drawer-open=""
            aria-controls="drawer"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
            <span className="sr-only">Open menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}