import jwt, { SignOptions } from 'jsonwebtoken';
import { sharedConfig } from './config';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

export function signJwt(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  const opts: SignOptions = { expiresIn: sharedConfig.jwt.expiresIn as SignOptions['expiresIn'] };
  return jwt.sign(payload, sharedConfig.jwt.secret, opts);
}

export function verifyJwt(token: string): JwtPayload {
  return jwt.verify(token, sharedConfig.jwt.secret) as JwtPayload;
}
