import assert from 'node:assert/strict';
import { CATALOG, ULT_INCLUDES } from '../data/catalog.ts';
import { HERO, byId, filterTypes, gridItems, ownsProduct, topicGuides, ultIncluded, ultWorth } from './catalog.ts';

assert.equal(CATALOG.length, 37);
assert.equal(new Set(CATALOG.map(p => p.id)).size, CATALOG.length, 'ids are unique');
for (const p of CATALOG) assert.ok(p.price >= 0 && p.steps.length > 0 && (p.aud === 'parent' || p.aud === 'coach'), p.id);

// Hero products exist and sit in the right shop
assert.equal(byId(HERO.parent.id)!.aud, 'parent'); assert.equal(byId(HERO.coach.id)!.aud, 'coach');

// Grid never shows guides; filters work
for (const aud of ['parent', 'coach'] as const) {
  assert.ok(gridItems(aud, 'All', true).every(p => p.aud === aud && p.type !== 'Guide'));
  for (const t of filterTypes(aud, true).slice(1)) assert.ok(gridItems(aud, t, true).length > 0 && gridItems(aud, t, true).every(p => p.type === t));
}
assert.equal(filterTypes('parent', true)[0], 'All');

// Ultimate Parent's Guide: bundles 5 guides, buying it unlocks them
assert.equal(ultIncluded().length, ULT_INCLUDES.length);
assert.ok(byId('g1')!.price < ultWorth(), 'bundle is cheaper than buying separately');
assert.equal(ownsProduct([], 'g7'), false);
assert.equal(ownsProduct(['g7'], 'g7'), true);
assert.equal(ownsProduct(['g1'], 'g7'), true);
assert.equal(ownsProduct(['g1'], 'p1'), false, 'bundle only unlocks its own guides');
assert.ok(!topicGuides(true).some(p => p.id === 'g1'));
console.log('catalog: all tests passed');

// Skill Explained: six level guides shown as ONE entry (matches the design chat's final version)
import { isLevelGuide, levelGuides, levelGroupLabel } from './catalog.ts';
assert.equal(levelGuides().length, 6);
assert.ok(levelGuides().every(p => /^Skill Explained: /.test(p.title) && p.price === 2.99));
assert.ok(topicGuides(true).every(p => !isLevelGuide(p.id)));
assert.equal(topicGuides(true).length + 1, 14, 'the design shows "14 guides" including the Skill Explained entry');
assert.equal(levelGroupLabel(() => false, true), 'From $2.99');
assert.equal(levelGroupLabel(id => id === 'se0' || id === 'se3', true), '2/6 owned');
assert.equal(levelGroupLabel(() => true, true), 'Owned');
assert.equal(isLevelGuide('se1'), true); assert.equal(isLevelGuide('s1'), false); assert.equal(isLevelGuide('se10'), false);
console.log('catalog (skill explained): all tests passed');
