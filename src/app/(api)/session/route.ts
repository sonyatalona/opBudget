import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { SessionData, defaultSession, sessionOptions, sleep } from '@/lib';
import prisma from '@/utils/prisma';
import bcrypt from 'bcrypt';
import { CurrencyCode } from '@/types/currencies';
import { getParamByISO } from 'iso-country-currency';

// authorize
export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions());

  const body = await req.json();

  const { email, password } = body as { email: string; password: string };

  session.isLoggedIn = true;
  session.email = email;

  const userExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  req.headers.forEach((value, key) => {
    console.log(key, value);
  });

  if (!userExists) {
    let currency: CurrencyCode = CurrencyCode.USD;
    if (req.nextUrl.protocol === 'https:') {
      try {
        const countryCode = req.headers.get('x-vercel-ip-country');
        currency = getParamByISO(countryCode ?? 'US', 'currency') as CurrencyCode;
      } catch (error) {
        console.error(error);
        currency = CurrencyCode.USD;
      }
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
        status: 'ACTIVE',
        currency,
      },
    });
    session.userId = newUser.id;
    session.status = newUser.status;
    session.currency = newUser.currency;
    session.imageUrl = newUser.imageUrl;
    await session.save();
    return Response.json(session);
  }

  const passwordMatch = await bcrypt.compare(password, userExists?.password ?? '');
  if (!passwordMatch) {
    session.destroy();
    return new Response(JSON.stringify({ error: 'Invalid Password' }), {
      status: 401,
    });
  }

  session.userId = userExists.id;
  session.status = userExists.status;
  session.name = userExists.name;
  session.imageUrl = userExists.imageUrl;
  session.currency = userExists.curency;
  await session.save();
  return Response.json(session);
}

// read session
export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions());

  // simulate looking up the user in db
  await sleep(250);

  if (session.isLoggedIn !== true) {
    return Response.json(defaultSession);
  }

  return Response.json(session);
}

// logout
export async function DELETE() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions());

  session.destroy();

  return Response.json(defaultSession);
}
