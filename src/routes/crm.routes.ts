import express, { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router: Router = express.Router();

// CRM Routes
router.get('/customers', authenticate, (req, res) => {
  res.json({ message: 'Get customers', status: 'coming soon' });
});

router.post('/customers', authenticate, (req, res) => {
  res.json({ message: 'Create customer', status: 'coming soon' });
});

router.get('/leads', authenticate, (req, res) => {
  res.json({ message: 'Get leads', status: 'coming soon' });
});

router.post('/leads', authenticate, (req, res) => {
  res.json({ message: 'Create lead', status: 'coming soon' });
});

router.get('/orders', authenticate, (req, res) => {
  res.json({ message: 'Get orders', status: 'coming soon' });
});

router.post('/orders', authenticate, (req, res) => {
  res.json({ message: 'Create order', status: 'coming soon' });
});

export default router;
