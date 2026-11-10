export type Milestone = { text: string; date: string };
/** Newest first. Blank text is ignored (returns the same list). */
export const addMilestone = (list: Milestone[], text: string, now = new Date()): Milestone[] =>
  text.trim() ? [{ text: text.trim(), date: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) }, ...list] : list;
