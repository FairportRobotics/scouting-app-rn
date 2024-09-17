import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const events = sqliteTable("event", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
});

export const matches = sqliteTable("event_match", {
  id: text("id").notNull().primaryKey(),
  eventKey: text("event_key")
    .notNull()
    .references(() => events.id),
  matchType: text("match_type", { enum: ["qm", "sf", "f"] }).notNull(),
  matchNumber: integer("match_number").notNull(),
  setNumber: integer("set_number").notNull(),
  predictedTime: text("predicted_time"),
});

export const teams = sqliteTable("event_team", {
  id: text("id").notNull().primaryKey(),
  number: text("number").notNull(),
  nickname: text("nickname").notNull(),
  schoolName: text("school_name").notNull(),
});

export const matchTeams = sqliteTable("event_match_team", {
  id: text("id").notNull().primaryKey(),
  eventKey: text("event_key")
    .notNull()
    .references(() => events.id),
  matchKey: text("match_key")
    .notNull()
    .references(() => matches.id),
  alliance: text("alliance", { enum: ["Blue", "Red"] }).notNull(),
  allianceTeam: integer("alliance_team").notNull(),
  teamKey: text("team_key")
    .notNull()
    .references(() => teams.id),
});

export const matchScoutingSessions = sqliteTable("match_scouting_session", {
  id: text("id").notNull().primaryKey(),

  scheduledTeamKey: text("scheduled_team_key")
    .notNull()
    .references(() => teams.id),
  scoutedTeamKey: text("scouted_team_key")
    .notNull()
    .references(() => teams.id),
  scouterName: text("scouter_name").default(""),

  autoStartedWithNote: integer("auto_started_with_note", {
    mode: "boolean",
  }).default(false),
  autoLeftStartArea: integer("auto_left_start_area", {
    mode: "boolean",
  }).default(false),
  autoSpeakerScore: integer("auto_speaker_Score").default(0),
  autoSpeakerMiss: integer("auto_speaker_miss").default(0),
  autoAmpScore: integer("auto_amp_score").default(0),
  autoAmpMiss: integer("auto_amp_miss").default(0),
  autoNotes: text("auto_notes").default(""),

  teleopSpeakerScore: integer("teleop_speaker_score").default(0),
  teleopSpeakerScoreAmplified: integer(
    "teleop_speaker_score_amplified"
  ).default(0),
  teleopSpeakerMiss: integer("teleop_speaker_miss").default(0),
  teleopAmpScore: integer("teleop_amp_score").default(0),
  teleopAmpMiss: integer("teleop_amp_miss").default(0),
  teleopRelayPass: integer("teleop_relay_pass").default(0),
  teleopNotes: text("teleop_notes").default(""),

  endgameTrapScore: text("endgame_trap_score").default(""),
  endgameMicrophoneScore: text("endgame_microphone_score").default(""),
  endgameDidRobotPark: integer("endgame_did_robot_park", {
    mode: "boolean",
  }).default(false),
  endgameDidRobotHang: integer("endgame_did_robot_hang", {
    mode: "boolean",
  }).default(false),
  endgameHarmony: text("endgame_harmony").default(""),
  endgameNotes: text("endgame_notes").default(""),

  finalAllianceScore: integer("final_alliance_score").default(0),
  finalRankingPoints: integer("final_ranking_points").default(0),
  finalAllianceResult: text("final_alliance_result").default(""),
  finalViolations: text("final_violations").notNull(),
  finalPenalties: integer("final_penalties").default(0),
  finalNotes: text("final_notes").default(""),
});

export const pitScoutingSessions = sqliteTable("pit_scouting_session", {
  id: text("id").notNull().primaryKey(),
  driveTeamExperience: text("drive_team_experience").default(""),
  numberOfAutoMethods: text("number_of_auto_methods").default(""),
  canPickUpFromGround: text("can_pick_up_from_ground").default(""),
  canReceiveFromSourceChute: text("can_receive_from_source_chute").default(""),
  canScoreInAmp: text("can_score_in_amp").default(""),
  canScoreInSpeaker: text("can_score_in_speaker").default(""),
  canScoreInTrap: text("can_score_in_trap").notNull(),
  whereCanYouScoreInSpeaker: text("where_can_you_score_in_speaker").default(""),
  canFitUnderStage: text("can_fit_under_stage").default(""),
  canGetOnstage: text("can_get_onstage").default(""),
  robotWidth: text("robot_width").default(""),
  onstagePosition: text("onstage_position").default(""),
  notes: text("notes").default(""),
});

export const levity = sqliteTable("event_levity", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  item: text("item").notNull(),
});

export const teamMembers = sqliteTable("team_member", {
  email: text("email").notNull().primaryKey(),
  name: text("name").notNull(),
});

export const matchScoutingUploads = sqliteTable("match_scouting_upload", {
  id: text("id").notNull().primaryKey(),
  refreshDate: text("refresh_date").notNull(),
});

export const pitScoutingUploads = sqliteTable("pit_scouting_upload", {
  id: text("id").notNull().primaryKey(),
  refreshDate: text("refresh_date").notNull(),
});

export type Event = typeof events.$inferInsert;
export type Match = typeof matches.$inferInsert;
export type Team = typeof teams.$inferInsert;
export type MatchTeam = typeof matchTeams.$inferInsert;

export type MatchScoutingSession = typeof matchScoutingSessions.$inferInsert;
export type MatchScoutUpload = typeof matchScoutingUploads.$inferInsert;

export type PitScoutingSession = typeof pitScoutingSessions.$inferInsert;
export type PitScoutUpload = typeof pitScoutingUploads.$inferInsert;

export type Levity = typeof levity.$inferInsert;
export type TeamMember = typeof teamMembers.$inferInsert;
