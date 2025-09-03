import { Label } from "@radix-ui/react-label";
import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import z from "zod";
import { SignOut } from "@/components/custom/SignOut";
import { db } from "@/db";
import { groupMembers, groups, user } from "@/db/schema";
import getSession from "@/lib/auth/getSession";

const addUserSchema = z.object({
	userEmail: z.email({ message: "Please enter a valid email address" }),
	groupId: z.string().min(1, { message: "Please select a group" }),
});

export default async function ManageGroupPage() {
	const session = await getSession();
	const existingGroups = await db.select().from(groups);

	// Get group members with user details
	const groupsWithMembers = await Promise.all(
		existingGroups.map(async (group) => {
			const members = await db
				.select({
					userId: groupMembers.userId,
					userName: user.name,
					userEmail: user.email,
				})
				.from(groupMembers)
				.innerJoin(user, eq(groupMembers.userId, user.id))
				.where(eq(groupMembers.groupId, group.id));

			return {
				...group,
				members,
			};
		}),
	);

	async function formActionHandler(formData: FormData) {
		"use server";

		const formDataObj = {
			userEmail: formData.get("userEmail") as string,
			groupId: formData.get("groupId") as string,
		};

		const parsedData = addUserSchema.safeParse(formDataObj);

		if (!parsedData.success) {
			throw new Error(parsedData.error.issues[0].message);
		}

		const { userEmail, groupId } = parsedData.data;

		// Check if user exists
		const existingUser = await db
			.select()
			.from(user)
			.where(eq(user.email, userEmail))
			.limit(1);

		if (existingUser.length === 0) {
			throw new Error("User with this email does not exist");
		}

		const targetUser = existingUser[0];

		// Check if user is already a member of the group
		const existingMembership = await db
			.select()
			.from(groupMembers)
			.where(
				and(
					eq(groupMembers.groupId, parseInt(groupId, 10)),
					eq(groupMembers.userId, targetUser.id),
				),
			)
			.limit(1);

		if (existingMembership.length > 0) {
			throw new Error("User is already a member of this group");
		}

		// Add user to group
		await db.insert(groupMembers).values({
			groupId: parseInt(groupId, 10),
			userId: targetUser.id,
		});

		redirect("/dashboard/manage-group");
	}

	return (
		<main>
			<h1>Welcome {session.user.name}</h1>
			<p>Email: {session.user.email}</p>
			<SignOut />
			<Link href="/dashboard">Dashboard</Link>
			<form action={formActionHandler}>
				<div>
					<Label htmlFor="groupId">Select Group</Label>
					<select id="groupId" name="groupId" required>
						<option value="">Choose a group...</option>
						{existingGroups.map((group) => (
							<option key={group.id} value={group.id}>
								{group.name}
							</option>
						))}
					</select>
				</div>
				<div>
					<Label htmlFor="userEmail">Enter email of the user to add</Label>
					<input
						id="userEmail"
						name="userEmail"
						placeholder="Enter email of the user to add"
						required
						type="email"
					/>
				</div>
				<button type="submit">Add user to group</button>
			</form>

			<div>
				<h2>Existing Groups</h2>
				{existingGroups.length === 0 ? (
					<p>No groups found. Create your first group!</p>
				) : (
					<div>
						{groupsWithMembers.map((group) => (
							<div key={group.id}>
								<h3>{group.name}</h3>
								<p>Created: {new Date(group.createdAt).toLocaleDateString()}</p>
								<div>
									<p>Members ({group.members.length}):</p>
									{group.members.length === 0 ? (
										<p>No members yet</p>
									) : (
										<ul>
											{group.members.map((member) => (
												<li key={member.userId}>
													<span>{member.userName}</span>
													<span>{member.userEmail}</span>
												</li>
											))}
										</ul>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</main>
	);
}
