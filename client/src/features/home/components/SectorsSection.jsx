import SafeImg from '../../../components/SafeImg.jsx';
import { SECTORS } from '../../../content.js';
import { referenceImages } from '../../../referenceImages.js';

export default function SectorsSection({ sector }) {
  return (
    <section className="section section-ink sectors" aria-labelledby="sectors-heading">
        <div className="wrap sector-layout">
          <div className="sector-intro" data-reveal="up">
            <p className="eyebrow">Who we supply</p>
            <h2 id="sectors-heading">Built around how hospitality buys.</h2>
            <p className="muted">You furnish a hall, open a café or refit a hotel floor once — then restock every week. SAK Nexora covers both: the statement furniture and the everyday supplies.</p>
            <ol className="sector-nav">
              {SECTORS.map((item, index) => (
                <li key={item.key}>
                  <a className={sector === index ? 'active' : ''} href={`#sector-${item.key}`}>
                    <span>{String(index + 1).padStart(2, '0')}</span>{item.name}
                  </a>
                </li>
              ))}
            </ol>
          </div>
          <div className="sector-stories">
            {SECTORS.map((item, index) => (
              <article className={`sector-story ${sector === index ? 'sector-story-active' : ''}`} id={`sector-${item.key}`} data-sector-index={index} data-reveal="up" key={item.key}>
                <SafeImg src={referenceImages.sectors[item.key]} alt={`${item.name} setting`} className="sector-photo" />
                <div className="sector-story-copy">
                  <span className="sector-number">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.blurb}</p>
                    <ul className="chips">{item.points.map((point) => <li key={point}>{point}</li>)}</ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
  );
}
