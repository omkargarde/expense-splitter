import { ArrowLeft, Plus, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import z from "zod";
import { SignOut } from "@/components/custom/SignOut";
import { db } from "@/db";
import { groupMembers, groups } from "@/db/schema";
import getSession from "@/lib/auth/getSession";

const groupSchema = z.object({
	groupName: z
		.string()
		.min(1, "Group name is required")
		.max(50, "Group name must be at most 50 characters")
		.trim(),
});

export default async function CreateGroupPage() {
	const session = await getSession();

	async function formActionHandler(formData: FormData) {
		"use server";
		const data = formData.get("groupName");
		const parsedData = groupSchema.safeParse({ groupName: data });

		if (!parsedData.success) {
			throw new Error(parsedData.error.issues[0].message);
		}

		const groupName = parsedData.data.groupName;

		await db
			.transaction(async (tx) => {
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
			})
			.then(redirect("/dashboard"));
	}

	return (
		<div>
			{/* Header */}
			<header>
				<div>
					<div>
						<div>
							<Link href="/dashboard">
								<span>Home</span>
							</Link>
						</div>
						<div>
							<div>
								<p>{session.user.name}</p>
								<p>{session.user.email}</p>
							</div>
							<SignOut />
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main>
				<div>
					<div>
						<Users />
					</div>
					<h1>Create New Group</h1>
					<p>
						Start a new expense group to track shared costs with friends,
						family, or colleagues.
					</p>
				</div>

				<section>
					<header>
						<h2>Group Details</h2>
						<p>Give your group a memorable name that everyone will recognize</p>
					</header>

					<div>
						<form action={formActionHandler}>
							<div>
								<label htmlFor="groupName">
									<Users />
									Group Name
								</label>
								<input
									id="groupName"
									name="groupName"
									placeholder="e.g., Weekend Trip, Roommates, Office Lunch"
									required
									type="text"
								/>
								<p>
									Choose a name that describes what you'll be splitting expenses
									for
								</p>
							</div>

							<div>
								<button type="submit">
									<Plus />
									Create Group
								</button>
							</div>
						</form>
					</div>
				</section>

				{/* Additional Info */}
				<div>
					<p>
						After creating your group, you'll be able to invite members and
						start adding expenses.
					</p>
				</div>
			</main>
		</div>
	);
}
