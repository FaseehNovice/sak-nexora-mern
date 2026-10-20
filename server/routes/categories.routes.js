import { Router } from 'express';
import multer from 'multer';
import { InputError } from '../lib/inputs.js';
import requireAdmin from '../middleware/auth.js';
import {
  createCategory,
  deleteCategory,
  listAdminCategories,
  listCategories,
  updateCategory,
} from '../controllers/categories.controller.js';

const router = Router();
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter(req, file, callback) {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.mimetype)) {
      return callback(new InputError('Category images must be JPEG, PNG, WebP, or AVIF files.'));
    }
    callback(null, true);
  },
});

router.get('/', listCategories);
router.get('/admin', requireAdmin, listAdminCategories);
router.post('/', requireAdmin, imageUpload.single('image'), createCategory);
router.put('/:id', requireAdmin, imageUpload.single('image'), updateCategory);
router.delete('/:id', requireAdmin, deleteCategory);

export default router;
