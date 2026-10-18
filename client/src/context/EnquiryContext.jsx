import { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react';

const Ctx = createContext(null);
export const useEnquiry = () => useContext(Ctx);

const KEY = 'sakn-list-v1';
const WA_PHONE = '923055827170';

function loadList() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(raw) ? raw.filter((r) => r && (r.id || r._id)) : [];
  } catch {
    return [];
  }
}

export function EnquiryProvider({ children }) {
  const [items, setItems] = useState(loadList);
  const [listOpen, setListOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState({ text: '', show: false });
  const toastTimer = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const showToast = useCallback((msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ text: msg, show: true });
    toastTimer.current = setTimeout(() => {
      setToast({ text: '', show: false });
    }, 2400);
  }, []);

  const has = useCallback((id) => {
    return items.some((item) => String(item.id || item._id) === String(id));
  }, [items]);

  const add = useCallback((p, quantity = 1, silent = false) => {
    const pid = String(p._id || p.id);
    let wasAdded = false;

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => String(i.id || i._id) === pid);
      if (existingIndex > -1) {
        // Toggle off if no explicit quantity specified, or update qty
        if (quantity === 1 && !p._withQty) {
          wasAdded = false;
          return prev.filter((_, idx) => idx !== existingIndex);
        }
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, qty: Math.max(1, Math.min(100000, quantity)) }
            : item
        );
      }
      wasAdded = true;
      const url = typeof window !== 'undefined'
        ? `${window.location.origin}/products/${p.slug}/`
        : `/products/${p.slug}/`;
      const newItem = {
        id: pid,
        _id: pid,
        title: p.name,
        name: p.name,
        slug: p.slug,
        url,
        thumb: p.images?.[0] || '',
        qty: Math.max(1, Math.min(100000, quantity)),
        product: p,
      };
      return [...prev, newItem];
    });

    if (!silent) {
      showToast(has(pid) && (!p._withQty && quantity === 1) ? 'Removed' : 'Added');
    }
  }, [has, showToast]);

  const toggle = useCallback((p) => {
    const pid = String(p._id || p.id);
    if (has(pid)) {
      setItems((prev) => prev.filter((i) => String(i.id || i._id) !== pid));
      showToast('Removed');
    } else {
      add(p, 1, true);
      showToast('Added');
    }
  }, [has, add, showToast]);

  const setQty = useCallback((id, qty) => {
    const pid = String(id);
    setItems((prev) =>
      prev.map((item) =>
        String(item.id || item._id) === pid
          ? { ...item, qty: Math.max(1, Math.min(100000, Number(qty) || 1)) }
          : item
      )
    );
  }, []);

  const remove = useCallback((id) => {
    const pid = String(id);
    setItems((prev) => prev.filter((item) => String(item.id || item._id) !== pid));
    showToast('Removed');
  }, [showToast]);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const whatsappUrl = useCallback(() => {
    if (!items.length) {
      return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent('Hi SAK Nexora, I have an enquiry.')}`;
    }
    const lines = ['Hi SAK Nexora, I would like a quote for:', ''];
    items.forEach((r, n) => {
      lines.push(`${n + 1}. ${r.title || r.name} — Qty: ${r.qty}`);
    });
    lines.push('');
    items.forEach((r) => {
      if (r.url) lines.push(r.url);
    });
    return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(lines.join('\n'))}`;
  }, [items]);

  const value = useMemo(() => ({
    items,
    count: items.length,
    listOpen,
    setListOpen,
    menuOpen,
    setMenuOpen,
    has,
    add,
    toggle,
    setQty,
    remove,
    clear,
    whatsappUrl,
    toast,
    showToast,
  }), [items, listOpen, menuOpen, has, add, toggle, setQty, remove, clear, whatsappUrl, toast, showToast]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className={`toast ${toast.show ? 'is-on' : ''}`} data-toast="" aria-live="polite">
        <span data-toast-text="">{toast.text}</span>
      </div>
    </Ctx.Provider>
  );
}
