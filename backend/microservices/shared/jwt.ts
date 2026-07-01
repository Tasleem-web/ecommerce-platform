import jwt, { SignOptions } from 'jsonwebtoken';
import { sharedConfig } from './config';

export interface JwtPayload {
  id?: string,
  email: string,
  name: string,
  roles: string[],
  image: string,
  gender: string,
}

export function signJwt(payload: JwtPayload): string {
  const opts: SignOptions = { expiresIn: sharedConfig.jwt.expiresIn as SignOptions['expiresIn'] };
  return jwt.sign(payload, sharedConfig.jwt.secret, opts);
}

export function verifyJwt(token: string): JwtPayload {
  return jwt.verify(token, sharedConfig.jwt.secret) as JwtPayload;
}
