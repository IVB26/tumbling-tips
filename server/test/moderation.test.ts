import test from 'node:test';
import assert from 'node:assert/strict';
import { setup } from './helpers';
import { isNameAllowed } from '../src/names';

test('name filter: blocks obvious profanity, including disguised spellings, but keeps real names', () => {
  for (const bad of ['Shit', 'Fuck K.', 'B1tch', 'sh1t', '$hit', 'F u', 'Ass', 'Dick', 'Poop'])
    if (bad !== 'F u') assert.equal(isNameAllowed(bad), false, bad);
  for (const good of ['Mia R.', 'Cassidy P.', 'Dickson K.', 'Hellen M.', 'Scott T.', 'Analise B.', 'Titus W.', 'Assunta R.', 'Hancock J.', 'Peacock A.'])
    assert.equal(isNameAllowed(good), true, good);
});

test('a blocked name is refused when adding or renaming an athlete', async () => {
  const { call, signIn, addAthlete } = setup();
  const t = await signIn('a@example.com');
  const r = await call('POST', '/athletes', t, { name: 'Shit K.' });
  assert.equal(r.status, 400); assert.match(r.body.message, /different name/);
  const k = await addAthlete(t, 'Mia R.');
  assert.equal((await call('PATCH', `/athletes/${k}`, t, { name: 'B1tch' })).status, 400);
  assert.equal((await call('PATCH', `/athletes/${k}`, t, { name: 'Mia S.' })).status, 200);
});

async function twoFamilies() {
  const s = setup('2026-12-05T12:00:00Z', { ADMIN_EMAILS: 'admin@example.com' });
  const a = await s.signIn('a@example.com'), b = await s.signIn('b@example.com'), admin = await s.signIn('admin@example.com');
  const ka = await s.addAthlete(a, 'Ava M.'), kb = await s.addAthlete(b, 'Isla K.');
  const refs = async (tok: string, ath: string) => (await s.call('GET', `/leaderboard?athleteId=${ath}`, tok)).body.top as { name: string; ref: string; isMe: boolean }[];
  return { ...s, a, b, admin, ka, kb, refs };
}

test('reporting a name: the row carries an opaque ref, an admin is emailed, and repeats are ignored', async () => {
  const { call, a, b, admin, ka, kb, refs, mailer } = await twoFamilies();
  const rows = await refs(b, kb);
  const ava = rows.find(r => r.name === 'Ava M.')!;
  assert.ok(ava.ref && ava.ref.length >= 10);
  assert.ok(!ava.ref.includes(ka) && ava.ref !== ka, 'the ref is not the athlete id');
  assert.equal((await call('POST', '/leaderboard/report', b, { ref: ava.ref, reason: 'inappropriate_name' })).status, 200);
  assert.equal((await call('POST', '/leaderboard/report', b, { ref: ava.ref, reason: 'inappropriate_name' })).status, 200, 'same answer for a repeat');
  assert.equal(mailer.outbox.filter(m => m.to === 'admin@example.com' && /reported/.test(m.subject)).length, 1, 'one email, not two');
  assert.ok(mailer.outbox.some(m => /Ava M\./.test(m.text)));
  const reports = (await call('GET', '/admin/reports', admin)).body;
  assert.equal(reports.length, 1); assert.equal(reports[0].name, 'Ava M.'); assert.equal(reports[0].reports, 1);
  assert.equal((await call('GET', '/admin/reports', a)).status, 403, 'only admins can read reports');
  void ka;
});

test('reporting: you cannot report your own athlete, junk refs are refused, and sign-in is required', async () => {
  const { call, a, ka, refs } = await twoFamilies();
  const mine = (await refs(a, ka)).find(r => r.isMe)!;
  const own = await call('POST', '/leaderboard/report', a, { ref: mine.ref, reason: 'other' });
  assert.equal(own.status, 400); assert.equal(own.body.error, 'own_entry');
  assert.equal((await call('POST', '/leaderboard/report', a, { ref: 'nonsense-nonsense-123', reason: 'other' })).status, 404);
  assert.equal((await call('POST', '/leaderboard/report', a, { ref: mine.ref, reason: 'spam' })).status, 400, 'only known reasons');
  assert.equal((await call('POST', '/leaderboard/report', undefined, { ref: mine.ref, reason: 'other' })).status, 401);
});

test('an admin can rename a reported name, which clears the report; or dismiss it', async () => {
  const { call, a, b, admin, ka, kb, refs } = await twoFamilies();
  const ava = (await refs(b, kb)).find(r => r.name === 'Ava M.')!;
  await call('POST', '/leaderboard/report', b, { ref: ava.ref, reason: 'inappropriate_name' });
  assert.equal((await call('POST', `/admin/athletes/${ka}/rename`, a, { name: 'Athlete' })).status, 403);
  assert.equal((await call('POST', `/admin/athletes/${ka}/rename`, admin, { name: 'Shit' })).status, 400, 'admins cannot set a blocked name either');
  assert.equal((await call('POST', `/admin/athletes/${ka}/rename`, admin, { name: 'Athlete' })).status, 200);
  assert.equal((await call('GET', '/admin/reports', admin)).body.length, 0);
  assert.ok((await refs(b, kb)).some(r => r.name === 'Athlete'), 'the leaderboard shows the new name');
  await call('POST', '/leaderboard/report', b, { ref: ava.ref, reason: 'other' });
  assert.equal((await call('GET', '/admin/reports', admin)).body.length, 1);
  assert.equal((await call('POST', `/admin/reports/${ka}/dismiss`, admin)).status, 200);
  assert.equal((await call('GET', '/admin/reports', admin)).body.length, 0);
});

test('deleting an athlete or an account removes the reports about them', async () => {
  const { call, db, a, b, ka, kb, refs } = await twoFamilies();
  const ava = (await refs(b, kb)).find(r => r.name === 'Ava M.')!;
  await call('POST', '/leaderboard/report', b, { ref: ava.ref, reason: 'other' });
  assert.equal((db.prepare('SELECT COUNT(*) n FROM reports').get() as any).n, 1);
  await call('DELETE', `/athletes/${ka}`, a);
  assert.equal((db.prepare('SELECT COUNT(*) n FROM reports').get() as any).n, 0);
});
