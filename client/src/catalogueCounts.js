import stagingCatalogue from './data/staging-catalogue.json';

export const CATEGORY_ROOT_SLUGS = ['furniture', 'cutlery', 'crockery', 'accessories', 'bathroom-kits'];

const categoryParents = new Map(
  stagingCatalogue.categories.map((category) => [category.slug, category.parentSlug || ''])
);
const productCounts = stagingCatalogue.products.reduce((counts, product) => {
  const slug = product.categorySlug || product.category?.slug;
  if (slug) counts[slug] = (counts[slug] || 0) + 1;
  return counts;
}, {});

function stagingCategoryCount(slug) {
  return Object.keys(productCounts).reduce((total, candidate) => {
    let current = candidate;
    while (current) {
      if (current === slug) return total + (productCounts[candidate] || 0);
      current = categoryParents.get(current) || '';
    }
    return total;
  }, 0);
}

function findCategory(categories, slug) {
  for (const category of categories || []) {
    if (category.slug === slug) return category;
    const nested = findCategory(category.children, slug);
    if (nested) return nested;
  }
  return null;
}

export function categoryCount(categories, slug) {
  const liveCount = findCategory(categories, slug)?.count;
  return Number(liveCount) > 0 ? Number(liveCount) : stagingCategoryCount(slug);
}

export function categoryCounts(categories) {
  return Object.fromEntries(
    [...CATEGORY_ROOT_SLUGS, ...stagingCatalogue.categories.map((category) => category.slug)]
      .map((slug) => [slug, categoryCount(categories, slug)])
  );
}