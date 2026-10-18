import { Link } from 'react-router-dom';
import Brand from './Brand.jsx';

export default function Footer() {
  return (
    <footer className="site-footer section--ink">
      <div className="site-footer__glow" aria-hidden="true" />
      <div className="wrap">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Link to="/" aria-label="SAK Nexora — home">
              <Brand className="logo--footer" id="sakg-f" />
            </Link>
            <p>Furniture, cutlery, crockery and supplies for Banquet Halls, Hotels, Restaurants and Coffee Shops. Premium quality at a competitive price.</p>
            <ul className="socials">
              <li>
                <a href="https://www.instagram.com/saknexora" target="_blank" rel="noopener" aria-label="SAK Nexora on Instagram (opens in a new tab)">
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.7" />
                    <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.7" />
                    <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/share/1CSE6Dm5m1/" target="_blank" rel="noopener" aria-label="SAK Nexora on Facebook (opens in a new tab)">
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path fill="currentColor" d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4A21 21 0 0 0 14.3 4c-2.3 0-3.9 1.4-3.9 4v2.5H7.8v3h2.6V21z" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@sak.nexora" target="_blank" rel="noopener" aria-label="SAK Nexora on TikTok (opens in a new tab)">
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path fill="currentColor" d="M16.6 3h-3v12.2a2.7 2.7 0 1 1-2.7-2.7c.3 0 .6 0 .8.1V9.5a5.8 5.8 0 1 0 4.9 5.7V9a7.6 7.6 0 0 0 4.4 1.4V7.3A4.5 4.5 0 0 1 16.6 3z" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          <div className="site-footer__col">
            <h2 className="site-footer__h">Catalogue</h2>
            <ul>
              <li><Link to="/catalogue/furniture/">Furniture</Link></li>
              <li><Link to="/catalogue/cutlery/">Cutlery</Link></li>
              <li><Link to="/catalogue/crockery/">Crockery</Link></li>
              <li><Link to="/catalogue/accessories/">Accessories</Link></li>
              <li><Link to="/catalogue/bathroom-kits/">Bathroom Kits</Link></li>
            </ul>
          </div>

          <div className="site-footer__col">
            <h2 className="site-footer__h">Company</h2>
            <ul>
              <li><Link to="/about/">About us</Link></li>
              <li><Link to="/catalogue/">Full catalogue</Link></li>
              <li><Link to="/faqs/">FAQs</Link></li>
              <li><Link to="/contact/">Contact</Link></li>
            </ul>
          </div>

          <div className="site-footer__col site-footer__contact">
            <h2 className="site-footer__h">Get in touch</h2>
            <ul>
              <li>
                <a href="https://wa.me/923055827170" target="_blank" rel="noopener">
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3z" />
                  </svg>
                  <span><small>WhatsApp</small>+92 305-5827170</span>
                </a>
              </li>
              <li>
                <a href="tel:+923299342123">
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
                  </svg>
                  <span><small>Call</small>+92 329-9342123</span>
                </a>
              </li>
              <li>
                <a href="mailto:saknexora@gmail.com">
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                  <span><small>Email</small>saknexora@gmail.com</span>
                </a>
              </li>
              <li>
                <span className="site-footer__addr">
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  <span><small>Office</small>Office No. T-150, 3rd Floor, Deans Trade Centre, Peshawar, Pakistan</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <svg className="site-footer__marque" viewBox="0 0 1000 140" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="sak-marque" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e9b649" stopOpacity=".4" />
              <stop offset=".9" stopColor="#e9b649" stopOpacity=".02" />
            </linearGradient>
          </defs>
          <text
            x="500"
            y="122"
            textAnchor="middle"
            textLength="992"
            lengthAdjust="spacingAndGlyphs"
            fontFamily="Cinzel, Georgia, serif"
            fontWeight="600"
            fontSize="150"
            fill="url(#sak-marque)"
          >
            SAK NEXORA
          </text>
        </svg>

        <div className="site-footer__bottom">
          <p>© 2026 SAK Nexora. All rights reserved.</p>
          <p>Peshawar, Pakistan</p>
        </div>
      </div>
    </footer>
  );
}
