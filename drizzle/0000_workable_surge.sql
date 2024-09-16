CREATE TABLE `event_match_teams` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`match_key` text NOT NULL,
	`alliance` text NOT NULL,
	`alliance_number` integer NOT NULL,
	`team_key` text NOT NULL,
	FOREIGN KEY (`match_key`) REFERENCES `event_matches`(`key`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`team_key`) REFERENCES `event_teams`(`key`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `event_matches` (
	`key` text PRIMARY KEY NOT NULL,
	`event_key` text NOT NULL,
	`type` text NOT NULL,
	`number` integer NOT NULL,
	`start_time` text,
	FOREIGN KEY (`event_key`) REFERENCES `event`(`key`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `event_teams` (
	`key` text PRIMARY KEY NOT NULL,
	`number` integer NOT NULL,
	`nickname` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `event` (
	`key` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `levity` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
