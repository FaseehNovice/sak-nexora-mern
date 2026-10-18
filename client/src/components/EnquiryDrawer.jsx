import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useEnquiry } from '../context/EnquiryContext.jsx';
import SafeImg from './SafeImg.jsx';

export default function EnquiryDrawer() {
  const { items, open, setOpen, setQty, remove, clear, whatsappUrl } = useEnquiry();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, setOpen]);

  return (
    <>
      <div className={`scrim ${open ? 'show' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`drawer ${open ? 'open' : ''}`} aria-hidden={!open} aria-label="Enquiry list">
        <div className="drawer-head">
          <div><h2>Your enquiry list</h2><p className="muted">No prices, no checkout. We quote your list.</p></div>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close list">Close</button>
        </div>

        {items.length === 0 ? (
          <div className="drawer-empty">
            <p>Your list is empty. Add items from the catalogue, set quantities, then send the whole list to us in one message.</p>
            <Link className="btn" to="/catalogue" onClick={() => setOpen(false)}>Browse the catalogue</Link>
          </div>
        ) : (
          <>
            <ul className="drawer-items">
              {items.map((i) => (
                <li key={i._id}>
                  <SafeImg src={i.image} alt="" className="thumb" />
                  <div className="grow">
                    <Link to={`/products/${i.slug}`} onClick={() => setOpen(false)}>{i.name}</Link>
                    <div className="qty">
                      <button onClick={() => setQty(i._id, i.qty - 1)} aria-label={`Decrease ${i.name}`}>−</button>
                      <input type="number" min="1" value={i.qty} onChange={(e) => setQty(i._id, parseInt(e.target.value))} aria-label={`Quantity of ${i.name}`} />
                      <button onClick={() => setQty(i._id, i.qty + 1)} aria-label={`Increase ${i.name}`}>+</button>
                      <button className="link-btn" onClick={() => remove(i._id)}>Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="drawer-foot">
              <a className="btn" href={whatsappUrl()} target="_blank" rel="noreferrer">Send list on WhatsApp</a>
              <Link className="btn ghost" to="/contact" onClick={() => setOpen(false)}>Use the enquiry form</Link>
              <button className="link-btn" onClick={clear}>Clear list</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
