import { SessionOptions } from 'iron-session';

export interface SessionData {
  email: string;
  name: string;
  isLoggedIn: boolean;
  userId?: string;
  status: 'ACTIVE' | 'BLOCKED';
  imageUrl?: string;
  currency: string;
  budget?: number;
}

export const defaultSession: SessionData = {
  currency: 'USD',
  email: '',
  name: 'Anonymous',
  isLoggedIn: false,
  status: 'ACTIVE',
  budget: 0,
};

export const sessionOptions = (ttl?: number): SessionOptions => {
  return {
    password: process.env.COOKIE_PASS!,
    cookieName: 'lib-ts-swr-session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
    ttl: ttl ?? 60 * 60 * 24 * 2, // 2 days
  };
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
