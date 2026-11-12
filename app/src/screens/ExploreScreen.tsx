import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../ThemeContext';
import { fonts } from '../theme';
import { useOwned } from '../OwnedContext';
import { audiencesShown, byId, filterTypes, gridItems, heroFor, levelGroupLabel, levelGuides, topicGuides, ultIncluded, ultWorth, type Product } from '../lib/catalog';
import { SKILLS, type Skill } from '../data/skills';
import { money } from '../lib/player';
import { FULL_CATALOGUE, PURCHASES_ENABLED } from '../config';
import { priceLabel } from '../lib/purchases';
import Figure from '../components/Figure';
import Thumb from '../components/Thumb';
import ProductDetail from '../components/ProductDetail';
import HelpSheet, { HELP_ACTIONS, type HelpKind } from '../components/HelpSheet';
import SkillPlayer from '../components/SkillPlayer';

type Aud = 'parent' | 'coach';

export default function ExploreScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { owns, unlock } = useOwned();
  const [aud, setAud] = useState<Aud>('parent');
  const [filter, setFilter] = useState('All');
  const [open, setOpen] = useState<Product | null>(null);
  const [group, setGroup] = useState(false);          // the Skill Explained page (six level guides under one entry)
  const [sheet, setSheet] = useState<HelpKind | null>(null);
  const [player, setPlayer] = useState<Skill | null>(null);
  const { owned } = useOwned();

  const switchAud = (a: Aud) => { setAud(a); setFilter('All'); setOpen(null); setGroup(false); };
  const openFromSheet = (id: string) => { setSheet(null); setGroup(false); setOpen(byId(id) ?? null); };
  const types = filterTypes(aud);
  const items = gridItems(aud, types.includes(filter) ? filter : 'All');
  const hero = heroFor(aud), heroP = hero ? byId(hero.id)! : null;
  const auds = audiencesShown();   // the Parents/Coaches switch only appears when both have something to show
  const ult = byId('g1')!;

  return (
    <ScrollView style={{ backgroundColor: c.bg }} contentContainerStyle={{ padding: 18, paddingTop: insets.top + 12, gap: 22 }}>
      <View style={s.top}>
        <Text style={{ fontFamily: fonts.display, fontSize: 17, color: c.pink, lineHeight: 18 }}>Tayah’s{'\n'}Tumble Tips</Text>
        {auds.length > 1 ? <View style={[s.mode, { backgroundColor: c.blush }]} accessibilityRole="tablist">
          {(['parent', 'coach'] as Aud[]).map(a => (
            <Pressable key={a} accessibilityRole="tab" accessibilityState={{ selected: aud === a }} onPress={() => switchAud(a)}
              style={[s.modeBtn, aud === a && { backgroundColor: c.pink }]}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: aud === a ? c.onPink : c.ink2 }}>{a === 'parent' ? 'Parents' : 'Coaches'}</Text>
            </Pressable>
          ))}
        </View> : null}
      </View>

      {open ? <ProductDetail p={open} owned={owns(open.id)} onBack={() => setOpen(null)} onBuy={() => unlock(open.id)} />
        : group ? (
        <View style={{ gap: 18 }}>
          <Pressable onPress={() => setGroup(false)} accessibilityRole="button" accessibilityLabel="Back"><Text style={{ color: c.ink2, fontFamily: fonts.bodyBold }}>‹ Back</Text></Pressable>
          <View style={{ gap: 10 }}>
            <Text style={{ fontFamily: fonts.display, fontSize: 26, color: c.ink, lineHeight: 28 }}>Skill Explained</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {['Guide', 'For parents', `${levelGuides().length} levels`].map(f => <Text key={f} style={[s.fact, { backgroundColor: c.blush, color: c.pinkDeep }]}>{f}</Text>)}
            </View>
            <Text style={{ color: c.ink2, fontFamily: fonts.body }}>What every skill is, its key phases and why it matters. There’s a separate guide for each level, so you only need the levels your child is working on.</Text>
          </View>
          <View>
            <View style={s.sec}><Text style={[s.h3, { color: c.ink }]}>Choose a level</Text><Text style={{ color: c.ink2 }}>{PURCHASES_ENABLED ? `${money(levelGuides()[0].price)} each` : 'Coming soon'}</Text></View>
            {levelGuides().map((p, i) => (
              <Pressable key={p.id} onPress={() => setOpen(p)} accessibilityRole="button" style={[s.row, { borderTopColor: c.line, borderTopWidth: i ? 1 : 0 }]}>
                <View style={{ width: 56 }}><Thumb fig={p.fig} tint={p.tint} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: c.ink }}>{p.title.replace('Skill Explained: ', '')}</Text>
                  <Text numberOfLines={2} style={{ color: c.ink2, fontSize: 12.5, fontFamily: fonts.body }}>{p.steps.length} skills · {p.steps.map(x => x[0]).join(', ')}</Text>
                </View>
                <Text style={{ fontFamily: fonts.bodyBold, color: c.pinkDeep }}>{priceLabel(p.price, owns(p.id))}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : (
        <>
          {hero && heroP ? <View style={[s.hero, { backgroundColor: c.pink }]}>
            <View style={s.arc}><Figure name={heroP.fig} color="rgba(255,255,255,.35)" /></View>
            <Text style={s.eyebrow}>{hero.eyebrow.toUpperCase()}</Text>
            <Text style={[s.heroTitle, { fontFamily: fonts.display }]}>{hero.title}</Text>
            <Text style={s.heroBody}>{hero.body}</Text>
            <Pressable onPress={() => setOpen(heroP)} style={s.heroBtn}><Text style={{ color: '#B5124F', fontFamily: fonts.bodyBold }}>View</Text></Pressable>
          </View> : null}

          {aud === 'parent' ? (
            <>
              <View style={{ gap: 10 }}>
                <View style={s.sec}><Text style={[s.h3, { color: c.ink }]}>Free help for parents</Text><Text style={{ color: c.ink2 }}>Tap a card</Text></View>
                <View style={s.helpGrid}>
                  {HELP_ACTIONS.map(([k, title, sub]) => (
                    <Pressable key={k} accessibilityRole="button" onPress={() => setSheet(k)} style={[s.help, { backgroundColor: c.blush }]}>
                      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: c.ink }}>{title}</Text>
                      <Text style={{ fontSize: 12, color: c.ink2, fontFamily: fonts.body, lineHeight: 16 }}>{sub}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {FULL_CATALOGUE ? <>
              <View style={[s.pg, { backgroundColor: c.surface, borderColor: c.line }]}>
                <Text style={{ color: c.pinkDeep, fontSize: 11, fontFamily: fonts.bodyBold, letterSpacing: 1 }}>FOR PARENTS · BEST VALUE</Text>
                <Text style={{ fontFamily: fonts.display, fontSize: 23, color: c.ink, lineHeight: 25 }}>The Ultimate Parent’s Guide</Text>
                <Text style={{ color: c.ink2, fontFamily: fonts.body }}>{ultIncluded().length} parent resources in one guide{PURCHASES_ENABLED ? `, worth $${ultWorth().toFixed(2)} bought separately` : ''}.</Text>
                {ultIncluded().map(p => (
                  <View key={p.id} style={[s.listRow, { borderTopColor: c.line }]}>
                    <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: c.ink }}>{p.title}</Text>
                    <Text style={{ fontSize: 12.5, color: c.ink2, fontFamily: fonts.body }}>{p.desc}</Text>
                  </View>
                ))}
                <Pressable onPress={() => setOpen(ult)} style={[s.btn, { backgroundColor: c.pink }]}>
                  <Text style={{ color: c.onPink, fontFamily: fonts.bodyBold }}>
                    {owns('g1') ? 'Open the Ultimate Parent’s Guide' : PURCHASES_ENABLED ? `Get all ${ultIncluded().length} · ${money(ult.price)} (save $${(ultWorth() - ult.price).toFixed(2)})` : 'View the Ultimate Parent’s Guide'}
                  </Text>
                </Pressable>
              </View>

              <View>
                <View style={s.sec}><Text style={[s.h3, { color: c.ink }]}>Parent guides</Text><Text style={{ color: c.ink2 }}>{topicGuides().length + 1} guides</Text></View>
                <Pressable onPress={() => setGroup(true)} accessibilityRole="button" accessibilityLabel="Skill Explained" style={[s.row, { borderTopWidth: 0 }]}>
                  <View style={{ width: 56 }}><Thumb fig={levelGuides()[0].fig} tint={levelGuides()[0].tint} /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: c.ink }}>Skill Explained</Text>
                    <Text numberOfLines={2} style={{ color: c.ink2, fontSize: 12.5, fontFamily: fonts.body }}>A guide for each level, from Novice to Level 5.</Text>
                  </View>
                  <Text style={{ fontFamily: fonts.bodyBold, color: c.pinkDeep }}>{levelGroupLabel(owns)}</Text>
                </Pressable>
                {topicGuides().map((p, i) => (
                  <Pressable key={p.id} onPress={() => setOpen(p)} style={[s.row, { borderTopColor: c.line, borderTopWidth: 1 }]}>
                    <View style={{ width: 56 }}><Thumb fig={p.fig} tint={p.tint} /></View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: c.ink }}>{p.title}</Text>
                      <Text numberOfLines={2} style={{ color: c.ink2, fontSize: 12.5, fontFamily: fonts.body }}>{p.desc}</Text>
                    </View>
                    <Text style={{ fontFamily: fonts.bodyBold, color: c.pinkDeep }}>{priceLabel(p.price, owns(p.id))}</Text>
                  </Pressable>
                ))}
              </View>
              </> : null}
            </>
          ) : null}

          {types.length > 2 ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} accessibilityRole="tablist">
            {types.map(t => {
              const on = t === (types.includes(filter) ? filter : 'All');
              return (
                <Pressable key={t} accessibilityState={{ selected: on }} onPress={() => setFilter(t)}
                  style={[s.chip, { borderColor: on ? c.ink : c.line, backgroundColor: on ? c.ink : c.surface }]}>
                  <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: on ? c.bg : c.ink }}>{t}</Text>
                </Pressable>
              );
            })}
          </ScrollView> : null}

          {items.length > 0 ? <View style={{ gap: 12 }}>
            <View style={s.sec}><Text style={[s.h3, { color: c.ink }]}>{!FULL_CATALOGUE ? 'Free tips' : aud === 'parent' ? 'For parents' : 'For coaches'}</Text><Text style={{ color: c.ink2 }}>{FULL_CATALOGUE ? `${items.length} products` : items.length}</Text></View>
            <View style={s.grid}>
              {items.map(p => (
                <Pressable key={p.id} accessibilityRole="button" onPress={() => setOpen(p)} style={s.card}>
                  <Thumb fig={p.fig} tint={p.tint} tag={p.type} dur={p.dur} />
                  <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: c.ink }}>{p.title}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: c.ink2, fontSize: 12.5, fontFamily: fonts.body }}>{p.level}</Text>
                    <Text style={{ fontFamily: fonts.bodyBold, color: c.pinkDeep }}>{priceLabel(p.price, owns(p.id))}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View> : null}
        </>
      )}
      <HelpSheet kind={sheet} owns={owns} onClose={() => setSheet(null)} onOpenGuide={openFromSheet} onWatchSkill={id => { setSheet(null); setPlayer(SKILLS.find(k => k.id === id) ?? null); }} />
      <SkillPlayer skill={player} owned={!!player && owned.includes(player.id)} onClose={() => setPlayer(null)} onUnlock={unlock} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mode: { flexDirection: 'row', borderRadius: 999, padding: 3 },
  modeBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999 },
  hero: { borderRadius: 26, padding: 20, gap: 10, overflow: 'hidden' },
  arc: { position: 'absolute', right: -30, bottom: -40, width: 190, height: 190 },
  eyebrow: { color: '#fff', opacity: 0.85, fontSize: 11, letterSpacing: 1.2, fontWeight: '700' },
  heroTitle: { color: '#fff', fontSize: 26, lineHeight: 27, maxWidth: 220 },
  heroBody: { color: '#fff', opacity: 0.92, fontSize: 14, maxWidth: 230 },
  heroBtn: { alignSelf: 'flex-start', backgroundColor: '#fff', paddingVertical: 9, paddingHorizontal: 16, borderRadius: 999 },
  pg: { borderWidth: 1.5, borderRadius: 26, padding: 18, gap: 12 },
  listRow: { borderTopWidth: 1, paddingVertical: 8 },
  btn: { borderRadius: 999, paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center' },
  sec: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 },
  h3: { fontFamily: fonts.display, fontSize: 19 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  helpGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  help: { width: '48.5%', flexGrow: 1, borderRadius: 18, padding: 12, gap: 4 },
  fact: { fontSize: 12.5, fontWeight: '600', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8, overflow: 'hidden' },
  chip: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '47.5%', flexGrow: 1, gap: 8 },
});
