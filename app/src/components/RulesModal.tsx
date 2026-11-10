import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useColors } from '../ThemeContext';
import { fonts } from '../theme';
import { rulesSections } from '../lib/rules';

/** "How it works": the Challenge rules in short, from the same numbers the server uses. */
export default function RulesModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const c = useColors();
  const text = { fontSize: 14, color: c.ink, fontFamily: fonts.body, lineHeight: 20 } as const;
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.backdrop}>
        <View style={[s.card, { backgroundColor: c.surface }]} accessibilityViewIsModal>
          <View style={s.head}>
            <Text style={{ fontFamily: fonts.display, fontSize: 21, color: c.ink, flex: 1 }}>How it works</Text>
            <Pressable onPress={onClose} accessibilityLabel="Close" style={[s.close, { backgroundColor: c.blush }]}><Text style={{ color: c.pinkDeep, fontSize: 16 }}>✕</Text></Pressable>
          </View>
          <ScrollView contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
            {rulesSections().map((sec, i) => (
              <View key={i} style={[s.sec, { borderTopColor: c.line, borderTopWidth: i ? 1 : 0, paddingTop: i ? 14 : 0 }]}>
                {sec.title ? <Text style={{ fontFamily: fonts.display, fontSize: 16, color: c.pinkDeep }}>{sec.title}</Text> : null}
                {sec.paragraphs?.map((p, k) => <Text key={k} style={text}>{p}</Text>)}
                {sec.table ? (
                  <View style={s.table}>
                    {sec.table.map(([a, b]) => (
                      <View key={a} style={s.trow}><Text style={[text, { flex: 1 }]}>{a}</Text><Text style={{ fontFamily: fonts.bodyBold, color: c.pinkDeep, fontSize: 14 }}>{b}</Text></View>
                    ))}
                  </View>
                ) : null}
                {sec.bullets?.map((b, k) => <Text key={k} style={text}>•  {b}</Text>)}
              </View>
            ))}
          </ScrollView>
          <Pressable onPress={onClose} style={[s.btn, { backgroundColor: c.pink }]}><Text style={{ color: c.onPink, fontFamily: fonts.bodyBold, textAlign: 'center' }}>Let’s go!</Text></Pressable>
        </View>
      </View>
    </Modal>
  );
}
const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(42,6,20,.62)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  card: { borderRadius: 24, width: '100%', maxWidth: 380, maxHeight: '90%', padding: 20, paddingTop: 12 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 10 },
  close: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  sec: { gap: 8, paddingBottom: 14 },
  table: { gap: 6 },
  trow: { flexDirection: 'row', gap: 12, alignItems: 'baseline' },
  btn: { borderRadius: 999, paddingVertical: 12, paddingHorizontal: 20 },
});
