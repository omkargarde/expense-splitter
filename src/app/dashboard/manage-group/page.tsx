import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import z from "zod";
import { SignOut } from "@/components/custom/SignOut";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/db";
import { groups } from "@/db/schema";
import getSession from "@/lib/auth/getSession";

const groupSchema = z.object({
	userEmail: z.email({ error: "Email is required" }),
});

export default async function ManageGroupPage() {
	const session = await getSession();
	const existingGroups = await db.select().from(groups);

	async function formActionHandler(formData: FormData) {
		"use server";

		const formDataObj = {
			userEmail: formData.get("userEmail"),
		};

		const parsedData = groupSchema.safeParse(formDataObj);

		if (!parsedData.success) {
			throw new Error(parsedData.error.message);
		}

		const _userEmail = parsedData.data.userEmail;

		// await db
		// 	.transaction(async (tx) => {
		// 		const [newGroup] = await tx
		// 			.insert(groups)
		// 			.values({
		// 				name: groupName,
		// 			})
		// 			.returning();

		// 		await tx.insert(groupMembers).values({
		// 			groupId: newGroup.id,
		// 			userId: session.session.userId,
		// 		});
		// 	})
		// 	.then(redirect(""));
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

			<div className="mt-8">
				<h2 className="text-xl font-semibold mb-4">Existing Groups</h2>
				{existingGroups.length === 0 ? (
					<p className="text-gray-500">
						No groups found. Create your first group!
					</p>
				) : (
					<div className="space-y-2">
						{existingGroups.map((group) => (
							<div
								key={group.id}
								className="p-4 border rounded-lg bg-white shadow-sm"
							>
								<h3 className="font-medium">{group.name}</h3>
								<p className="text-sm text-gray-500">
									Created: {new Date(group.createdAt).toLocaleDateString()}
								</p>
							</div>
						))}
					</div>
				)}
			</div>
		</main>
	);
}
