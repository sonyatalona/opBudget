import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SessionData, sessionOptions } from './lib';

export async function middleware(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions());
  const user = session.isLoggedIn ? true : false;
  console.log('user', user);
  if (!user) {
    console.log(request.nextUrl);
    return NextResponse.redirect(new URL('/', request.nextUrl).href);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/((?!_next/static|_next/image|favicon.ico|).*)'],
};
