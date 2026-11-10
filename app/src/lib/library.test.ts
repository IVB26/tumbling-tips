import assert from 'node:assert/strict';
import { libraryItems } from './library.ts';
import { ULT_INCLUDES } from '../data/catalog.ts';

assert.deepEqual(libraryItems([]), []);
const one = libraryItems(['p4']);
assert.equal(one.length, 1); assert.equal(one[0].kind, 'product'); assert.equal(one[0].type, 'Tips');
// Skills and products both appear, with the right kind and a clip count
const mix = libraryItems(['p4', 's5']);
assert.deepEqual(mix.map(i => i.kind), ['product', 'skill']);
assert.equal(mix[1].dur, '12 clips');   // Round-off: 5 + 4 + 3
// Owning the Ultimate Parent's Guide adds its bundled guides, once each
const ult = libraryItems(['g1', 'g7']);
assert.equal(ult.length, 1 + ULT_INCLUDES.length);
assert.equal(new Set(ult.map(i => i.id)).size, ult.length);
// Unknown ids are ignored
assert.equal(libraryItems(['nope', 'p4']).length, 1);
console.log('library: all tests passed');
