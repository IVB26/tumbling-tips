import assert from 'node:assert/strict';
import { addMilestone } from './milestones.ts';

const d = new Date('2026-12-05T10:00:00Z');
const one = addMilestone([], '  First round-off  ', d);
assert.equal(one.length, 1); assert.equal(one[0].text, 'First round-off'); assert.equal(one[0].date, '5 Dec');
const two = addMilestone(one, 'Held a handstand', d);
assert.deepEqual(two.map(m => m.text), ['Held a handstand', 'First round-off'], 'newest first');
assert.equal(addMilestone(two, '   ', d), two, 'blank is ignored');
assert.equal(one.length, 1, 'does not change the original list');
console.log('milestones: all tests passed');
