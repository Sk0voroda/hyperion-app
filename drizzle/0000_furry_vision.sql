CREATE TABLE `accounts` (
	`id` text(14) PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`phoneNumber` text NOT NULL,
	`sessionToken` blob,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_name_unique` ON `accounts` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_phoneNumber_unique` ON `accounts` (`phoneNumber`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text(14) PRIMARY KEY NOT NULL,
	`email` text(64) NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`password` text(64) NOT NULL,
	CONSTRAINT "email" CHECK(length("user"."email") <= 64),
	CONSTRAINT "password" CHECK(length("user"."password") <= 64)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);