import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useEnquiry } from '../context/EnquiryContext.jsx';
import { FAQS, SITE, SECTORS, waLink } from '../content';
import FAQList from '../components/FAQList.jsx';

export function About() {
  return (
    <div className="wrap page prose">
      <h1>About SAK Nexora</h1>
      <p className="lede">We supply the furniture and the everyday table-top essentials that banquet halls, hotels, restaurants and coffee shops need, from one office in Peshawar.</p>
      <p>Most hospitality businesses buy twice: once when they furnish or refit, and then every week to restock. We cover both, so one supplier can quote the chairs, the tables, the cutlery and the napkins in a single reply.</p>
      <p>We do not publish prices because the right price depends on quantity, finish and customisation. Send us your list and we quote on that, so the price you are given is the price you pay.</p>
      <h2>Who we supply</h2>
      <ul className="chips">{SECTORS.map((s) => <li key={s.key}>{s.name}</li>)}</ul>
      <h2>Visit or call</h2>
      <p>{SITE.address}. Please call ahead if you would like to see items in person.</p>
      <p className="row"><Link className="btn" to="/catalogue">Browse the catalogue</Link><a className="btn ghost" href={waLink()} target="_blank" rel="noreferrer">Ask on WhatsApp</a></p>
    </div>
  );
}

export function FAQs() {
  return (
    <div className="wrap page narrow-page">
      <h1>Frequently asked questions</h1>
      <p className="muted">Anything else, send us a message on WhatsApp.</p>
      <FAQList items={FAQS} />
    </div>
  );
}

export function Contact() {
  const { items, setQty, remove, clear, whatsappUrl } = useEnquiry();
  const [f, setF] = useState({ name: '', phone: '', email: '', business: '', message: '' });
  const [state, setState] = useState({ busy: false, done: false, error: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setState({ busy: true, done: false, error: '' });
    try {
      await api('/enquiries', { method: 'POST', body: { ...f, items } });
      clear();
      setState({ busy: false, done: true, error: '' });
    } catch (err) { setState({ busy: false, done: false, error: err.message }); }
  };

  if (state.done) return (
    <div className="wrap page narrow-page"><h1>Enquiry sent</h1>
      <p className="lede">Thank you. We will reply with prices and availability, usually on WhatsApp or by phone.</p>
      <div className="row"><Link className="btn" to="/catalogue">Keep browsing</Link><a className="btn ghost" href={waLink()} target="_blank" rel="noreferrer">Message us on WhatsApp</a></div></div>
  );

  return (
    <div className="wrap page contact">
      <div>
        <h1>Tell us what you need</h1>
        <p className="lede">Send a list, a photo or just the number of guests. We reply with a quote.</p>
        <dl className="contact-list">
          <dt>WhatsApp</dt><dd><a href={waLink()} target="_blank" rel="noreferrer">{SITE.phones[0].label}</a></dd>
          <dt>Call</dt><dd><a href={SITE.phones[1].href}>{SITE.phones[1].label}</a></dd>
          <dt>Email</dt><dd><a href={`mailto:${SITE.email}`}>{SITE.email}</a></dd>
          <dt>Office</dt><dd>{SITE.address}</dd>
        </dl>
        {items.length > 0 && (
          <div className="list-box"><h2>Your list ({items.length})</h2>
            <ul>{items.map((i) => (
              <li key={i._id}><span>{i.name}</span>
                <span className="qty"><input type="number" min="1" value={i.qty} onChange={(e) => setQty(i._id, parseInt(e.target.value))} aria-label={`Quantity of ${i.name}`} />
                  <button type="button" className="link-btn" onClick={() => remove(i._id)}>Remove</button></span></li>))}</ul>
            <a className="btn ghost small" href={whatsappUrl()} target="_blank" rel="noreferrer">Send this list on WhatsApp instead</a>
          </div>)}
      </div>

      <form className="form" onSubmit={submit}>
        <label>Name<input required value={f.name} onChange={set('name')} autoComplete="name" /></label>
        <label>Phone or WhatsApp<input required value={f.phone} onChange={set('phone')} autoComplete="tel" inputMode="tel" /></label>
        <label>Email (optional)<input type="email" value={f.email} onChange={set('email')} autoComplete="email" /></label>
        <label>Business name (optional)<input value={f.business} onChange={set('business')} /></label>
        <label>Message<textarea rows="5" value={f.message} onChange={set('message')} placeholder="Number of guests, sizes, finishes, delivery date…" /></label>
        {state.error && <p className="notice err" role="alert">{state.error}</p>}
        <button className="btn" disabled={state.busy}>{state.busy ? 'Sending…' : 'Send enquiry'}</button>
      </form>
    </div>
  );
}

export function NotFound() {
  return <div className="wrap page narrow-page"><h1>Page not found</h1><p className="lede">That page does not exist or has moved.</p><Link className="btn" to="/catalogue">Go to the catalogue</Link></div>;
}
