import { Label } from '@radix-ui/react-label';
import { SignOut } from '@/components/custom/SignOut';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/db';
import { groupMembers, groups } from '@/db/schema';
import getSession from '@/lib/auth/getSession';

export default async function CreateGroup() {
  const session = await getSession();

  async function formActionHandler(formData: FormData) {
    'use server';
    const groupName = formData.get('groupName');
    if (!groupName || typeof groupName !== 'string') {
      throw new Error('Invalid group name');
    }
    if (groupName) {
      await db.transaction(async (tx) => {
        const [newGroup] = await tx
          .insert(groups)
          .values({
            name: groupName,
          })
          .returning();

        await tx.insert(groupMembers).values({
          groupId: newGroup.id,
          userId: session.session.userId,
        });
      });
    }
  }
  return (
    <main>
      <h1>Welcome {session.user.name}</h1>
      <p>Email: {session.user.email}</p>
      <SignOut />
      <form action={formActionHandler}>
        <div>
          <Label htmlFor="groupName">Enter group name</Label>
          <Input
            id="groupName"
            name="groupName"
            placeholder="Enter group name"
            required
            type="text"
          />
        </div>
        <Button type="submit">Create Group</Button>
      </form>
    </main>
  );
}
