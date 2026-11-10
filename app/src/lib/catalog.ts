import { CATALOG, ULT_INCLUDES, type Product } from '../data/catalog';

export const byId = (id: string) => CATALOG.find(p => p.id === id);
/** Owning the Ultimate Parent's Guide (g1) also unlocks the guides bundled inside it. */
export const ownsProduct = (owned: string[], id: string) => owned.includes(id) || (owned.includes('g1') && ULT_INCLUDES.includes(id));

export const ultIncluded = () => ULT_INCLUDES.map(id => byId(id)!);
export const ultWorth = () => ultIncluded().reduce((a, p) => a + p.price, 0);

export const HERO = {
  parent: { eyebrow: 'New this week', title: 'Cartwheel in 5 Steps', body: 'Five checkpoints your child can practise in the living room.', id: 'p2' },
  coach: { eyebrow: 'Most bought by coaches', title: 'Back Handspring Ladder', body: 'Eight stages with pass criteria and spotting notes.', id: 'c2' },
} as const;

/** Shop grid: everything for the audience except guides, which have their own section. */
export const gridItems = (aud: 'parent' | 'coach', filter: string) =>
  CATALOG.filter(p => p.aud === aud && p.type !== 'Guide' && (filter === 'All' || p.type === filter));
export const filterTypes = (aud: 'parent' | 'coach') => ['All', ...new Set(CATALOG.filter(p => p.aud === aud && p.type !== 'Guide').map(p => p.type))];
/** "Skill Explained" is sold one level at a time (se0 to se5) but shown as one entry in the guides list. */
export const isLevelGuide = (id: string) => /^se\d$/.test(id);
export const levelGuides = () => CATALOG.filter(p => isLevelGuide(p.id));
/** Guides listed on their own: everything except the Ultimate guide and the level guides (those sit under Skill Explained). */
export const topicGuides = () => CATALOG.filter(p => p.type === 'Guide' && p.id !== 'g1' && !isLevelGuide(p.id));
/** Right-hand label of the Skill Explained row: "From $2.99", "2/6 owned" or "Owned". */
export function levelGroupLabel(owns: (id: string) => boolean): string {
  const lg = levelGuides(), got = lg.filter(p => owns(p.id)).length;
  if (got === lg.length) return 'Owned';
  if (got > 0) return `${got}/${lg.length} owned`;
  return 'From $' + Math.min(...lg.map(p => p.price)).toFixed(2);
}
export type { Product };
