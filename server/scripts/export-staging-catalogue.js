import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';

const SOURCE = 'https://stage.saknexora.198.251.65.48.nip.io';
const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUTPUT = resolve(ROOT, '../client/src/data/staging-catalogue.json');
const CONCURRENCY = 8;

function routePath(href) {
  let url;
  try { url = new URL(href, SOURCE); } catch { return ''; }
  if (url.origin !== SOURCE) return '';
  const segments = url.pathname.split('/').filter(Boolean);
  if (segments[0] !== 'catalogue' || segments.length < 2 || segments.includes('page')) return '';
  return `/${segments.join('/')}/`;
}

function listingPagePath(href) {
  let url;
  try { url = new URL(href, SOURCE); } catch { return ''; }
  if (url.origin !== SOURCE) return '';
  const segments = url.pathname.split('/').filter(Boolean);
  if (segments[0] !== 'catalogue' || segments.length < 2) return '';
  return `/${segments.join('/')}/`;
}

function productSlug(href) {
  try {
    const url = new URL(href, SOURCE);
    const match = url.pathname.match(/^\/products\/([^/]+)\/?$/);
    return match?.[1] || '';
  } catch { return ''; }
}

async function getPage(path, attempt = 1) {
  const response = await fetch(new URL(path, SOURCE), { headers: { 'user-agent': 'SAK-Nexora-catalogue-export/1.0' } });
  if (!response.ok) {
    if (attempt < 3 && response.status >= 500) return getPage(path, attempt + 1);
    throw new Error(`Staging returned ${response.status} for ${path}`);
  }
  return load(await response.text());
}

function text($element) {
  return $element.text().replace(/\s+/g, ' ').trim();
}

async function mapLimit(values, limit, fn) {
  const result = new Array(values.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, async () => {
    while (cursor < values.length) {
      const index = cursor++;
      result[index] = await fn(values[index], index);
    }
  }));
  return result;
}

async function main() {
  const categoryQueue = ['/catalogue/'];
  const visitedCategories = new Set();
  const categories = [];
  const categoryBySlug = new Map();

  while (categoryQueue.length) {
    const path = categoryQueue.shift();
    if (visitedCategories.has(path)) continue;
    visitedCategories.add(path);
    const $ = await getPage(path);

    $('main a[href]').each((_, anchor) => {
      const categoryPath = routePath($(anchor).attr('href'));
      if (categoryPath && categoryPath !== '/catalogue/' && !visitedCategories.has(categoryPath)) categoryQueue.push(categoryPath);
    });

    if (path === '/catalogue/') continue;
    const segments = path.split('/').filter(Boolean).slice(1);
    const slug = segments.at(-1);
    if (!slug || categoryBySlug.has(slug)) continue;
    const parentSlug = segments.length > 1 ? segments.at(-2) : '';
    const category = {
      name: text($('main h1').first()),
      slug,
      parentSlug,
      description: text($('main .lede').first()).slice(0, 1000),
      order: categories.length,
      path,
    };
    if (!category.name) continue;
    categoryBySlug.set(slug, category);
    categories.push(category);
  }

  const listingPages = new Set(categories.map((category) => category.path));
  const listingVisited = new Set();
  const productSlugs = new Set();
  while (listingPages.size) {
    const batch = [...listingPages].filter((path) => !listingVisited.has(path));
    listingPages.clear();
    const pages = await mapLimit(batch, CONCURRENCY, async (path) => ({ path, $: await getPage(path) }));
    for (const { path, $ } of pages) {
      listingVisited.add(path);
      $('article.card .card__title a[href]').each((_, anchor) => {
        const slug = productSlug($(anchor).attr('href'));
        if (slug) productSlugs.add(slug);
      });
      $('.pagination a.page-numbers[href]').each((_, anchor) => {
        const nextPage = listingPagePath($(anchor).attr('href'));
        if (nextPage && !listingVisited.has(nextPage)) listingPages.add(nextPage);
      });
    }
  }

  const slugs = [...productSlugs];
  const products = (await mapLimit(slugs, CONCURRENCY, async (slug, index) => {
    const $ = await getPage(`/products/${slug}/`);
    const categoryHref = $('a.item__cat').attr('href') || '';
    const categoryPath = routePath(categoryHref);
    const categorySlug = categoryPath.split('/').filter(Boolean).at(-1) || '';
    const routeSegments = categoryPath.split('/').filter(Boolean).slice(1);
    const specifications = [];
    $('dl.specs dt').each((_, term) => {
      const label = text($(term));
      const value = text($(term).next('dd'));
      if (label && value) specifications.push({ label: label.slice(0, 80), value: value.slice(0, 500) });
    });
    const images = [...new Set($('article [data-slide] img[src]').map((_, image) => $(image).attr('src')).get())].slice(0, 12);
    const description = $('.item__desc p').map((_, paragraph) => text($(paragraph))).get().filter(Boolean).join('\n\n').slice(0, 3000);
    const category = categoryBySlug.get(categorySlug);
    if (!category) throw new Error(`Could not map product category for /products/${slug}/`);
    if ((index + 1) % 25 === 0 || index + 1 === slugs.length) console.log(`Read product pages ${index + 1}/${slugs.length}`);
    return {
      name: text($('.item__title').first()),
      slug,
      categorySlug,
      rootSlug: routeSegments[0] || category.parentSlug || categorySlug,
      type: text($('a.item__cat').first()).slice(0, 100),
      finish: routeSegments[0] === 'cutlery' ? category.name.slice(0, 60) : '',
      description,
      images,
      specifications,
      customizable: /customis|customiz/i.test(text($('.item__info .badge').first())),
      featured: false,
      sourceUrl: `${SOURCE}/products/${slug}/`,
    };
  })).filter((product) => product.name);

  const exportData = {
    source: SOURCE,
    exportedAt: new Date().toISOString(),
    categories,
    products,
  };
  await mkdir(dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, `${JSON.stringify(exportData, null, 2)}\n`, 'utf8');
  console.log(`Exported ${categories.length} categories and ${products.length} products to ${OUTPUT}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});