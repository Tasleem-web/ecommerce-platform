import { NextFunction, Request, Response } from 'express';
import { Logger } from 'winston';
import { HttpError } from '../errors';

/**
 * Translates thrown errors into JSON responses.
 * Recognizes `HttpError` subclasses; everything else becomes a 500.
 */
export function errorHandler(logger: Logger) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (err: Error, req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof HttpError) {
      logger.warn(`${err.code} ${err.message}`, { path: req.path, status: err.status });
      res.status(err.status).json({
        error: { code: err.code, message: err.message, details: err.details },
      });
      return;
    }
    logger.error('Unhandled error', { message: err.message, stack: err.stack, path: req.path });
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
    });
  };
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` },
  });
}
