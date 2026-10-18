import { Link } from 'react-router-dom';
import SafeImg from '../../../components/SafeImg.jsx';
import { referenceImages } from '../../../referenceImages.js';
import { ArrowIcon } from './HomeIcons.jsx';

export default function CategorySection({ cats, covers, categoriesError }) {
  return (
    <section className="section section-light cats" id="categories">
        <div className="wrap">
          <div className="section-head section-head-split" data-reveal="up">
            <div>
              <p className="eyebrow">One supplier, five ranges</p>
              <h2>Everything for the room — <em>and the table in it.</em></h2>
            </div>
            <Link className="link-arrow" to="/catalogue">See the full catalogue <ArrowIcon /></Link>
          </div>
          {categoriesError && <p className="notice err" role="alert">Catalogue categories could not be loaded. {categoriesError}</p>}
          <div className="bento">
            {cats.map((category) => (
              <Link key={category.slug} to={`/catalogue/${category.slug}`} className={`bento-tile bento-${category.slug}`} data-reveal="up" data-tilt>
                <span className="bento-media"><SafeImg src={referenceImages.categories[category.slug] || covers[category.slug]?.images?.[0]} alt={covers[category.slug]?.name || category.name} /></span>
                <span className="bento-shade" aria-hidden="true" />
                <span className="bento-glare" aria-hidden="true" />
                <span className="bento-body">
                  <span className="bento-name">{category.name}</span>
                  <span className="bento-kids">{category.children.length ? category.children.map((child) => child.name).join(' · ') : category.description}</span>
                  <span className="bento-go" aria-hidden="true"><ArrowIcon /></span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
  );
}
