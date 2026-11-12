import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../ThemeContext';
import { fonts } from '../theme';
import { SKILLS, SKILL_LEVELS, Skill } from '../data/skills';
import Figure from '../components/Figure';
import SkillPlayer from '../components/SkillPlayer';
import { useOwned } from '../OwnedContext';
import { FULL_CATALOGUE } from '../config';

export default function SkillsScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { owned, unlock } = useOwned();  // shared with the Explore tab
  const [level, setLevel] = useState<string>('All');
  const [open, setOpen] = useState<Skill | null>(null);
  const levels = useMemo(() => [...SKILL_LEVELS.filter(l => SKILLS.some(s => s.level === l)), 'All'], []);
  const shown = SKILLS.filter(s => level === 'All' || s.level === level);
  const tint = (n: number) => [c.petal, c.blush, c.petal, c.blush][n % 4];

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ padding: 18, paddingTop: insets.top + 12, gap: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Text style={{ fontFamily: fonts.display, fontSize: 26, color: c.ink }}>Skills</Text>
          <Text style={{ color: c.ink2, fontFamily: fonts.body }}>{shown.length} skills</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} accessibilityRole="tablist">
          {levels.map(l => (
            <Pressable key={l} accessibilityState={{ selected: l === level }} onPress={() => setLevel(l)}
              style={[s.chip, { borderColor: l === level ? c.ink : c.line, backgroundColor: l === level ? c.ink : c.surface }]}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: l === level ? c.bg : c.ink }}>{l}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <View>
          {shown.map((k, i) => (
            <Pressable key={k.id} accessibilityRole="button" onPress={() => setOpen(k)} style={[s.row, { borderTopColor: c.line, borderTopWidth: i === 0 ? 0 : 1 }]}>
              <View style={[s.thumb, { backgroundColor: tint(k.tint) }]}><Figure name={k.fig} color={c.pinkDeep} bg={c.bg} size="70%" /></View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15.5, color: c.ink }}>{k.title}</Text>
                <Text style={{ color: c.ink2, fontSize: 12.5, fontFamily: fonts.body }}>{k.breakdown.length} steps{FULL_CATALOGUE ? ` · ${k.drills.length} drills · ${k.tips.length} tips` : ''}</Text>
                {owned.includes(k.id)
                  ? <Text style={{ color: c.good, fontFamily: fonts.bodyBold, fontSize: 12.5 }}>Unlocked</Text>
                  : <Text style={{ color: c.ink2, fontSize: 12.5, fontFamily: fonts.body }}>{FULL_CATALOGUE ? `${k.level} · breakdown free` : k.level}</Text>}
              </View>
              <Text style={{ color: c.ink2, fontSize: 20 }}>›</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <SkillPlayer skill={open} owned={!!open && owned.includes(open.id)} onClose={() => setOpen(null)} onUnlock={unlock} />
    </View>
  );
}

const s = StyleSheet.create({
  chip: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1.5 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 },
  thumb: { width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
