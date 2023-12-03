import { SessionOptions } from 'iron-session';

export interface SessionData {
  username: string;
  isLoggedIn: boolean;
  userId?: number;
}

export const defaultSession: SessionData = {
  username: '',
  isLoggedIn: false,
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
