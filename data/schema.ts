import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const events = sqliteTable("event", {
  key: text("key").notNull().primaryKey(),
  name: text("name").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
});

export const eventMatches = sqliteTable("event_match", {
  key: text("key").notNull().primaryKey(),
  eventKey: text("event_key")
    .notNull()
    .references(() => events.key),
  matchType: text("match_type", { enum: ["qm", "sf", "f"] }).notNull(),
  matchNumber: integer("match_number").notNull(),
  setNumber: integer("set_number").notNull(),
  predictedTime: text("predicted_time"),
});

export const eventTeams = sqliteTable("event_team", {
  key: text("key").notNull().primaryKey(),
  number: text("number").notNull(),
  nickname: text("nickname").notNull(),
  schoolName: text("school_name").notNull(),
});

export const eventMatchTeams = sqliteTable("event_match_team", {
  key: text("key").notNull().primaryKey(),
  eventKey: text("event_key")
    .notNull()
    .references(() => events.key),
  matchKey: text("match_key")
    .notNull()
    .references(() => eventMatches.key),
  alliance: text("alliance", { enum: ["Blue", "Red"] }).notNull(),
  allianceTeam: integer("alliance_team").notNull(),
  teamKey: text("team_key")
    .notNull()
    .references(() => eventTeams.key),
});

export const matchScouting = sqliteTable("scouting_match", {
  key: text("key").notNull().primaryKey(),
  eventKey: text("event_key")
    .notNull()
    .references(() => events.key),
  matchKey: text("match_key")
    .notNull()
    .references(() => eventMatches.key),
  scheduledTeamKey: text("scheduled_team_key")
    .notNull()
    .references(() => eventTeams.key),
  scoutedTeamKey: text("scouted_team_key")
    .notNull()
    .references(() => eventTeams.key),
  scouterName: text("scouter_name").notNull(),
});

export const pitScouting = sqliteTable("scouting_pit", {
  key: text("key").notNull().primaryKey(),
  eventKey: text("event_key")
    .notNull()
    .references(() => events.key),
  teamKey: text("team_key")
    .notNull()
    .references(() => eventTeams.key),
});

export const levity = sqliteTable("event_levity", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  item: text("item").notNull(),
});

export type Event = typeof events.$inferInsert;
export type Match = typeof eventMatches.$inferInsert;
export type Team = typeof eventTeams.$inferInsert;
export type MatchTeam = typeof eventMatchTeams.$inferInsert;

export type MatchScout = typeof matchScouting.$inferInsert;
export type PitScout = typeof pitScouting.$inferInsert;

export type Levity = typeof levity.$inferInsert;
