import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

dotenv.config();

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const INPUT = resolve(ROOT, '../client/src/data/staging-catalogue.json');
const dryRun = process.argv.includes('--dry-run');

async function main() {
  const data = JSON.parse(await readFile(INPUT, 'utf8'));
  if (!Array.isArray(data.categories) || !Array.isArray(data.products)) {
    throw new Error('The export must include category and product arrays.');
  }

  const categoriesBySlug = new Map(data.categories.map((category) => [category.slug, category]));
  for (const category of data.categories) {
    if (category.parentSlug && !categoriesBySlug.has(category.parentSlug)) {
      throw new Error(`Missing parent category "${category.parentSlug}" for "${category.slug}".`);
    }
  }
  for (const product of data.products) {
    if (!categoriesBySlug.has(product.categorySlug)) {
      throw new Error(`Missing category "${product.categorySlug}" for product "${product.slug}".`);
    }
    if (!product.name || !product.slug || !Array.isArray(product.images)) {
      throw new Error(`Product "${product.slug || '(unknown)'}" is missing required fields.`);
    }
  }

  if (dryRun) {
    console.log(`Dry run passed: ${data.categories.length} categories and ${data.products.length} products are ready.`);
    return;
  }
  if (!process.env.MONGO_URI) throw new Error('Set MONGO_URI in server/.env before importing.');

  await mongoose.connect(process.env.MONGO_URI);
  const categoryIds = new Map();
  const pending = new Map(data.categories.map((category) => [category.slug, category]));
  while (pending.size) {
    let insertedThisPass = false;
    for (const [slug, category] of pending) {
      if (category.parentSlug && !categoryIds.has(category.parentSlug)) continue;
      const parent = category.parentSlug ? categoryIds.get(category.parentSlug) : null;
      const result = await Category.findOneAndUpdate(
        { slug },
        { $setOnInsert: { name: category.name, slug, parent, description: category.description, order: category.order } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      ).select('_id').lean();
      categoryIds.set(slug, result._id);
      pending.delete(slug);
      insertedThisPass = true;
    }
    if (!insertedThisPass) throw new Error('Category parents could not be resolved.');
  }

  let inserted = 0;
  let existing = 0;
  for (const product of data.products) {
    const result = await Product.updateOne(
      { slug: product.slug },
      { $setOnInsert: {
        name: product.name,
        slug: product.slug,
        category: categoryIds.get(product.categorySlug),
        type: product.type,
        finish: product.finish,
        images: product.images,
        description: product.description,
        specifications: product.specifications,
        customizable: product.customizable,
        featured: product.featured,
      } },
      { upsert: true, setDefaultsOnInsert: true },
    );
    if (result.upsertedCount) inserted += 1;
    else existing += 1;
  }

  console.log(`Imported ${inserted} products; left ${existing} matching products unchanged.`);
  console.log(`Resolved ${categoryIds.size} categories. Product images currently reference the staging host.`);
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState) await mongoose.disconnect();
  });