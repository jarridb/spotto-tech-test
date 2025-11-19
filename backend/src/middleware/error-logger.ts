import type { NextFunction, Request, Response } from 'express';

/**
 * Error logging middleware
 * Logs errors and warnings to console
 */
export const errorLogger = (err: Error, req: Request, _res: Response, next: NextFunction) => {
  // Log errors
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Pass to next error handler
  next(err);
};

/**
 * Warning logger middleware
 * Logs warnings for non-critical issues
 */
export const warningLogger = (message: string) => {
  console.warn('Warning:', message);
};
