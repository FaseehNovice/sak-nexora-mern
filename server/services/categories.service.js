import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { InputError, parseCategoryInput, parsePagination } from '../lib/inputs.js';

async function categoryTree() {
  const [categories, counts] = await Promise.all([
    Category.find().sort({ order: 1, name: 1 }).lean(),
    Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
  ]);
  const countById = new Map(counts.map((entry) => [String(entry._id), entry.count]));
  const byId = new Map(categories.map((category) => [
    String(category._id),
    { ...category, count: countById.get(String(category._id)) || 0, children: [] },
  ]));
  const roots = [];
  for (const category of byId.values()) {
    const parent = category.parent && byId.get(String(category.parent));
    if (parent) {
      parent.children.push(category);
      parent.count += category.count;
    } else roots.push(category);
  }
  return roots;
}

function categoryId(value, label = 'category ID') {
  if (!mongoose.isValidObjectId(value)) throw new InputError(`The ${label} is invalid.`);
  return String(value);
}

async function validateParent(parentId, currentId) {
  if (!parentId) return;
  if (currentId && parentId === currentId) throw new InputError('A category cannot be its own parent.');
  const parent = await Category.findById(parentId).select('parent').lean();
  if (!parent) throw new InputError('Choose an existing parent category.');
  if (parent.parent) throw new InputError('Categories can have a parent and one subcategory level only.');
  if (currentId && await Category.exists({ parent: currentId })) {
    throw new InputError('Move or delete this category’s subcategories before changing its parent.');
  }
}

export async function listCategories() {
  return categoryTree();
}

export async function listAdminCategories(query) {
  const { page, limit } = parsePagination(query, 100, 100);
  const [items, total, counts] = await Promise.all([
    Category.find().sort({ order: 1, name: 1 }).skip((page - 1) * limit).limit(limit).lean(),
    Category.countDocuments(),
    Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
  ]);
  const countById = new Map(counts.map((entry) => [String(entry._id), entry.count]));
  return {
    items: items.map((category) => ({ ...category, productCount: countById.get(String(category._id)) || 0 })),
    total,
    page,
    pages: Math.ceil(total / limit),
  };
}

export async function createCategory(body) {
  const input = parseCategoryInput(body);
  await validateParent(input.parent, null);
  return Category.create(input);
}

export async function updateCategory(idValue, body) {
  const id = categoryId(idValue);
  const input = parseCategoryInput(body);
  await validateParent(input.parent, id);
  return Category.findByIdAndUpdate(id, input, { new: true, runValidators: true });
}

export async function deleteCategory(idValue) {
  const id = categoryId(idValue);
  const [children, products] = await Promise.all([
    Category.exists({ parent: id }),
    Product.exists({ category: id }),
  ]);
  if (children) return { conflict: 'Move or delete this category’s subcategories before deleting it.' };
  if (products) return { conflict: 'Move or delete this category’s products before deleting it.' };
  const category = await Category.findByIdAndDelete(id);
  return category ? { ok: true } : null;
}
