import { SITE, waLink } from '../../../content.js';
import { ArrowIcon } from './HomeIcons.jsx';

export default function ContactCtaSection() {
  return (
    <section className="contact-cta">
        <div className="contact-cta-image" aria-hidden="true" />
        <div className="wrap contact-cta-inner">
          <div data-reveal="up"><p className="eyebrow">Opening or refitting?</p><h2>Tell us what you need.<br />We’ll quote it all.</h2>
            <p>One message covers the chairs, the tables, the cutlery and the napkins. Send a list, a photo or just the number of guests.</p>
          </div>
          <div className="contact-cta-actions" data-reveal="up">
            <a className="btn" href={waLink('Hi SAK Nexora, I would like a quote.')} target="_blank" rel="noreferrer">{SITE.phones[0].label} <ArrowIcon /></a>
            <a className="btn btn-ghost" href={SITE.phones[1].href}>{SITE.phones[1].label}</a>
          </div>
        </div>
      </section>
  );
}
