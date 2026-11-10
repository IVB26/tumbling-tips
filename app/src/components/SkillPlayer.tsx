import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../ThemeContext';
import { fonts } from '../theme';
import type { Skill } from '../data/skills';
import Figure from './Figure';
import { SECTIONS, Section, goTo, mm2, mmss, money, playlist, startState, tick } from '../lib/player';
import { PURCHASES_ENABLED } from '../config';

type Props = { skill: Skill | null; owned: boolean; onClose: () => void; onUnlock: (id: string) => void };

export default function SkillPlayer({ skill, owned, onClose, onUnlock }: Props) {
  return (
    <Modal visible={!!skill} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      {skill ? <Player skill={skill} owned={owned} onClose={onClose} onUnlock={onUnlock} /> : null}
    </Modal>
  );
}

function Player({ skill, owned, onClose, onUnlock }: Omit<Props, 'skill'> & { skill: Skill }) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const pl = useMemo(() => playlist(skill, owned), [skill, owned]);
  const [s, setS] = useState(() => startState(pl));
  const [view, setView] = useState<Section>('breakdown');
  const cur = pl[Math.min(s.pos, pl.length - 1)];

  // Keep the visible tab following the clip that is playing
  useEffect(() => { setView(cur.sec); }, [cur.sec, s.pos]);
  // Unlocking changes the playlist length, so keep the position valid
  useEffect(() => { setS(p => (p.pos >= pl.length ? goTo(p, pl, pl.length - 1) : p)); }, [pl]);
  useEffect(() => {
    if (!s.playing) return;
    const t = setInterval(() => setS(p => tick(p, pl)), 1000);
    return () => clearInterval(t);
  }, [s.playing, pl]);

  const items = skill[cur.sec];
  const locked = view !== 'breakdown' && !owned;
  const label = SECTIONS.find(x => x[0] === cur.sec)![1];
  const progress = 1 - s.left / cur.len;
  const tintBg = c.petal;

  return (
    <View style={{ flex: 1, backgroundColor: c.surface }}>
      <Pressable accessibilityLabel={s.playing ? 'Pause' : 'Play'} onPress={() => setS(p => ({ ...p, playing: !p.playing }))}
        style={[st.vid, { paddingTop: insets.top }]}>
        <View style={st.vfig}><Figure name={skill.fig} color="#FFC2D9" /></View>
        <Text style={[st.vtag, { top: insets.top + 20 }]}>{skill.title}</Text>
        <Pressable accessibilityLabel="Close" onPress={onClose} style={[st.vclose, { top: insets.top + 12 }]}><Text style={{ color: '#fff', fontSize: 18 }}>✕</Text></Pressable>
        <View style={st.cap}>
          <Text style={st.capSec}>{label.toUpperCase()} · {cur.i + 1} OF {items.length}</Text>
          <Text style={st.capTitle}>{cur.name}</Text>
          <Text style={st.capCue}>{cur.cue}</Text>
        </View>
        <View style={st.vplay}><Text style={{ color: '#fff', fontSize: 18 }}>{s.playing ? '❚❚' : '▶'}</Text></View>
      </Pressable>

      <ScrollView style={[st.sheet, { backgroundColor: c.surface }]} contentContainerStyle={{ padding: 18, gap: 14, paddingBottom: insets.bottom + 24 }}>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {items.map((_, i) => (
            <View key={i} style={[st.seg, { backgroundColor: c.line }]}>
              <View style={{ height: 6, backgroundColor: c.pink, width: `${(i < cur.i ? 1 : i === cur.i ? progress : 0) * 100}%` }} />
            </View>
          ))}
        </View>

        <View style={st.clock}>
          <View><Text style={{ fontFamily: fonts.bodyBold, fontSize: 16, color: c.ink }}>{mm2(s.elapsed)}</Text><Text style={[st.cl, { color: c.ink2 }]}>ELAPSED</Text></View>
          <Text style={{ fontFamily: fonts.display, fontSize: 44, color: c.ink }} accessibilityLabel={`${s.left} seconds left`}>{mmss(s.left)}</Text>
          <View style={{ alignItems: 'flex-end' }}><Text style={{ fontFamily: fonts.bodyBold, fontSize: 16, color: c.ink }}>{s.pos + 1}/{pl.length}</Text><Text style={[st.cl, { color: c.ink2 }]}>CLIP</Text></View>
        </View>
        {s.finished ? <Text style={{ textAlign: 'center', color: c.good, fontFamily: fonts.bodyBold }}>{owned ? 'Skill complete' : 'Breakdown complete'}</Text> : null}

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable disabled={s.pos === 0} onPress={() => setS(p => goTo(p, pl, p.pos - 1))} style={[st.pn, { borderColor: c.line, opacity: s.pos === 0 ? 0.4 : 1 }]}><Text style={[st.pnText, { color: c.ink }]}>PREV</Text></Pressable>
          <Pressable disabled={s.pos === pl.length - 1} onPress={() => setS(p => goTo(p, pl, p.pos + 1))} style={[st.pn, { backgroundColor: c.pink, borderColor: c.pink, opacity: s.pos === pl.length - 1 ? 0.4 : 1 }]}><Text style={[st.pnText, { color: c.onPink }]}>NEXT</Text></Pressable>
        </View>

        <View style={[st.tabs, { backgroundColor: c.blush }]} accessibilityRole="tablist">
          {SECTIONS.map(([k, l]) => (
            <Pressable key={k} accessibilityRole="tab" accessibilityState={{ selected: view === k }} onPress={() => setView(k)}
              style={[st.tab, view === k && { backgroundColor: c.surface }]}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: view === k ? c.pinkDeep : c.ink2 }}>{l}{k !== 'breakdown' && !owned ? ' 🔒' : ''}</Text>
            </Pressable>
          ))}
        </View>

        {locked ? (
          <View style={[st.unlock, { backgroundColor: c.blush }]}>
            <Text style={{ fontFamily: fonts.bodyBold, color: c.ink }}>{PURCHASES_ENABLED ? 'Unlock drills and tips' : 'Drills and tips are coming soon'}</Text>
            <Text style={{ color: c.ink2, fontSize: 13, fontFamily: fonts.body }}>
              {PURCHASES_ENABLED ? `${skill.drills.length} drills and ${skill.tips.length} tips for the ${skill.title.toLowerCase()}. The breakdown stays free.`
                : `${skill.drills.length} drills and ${skill.tips.length} tips for the ${skill.title.toLowerCase()} will be added in a future update. The breakdown is free.`}
            </Text>
            {PURCHASES_ENABLED ? (
              <Pressable onPress={() => onUnlock(skill.id)} style={[st.btn, { backgroundColor: c.pink }]}>
                <Text style={{ color: c.onPink, fontFamily: fonts.bodyBold }}>Unlock · {money(skill.price)}</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        <View style={{ gap: 8 }}>
          {skill[view].map((clip, i) => {
            const idx = pl.findIndex(x => x.sec === view && x.i === i);
            const isCur = view === cur.sec && i === cur.i;
            return (
              <Pressable key={clip[0]} disabled={locked} onPress={() => setS(p => ({ ...goTo(p, pl, idx), playing: true }))}
                style={[st.pitem, { backgroundColor: isCur ? c.blush : c.bg, borderColor: isCur ? c.pink : 'transparent', opacity: locked ? 0.55 : 1 }]}>
                <View style={[st.pthumb, { backgroundColor: tintBg }]}><Figure name={skill.fig} color={c.pinkDeep} bg={c.bg} size="70%" /></View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: c.ink }}>{clip[0]}</Text>
                  <Text style={{ fontSize: 12.5, color: c.ink2, fontFamily: fonts.body }}>{clip[1]} · {mmss(clip[2])}</Text>
                </View>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, color: c.pinkDeep }}>{locked ? '🔒' : isCur ? 'Now' : ''}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  vid: { flex: 0.46, backgroundColor: '#3A0A20', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  vfig: { width: '45%', height: '55%', marginBottom: 40 },
  vtag: { position: 'absolute', left: 16, color: '#FFC2D9', fontWeight: '700', fontSize: 13 },
  vclose: { position: 'absolute', right: 14, width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,.2)', alignItems: 'center', justifyContent: 'center' },
  cap: { position: 'absolute', left: 16, right: 78, bottom: 32 },
  capSec: { color: '#FFC2D9', fontSize: 11, letterSpacing: 1, fontWeight: '700' },
  capTitle: { color: '#fff', fontSize: 22, fontFamily: fonts.display, lineHeight: 24 },
  capCue: { color: '#fff', opacity: 0.85, fontSize: 13 },
  vplay: { position: 'absolute', right: 16, bottom: 32, width: 48, height: 48, borderRadius: 24, backgroundColor: '#E6246E', alignItems: 'center', justifyContent: 'center' },
  sheet: { flex: 0.54, borderTopLeftRadius: 22, borderTopRightRadius: 22, marginTop: -18 },
  seg: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  clock: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cl: { fontSize: 10.5, letterSpacing: 0.8, fontWeight: '600' },
  pn: { flex: 1, borderWidth: 1.5, borderRadius: 999, paddingVertical: 12, alignItems: 'center' },
  pnText: { fontFamily: fonts.bodyBold, fontSize: 13, letterSpacing: 1 },
  tabs: { flexDirection: 'row', borderRadius: 999, padding: 3 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 999, alignItems: 'center' },
  unlock: { borderRadius: 18, padding: 14, gap: 8, alignItems: 'flex-start' },
  btn: { borderRadius: 999, paddingVertical: 12, paddingHorizontal: 20 },
  pitem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 8, borderRadius: 16, borderWidth: 1.5 },
  pthumb: { width: 52, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
