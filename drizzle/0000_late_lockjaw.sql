CREATE TABLE `event_match_team` (
	`key` text PRIMARY KEY NOT NULL,
	`event_key` text NOT NULL,
	`match_key` text NOT NULL,
	`alliance` text NOT NULL,
	`alliance_team` integer NOT NULL,
	`team_key` text NOT NULL,
	FOREIGN KEY (`event_key`) REFERENCES `event`(`key`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`match_key`) REFERENCES `event_match`(`key`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`team_key`) REFERENCES `event_team`(`key`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `event_match` (
	`key` text PRIMARY KEY NOT NULL,
	`event_key` text NOT NULL,
	`match_type` text NOT NULL,
	`match_number` integer NOT NULL,
	`set_number` integer NOT NULL,
	`predicted_time` text,
	FOREIGN KEY (`event_key`) REFERENCES `event`(`key`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `event_team` (
	`key` text PRIMARY KEY NOT NULL,
	`number` text NOT NULL,
	`nickname` text NOT NULL,
	`school_name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `event` (
	`key` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `event_levity` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`item` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `scouting_match` (
	`key` text PRIMARY KEY NOT NULL,
	`event_key` text NOT NULL,
	`match_key` text NOT NULL,
	`scheduled_team_key` text NOT NULL,
	`scouted_team_key` text NOT NULL,
	`scouter_name` text NOT NULL,
	FOREIGN KEY (`event_key`) REFERENCES `event`(`key`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`match_key`) REFERENCES `event_match`(`key`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`scheduled_team_key`) REFERENCES `event_team`(`key`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`scouted_team_key`) REFERENCES `event_team`(`key`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `scouting_pit` (
	`key` text PRIMARY KEY NOT NULL,
	`event_key` text NOT NULL,
	`team_key` text NOT NULL,
	FOREIGN KEY (`event_key`) REFERENCES `event`(`key`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`team_key`) REFERENCES `event_team`(`key`) ON UPDATE no action ON DELETE no action
);
