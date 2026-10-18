import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { waLink } from '../content';

const Ctx = createContext(null);
export const useEnquiry = () => useContext(Ctx);

const load = () => { try { return JSON.parse(localStorage.getItem('sak-enquiry') || '[]'); } catch { return []; } };

export function EnquiryProvider({ children }) {
  const [items, setItems] = useState(load);
  const [open, setOpen] = useState(false);

  useEffect(() => { try { localStorage.setItem('sak-enquiry', JSON.stringify(items)); } catch {} }, [items]);

  const value = useMemo(() => ({
    items, open, setOpen,
    count: items.reduce((n, i) => n + i.qty, 0),
    has: (id) => items.some((i) => i._id === id),
    add: (p) => {
      setItems((prev) => prev.some((i) => i._id === p._id)
        ? prev.map((i) => (i._id === p._id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { _id: p._id, slug: p.slug, name: p.name, image: p.images?.[0], qty: 1 }]);
      setOpen(true);
    },
    setQty: (id, qty) => setItems((prev) => prev.map((i) => (i._id === id ? { ...i, qty: Math.max(1, Math.min(9999, qty || 1)) } : i))),
    remove: (id) => setItems((prev) => prev.filter((i) => i._id !== id)),
    clear: () => setItems([]),
    whatsappUrl: () => waLink(items.length
      ? `Hi SAK Nexora, I would like a quote for:\n${items.map((i) => `- ${i.name} x ${i.qty}`).join('\n')}`
      : 'Hi SAK Nexora, I would like a quote.'),
  }), [items, open]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
