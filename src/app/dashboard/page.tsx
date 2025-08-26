import Link from 'next/link';
import { SignOut } from '@/components/custom/SignOut';
import getSession from '@/lib/auth/getSession';

export default async function DashboardPage() {
  const session = await getSession();

  return (
    <main>
      <h1>Welcome {session.user.name}</h1>
      <p>Email: {session.user.email}</p>
      <SignOut />
      <Link href="/dashboard">Dashboard</Link>
      <nav>
        <ul>
          <li>
            <Link href="/dashboard/create-group">Create Group</Link>
          </li>
          <li>
            <Link href="/dashboard/manage-group">Manage Groups</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
