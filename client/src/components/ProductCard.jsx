import { Link } from 'react-router-dom';
import SafeImg from './SafeImg.jsx';
import { useEnquiry } from '../context/EnquiryContext.jsx';

export default function ProductCard({ p, className = '' }) {
  const { toggle, has } = useEnquiry();
  const inList = has(p._id || p.id);
  const images = p.images || [];

  return (
    <article className={`card ${className}`} data-reveal="up">
      <Link to={`/products/${p.slug}/`} className="card__media" tabIndex={-1} aria-hidden="true">
        <SafeImg src={images[0]} alt="" className="card__img" />
        {images[1] && <SafeImg src={images[1]} alt="" className="card__img card__img--alt" />}
        <span className="card__sheen" aria-hidden="true" />
      </Link>
      <div className="card__body">
        <span className="card__cat">{p.type || p.finish || p.category?.name}</span>
        <h3 className="card__title">
          <Link to={`/products/${p.slug}/`}>{p.name}</Link>
        </h3>
      </div>
      <button
        className={`card__add ${inList ? 'is-in' : ''}`}
        type="button"
        data-add-item=""
        data-id={p._id || p.id}
        data-title={p.name}
        data-url={`/products/${p.slug}/`}
        data-thumb={images[0]}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggle(p);
        }}
        aria-label={`${inList ? 'Remove' : 'Add'} ${p.name} ${inList ? 'from' : 'to'} enquiry list`}
      >
        <svg className="icon i-add" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <path d="M12 5v14M5 12h14" />
        </svg>
        <svg className="icon i-done" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <path d="m5 12 5 5 9-10" />
        </svg>
      </button>
    </article>
  );
}
