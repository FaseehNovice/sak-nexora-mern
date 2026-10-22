import { referenceImages } from '../../../referenceImages.js';

const SECTORS_DATA = [
  {
    num: '01',
    name: 'Banquet Halls',
    image: '/staging/wp-content/themes/sak-nexora/assets/images/sectors/banquet.webp',
    blurb: 'Seating, dining tables and full table settings for hundreds of guests — matched sets, ready for the next event.',
    tags: ['Furniture', 'Crockery', 'Cutlery sets', 'Accessories'],
  },
  {
    num: '02',
    name: 'Hotels',
    image: '/staging/wp-content/themes/sak-nexora/assets/images/sectors/hotel.webp',
    blurb: 'Lobby sofas and tables, restaurant service ware and eco-friendly bathroom kits for every room.',
    tags: ['Lobby seating', 'Tea trolleys', 'Crockery & Cutlery', 'Bathroom kits'],
  },
  {
    num: '03',
    name: 'Restaurants',
    image: referenceImages.sectors.restaurant,
    blurb: 'Durable dining furniture, melamine and porcelain, cutlery and the everyday disposables a busy kitchen runs on.',
    tags: ['Dining chairs', 'Crockery', 'Cutlery', 'Accessories'],
  },
  {
    num: '04',
    name: 'Coffee Shops',
    image: '/staging/wp-content/themes/sak-nexora/assets/images/sectors/cafe-lounge.webp',
    blurb: 'Bar chairs, side and coffee tables, cutlery and crockery, straws, sugar sachets and tissues — the whole counter.',
    tags: ['Bar chairs & stools', 'Coffee tables', 'Cutlery and Crockery', 'Accessories'],
  },
];

export default function SectorsSection({ sector = 0 }) {
  return (
    <section className="section section--ink sectors" aria-labelledby="sectors-title">
      <div className="wrap sectors__grid">
        <div className="sectors__intro">
          <p className="eyebrow" data-reveal="up">Who we supply</p>
          <h2 id="sectors-title" data-reveal="up" style={{ '--reveal-i': 1 }}>
            Built around how <span className="foil-text">hospitality</span> buys.
          </h2>
          <p className="lede" data-reveal="up" style={{ '--reveal-i': 2 }}>
            You furnish a hall, open a café or refit a hotel floor once — then restock every week. SAK Nexora covers both: the statement furniture and the everyday supplies.
          </p>
          <ol className="sectors__index" aria-hidden="true">
            {SECTORS_DATA.map((item, index) => (
              <li
                key={item.num}
                data-sector-dot={index}
                className={sector === index ? 'is-active' : ''}
              >
                <span>{item.num}</span>
                {item.name}
              </li>
            ))}
          </ol>
        </div>

        <div className="sectors__list">
          {SECTORS_DATA.map((item, index) => (
            <article className="sector" data-sector={index} key={item.num}>
              <div className="sector__photo" data-parallax-img="" data-unmask="">
                <img
                  src={item.image || referenceImages.sectors?.[item.name.toLowerCase()]}
                  alt=""
                  width="1200"
                  height="800"
                  loading="lazy"
                  data-zoom=""
                />
              </div>
              <div className="sector__body">
                <span className="sector__num">{item.num}</span>
                <h3>{item.name}</h3>
                <p>{item.blurb}</p>
                <ul className="sector__tags">
                  {item.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
