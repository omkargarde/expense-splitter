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
		<div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
			{/* Header */}
			<header className="sticky top-0 z-10 border-amber-200 border-b bg-white/80 backdrop-blur-sm">
				<div className="mx-auto max-w-4xl px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Link
								className="flex items-center gap-2 text-amber-700 transition-colors hover:text-amber-900"
								href="/dashboard"
							>
								<ArrowLeft className="h-4 w-4" />
								<span className="font-medium">Back to Dashboard</span>
							</Link>
						</div>
						<div className="flex items-center gap-4">
							<div className="text-right">
								<p className="font-medium text-gray-900 text-sm">
									{session.user.name}
								</p>
								<p className="text-gray-600 text-xs">{session.user.email}</p>
							</div>
							<SignOut />
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="mx-auto max-w-2xl px-6 py-12">
				<div className="mb-8 text-center">
					<div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
						<Users className="h-8 w-8 text-amber-600" />
					</div>
					<h1 className="mb-2 font-bold text-3xl text-gray-900">
						Create New Group
					</h1>
					<p className="mx-auto max-w-md text-gray-600">
						Start a new expense group to track shared costs with friends,
						family, or colleagues.
					</p>
				</div>

				<section className="border-0 bg-white/90 shadow-lg backdrop-blur-sm">
					<header className="pb-6 text-center">
						<h2 className="text-gray-900 text-xl">Group Details</h2>
						<p className="text-gray-600">
							Give your group a memorable name that everyone will recognize
						</p>
					</header>

					<div>
						<form action={formActionHandler} className="space-y-6">
							<div className="space-y-2">
								<label
									className="flex items-center gap-2 font-medium text-gray-700 text-sm"
									htmlFor="groupName"
								>
									<Users className="h-4 w-4" />
									Group Name
								</label>
								<input
									className="h-12 border-gray-200 text-base focus:border-amber-400 focus:ring-amber-400/20"
									id="groupName"
									name="groupName"
									placeholder="e.g., Weekend Trip, Roommates, Office Lunch"
									required
									type="text"
								/>
								<p className="mt-1 text-gray-500 text-xs">
									Choose a name that describes what you'll be splitting expenses
									for
								</p>
							</div>

							<div className="pt-4">
								<button
									className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-amber-600 font-medium text-white transition-colors hover:bg-amber-700"
									type="submit"
								>
									<Plus className="h-4 w-4" />
									Create Group
								</button>
							</div>
						</form>
					</div>
				</section>

				{/* Additional Info */}
				<div className="mt-8 text-center">
					<p className="text-gray-500 text-sm">
						After creating your group, you'll be able to invite members and
						start adding expenses.
					</p>
				</div>
			</main>
		</div>
	);
}
