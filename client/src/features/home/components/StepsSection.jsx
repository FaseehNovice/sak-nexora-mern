import { Link } from 'react-router-dom';

export default function StepsSection() {
  return (
    <section className="section section--light steps" aria-labelledby="steps-title" data-steps="">
      <div className="wrap">
        <div className="section-head section-head--center">
          <p className="eyebrow eyebrow--center" data-reveal="up">How ordering works</p>
          <h2 id="steps-title" data-reveal="up" style={{ '--reveal-i': 1 }}>
            From catalogue to quote <span className="italic">in three steps.</span>
          </h2>
        </div>
        <ol className="steps__list">
          <span className="steps__line" aria-hidden="true">
            <span data-steps-fill="" />
          </span>

          <li className="step" data-reveal="up" style={{ '--reveal-i': 0 }}>
            <span className="hex step__hex">
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
            <span className="step__n">Step 1</span>
            <h3>Build your list</h3>
            <p>Browse the catalogue and tap “Add to list” on anything you need. Set the quantity for each item.</p>
          </li>

          <li className="step" data-reveal="up" style={{ '--reveal-i': 1 }}>
            <span className="hex step__hex">
              <svg viewBox="0 0 100 115.5" aria-hidden="true">
                <path d="M50 2 96 28.5v58.5L50 113.5 4 87V28.5z" fill="none" stroke="currentColor" strokeWidth="2.4" pathLength="1" />
              </svg>
              <span>
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d="M21 3 10 14M21 3l-7 18-4-7-7-4z" />
                </svg>
              </span>
            </span>
            <span className="step__n">Step 2</span>
            <h3>Send it in one message</h3>
            <p>Send the whole list on WhatsApp or through the enquiry form. No account, no checkout.</p>
          </li>

          <li className="step" data-reveal="up" style={{ '--reveal-i': 2 }}>
            <span className="hex step__hex">
              <svg viewBox="0 0 100 115.5" aria-hidden="true">
                <path d="M50 2 96 28.5v58.5L50 113.5 4 87V28.5z" fill="none" stroke="currentColor" strokeWidth="2.4" pathLength="1" />
              </svg>
              <span>
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d="m11 17 2 2a1.4 1.4 0 0 0 2-2" />
                  <path d="m14 14 2.5 2.5a1.4 1.4 0 0 0 2-2l-3.9-3.9a2.8 2.8 0 0 0-4 0l-.9.9a1.4 1.4 0 1 1-2-2l2.8-2.8a4 4 0 0 1 5 0l.6.5a2 2 0 0 0 1.4.5H21" />
                  <path d="M21 3v11h-2M3 3v11h6" />
                </svg>
              </span>
            </span>
            <span className="step__n">Step 3</span>
            <h3>Get your quote</h3>
            <p>We reply with prices and availability for your quantities, then arrange supply with you.</p>
          </li>
        </ol>

        <div className="steps__cta btn-row" data-reveal="up">
          <Link className="btn" to="/catalogue" data-magnetic="">
            Start your list{' '}
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
