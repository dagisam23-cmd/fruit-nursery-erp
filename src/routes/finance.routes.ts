import express, { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router: Router = express.Router();

// Finance Routes
router.get('/transactions', authenticate, (req, res) => {
  res.json({ message: 'Get transactions', status: 'coming soon' });
});

router.post('/transactions', authenticate, (req, res) => {
  res.json({ message: 'Create transaction', status: 'coming soon' });
});

router.get('/reports/profit-loss', authenticate, (req, res) => {
  res.json({ message: 'Get P&L report', status: 'coming soon' });
});

router.get('/reports/balance-sheet', authenticate, (req, res) => {
  res.json({ message: 'Get balance sheet', status: 'coming soon' });
});

router.get('/budgets', authenticate, (req, res) => {
  res.json({ message: 'Get budgets', status: 'coming soon' });
});

router.post('/budgets', authenticate, (req, res) => {
  res.json({ message: 'Create budget', status: 'coming soon' });
});

export default router;
