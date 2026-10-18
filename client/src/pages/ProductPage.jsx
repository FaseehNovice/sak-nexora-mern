import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFetch } from '../hooks';
import { useEnquiry } from '../context/EnquiryContext.jsx';
import { waLink } from '../content';
import SafeImg from '../components/SafeImg.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function ProductPage() {
  const { slug } = useParams();
  const { data: p, loading, error } = useFetch(`/products/${slug}`, [slug]);
  const { add, has } = useEnquiry();
  const [i, setI] = useState(0);
  useEffect(() => { setI(0); document.title = p ? `${p.name} | SAK Nexora` : 'SAK Nexora'; }, [p]);

  if (loading) return <div className="wrap page"><p className="muted">Loading…</p></div>;
  if (error) return <div className="wrap page"><p className="notice err">{error}</p><Link to="/catalogue" className="btn">Back to the catalogue</Link></div>;

  return (
    <div className="wrap page">
      <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/catalogue">Catalogue</Link><span>/</span>
        <Link to={`/catalogue/${p.category.slug}`}>{p.category.name}</Link><span>/</span><b>{p.name}</b></nav>
      <div className="product">
        <div className="gallery">
          <SafeImg src={p.images[i]} alt={p.name} className="main-img" loading="eager" />
          {p.images.length > 1 && <div className="thumbs">{p.images.map((src, n) => (
            <button key={src} className={n === i ? 'on' : ''} onClick={() => setI(n)} aria-label={`Show image ${n + 1}`}><SafeImg src={src} alt="" /></button>))}</div>}
        </div>
        <div className="info">
          <p className="card-type">{p.type || p.category.name}</p>
          <h1>{p.name}</h1>
          {p.finish && <p className="finish-tag">Finish: {p.finish}</p>}
          <p className="lede">{p.description || 'Send us your quantity and we will quote it.'}</p>
          <div className="row">
            <button className="btn" onClick={() => add(p)}>{has(p._id) ? 'Add another to list' : 'Add to enquiry list'}</button>
            <a className="btn ghost" target="_blank" rel="noreferrer" href={waLink(`Hi SAK Nexora, I am interested in: ${p.name}\n${window.location.href}`)}>Ask about this item</a>
          </div>
          <p className="muted small-print">No prices on the site. We quote for your quantity, finish and any customisation.</p>
        </div>
      </div>
      {p.related?.length > 0 && (<section className="related"><h2>More from {p.category.name}</h2>
        <div className="grid">{p.related.map((r) => <ProductCard key={r._id} p={{ ...r, category: p.category }} />)}</div></section>)}
    </div>
  );
}
