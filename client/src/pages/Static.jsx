import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useCategories } from '../hooks.js';
import { categoryCounts } from '../catalogueCounts.js';
import { useEnquiry } from '../context/EnquiryContext.jsx';
import ContactCtaSection from '../features/home/components/ContactCtaSection.jsx';
import SafeImg from '../components/SafeImg.jsx';

export function About() {
  const { data: categories } = useCategories();
  const counts = categoryCounts(categories);
  useEffect(() => {
    window.scrollTo(0, 0);
    const $$ = (sel) => Array.prototype.slice.call(document.querySelectorAll(sel));
    $$('[data-reveal], [data-unmask]').forEach((el) => el.classList.add('is-revealed'));
    document.querySelector('.page-hero[data-hero]')?.classList.add('is-entered');
  }, []);

  return (
    <main id="main" className="site-main" tabIndex="-1">
      <section className="page-hero" data-hero="">
        <div className="page-hero__bg" aria-hidden="true">
          <img
            src="/staging/wp-content/themes/sak-nexora/assets/images/sectors/hotel.webp"
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
            <span aria-current="page">About</span>
          </nav>
          <p className="eyebrow" data-hero-item="" style={{ '--hero-i': 1 }}>
            About SAK Nexora
          </p>
          <h1 data-hero-item="" style={{ '--hero-i': 2 }}>
            One supplier for the whole <span className="foil-text italic">hospitality</span> venue.
          </h1>
          <p className="lede" data-hero-item="" style={{ '--hero-i': 3 }}>
            Furniture, Cutlery, Crockery and Accessories for Banquet Halls, Hotels, Restaurants and Coffee Shops — from our office in Peshawar.
          </p>
        </div>
      </section>

      <section className="section about-story">
        <div className="wrap about-story__grid">
          <div className="about-story__media" data-parallax-img="" data-unmask="">
            <img
              src="/staging/wp-content/themes/sak-nexora/assets/images/sectors/banquet-2.webp"
              alt=""
              width="1200"
              height="800"
              loading="lazy"
              data-zoom=""
            />
          </div>
          <div className="about-story__copy">
            <p className="eyebrow" data-reveal="up">Who we are</p>
            <h2 data-reveal="up" style={{ '--reveal-i': 1 }}>
              Premium quality. <span className="italic">Competitive prices.</span>
            </h2>
            <p className="lede" data-reveal="up" style={{ '--reveal-i': 2 }}>
              SAK Nexora supplies the businesses that host people: Banquet Halls, Hotels, Restaurants and Coffee Shops.
            </p>
            <p data-reveal="up" style={{ '--reveal-i': 3 }}>
              Our idea is simple. A venue should be able to buy premium-quality furniture and tableware at a fair price, from one supplier, without chasing five different shops. So we cover the statement pieces — chairs, sofas, tables and tea trolleys — and the everyday supplies a busy kitchen and front-of-house run through every week.
            </p>
            <p data-reveal="up" style={{ '--reveal-i': 4 }}>
              Send us a list, a photo or simply the number of guests, and we quote the lot.
            </p>
            <div className="leader" data-reveal="up" style={{ '--reveal-i': 5 }}>
              <span className="hex leader__hex">
                <svg viewBox="0 0 100 115.5" aria-hidden="true">
                  <path d="M50 2 96 28.5v58.5L50 113.5 4 87V28.5z" fill="none" stroke="currentColor" strokeWidth="2.4" pathLength="1" />
                </svg>
                <span>MA</span>
              </span>
              <div>
                <strong>Mashoor Ahmad</strong>
                <span>Managing Director, SAK Nexora</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--ink values" aria-labelledby="values-title">
        <div className="wrap">
          <div className="section-head section-head--center">
            <p className="eyebrow eyebrow--center" data-reveal="up">How we work</p>
            <h2 id="values-title" data-reveal="up" style={{ '--reveal-i': 1 }}>
              What you can expect from us.
            </h2>
          </div>
          <div className="values__grid">
            <div className="value" data-reveal="up" style={{ '--reveal-i': 0 }} data-tilt="">
              <span className="hex">
                <svg viewBox="0 0 100 115.5" aria-hidden="true">
                  <path d="M50 2 96 28.5v58.5L50 113.5 4 87V28.5z" fill="none" stroke="currentColor" strokeWidth="2.4" pathLength="1" />
                </svg>
                <span>
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="M6 3h12l3 6-9 12L3 9z" />
                    <path d="M3 9h18M9 3l3 18 3-18" />
                  </svg>
                </span>
              </span>
              <h3>Premium quality</h3>
              <p>Pieces chosen to look right in a hall full of guests and to stand up to daily service.</p>
            </div>

            <div className="value" data-reveal="up" style={{ '--reveal-i': 1 }} data-tilt="">
              <span className="hex">
                <svg viewBox="0 0 100 115.5" aria-hidden="true">
                  <path d="M50 2 96 28.5v58.5L50 113.5 4 87V28.5z" fill="none" stroke="currentColor" strokeWidth="2.4" pathLength="1" />
                </svg>
                <span>
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z" />
                    <circle cx="8" cy="8" r="1.5" />
                  </svg>
                </span>
              </span>
              <h3>Competitive prices</h3>
              <p>We quote on your actual list and quantities, so the price you are given is the price you pay.</p>
            </div>

            <div className="value" data-reveal="up" style={{ '--reveal-i': 2 }} data-tilt="">
              <span className="hex">
                <svg viewBox="0 0 100 115.5" aria-hidden="true">
                  <path d="M50 2 96 28.5v58.5L50 113.5 4 87V28.5z" fill="none" stroke="currentColor" strokeWidth="2.4" pathLength="1" />
                </svg>
                <span>
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="m12 3 9 5-9 5-9-5z" />
                    <path d="m3 13 9 5 9-5" />
                  </svg>
                </span>
              </span>
              <h3>Everything in one place</h3>
              <p>Furniture, cutlery, crockery, disposables and guest kits — one supplier, one conversation.</p>
            </div>

            <div className="value" data-reveal="up" style={{ '--reveal-i': 3 }} data-tilt="">
              <span className="hex">
                <svg viewBox="0 0 100 115.5" aria-hidden="true">
                  <path d="M50 2 96 28.5v58.5L50 113.5 4 87V28.5z" fill="none" stroke="currentColor" strokeWidth="2.4" pathLength="1" />
                </svg>
                <span>
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.9A8 8 0 1 1 21 12z" />
                  </svg>
                </span>
              </span>
              <h3>Straight answers</h3>
              <p>Ask on WhatsApp and talk to a person who knows the stock, not a ticket system.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--light cats" id="categories">
        <div className="wrap">
          <div className="section-head section-head--split">
            <div>
              <p className="eyebrow" data-reveal="up">One supplier, five ranges</p>
              <h2 data-reveal="up" style={{ '--reveal-i': 1 }}>
                Everything for your <span className="italic">Business and Venue</span>
              </h2>
            </div>
            <Link className="link-arrow" to="/catalogue" data-reveal="fade">
              See the full catalogue{' '}
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>

          <div className="bento">
            <Link className="bento__tile bento__tile--furniture" to="/catalogue/furniture" data-reveal="up" style={{ '--reveal-i': 0 }} data-tilt="">
              <span className="bento__media">
                <SafeImg src="https://res.cloudinary.com/dspo5bfyg/image/upload/v1792515726/sak-nexora/products/modern-astoria-dining-table-with-toranto-chairs-511efce4-7917-4d0f-a3b5-d184ef12e7e0-1.webp" alt="Furniture" />
              </span>
              <span className="bento__shade" aria-hidden="true" />
              <span className="bento__glare" aria-hidden="true" />
              <span className="bento__body">
                <span className="bento__count">{counts.furniture} items</span>
                <span className="bento__name">Furniture</span>
                <span className="bento__kids">Chairs · Sofas &amp; Seating · Tables · Tea Trolleys · Storage &amp; Décor</span>
                <span className="bento__go" aria-hidden="true">
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </span>
              </span>
            </Link>

            <Link className="bento__tile bento__tile--cutlery" to="/catalogue/cutlery" data-reveal="up" style={{ '--reveal-i': 1 }} data-tilt="">
              <span className="bento__media">
                <SafeImg src="https://res.cloudinary.com/dspo5bfyg/image/upload/v1792300878/sak-nexora/products/elara-gold-cutlery-set-a5895bc3-f749-4b8f-9ac0-81afab35c11d-1.webp" alt="Cutlery" />
              </span>
              <span className="bento__shade" aria-hidden="true" />
              <span className="bento__glare" aria-hidden="true" />
              <span className="bento__body">
                <span className="bento__count">{counts.cutlery} items</span>
                <span className="bento__name">Cutlery</span>
                <span className="bento__kids">Shine · Matte · Gold · Matte Gold</span>
                <span className="bento__go" aria-hidden="true">
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </span>
              </span>
            </Link>

            <Link className="bento__tile bento__tile--crockery" to="/catalogue/crockery" data-reveal="up" style={{ '--reveal-i': 2 }} data-tilt="">
              <span className="bento__media">
                <SafeImg src="https://res.cloudinary.com/dspo5bfyg/image/upload/v1792515709/sak-nexora/products/porcelain-tea-cups-saucers-cd6ae5c9-33c1-4dc5-9896-3260f319a2e1-1.webp" alt="Crockery" />
              </span>
              <span className="bento__shade" aria-hidden="true" />
              <span className="bento__glare" aria-hidden="true" />
              <span className="bento__body">
                <span className="bento__count">{counts.crockery} items</span>
                <span className="bento__name">Crockery</span>
                <span className="bento__kids">Melamine · Porcelain · Pizza Pans &amp; Plates</span>
                <span className="bento__go" aria-hidden="true">
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </span>
              </span>
            </Link>

            <Link className="bento__tile bento__tile--accessories" to="/catalogue/accessories" data-reveal="up" style={{ '--reveal-i': 3 }} data-tilt="">
              <span className="bento__media">
                <SafeImg src="https://res.cloudinary.com/dspo5bfyg/image/upload/v1792515182/sak-nexora/products/napkins-2affdbd7-cc6d-496b-9fb2-65e618baad48-1.jpg" alt="Accessories" />
              </span>
              <span className="bento__shade" aria-hidden="true" />
              <span className="bento__glare" aria-hidden="true" />
              <span className="bento__body">
                <span className="bento__count">{counts.accessories} items</span>
                <span className="bento__name">Accessories</span>
                <span className="bento__kids">Everyday table and kitchen disposables, supplied in bulk.</span>
                <span className="bento__go" aria-hidden="true">
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </span>
              </span>
            </Link>

            <Link className="bento__tile bento__tile--bathroom-kits" to="/catalogue/bathroom-kits" data-reveal="up" style={{ '--reveal-i': 4 }} data-tilt="">
              <span className="bento__media">
                <SafeImg src="https://res.cloudinary.com/dspo5bfyg/image/upload/v1792515188/sak-nexora/products/wooden-bathroom-amenity-kit-95c85fab-a24c-47be-9d2b-9bf77d577de6-1.webp" alt="Bathroom Kits" />
              </span>
              <span className="bento__shade" aria-hidden="true" />
              <span className="bento__glare" aria-hidden="true" />
              <span className="bento__body">
                <span className="bento__count">{counts['bathroom-kits']} items</span>
                <span className="bento__name">Bathroom Kits</span>
                <span className="bento__kids">Eco-friendly guest amenity kits for hotels and guest houses.</span>
                <span className="bento__go" aria-hidden="true">
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="marquee about-marquee" aria-label="What we supply">
        <div className="marquee__track" data-marquee="-1">
          <div className="marquee__set">
            <span>Furniture</span><i aria-hidden="true" />
            <span>Banquet Halls</span><i aria-hidden="true" />
            <span>Cutlery</span><i aria-hidden="true" />
            <span>Hotels</span><i aria-hidden="true" />
            <span>Crockery</span><i aria-hidden="true" />
            <span>Restaurants</span><i aria-hidden="true" />
            <span>Accessories</span><i aria-hidden="true" />
            <span>Coffee Shops</span><i aria-hidden="true" />
            <span>Bathroom kits</span><i aria-hidden="true" />
          </div>
          <div className="marquee__set">
            <span>Furniture</span><i aria-hidden="true" />
            <span>Banquet Halls</span><i aria-hidden="true" />
            <span>Cutlery</span><i aria-hidden="true" />
            <span>Hotels</span><i aria-hidden="true" />
            <span>Crockery</span><i aria-hidden="true" />
            <span>Restaurants</span><i aria-hidden="true" />
            <span>Accessories</span><i aria-hidden="true" />
            <span>Coffee Shops</span><i aria-hidden="true" />
            <span>Bathroom kits</span><i aria-hidden="true" />
          </div>
        </div>
      </section>

      <div className="about-gap" aria-hidden="true" />
      <ContactCtaSection />
    </main>
  );
}

export function FAQs() {
  useEffect(() => {
    window.scrollTo(0, 0);
    const $$ = (sel) => Array.prototype.slice.call(document.querySelectorAll(sel));
    $$('[data-reveal], [data-unmask]').forEach((el) => el.classList.add('is-revealed'));
    document.querySelector('.page-hero[data-hero]')?.classList.add('is-entered');
  }, []);

  return (
    <main id="main" className="site-main" tabIndex="-1">
      <section className="page-hero" data-hero="">
        <svg className="page-hero__hex" viewBox="0 0 100 115.5" aria-hidden="true">
          <path d="M50 2 96 28.5v58.5L50 113.5 4 87V28.5z" fill="none" stroke="currentColor" strokeWidth="0.5" pathLength="1" />
        </svg>
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb" data-hero-item="" style={{ '--hero-i': 0 }}>
            <Link to="/">Home</Link>
            <span aria-hidden="true" />
            <span aria-current="page">FAQs</span>
          </nav>
          <p className="eyebrow" data-hero-item="" style={{ '--hero-i': 1 }}>
            FAQs
          </p>
          <h1 data-hero-item="" style={{ '--hero-i': 2 }}>
            Questions, <span className="foil-text italic">answered.</span>
          </h1>
          <p className="lede" data-hero-item="" style={{ '--hero-i': 3 }}>
            How ordering works, what we supply and how delivery and payment are arranged.
          </p>
        </div>
      </section>

      <section className="section faq-page">
        <div className="wrap faq-page__grid">
          <nav className="faq-page__nav" aria-label="FAQ topics">
            <a href="#ordering">Ordering</a>
            <a href="#products">Products</a>
            <a href="#delivery-payment">Delivery &amp; payment</a>
            <div className="faq-page__ask">
              <p>Not answered here?</p>
              <a
                className="btn btn--wa btn--sm"
                href="https://wa.me/923055827170?text=Hi%20SAK%20Nexora%2C%20I%20have%20a%20question."
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path
                    fill="currentColor"
                    d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3z"
                  />
                </svg>{' '}
                Ask us
              </a>
            </div>
          </nav>

          <div className="faq-page__groups">
            <div className="faq-group" id="ordering">
              <h2 data-reveal="up">Ordering</h2>
              <div className="faq" data-reveal="up" style={{ '--reveal-i': 1 }}>
                <details>
                  <summary>How do I place an order?</summary>
                  <div className="faq__a">
                    <p>Tap “Add to list” on the items you need and set the quantities. Then open your enquiry list and send it to us on WhatsApp or through the enquiry form. We reply with prices and availability, and arrange the rest with you directly.</p>
                  </div>
                </details>
                <details>
                  <summary>Why are there no prices on the website?</summary>
                  <div className="faq__a">
                    <p>Prices depend on quantity, finish and any customisation, so we quote on your actual list. That way the price you are given is the price you pay.</p>
                  </div>
                </details>
                <details>
                  <summary>Do you only supply in bulk?</summary>
                  <div className="faq__a">
                    <p>We supply Banquet Halls, Hotels, Restaurants and Coffee Shops, so most orders are in bulk. Send your quantities either way and we will tell you what we can do. <span className="confirm">To confirm: minimum order, if any</span></p>
                  </div>
                </details>
                <details>
                  <summary>Can I see an item before I order?</summary>
                  <div className="faq__a">
                    <p>Ask on WhatsApp for more photos or a short video of any item. You are also welcome at our office in Deans Trade Centre, Peshawar — please call ahead.</p>
                  </div>
                </details>
              </div>
            </div>

            <div className="faq-group" id="products">
              <h2 data-reveal="up">Products</h2>
              <div className="faq" data-reveal="up" style={{ '--reveal-i': 1 }}>
                <details>
                  <summary>Can furniture be customised?</summary>
                  <div className="faq__a">
                    <p>Many pieces can be made with a different fabric, top or finish — look for “Can be customised” on the item page, or send us your colours and sizes.</p>
                  </div>
                </details>
                <details>
                  <summary>Which cutlery finishes do you have?</summary>
                  <div className="faq__a">
                    <p>Four: mirror shine, brushed matte, gold and matte gold. Most designs come in sets for 4, 6, 8 or 12 settings.</p>
                  </div>
                </details>
                <details>
                  <summary>Melamine or porcelain — which should I choose?</summary>
                  <div className="faq__a">
                    <p>Melamine is light and very hard to break, so it suits buffets, busy restaurants and outdoor service. Porcelain is heavier and more formal, and suits fine dining, hotels and plated banquet service. Many venues use both.</p>
                  </div>
                </details>
                <details>
                  <summary>What is in the bathroom kit?</summary>
                  <div className="faq__a">
                    <p>A wooden toothbrush with toothpaste, a wooden comb, and a wooden razor with shaving cream — an eco-friendly guest kit for hotels and guest houses.</p>
                  </div>
                </details>
              </div>
            </div>

            <div className="faq-group" id="delivery-payment">
              <h2 data-reveal="up">Delivery &amp; payment</h2>
              <div className="faq" data-reveal="up" style={{ '--reveal-i': 1 }}>
                <details>
                  <summary>Do you deliver?</summary>
                  <div className="faq__a">
                    <p>Tell us your city when you enquire, and we will confirm delivery options, cost and timing with your quote. <span className="confirm">To confirm: delivery areas and charges</span></p>
                  </div>
                </details>
                <details>
                  <summary>How long does an order take?</summary>
                  <div className="faq__a">
                    <p>Items in stock are quicker; furniture made to order takes longer. We give you a date with your quote, before you commit. <span className="confirm">To confirm: typical lead times</span></p>
                  </div>
                </details>
                <details>
                  <summary>How do I pay?</summary>
                  <div className="faq__a">
                    <p>Payment terms are agreed with your quote. <span className="confirm">To confirm: accepted payment methods and any advance</span></p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactCtaSection />
    </main>
  );
}

export function Contact() {
  const { items, openListDrawer } = useEnquiry();
  const [f, setF] = useState({ name: '', phone: '', email: '', business: '', type: '', message: '' });
  const [state, setState] = useState({ busy: false, done: false, error: '' });

  useEffect(() => {
    window.scrollTo(0, 0);
    const $$ = (sel) => Array.prototype.slice.call(document.querySelectorAll(sel));
    $$('[data-reveal], [data-unmask]').forEach((el) => el.classList.add('is-revealed'));
    document.querySelector('.page-hero[data-hero]')?.classList.add('is-entered');
  }, []);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!f.name.trim()) {
      setState({ busy: false, done: false, error: 'Please enter your name.' });
      return;
    }
    if (!f.phone.trim()) {
      setState({ busy: false, done: false, error: 'Please enter a phone number we can reach.' });
      return;
    }
    setState({ busy: true, done: false, error: '' });
    try {
      await api('/enquiries', { method: 'POST', body: { ...f, items } });
      setState({ busy: false, done: true, error: '' });
    } catch (err) {
      setState({ busy: false, done: false, error: err.message || 'Something went wrong.' });
    }
  };

  return (
    <main id="main" className="site-main" tabIndex="-1">
      <section className="page-hero" data-hero="">
        <div className="page-hero__bg" aria-hidden="true">
          <img
            src="/staging/wp-content/themes/sak-nexora/assets/images/sectors/cafe-lounge.webp"
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
            <span aria-current="page">Contact</span>
          </nav>
          <p className="eyebrow" data-hero-item="" style={{ '--hero-i': 1 }}>
            Contact
          </p>
          <h1 data-hero-item="" style={{ '--hero-i': 2 }}>
            Let’s set your <span className="foil-text italic">venues.</span>
          </h1>
          <p className="lede" data-hero-item="" style={{ '--hero-i': 3 }}>
            WhatsApp is the quickest way to reach us. Prefer a form? Send your enquiry below — your enquiry list comes with it.
          </p>
        </div>
      </section>

      <section className="section contact">
        <div className="wrap contact__grid">
          <div className="contact__channels">
            <a
              className="channel channel--wa"
              href="https://wa.me/923055827170?text=Hi%20SAK%20Nexora%2C%20I%20have%20an%20enquiry."
              target="_blank"
              rel="noopener noreferrer"
              data-reveal="up"
              data-tilt=""
            >
              <span className="channel__icon">
                <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path
                    fill="currentColor"
                    d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3z"
                  />
                </svg>
              </span>
              <span>
                <small>WhatsApp</small>
                <strong>+92 305-5827170</strong>
                <em>Quickest reply</em>
              </span>
            </a>

            <a className="channel" href="tel:+923299342123" data-reveal="up" style={{ '--reveal-i': 1 }} data-tilt="">
              <span className="channel__icon">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
                </svg>
              </span>
              <span>
                <small>Call</small>
                <strong>+92 329-9342123</strong>
              </span>
            </a>

            <a className="channel" href="mailto:saknexora@gmail.com" data-reveal="up" style={{ '--reveal-i': 2 }} data-tilt="">
              <span className="channel__icon">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </span>
              <span>
                <small>Email</small>
                <strong>saknexora@gmail.com</strong>
              </span>
            </a>

            <div className="channel channel--addr" data-reveal="up" style={{ '--reveal-i': 3 }}>
              <span className="channel__icon">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              </span>
              <span>
                <small>Office</small>
                <strong>Office No. T-150, 3rd Floor, Deans Trade Centre, Peshawar, Pakistan</strong>
              </span>
            </div>

            <div className="contact__map" data-reveal="up" style={{ '--reveal-i': 4 }}>
              <iframe
                title="Map: SAK Nexora office, Deans Trade Centre, Peshawar"
                src="https://www.google.com/maps?q=Deans%20Trade%20Centre%2C%20Peshawar&amp;output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="contact__social" data-reveal="up" style={{ '--reveal-i': 5 }}>
              <p>Follow our latest stock</p>
              <ul className="socials socials--light">
                <li>
                  <a href="https://www.instagram.com/saknexora" target="_blank" rel="noopener noreferrer" aria-label="SAK Nexora on Instagram">
                    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.7" />
                      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.7" />
                      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/share/1CSE6Dm5m1/" target="_blank" rel="noopener noreferrer" aria-label="SAK Nexora on Facebook">
                    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path fill="currentColor" d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4A21 21 0 0 0 14.3 4c-2.3 0-3.9 1.4-3.9 4v2.5H7.8v3h2.6V21z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="https://www.tiktok.com/@sak.nexora" target="_blank" rel="noopener noreferrer" aria-label="SAK Nexora on TikTok">
                    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path fill="currentColor" d="M16.6 3h-3v12.2a2.7 2.7 0 1 1-2.7-2.7c.3 0 .6 0 .8.1V9.5a5.8 5.8 0 1 0 4.9 5.7V9a7.6 7.6 0 0 0 4.4 1.4V7.3A4.5 4.5 0 0 1 16.6 3z" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="contact__form" id="enquiry">
            <div className="form-card" data-reveal="up">
              <p className="eyebrow">Enquiry form</p>
              <h2>Ask for a quote</h2>

              {state.done ? (
                <div className="empty">
                  <h3>Enquiry sent</h3>
                  <p className="lede">Thank you. We will reply with prices and availability, usually on WhatsApp or by phone.</p>
                  <Link className="btn" to="/catalogue">Keep browsing</Link>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  {items.length > 0 && (
                    <div className="list-summary" data-list-summary="">
                      <div className="list-summary__head">
                        <strong>
                          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                            <path d="M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1z" />
                            <path d="M8 6H6a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-2" />
                            <path d="M9 12h6M9 16h4" />
                          </svg>{' '}
                          Your enquiry list ({items.length})
                        </strong>
                        <button type="button" className="list-summary__edit" onClick={openListDrawer}>
                          Edit
                        </button>
                      </div>
                      <ul>
                        {items.map((it) => (
                          <li key={it.id || it._id || it.slug}>
                            <span>{it.title || it.name}</span>
                            <small>× {it.qty || 1}</small>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="field-row">
                    <div className="field">
                      <label htmlFor="sak-name">Your name</label>
                      <input
                        id="sak-name"
                        name="sak_name"
                        autoComplete="name"
                        required
                        minLength={2}
                        value={f.name}
                        onChange={set('name')}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="sak-business">
                        Business name <span className="opt">(optional)</span>
                      </label>
                      <input
                        id="sak-business"
                        name="sak_business"
                        autoComplete="organization"
                        value={f.business}
                        onChange={set('business')}
                      />
                    </div>
                  </div>

                  <div className="field-row">
                    <div className="field">
                      <label htmlFor="sak-phone">Phone / WhatsApp</label>
                      <input
                        id="sak-phone"
                        name="sak_phone"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="+92 3xx-xxxxxxx"
                        required
                        value={f.phone}
                        onChange={set('phone')}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="sak-email">
                        Email <span className="opt">(optional)</span>
                      </label>
                      <input
                        id="sak-email"
                        name="sak_email"
                        type="email"
                        autoComplete="email"
                        value={f.email}
                        onChange={set('email')}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="sak-type">Your business</label>
                    <select id="sak-type" name="sak_type" value={f.type} onChange={set('type')}>
                      <option value="">Choose one</option>
                      <option>Banquet hall</option>
                      <option>Hotel</option>
                      <option>Restaurant</option>
                      <option>Coffee shop</option>
                      <option>Caterer</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="sak-message">What do you need?</label>
                    <textarea
                      id="sak-message"
                      name="sak_message"
                      placeholder="e.g. 200 banquet chairs and 25 round tables for a new hall, delivery in Peshawar"
                      value={f.message}
                      onChange={set('message')}
                    />
                  </div>

                  {state.error && <p className="notice notice--bad" role="alert">{state.error}</p>}

                  <button className="btn btn--block" type="submit" data-magnetic="" disabled={state.busy}>
                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                      <path d="M21 3 10 14M21 3l-7 18-4-7-7-4z" />
                    </svg>{' '}
                    {state.busy ? 'Sending…' : 'Send enquiry'}
                  </button>
                  <p className="form-note">We only use your details to reply to this enquiry.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export function NotFound() {
  return (
    <main id="main" className="site-main" tabIndex="-1">
      <div className="wrap page narrow-page">
        <h1>Page not found</h1>
        <p className="lede">That page does not exist or has moved.</p>
        <Link className="btn" to="/catalogue">
          Go to the catalogue
        </Link>
      </div>
    </main>
  );
}
