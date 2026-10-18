import { Router } from 'express';
import multer from 'multer';
import requireAdmin from '../middleware/auth.js';
import { InputError } from '../lib/inputs.js';
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProductFilters,
  listProducts,
  updateProduct,
} from '../controllers/products.controller.js';

const router = Router();
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 12 },
  fileFilter(req, file, callback) {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.mimetype)) {
      return callback(new InputError('Product images must be JPEG, PNG, WebP, or AVIF files.'));
    }
    callback(null, true);
  },
});

router.get('/filters', listProductFilters);
router.get('/', listProducts);
router.get('/:slug', getProduct);
router.post('/', requireAdmin, imageUpload.array('images', 12), createProduct);
router.put('/:id', requireAdmin, imageUpload.array('images', 12), updateProduct);
router.delete('/:id', requireAdmin, deleteProduct);

export default router;
