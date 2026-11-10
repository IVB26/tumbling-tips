// Christmas Strength Challenge rules, ported from the prototype as pure functions.
// IMPORTANT: in production the server must run this same logic; the app only displays results.

export type Exercise = { name: string; amt: string; note?: string };
export type Finisher = { name: string; unit: 's' | 'reps'; per: number; rate: string };
export type Entry = { done: boolean; onTime: boolean; ticks: boolean[]; finisher?: number };
export type Progress = Record<number, Entry>;

export const CHALLENGE_YEAR = 2026;
export const DAYS = 24;
export const SQUAT_DAYS = [2, 5]; // Tuesday, Friday

export const DAY_NAMES = ['Snowflake Start','Candy Cane Core','Reindeer Hops','Frosty Planks','Jingle Jumps','Elf Strength','Sleigh Pull','Gingerbread Grind',
  'Tinsel Tucks','Mistletoe Hold','Snowball Squats','Twelve Days','Polar Push','Stocking Stretch','Holly Hollows','Nutcracker Power',
  'Ice Rink Balance','Pudding Power','Present Press','Northern Lights','Solstice Strength','Cracker Crunch','Rudolph Run','Christmas Eve'];

export const MILESTONES: Record<number, { title: string; body: string }> = {
  6:  { title: 'Elf Strength badge', body: 'A pink star next to your name on the leaderboard' },
  12: { title: 'Free skill: Straddle to Handstand', body: 'Breakdown, drills and tips unlocked in Skills' },
  18: { title: 'Personal video feedback from Tayah', body: 'Send a clip of any skill and get your own tips back' },
  24: { title: 'Free skill breakdown video', body: 'Pick any skill breakdown video you like' },
};

export const FINISHERS: Finisher[] = [
  { name: 'Longest handstand hold', unit: 's', per: 1, rate: '1 pt a second' },
  { name: 'Most push-ups in 1 minute', unit: 'reps', per: 2, rate: '2 pts a rep' },
  { name: 'Most V-snaps in 1 minute', unit: 'reps', per: 2, rate: '2 pts a rep' },
  { name: 'Longest plank', unit: 's', per: 0.5, rate: '1 pt every 2 seconds' },
];

/** Day of week (0 = Sunday) for a December date in the challenge year. */
export const dow = (d: number) => new Date(CHALLENGE_YEAR, 11, d).getDay();

export function dayExercises(d: number): Exercise[] {
  const ex: Exercise[] = [
    { name: 'Handstand hold', amt: '30 s', note: 'Can be against a wall, a pike or tuck handstand on a box, chair or couch, or someone can hold your legs' },
    { name: 'Push-ups', amt: '10 reps' },
    { name: 'V-snaps', amt: '10 reps' },
  ];
  if (d % 2 === 0) ex.push({ name: 'Plank', amt: '1 min' });
  if (SQUAT_DAYS.includes(dow(d))) ex.push({ name: 'Squat jumps', amt: '20 reps' });
  if (d % 3 === 0) ex.push(
    { name: 'Pike single leg lifts', amt: '10 L/R + hold' }, { name: 'Pike together lifts', amt: '10 reps' },
    { name: 'Straddle single leg lifts', amt: '10 L/R + hold' }, { name: 'Straddle together lifts', amt: '10 reps' });
  return ex;
}

export const finisherFor = (d: number) => FINISHERS[(d - 1) % FINISHERS.length];
export const finisherPoints = (d: number, value: number) => Math.round(value * finisherFor(d).per);

/** Streak multiplier: streak days 1-6 x1, 7-12 x2, 13-18 x3, 19-24 x4. */
export const multiplier = (streak: number) => (streak >= 19 ? 4 : streak >= 13 ? 3 : streak >= 7 ? 2 : 1);

/** 10 per exercise + 20 for finishing + 10 for finishing on the day. */
export const dayBase = (d: number, onTime: boolean) => dayExercises(d).length * 10 + 20 + (onTime ? 10 : 0);

/** Consecutive on-time finished days ending at day d. */
export function streakAt(p: Progress, d: number) {
  let n = 0;
  while (d > 0 && p[d]?.done && p[d]?.onTime) { n++; d--; }
  return n;
}

/** Current streak as of `today`: counts today if already finished on time, otherwise up to yesterday. */
export const currentStreak = (p: Progress, today: number) =>
  streakAt(p, p[today]?.done && p[today]?.onTime ? today : today - 1);

export function dayPoints(p: Progress, d: number) {
  const e = p[d];
  if (!e) return 0;
  if (!e.done) return e.ticks.filter(Boolean).length * 10;
  const mult = multiplier(e.onTime ? streakAt(p, d) : 0);
  return Math.round(dayBase(d, e.onTime) * mult) + (e.finisher != null ? finisherPoints(d, e.finisher) : 0);
}

export const totalPoints = (p: Progress) => {
  let sum = 0;
  for (let d = 1; d <= DAYS; d++) sum += dayPoints(p, d);
  return sum;
};
