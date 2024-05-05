import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

export async function connectDB(uri: string) {
  const connection = await mysql.createConnection({
    uri,
    ssl: {
      rejectUnauthorized: true,
    },
  });

  return drizzle(connection, {
    schema,
    mode: 'default',
  });
}
