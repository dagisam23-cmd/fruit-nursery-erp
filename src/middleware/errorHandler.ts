import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export interface ApiError extends Error {
  status?: number;
  statusCode?: number;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  logger.error({
    message,
    status,
    path: req.path,
    method: req.method,
    stack: err.stack,
  });

  res.status(status).json({
    error: {
      message,
      status,
      timestamp: new Date().toISOString(),
    },
  });
};
