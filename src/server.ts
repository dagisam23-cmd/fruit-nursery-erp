import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import logger from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import authRoutes from './routes/auth.routes';
import nurseryRoutes from './routes/nursery.routes';
import agronom yRoutes from './routes/agronomy.routes';
import inventoryRoutes from './routes/inventory.routes';
import procurementRoutes from './routes/procurement.routes';
import crmRoutes from './routes/crm.routes';
import financeRoutes from './routes/finance.routes';
import hrRoutes from './routes/hr.routes';
import complianceRoutes from './routes/compliance.routes';
import dashboardRoutes from './routes/dashboard.routes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
  })
);

// Body Parser Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request Logging Middleware
app.use(requestLogger);

// Health Check Endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/nursery', nurseryRoutes);
app.use('/api/v1/agronomy', agronom yRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/procurement', procurementRoutes);
app.use('/api/v1/crm', crmRoutes);
app.use('/api/v1/finance', financeRoutes);
app.use('/api/v1/hr', hrRoutes);
app.use('/api/v1/compliance', complianceRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} does not exist`,
  });
});

// Error Handler Middleware (must be last)
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  logger.info(`🚀 Fruit Nursery ERP API running on port ${PORT}`);
  logger.info(`📍 Environment: ${process.env.NODE_ENV}`);
});

export default app;
