import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { SessionData, defaultSession, sessionOptions, sleep } from '@/lib';
import prisma from '@/utils/prisma';
import bcrypt from 'bcrypt';

// authorize
export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions());

  const body = await req.json();

  const { email, password } = body as { email: string; password: string };

  session.isLoggedIn = true;
  session.username = email;

  const userExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!userExists) {
    const newUser = await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
      },
    });
    session.userId = newUser.id;
    await session.save();
    return Response.json(session);
  }

  const passwordMatch = await bcrypt.compare(password, userExists?.password ?? '');
  if (!passwordMatch) {
    session.destroy();
    return new Response(JSON.stringify({ message: 'Invalid Password' }), {
      status: 401,
    });
  }

  session.userId = userExists.id;
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
