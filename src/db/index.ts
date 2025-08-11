import 'dotenv/config';
import {drizzle} from 'drizzle-orm/libsql';

if (!process.env.DB_FILE_NAME) {
    // biome-ignore lint/suspicious/noConsole: env is not set correctly
    console.error('DB_FILE_NAME not defined');
    process.exit(1);
}
export const db = drizzle(process.env.DB_FILE_NAME);
