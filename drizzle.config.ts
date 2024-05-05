import { type Config } from 'drizzle-kit';

export default {
  schema: ['./database/schema.ts'],
  driver: 'mysql2',
  dbCredentials: {
    uri: process.env.DB_URI ?? '',
  },
  tablesFilter: ['*'],
  out: './drizzle',
} satisfies Config;
