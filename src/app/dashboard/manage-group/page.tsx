import { Label } from '@radix-ui/react-label';
import Link from 'next/link';
import { SignOut } from '@/components/custom/SignOut';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import getSession from '@/lib/auth/getSession';

export default async function ManageGroupPage() {
  const session = await getSession();

  function formActionHandler(formData: FormData) {
    'use server';
    const userEmail = formData.get('userEmail');
    if (!userEmail || typeof userEmail !== 'string') {
      throw new Error('Invalid group name');
    }
  }

  return (
    <main>
      <h1 className="capitalize">Welcome {session.user.name}</h1>
      <p>Email: {session.user.email}</p>
      <SignOut />
      <Link href="/dashboard">Dashboard</Link>
      <form action={formActionHandler}>
        <div>
          <Label htmlFor="userEmail">Enter email of the user to add</Label>
          <Input
            id="userEmail"
            name="userEmail"
            placeholder="Enter email of the user to add"
            required
            type="email"
          />
        </div>
        <Button type="submit">Add user</Button>
      </form>
    </main>
  );
}
