import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { Logger } from 'winston';

const CORRELATION_HEADER = 'x-correlation-id';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      correlationId?: string;
    }
  }
}

/**
 * Generates or propagates a correlation id and logs request/response.
 * Forms the basis of distributed tracing across services.
 */
export function requestLogger(logger: Logger) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const corrId = (req.headers[CORRELATION_HEADER] as string) || randomUUID();
    req.correlationId = corrId;
    res.setHeader(CORRELATION_HEADER, corrId);

    const start = Date.now();
    logger.info('request.in', { correlationId: corrId, method: req.method, path: req.path });

    res.on('finish', () => {
      logger.info('request.out', {
        correlationId: corrId,
        method: req.method,
        path: req.path,
        status: res.statusCode,
        durationMs: Date.now() - start,
      });
    });

    next();
  };
}
