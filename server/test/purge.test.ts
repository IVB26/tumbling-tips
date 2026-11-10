import test from 'node:test';
import assert from 'node:assert/strict';
import { openDb, purgeExpired } from '../src/db';

test('expired sign-in codes and sessions are deleted; live ones are kept', () => {
  const db = openDb();
  const now = 1_000_000;
  const code = db.prepare('INSERT INTO login_codes (email, code_hash, expires_at, attempts, created_at) VALUES (?,?,?,0,?)');
  code.run('old@example.com', 'h', now - 1, now - 600_000);      // expired
  code.run('live@example.com', 'h', now + 60_000, now);          // still valid
  db.prepare('INSERT INTO users (id, email, created_at, consent_at, consent_version) VALUES (?,?,?,?,?)').run('u1', 'p@example.com', now, now, 'v1');
  const sess = db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?,?,?)');
  sess.run('a', 'u1', now - 5); sess.run('b', 'u1', now + 5);

  assert.deepEqual(purgeExpired(db, now), { codes: 1, sessions: 1 });
  const emails = (db.prepare('SELECT email FROM login_codes').all() as { email: string }[]).map(r => r.email);
  assert.deepEqual(emails, ['live@example.com'], 'the email of an unfinished sign-in is gone');
  assert.equal((db.prepare('SELECT COUNT(*) n FROM sessions').get() as { n: number }).n, 1);
  // Running it again removes nothing more, and never touches users
  assert.deepEqual(purgeExpired(db, now), { codes: 0, sessions: 0 });
  assert.equal((db.prepare('SELECT COUNT(*) n FROM users').get() as { n: number }).n, 1);
});
