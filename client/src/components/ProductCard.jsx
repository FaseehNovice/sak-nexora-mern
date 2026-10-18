import { Link } from 'react-router-dom';
import SafeImg from './SafeImg.jsx';
import { useEnquiry } from '../context/EnquiryContext.jsx';

export default function ProductCard({ p }) {
  const { add, has } = useEnquiry();
  const inList = has(p._id);
  const images = p.images || [];
  return (
    <article className="card">
      <Link to={`/products/${p.slug}`} className="card-media" aria-label={p.name}>
        <SafeImg src={images[0]} alt={p.name} className="card-img a" />
        {images[1] && <SafeImg src={images[1]} alt="" className="card-img b" />}
      </Link>
      <div className="card-body">
        <p className="card-type">{p.type || p.category?.name}</p>
        <h3><Link to={`/products/${p.slug}`}>{p.name}</Link></h3>
        <button className={`btn small ${inList ? 'ghost' : ''}`} onClick={() => add(p)}>
          {inList ? 'Add another' : 'Add to list'}
        </button>
      </div>
    </article>
  );
}
