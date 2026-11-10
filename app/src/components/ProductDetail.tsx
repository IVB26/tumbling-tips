import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '../ThemeContext';
import { fonts } from '../theme';
import { PURCHASES_ENABLED } from '../config';
import { canBuy, canGetFree, priceLabel } from '../lib/purchases';
import type { Product } from '../data/catalog';
import Thumb from './Thumb';

export default function ProductDetail({ p, owned, onBack, onBuy }: { p: Product; owned: boolean; onBack: () => void; onBuy: () => void }) {
  const c = useColors();
  const free = owned || p.price === 0;
  const preview = free ? p.steps.length : 2;
  return (
    <View style={{ gap: 18 }}>
      <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Back"><Text style={{ color: c.ink2, fontFamily: fonts.bodyBold }}>‹ Back</Text></Pressable>
      <Thumb fig={p.fig} tint={p.tint} tag={p.type} ratio={1.6} />
      <View style={{ gap: 10 }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 26, color: c.ink, lineHeight: 28 }}>{p.title}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {[p.type, p.age, p.level, p.dur].map(f => (
            <Text key={f} style={[s.fact, { backgroundColor: c.blush, color: c.pinkDeep }]}>{f}</Text>
          ))}
        </View>
        <Text style={{ color: c.ink2, fontFamily: fonts.body }}>{p.desc}</Text>
      </View>
      <View>
        <View style={s.sec}><Text style={[s.h3, { color: c.ink }]}>{p.list}</Text><Text style={{ color: c.ink2 }}>{p.steps.length}</Text></View>
        {p.steps.map((st, i) => {
          const locked = i >= preview;
          return (
            <View key={st[0]} style={[s.step, { borderTopColor: c.line, borderTopWidth: i ? 1 : 0 }]}>
              <View style={[s.num, { backgroundColor: c.blush }]}><Text style={{ fontFamily: fonts.display, color: c.pinkDeep }}>{i + 1}</Text></View>
              <View style={{ flex: 1, opacity: locked ? 0.35 : 1 }}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14.5, color: c.ink }}>{locked ? '🔒 ' : ''}{st[0]}</Text>
                {locked ? null : <Text style={{ fontSize: 13, color: c.ink2, fontFamily: fonts.body }}>{st[1]}</Text>}
              </View>
              {locked || !st[2] ? null : <Text style={{ fontSize: 12, color: c.ink2, fontFamily: fonts.bodyBold }}>{st[2]}</Text>}
            </View>
          );
        })}
        {free ? null : <Text style={{ textAlign: 'center', color: c.ink2, fontSize: 13, paddingTop: 6, fontFamily: fonts.body }}>{PURCHASES_ENABLED ? `Buy to unlock all ${p.steps.length}` : 'The rest of this is coming in a future update.'}</Text>}
      </View>
      <View style={[s.buybar, { borderTopColor: c.line }]}>
        <Text style={{ fontFamily: fonts.display, fontSize: 24, color: c.ink }}>{priceLabel(p.price, owned)}</Text>
        {canBuy(p.price, owned) || canGetFree(p.price, owned) ? (
          <Pressable onPress={onBuy} style={[s.btn, { backgroundColor: c.pink }]}>
            <Text style={{ color: c.onPink, fontFamily: fonts.bodyBold }}>{p.price === 0 ? 'Get for free' : 'Buy'}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  sec: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 },
  h3: { fontFamily: fonts.display, fontSize: 19 },
  btn: { borderRadius: 999, paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center' },
  fact: { fontSize: 12.5, fontWeight: '600', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8, overflow: 'hidden' },
  step: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', paddingVertical: 12 },
  num: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  buybar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, paddingTop: 12 },
});
