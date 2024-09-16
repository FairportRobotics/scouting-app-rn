import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const events = sqliteTable("event", {
  key: text("key").notNull().primaryKey(),
  name: text("name").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
});

export const eventMatches = sqliteTable("event_matches", {
  key: text("key").notNull().primaryKey(),
  eventKey: text("event_key")
    .notNull()
    .references(() => events.key),
  matchType: text("match_type", { enum: ["qm", "sf", "f"] }).notNull(),
  matchNumber: integer("match_number").notNull(),
  setNumber: integer("set_number").notNull(),
  predictedTime: text("predicted_time"),
});

export const eventTeams = sqliteTable("event_teams", {
  key: text("key").notNull().primaryKey(),
  number: integer("number").notNull(),
  nickName: text("nickname").notNull(),
});

export const eventMatchTeams = sqliteTable("event_match_teams", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  matchkey: text("match_key")
    .notNull()
    .references(() => eventMatches.key),
  alliance: text("alliance", { enum: ["Blue", "Red"] }).notNull(),
  allianceNumber: integer("alliance_number").notNull(),
  teamKey: text("team_key")
    .notNull()
    .references(() => eventTeams.key),
});

export const levity = sqliteTable("levity", {
  key: text("key").notNull().primaryKey(),
  item: text("value").notNull(),
});

export type Event = typeof events.$inferInsert;
export type Match = typeof eventMatches.$inferInsert;
export type Team = typeof eventTeams.$inferInsert;
export type MatchTeam = typeof eventMatchTeams.$inferInsert;
export type Levity = typeof levity.$inferInsert;
