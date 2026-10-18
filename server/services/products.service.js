import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { InputError, parsePagination, parseProductInput } from '../lib/inputs.js';
import {
  deleteCloudinaryImages,
  isCloudinaryImageUrl,
  uploadProductFiles,
} from '../lib/cloudinary.js';

const IMAGE_LIMIT = 12;
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const SORTS = {
  featured: { featured: -1, createdAt: -1, name: 1 },
  newest: { createdAt: -1, name: 1 },
  oldest: { createdAt: 1, name: 1 },
  'name-asc': { name: 1 },
  'name-desc': { name: -1 },
};

async function productFilter(query) {
  const filter = {};
  if (query.category) {
    const slug = String(query.category).trim();
    const category = await Category.findOne({ slug }).select('_id').lean();
    if (!category) return null;
    const children = await Category.find({ parent: category._id }).select('_id').lean();
    filter.category = { $in: [category._id, ...children.map((child) => child._id)] };
  }

  if (query.q !== undefined) {
    const term = String(query.q).trim();
    if (term.length > 100) throw new InputError('Search terms must be 100 characters or fewer.');
    if (term) {
      const expression = new RegExp(escapeRegex(term), 'i');
      filter.$or = [{ name: expression }, { type: expression }, { finish: expression }, { description: expression }];
    }
  }
  for (const field of ['finish', 'type']) {
    if (query[field] !== undefined && String(query[field]).trim()) {
      const value = String(query[field]).trim();
      if (value.length > (field === 'type' ? 100 : 60)) throw new InputError(`The ${field} filter is too long.`);
      filter[field] = new RegExp(`^${escapeRegex(value)}$`, 'i');
    }
  }
  if (query.featured !== undefined) {
    if (!['1', 'true', '0', 'false'].includes(String(query.featured))) {
      throw new InputError('The featured filter must be true or false.');
    }
    if (['1', 'true'].includes(String(query.featured))) filter.featured = true;
  }
  return filter;
}

async function cleanProduct(body) {
  if (!['true', 'false', true, false].includes(body.featured)) {
    throw new InputError('Choose whether this product is featured.');
  }
  const product = parseProductInput({
    ...body,
    featured: body.featured === true || body.featured === 'true',
    images: [],
  });
  if (!mongoose.isValidObjectId(product.category) || !await Category.exists({ _id: product.category })) {
    throw new InputError('Choose an existing product category.');
  }
  return product;
}

function requestedExistingImages(raw, previousImages) {
  if (raw === undefined || raw === '') raw = JSON.stringify(previousImages);
  let images;
  try {
    images = JSON.parse(raw);
  } catch {
    throw new InputError('The selected existing product images are invalid.');
  }
  if (!Array.isArray(images) || images.length > IMAGE_LIMIT || images.some((image) => typeof image !== 'string')) {
    throw new InputError('Choose no more than 12 existing product images.');
  }
  const selected = [...new Set(images)];
  if (selected.some((image) => !previousImages.includes(image))) {
    throw new InputError('An image was not part of this product. Refresh the product and try again.');
  }
  if (selected.some((image) => !isCloudinaryImageUrl(image))) {
    const error = new Error('This product has images that are not in Cloudinary yet. Run the product-image migration before editing it.');
    error.statusCode = 409;
    throw error;
  }
  return selected;
}

async function discardUploadedImages(images) {
  try {
    await deleteCloudinaryImages(images);
  } catch (error) {
    console.error('Cloudinary cleanup failed after a product operation:', error.message);
  }
}

async function cleanupWarning(images) {
  if (!images.length) return '';
  const cloudinaryImages = images.filter((image) => {
    try {
      return new URL(image).hostname === 'res.cloudinary.com';
    } catch {
      return false;
    }
  });
  if (!cloudinaryImages.length) return '';
  try {
    await deleteCloudinaryImages(cloudinaryImages);
    return '';
  } catch (error) {
    console.error('Cloudinary image cleanup failed:', error.message);
    return 'The product was saved, but some removed images could not be deleted from Cloudinary.';
  }
}

function validId(id) {
  if (!mongoose.isValidObjectId(id)) throw new InputError('The product ID is invalid.');
  return id;
}

export async function listProductFilters(query) {
  const filter = await productFilter(query);
  if (!filter) return { finishes: [], types: [] };
  const [finishes, types] = await Promise.all([
    Product.distinct('finish', { ...filter, finish: { $nin: ['', null] } }),
    Product.distinct('type', { ...filter, type: { $nin: ['', null] } }),
  ]);
  return {
    finishes: finishes.sort((a, b) => a.localeCompare(b)),
    types: types.sort((a, b) => a.localeCompare(b)),
  };
}

export async function listProducts(query) {
  const { page, limit } = parsePagination(query);
  const sortName = query.sort === undefined ? 'featured' : String(query.sort);
  const sort = SORTS[sortName];
  if (!sort) throw new InputError('Choose a valid product sort order.');
  const filter = await productFilter(query);
  if (!filter) return { items: [], total: 0, page: 1, pages: 0 };

  const [items, total] = await Promise.all([
    Product.find(filter).populate('category', 'name slug').sort(sort)
      .skip((page - 1) * limit).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);
  return { items, total, page, pages: Math.ceil(total / limit) };
}

export async function getProduct(slug) {
  const product = await Product.findOne({ slug }).populate('category', 'name slug parent').lean();
  if (!product) return null;
  const related = await Product.find({ category: product.category._id, _id: { $ne: product._id } })
    .populate('category', 'name slug').sort({ featured: -1, createdAt: -1, name: 1 }).limit(4).lean();
  return { ...product, related };
}

export async function createProduct(body, files, isMultipart) {
  let images = [];
  try {
    if (!isMultipart) throw new InputError('Product data and images must be sent as a multipart upload.');
    if (requestedExistingImages(body.existingImages || '[]', []).length) {
      throw new InputError('New products cannot have existing images.');
    }
    const product = await cleanProduct(body);
    images = await uploadProductFiles(files, product.slug);
    return await Product.create({ ...product, images });
  } catch (error) {
    await discardUploadedImages(images);
    throw error;
  }
}

export async function updateProduct(id, body, files, isMultipart) {
  let uploaded = [];
  try {
    validId(id);
    if (!isMultipart) throw new InputError('Product data and images must be sent as a multipart upload.');
    const current = await Product.findById(id);
    if (!current) return null;
    const previousImages = [...(current.images || [])];
    const product = await cleanProduct(body);
    const existingImages = requestedExistingImages(body.existingImages, current.images || []);
    if (existingImages.length + files.length > IMAGE_LIMIT) {
      throw new InputError(`A product can have no more than ${IMAGE_LIMIT} images.`);
    }
    uploaded = await uploadProductFiles(files, product.slug);
    current.set({ ...product, images: [...existingImages, ...uploaded] });
    await current.save();
    const mediaCleanupWarning = await cleanupWarning(previousImages.filter((image) => !current.images.includes(image)));
    return { ...current.toObject(), ...(mediaCleanupWarning ? { mediaCleanupWarning } : {}) };
  } catch (error) {
    await discardUploadedImages(uploaded);
    throw error;
  }
}

export async function deleteProduct(id) {
  const product = await Product.findById(validId(id));
  if (!product) return null;
  const images = product.images || [];
  await product.deleteOne();
  const warning = await cleanupWarning(images);
  return { ok: true, ...(warning ? { warning } : {}) };
}
