import type { Request, Response, NextFunction } from 'express';

/**
 * CORS middleware to allow cross-origin requests from frontend
 */
export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin;
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

  // Allow requests from the configured frontend URL
  if (origin === FRONTEND_URL) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // Allow credentials (cookies, authorization headers)
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Allow common HTTP methods
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );

  // Allow common headers
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  next();
}

