import express, { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router: Router = express.Router();

// Dashboard Routes
router.get('/kpis', authenticate, (req, res) => {
  res.json({ message: 'Get KPIs', status: 'coming soon' });
});

router.get('/risk-predictions', authenticate, (req, res) => {
  res.json({ message: 'Get risk predictions', status: 'coming soon' });
});

router.get('/nursery-map', authenticate, (req, res) => {
  res.json({ message: 'Get nursery map', status: 'coming soon' });
});

router.get('/production-status', authenticate, (req, res) => {
  res.json({ message: 'Get production status', status: 'coming soon' });
});

export default router;
