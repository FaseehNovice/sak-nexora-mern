import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCategories, useFetch } from '../hooks';
import { qs } from '../api';
import ProductCard from '../components/ProductCard.jsx';

export default function Catalogue() {
  const { parent, child } = useParams();
  const slug = child || parent || '';
  const [sp, setSp] = useSearchParams();
  const page = parseInt(sp.get('page')) || 1;
  const q = sp.get('q') || '';
  const finish = sp.get('finish') || '';
  const type = sp.get('type') || '';
  const sort = sp.get('sort') || 'featured';
  const [term, setTerm] = useState(q);
  const { data: cats, error: categoriesError } = useCategories();
  useEffect(() => setTerm(q), [q]);

  const filters = useFetch(`/products/filters${qs({ category: slug })}`, [slug]);
  const { data, loading, error } = useFetch(`/products${qs({ category: slug, q, finish, type, sort, page, limit: 12 })}`, [slug, q, finish, type, sort, page]);

  const root = cats.find((c) => c.slug === (parent || slug)) || cats.find((c) => c.children.some((k) => k.slug === slug));
  const current = root && (root.slug === slug ? root : root.children.find((k) => k.slug === slug));
  const heading = current?.name || 'Full catalogue';

  const submit = (e) => { e.preventDefault(); const n = new URLSearchParams(sp); if (term.trim()) n.set('q', term.trim()); else n.delete('q'); n.delete('page'); setSp(n); };
  const updateFilter = (key, value) => {
    const next = new URLSearchParams(sp);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('page');
    setSp(next);
  };
  const goPage = (n) => { const x = new URLSearchParams(sp); x.set('page', n); setSp(x); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <div className="wrap page catalogue">
      <aside className="side">
        <h2 className="side-title">Catalogue</h2>
        <Link to="/catalogue" className={!slug ? 'on' : ''}>All products</Link>
        {cats.map((c) => (
          <div key={c.slug} className="side-group">
            <Link to={`/catalogue/${c.slug}`} className={`head ${slug === c.slug ? 'on' : ''}`}>{c.name}</Link>
            {(root?.slug === c.slug) && c.children.map((k) => (
              <Link key={k.slug} to={`/catalogue/${c.slug}/${k.slug}`} className={`sub ${slug === k.slug ? 'on' : ''}`}>{k.name}</Link>
            ))}
          </div>
        ))}
      </aside>

      <section className="results">
        <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/catalogue">Catalogue</Link>
          {root && <><span>/</span><Link to={`/catalogue/${root.slug}`}>{root.name}</Link></>}
          {current && current !== root && <><span>/</span><b>{current.name}</b></>}</nav>
        <div className="results-head">
          <div><h1>{heading}</h1>{current?.description && <p className="muted">{current.description}</p>}</div>
          <form onSubmit={submit} className="search" role="search">
            <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search products" aria-label="Search products" />
            <button className="btn small">Search</button>
          </form>
        </div>

        <div className="catalogue-filters" role="group" aria-label="Filter catalogue">
          <label>Finish
            <select value={finish} onChange={(e) => updateFilter('finish', e.target.value)}>
              <option value="">All finishes</option>
              {(filters.data?.finishes || []).map((item) => <option value={item} key={item}>{item}</option>)}
            </select>
          </label>
          <label>Type
            <select value={type} onChange={(e) => updateFilter('type', e.target.value)}>
              <option value="">All types</option>
              {(filters.data?.types || []).map((item) => <option value={item} key={item}>{item}</option>)}
            </select>
          </label>
          <label>Sort by
            <select value={sort} onChange={(e) => updateFilter('sort', e.target.value)}>
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </label>
          {(q || finish || type || sort !== 'featured') && <button className="link-btn" type="button" onClick={() => { setTerm(''); setSp(new URLSearchParams()); }}>Clear filters</button>}
        </div>

        {filters.error && <p className="notice err" role="alert">Catalogue filters could not be loaded. {filters.error}</p>}
        {categoriesError && <p className="notice err" role="alert">Catalogue categories could not be loaded. {categoriesError}</p>}
        {error && <p className="notice err">{error}</p>}
        {loading && !data && <p className="muted">Loading products…</p>}
        {data && data.items.length === 0 && slug && !q && !finish && !type && (
          <div className="notice">
            No products have been added to {current?.name || 'this category'} yet. We’re adding new items, so please check back soon or <Link to="/contact">contact us</Link> and we’ll help you find what you need.
          </div>
        )}
        {data && data.items.length === 0 && (!slug || q || finish || type) && (
          <div className="notice">Nothing matches those filters yet. <Link to="/catalogue">Clear filters</Link> or <Link to="/contact">ask us</Link> for help finding what you need.</div>
        )}
        <div className="grid three">{data?.items.map((p) => <ProductCard key={p._id} p={p} />)}</div>

        {data?.pages > 1 && (
          <div className="pager">
            <button className="btn ghost small" disabled={page <= 1} onClick={() => goPage(page - 1)}>Previous</button>
            <span>Page {data.page} of {data.pages}</span>
            <button className="btn ghost small" disabled={page >= data.pages} onClick={() => goPage(page + 1)}>Next</button>
          </div>
        )}
      </section>
    </div>
  );
}
