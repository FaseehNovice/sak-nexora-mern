import { Fragment } from 'react';

const ITEMS = [
  'Furniture',
  'Crockery',
  'Cutlery',
  'Accessories',
  'Bathroom Kits',
];

export default function MarqueeSection() {
  return (
    <section className="marquee" aria-label="Our product ranges">
      <div className="marquee__track" data-marquee="-1" aria-hidden="true">
        {[0, 1].map((copy) => (
          <div className="marquee__set" key={copy}>
            {ITEMS.map((label) => (
              <Fragment key={label}>
                <span>{label}</span>
                <i aria-hidden="true" />
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
