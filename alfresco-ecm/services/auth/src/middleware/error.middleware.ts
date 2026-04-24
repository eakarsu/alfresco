import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Custom application error class with HTTP status code support.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Factory functions for common HTTP errors.
 */
export const HttpErrors = {
  badRequest: (message: string = 'Bad request', details?: unknown) =>
    new AppError(message, 400, true, details),

  unauthorized: (message: string = 'Unauthorized') =>
    new AppError(message, 401, true),

  forbidden: (message: string = 'Forbidden') =>
    new AppError(message, 403, true),

  notFound: (message: string = 'Resource not found') =>
    new AppError(message, 404, true),

  conflict: (message: string = 'Resource already exists') =>
    new AppError(message, 409, true),

  tooManyRequests: (message: string = 'Too many requests') =>
    new AppError(message, 429, true),

  internal: (message: string = 'Internal server error') =>
    new AppError(message, 500, false),
};

/**
 * Global error handling middleware.
 * Must be registered after all routes.
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const isOperational = err instanceof AppError ? err.isOperational : false;

  // Log error details
  logger.error(`[${req.method}] ${req.originalUrl} - ${err.message}`, {
    statusCode,
    stack: err.stack,
    body: req.body,
    params: req.params,
    query: req.query,
    ip: req.ip,
  });

  // Build response
  const response: Record<string, unknown> = {
    error: isOperational ? err.message : 'Internal server error',
    statusCode,
  };

  // Include details in non-production environments
  if (err instanceof AppError && err.details) {
    response.details = err.details;
  }

  if (process.env.NODE_ENV !== 'production' && !isOperational) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

/**
 * Middleware to handle 404 for unmatched routes.
 */
export function notFoundHandler(req: Request, res: Response, _next: NextFunction): void {
  res.status(404).json({
    error: 'Route not found',
    statusCode: 404,
    path: req.originalUrl,
    method: req.method,
  });
}
