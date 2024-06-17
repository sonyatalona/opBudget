import { sessionTable, userTable } from '@/drizzle/schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type SelectUser = InferSelectModel<typeof userTable>;
export type InsertUser = InferInsertModel<typeof userTable>;

export type SelectSession = InferSelectModel<typeof sessionTable>;
export type InsertSession = InferInsertModel<typeof sessionTable>;
