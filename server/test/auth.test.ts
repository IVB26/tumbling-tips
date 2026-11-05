import test from 'node:test';
import assert from 'node:assert/strict';
import { setup } from './helpers';

test('sign up: needs consent, then a code gives a session', async () => {
  const { call, mailer } = setup();
  assert.equal((await call('POST', '/auth/request', undefined, { email: 'Parent@Example.com' })).status, 200);
  const code = mailer.lastCode('parent@example.com')!;
  assert.match(code, /^\d{6}$/);
  // New accounts must tick the parent/guardian consent box, and the code survives the first try
  const noConsent = await call('POST', '/auth/verify', undefined, { email: 'parent@example.com', code });
  assert.equal(noConsent.status, 409); assert.equal(noConsent.body.error, 'consent_required');
  const ok = await call('POST', '/auth/verify', undefined, { email: 'parent@example.com', code, consent: true, consentVersion: 'v1' });
  assert.equal(ok.status, 200);
  const me = await call('GET', '/me', ok.body.token);
  assert.equal(me.body.user.email, 'parent@example.com'); assert.deepEqual(me.body.athletes, []);
  // The code is single-use
  assert.equal((await call('POST', '/auth/verify', undefined, { email: 'parent@example.com', code, consent: true })).status, 400);
});

test('wrong codes lock out after 5 tries, even the right code', async () => {
  const { call, mailer } = setup();
  await call('POST', '/auth/request', undefined, { email: 'a@example.com' });
  const code = mailer.lastCode('a@example.com')!;
  const wrong = code === '000000' ? '111111' : '000000';
  for (let i = 0; i < 5; i++) assert.equal((await call('POST', '/auth/verify', undefined, { email: 'a@example.com', code: wrong, consent: true })).status, 400);
  assert.equal((await call('POST', '/auth/verify', undefined, { email: 'a@example.com', code, consent: true })).status, 400);
});

test('codes expire after 10 minutes; a second request within a minute sends nothing new', async () => {
  const { call, mailer, setTime } = setup('2026-12-05T12:00:00Z');
  await call('POST', '/auth/request', undefined, { email: 'a@example.com' });
  await call('POST', '/auth/request', undefined, { email: 'a@example.com' });
  assert.equal(mailer.outbox.length, 1);
  const code = mailer.lastCode('a@example.com')!;
  setTime('2026-12-05T12:11:00Z');
  assert.equal((await call('POST', '/auth/verify', undefined, { email: 'a@example.com', code, consent: true })).status, 400);
});

test('requests without or with a bad token are rejected; logout ends the session', async () => {
  const { call, signIn } = setup();
  assert.equal((await call('GET', '/me')).status, 401);
  assert.equal((await call('GET', '/me', 'nonsense')).status, 401);
  const token = await signIn('a@example.com');
  assert.equal((await call('GET', '/me', token)).status, 200);
  await call('POST', '/auth/logout', token);
  assert.equal((await call('GET', '/me', token)).status, 401);
});

test('sessions expire after 90 days', async () => {
  const { call, signIn, setTime } = setup('2026-12-05T12:00:00Z');
  const token = await signIn('a@example.com');
  setTime('2027-03-10T12:00:00Z');
  assert.equal((await call('GET', '/me', token)).status, 401);
});

test('invalid emails are rejected; the reviewer demo login works with its fixed code', async () => {
  const { call } = setup('2026-12-05T12:00:00Z', { REVIEW_EMAIL: 'review@example.com', REVIEW_CODE: '424242' });
  assert.equal((await call('POST', '/auth/request', undefined, { email: 'not-an-email' })).status, 400);
  await call('POST', '/auth/request', undefined, { email: 'review@example.com' });
  const r = await call('POST', '/auth/verify', undefined, { email: 'review@example.com', code: '424242', consent: true });
  assert.equal(r.status, 200);
});

test('deleting the account removes the user, athletes and progress', async () => {
  const { call, signIn, addAthlete, completeDay, db } = setup();
  const token = await signIn('a@example.com'); const ath = await addAthlete(token);
  await completeDay(token, ath, 5);
  assert.equal((await call('DELETE', '/me', token)).status, 204);
  for (const t of ['users', 'athletes', 'challenge_days', 'sessions']) assert.equal((db.prepare(`SELECT COUNT(*) n FROM ${t}`).get() as any).n, 0, t);
  assert.equal((await call('GET', '/me', token)).status, 401);
});

test('child names: first name and last initial only', async () => {
  const { call, signIn } = setup();
  const token = await signIn('a@example.com');
  for (const bad of ['Mia Robinson', 'mia@example.com', '0412 345 678', 'Mia R. Smith', '', '<b>x</b>', 'A'.repeat(40)])
    assert.equal((await call('POST', '/athletes', token, { name: bad })).status, 400, bad);
  for (const good of ['Mia R.', 'Mia R', 'Mia', "O'Neil J.", 'Zoë K.'])
    assert.equal((await call('POST', '/athletes', token, { name: good })).status, 200, good);
});

test('athlete limit per account', async () => {
  const { call, signIn } = setup();
  const token = await signIn('a@example.com');
  for (let i = 0; i < 6; i++) assert.equal((await call('POST', '/athletes', token, { name: 'Kid' })).status, 200);
  assert.equal((await call('POST', '/athletes', token, { name: 'Kid' })).status, 409);
});

test('browser (web build) preflight is allowed for every method the app uses', async () => {
  const { app } = setup();
  for (const method of ['PUT', 'PATCH', 'DELETE', 'POST']) {
    const r = await app.inject({ method: 'OPTIONS', url: '/athletes/x/challenge/days/1/ticks',
      headers: { origin: 'http://localhost:8099', 'access-control-request-method': method, 'access-control-request-headers': 'authorization,content-type' } });
    assert.ok(r.statusCode < 300, `${method} preflight status ${r.statusCode}`);
    assert.match(String(r.headers['access-control-allow-methods']), new RegExp(method), method);
  }
});

test('in production, only the listed web origins are allowed', async () => {
  const { app } = setup('2026-12-05T12:00:00Z', { NODE_ENV: 'production', SERVER_SECRET: 'x'.repeat(40), CORS_ORIGINS: 'https://app.example.com' });
  const ok = await app.inject({ method: 'GET', url: '/health', headers: { origin: 'https://app.example.com' } });
  const bad = await app.inject({ method: 'GET', url: '/health', headers: { origin: 'https://evil.example.net' } });
  assert.equal(ok.headers['access-control-allow-origin'], 'https://app.example.com');
  assert.equal(bad.headers['access-control-allow-origin'], undefined);
});
