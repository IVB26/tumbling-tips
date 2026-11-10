import { CHALLENGE_YEAR } from '../../app/src/lib/challenge';

export type Phase = 'before' | 'open' | 'closed';
export type ChallengeClock = {
  phase: Phase;
  /** Day of December today, only while the challenge is open (1-26). */
  dom: number | null;
  /** Latest day that can be played: min(dom, 24). 0 before the start. */
  lastOpenDay: number;
  /** The day whose finisher and on-time bonus are available right now (1-24), else null. */
  onTimeDay: number | null;
};

/** Calendar date in the given time zone. One fixed zone decides the day for every player. */
export function localDate(now: Date, tz: string) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(now).map(p => [p.type, p.value]));
  return { y: Number(parts.year), m: Number(parts.month), d: Number(parts.day) };
}

export function challengeClock(now: Date, tz: string, endDay = 27, year = CHALLENGE_YEAR): ChallengeClock {
  const { y, m, d } = localDate(now, tz);
  const key = y * 10000 + m * 100 + d;
  const start = year * 10000 + 1201, end = year * 10000 + 1200 + endDay;
  if (key < start) return { phase: 'before', dom: null, lastOpenDay: 0, onTimeDay: null };
  if (key >= end) return { phase: 'closed', dom: null, lastOpenDay: 24, onTimeDay: null };
  return { phase: 'open', dom: d, lastOpenDay: Math.min(d, 24), onTimeDay: d <= 24 ? d : null };
}
