export const SITE = {
  name: 'SAK Nexora',
  whatsapp: '923055827170',
  phones: [{ label: '+92 305-5827170', href: 'https://wa.me/923055827170' }, { label: '+92 329-9342123', href: 'tel:+923299342123' }],
  email: 'saknexora@gmail.com',
  address: 'Office No. T-150, 3rd Floor, Deans Trade Centre, Peshawar, Pakistan',
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/saknexora' },
    { label: 'Facebook', href: 'https://www.facebook.com/share/1CSE6Dm5m1/' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@sak.nexora' },
  ],
};

export const waLink = (text = 'Hi SAK Nexora, I have an enquiry.') =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

export const SECTORS = [
  { key: 'banquet', name: 'Banquet Halls', blurb: 'Seating, dining tables and full table settings for hundreds of guests, in matched sets ready for the next event.',
    points: ['Banquet chairs', 'Dining tables', 'Cutlery sets', 'Napkins & foil'], category: 'chairs' },
  { key: 'hotel', name: 'Hotels', blurb: 'Lobby sofas and tables, restaurant service ware and eco-friendly bathroom kits for every room.',
    points: ['Lobby seating', 'Tea trolleys', 'Porcelain', 'Bathroom kits'], category: 'sofas-seating' },
  { key: 'restaurant', name: 'Restaurants', blurb: 'Durable dining furniture, melamine and porcelain, cutlery and the everyday disposables a busy kitchen runs on.',
    points: ['Dining chairs', 'Melamine', 'Cutlery', 'Gloves & cling film'], category: 'tables' },
  { key: 'cafe', name: 'Coffee Shops', blurb: 'Bar chairs, side and coffee tables, cups and saucers, straws, sugar sachets and tissues: the whole counter.',
    points: ['Bar chairs & stools', 'Coffee tables', 'Cups & saucers', 'Straws & sachets'], category: 'tea-trolleys' },
];

export const FINISHES = [
  { name: 'Shine', slug: 'cutlery-shine', note: 'Mirror polish' },
  { name: 'Matte', slug: 'cutlery-matte', note: 'Brushed steel' },
  { name: 'Gold', slug: 'cutlery-gold', note: 'Warm gold' },
  { name: 'Matte Gold', slug: 'cutlery-matte-gold', note: 'Soft brushed gold' },
];

export const STEPS = [
  { t: 'Build your list', d: 'Browse the catalogue and tap "Add to list" on anything you need. Set the quantity for each item.' },
  { t: 'Send it in one message', d: 'Send the whole list on WhatsApp or through the enquiry form. No account, no checkout.' },
  { t: 'Get your quote', d: 'We reply with prices and availability for your quantities, then arrange supply with you.' },
];

export const FAQS = [
  { q: 'How do I place an order?', a: 'Tap "Add to list" on the items you need and set the quantities. Then open your enquiry list and send it to us on WhatsApp or through the enquiry form. We reply with prices and availability, and arrange the rest with you directly.' },
  { q: 'Why are there no prices on the website?', a: 'Prices depend on quantity, finish and any customisation, so we quote on your actual list. That way the price you are given is the price you pay.' },
  { q: 'Do you only supply in bulk?', a: 'We supply Banquet Halls, Hotels, Restaurants and Coffee Shops, so most orders are in bulk. Send your quantities either way and we will tell you what we can do.' },
  { q: 'Can I see an item before I order?', a: 'Ask on WhatsApp for more photos or a short video of any item. You are also welcome at our office in Deans Trade Centre, Peshawar. Please call ahead.' },
  { q: 'Which finishes does the cutlery come in?', a: 'Every range comes in mirror shine, brushed matte, gold and matte gold, in sets for 4, 6, 8 or 12 settings. All sets are food-grade stainless steel and dishwasher safe.' },
];
