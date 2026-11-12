import { DatabaseSync } from 'node:sqlite';

export type DB = DatabaseSync;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE COLLATE NOCASE, created_at INTEGER NOT NULL,
  consent_at INTEGER NOT NULL, consent_version TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS login_codes (
  email TEXT PRIMARY KEY COLLATE NOCASE, code_hash TEXT NOT NULL, expires_at INTEGER NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS athletes (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, name TEXT NOT NULL, created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS athletes_user ON athletes(user_id);
CREATE TABLE IF NOT EXISTS challenge_days (
  athlete_id TEXT NOT NULL REFERENCES athletes(id) ON DELETE CASCADE, day INTEGER NOT NULL,
  ticks TEXT NOT NULL DEFAULT '[]', done INTEGER NOT NULL DEFAULT 0, on_time INTEGER NOT NULL DEFAULT 0,
  finished_at INTEGER, confirmed_at INTEGER, finisher INTEGER, finisher_at INTEGER, flagged INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (athlete_id, day));
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY, athlete_id TEXT NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  reporter_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, reason TEXT NOT NULL, created_at INTEGER NOT NULL,
  UNIQUE (athlete_id, reporter_user_id));
`;

export function openDb(path = ':memory:'): DB {
  const db = new DatabaseSync(path);
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec(SCHEMA);
  return db;
}

/**
 * Privacy clean-up: remove sign-in codes (which hold an email address) and sessions once they have expired,
 * so we never keep the email of someone who asked for a code but never signed in.
 * Returns how many rows were removed.
 */
export function purgeExpired(db: DB, nowMs: number): { codes: number; sessions: number } {
  const codes = db.prepare('DELETE FROM login_codes WHERE expires_at < ?').run(nowMs).changes;
  const sessions = db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(nowMs).changes;
  return { codes: Number(codes), sessions: Number(sessions) };
}
