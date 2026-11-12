import test from 'node:test';
import assert from 'node:assert/strict';
import { setup } from './helpers';
import { dayExercises, dayBase, multiplier, finisherPoints } from '../../app/src/lib/challenge';

test("one family can never read or change another family's child", async () => {
  const { call, signIn, addAthlete } = setup();
  const a = await signIn('a@example.com'), b = await signIn('b@example.com');
  const kid = await addAthlete(a);
  for (const [m, u, body] of [['GET', `/athletes/${kid}/challenge`], ['PATCH', `/athletes/${kid}`, { name: 'Bad' }], ['DELETE', `/athletes/${kid}`],
    ['PUT', `/athletes/${kid}/challenge/days/5/ticks`, { ticks: [true, true, true, true] }], ['POST', `/athletes/${kid}/challenge/days/5/finish`, { confirm: true }],
    ['POST', `/athletes/${kid}/challenge/days/5/finisher`, { value: 30 }], ['GET', `/leaderboard?athleteId=${kid}`]] as const) {
    const r = await call(m, u, b, body);
    assert.equal(r.status, 404, `${m} ${u}`);
  }
  assert.equal((await call('GET', `/athletes/${kid}/challenge`, a)).status, 200);
});

test('before 1 December and after the end, nothing can be changed', async () => {
  const { call, signIn, addAthlete, setTime } = setup('2026-11-20T12:00:00Z');
  const t = await signIn('a@example.com'); const k = await addAthlete(t);
  assert.equal((await call('GET', '/challenge/clock')).body.phase, 'before');
  const r = await call('PUT', `/athletes/${k}/challenge/days/1/ticks`, t, { ticks: Array(dayExercises(1).length).fill(true) });
  assert.equal(r.status, 403); assert.equal(r.body.error, 'challenge_not_started');
  setTime('2026-12-27T00:00:01Z');
  assert.equal((await call('GET', '/challenge/clock')).body.phase, 'closed');
  assert.equal((await call('POST', `/athletes/${k}/challenge/days/5/finish`, t, { confirm: true })).body.error, 'challenge_closed');
});

test('days that have not opened yet are refused', async () => {
  const { call, signIn, addAthlete } = setup('2026-12-05T12:00:00Z');
  const t = await signIn('a@example.com'); const k = await addAthlete(t);
  const r = await call('PUT', `/athletes/${k}/challenge/days/6/ticks`, t, { ticks: Array(dayExercises(6).length).fill(true) });
  assert.equal(r.status, 403); assert.equal(r.body.error, 'day_not_open');
});

test('finishing needs every exercise ticked and a parent confirmation', async () => {
  const { call, signIn, addAthlete } = setup();
  const t = await signIn('a@example.com'); const k = await addAthlete(t);
  const n = dayExercises(5).length;
  assert.equal((await call('POST', `/athletes/${k}/challenge/days/5/finish`, t, { confirm: true })).body.error, 'not_all_ticked');
  await call('PUT', `/athletes/${k}/challenge/days/5/ticks`, t, { ticks: [true, ...Array(n - 1).fill(false)] });
  assert.equal((await call('POST', `/athletes/${k}/challenge/days/5/finish`, t, { confirm: true })).body.error, 'not_all_ticked');
  assert.equal((await call('PUT', `/athletes/${k}/challenge/days/5/ticks`, t, { ticks: [true] })).status, 400, 'wrong number of ticks');
  await call('PUT', `/athletes/${k}/challenge/days/5/ticks`, t, { ticks: Array(n).fill(true) });
  assert.equal((await call('POST', `/athletes/${k}/challenge/days/5/finish`, t, {})).status, 400, 'no confirm');
  assert.equal((await call('POST', `/athletes/${k}/challenge/days/5/finish`, t, { confirm: false })).status, 400);
  assert.equal((await call('POST', `/athletes/${k}/challenge/days/5/finish`, t, { confirm: true })).status, 200);
});

test('on the day: 10 per exercise + 20 + 10 bonus, then the day is locked', async () => {
  const { call, signIn, addAthlete, completeDay } = setup('2026-12-05T12:00:00Z');
  const t = await signIn('a@example.com'); const k = await addAthlete(t);
  const r = await completeDay(t, k, 5);
  const day = r.body.days[4];
  assert.equal(day.done, true); assert.equal(day.onTime, true);
  assert.equal(day.points, dayBase(5, true)); // streak 1 => x1
  assert.equal(r.body.streak, 1);
  // Cannot change or re-finish a finished day
  assert.equal((await call('PUT', `/athletes/${k}/challenge/days/5/ticks`, t, { ticks: Array(dayExercises(5).length).fill(false) })).body.error, 'day_finished');
  assert.equal((await call('POST', `/athletes/${k}/challenge/days/5/finish`, t, { confirm: true })).body.error, 'day_finished');
});

test('catching up a missed day scores without the bonus, multiplier or streak', async () => {
  const { signIn, addAthlete, completeDay } = setup('2026-12-05T12:00:00Z');
  const t = await signIn('a@example.com'); const k = await addAthlete(t);
  const r = await completeDay(t, k, 3);   // day 3 finished on day 5
  assert.equal(r.body.days[2].onTime, false);
  assert.equal(r.body.days[2].points, dayBase(3, false));
  assert.equal(r.body.streak, 0);
});

test('the finisher: only after finishing, only on its date, once, within limits', async () => {
  const { call, signIn, addAthlete, completeDay, setTime } = setup('2026-12-05T12:00:00Z');
  const t = await signIn('a@example.com'); const k = await addAthlete(t);
  const url = (d: number) => `/athletes/${k}/challenge/days/${d}/finisher`;
  assert.equal((await call('POST', url(5), t, { value: 30 })).body.error, 'finish_day_first');
  await completeDay(t, k, 5);
  assert.equal((await call('POST', url(5), t, { value: 0 })).status, 400);
  assert.equal((await call('POST', url(5), t, { value: 1.5 })).status, 400);
  assert.equal((await call('POST', url(5), t, { value: 99999 })).status, 400, 'over the hard maximum');
  const ok = await call('POST', url(5), t, { value: 40 });
  assert.equal(ok.status, 200);
  // day 5 finisher is #1 (handstand seconds, 1 pt each)... 5-1 = 4 % 4 = 0
  assert.equal(ok.body.days[4].finisherPoints, finisherPoints(5, 40));
  assert.equal(ok.body.totalPoints, dayBase(5, true) + finisherPoints(5, 40));
  assert.equal((await call('POST', url(5), t, { value: 50 })).body.error, 'finisher_logged');
  // Finish day 4 late, on day 6: its finisher is closed for good
  setTime('2026-12-06T09:00:00Z');
  await completeDay(t, k, 4);
  assert.equal((await call('POST', url(4), t, { value: 30 })).body.error, 'finisher_closed');
});

test('streak multiplier steps up at 7, 13 and 19 on-time days', async () => {
  const { signIn, addAthlete, completeDay, setTime, call } = setup('2026-12-01T10:00:00Z');
  const t = await signIn('a@example.com'); const k = await addAthlete(t);
  let last: any;
  for (let d = 1; d <= 13; d++) { setTime(`2026-12-${String(d).padStart(2, '0')}T10:00:00Z`); last = await completeDay(t, k, d); }
  assert.equal(last.body.streak, 13); assert.equal(last.body.multiplier, 3);
  const days = last.body.days;
  for (const d of [1, 6, 7, 12, 13]) assert.equal(days[d - 1].points, Math.round(dayBase(d, true) * multiplier(d)), `day ${d}`);
  // Skip day 14, finish day 15 on time: the streak restarts at 1
  setTime('2026-12-15T10:00:00Z');
  const r = await completeDay(t, k, 15);
  assert.equal(r.body.streak, 1); assert.equal(r.body.days[14].points, dayBase(15, true));
  assert.equal((await call('GET', `/athletes/${k}/challenge`, t)).body.streak, 1);
});

test('the day follows the one fixed time zone, not the phone', async () => {
  // 23:30 UTC on 5 Dec is already 6 Dec in Auckland (UTC+13)
  const nz = setup('2026-12-05T23:30:00Z', { CHALLENGE_TZ: 'Pacific/Auckland' });
  assert.equal((await nz.call('GET', '/challenge/clock')).body.dom, 6);
  const utc = setup('2026-12-05T23:30:00Z');
  assert.equal((await utc.call('GET', '/challenge/clock')).body.dom, 5);
  // Dec 25 and 26: still open for catch-ups, but nothing counts as on time
  const late = setup('2026-12-25T10:00:00Z');
  const c = (await late.call('GET', '/challenge/clock')).body;
  assert.equal(c.phase, 'open'); assert.equal(c.lastOpenDay, 24); assert.equal(c.onTimeDay, null);
});

test('leaderboard: ranked, ties broken by finisher total, and nothing private is exposed', async () => {
  const { call, signIn, addAthlete, completeDay } = setup('2026-12-05T12:00:00Z');
  const a = await signIn('a@example.com'), b = await signIn('b@example.com'), c = await signIn('c@example.com');
  const ka = await addAthlete(a, 'Ava M.'), kb = await addAthlete(b, 'Isla K.'), kc = await addAthlete(c, 'Zara N.');
  await completeDay(a, ka, 5); await completeDay(b, kb, 5); await completeDay(c, kc, 5);
  await call('POST', `/athletes/${kb}/challenge/days/5/finisher`, b, { value: 30 });
  await call('POST', `/athletes/${kc}/challenge/days/5/finisher`, c, { value: 10 });
  const lb = (await call('GET', `/leaderboard?athleteId=${ka}`, a)).body;
  assert.deepEqual(lb.top.map((r: any) => r.name), ['Isla K.', 'Zara N.', 'Ava M.']);
  assert.equal(lb.me.rank, 3); assert.equal(lb.me.isMe, true); assert.equal(lb.ahead.name, 'Zara N.');
  const text = JSON.stringify(lb);
  assert.ok(!/@example|athleteId|email|created/i.test(text), 'no private data in the leaderboard');
  assert.deepEqual(Object.keys(lb.top[0]).sort(), ['badge', 'isMe', 'name', 'pts', 'rank', 'ref', 'streak']);
  assert.equal((await call('GET', '/leaderboard')).status, 401);
});

test('very large scores are flagged for review; only admins can see and void them', async () => {
  const { call, signIn, addAthlete, completeDay } = setup('2026-12-05T12:00:00Z');
  const a = await signIn('a@example.com'), admin = await signIn('admin@example.com'); const k = await addAthlete(a);
  await completeDay(a, k, 5);
  await call('POST', `/athletes/${k}/challenge/days/5/finisher`, a, { value: 500 }); // 5 Dec = handstand seconds; typical 120, max 600
  assert.equal((await call('GET', '/admin/flagged', a)).status, 403);
  const flagged = (await call('GET', '/admin/flagged', admin)).body;
  assert.equal(flagged.length, 1); assert.equal(flagged[0].finisher, 500);
  await call('POST', `/admin/athletes/${k}/days/5/void-finisher`, admin);
  assert.equal((await call('GET', '/admin/flagged', admin)).body.length, 0);
  assert.equal((await call('GET', `/athletes/${k}/challenge`, a)).body.days[4].finisher, null);
});
