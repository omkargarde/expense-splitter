PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_expense_splits` (
	`expense_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`amount_owed` integer NOT NULL,
	FOREIGN KEY (`expense_id`) REFERENCES `expenses`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_expense_splits`("expense_id", "user_id", "amount_owed") SELECT "expense_id", "user_id", "amount_owed" FROM `expense_splits`;--> statement-breakpoint
DROP TABLE `expense_splits`;--> statement-breakpoint
ALTER TABLE `__new_expense_splits` RENAME TO `expense_splits`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`group_id` integer NOT NULL,
	`paid_by_id` integer NOT NULL,
	`description` text NOT NULL,
	`amount` integer NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`paid_by_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_expenses`("id", "group_id", "paid_by_id", "description", "amount", "created_at") SELECT "id", "group_id", "paid_by_id", "description", "amount", "created_at" FROM `expenses`;--> statement-breakpoint
DROP TABLE `expenses`;--> statement-breakpoint
ALTER TABLE `__new_expenses` RENAME TO `expenses`;--> statement-breakpoint
CREATE TABLE `__new_group_members` (
	`group_id` integer NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_group_members`("group_id", "user_id") SELECT "group_id", "user_id" FROM `group_members`;--> statement-breakpoint
DROP TABLE `group_members`;--> statement-breakpoint
ALTER TABLE `__new_group_members` RENAME TO `group_members`;