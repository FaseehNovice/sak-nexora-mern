import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import requireAdmin from '../middleware/auth.js';
import {
  createEnquiry,
  deleteEnquiry,
  listEnquiries,
  updateEnquiryStatus,
} from '../controllers/enquiries.controller.js';

const router = Router();
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many enquiries from this connection. Please try again later or message us on WhatsApp.' },
});

router.post('/', limiter, createEnquiry);
router.get('/', requireAdmin, listEnquiries);
router.patch('/:id', requireAdmin, updateEnquiryStatus);
router.delete('/:id', requireAdmin, deleteEnquiry);

export default router;
