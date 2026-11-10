import { ULT_INCLUDES, type Product } from '../data/catalog';
import { SKILLS, type FigKey, type Skill } from '../data/skills';
import { byId } from './catalog';

export type LibItem = { id: string; kind: 'product' | 'skill'; title: string; type: string; dur: string; fig: FigKey; tint: number; product?: Product; skill?: Skill };

/** Everything the user can open: purchases, plus the guides bundled in the Ultimate Parent's Guide. */
export function libraryItems(owned: string[]): LibItem[] {
  const ids = [...new Set([...owned, ...(owned.includes('g1') ? ULT_INCLUDES : [])])];
  const out: LibItem[] = [];
  for (const id of ids) {
    const p = byId(id);
    if (p) { out.push({ id, kind: 'product', title: p.title, type: p.type, dur: p.dur, fig: p.fig, tint: p.tint, product: p }); continue; }
    const k = SKILLS.find(s => s.id === id);
    if (k) out.push({ id, kind: 'skill', title: k.title, type: 'Skill', dur: `${k.breakdown.length + k.drills.length + k.tips.length} clips`, fig: k.fig, tint: k.tint, skill: k });
    // Unknown ids (for example a product removed later) are skipped instead of crashing.
  }
  return out;
}
