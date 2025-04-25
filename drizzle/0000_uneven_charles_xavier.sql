CREATE TABLE `accounts` (
	`id` text(14) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phoneNumber` text NOT NULL,
	`sessionToken` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_name_unique` ON `accounts` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_phoneNumber_unique` ON `accounts` (`phoneNumber`);