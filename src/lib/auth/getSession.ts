import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from './auth';

export default async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/');
  }

  return session;
}
