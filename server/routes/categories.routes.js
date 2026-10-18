import { Router } from 'express';
import requireAdmin from '../middleware/auth.js';
import {
  createCategory,
  deleteCategory,
  listAdminCategories,
  listCategories,
  updateCategory,
} from '../controllers/categories.controller.js';

const router = Router();

router.get('/', listCategories);
router.get('/admin', requireAdmin, listAdminCategories);
router.post('/', requireAdmin, createCategory);
router.put('/:id', requireAdmin, updateCategory);
router.delete('/:id', requireAdmin, deleteCategory);

export default router;
