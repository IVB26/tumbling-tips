import assert from 'node:assert/strict';
import { dayExercises, multiplier, streakAt, dayPoints, totalPoints, finisherPoints, dow, type Progress } from './challenge.ts';

// Multiplier boundaries
assert.equal(multiplier(0), 1); assert.equal(multiplier(6), 1); assert.equal(multiplier(7), 2);
assert.equal(multiplier(12), 2); assert.equal(multiplier(13), 3); assert.equal(multiplier(18), 3);
assert.equal(multiplier(19), 4); assert.equal(multiplier(24), 4);

// Calendar: 1 Dec 2026 is a Tuesday, so day 1 gets squat jumps
assert.equal(dow(1), 2);
assert.equal(dayExercises(1).length, 4);       // 3 daily + squat jumps (Tue)
assert.equal(dayExercises(3).length, 3 + 4);   // 3 daily + 4 jump drills (3rd day); Thu has no squats
assert.equal(dayExercises(6).length, 3 + 1 + 4); // plank + jump drills; Sun

// Points: day 1 on time, streak 1 => (4*10 + 20 + 10) * 1 = 70
const p: Progress = { 1: { done: true, onTime: true, ticks: [] } };
assert.equal(dayPoints(p, 1), 70);
// Catch-up day: no on-time bonus, no multiplier => 4*10 + 20 = 60
assert.equal(dayPoints({ 1: { done: true, onTime: false, ticks: [] } }, 1), 60);
// Finisher is added after the multiplier and not multiplied
assert.equal(finisherPoints(4, 100), 50);       // plank: 0.5 per second
assert.equal(dayPoints({ 1: { done: true, onTime: true, ticks: [], finisher: 30 } }, 1), 100);
// Unfinished day: 10 per tick
assert.equal(dayPoints({ 5: { done: false, onTime: false, ticks: [true, false, true] } }, 5), 20);
// Streak breaks on a missed or late day
const q: Progress = { 1: { done: true, onTime: true, ticks: [] }, 2: { done: true, onTime: false, ticks: [] }, 3: { done: true, onTime: true, ticks: [] } };
assert.equal(streakAt(q, 3), 1);
assert.equal(totalPoints({}), 0);
console.log('challenge rules: all tests passed');
