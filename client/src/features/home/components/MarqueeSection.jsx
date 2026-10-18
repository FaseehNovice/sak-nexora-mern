
export default function MarqueeSection() {
  return (
    <section className="marquee" aria-label="Our product ranges">
        <div className="marquee-track" aria-hidden="true">
          {[0, 1].map((copy) => (
            <span className="marquee-set" key={copy}>
              {['Furniture', 'Banquet halls', 'Cutlery', 'Hotels', 'Crockery', 'Restaurants', 'Accessories', 'Coffee shops', 'Bathroom kits'].map((label) => <span className="marquee-item" key={label}>{label}</span>)}
            </span>
          ))}
        </div>
      </section>
  );
}
