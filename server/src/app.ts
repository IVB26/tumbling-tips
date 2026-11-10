import Fastify, { type FastifyReply, type FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { z } from 'zod';
import { createHash, createHmac, randomBytes, randomInt, randomUUID, timingSafeEqual } from 'node:crypto';
import type { DB } from './db';
import type { Config } from './config';
import type { Mailer } from './mailer';
import { challengeClock } from './clock';
import { limitsFor, loadProgress, standings, dayPoints, multiplier, currentStreak, totalPoints } from './scoring';
import { DAYS, dayExercises, finisherFor, finisherPoints } from '../../app/src/lib/challenge';

const CODE_TTL = 10 * 60_000, RESEND_WAIT = 60_000, MAX_ATTEMPTS = 5, SESSION_TTL = 90 * 24 * 3600_000, MAX_ATHLETES = 6;
// Only a first name and last initial are allowed, because names show on a public leaderboard for children.
const NAME = /^\p{L}[\p{L}'’-]{0,14}( \p{L}\.?)?$/u;

export type AppDeps = { db: DB; config: Config; mailer: Mailer; now?: () => Date };
class HttpError extends Error { constructor(public status: number, public code: string, message = code) { super(message); } }
const sha = (s: string) => createHash('sha256').update(s).digest('hex');

export function buildApp({ db, config, mailer, now = () => new Date() }: AppDeps) {
  const app = Fastify({ logger: false });
  const hmac = (s: string) => createHmac('sha256', config.secret).update(s).digest('hex');
  const same = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
  const clock = () => challengeClock(now(), config.tz, config.endDay);
  const q = <T>(sql: string, ...p: any[]) => db.prepare(sql).get(...p) as T | undefined;
  const all = <T>(sql: string, ...p: any[]) => db.prepare(sql).all(...p) as unknown as T[];
  const run = (sql: string, ...p: any[]) => db.prepare(sql).run(...p);

  app.register(cors, { origin: config.corsOrigins.length ? config.corsOrigins : !config.production, methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] });
  app.register(rateLimit, { global: false });
  app.setErrorHandler((err: any, _req, reply) => {
    if (err instanceof HttpError) return reply.status(err.status).send({ error: err.code, message: err.message });
    if (err instanceof z.ZodError) return reply.status(400).send({ error: 'invalid_request', message: err.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ') });
    if (err.statusCode === 429) return reply.status(429).send({ error: 'rate_limited', message: 'Too many requests. Please wait a moment.' });
    if (err.statusCode && err.statusCode < 500) return reply.status(err.statusCode).send({ error: 'bad_request', message: err.message });
    console.error(err);
    return reply.status(500).send({ error: 'server_error', message: 'Something went wrong.' });
  });

  // ---------- auth helpers ----------
  type User = { id: string; email: string };
  const authed = (req: FastifyRequest): User => {
    const m = /^Bearer (.+)$/.exec(req.headers.authorization ?? '');
    if (!m) throw new HttpError(401, 'unauthorized', 'Please sign in.');
    const s = q<{ user_id: string; expires_at: number }>('SELECT user_id, expires_at FROM sessions WHERE token_hash = ?', sha(m[1]));
    if (!s || s.expires_at < now().getTime()) throw new HttpError(401, 'unauthorized', 'Please sign in again.');
    return q<User>('SELECT id, email FROM users WHERE id = ?', s.user_id)!;
  };
  const isAdmin = (u: User) => config.adminEmails.includes(u.email.toLowerCase());
  /** Every athlete route goes through this, so one family can never read or change another family's child. */
  const ownAthlete = (u: User, id: string) => {
    const a = q<{ id: string; name: string; user_id: string }>('SELECT id, name, user_id FROM athletes WHERE id = ?', id);
    if (!a || a.user_id !== u.id) throw new HttpError(404, 'not_found', 'Athlete not found.');
    return a;
  };
  const newSession = (userId: string) => {
    const token = randomBytes(32).toString('base64url');
    run('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?,?,?)', sha(token), userId, now().getTime() + SESSION_TTL);
    return token;
  };

  // ---------- auth ----------
  const emailSchema = z.string().trim().toLowerCase().email().max(254);
  app.get('/health', async () => ({ ok: true }));

  app.post('/auth/request', { config: { rateLimit: { max: 10, timeWindow: '1 minute' } } }, async req => {
    const { email } = z.object({ email: emailSchema }).parse(req.body);
    const t = now().getTime();
    const existing = q<{ created_at: number }>('SELECT created_at FROM login_codes WHERE email = ?', email);
    // Always answer the same way, so nobody can use this to find out who has an account.
    if (existing && t - existing.created_at < RESEND_WAIT) return { ok: true };
    const reviewer = config.reviewLogin && config.reviewLogin.email === email;
    const code = reviewer ? config.reviewLogin!.code : String(randomInt(0, 1_000_000)).padStart(6, '0');
    run('INSERT OR REPLACE INTO login_codes (email, code_hash, expires_at, attempts, created_at) VALUES (?,?,?,0,?)', email, hmac(`${email}:${code}`), t + CODE_TTL, t);
    if (!reviewer) {
      try {
        await mailer.send(email, 'Your Tumble Tips sign-in code', `Your sign-in code is ${code}. It works for 10 minutes.\n\nIf you didn't ask for it, you can ignore this email.`);
      } catch (e) {
        // Don't leave a code nobody received, and let the person try again straight away.
        run('DELETE FROM login_codes WHERE email = ?', email);
        console.error('sign-in email failed:', (e as Error).message);
        throw new HttpError(503, 'email_failed', 'We could not send the email. Please try again in a moment.');
      }
    }
    return { ok: true };
  });

  app.post('/auth/verify', { config: { rateLimit: { max: 20, timeWindow: '1 minute' } } }, async req => {
    const b = z.object({ email: emailSchema, code: z.string().regex(/^\d{6}$/), consent: z.boolean().optional(), consentVersion: z.string().max(40).optional() }).parse(req.body);
    const t = now().getTime();
    const row = q<{ code_hash: string; expires_at: number; attempts: number }>('SELECT code_hash, expires_at, attempts FROM login_codes WHERE email = ?', b.email);
    if (!row || row.expires_at < t || row.attempts >= MAX_ATTEMPTS) throw new HttpError(400, 'invalid_code', 'That code is not valid. Please ask for a new one.');
    if (!same(row.code_hash, hmac(`${b.email}:${b.code}`))) {
      run('UPDATE login_codes SET attempts = attempts + 1 WHERE email = ?', b.email);
      throw new HttpError(400, 'invalid_code', 'That code is not right.');
    }
    let user = q<User>('SELECT id, email FROM users WHERE email = ?', b.email);
    if (!user) {
      // New account: the code stays valid so the app can ask for consent, then send the same code again.
      if (!b.consent) throw new HttpError(409, 'consent_required', 'Please confirm you are a parent or guardian and accept the terms.');
      const id = randomUUID();
      run('INSERT INTO users (id, email, created_at, consent_at, consent_version) VALUES (?,?,?,?,?)', id, b.email, t, t, b.consentVersion ?? 'unversioned');
      user = { id, email: b.email };
    }
    run('DELETE FROM login_codes WHERE email = ?', b.email);
    return { token: newSession(user.id), user: { id: user.id, email: user.email } };
  });

  app.post('/auth/logout', async req => {
    const m = /^Bearer (.+)$/.exec(req.headers.authorization ?? '');
    if (m) run('DELETE FROM sessions WHERE token_hash = ?', sha(m[1]));
    return { ok: true };
  });

  app.get('/me', async req => {
    const u = authed(req);
    return { user: u, admin: isAdmin(u), athletes: all('SELECT id, name FROM athletes WHERE user_id = ? ORDER BY created_at', u.id) };
  });

  // Both stores require that people can delete their account from inside the app.
  app.delete('/me', async (req, reply) => {
    const u = authed(req);
    run('DELETE FROM login_codes WHERE email = ?', u.email);
    run('DELETE FROM users WHERE id = ?', u.id); // cascades to sessions, athletes and challenge days
    return reply.status(204).send();
  });

  // ---------- athletes (child profiles) ----------
  const nameSchema = z.string().trim().regex(NAME, 'Use a first name and last initial only, like "Mia R."');
  app.post('/athletes', async req => {
    const u = authed(req);
    const { name } = z.object({ name: nameSchema }).parse(req.body);
    if (q<{ n: number }>('SELECT COUNT(*) n FROM athletes WHERE user_id = ?', u.id)!.n >= MAX_ATHLETES) throw new HttpError(409, 'too_many_athletes', `You can add up to ${MAX_ATHLETES} athletes.`);
    const id = randomUUID();
    run('INSERT INTO athletes (id, user_id, name, created_at) VALUES (?,?,?,?)', id, u.id, name, now().getTime());
    return { id, name };
  });
  app.patch<{ Params: { id: string } }>('/athletes/:id', async req => {
    const a = ownAthlete(authed(req), req.params.id);
    const { name } = z.object({ name: nameSchema }).parse(req.body);
    run('UPDATE athletes SET name = ? WHERE id = ?', name, a.id);
    return { id: a.id, name };
  });
  app.delete<{ Params: { id: string } }>('/athletes/:id', async (req, reply) => {
    run('DELETE FROM athletes WHERE id = ?', ownAthlete(authed(req), req.params.id).id);
    return reply.status(204).send();
  });

  // ---------- challenge ----------
  app.get('/challenge/clock', async () => ({ ...clock(), serverTime: now().toISOString(), tz: config.tz }));

  const stateFor = (athleteId: string) => {
    const c = clock(), p = loadProgress(db, athleteId);
    const st = standings(db, c.lastOpenDay);
    const me = st.find(s => s.athleteId === athleteId)!;
    return {
      clock: c,
      days: Array.from({ length: DAYS }, (_, i) => i + 1).map(d => ({
        day: d, done: !!p[d]?.done, onTime: !!p[d]?.onTime, ticks: p[d]?.ticks ?? [], finisher: p[d]?.finisher ?? null, points: dayPoints(p, d),
        finisherPoints: p[d]?.finisher != null ? finisherPoints(d, p[d]!.finisher!) : 0,
      })),
      totalPoints: totalPoints(p), streak: currentStreak(p, c.lastOpenDay), multiplier: multiplier(currentStreak(p, c.lastOpenDay)),
      rank: me.rank, entered: st.length,
    };
  };
  const dayParam = (v: string) => { const d = Number(v); if (!Number.isInteger(d) || d < 1 || d > DAYS) throw new HttpError(400, 'invalid_day', 'Day must be 1 to 24.'); return d; };
  const openDay = (day: number) => {
    const c = clock();
    if (c.phase === 'before') throw new HttpError(403, 'challenge_not_started', 'The challenge starts on 1 December.');
    if (c.phase === 'closed') throw new HttpError(403, 'challenge_closed', 'The challenge has finished.');
    if (day > c.lastOpenDay) throw new HttpError(403, 'day_not_open', `Day ${day} opens on ${day} December.`);
    return c;
  };
  const getDay = (athleteId: string, day: number) =>
    q<{ ticks: string; done: number; finisher: number | null }>('SELECT ticks, done, finisher FROM challenge_days WHERE athlete_id = ? AND day = ?', athleteId, day);

  app.get<{ Params: { id: string } }>('/athletes/:id/challenge', async req => stateFor(ownAthlete(authed(req), req.params.id).id));

  app.put<{ Params: { id: string; day: string } }>('/athletes/:id/challenge/days/:day/ticks', async req => {
    const a = ownAthlete(authed(req), req.params.id), day = dayParam(req.params.day);
    openDay(day);
    const n = dayExercises(day).length;
    const { ticks } = z.object({ ticks: z.array(z.boolean()).length(n) }).parse(req.body);
    if (getDay(a.id, day)?.done) throw new HttpError(409, 'day_finished', 'This day is already finished.');
    run(`INSERT INTO challenge_days (athlete_id, day, ticks) VALUES (?,?,?) ON CONFLICT(athlete_id, day) DO UPDATE SET ticks = excluded.ticks`, a.id, day, JSON.stringify(ticks));
    return stateFor(a.id);
  });

  app.post<{ Params: { id: string; day: string } }>('/athletes/:id/challenge/days/:day/finish', async req => {
    const a = ownAthlete(authed(req), req.params.id), day = dayParam(req.params.day);
    const c = openDay(day);
    z.object({ confirm: z.literal(true) }).parse(req.body); // the signed-in parent confirms the day was done
    const row = getDay(a.id, day);
    if (row?.done) throw new HttpError(409, 'day_finished', 'This day is already finished.');
    const ticks: boolean[] = row ? JSON.parse(row.ticks) : [];
    const n = dayExercises(day).length;
    if (ticks.length !== n || !ticks.every(Boolean)) throw new HttpError(409, 'not_all_ticked', 'Tick every exercise before finishing the day.');
    const t = now().getTime(), onTime = c.onTimeDay === day ? 1 : 0;
    run('UPDATE challenge_days SET done = 1, on_time = ?, finished_at = ?, confirmed_at = ? WHERE athlete_id = ? AND day = ?', onTime, t, t, a.id, day);
    return stateFor(a.id);
  });

  app.post<{ Params: { id: string; day: string } }>('/athletes/:id/challenge/days/:day/finisher', async req => {
    const a = ownAthlete(authed(req), req.params.id), day = dayParam(req.params.day);
    const c = openDay(day);
    const lim = limitsFor(day);
    const { value } = z.object({ value: z.number().int().min(1).max(lim.max) }).parse(req.body);
    const row = getDay(a.id, day);
    if (!row?.done) throw new HttpError(409, 'finish_day_first', 'Finish the day to unlock the finisher.');
    if (c.onTimeDay !== day) throw new HttpError(403, 'finisher_closed', 'The finisher can only be done on its own date.');
    if (row.finisher != null) throw new HttpError(409, 'finisher_logged', 'The finisher is already logged for this day.');
    run('UPDATE challenge_days SET finisher = ?, finisher_at = ?, flagged = ? WHERE athlete_id = ? AND day = ?', value, now().getTime(), value > lim.typical * 2 ? 1 : 0, a.id, day);
    return { ...stateFor(a.id), finisherName: finisherFor(day).name };
  });

  app.get<{ Querystring: { athleteId?: string } }>('/leaderboard', async req => {
    const u = authed(req);
    const mine = req.query.athleteId ? ownAthlete(u, req.query.athleteId).id : null;
    const st = standings(db, clock().lastOpenDay);
    // Public rows only expose a first name, last initial and score. No ids, emails or dates.
    const pub = (s: (typeof st)[number]) => ({ rank: s.rank, name: s.name, pts: s.pts, streak: s.streak, badge: s.badge, isMe: s.athleteId === mine });
    const me = mine ? st.find(s => s.athleteId === mine) : undefined;
    const around = me && me.rank > 10 ? st.slice(Math.max(0, me.rank - 2), me.rank + 1).map(pub) : [];
    return { entered: st.length, top: st.slice(0, 10).map(pub), around, me: me ? pub(me) : null, ahead: me && me.rank > 1 ? { name: st[me.rank - 2].name, pts: st[me.rank - 2].pts } : null };
  });

  // ---------- admin (fair play) ----------
  app.get('/admin/flagged', async req => {
    if (!isAdmin(authed(req))) throw new HttpError(403, 'forbidden');
    return all(`SELECT a.id athleteId, a.name, d.day, d.finisher, d.finisher_at finisherAt FROM challenge_days d JOIN athletes a ON a.id = d.athlete_id WHERE d.flagged = 1 ORDER BY d.finisher_at`);
  });
  app.post<{ Params: { id: string; day: string } }>('/admin/athletes/:id/days/:day/void-finisher', async req => {
    if (!isAdmin(authed(req))) throw new HttpError(403, 'forbidden');
    run('UPDATE challenge_days SET finisher = NULL, finisher_at = NULL, flagged = 0 WHERE athlete_id = ? AND day = ?', req.params.id, dayParam(req.params.day));
    return { ok: true };
  });

  return app;
}
export type { FastifyReply };
