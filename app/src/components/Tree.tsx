import React from 'react';
import Svg, { Circle, G, Polygon, Rect } from 'react-native-svg';
import { useColors } from '../ThemeContext';
import { STAR_DAYS, TREE_SPOTS, ornamentColor, spotDay, starPoints } from '../lib/tree';

/** One hanging ornament. Prize days (6, 12, 18) are stars. */
export function Ornament({ day, x, y, r }: { day: number; x: number; y: number; r: number }) {
  if (STAR_DAYS.includes(day)) return <Polygon points={starPoints(x, y, r * 1.35)} fill="#FF8AB3" stroke="#B5124F" strokeWidth={1} />;
  return (
    <G>
      <Rect x={x - r * 0.3} y={y - r * 1.25} width={r * 0.6} height={r * 0.4} rx={1} fill="#C9D1DC" />
      <Circle cx={x} cy={y} r={r} fill={ornamentColor(day)} />
      <Circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.25} fill="#fff" opacity={0.6} />
    </G>
  );
}

/** The Christmas tree: one ornament per finished day, filled from the bottom up, with the star on top for day 24. */
export default function Tree({ done, width = 280 }: { done: boolean[]; width?: number }) {
  const c = useColors();
  const count = done.filter(Boolean).length;
  return (
    <Svg width={width} height={(width * 222) / 200} viewBox="0 0 200 222" accessibilityRole="image" accessibilityLabel={`Christmas tree with ${count} of 24 ornaments`}>
      <Rect x={88} y={198} width={24} height={20} rx={3} fill={c.ink2} />
      <Polygon points="100,22 52,96 148,96" fill={c.holly} />
      <Polygon points="100,56 32,148 168,148" fill={c.holly} />
      <Polygon points="100,98 12,204 188,204" fill={c.holly} />
      {TREE_SPOTS.map(([x, y], i) => {
        const day = spotDay(i);
        return done[day - 1]
          ? <Ornament key={day} day={day} x={x} y={y} r={7} />
          : <Circle key={day} cx={x} cy={y} r={6} fill="none" stroke="#fff" strokeOpacity={0.55} strokeDasharray="2 2" />;
      })}
      {done[23]
        ? <Polygon points={starPoints(100, 18, 15)} fill="#FF8AB3" stroke="#B5124F" />
        : <Polygon points={starPoints(100, 18, 13)} fill="none" stroke={c.ink2} strokeDasharray="3 2" />}
    </Svg>
  );
}
