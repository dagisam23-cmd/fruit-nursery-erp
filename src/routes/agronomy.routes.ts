import express, { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router: Router = express.Router();

// Agronomy Routes
router.get('/inspections', authenticate, (req, res) => {
  res.json({ message: 'Get inspections', status: 'coming soon' });
});

router.post('/inspections', authenticate, (req, res) => {
  res.json({ message: 'Create inspection', status: 'coming soon' });
});

router.get('/diseases', authenticate, (req, res) => {
  res.json({ message: 'Get diseases', status: 'coming soon' });
});

router.post('/diseases', authenticate, (req, res) => {
  res.json({ message: 'Record disease', status: 'coming soon' });
});

router.get('/growth-analytics/:plantId', authenticate, (req, res) => {
  res.json({ message: 'Get growth analytics', status: 'coming soon' });
});

router.post('/observations', authenticate, (req, res) => {
  res.json({ message: 'Create observation', status: 'coming soon' });
});

export default router;
