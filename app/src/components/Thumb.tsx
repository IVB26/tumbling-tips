import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '../ThemeContext';
import type { FigKey } from '../data/skills';
import Figure from './Figure';

export const tintFor = (c: ReturnType<typeof useColors>, n: number) => [c.petal, c.blush, '#FF9CC2', '#FFD1E1'].map((x, i) => (i >= 2 && c.bg === '#1E0A14' ? c.petal : x))[n % 4];

export default function Thumb({ fig, tint, tag, dur, ratio = 1 }: { fig: FigKey; tint: number; tag?: string; dur?: string; ratio?: number }) {
  const c = useColors();
  return (
    <View style={[s.thumb, { backgroundColor: tintFor(c, tint), aspectRatio: ratio }]}>
      <View style={{ width: '62%', height: '62%' }}><Figure name={fig} color={c.pinkDeep} bg={c.bg} /></View>
      {tag ? <Text style={[s.tag, { backgroundColor: c.surface, color: c.ink }]}>{tag.toUpperCase()}</Text> : null}
      {dur ? <Text style={s.dur}>{dur}</Text> : null}
    </View>
  );
}
const s = StyleSheet.create({
  thumb: { borderRadius: 20, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', width: '100%' },
  tag: { position: 'absolute', left: 8, top: 8, fontSize: 10.5, fontWeight: '700', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 999, overflow: 'hidden', letterSpacing: 0.5 },
  dur: { position: 'absolute', right: 8, bottom: 8, backgroundColor: 'rgba(58,10,32,.75)', color: '#fff', fontSize: 11, fontWeight: '600', paddingVertical: 2, paddingHorizontal: 7, borderRadius: 6, overflow: 'hidden' },
});
