import { NextFunction, Request, Response } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors';
import { JwtPayload, verifyJwt } from '../jwt';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Verifies `Authorization: Bearer <token>` and attaches `req.user`.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  console.log('requireAuth', req.headers);
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or invalid Authorization header'));
  }
  try {
    req.user = verifyJwt(header.slice('Bearer '.length).trim());
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}

/**
 * Role-based guard. Must be used after `requireAuth`.
 */
export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(new UnauthorizedError());
    console.log("req.user", req.user)
    const ok = roles.some((r) => req.user!.roles.includes(r));
    if (!ok) return next(new ForbiddenError(`Requires one of roles: ${roles.join(', ')}`));
    next();
  };
}
