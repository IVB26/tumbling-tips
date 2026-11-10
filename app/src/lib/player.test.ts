import assert from 'node:assert/strict';
import { SKILLS, SKILL_LEVELS } from '../data/skills.ts';
import { playlist, startState, tick, goTo, mmss, mm2 } from './player.ts';

const sk = SKILLS.find(s => s.id === 's1')!;
// Free users only get the breakdown; owners get breakdown + drills + tips
assert.equal(playlist(sk, false).length, sk.breakdown.length);
assert.equal(playlist(sk, true).length, sk.breakdown.length + sk.drills.length + sk.tips.length);
assert.ok(playlist(sk, false).every(i => i.sec === 'breakdown'));
assert.deepEqual(playlist(sk, true).map(i => i.sec).filter((v, i, a) => a.indexOf(v) === i), ['breakdown', 'drills', 'tips']);

// Timer: counts down, advances to the next clip, then stops at the end
const pl = playlist(sk, false);
let s = startState(pl);
assert.equal(s.left, pl[0].len);
for (let i = 0; i < pl[0].len; i++) s = tick(s, pl);
assert.equal(s.pos, 1); assert.equal(s.left, pl[1].len); assert.equal(s.elapsed, pl[0].len);
const total = pl.reduce((a, b) => a + b.len, 0);
s = startState(pl); for (let i = 0; i < total; i++) s = tick(s, pl);
assert.equal(s.finished, true); assert.equal(s.playing, false); assert.equal(s.pos, pl.length - 1); assert.equal(s.elapsed, total);
// Paused does not tick; goTo clamps
assert.equal(tick({ ...startState(pl), playing: false }, pl).elapsed, 0);
assert.equal(goTo(startState(pl), pl, -5).pos, 0); assert.equal(goTo(startState(pl), pl, 999).pos, pl.length - 1);
assert.equal(mmss(75), '1:15'); assert.equal(mm2(75), '01:15'); assert.equal(mmss(5), '0:05');

// Data integrity: 33 skills, all in a known level, every clip is [string, string, positive number]
assert.equal(SKILLS.length, 33);
for (const k of SKILLS) {
  assert.ok((SKILL_LEVELS as readonly string[]).includes(k.level), k.id);
  for (const sec of ['breakdown', 'drills', 'tips'] as const) {
    assert.ok(k[sec].length > 0, `${k.id} ${sec}`);
    for (const [n, c, t] of k[sec]) assert.ok(n && c && t > 0, `${k.id} ${sec} ${n}`);
  }
}
console.log('player + skills data: all tests passed');
