import { Link } from 'react-router-dom';
import { useCategories } from '../hooks';
import { SITE, waLink } from '../content';
import Brand from './Brand.jsx';

function SocialIcon({ name }) {
  if (name === 'Instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.5" cy="6.8" r="1.1" fill="currentColor" />
      </svg>
    );
  }
  if (name === 'Facebook') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M13.4 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.5 1.6-1.5h1.7V3.2c-.3 0-1.3-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3v2.4H7.2v3.2H10V21h3.4z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M16.6 3c.3 2.2 1.5 3.5 3.4 3.7v3.2a8 8 0 0 1-3.4-1v6.5a6.1 6.1 0 1 1-6.1-6.1c.4 0 .8 0 1.2.1v3.4a2.9 2.9 0 1 0 1.8 2.7V3h3.1z" />
    </svg>
  );
}

export default function Footer() {
  const { data: cats } = useCategories();
  return (
    <footer className="site-footer">
      <div className="wrap foot-grid">
        <div>
          <Link to="/" aria-label="SAK Nexora home"><Brand /></Link>
          <p className="muted">Furniture, cutlery, crockery and supplies for banquet halls, hotels, restaurants and coffee shops. Premium quality at an honest price.</p>
          <p className="socials">{SITE.socials.map((s) => <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={`SAK Nexora on ${s.label}`}><SocialIcon name={s.label} /><span>{s.label}</span></a>)}</p>
        </div>
        <div>
          <h4>Catalogue</h4>
          {cats.map((c) => <Link key={c.slug} to={`/catalogue/${c.slug}`}>{c.name}</Link>)}
        </div>
        <div>
          <h4>Company</h4>
          <Link to="/about">About us</Link><Link to="/catalogue">Full catalogue</Link><Link to="/faqs">FAQs</Link><Link to="/contact">Contact</Link>
        </div>
        <div>
          <h4>Get in touch</h4>
          <a href={waLink()} target="_blank" rel="noreferrer">WhatsApp {SITE.phones[0].label}</a>
          <a href={SITE.phones[1].href}>Call {SITE.phones[1].label}</a>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <p className="muted">{SITE.address}</p>
        </div>
      </div>
      <div className="wrap legal"><span>© {new Date().getFullYear()} SAK Nexora. All rights reserved.</span><span>Peshawar, Pakistan</span></div>
      <a className="wa-float" href={waLink()} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3z" /></svg>
      </a>
    </footer>
  );
}
