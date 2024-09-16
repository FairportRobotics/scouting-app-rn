ALTER TABLE `event_matches` RENAME COLUMN `number` TO `match_number`;--> statement-breakpoint
ALTER TABLE `event_matches` RENAME COLUMN `start_time` TO `predicted_time`;--> statement-breakpoint
ALTER TABLE `event_matches` ADD `set_number` integer NOT NULL;