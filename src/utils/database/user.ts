import { db, userTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { takeFirst } from './database-utils';

const getUserByUsername = async (username: string) => {
  const user = await db.select().from(userTable).where(eq(userTable.username, username));
  return takeFirst(user);
};

const createUser = async (username: string, email: string, password: string, id: string) => {
  return db
    .insert(userTable)
    .values({
      username,
      email,
      password,
      id,
    })
    .then(takeFirst);
};

export const User = {
  getUserByUsername,
  createUser,
};
