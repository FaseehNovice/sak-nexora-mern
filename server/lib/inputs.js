class InputError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InputError';
    this.statusCode = 400;
  }
}

const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

function text(value, label, max, { required = false } = {}) {
  if (value === undefined || value === null) {
    if (required) throw new InputError(`Enter ${label}.`);
    return '';
  }
  if (typeof value !== 'string' && typeof value !== 'number') throw new InputError(`${label} must be text.`);
  const result = String(value).trim();
  if (required && !result) throw new InputError(`Enter ${label}.`);
  if (result.length > max) throw new InputError(`${label} must be ${max} characters or fewer.`);
  return result;
}

function slugify(value) {
  return String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function requireRecord(value, label) {
  if (!isRecord(value)) throw new InputError(`${label} must be an object.`);
  return value;
}

function parseProductInput(value) {
  const body = requireRecord(value, 'Product');
  const name = text(body.name, 'a product name', 160, { required: true });
  const slug = slugify(text(body.slug, 'the product slug', 180) || name);
  if (!slug) throw new InputError('Enter a product name that can be used as a URL slug.');

  const category = text(body.category, 'a product category', 64, { required: true });
  if (!/^[a-f\d]{24}$/i.test(category)) throw new InputError('Choose a valid product category.');
  if (typeof body.featured !== 'boolean') throw new InputError('Choose whether this product is featured.');

  const images = body.images === undefined ? [] : body.images;
  if (!Array.isArray(images) || images.length > 12) throw new InputError('Add no more than 12 product images.');
  const cleanImages = images.map((image) => {
    const value = text(image, 'an image URL', 2048, { required: true });
    let url;
    try { url = new URL(value); } catch { throw new InputError('Enter a valid image URL.'); }
    if (!['http:', 'https:'].includes(url.protocol)) throw new InputError('Image URLs must use HTTP or HTTPS.');
    return url.toString();
  });
  const specifications = body.specifications === undefined ? [] : body.specifications;
  if (!Array.isArray(specifications)) throw new InputError('The product specifications must be a list.');
  const cleanSpecifications = specifications.map((item) => {
    const row = requireRecord(item, 'A product specification');
    return {
      label: text(row.label, 'a specification name', 80, { required: true }),
      value: text(row.value, 'a specification value', 500, { required: true }),
    };
  });
  if (body.customizable !== undefined && typeof body.customizable !== 'boolean') {
    throw new InputError('Choose whether this product can be customised.');
  }

  return {
    name,
    slug,
    category,
    type: text(body.type, 'the product type', 100),
    finish: text(body.finish, 'the product finish', 60),
    images: cleanImages,
    description: text(body.description, 'the product description', 3000),
    specifications: cleanSpecifications,
    customizable: body.customizable === true,
    featured: body.featured,
  };
}

function parseCategoryInput(value) {
  const body = requireRecord(value, 'Category');
  const name = text(body.name, 'a category name', 100, { required: true });
  const slug = slugify(text(body.slug, 'the category slug', 120) || name);
  if (!slug) throw new InputError('Enter a category name that can be used as a URL slug.');
  const rawParent = body.parent === undefined || body.parent === null ? '' : text(body.parent, 'the parent category', 64);
  if (rawParent && !/^[a-f\d]{24}$/i.test(rawParent)) throw new InputError('Choose a valid parent category.');

  let order = 0;
  if (body.order !== undefined && body.order !== '') {
    order = Number(body.order);
    if (!Number.isInteger(order) || order < 0 || order > 100000) throw new InputError('Category order must be a whole number between 0 and 100000.');
  }

  const image = text(body.image, 'the category image URL', 2048);
  if (image) {
    let imageUrl;
    try { imageUrl = new URL(image); } catch { throw new InputError('Enter a valid category image URL.'); }
    if (!['http:', 'https:'].includes(imageUrl.protocol)) throw new InputError('Category image URLs must use HTTP or HTTPS.');
  }

  return {
    name,
    slug,
    parent: rawParent || null,
    description: text(body.description, 'the category description', 1000),
    order,
    ...(image ? { image } : {}),
  };
}

function parseEnquiryInput(value) {
  const body = requireRecord(value, 'Enquiry');
  const name = text(body.name, 'your name', 100, { required: true });
  const phone = text(body.phone, 'your phone number', 30, { required: true });
  if (!/^[+\d().\s-]{7,30}$/.test(phone)) throw new InputError('Enter a valid phone number so we can reply.');
  const email = text(body.email, 'your email address', 120);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new InputError('Enter a valid email address.');
  const business = text(body.business, 'your business name', 120);
  const message = text(body.message, 'your message', 3000);

  if (body.items !== undefined && !Array.isArray(body.items)) throw new InputError('The enquiry item list is invalid.');
  const rawItems = body.items || [];
  if (rawItems.length > 100) throw new InputError('An enquiry can include up to 100 different items.');
  const itemsById = new Map();
  rawItems.forEach((item) => {
    if (!isRecord(item)) throw new InputError('The enquiry item list is invalid.');
    const product = text(item._id || item.product, 'an item ID', 64, { required: true });
    if (!/^[a-f\d]{24}$/i.test(product)) throw new InputError('An item in your list is invalid. Refresh the catalogue and try again.');
    const quantity = Number(item.qty);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 9999) throw new InputError('Item quantities must be whole numbers between 1 and 9999.');
    const previous = itemsById.get(product);
    if (previous && previous.qty + quantity > 9999) throw new InputError('The total quantity for an item cannot exceed 9999.');
    itemsById.set(product, { product, qty: (previous?.qty || 0) + quantity });
  });

  if (!itemsById.size && !message) throw new InputError('Add items to your list or write a message.');
  return { name, phone, email, business, message, items: [...itemsById.values()] };
}

function parsePagination(query, defaultLimit = 12, maxLimit = 60) {
  const rawPage = query.page === undefined ? 1 : Number(query.page);
  const rawLimit = query.limit === undefined ? defaultLimit : Number(query.limit);
  if (!Number.isInteger(rawPage) || rawPage < 1) throw new InputError('Page must be a positive whole number.');
  if (!Number.isInteger(rawLimit) || rawLimit < 1) throw new InputError(`Limit must be a whole number between 1 and ${maxLimit}.`);
  return { page: rawPage, limit: Math.min(rawLimit, maxLimit) };
}

export { InputError, parseCategoryInput, parseEnquiryInput, parsePagination, parseProductInput, slugify };
