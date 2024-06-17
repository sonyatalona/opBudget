import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/postgres-js';
import { createSelectSchema } from 'drizzle-zod';
import postgres from 'postgres';

const connectionString = process.env.DB_URL!;
const pool = postgres(connectionString, { max: 1 });

export const db = drizzle(pool);

export const userTable = pgTable('user', {
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  id: text('id').primaryKey(),
});

export const selectUserSchema = createSelectSchema(userTable);

export const sessionTable = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});
