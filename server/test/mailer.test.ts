import test from 'node:test';
import assert from 'node:assert/strict';
import { ConsoleMailer, ResendMailer, createMailer } from '../src/mailer';
import { setup } from './helpers';

test('Resend: sends the right request', async () => {
  let seen: any;
  const m = new ResendMailer('re_key123', "Tayah's Tumble Tips <login@example.com>", async (url, init) => { seen = { url, ...init }; return { ok: true, status: 200, json: async () => ({ id: 'abc' }) }; });
  await m.send('parent@example.com', 'Your code', 'Your sign-in code is 123456.');
  assert.equal(seen.url, 'https://api.resend.com/emails'); assert.equal(seen.method, 'POST');
  assert.equal(seen.headers.authorization, 'Bearer re_key123');
  assert.deepEqual(JSON.parse(seen.body), { from: "Tayah's Tumble Tips <login@example.com>", to: ['parent@example.com'], subject: 'Your code', text: 'Your sign-in code is 123456.' });
});

test('Resend: a rejection becomes an error that does not leak the key or the code', async () => {
  const m = new ResendMailer('re_secretkey', 'a@example.com', async () => ({ ok: false, status: 403, json: async () => ({ message: 'domain not verified' }) }));
  await assert.rejects(() => m.send('p@example.com', 's', 'code 654321'), (e: Error) => /403/.test(e.message) && /domain not verified/.test(e.message) && !/re_secretkey|654321/.test(e.message));
});

test('mailer choice: Resend when configured, console in development, refuses to start in production without it', () => {
  assert.ok(createMailer({ RESEND_API_KEY: 'k', EMAIL_FROM: 'a@example.com' }) instanceof ResendMailer);
  assert.ok(createMailer({ NODE_ENV: 'development' }) instanceof ConsoleMailer);
  assert.throws(() => createMailer({ NODE_ENV: 'production' }), /RESEND_API_KEY/);
  assert.throws(() => createMailer({ RESEND_API_KEY: 'k' }), /EMAIL_FROM/);
});

test('if the email cannot be sent, the person sees a retryable error and no dead code is left', async () => {
  const { app, call, db } = setup();
  // Swap in a mailer that fails, by rebuilding the app with it
  const { buildApp } = await import('../src/app');
  const { loadConfig } = await import('../src/config');
  const failing = buildApp({ db, config: loadConfig({} as any), mailer: { send: async () => { throw new Error('boom'); } }, now: () => new Date('2026-12-05T12:00:00Z') });
  const r = await failing.inject({ method: 'POST', url: '/auth/request', payload: { email: 'p@example.com' } });
  assert.equal(r.statusCode, 503); assert.equal(JSON.parse(r.body).error, 'email_failed');
  assert.equal((db.prepare('SELECT COUNT(*) n FROM login_codes').get() as any).n, 0);
  // ...and an immediate retry is allowed (not blocked by the one-minute wait)
  const ok = await call('POST', '/auth/request', undefined, { email: 'p@example.com' });
  assert.equal(ok.status, 200); void app;
});

test('the login email contains the code and the 10 minute limit', async () => {
  const { call, mailer } = setup();
  await call('POST', '/auth/request', undefined, { email: 'p@example.com' });
  const mail = mailer.outbox[0];
  assert.match(mail.text, /\b\d{6}\b/); assert.match(mail.text, /10 minutes/); assert.equal(mail.to, 'p@example.com');
});
