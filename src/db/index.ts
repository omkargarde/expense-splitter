import { drizzle } from 'drizzle-orm/libsql';
import { Env } from '@/lib/env';
import 'dotenv/config';

export const db = drizzle(Env.DB_FILE_NAME);
