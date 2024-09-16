CREATE TABLE `event_match_team` (
	`id` text PRIMARY KEY NOT NULL,
	`event_key` text NOT NULL,
	`match_key` text NOT NULL,
	`alliance` text NOT NULL,
	`alliance_team` integer NOT NULL,
	`team_key` text NOT NULL,
	FOREIGN KEY (`event_key`) REFERENCES `event`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`match_key`) REFERENCES `event_match`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`team_key`) REFERENCES `event_team`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `event_match` (
	`id` text PRIMARY KEY NOT NULL,
	`event_key` text NOT NULL,
	`match_type` text NOT NULL,
	`match_number` integer NOT NULL,
	`set_number` integer NOT NULL,
	`predicted_time` text,
	FOREIGN KEY (`event_key`) REFERENCES `event`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `event_team` (
	`id` text PRIMARY KEY NOT NULL,
	`number` text NOT NULL,
	`nickname` text NOT NULL,
	`school_name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `event` (
	`id` text PRIMARY KEY NOT NULL,
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
	`id` text PRIMARY KEY NOT NULL,
	`event_key` text NOT NULL,
	`match_key` text NOT NULL,
	`alliance` text NOT NULL,
	`alliance_team` integer NOT NULL,
	`scheduled_team_key` text NOT NULL,
	`scouted_team_key` text NOT NULL,
	`scouter_name` text NOT NULL,
	`auto_started_with_note` integer NOT NULL,
	`auto_left_start_area` integer NOT NULL,
	`auto_speaker_Score` integer NOT NULL,
	`auto_speaker_miss` integer NOT NULL,
	`auto_amp_score` integer NOT NULL,
	`auto_amp_miss` integer NOT NULL,
	`auto_notes` text NOT NULL,
	`teleop_speaker_score` integer NOT NULL,
	`teleop_speaker_score_amplified` integer NOT NULL,
	`teleop_speaker_miss` integer NOT NULL,
	`teleop_amp_score` integer NOT NULL,
	`teleop_amp_miss` integer NOT NULL,
	`teleop_relay_pass` integer NOT NULL,
	`teleop_notes` text NOT NULL,
	`endgame_trap_score` text NOT NULL,
	`endgame_microphone_score` text NOT NULL,
	`endgame_did_robot_park` integer NOT NULL,
	`endgame_did_robot_hang` integer NOT NULL,
	`endgame_harmony` text NOT NULL,
	`endgame_notes` text NOT NULL,
	`final_alliance_score` integer NOT NULL,
	`final_ranking_points` integer NOT NULL,
	`final_alliance_result` text NOT NULL,
	`final_violations` text NOT NULL,
	`final_penalties` integer NOT NULL,
	`final_notes` text NOT NULL,
	FOREIGN KEY (`event_key`) REFERENCES `event`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`match_key`) REFERENCES `event_match`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`scheduled_team_key`) REFERENCES `event_team`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`scouted_team_key`) REFERENCES `event_team`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `scouting_pit` (
	`id` text PRIMARY KEY NOT NULL,
	`event_key` text NOT NULL,
	`team_key` text NOT NULL,
	`drive_team_experience` text,
	`number_of_auto_methods` text,
	`can_pick_up_from_ground` text,
	`can_receive_from_source_chute` text,
	`can_score_in_amp` text,
	`can_score_in_speaker` text,
	`can_score_in_trap` text,
	`where_can_you_score_in_speaker` text,
	`can_fit_under_stage` text,
	`can_get_onstage` text,
	`robot_width` text,
	`onstage_position` text,
	`notes` text,
	FOREIGN KEY (`event_key`) REFERENCES `event`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`team_key`) REFERENCES `event_team`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `team_member` (
	`email` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
