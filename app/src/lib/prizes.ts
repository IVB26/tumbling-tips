import { MILESTONES } from './challenge';
import { PRIZES_CONFIRMED } from '../config';

export const COMPETITION_PRIZES = [
  { place: '1st place', medal: '#F2B33D', prize: '$50 Tayah’s Tumble Tips voucher' },
  { place: '2nd place', medal: '#C9D1DC', prize: '$25 Tayah’s Tumble Tips voucher' },
  { place: '3rd place', medal: '#D9905A', prize: '20% off Tayah’s Tumble Tips' },
];

/**
 * Prize days to show. Until prizes are confirmed, only the Elf Strength badge (day 6) is promised,
 * because the app really does show that badge on the leaderboard.
 */
export const shownMilestones = (confirmed = PRIZES_CONFIRMED): Record<number, { title: string; body: string }> =>
  confirmed ? MILESTONES : { 6: MILESTONES[6] };
