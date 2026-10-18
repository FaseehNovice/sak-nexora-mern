const root = '/images/reference/';
const image = (name) => `${root}${name}`;

export const referenceImages = {
  hero: {
    background: image('sector-hotel.webp'),
    trolley: image('hero-trolley.webp'),
    chairNavy: image('hero-navy.webp'),
    chairOval: image('hero-oval.webp'),
    cutlery: image('hero-cutlery.webp'),
  },
  categories: {
    furniture: image('category-furniture.webp'),
    cutlery: image('finish-shine.webp'),
    crockery: image('category-crockery.webp'),
    accessories: image('category-accessories.webp'),
    'bathroom-kits': image('category-bathroom-kits.webp'),
  },
  sectors: {
    banquet: image('category-furniture.webp'),
    hotel: image('sector-hotel.webp'),
    restaurant: image('sector-restaurant.webp'),
    cafe: image('sector-cafe.webp'),
  },
  finishes: {
    'cutlery-shine': image('finish-shine.webp'),
    'cutlery-matte': image('finish-matte.webp'),
    'cutlery-matte-gold': image('finish-matte-gold.webp'),
  },
};
