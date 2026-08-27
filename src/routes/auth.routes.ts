import express, { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router: Router = express.Router();

// Auth Routes
router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint', status: 'coming soon' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint', status: 'coming soon' });
});

router.post('/refresh-token', (req, res) => {
  res.json({ message: 'Refresh token endpoint', status: 'coming soon' });
});

router.post('/logout', authenticate, (req, res) => {
  res.json({ message: 'Logout endpoint', status: 'coming soon' });
});

router.get('/profile', authenticate, (req, res) => {
  res.json({ message: 'Get profile endpoint', status: 'coming soon' });
});

export default router;
