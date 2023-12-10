import { SessionData, sessionOptions } from '@/lib';
import prisma from '@/utils/prisma';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions());

  if (session.isLoggedIn !== true) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let userId = session.userId;

  if (!userId) {
    const user = await prisma.user.findUnique({
      where: {
        email: session.username,
      },
    });
    userId = user?.id;
    session.userId = userId;
    await session.save();
  }

  const categories = await prisma.category.findMany({
    where: {
      userId,
    },
    orderBy: {
      timesUsed: 'desc',
    },
    take: 30,
  });

  return Response.json(categories);
}

export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions());

  if (session.isLoggedIn !== true) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.userId;

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const { categoryName, description, parentId } = body as {
    categoryName: string;
    description?: string;
    parentId?: string;
  };

  const testRegex = /^[a-zA-Z0-9 ]+$/g;

  if (!testRegex.test(categoryName)) {
    return Response.json({ error: 'Invalid category name' }, { status: 400 });
  }

  if (description && !testRegex.test(description)) {
    return Response.json({ error: 'Invalid description' }, { status: 400 });
  }

  const existingCategoryForTheUser = await prisma.category.findFirst({
    where: {
      name: {
        contains: categoryName,
        mode: 'insensitive',
      },
      userId,
    },
  });

  if (existingCategoryForTheUser) {
    return Response.json({ error: 'Category already exists, Please choose a different name' }, { status: 400 });
  }

  const category = await prisma.category.create({
    data: {
      name: categoryName,
      userId,
      description,
      parentCategoryId: parentId,
    },
  });

  return Response.json(category);
}
