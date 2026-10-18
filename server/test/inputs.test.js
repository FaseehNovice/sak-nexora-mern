import test from 'node:test';
import assert from 'node:assert/strict';
import {
  InputError,
  parseCategoryInput,
  parseEnquiryInput,
  parsePagination,
  parseProductInput,
} from '../lib/inputs.js';

const categoryId = '64b000000000000000000001';
const productId = '64b000000000000000000002';

test('normalizes product names, slugs, and image URLs', () => {
  const product = parseProductInput({
    name: '  Blue Lounge Chair  ',
    category: categoryId,
    featured: false,
    images: ['https://images.example.com/chair.webp'],
  });

  assert.equal(product.name, 'Blue Lounge Chair');
  assert.equal(product.slug, 'blue-lounge-chair');
  assert.deepEqual(product.images, ['https://images.example.com/chair.webp']);
});

test('rejects invalid product categories, slugs, and image protocols', () => {
  assert.throws(() => parseProductInput({ name: 'Chair', category: 'bad', featured: false }), InputError);
  assert.throws(() => parseProductInput({ name: 'Chair', category: categoryId, featured: false, slug: '!!!' }), InputError);
  assert.throws(() => parseProductInput({ name: 'Chair', category: categoryId, featured: false, images: ['javascript:alert(1)'] }), InputError);
});

test('normalizes categories and validates sort order', () => {
  assert.deepEqual(parseCategoryInput({ name: 'Bathroom Kits', parent: '', order: '3' }), {
    name: 'Bathroom Kits',
    slug: 'bathroom-kits',
    parent: null,
    description: '',
    order: 3,
  });
  assert.throws(() => parseCategoryInput({ name: 'Furniture', order: -1 }), InputError);
});

test('normalizes enquiry line items from trusted identifiers and combines duplicates', () => {
  const enquiry = parseEnquiryInput({
    name: 'Sam',
    phone: '+92 300 123 4567',
    items: [{ _id: productId, qty: 2 }, { product: productId, qty: 3, name: 'Client supplied name' }],
  });

  assert.deepEqual(enquiry.items, [{ product: productId, qty: 5 }]);
  assert.equal(enquiry.name, 'Sam');
});

test('rejects invalid enquiries and query pagination', () => {
  assert.throws(() => parseEnquiryInput({ name: 'Sam', phone: '1234567', message: '' }), InputError);
  assert.throws(() => parseEnquiryInput({ name: 'Sam', phone: '1234567', items: [{ _id: productId, qty: 1.5 }] }), InputError);
  assert.throws(() => parseEnquiryInput({ name: 'Sam', phone: '1234567', email: 'not-an-email', message: 'Hello' }), InputError);
  assert.throws(() => parsePagination({ page: '0' }), InputError);
  assert.deepEqual(parsePagination({ page: '3', limit: '200' }), { page: 3, limit: 60 });
});
