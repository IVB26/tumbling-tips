import assert from 'node:assert/strict';
import { canBuy, canGetFree, priceLabel } from './purchases.ts';
import { CATALOG } from '../data/catalog.ts';
import { SKILLS } from '../data/skills.ts';
import { levelGroupLabel } from './catalog.ts';
import { PURCHASES_ENABLED } from '../config.ts';

// Purchases are OFF by default: this is the setting the first store release ships with.
assert.equal(PURCHASES_ENABLED, false, 'PURCHASES_ENABLED must default to false');

// While off, no paid item shows a price or a buy button
assert.equal(priceLabel(4.99, false, false), 'Coming soon');
assert.equal(canBuy(4.99, false, false), false);
assert.equal(canBuy(19.99, false, false), false);
// Owned and free items still behave normally
assert.equal(priceLabel(4.99, true, false), 'Owned');
assert.equal(priceLabel(0, false, false), 'Free');
assert.equal(canGetFree(0, false), true);
assert.equal(canGetFree(0, true), false);
assert.equal(canGetFree(4.99, false), false, 'a paid item can never be "got for free"');
// When switched on later, prices and buying return
assert.equal(priceLabel(4.99, false, true), '$4.99');
assert.equal(canBuy(4.99, false, true), true);
assert.equal(canBuy(4.99, true, true), false);
assert.equal(canBuy(0, false, true), false, 'free items are not "bought"');

// Across the whole catalogue and all skills: with purchases off, nothing paid is buyable or shows a dollar price
for (const p of CATALOG) {
  const label = priceLabel(p.price, false, false);
  if (p.price > 0) { assert.equal(canBuy(p.price, false, false), false, p.id); assert.ok(!/\$/.test(label), `${p.id}: ${label}`); }
}
for (const s of SKILLS) assert.equal(canBuy(s.price, false, false), false, s.id);
// The Skill Explained row never shows "From $2.99" while off
assert.equal(levelGroupLabel(() => false, false), 'Coming soon');
assert.equal(levelGroupLabel(() => false, true), 'From $2.99');
assert.equal(levelGroupLabel(id => id === 'se0', false), '1/6 owned', 'owned levels still show progress');
console.log('purchases: all tests passed');
