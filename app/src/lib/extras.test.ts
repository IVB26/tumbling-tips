import assert from 'node:assert/strict';
import { TREE_SPOTS, spotDay, starPoints, ornamentColor, STAR_DAYS } from './tree.ts';
import { tierProgress, streakMessage } from './streak.ts';
import { daysLeftText, pointsLine, rankLine } from './reward.ts';
import { COMPETITION_PRIZES, shownMilestones } from './prizes.ts';
import { rulesSections } from './rules.ts';
import { MILESTONES, FINISHERS } from './challenge.ts';
import { PRIZES_CONFIRMED } from '../config.ts';

// ---- Tree: 23 ornament spots, one per day 1 to 23, all inside the 200 x 222 drawing
assert.equal(TREE_SPOTS.length, 23);
const days = TREE_SPOTS.map((_, i) => spotDay(i));
assert.deepEqual([...days].sort((a, b) => a - b), Array.from({ length: 23 }, (_, i) => i + 1), 'each day 1-23 has exactly one spot');
assert.equal(spotDay(22), 1, 'day 1 hangs at the bottom'); assert.equal(spotDay(0), 23, 'day 23 hangs at the top');
for (const [x, y] of TREE_SPOTS) assert.ok(x > 10 && x < 190 && y > 20 && y < 205, `spot ${x},${y} is on the tree`);
assert.equal(new Set(TREE_SPOTS.map(([x, y]) => `${x},${y}`)).size, 23, 'no two ornaments overlap exactly');
assert.equal(starPoints(100, 18, 13).split(' ').length, 10, 'a star has 10 points');
assert.deepEqual(STAR_DAYS, [6, 12, 18]);
assert.equal(ornamentColor(1), ornamentColor(7), 'colours repeat every 6 days');

// ---- Streak card: bars and message follow the x1..x4 tiers
assert.deepEqual(tierProgress(0).map(t => t.fill), [0, 0, 0, 0]);
assert.deepEqual(tierProgress(3).map(t => t.fill), [0.5, 0, 0, 0]);
assert.deepEqual(tierProgress(9).map(t => t.fill), [1, 0.5, 0, 0]);
assert.deepEqual(tierProgress(24).map(t => t.fill), [1, 1, 1, 1]);
assert.equal(tierProgress(7).find(t => t.current)!.tier, 2);
assert.equal(tierProgress(6).find(t => t.current)!.tier, 1);
assert.equal(tierProgress(0)[0].label, '×1 · days 1–6'); assert.equal(tierProgress(0)[3].label, '×4 · days 19–24');
assert.equal(streakMessage(0), 'Finish today on time to start your streak.');
assert.equal(streakMessage(1), '6 more on-time days to unlock ×2.');
assert.equal(streakMessage(6), '1 more on-time day to unlock ×2.');
assert.equal(streakMessage(7), '6 more on-time days to unlock ×3.');
assert.equal(streakMessage(19), 'Top multiplier! Keep it going.');

// ---- "Day done" wording
assert.equal(daysLeftText(1), 'A new ornament is on your tree. 1 day to go.');
assert.equal(daysLeftText(23), 'A new ornament is on your tree. 23 days to go.');
assert.equal(daysLeftText(0), 'Your tree is finished. Merry Christmas!');
assert.equal(pointsLine(5, 70, 1), '+70 points for day 5');
assert.equal(pointsLine(9, 140, 2), '+140 points for day 9 (×2 streak)');
assert.equal(rankLine(5, 3, 30), 'You moved up to #3 of 30');
assert.equal(rankLine(3, 3, 30), "You're #3 of 30");
assert.equal(rankLine(3, 4, 30), "You're #4 of 30", 'never says "moved up" when you slipped');

// ---- Prizes: unconfirmed prizes are never promised
assert.equal(PRIZES_CONFIRMED, false, 'prizes default to unconfirmed');
assert.deepEqual(Object.keys(shownMilestones(false)), ['6'], 'only the Elf badge is promised until confirmed');
assert.deepEqual(Object.keys(shownMilestones(true)).map(Number), Object.keys(MILESTONES).map(Number));
assert.equal(COMPETITION_PRIZES.length, 3);

// ---- Rules text: complete, and consistent with the scoring code
const text = (confirmed: boolean) => JSON.stringify(rulesSections(confirmed));
for (const f of FINISHERS) assert.ok(text(false).includes(f.name), `rules list the finisher "${f.name}"`);
for (const m of ['×1', '×2', '×3', '×4', 'Fair play', 'Safety', 'Daily exercises']) assert.ok(text(false).includes(m), m);
assert.ok(!/voucher|free skill|video feedback/i.test(text(false)), 'unconfirmed prizes do not appear in the rules');
assert.ok(text(false).includes('Elf Strength badge'));
assert.ok(text(true).includes('Day 12'), 'confirmed prizes appear when switched on');
console.log('challenge extras: all tests passed');
