import test from 'node:test';
import assert from 'node:assert/strict';
import { setup } from './helpers';
import { dayExercises, dayBase } from '../../app/src/lib/challenge';

// It is 10 November: the real Challenge has not started. The demo account sees 5 December.
const ENV = { REVIEW_EMAIL: 'review@example.com', REVIEW_CODE: '424242' };
const NOV = '2026-11-10T12:00:00Z';

async function reviewerSignIn(call: any) {
  await call('POST', '/auth/request', undefined, { email: 'review@example.com' });
  const r = await call('POST', '/auth/verify', undefined, { email: 'review@example.com', code: '424242', consent: true });
  assert.equal(r.status, 200); return r.body.token as string;
}

test('the demo account can use the Challenge before it starts; everyone else cannot', async () => {
  const { call, signIn, addAthlete, completeDay } = setup(NOV, ENV);
  const rev = await reviewerSignIn(call); const rk = await addAthlete(rev, 'Demo D.');
  const normal = await signIn('mum@example.com'); const nk = await addAthlete(normal, 'Mia R.');

  const st = (await call('GET', `/athletes/${rk}/challenge`, rev)).body;
  assert.equal(st.clock.phase, 'open'); assert.equal(st.clock.lastOpenDay, 5);
  const done = await completeDay(rev, rk, 5);
  assert.equal(done.status, 200); assert.equal(done.body.days[4].onTime, true);
  assert.equal(done.body.days[4].points, dayBase(5, true));
  // the demo account can only go as far as its pretend date
  const day6 = await call('PUT', `/athletes/${rk}/challenge/days/6/ticks`, rev, { ticks: Array(dayExercises(6).length).fill(true) });
  assert.equal(day6.status, 403); assert.equal(day6.body.error, 'day_not_open');
  // a real family, at the same moment, sees the real date
  assert.equal((await call('GET', `/athletes/${nk}/challenge`, normal)).body.clock.phase, 'before');
  const blocked = await call('PUT', `/athletes/${nk}/challenge/days/5/ticks`, normal, { ticks: Array(dayExercises(5).length).fill(true) });
  assert.equal(blocked.status, 403); assert.equal(blocked.body.error, 'challenge_not_started');
});

test('demo data never appears on the real leaderboard, and real entrants never appear on the demo one', async () => {
  const { call, signIn, addAthlete, completeDay, setTime } = setup(NOV, ENV);
  const rev = await reviewerSignIn(call); const rk = await addAthlete(rev, 'Demo D.');
  await completeDay(rev, rk, 5);
  // later, the real Challenge is open and a real family joins
  setTime('2026-12-05T12:00:00Z');
  const normal = await signIn('mum@example.com'); const nk = await addAthlete(normal, 'Mia R.');
  await completeDay(normal, nk, 5);

  const real = (await call('GET', `/leaderboard?athleteId=${nk}`, normal)).body;
  assert.deepEqual(real.top.map((r: any) => r.name), ['Mia R.'], 'no demo athlete on the real leaderboard');
  assert.equal(real.entered, 1);
  const demo = (await call('GET', `/leaderboard?athleteId=${rk}`, rev)).body;
  assert.deepEqual(demo.top.map((r: any) => r.name), ['Demo D.'], 'no real athlete on the demo leaderboard');
  assert.equal(demo.me.rank, 1);
  // rank shown to the real family also ignores the demo account
  assert.equal((await call('GET', `/athletes/${nk}/challenge`, normal)).body.entered, 1);
});

test('REVIEW_NOW changes the demo date; without a demo login configured nothing changes for anyone', async () => {
  const { call, addAthlete } = setup(NOV, { ...ENV, REVIEW_NOW: '2026-12-10T12:00:00Z' });
  const rev = await reviewerSignIn(call); const rk = await addAthlete(rev, 'Demo D.');
  assert.equal((await call('GET', `/athletes/${rk}/challenge`, rev)).body.clock.lastOpenDay, 10);

  const plain = setup(NOV);   // no REVIEW_EMAIL
  const t = await plain.signIn('review@example.com'); const k = await plain.addAthlete(t, 'Mia R.');
  assert.equal((await plain.call('GET', `/athletes/${k}/challenge`, t)).body.clock.phase, 'before', 'that email is just a normal account here');
});

test('an invalid REVIEW_NOW stops the server from starting', async () => {
  const { loadConfig } = await import('../src/config');
  assert.throws(() => loadConfig({ REVIEW_NOW: 'not a date' } as any), /REVIEW_NOW/);
});
