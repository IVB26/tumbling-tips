import assert from 'node:assert/strict';
import { CATALOG } from '../data/catalog.ts';
import { audiencesShown, filterTypes, gridItems, heroFor, isVisible, topicGuides } from './catalog.ts';
import { FULL_CATALOGUE } from '../config.ts';

// The first App Store release shows only content that really exists.
assert.equal(FULL_CATALOGUE, false, 'the full shop must default to hidden');
const parent = gridItems('parent', 'All', false), coach = gridItems('coach', 'All', false);
assert.ok(parent.length >= 1, 'there is at least one free tip to show');
assert.ok(parent.every(p => p.price === 0), 'only free items are shown');
assert.equal(coach.length, 0, 'every coach product is paid, so none are shown');
assert.deepEqual(topicGuides(false), [], 'no guides: they are paid and have titles but no text');
assert.ok(!CATALOG.filter(p => isVisible(p, false)).some(p => p.type === 'Video' || p.type === 'Guide' || p.type === 'Bundle'), 'no video, guide or bundle entries');
assert.ok(!CATALOG.filter(p => isVisible(p, false)).some(p => /^\d+:\d\d$/.test(p.dur)), 'nothing shows a video running time when there is no video');
// what is shown must be real: every step has a title and an explanation
for (const p of parent) assert.ok(p.steps.length >= 3 && p.steps.every(s => s[0].trim() && s[1].trim()), `${p.id} has real text`);
// the Parents/Coaches switch disappears when there is nothing for coaches
assert.deepEqual(audiencesShown(false), ['parent']);
assert.deepEqual(audiencesShown(true), ['parent', 'coach']);
assert.deepEqual(filterTypes('parent', false), ['All', ...new Set(parent.map(p => p.type))]);
// the hero card is a free item, never a paid one
const h = heroFor('parent', false)!;
assert.equal(CATALOG.find(p => p.id === h.id)!.price, 0); assert.equal(h.eyebrow, 'Free to read');
assert.equal(heroFor('coach', false), null);
assert.equal(heroFor('parent', true)!.id, 'p2', 'with the full shop on, the design pick returns');
assert.equal(gridItems('parent', 'All', true).length > parent.length, true);
console.log('first-release content: all tests passed');
