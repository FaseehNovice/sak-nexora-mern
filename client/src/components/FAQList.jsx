import { useState } from 'react';

export default function FAQList({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq">
      {items.map((f, i) => (
        <div key={f.q} className={`faq-item ${open === i ? 'open' : ''}`}>
          <h3><button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>{f.q}<i aria-hidden="true" /></button></h3>
          {open === i && <p>{f.a}</p>}
        </div>
      ))}
    </div>
  );
}
