import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../ThemeContext';
import { fonts } from '../theme';
import { useOwned } from '../OwnedContext';
import { libraryItems } from '../lib/library';
import type { Product } from '../data/catalog';
import type { Skill } from '../data/skills';
import Thumb from '../components/Thumb';
import ProductDetail from '../components/ProductDetail';
import SkillPlayer from '../components/SkillPlayer';

export default function LibraryScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { owned, owns, unlock } = useOwned();
  const [product, setProduct] = useState<Product | null>(null);
  const [skill, setSkill] = useState<Skill | null>(null);
  const items = libraryItems(owned);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ padding: 18, paddingTop: insets.top + 12, gap: 16 }}>
        {product ? (
          <ProductDetail p={product} owned={owns(product.id)} onBack={() => setProduct(null)} onBuy={() => unlock(product.id)} />
        ) : (
          <>
            <Text style={{ fontFamily: fonts.display, fontSize: 26, color: c.ink }}>Library</Text>
            <Text style={{ color: c.ink2, fontFamily: fonts.body, marginTop: -8 }}>Everything you’ve unlocked, ready to watch or read.</Text>
            {items.length === 0 ? (
              <View style={{ alignItems: 'center', gap: 8, paddingVertical: 40 }}>
                <Text style={{ fontFamily: fonts.display, fontSize: 19, color: c.ink }}>Nothing here yet</Text>
                <Text style={{ color: c.ink2, textAlign: 'center', fontFamily: fonts.body }}>Unlock a skill or product and it will show up here.</Text>
              </View>
            ) : (
              <View>
                {items.map((it, i) => (
                  <Pressable key={it.id} accessibilityRole="button" accessibilityLabel={`Open ${it.title}`}
                    onPress={() => (it.kind === 'skill' ? setSkill(it.skill!) : setProduct(it.product!))}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: i ? 1 : 0, borderTopColor: c.line }}>
                    <View style={{ width: 56 }}><Thumb fig={it.fig} tint={it.tint} /></View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: c.ink }}>{it.title}</Text>
                      <Text style={{ color: c.ink2, fontSize: 12.5, fontFamily: fonts.body }}>{it.type} · {it.dur}</Text>
                    </View>
                    <Text style={{ color: c.ink2, fontFamily: fonts.bodyBold, fontSize: 13 }}>Open ›</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
      <SkillPlayer skill={skill} owned={!!skill} onClose={() => setSkill(null)} onUnlock={unlock} />
    </View>
  );
}
