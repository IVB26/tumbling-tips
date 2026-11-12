import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type TabName = 'Explore' | 'Skills' | 'Challenge' | 'Library' | 'Account';

/** Tab bar icons, drawn from the design (outline style, same stroke as the prototype). */
export default function TabIcon({ name, color, size = 24 }: { name: string; color: string; size?: number }) {
  const line = { stroke: color, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  let body: React.ReactNode;
  switch (name as TabName) {
    case 'Explore': body = <><Circle cx={12} cy={12} r={9} {...line} /><Path d="M15.5 8.5l-2 5-5 2 2-5z" {...line} /></>; break;
    case 'Skills': body = <><Circle cx={12} cy={12} r={1.8} fill={color} stroke={color} strokeWidth={2} /><Path d="M12 12L5 6M12 12l7-6M12 12l-6 8M12 12l6 8" {...line} /></>; break;
    case 'Challenge': body = <><Rect x={4} y={10} width={16} height={10} rx={2} {...line} /><Path d="M3 7h18v3H3zM12 7v13M12 7c-2-4-6-3-5 0M12 7c2-4 6-3 5 0" {...line} /></>; break;
    case 'Library': body = <Path d="M6 3h12v18l-6-4.5L6 21z" {...line} />; break;
    case 'Account': body = <><Circle cx={12} cy={8} r={4} {...line} /><Path d="M4 21c0-4 4-6 8-6s8 2 8 6" {...line} /></>; break;
    default: body = <Circle cx={12} cy={12} r={9} {...line} />;
  }
  return <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">{body}</Svg>;
}
