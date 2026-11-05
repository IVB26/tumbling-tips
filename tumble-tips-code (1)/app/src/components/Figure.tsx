import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import type { FigKey } from '../data/skills';

// Gymnast pictograms, ported from the prototype's SVG strings.
export default function Figure({ name, color, bg = '#FFF6F9', size = '100%' }: { name: FigKey; color: string; bg?: string; size?: number | string }) {
  const p = { stroke: color, strokeLinecap: 'round' as const, fill: 'none' };
  const dot = (cx: number, cy: number, r: number) => <Circle cx={cx} cy={cy} r={r} fill={color} />;
  const arc = <Path d="M14 84Q50 -6 86 84" {...p} strokeWidth={4} strokeDasharray="5 7" />;
  let body: React.ReactNode;
  switch (name) {
    case 'roll': body = <><Circle cx={50} cy={50} r={26} {...p} strokeWidth={9} strokeDasharray="120 60" />{dot(70, 34, 8)}</>; break;
    case 'handstand': body = <>{dot(50, 80, 8)}<Path d="M50 70V36M50 36l-6-22M50 36l6-22M50 66l-14 14M50 66l14 14" {...p} strokeWidth={8} /></>; break;
    case 'cartwheel': body = <>{dot(50, 50, 8)}<Path d="M50 50L22 26M50 50L78 26M50 50L24 80M50 50L76 80" {...p} strokeWidth={8} /></>; break;
    case 'bridge': body = <><Path d="M18 80Q50 10 82 80" {...p} strokeWidth={9} />{dot(24, 62, 8)}</>; break;
    case 'backhand': body = <><Path d="M20 78Q30 28 64 24Q84 26 82 58" {...p} strokeWidth={9} />{dot(82, 72, 8)}<Path d="M22 86h60" {...p} strokeWidth={4} opacity={0.4} /></>; break;
    case 'circuit': body = <><Circle cx={50} cy={50} r={30} {...p} strokeWidth={5} strokeDasharray="6 9" />{dot(50, 20, 8)}{dot(80, 50, 8)}{dot(50, 80, 8)}{dot(20, 50, 8)}</>; break;
    case 'ladder': body = <Path d="M30 86V14M70 86V14M30 72h40M30 54h40M30 36h40M30 18h40" {...p} strokeWidth={7} />; break;
    case 'salto': body = <>{arc}{dot(50, 44, 14)}{dot(64, 28, 7)}</>; break;
    case 'layout': body = <>{arc}<Path d="M32 56L66 30" {...p} strokeWidth={9} />{dot(74, 24, 7)}</>; break;
    case 'twist': body = <><Path d="M50 80V32" {...p} strokeWidth={9} />{dot(50, 20, 7)}<Ellipse cx={50} cy={58} rx={28} ry={8} {...p} strokeWidth={4} strokeDasharray="6 6" /><Ellipse cx={50} cy={40} rx={20} ry={6} {...p} strokeWidth={4} strokeDasharray="6 6" /></>; break;
    case 'mat': body = <><Rect x={14} y={54} width={72} height={20} rx={5} fill={color} /><Path d="M38 54v20M62 54v20" stroke={bg} strokeWidth={3} />{dot(50, 32, 8)}</>; break;
  }
  return <Svg viewBox="0 0 100 100" width={size} height={size}>{body}</Svg>;
}
