import { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../jwt';

/**
 * Optionally extracts user info from JWT (if present) without failing.
 * Attaches `req.user` if token is valid, otherwise continues silently.
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const cookieToken = req.headers.cookie
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('authToken='))
    ?.split('=')[1];

  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length).trim() : decodeURIComponent(cookieToken || '');

  if (token) {
    try {
      req.user = verifyJwt(token);
    } catch {
      // Token invalid or expired — continue without user
    }
  }

  next();
}