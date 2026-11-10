// Wording for the "Day done!" pop-up.
export const daysLeftText = (left: number) =>
  left > 0 ? `A new ornament is on your tree. ${left} day${left > 1 ? 's' : ''} to go.` : 'Your tree is finished. Merry Christmas!';

export const pointsLine = (day: number, points: number, mult: number) =>
  `+${points} points for day ${day}${mult > 1 ? ` (×${mult} streak)` : ''}`;

export const rankLine = (rankBefore: number, rankAfter: number, entered: number) =>
  rankAfter < rankBefore ? `You moved up to #${rankAfter} of ${entered}` : `You're #${rankAfter} of ${entered}`;
