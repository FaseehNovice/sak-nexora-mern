import test from 'node:test';
import assert from 'node:assert/strict';
import { Writable } from 'node:stream';
import cloudinaryPackage from 'cloudinary';
import { configure, isCloudinaryImageUrl, uploadProductFiles } from '../lib/cloudinary.js';

const { v2: cloudinary } = cloudinaryPackage;

test('accepts secure image URLs from the configured Cloudinary account only', () => {
  const original = process.env.CLOUDINARY_URL;
  process.env.CLOUDINARY_URL = 'cloudinary://test-key:test-secret@sak-nexora-test';
  try {
    assert.equal(isCloudinaryImageUrl('https://res.cloudinary.com/sak-nexora-test/image/upload/v123/sak-nexora/products/chair.webp'), true);
    assert.equal(isCloudinaryImageUrl('https://res.cloudinary.com/another-account/image/upload/chair.webp'), false);
    assert.equal(isCloudinaryImageUrl('http://res.cloudinary.com/sak-nexora-test/image/upload/chair.webp'), false);
    assert.equal(isCloudinaryImageUrl('https://images.example.com/chair.webp'), false);
  } finally {
    if (original === undefined) delete process.env.CLOUDINARY_URL;
    else process.env.CLOUDINARY_URL = original;
  }
});

test('reports missing Cloudinary credentials as a service configuration error', () => {
  const keys = ['CLOUDINARY_URL', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const original = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  keys.forEach((key) => { delete process.env[key]; });
  try {
    assert.throws(() => configure(), (error) => {
      assert.equal(error.statusCode, 503);
      assert.match(error.message, /CLOUDINARY_URL/);
      return true;
    });
  } finally {
    keys.forEach((key) => {
      if (original[key] === undefined) delete process.env[key];
      else process.env[key] = original[key];
    });
  }
});

test('streams product photo buffers to Cloudinary and returns secure URLs', async () => {
  const originalEnv = Object.fromEntries(
    ['CLOUDINARY_URL', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']
      .map((key) => [key, process.env[key]]),
  );
  const originalUpload = cloudinary.uploader.upload_stream;
  const chunks = [];
  let uploadOptions;
  process.env.CLOUDINARY_URL = 'cloudinary://test-key:test-secret@sak-nexora-test';
  delete process.env.CLOUDINARY_CLOUD_NAME;
  delete process.env.CLOUDINARY_API_KEY;
  delete process.env.CLOUDINARY_API_SECRET;
  cloudinary.uploader.upload_stream = (options, callback) => {
    uploadOptions = options;
    return new Writable({
      write(chunk, encoding, done) { chunks.push(Buffer.from(chunk)); done(); },
      final(done) {
        callback(null, { secure_url: 'https://res.cloudinary.com/sak-nexora-test/image/upload/chair.webp' });
        done();
      },
    });
  };

  try {
    const bytes = Buffer.from('test image content');
    const images = await uploadProductFiles([{ buffer: bytes }], 'chair');
    assert.deepEqual(Buffer.concat(chunks), bytes);
    assert.equal(uploadOptions.folder, 'sak-nexora/products');
    assert.equal(uploadOptions.resource_type, 'image');
    assert.deepEqual(images, ['https://res.cloudinary.com/sak-nexora-test/image/upload/chair.webp']);
  } finally {
    cloudinary.uploader.upload_stream = originalUpload;
    Object.entries(originalEnv).forEach(([key, value]) => {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    });
    cloudinary.config(true);
  }
});
