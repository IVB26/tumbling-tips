import type { DB } from './db';
import { currentStreak, finisherPoints, totalPoints, dayPoints, multiplier, type Progress } from '../../app/src/lib/challenge';

/** Server-only rules for the daily finisher: hard maximum, and a "typical" score used to flag outliers for review. */
export const FINISHER_LIMITS = [
  { max: 600, typical: 120 },   // longest handstand hold (seconds)
  { max: 150, typical: 60 },    // push-ups in 1 minute
  { max: 150, typical: 60 },    // V-snaps in 1 minute
  { max: 1800, typical: 240 },  // longest plank (seconds)
];
export const limitsFor = (day: number) => FINISHER_LIMITS[(day - 1) % FINISHER_LIMITS.length];

type Row = { athlete_id: string; day: number; ticks: string; done: number; on_time: number; finisher: number | null };

export const rowsToProgress = (rows: Row[]): Progress => {
  const p: Progress = {};
  for (const r of rows) p[r.day] = { done: !!r.done, onTime: !!r.on_time, ticks: JSON.parse(r.ticks) as boolean[], ...(r.finisher != null ? { finisher: r.finisher } : {}) };
  return p;
};

export function loadProgress(db: DB, athleteId: string): Progress {
  return rowsToProgress(db.prepare('SELECT * FROM challenge_days WHERE athlete_id = ?').all(athleteId) as unknown as Row[]);
}

export type Standing = { athleteId: string; name: string; pts: number; streak: number; badge: boolean; finisherTotal: number; createdAt: number; rank: number };

/** Everyone who entered, ranked. Ties go to the higher finisher total (per the published rules). */
export function standings(db: DB, lastOpenDay: number): Standing[] {
  const athletes = db.prepare('SELECT id, name, created_at FROM athletes').all() as unknown as { id: string; name: string; created_at: number }[];
  const rows = db.prepare('SELECT * FROM challenge_days').all() as unknown as Row[];
  const byAthlete = new Map<string, Row[]>();
  for (const r of rows) (byAthlete.get(r.athlete_id) ?? byAthlete.set(r.athlete_id, []).get(r.athlete_id)!).push(r);
  const list = athletes.map(a => {
    const p = rowsToProgress(byAthlete.get(a.id) ?? []);
    let finisherTotal = 0;
    for (const [d, e] of Object.entries(p)) if (e.done && e.finisher != null) finisherTotal += finisherPoints(Number(d), e.finisher);
    return { athleteId: a.id, name: a.name, pts: totalPoints(p), streak: currentStreak(p, lastOpenDay), badge: !!p[6]?.done, finisherTotal, createdAt: a.created_at, rank: 0 };
  });
  list.sort((a, b) => b.pts - a.pts || b.finisherTotal - a.finisherTotal || a.createdAt - b.createdAt);
  list.forEach((s, i) => { s.rank = i + 1; });
  return list;
}

export { dayPoints, multiplier, currentStreak, totalPoints };
