import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const events = sqliteTable("event", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
});

export const eventMatches = sqliteTable("event_match", {
  id: text("id").notNull().primaryKey(),
  eventKey: text("event_key")
    .notNull()
    .references(() => events.id),
  matchType: text("match_type", { enum: ["qm", "sf", "f"] }).notNull(),
  matchNumber: integer("match_number").notNull(),
  setNumber: integer("set_number").notNull(),
  predictedTime: text("predicted_time"),
});

export const eventTeams = sqliteTable("event_team", {
  id: text("id").notNull().primaryKey(),
  number: text("number").notNull(),
  nickname: text("nickname").notNull(),
  schoolName: text("school_name").notNull(),
});

export const eventMatchTeams = sqliteTable("event_match_team", {
  id: text("id").notNull().primaryKey(),
  eventKey: text("event_key")
    .notNull()
    .references(() => events.id),
  matchKey: text("match_key")
    .notNull()
    .references(() => eventMatches.id),
  alliance: text("alliance", { enum: ["Blue", "Red"] }).notNull(),
  allianceTeam: integer("alliance_team").notNull(),
  teamKey: text("team_key")
    .notNull()
    .references(() => eventTeams.id),
});

export const matchScouting = sqliteTable("scouting_match", {
  id: text("id").notNull().primaryKey(),

  eventKey: text("event_key")
    .notNull()
    .references(() => events.id),
  matchKey: text("match_key")
    .notNull()
    .references(() => eventMatches.id),
  alliance: text("alliance", { enum: ["Blue", "Red"] }).notNull(),
  allianceTeam: integer("alliance_team").notNull(),

  scheduledTeamKey: text("scheduled_team_key")
    .notNull()
    .references(() => eventTeams.id),
  scoutedTeamKey: text("scouted_team_key")
    .notNull()
    .references(() => eventTeams.id),
  scouterName: text("scouter_name").notNull(),

  autoStartedWithNote: integer("auto_started_with_note", {
    mode: "boolean",
  }).notNull(),
  autoLeftStartArea: integer("auto_left_start_area", {
    mode: "boolean",
  }).notNull(),
  autoSpeakerScore: integer("auto_speaker_Score").notNull(),
  autoSpeakerMiss: integer("auto_speaker_miss").notNull(),
  autoAmpScore: integer("auto_amp_score").notNull(),
  autoAmpMiss: integer("auto_amp_miss").notNull(),
  autoNotes: text("auto_notes").notNull(),

  teleopSpeakerScore: integer("teleop_speaker_score").notNull(),
  teleopSpeakerScoreAmplified: integer(
    "teleop_speaker_score_amplified"
  ).notNull(),
  teleopSpeakerMiss: integer("teleop_speaker_miss").notNull(),
  teleopAmpScore: integer("teleop_amp_score").notNull(),
  teleopAmpMiss: integer("teleop_amp_miss").notNull(),
  teleopRelayPass: integer("teleop_relay_pass").notNull(),
  teleopNotes: text("teleop_notes").notNull(),

  endgameTrapScore: text("endgame_trap_score").notNull(),
  endgameMicrophoneScore: text("endgame_microphone_score").notNull(),
  endgameDidRobotPark: integer("endgame_did_robot_park", {
    mode: "boolean",
  }).notNull(),
  endgameDidRobotHang: integer("endgame_did_robot_hang", {
    mode: "boolean",
  }).notNull(),
  endgameHarmony: text("endgame_harmony").notNull(),
  endgameNotes: text("endgame_notes").notNull(),

  finalAllianceScore: integer("final_alliance_score").notNull(),
  finalRankingPoints: integer("final_ranking_points").notNull(),
  finalAllianceResult: text("final_alliance_result").notNull(),
  finalViolations: text("final_violations").notNull(),
  finalPenalties: integer("final_penalties").notNull(),
  finalNotes: text("final_notes").notNull(),
});

export const pitScouting = sqliteTable("scouting_pit", {
  id: text("id").notNull().primaryKey(),
  eventKey: text("event_key")
    .notNull()
    .references(() => events.id),
  teamKey: text("team_key")
    .notNull()
    .references(() => eventTeams.id),

  driveTeamExperience: text("drive_team_experience"),
  numberOfAutoMethods: text("number_of_auto_methods"),
  canPickUpFromGround: text("can_pick_up_from_ground"),
  canReceiveFromSourceChute: text("can_receive_from_source_chute"),
  canScoreInAmp: text("can_score_in_amp"),
  canScoreInSpeaker: text("can_score_in_speaker"),
  canScoreInTrap: text("can_score_in_trap"),
  whereCanYouScoreInSpeaker: text("where_can_you_score_in_speaker"),
  canFitUnderStage: text("can_fit_under_stage"),
  canGetOnstage: text("can_get_onstage"),
  robotWidth: text("robot_width"),
  onstagePosition: text("onstage_position"),
  notes: text("notes"),
});

export const levity = sqliteTable("event_levity", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  item: text("item").notNull(),
});

export const teamMembers = sqliteTable("team_member", {
  email: text("email").notNull().primaryKey(),
  name: text("name").notNull(),
});

export type Event = typeof events.$inferInsert;
export type Match = typeof eventMatches.$inferInsert;
export type Team = typeof eventTeams.$inferInsert;
export type MatchTeam = typeof eventMatchTeams.$inferInsert;

export type MatchScout = typeof matchScouting.$inferInsert;
export type PitScout = typeof pitScouting.$inferInsert;

export type Levity = typeof levity.$inferInsert;
export type TeamMember = typeof teamMembers.$inferInsert;
