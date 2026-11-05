import { Router } from 'express';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', requireAuth, requireAdmin, (req, res) => {
  res.json({ message: 'Welcome to the admin API', admin: req.user });
});

export default router;
