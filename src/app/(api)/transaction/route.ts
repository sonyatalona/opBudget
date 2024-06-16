import { SessionData, sessionOptions } from '@/lib';
import prisma from '@/utils/prisma';
import { getIronSession } from 'iron-session';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const POST = async (req: Request) => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions());

  if (session.isLoggedIn !== true) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.userId;

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const { amount, type, from, category } = body;

  if (!amount || !type || !from || !category) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }
  try {
    await prisma.record.create({
      data: body,
    });

    revalidatePath(`/dashboard/${userId}`);

    return Response.json('OK', { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    } else {
      return Response.json({ error: 'Unknown error' }, { status: 500 });
    }
  }
};
