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
CREATE TABLE `match_scouting_session` (
	`id` text PRIMARY KEY NOT NULL,
	`scheduled_team_key` text NOT NULL,
	`scouted_team_key` text NOT NULL,
	`scouter_name` text DEFAULT '',
	`auto_started_with_note` integer DEFAULT false,
	`auto_left_start_area` integer DEFAULT false,
	`auto_speaker_Score` integer DEFAULT 0,
	`auto_speaker_miss` integer DEFAULT 0,
	`auto_amp_score` integer DEFAULT 0,
	`auto_amp_miss` integer DEFAULT 0,
	`auto_notes` text DEFAULT '',
	`teleop_speaker_score` integer DEFAULT 0,
	`teleop_speaker_score_amplified` integer DEFAULT 0,
	`teleop_speaker_miss` integer DEFAULT 0,
	`teleop_amp_score` integer DEFAULT 0,
	`teleop_amp_miss` integer DEFAULT 0,
	`teleop_relay_pass` integer DEFAULT 0,
	`teleop_notes` text DEFAULT '',
	`endgame_trap_score` text DEFAULT '',
	`endgame_microphone_score` text DEFAULT '',
	`endgame_did_robot_park` integer DEFAULT false,
	`endgame_did_robot_hang` integer DEFAULT false,
	`endgame_harmony` text DEFAULT '',
	`endgame_notes` text DEFAULT '',
	`final_alliance_score` integer DEFAULT 0,
	`final_ranking_points` integer DEFAULT 0,
	`final_alliance_result` text DEFAULT '',
	`final_violations` text NOT NULL,
	`final_penalties` integer DEFAULT 0,
	`final_notes` text DEFAULT '',
	FOREIGN KEY (`scheduled_team_key`) REFERENCES `event_team`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`scouted_team_key`) REFERENCES `event_team`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `match_scouting_upload` (
	`id` text PRIMARY KEY NOT NULL,
	`refresh_date` text NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE `pit_scouting_session` (
	`id` text PRIMARY KEY NOT NULL,
	`drive_team_experience` text DEFAULT '',
	`number_of_auto_methods` text DEFAULT '',
	`can_pick_up_from_ground` text DEFAULT '',
	`can_receive_from_source_chute` text DEFAULT '',
	`can_score_in_amp` text DEFAULT '',
	`can_score_in_speaker` text DEFAULT '',
	`can_score_in_trap` text NOT NULL,
	`where_can_you_score_in_speaker` text DEFAULT '',
	`can_fit_under_stage` text DEFAULT '',
	`can_get_onstage` text DEFAULT '',
	`robot_width` text DEFAULT '',
	`onstage_position` text DEFAULT '',
	`notes` text DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE `pit_scouting_upload` (
	`id` text PRIMARY KEY NOT NULL,
	`refresh_date` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `team_member` (
	`email` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `event_team` (
	`id` text PRIMARY KEY NOT NULL,
	`number` text NOT NULL,
	`nickname` text NOT NULL,
	`school_name` text NOT NULL
);
