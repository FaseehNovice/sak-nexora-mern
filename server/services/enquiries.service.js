import mongoose from 'mongoose';
import Enquiry from '../models/Enquiry.js';
import Product from '../models/Product.js';
import { InputError, parseEnquiryInput, parsePagination } from '../lib/inputs.js';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export async function createEnquiry(body) {
  const input = parseEnquiryInput(body);
  let items = [];
  if (input.items.length) {
    const products = await Product.find({ _id: { $in: input.items.map((item) => item.product) } })
      .select('_id name').lean();
    const productsById = new Map(products.map((product) => [String(product._id), product]));
    const missing = input.items.find((item) => !productsById.has(item.product));
    if (missing) throw new InputError('An item in your list is no longer available. Refresh the catalogue and try again.');
    items = input.items.map((item) => ({
      product: item.product,
      name: productsById.get(item.product).name,
      qty: item.qty,
    }));
  }

  const enquiry = await Enquiry.create({ ...input, items });
  return { ok: true, id: enquiry._id };
}

export async function listEnquiries(query) {
  const { page, limit } = parsePagination(query, 20, 100);
  const filter = {};
  if (query.status) {
    const status = String(query.status);
    if (!['new', 'quoted', 'closed'].includes(status)) throw new InputError('Choose a valid enquiry status.');
    filter.status = status;
  }
  if (query.q !== undefined) {
    const term = String(query.q).trim();
    if (term.length > 100) throw new InputError('Search terms must be 100 characters or fewer.');
    if (term) {
      const expression = new RegExp(escapeRegex(term), 'i');
      filter.$or = [
        { name: expression },
        { phone: expression },
        { email: expression },
        { business: expression },
        { message: expression },
        { 'items.name': expression },
      ];
    }
  }
  const [items, total] = await Promise.all([
    Enquiry.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Enquiry.countDocuments(filter),
  ]);
  return { items, total, page, pages: Math.ceil(total / limit) };
}

export async function updateEnquiryStatus(id, body) {
  if (!mongoose.isValidObjectId(id)) throw new InputError('The enquiry ID is invalid.');
  const status = body?.status;
  if (!['new', 'quoted', 'closed'].includes(status)) throw new InputError('Choose a valid enquiry status.');
  return Enquiry.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
}

export async function deleteEnquiry(id) {
  if (!mongoose.isValidObjectId(id)) throw new InputError('The enquiry ID is invalid.');
  return Enquiry.findByIdAndDelete(id);
}
