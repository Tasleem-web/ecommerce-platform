import { NextFunction, Request, Response } from 'express';
import { ForbiddenError, UnauthorizedError } from '../../../shared';

export function requireSessionAuth(req: Request, _res: Response, next: NextFunction): void {
  if (req.session && req.session.token) {
    req.user = {
      sub: String(req.session.userId ?? ''),
      email: req.session.username ?? '',
      roles: req.session.role ? [req.session.role] : [],
    };
    return next();
  }

  next(new UnauthorizedError('Session is missing or expired'));
}

export function requireAdminSession(req: Request, _res: Response, next: NextFunction): void {
  if (req.session && req.session.role === 'admin') {
    return next();
  }

  next(new ForbiddenError('Forbidden: Admins only'));
}
