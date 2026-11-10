import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColors } from '../ThemeContext';
import { fonts } from '../theme';
import { SKILLS } from '../data/skills';
import { byId } from '../lib/catalog';
import { money } from '../lib/player';
import { addMilestone, type Milestone } from '../lib/milestones';

export type HelpKind = 'skill' | 'correction' | 'support' | 'celebrate';
export const HELP_ACTIONS: [HelpKind, string, string][] = [
  ['skill', 'Understand the skill', 'Learn what a round-off is and why it matters for tumbling.'],
  ['correction', 'Understand the correction', 'Learn what your coach means when they ask for a tighter body shape.'],
  ['support', 'Support your child', 'Get suggestions for encouraging effort and handling frustration.'],
  ['celebrate', 'Celebrate progress', 'Record a milestone or write down something your child felt proud of.'],
];
// Each free card ends with a link to the guide that covers it in full.
const GUIDE_FOR: Record<HelpKind, string> = { skill: 'se1', correction: 'g14', support: 'g16', celebrate: 'g15' };
const TITLES: Record<HelpKind, string> = { skill: 'The round-off', correction: '"Tighter body shape"', support: 'Support your child', celebrate: 'Celebrate progress' };

const MILES_KEY = 'tt-milestones';
type Props = { kind: HelpKind | null; owns: (id: string) => boolean; onClose: () => void; onOpenGuide: (id: string) => void; onWatchSkill: (id: string) => void };

export default function HelpSheet({ kind, owns, onClose, onOpenGuide, onWatchSkill }: Props) {
  const c = useColors();
  const [miles, setMiles] = useState<Milestone[]>([]);
  const [text, setText] = useState('');
  useEffect(() => { AsyncStorage.getItem(MILES_KEY).then(r => { if (r) setMiles(JSON.parse(r)); }).catch(() => {}); }, []);
  const save = () => {
    const next = addMilestone(miles, text);
    if (next === miles) return;
    setMiles(next); setText(''); AsyncStorage.setItem(MILES_KEY, JSON.stringify(next)).catch(() => {});
  };

  const Sec = ({ title, children, first }: { title?: string; children: React.ReactNode; first?: boolean }) => (
    <View style={[s.sec, { borderTopColor: c.line, borderTopWidth: first ? 0 : 1, paddingTop: first ? 0 : 14 }]}>
      {title ? <Text style={{ fontFamily: fonts.display, fontSize: 16, color: c.pinkDeep }}>{title}</Text> : null}
      {children}
    </View>
  );
  const P = ({ children }: { children: React.ReactNode }) => <Text style={{ fontSize: 14, color: c.ink, fontFamily: fonts.body, lineHeight: 20 }}>{children}</Text>;
  const Li = ({ children }: { children: React.ReactNode }) => <Text style={{ fontSize: 14, color: c.ink, fontFamily: fonts.body, lineHeight: 20 }}>•  {children}</Text>;
  const B = ({ children }: { children: React.ReactNode }) => <Text style={{ fontFamily: fonts.bodyBold }}>{children}</Text>;

  const gid = kind ? GUIDE_FOR[kind] : null, guide = gid ? byId(gid) : null;
  const cta = guide && gid ? (
    <Pressable onPress={() => onOpenGuide(gid)} style={[s.btn, { backgroundColor: gid === 'se1' ? c.blush : c.pink }]}>
      <Text style={{ color: gid === 'se1' ? c.pinkDeep : c.onPink, fontFamily: fonts.bodyBold, textAlign: 'center' }}>
        {owns(gid) ? `Open ${guide.title}` : `Want more? Get ${guide.title} · ${money(guide.price)}`}
      </Text>
    </Pressable>
  ) : null;
  const r = SKILLS.find(k => k.id === 's5')!;

  return (
    <Modal visible={!!kind} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.backdrop}>
        <View style={[s.card, { backgroundColor: c.surface }]} accessibilityViewIsModal>
          <View style={[s.head, { backgroundColor: c.surface }]}>
            <Text style={{ fontFamily: fonts.display, fontSize: 21, color: c.ink, flex: 1 }}>{kind ? TITLES[kind] : ''}</Text>
            <Pressable onPress={onClose} accessibilityLabel="Close" style={[s.close, { backgroundColor: c.blush }]}><Text style={{ color: c.pinkDeep, fontSize: 16 }}>✕</Text></Pressable>
          </View>
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
            {kind === 'skill' ? (<>
              <Sec first><P>A round-off looks like a cartwheel, but the legs snap together at the top and the gymnast lands on two feet facing back the way they came.</P></Sec>
              <Sec title="Why it matters"><P>It turns running speed into backward power. That is why most tumbling passes start with one, like a round-off back handspring or a round-off back sault.</P></Sec>
              <Sec title="The key phases">{r.breakdown.map(b => <Li key={b[0]}><B>{b[0]}:</B> {b[1].toLowerCase()}</Li>)}</Sec>
              <Pressable onPress={() => onWatchSkill('s5')} style={[s.btn, { backgroundColor: c.pink }]}><Text style={{ color: c.onPink, fontFamily: fonts.bodyBold, textAlign: 'center' }}>Watch the round-off breakdown</Text></Pressable>
            </>) : null}
            {kind === 'correction' ? (<>
              <Sec first title="What it means"><P>The coach wants your child to squeeze their muscles so the whole body moves as one piece: tummy tight, ribs in, bottom tucked under, legs together and toes pointed. Coaches often call this a hollow shape.</P></Sec>
              <Sec title="Why it matters">
                <Li>A tight body is easier to rotate and control.</Li><Li>Landings are safer because nothing bends or collapses.</Li>
                <Li>Power from the floor travels through the body instead of leaking out.</Li><Li>Skills look cleaner, which scores better in competition.</Li>
              </Sec>
              <Sec title="Words you might hear"><P>"Squeeze", "hollow", "ribs in", "tight tummy", "glue your legs together".</P></Sec>
              <Sec title="Try at home"><P>Hollow hold game: lie on the back, lift arms and legs a little off the floor, and see who can hold the shape longest.</P></Sec>
            </>) : null}
            {kind === 'support' ? (<>
              <Sec first title="Praise the effort"><Li>"I saw how hard you worked on your round-off."</Li><Li>"You kept trying even when it was tricky."</Li><Li>"Your body shape looked tighter today."</Li></Sec>
              <Sec title="When frustration hits">
                <Li>Name the feeling: "It's annoying when a skill won't come."</Li><Li>Take a short break before trying again.</Li>
                <Li>Go back a step to a drill they can already do.</Li><Li>Remind them what they couldn't do a month ago.</Li>
              </Sec>
              <Sec title="Leave the coaching to the coach"><P>Ask "What did you enjoy today?" rather than correcting technique. If you're unsure what they're working on, ask the coach.</P></Sec>
            </>) : null}
            {kind === 'celebrate' ? (<>
              <Sec first><P>Record a milestone, or write down something your child felt proud of.</P></Sec>
              <View style={[s.form, { backgroundColor: c.bg, borderColor: c.line }]}>
                <Text style={{ fontSize: 12, fontFamily: fonts.bodyBold, letterSpacing: 0.6, color: c.ink2 }}>MILESTONE</Text>
                <TextInput value={text} onChangeText={setText} multiline maxLength={140} placeholder="e.g. First round-off on the floor without help" placeholderTextColor={c.ink2}
                  accessibilityLabel="Milestone" style={[s.input, { borderColor: c.line, color: c.ink, backgroundColor: c.surface }]} />
                <Pressable onPress={save} disabled={!text.trim()} style={[s.btn, { backgroundColor: c.pink, opacity: text.trim() ? 1 : 0.55, marginTop: 0 }]}>
                  <Text style={{ color: c.onPink, fontFamily: fonts.bodyBold, textAlign: 'center' }}>Save milestone</Text>
                </Pressable>
              </View>
              <Sec title="Your milestones">
                {miles.length ? miles.map((m, i) => <Li key={i}><B>{m.date}:</B> {m.text}</Li>) : <Text style={{ fontSize: 12.5, color: c.ink2, fontFamily: fonts.body }}>Nothing yet. Your first milestone will show here.</Text>}
              </Sec>
            </>) : null}
            {cta}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(42,6,20,.62)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  card: { borderRadius: 24, width: '100%', maxWidth: 380, maxHeight: '90%', paddingHorizontal: 20 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 18, paddingBottom: 10 },
  close: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  sec: { gap: 8, paddingVertical: 14 },
  btn: { borderRadius: 999, paddingVertical: 12, paddingHorizontal: 20, marginTop: 10 },
  form: { borderWidth: 1.5, borderRadius: 16, padding: 14, gap: 10, marginBottom: 8 },
  input: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, minHeight: 64, fontSize: 15, textAlignVertical: 'top' },
});
