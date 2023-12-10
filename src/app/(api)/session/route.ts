import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { SessionData, defaultSession, sessionOptions, sleep } from '@/lib';
import prisma from '@/utils/prisma';
import bcrypt from 'bcrypt';
import { CurrencyCode } from '@/types/currencies';
import { getParamByParam } from 'iso-country-currency';

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
  console.log(req);
  console.log(req.ip);
  console.log(req.geo);
  console.log(req.geo?.country);
  try {
    console.log(getParamByParam('countryName', req.geo?.country ?? '', 'currency') as CurrencyCode);
  } catch (error) {
    console.error(error);
  }

  if (!userExists) {
    let currency: CurrencyCode;

    try {
      currency = getParamByParam('countryName', req.geo?.country ?? '', 'currency') as CurrencyCode;
    } catch (error) {
      console.error(error);
      currency = CurrencyCode.USD;
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
  session.curency = userExists.curency;
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
