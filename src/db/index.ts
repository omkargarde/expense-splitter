import { drizzle } from 'drizzle-orm/libsql';
import { Env } from "@/lib/env";

export const db = drizzle(Env.DB_FILE_NAME);
