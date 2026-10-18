import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCategories } from '../hooks';
import { useEnquiry } from '../context/EnquiryContext.jsx';
import { waLink } from '../content';
import Brand from './Brand.jsx';

export default function Header() {
  const { data: cats } = useCategories();
  const { count, setOpen } = useEnquiry();
  const [menu, setMenu] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  useEffect(() => setMenu(false), [pathname]);

  return (
    <header className={`site-header ${isHome ? 'site-header-home' : ''}`}>
      <a className="skip" href="#main">Skip to content</a>
      <div className="wrap header-inner">
        <Link to="/" className="header-brand" aria-label="SAK Nexora home"><Brand /></Link>
        <nav className={`nav ${menu ? 'nav-open' : ''}`} aria-label="Main">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <div className="has-menu">
            <NavLink to="/catalogue">Catalogue <span className="nav-caret" aria-hidden="true">⌄</span></NavLink>
            <div className="menu">
              {cats.map((category) => (
                <div key={category.slug} className="menu-col">
                  <Link to={`/catalogue/${category.slug}`} className="menu-head">{category.name}</Link>
                  {category.children.map((child) => <Link key={child._id} to={`/catalogue/${category.slug}/${child.slug}`}>{child.name}</Link>)}
                  {!category.children.length && category.description && <p className="menu-description">{category.description}</p>}
                </div>
              ))}
              <Link to="/catalogue" className="menu-all">
                <span className="menu-all-label">Full catalogue</span>
                <span className="menu-all-title">See everything we supply</span>
                <span className="menu-all-arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <NavLink to="/faqs">FAQs</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
        <div className="header-actions">
          <button className="list-btn" onClick={() => setOpen(true)} aria-label={`Open enquiry list, ${count} items`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M8 4.5h8M8 3h8v3H8zM6 5H5v16h14V5h-1M8 10h8M8 14h8" /></svg>
            <span className="list-label">Enquiry list</span><b>{count}</b>
          </button>
          <a className="btn header-whatsapp" href={waLink()} target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3z" /></svg>
            WhatsApp
          </a>
          <button className="burger" onClick={() => setMenu((isOpen) => !isOpen)} aria-expanded={menu} aria-label={menu ? 'Close menu' : 'Open menu'}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
