import 'express-session';

declare module 'express-session' {
  interface SessionData {
    token?: string;
    userId?: number;
    username?: string;
    role?: string;
  }
}
