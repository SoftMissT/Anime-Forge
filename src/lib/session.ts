// lib/session.ts
import { SessionOptions } from 'iron-session';

export interface SessionData {
  isLoggedIn: boolean;
  id: string;
  username: string;
  avatar: string;
}

if (!process.env.SECRET_COOKIE_PASSWORD) {
    throw new Error('A variável de ambiente SECRET_COOKIE_PASSWORD não está configurada.');
}

export const sessionOptions: SessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'kimetsu-forge-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
};

// FIX: Removed module augmentation as it was causing "Invalid module name" errors.
// Type safety for session data should be handled via explicit casting or generics where session is used.
