// The Christmas tree: 23 ornament spots (days 1 to 23, filled from the bottom up) and a star on top for day 24.

/** Rows of the tree from top to bottom: [y position, number of spots in that row]. */
export const TREE_ROWS: [number, number][] = [[62, 1], [92, 2], [120, 4], [146, 4], [170, 6], [192, 6]];

export const TREE_SPOTS: [number, number][] = (() => {
  const out: [number, number][] = [];
  for (const [y, c] of TREE_ROWS) {
    const gap = Math.min(26, ((y - 20) * 0.72) / c);
    for (let i = 0; i < c; i++) out.push([100 + (i - (c - 1) / 2) * gap, y]);
  }
  return out;
})();

/** Spot 0 is at the top, so it holds day 23. The bottom row holds the first days. */
export const spotDay = (i: number) => 23 - i;
export const ORNAMENT_COLORS = ['#E6246E', '#FF8AB3', '#B5124F', '#FFC2D9', '#F06292', '#D63384'];
export const ornamentColor = (day: number) => ORNAMENT_COLORS[day % ORNAMENT_COLORS.length];

/** Points of a five-pointed star, as an SVG "points" string. */
export const starPoints = (x: number, y: number, r: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2, rr = i % 2 ? r * 0.45 : r;
    return (x + rr * Math.cos(a)).toFixed(1) + ',' + (y + rr * Math.sin(a)).toFixed(1);
  }).join(' ');

/** Days whose ornament is a star (the prize days), except day 24 which is the star on top. */
export const STAR_DAYS = [6, 12, 18];
