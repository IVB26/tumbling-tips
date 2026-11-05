import { buildApp } from '../src/app';
import { openDb } from '../src/db';
import { MemoryMailer } from '../src/mailer';
import { loadConfig } from '../src/config';
import { dayExercises } from '../../app/src/lib/challenge';

export function setup(start = '2026-12-05T12:00:00Z', env: Record<string, string> = {}) {
  let t = new Date(start);
  const mailer = new MemoryMailer();
  const db = openDb();
  const config = loadConfig({ CHALLENGE_TZ: 'UTC', ADMIN_EMAILS: 'admin@example.com', ...env } as any);
  const app = buildApp({ db, config, mailer, now: () => t });
  const call = async (method: string, url: string, token?: string, body?: unknown) => {
    const r = await app.inject({ method: method as any, url, headers: token ? { authorization: `Bearer ${token}` } : {}, payload: body as any });
    return { status: r.statusCode, body: r.body ? JSON.parse(r.body) : null };
  };
  const signIn = async (email: string) => {
    await call('POST', '/auth/request', undefined, { email });
    const code = mailer.lastCode(email)!;
    const r = await call('POST', '/auth/verify', undefined, { email, code, consent: true, consentVersion: 't1' });
    if (r.status !== 200) throw new Error('sign-in failed: ' + JSON.stringify(r.body));
    return r.body.token as string;
  };
  const addAthlete = async (token: string, name = 'Mia R.') => (await call('POST', '/athletes', token, { name })).body.id as string;
  const setTime = (iso: string) => { t = new Date(iso); };
  /** Tick every exercise for a day, then finish it (as the parent). */
  const completeDay = async (token: string, athlete: string, day: number) => {
    const n = dayExercises(day).length;
    await call('PUT', `/athletes/${athlete}/challenge/days/${day}/ticks`, token, { ticks: Array(n).fill(true) });
    return call('POST', `/athletes/${athlete}/challenge/days/${day}/finish`, token, { confirm: true });
  };
  return { app, db, mailer, call, signIn, addAthlete, setTime, completeDay };
}
