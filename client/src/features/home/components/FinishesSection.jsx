import { Link } from 'react-router-dom';
import SafeImg from '../../../components/SafeImg.jsx';
import { FINISHES } from '../../../content.js';
import { referenceImages } from '../../../referenceImages.js';
import { ArrowIcon } from './HomeIcons.jsx';

export default function FinishesSection({ finish, setFinish, selectedFinish }) {
  return (
    <section className="section section-ink2 finishes">
        <div className="wrap finishes-layout">
          <div className="finish-copy" data-reveal="up">
            <p className="eyebrow">Cutlery</p>
            <h2>One design.<br />Four finishes.</h2>
            <p className="muted">Every range comes in mirror shine, brushed matte, gold and matte gold, in sets for 4, 6, 8 or 12 settings — so a banquet hall and a fine-dining room can both match their tables.</p>
            <div className="finish-options" role="group" aria-label="Cutlery finish">
              {FINISHES.map((item) => (
                <button type="button" aria-pressed={finish === item.slug} className={finish === item.slug ? 'selected' : ''} onClick={() => setFinish(item.slug)} key={item.slug}>
                  <span className={`finish-swatch swatch-${item.slug}`} />{item.name}
                </button>
              ))}
            </div>
            <ul className="ticks"><li>Food-grade stainless steel</li><li>Sets for 4, 6, 8 or 12 settings</li><li>Dishwasher safe</li></ul>
            <Link className="btn" to={`/catalogue/cutlery/${selectedFinish.slug}`}>See {selectedFinish.name.toLowerCase()} cutlery <ArrowIcon /></Link>
          </div>
          <Link className="finish-feature" to={`/catalogue/cutlery/${selectedFinish.slug}`} aria-label={`Browse ${selectedFinish.name} cutlery`} data-reveal="up">
            {(referenceImages.finishes[selectedFinish.slug] || selectedFinish.product?.images?.[0]) && <SafeImg src={referenceImages.finishes[selectedFinish.slug] || selectedFinish.product?.images?.[0]} alt={`${selectedFinish.name} cutlery set`} />}
            <span className="finish-feature-label"><strong>{selectedFinish.name}</strong>{selectedFinish.note}</span>
          </Link>
        </div>
      </section>
  );
}
