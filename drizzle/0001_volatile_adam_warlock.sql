PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_accounts` (
	`id` text(14) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phoneNumber` text NOT NULL,
	`sessionToken` blob
);
--> statement-breakpoint
INSERT INTO `__new_accounts`("id", "name", "phoneNumber", "sessionToken") SELECT "id", "name", "phoneNumber", "sessionToken" FROM `accounts`;--> statement-breakpoint
DROP TABLE `accounts`;--> statement-breakpoint
ALTER TABLE `__new_accounts` RENAME TO `accounts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_name_unique` ON `accounts` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_phoneNumber_unique` ON `accounts` (`phoneNumber`);