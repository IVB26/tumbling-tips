import { multiplier } from './challenge';

/** The four streak tiers (x1 to x4) with how full each bar is. */
export const tierProgress = (streak: number) =>
  [1, 2, 3, 4].map(k => ({
    tier: k,
    label: `×${k} · days ${(k - 1) * 6 + 1}–${k * 6}`,
    fill: Math.max(0, Math.min(1, (streak - (k - 1) * 6) / 6)),
    current: multiplier(streak) === k,
  }));

/** The sentence under the streak card. */
export function streakMessage(streak: number): string {
  if (!streak) return 'Finish today on time to start your streak.';
  const next = [7, 13, 19].find(s => s > streak);
  if (!next) return 'Top multiplier! Keep it going.';
  const n = next - streak;
  return `${n} more on-time day${n > 1 ? 's' : ''} to unlock ×${multiplier(next)}.`;
}
