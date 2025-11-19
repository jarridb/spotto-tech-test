import express from 'express';
import { errorLogger } from './middleware/error-logger.js';
import healthRouter from './routes/health.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());

// Routes
app.use('/api', healthRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
});

// Error handling middleware
app.use(errorLogger);
app.use(
  (_err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An internal server error occurred',
      },
    });
  }
);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

// Handle port conflicts
server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n✗ Port ${PORT} is already in use.`);
    console.error(
      `  Please stop the process using port ${PORT} or change the port in backend/src/index.ts\n`
    );
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
