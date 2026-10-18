import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { authStatus, login } from '../controllers/auth.controller.js';

const router = Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false });

router.get('/status', authStatus);
router.post('/login', limiter, login);

export default router;
