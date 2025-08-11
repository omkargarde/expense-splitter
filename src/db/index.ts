import { Env } from '@/lib/env';
import 'dotenv/config';
import {drizzle} from 'drizzle-orm/libsql';

export const db = drizzle(Env.DB_FILE_NAME);
