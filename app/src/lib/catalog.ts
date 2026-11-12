import { CATALOG, ULT_INCLUDES, type Product } from '../data/catalog';
import { FULL_CATALOGUE, PURCHASES_ENABLED } from '../config';

export const byId = (id: string) => CATALOG.find(p => p.id === id);
/** Owning the Ultimate Parent's Guide (g1) also unlocks the guides bundled inside it. */
export const ownsProduct = (owned: string[], id: string) => owned.includes(id) || (owned.includes('g1') && ULT_INCLUDES.includes(id));

export const ultIncluded = () => ULT_INCLUDES.map(id => byId(id)!);
export const ultWorth = () => ultIncluded().reduce((a, p) => a + p.price, 0);

export const HERO = {
  parent: { eyebrow: 'New this week', title: 'Cartwheel in 5 Steps', body: 'Five checkpoints your child can practise in the living room.', id: 'p2' },
  coach: { eyebrow: 'Most bought by coaches', title: 'Back Handspring Ladder', body: 'Eight stages with pass criteria and spotting notes.', id: 'c2' },
} as const;

/** Until the full shop is real (FULL_CATALOGUE), only free items, which have real text, are shown. */
export const isVisible = (p: Product, full = FULL_CATALOGUE) => full || p.price === 0;

/** Shop grid: everything shown for the audience except guides, which have their own section. */
export const gridItems = (aud: 'parent' | 'coach', filter: string, full = FULL_CATALOGUE) =>
  CATALOG.filter(p => p.aud === aud && p.type !== 'Guide' && isVisible(p, full) && (filter === 'All' || p.type === filter));
export const filterTypes = (aud: 'parent' | 'coach', full = FULL_CATALOGUE) =>
  ['All', ...new Set(CATALOG.filter(p => p.aud === aud && p.type !== 'Guide' && isVisible(p, full)).map(p => p.type))];
/** The Parents/Coaches switch only appears when there is something to show for both. */
export const audiencesShown = (full = FULL_CATALOGUE): ('parent' | 'coach')[] =>
  (['parent', 'coach'] as const).filter(a => a === 'parent' || gridItems(a, 'All', full).length > 0);
/** The big card at the top of Explore: the design's pick, or (in the first release) the first free item. */
export function heroFor(aud: 'parent' | 'coach', full = FULL_CATALOGUE): { eyebrow: string; title: string; body: string; id: string } | null {
  if (full) return HERO[aud];
  const p = gridItems(aud, 'All', false)[0];
  return p ? { eyebrow: 'Free to read', title: p.title, body: p.desc, id: p.id } : null;
}
/** "Skill Explained" is sold one level at a time (se0 to se5) but shown as one entry in the guides list. */
export const isLevelGuide = (id: string) => /^se\d$/.test(id);
export const levelGuides = () => CATALOG.filter(p => isLevelGuide(p.id));
/** Guides listed on their own: everything except the Ultimate guide and the level guides (those sit under Skill Explained). */
export const topicGuides = (full = FULL_CATALOGUE) => CATALOG.filter(p => p.type === 'Guide' && p.id !== 'g1' && !isLevelGuide(p.id) && isVisible(p, full));
/** Right-hand label of the Skill Explained row: "From $2.99", "2/6 owned" or "Owned". */
export function levelGroupLabel(owns: (id: string) => boolean, enabled = PURCHASES_ENABLED): string {
  const lg = levelGuides(), got = lg.filter(p => owns(p.id)).length;
  if (got === lg.length) return 'Owned';
  if (got > 0) return `${got}/${lg.length} owned`;
  return enabled ? 'From $' + Math.min(...lg.map(p => p.price)).toFixed(2) : 'Coming soon';
}
export type { Product };
