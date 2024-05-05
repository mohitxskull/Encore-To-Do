import { sql } from 'drizzle-orm';
import {
  datetime,
  int,
  mysqlEnum,
  mysqlTableCreator,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { nanoid } from 'nanoid';

export const createTable = mysqlTableCreator((name) => name);

export const UserSchema = createTable('user', {
  ID: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => nanoid()),

  Name: varchar('name', { length: 50 }).notNull(),

  Email: varchar('email', { length: 255 }).notNull(),
  EmailVerified: datetime('emailVerified'),

  Password: text('password').notNull(),

  CreatedAt: datetime('createdAt', { mode: 'date' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  UpdatedAt: datetime('updatedAt'),
});
