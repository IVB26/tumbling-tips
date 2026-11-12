import { FINISHERS } from './challenge';
import { shownMilestones } from './prizes';
import { PRIZES_CONFIRMED } from '../config';

export type RuleSection = { title?: string; paragraphs?: string[]; bullets?: string[]; table?: [string, string][] };

/** The "How it works" pop-up. Matches the Challenge rules document. */
export function rulesSections(confirmed = PRIZES_CONFIRMED): RuleSection[] {
  const prizeDays = Object.entries(shownMilestones(confirmed));
  return [
    { paragraphs: ['The Christmas Strength Challenge runs for 24 days, from 1 to 24 December. Each day, do the exercises, tick them off and finish the day. You score points for the leaderboard and hang a new ornament on your Christmas tree.'] },
    { title: 'Daily exercises', bullets: [
      'Every day: 30 sec handstand hold (against a wall, a pike or tuck handstand on a box, chair or couch, or someone can hold your legs), 10 push-ups, 10 V-snaps',
      'Every 2nd day: 1 min plank',
      'Every 3rd day: 10 pike single leg lifts L/R + hold, 10 pike together lifts, 10 straddle single leg lifts L/R + hold, 10 straddle together lifts',
      'Tuesdays and Fridays: 20 squat jumps'] },
    { title: 'Points', table: [['Each exercise ticked', '10'], ['Finish the day', '+20'], ['Finish it on the day', '+10'], ['Daily finisher', 'per second or rep']],
      paragraphs: ['You can catch up on a missed day later and still score, but you lose the on-the-day bonus, your streak and the finisher.'] },
    { title: 'Streak bonus', paragraphs: ['Finish days on the day, one after another, to build a streak. The longer your streak, the more your daily points are multiplied.'],
      table: [['Streak days 1–6', '×1'], ['Streak days 7–12', '×2'], ['Streak days 13–18', '×3'], ['Streak days 19–24', '×4']],
      bullets: ['Miss a day and your streak drops back to ×1. Finisher points are not multiplied.'] },
    { title: 'Daily finisher', paragraphs: ['After you finish the day, do one all-out test. It changes each day:'],
      bullets: [...FINISHERS.map(f => `${f.name}: ${f.rate}`), 'You can only do the finisher on its own date, once. A parent or coach must watch and count.'] },
    { title: 'Prizes', paragraphs: confirmed
        ? ['Every finished day adds an ornament to your tree. Prize days:']
        : ['Every finished day adds an ornament to your tree. Finish day 6 to earn the Elf Strength badge, shown next to your name on the leaderboard. Other prizes will be announced before the Challenge starts.'],
      bullets: confirmed ? prizeDays.map(([d, m]) => `Day ${d}: ${m.title}. ${m.body}.`) : undefined },
    { title: 'Who runs it', paragraphs: ['This competition is run by Tayah’s Tumble Tips. Entry is free and no purchase is necessary.', 'It is not sponsored, endorsed or run by Apple or Google, and they have no involvement in it.'] },
    { title: 'Fair play', bullets: ['A parent or guardian confirms each finished day.', 'Only a first name and last initial are shown on the leaderboard.', 'Ties go to whoever has the higher finisher total.', 'Unusually high scores are checked and may be removed.'] },
    { title: 'Safety', paragraphs: ['Take part with adult supervision, warm up, use a safe space, and stop if anything hurts.'] },
  ];
}
