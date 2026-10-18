import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useEnquiry } from '../context/EnquiryContext.jsx';
import Brand from './Brand.jsx';

export default function EnquiryDrawer() {
  const {
    items,
    listOpen,
    setListOpen,
    menuOpen,
    setMenuOpen,
    setQty,
    remove,
    clear,
    whatsappUrl,
  } = useEnquiry();

  const [waVisible, setWaVisible] = useState(false);

  // Focus trap / ESC to close
  useEffect(() => {
    if (!listOpen && !menuOpen) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setListOpen(false);
        setMenuOpen(false);
      }
    };

    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.documentElement.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [listOpen, menuOpen, setListOpen, setMenuOpen]);

  // Floating WhatsApp scroll visibility
  useEffect(() => {
    const handleScroll = () => {
      setWaVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    const timer = setTimeout(() => setWaVisible(true), 4500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {/* 1. Mobile Menu Drawer */}
      <div
        className={`drawer ${menuOpen ? 'is-open' : ''}`}
        id="drawer"
        data-drawer=""
        hidden={!menuOpen}
      >
        <div className="drawer__scrim" data-drawer-close="" onClick={() => setMenuOpen(false)} />
        <div className="drawer__panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="drawer__head">
            <Brand className="logo--drawer" id="sakg-d" />
            <button
              className="icon-btn"
              type="button"
              data-drawer-close=""
              onClick={() => setMenuOpen(false)}
            >
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          <nav aria-label="Mobile">
            <ul className="drawer__nav">
              <li>
                <NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink>
              </li>
              <li>
                <NavLink to="/about/" onClick={() => setMenuOpen(false)}>About</NavLink>
              </li>
              <li>
                <NavLink to="/catalogue/" onClick={() => setMenuOpen(false)}>Catalogue</NavLink>
                <ul className="drawer__sub">
                  <li><Link to="/catalogue/furniture/" onClick={() => setMenuOpen(false)}>Furniture</Link></li>
                  <li><Link to="/catalogue/cutlery/" onClick={() => setMenuOpen(false)}>Cutlery</Link></li>
                  <li><Link to="/catalogue/crockery/" onClick={() => setMenuOpen(false)}>Crockery</Link></li>
                  <li><Link to="/catalogue/crockery/pizza-pans-plates/" onClick={() => setMenuOpen(false)}>Pizza Pans &amp; Plates</Link></li>
                  <li><Link to="/catalogue/crockery/buffet-servingware/" onClick={() => setMenuOpen(false)}>Buffet &amp; Servingware</Link></li>
                  <li><Link to="/catalogue/accessories/" onClick={() => setMenuOpen(false)}>Accessories</Link></li>
                  <li><Link to="/catalogue/bathroom-kits/" onClick={() => setMenuOpen(false)}>Bathroom Kits</Link></li>
                </ul>
              </li>
              <li>
                <NavLink to="/faqs/" onClick={() => setMenuOpen(false)}>FAQs</NavLink>
              </li>
              <li>
                <NavLink to="/contact/" onClick={() => setMenuOpen(false)}>Contact</NavLink>
              </li>
            </ul>
          </nav>
          <div className="drawer__foot">
            <a className="btn btn--wa btn--block" href="https://wa.me/923055827170?text=Hi%20SAK%20Nexora%2C%20I%20have%20an%20enquiry." target="_blank" rel="noopener">
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3z" /></svg>
              +92 305-5827170
            </a>
            <a className="btn btn--ghost btn--block" href="tel:+923299342123">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>
              +92 329-9342123
            </a>
            <ul className="socials socials--drawer">
              <li>
                <a href="https://www.instagram.com/saknexora" target="_blank" rel="noopener" aria-label="SAK Nexora on Instagram (opens in a new tab)">
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.7" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.7" /><circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" /></svg>
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/share/1CSE6Dm5m1/" target="_blank" rel="noopener" aria-label="SAK Nexora on Facebook (opens in a new tab)">
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4A21 21 0 0 0 14.3 4c-2.3 0-3.9 1.4-3.9 4v2.5H7.8v3h2.6V21z" /></svg>
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@sak.nexora" target="_blank" rel="noopener" aria-label="SAK Nexora on TikTok (opens in a new tab)">
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M16.6 3h-3v12.2a2.7 2.7 0 1 1-2.7-2.7c.3 0 .6 0 .8.1V9.5a5.8 5.8 0 1 0 4.9 5.7V9a7.6 7.6 0 0 0 4.4 1.4V7.3A4.5 4.5 0 0 1 16.6 3z" /></svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Enquiry List Drawer */}
      <div
        className={`drawer drawer--list ${listOpen ? 'is-open' : ''}`}
        id="enquiry-list"
        data-list-drawer=""
        hidden={!listOpen}
      >
        <div className="drawer__scrim" data-list-close="" onClick={() => setListOpen(false)} />
        <div className="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="list-title">
          <div className="drawer__head">
            <div>
              <p className="eyebrow">No prices, no checkout</p>
              <h2 id="list-title" className="drawer__title">Your enquiry list</h2>
            </div>
            <button
              className="icon-btn"
              type="button"
              data-list-close=""
              onClick={() => setListOpen(false)}
            >
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
              <span className="sr-only">Close list</span>
            </button>
          </div>

          {items.length === 0 ? (
            <div className="list-empty" data-list-empty="">
              <span className="hex">
                <svg viewBox="0 0 100 115.5" aria-hidden="true">
                  <path d="M50 2 96 28.5v58.5L50 113.5 4 87V28.5z" fill="none" stroke="currentColor" strokeWidth="2.4" pathLength="1" />
                </svg>
                <span>
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1z" />
                    <path d="M8 6H6a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-2" />
                    <path d="M9 12h6M9 16h4" />
                  </svg>
                </span>
              </span>
              <p>Your list is empty. Add items from the catalogue, set quantities, then send the whole list to us in one message.</p>
              <Link className="btn btn--sm" to="/catalogue/" onClick={() => setListOpen(false)}>
                Browse the catalogue
              </Link>
            </div>
          ) : (
            <>
              <ul className="list-items" data-list-items="">
                {items.map((item) => (
                  <li className="list-row" key={item.id || item._id}>
                    <img className="list-row__thumb" src={item.thumb} alt="" width="60" height="60" />
                    <div className="list-row__body">
                      <Link to={item.slug ? `/products/${item.slug}/` : item.url} onClick={() => setListOpen(false)}>
                        {item.title || item.name}
                      </Link>
                      <div className="qty qty--sm">
                        <button
                          type="button"
                          aria-label="Fewer"
                          onClick={() => setQty(item.id || item._id, Math.max(1, item.qty - 1))}
                        >
                          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                            <path d="M5 12h14" />
                          </svg>
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="100000"
                          value={item.qty}
                          onChange={(e) => setQty(item.id || item._id, e.target.value)}
                        />
                        <button
                          type="button"
                          aria-label="More"
                          onClick={() => setQty(item.id || item._id, item.qty + 1)}
                        >
                          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <button
                      className="list-row__del"
                      type="button"
                      aria-label="Remove"
                      onClick={() => remove(item.id || item._id)}
                    >
                      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                        <path d="M6 6l12 12M18 6 6 18" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="drawer__foot list-foot" data-list-foot="">
                <p className="list-foot__note">We reply with prices and availability for your quantities.</p>
                <a className="btn btn--wa btn--block" href={whatsappUrl()} target="_blank" rel="noopener" data-list-wa="">
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3z" />
                  </svg>
                  Send list on WhatsApp
                </a>
                <Link
                  className="btn btn--ghost btn--block"
                  to="/contact/#enquiry"
                  onClick={() => setListOpen(false)}
                >
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                  Send with the enquiry form
                </Link>
                <button className="list-clear" type="button" data-list-clear="" onClick={clear}>
                  Clear list
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 3. Floating WhatsApp Button */}
      <a
        className={`wa-float ${waVisible ? 'is-visible' : ''}`}
        href="https://wa.me/923055827170?text=Hi%20SAK%20Nexora%2C%20I%20have%20an%20enquiry."
        target="_blank"
        rel="noopener"
        data-wa-float=""
        aria-label="Chat with SAK Nexora on WhatsApp"
      >
        <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3z" />
        </svg>
        <span>Chat with us</span>
      </a>
    </>
  );
}
