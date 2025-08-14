import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { db } from '@/db';
import { account, session, user, verification } from '@/db/schema';
import { Env } from '@/lib/env';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: {
      user,
      verification,
      account,
      session,
    },
  }),
  plugins: [nextCookies()],
  socialProviders: {
    github: {
      clientId: Env.GITHUB_CLIENT_ID,
      clientSecret: Env.GITHUB_CLIENT_SECRET,
    },
  },
});
