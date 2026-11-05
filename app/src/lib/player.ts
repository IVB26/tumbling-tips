// Skill player logic as pure functions so it can be tested without a screen.
import type { Clip, Skill } from '../data/skills';

export type Section = 'breakdown' | 'drills' | 'tips';
export const SECTIONS: [Section, string][] = [['breakdown', 'Breakdown'], ['drills', 'Drills'], ['tips', 'Tips']];
export type Item = { sec: Section; i: number; name: string; cue: string; len: number };
export type PlayerState = { pos: number; left: number; elapsed: number; playing: boolean; finished: boolean };

/** The breakdown is free. Drills and tips only play once the skill is owned. */
export function playlist(skill: Skill, owned: boolean): Item[] {
  const out: Item[] = [];
  for (const [sec] of SECTIONS) {
    if (sec !== 'breakdown' && !owned) continue;
    skill[sec].forEach(([name, cue, len]: Clip, i: number) => out.push({ sec, i, name, cue, len }));
  }
  return out;
}

export const startState = (pl: Item[]): PlayerState => ({ pos: 0, left: pl[0].len, elapsed: 0, playing: true, finished: false });

export function goTo(s: PlayerState, pl: Item[], pos: number): PlayerState {
  const p = Math.max(0, Math.min(pos, pl.length - 1));
  return { ...s, pos: p, left: pl[p].len, finished: false };
}

/** One second of playback. Moves to the next clip at zero, and stops after the last one. */
export function tick(s: PlayerState, pl: Item[]): PlayerState {
  if (!s.playing) return s;
  const left = s.left - 1, elapsed = s.elapsed + 1;
  if (left > 0) return { ...s, left, elapsed };
  if (s.pos < pl.length - 1) return { ...s, pos: s.pos + 1, left: pl[s.pos + 1].len, elapsed };
  return { ...s, left: 0, elapsed, playing: false, finished: true };
}

export const mmss = (s: number) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
export const mm2 = (s: number) => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
export const money = (n: number) => (n === 0 ? 'Free' : '$' + n.toFixed(2));
