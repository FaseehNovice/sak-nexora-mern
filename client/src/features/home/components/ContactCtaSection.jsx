export default function ContactCtaSection() {
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <div className="wrap">
        <div className="cta-band__card" data-reveal="scale">
          <svg className="cta-band__hex" viewBox="0 0 100 115.5" aria-hidden="true">
            <path d="M50 2 96 28.5v58.5L50 113.5 4 87V28.5z" />
          </svg>
          <div className="cta-band__copy">
            <p className="eyebrow">Opening or refitting?</p>
            <h2 id="cta-title">
              Tell us what you need. <span className="foil-text">We’ll quote it all.</span>
            </h2>
            <p>One message covers the furniture, the cutlery and the accessories. Send a list, a photo or just the number of guests.</p>
          </div>
          <div className="cta-band__actions">
            <a
              className="btn btn--wa"
              href="https://wa.me/923055827170?text=Hi%20SAK%20Nexora%2C%20I%20would%20like%20a%20quote."
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic=""
            >
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  fill="currentColor"
                  d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3z"
                />
              </svg>{' '}
              +92 305-5827170
            </a>
            <a className="btn btn--ghost" href="tel:+923299342123">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
              </svg>{' '}
              +92 329-9342123
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
