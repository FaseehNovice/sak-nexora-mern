import source from './staging-catalogue.json';

function stableId(value) {
  const input = String(value);
  const hashes = [2166136261, 2246822519, 3266489917];
  return hashes.map((seed) => {
    let hash = seed;
    for (let index = 0; index < input.length; index += 1) hash = Math.imul(hash ^ input.charCodeAt(index), 16777619);
    return (hash >>> 0).toString(16).padStart(8, '0');
  }).join('').slice(0, 24);
}

const categoriesBySlug = new Map(source.categories.map((category) => [category.slug, {
  ...category,
  _id: stableId(`category:${category.slug}`),
  parent: null,
  children: [],
  count: 0,
}]));

for (const category of categoriesBySlug.values()) {
  const parent = categoriesBySlug.get(category.parentSlug);
  if (parent) {
    category.parent = parent._id;
    parent.children.push(category);
  }
}

const products = source.products.map((product) => {
  const category = categoriesBySlug.get(product.categorySlug);
  return {
    ...product,
    _id: stableId(`product:${product.slug}`),
    category: category ? { _id: category._id, name: category.name, slug: category.slug } : null,
  };
});

const productBySlug = new Map(products.map((product) => [product.slug, product]));
for (const product of products) {
  let category = categoriesBySlug.get(product.categorySlug);
  while (category) {
    category.count += 1;
    category = categoriesBySlug.get(category.parentSlug);
  }
}

function descendants(category) {
  return [category, ...category.children.flatMap(descendants)];
}

function scopedProducts(categorySlug) {
  if (!categorySlug) return products;
  const category = categoriesBySlug.get(categorySlug);
  return category ? descendants(category).flatMap((item) => products.filter((product) => product.categorySlug === item.slug)) : [];
}

function featuredProducts() {
  const selected = new Map();
  products.forEach((product) => {
    if (!selected.has(product.categorySlug)) selected.set(product.categorySlug, product);
  });
  return [...selected.values()];
}

function matches(product, params) {
  const query = (params.get('q') || '').toLocaleLowerCase();
  if (query && ![product.name, product.type, product.finish, product.description].some((field) => field?.toLocaleLowerCase().includes(query))) return false;
  if (params.get('finish') && product.finish.toLocaleLowerCase() !== params.get('finish').toLocaleLowerCase()) return false;
  if (params.get('type') && product.type.toLocaleLowerCase() !== params.get('type').toLocaleLowerCase()) return false;
  return true;
}

export function catalogueFallback(path) {
  const [pathname, query = ''] = path.split('?');
  const params = new URLSearchParams(query);
  if (pathname === '/categories') return [...categoriesBySlug.values()].filter((category) => !category.parentSlug);

  if (pathname === '/products/filters') {
    const items = scopedProducts(params.get('category')).filter((product) => matches(product, params));
    return {
      finishes: [...new Set(items.map((product) => product.finish).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
      types: [...new Set(items.map((product) => product.type).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    };
  }

  if (pathname === '/products') {
    const page = Math.max(1, Number(params.get('page')) || 1);
    const limit = Math.max(1, Math.min(60, Number(params.get('limit')) || 12));
    let items = scopedProducts(params.get('category')).filter((product) => matches(product, params));
    if (['1', 'true'].includes(params.get('featured'))) items = featuredProducts().filter((product) => matches(product, params));
    const sort = params.get('sort') || 'featured';
    if (sort === 'name-asc') items.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'name-desc') items.sort((a, b) => b.name.localeCompare(a.name));
    else if (sort === 'oldest') items.reverse();
    const total = items.length;
    return { items: items.slice((page - 1) * limit, page * limit), total, page, pages: Math.ceil(total / limit) };
  }

  const productMatch = pathname.match(/^\/products\/([^/]+)\/?$/);
  if (productMatch) {
    const product = productBySlug.get(productMatch[1]);
    if (!product) throw new Error('That product could not be found.');
    return {
      ...product,
      related: products.filter((item) => item.categorySlug === product.categorySlug && item.slug !== product.slug).slice(0, 8),
    };
  }
  return undefined;
}
