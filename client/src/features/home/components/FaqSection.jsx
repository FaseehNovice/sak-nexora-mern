import { Link } from 'react-router-dom';

const HOME_FAQS = [
  {
    q: 'How do I place an order?',
    a: 'Tap “Add to list” on the items you need and set the quantities. Then open your enquiry list and send it to us on WhatsApp or through the enquiry form. We reply with prices and availability, and arrange the rest with you directly.'
  },
  {
    q: 'Why are there no prices on the website?',
    a: 'Prices depend on quantity, finish and any customisation, so we quote on your actual list. That way the price you are given is the price you pay.'
  },
  {
    q: 'Do you only supply in bulk?',
    a: (
      <>
        We supply Banquet Halls, Hotels, Restaurants and Coffee Shops, so most orders are in bulk. Send your quantities either way and we will tell you what we can do. <span className="confirm">To confirm: minimum order, if any</span>
      </>
    )
  },
  {
    q: 'Can I see an item before I order?',
    a: 'Ask on WhatsApp for more photos or a short video of any item. You are also welcome at our office in Deans Trade Centre, Peshawar — please call ahead.'
  }
];

export default function FaqSection() {
  return (
    <section className="section section--paper home-faq" aria-labelledby="hfaq-title">
      <div className="wrap home-faq__grid">
        <div>
          <p className="eyebrow" data-reveal="up">Questions</p>
          <h2 id="hfaq-title" data-reveal="up" style={{ '--reveal-i': 1 }}>
            Before you ask.
          </h2>
          <p className="lede" data-reveal="up" style={{ '--reveal-i': 2 }}>
            The things buyers ask us most. Anything else, just send us a message.
          </p>
          <Link className="link-arrow" to="/faqs" data-reveal="fade">
            All FAQs{' '}
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
        <div className="faq" data-reveal="up" style={{ '--reveal-i': 1 }}>
          {HOME_FAQS.map((faq) => (
            <details key={faq.q}>
              <summary>{faq.q}</summary>
              <div className="faq__a">
                <p>{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
