/** biome-ignore-all lint/suspicious/noConsole: TODO:remove console logs */
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import { Env } from '@/lib/env';
import { usersTable } from './schema';

export const db = drizzle(Env.DB_FILE_NAME);

async function main() {
  const user: typeof usersTable.$inferInsert = {
    name: 'John',
    age: 30,
    email: 'john@example.com',
  };
  await db.delete(usersTable).where(eq(usersTable.email, user.email));
  console.log('User deleted!');

  await db.insert(usersTable).values(user);
  console.log('New user created!');

  const users = await db.select().from(usersTable);
  console.log('Getting all users from the database: ', users);

  await db
    .update(usersTable)
    .set({
      age: 31,
    })
    .where(eq(usersTable.email, user.email));
  console.log('User info updated!');

  
}

main();
