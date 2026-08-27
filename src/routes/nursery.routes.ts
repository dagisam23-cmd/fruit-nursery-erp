import express, { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router: Router = express.Router();

// Nursery Management Routes
router.get('/batches', authenticate, (req, res) => {
  res.json({ message: 'Get batches', status: 'coming soon' });
});

router.post('/batches', authenticate, (req, res) => {
  res.json({ message: 'Create batch', status: 'coming soon' });
});

router.get('/batches/:batchId', authenticate, (req, res) => {
  res.json({ message: 'Get batch details', status: 'coming soon' });
});

router.get('/batches/:batchId/stages', authenticate, (req, res) => {
  res.json({ message: 'Get batch stages', status: 'coming soon' });
});

router.put('/batches/:batchId/stages/:stageId', authenticate, (req, res) => {
  res.json({ message: 'Update batch stage', status: 'coming soon' });
});

router.get('/production-pipeline', authenticate, (req, res) => {
  res.json({ message: 'Get production pipeline', status: 'coming soon' });
});

export default router;
