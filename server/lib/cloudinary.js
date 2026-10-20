import { randomUUID } from 'node:crypto';
import { Readable } from 'node:stream';
import cloudinaryPackage from 'cloudinary';

const { v2: cloudinary } = cloudinaryPackage;

const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'avif'];


function cloudinaryFailure(error, action) {
  const status = Number(error.http_code ?? error.statusCode);
  const providerMessage =
    error.error?.message ??
    error.message ??
    "Unknown Cloudinary error";

  console.error("Cloudinary diagnostic:", {
    action,
    status: status || "unknown",
    message: providerMessage,
  });

  const detail = status
    ? `HTTP ${status}: ${providerMessage}`
    : providerMessage;

  const failure = new Error(`Cloudinary ${action} failed. ${detail}`);
  failure.statusCode = 502;
  failure.cause = error;

  return failure;
}


function cloudName() {
  if (process.env.CLOUDINARY_CLOUD_NAME) return process.env.CLOUDINARY_CLOUD_NAME;
  try {
    const url = new URL(process.env.CLOUDINARY_URL);
    return url.protocol === 'cloudinary:' ? url.hostname : '';
  } catch {
    return '';
  }
}

function configured() {
  const cloudinaryUrl = process.env.CLOUDINARY_URL?.trim();
  if (cloudinaryUrl) {
    try {
      const url = new URL(cloudinaryUrl);
      return url.protocol === 'cloudinary:' && url.hostname && url.username && url.password;
    } catch {
      return false;
    }
  }
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

function configure() {
  if (!configured()) {
    const error = new Error('Cloudinary is not configured. Set CLOUDINARY_URL or all three CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET values.');
    error.statusCode = 503;
    throw error;
  }
  cloudinary.config(true);
  if (process.env.CLOUDINARY_URL?.trim()) cloudinary.config({ secure: true });
  else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
}

function isCloudinaryImageUrl(value) {
  try {
    const url = new URL(value);
    const [accountName, resourceType, deliveryType] = url.pathname.split('/').filter(Boolean);
    return url.protocol === 'https:'
      && url.hostname === 'res.cloudinary.com'
      && accountName === cloudName()
      && resourceType === 'image'
      && deliveryType === 'upload';
  } catch {
    return false;
  }
}

function uploadBuffer(buffer, publicId, folder = 'sak-nexora/products') {
  configure();
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream({
      folder,
      public_id: publicId,
      resource_type: 'image',
      allowed_formats: ALLOWED_FORMATS,
      unique_filename: false,
      overwrite: false,
    }, (error, result) => {
      if (error) return reject(cloudinaryFailure(error, 'image upload'));
      if (!result?.secure_url) return reject(new Error('Cloudinary did not return a secure image URL.'));
      resolve(result.secure_url);
    });
    Readable.from([buffer]).on('error', reject).pipe(upload);
  });
}

async function uploadCategoryFile(file, slug) {
  if (!file) return '';
  configure();
  try {
    const publicId = `category-${slug}-${randomUUID()}`;
    return await uploadBuffer(file.buffer, publicId, 'sak-nexora/categories');
  } catch (error) {
    throw error;
  }
}

async function uploadProductFiles(files, slug) {
  if (!files.length) return [];
  configure();
  const uploaded = [];
  try {
    for (const [index, file] of files.entries()) {
      const publicId = `${slug}-${randomUUID()}-${index + 1}`;
      uploaded.push(await uploadBuffer(file.buffer, publicId));
    }
    return uploaded;
  } catch (error) {
    try {
      await deleteCloudinaryImages(uploaded);
    } catch (cleanupError) {
      console.error('Cloudinary upload rollback failed:', cleanupError.message);
    }
    throw error;
  }
}

async function uploadRemoteProductImage(url, slug, index) {
  configure();
  let result;
  try {
    result = await cloudinary.uploader.upload(url, {
      folder: 'sak-nexora/products',
      public_id: `${slug}-${randomUUID()}-${index + 1}`,
      resource_type: 'image',
      allowed_formats: ALLOWED_FORMATS,
      unique_filename: false,
      overwrite: false,
    });
  } catch (error) {
    throw cloudinaryFailure(error, 'image migration');
  }
  if (!result.secure_url) throw new Error('Cloudinary did not return a secure image URL.');
  return result.secure_url;
}

async function deleteCloudinaryImages(urls) {
  const candidates = [...new Set(urls.filter((value) => {
    try {
      const url = new URL(value);
      return url.hostname === 'res.cloudinary.com' && url.pathname.includes('/image/upload/');
    } catch {
      return false;
    }
  }))];
  if (!candidates.length) return;
  configure();
  const images = candidates.filter(isCloudinaryImageUrl);
  if (images.length !== candidates.length) {
    throw new Error('A stored image belongs to a different Cloudinary account.');
  }
  const results = await Promise.all(images.map(async (url) => {
    const publicId = cloudinary.utils.extractPublicId(url);
    if (!publicId) throw new Error('Could not identify a Cloudinary image for deletion.');
    let result;
    try {
      result = await cloudinary.uploader.destroy(publicId, { invalidate: true, resource_type: 'image' });
    } catch (error) {
      throw cloudinaryFailure(error, 'image deletion');
    }
    if (!['ok', 'not found'].includes(result.result)) {
      throw new Error(`Cloudinary could not delete image ${publicId}.`);
    }
  }));
  return results;
}

export {
  cloudName,
  configure,
  deleteCloudinaryImages,
  isCloudinaryImageUrl,
  uploadProductFiles,
  uploadCategoryFile,
  uploadRemoteProductImage,
};
