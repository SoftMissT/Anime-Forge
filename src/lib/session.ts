// src/lib/session.ts
import { SessionOptions } from 'iron-session';

export interface SessionData {
  isLoggedIn: boolean;
  id: string;
  username: string;
  avatar: string;
}

if (!process.env.SESSION_SECRET) {
    // Fallback for development if needed, but warning is better
    console.warn('A variável de ambiente SESSION_SECRET não está configurada.');
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'default-secret-must-be-at-least-32-chars-long',
  cookieName: 'kimetsu-forge-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
};
