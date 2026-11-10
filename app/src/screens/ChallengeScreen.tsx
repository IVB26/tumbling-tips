import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../ThemeContext';
import { fonts } from '../theme';
import { useAuth } from '../AuthContext';
import { api } from '../api';
import LoginForm from '../components/LoginForm';
import AthleteForm from '../components/AthleteForm';
import { DAYS, DAY_NAMES, MILESTONES, dayExercises, dow, finisherFor } from '../lib/challenge';

const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
type Clock = { phase: 'before' | 'open' | 'closed'; dom: number | null; lastOpenDay: number; onTimeDay: number | null };
type Day = { day: number; done: boolean; onTime: boolean; ticks: boolean[]; finisher: number | null; points: number; finisherPoints: number };
type State = { clock: Clock; days: Day[]; totalPoints: number; streak: number; multiplier: number; rank: number; entered: number };
type Row = { rank: number; name: string; pts: number; streak: number; badge: boolean; isMe: boolean };
type Board = { entered: number; top: Row[]; around: Row[]; me: Row | null; ahead: { name: string; pts: number } | null };

export default function ChallengeScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { status, token, me, athlete, selectAthlete } = useAuth();
  const [st, setSt] = useState<State | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [view, setView] = useState<'mine' | 'board'>('mine');
  const [sel, setSel] = useState(1);
  const [score, setScore] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [clock, setClock] = useState<Clock | null>(null);

  const load = useCallback(async (first = false) => {
    if (!athlete || !token) return;
    try {
      const [s, b] = await Promise.all([
        api<State>('GET', `/athletes/${athlete.id}/challenge`, token),
        api<Board>('GET', `/leaderboard?athleteId=${athlete.id}`, token),
      ]);
      setSt(s); setBoard(b); setClock(s.clock);
      if (first) setSel(Math.max(1, s.clock.lastOpenDay));
      setMsg('');
    } catch (e: any) { setMsg(e.message); }
  }, [athlete, token]);

  useEffect(() => { setSt(null); setBoard(null); if (athlete) { setLoading(true); load(true).finally(() => setLoading(false)); } }, [athlete?.id, token]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { api<Clock>('GET', '/challenge/clock').then(setClock).catch(() => {}); }, []);

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <ScrollView style={{ backgroundColor: c.bg }} contentContainerStyle={{ padding: 18, paddingTop: insets.top + 12, gap: 18 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}>
      <Hero st={st} clock={clock} />
      {children}
    </ScrollView>
  );

  if (status === 'loading') return <Shell><ActivityIndicator /></Shell>;
  if (status === 'out') return <Shell><LoginForm /></Shell>;
  if (!athlete) return <Shell><AthleteForm /></Shell>;
  if (loading && !st) return <Shell><ActivityIndicator /></Shell>;
  if (!st) return <Shell><Text style={{ color: '#C8102E', fontFamily: fonts.bodyBold }}>{msg || 'Could not load the challenge.'}</Text><Pressable onPress={() => load(true)}><Text style={{ color: c.pinkDeep, fontFamily: fonts.bodyBold }}>Try again</Text></Pressable></Shell>;

  const apply = (s: State) => { setSt(s); api<Board>('GET', `/leaderboard?athleteId=${athlete.id}`, token).then(setBoard).catch(() => {}); };
  const act = async (fn: () => Promise<State>) => { setMsg(''); try { apply(await fn()); } catch (e: any) { setMsg(e.message); load(); } };
  const base = `/athletes/${athlete.id}/challenge/days/${sel}`;

  const open = st.clock.phase === 'open';
  const d = st.days[sel - 1];
  const ex = dayExercises(sel);
  const ticks = ex.map((_, i) => !!d.ticks[i]);
  const ticked = d.done ? ex.length : ticks.filter(Boolean).length;
  const canPlay = open && sel <= st.clock.lastOpenDay;
  const fin = finisherFor(sel);

  const toggle = (i: number) => {
    const next = ticks.map((t, k) => (k === i ? !t : t));
    setSt({ ...st, days: st.days.map(x => (x.day === sel ? { ...x, ticks: next } : x)) });  // show it instantly, the server confirms
    act(() => api<State>('PUT', `${base}/ticks`, token, { ticks: next }));
  };
  const finish = () => act(() => api<State>('POST', `${base}/finish`, token, { confirm: true }));
  const logScore = () => {
    const v = parseInt(score, 10);
    if (!(v > 0)) return setMsg('Enter your score as a number');
    setScore('');
    act(() => api<State>('POST', `${base}/finisher`, token, { value: v }));
  };

  return (
    <Shell>
      {me && me.athletes.length > 1 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {me.athletes.map(a => (
            <Pressable key={a.id} onPress={() => selectAthlete(a.id)} style={[s.chip, { borderColor: a.id === athlete.id ? c.ink : c.line, backgroundColor: a.id === athlete.id ? c.ink : c.surface }]}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: a.id === athlete.id ? c.bg : c.ink }}>{a.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}

      <View style={[s.tabs, { backgroundColor: c.blush }]} accessibilityRole="tablist">
        {([['mine', 'My challenge'], ['board', 'Leaderboard']] as const).map(([k, l]) => (
          <Pressable key={k} accessibilityRole="tab" accessibilityState={{ selected: view === k }} onPress={() => setView(k)} style={[s.tab, view === k && { backgroundColor: c.surface }]}>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: view === k ? c.pinkDeep : c.ink2 }}>{l}</Text>
          </Pressable>
        ))}
      </View>
      {msg ? <Text accessibilityRole="alert" style={{ color: '#C8102E', fontFamily: fonts.bodyBold, fontSize: 13 }}>{msg}</Text> : null}

      {view === 'board' ? <BoardView board={board} athleteName={athlete.name} /> : (
        <>
          {st.clock.phase === 'before' ? (
            <View style={[s.notice, { backgroundColor: c.blush }]}><Text style={{ color: c.pinkDeep, fontFamily: fonts.bodyBold }}>The challenge starts on 1 December. You’re entered, so come back then to tick off Day 1.</Text></View>
          ) : st.clock.phase === 'closed' ? (
            <View style={[s.notice, { backgroundColor: c.blush }]}><Text style={{ color: c.pinkDeep, fontFamily: fonts.bodyBold }}>The challenge has finished. Winners are announced on 27 December.</Text></View>
          ) : null}

          <View style={s.cal}>
            {Array.from({ length: DAYS }, (_, i) => i + 1).map(k => {
              const done = st.days[k - 1].done, future = k > st.clock.lastOpenDay;
              return (
                <Pressable key={k} accessibilityRole="button" accessibilityLabel={`Day ${k}${done ? ', done' : ''}`} onPress={() => (future ? setMsg(`Day ${k} opens on ${k} December`) : setSel(k))}
                  style={[s.day, { backgroundColor: done ? c.pink : c.surface, borderColor: k === st.clock.onTimeDay ? c.pink : c.line, borderWidth: k === st.clock.onTimeDay ? 2.5 : 1.5, opacity: future ? 0.45 : 1 },
                    k === sel && { shadowColor: c.petal, shadowOpacity: 1, shadowRadius: 0, shadowOffset: { width: 0, height: 0 }, elevation: 3 }]}>
                  <Text style={{ fontFamily: fonts.display, fontSize: 17, color: done ? c.onPink : c.ink }}>{k}</Text>
                  <Text style={{ fontSize: 9, fontFamily: fonts.bodyBold, color: done ? c.onPink : c.ink2 }}>{done ? 'DONE' : k === st.clock.onTimeDay ? 'TODAY' : `${dayExercises(k).length} EX`}</Text>
                  {MILESTONES[k] ? <Text style={s.star}>★</Text> : null}
                </Pressable>
              );
            })}
          </View>

          <View style={[s.streak, { backgroundColor: c.pink }]}>
            <View><Text style={{ color: '#fff', fontSize: 40, fontFamily: fonts.display }}>{st.streak}</Text><Text style={s.streakLabel}>DAY STREAK</Text></View>
            <View style={s.mult}><Text style={{ fontFamily: fonts.display, fontSize: 32, color: c.pinkDeep }}>×{st.multiplier}</Text><Text style={{ fontSize: 11, color: c.pinkDeep, fontFamily: fonts.bodyBold }}>POINTS</Text></View>
          </View>
          <Text style={{ color: c.ink2, fontSize: 12.5, fontFamily: fonts.body, marginTop: -8 }}>Finish each day on its own date to keep your streak. Miss a day and it drops back to ×1.</Text>

          <View style={[s.panel, { backgroundColor: c.surface, borderColor: c.line }]}>
            <View style={s.row}>
              <Text style={{ fontFamily: fonts.display, fontSize: 19, color: c.ink, flex: 1 }}>Day {sel} · {DAY_NAMES[sel - 1]}</Text>
              <Text style={{ color: c.ink2, fontFamily: fonts.body }}>{ticked}/{ex.length} · {d.points} pts</Text>
            </View>
            <Text style={{ color: c.pinkDeep, fontFamily: fonts.bodyBold }}>{WD[dow(sel)]} {sel} Dec</Text>
            {ex.map((e, i) => {
              const on = d.done || ticks[i];
              return (
                <Pressable key={e.name} disabled={d.done || !canPlay} onPress={() => toggle(i)} accessibilityRole="checkbox" accessibilityState={{ checked: !!on }} style={[s.ex, { borderTopColor: c.line }]}>
                  <View style={[s.tick, { borderColor: on ? c.holly : c.line, backgroundColor: on ? c.holly : 'transparent' }]}>{on ? <Text style={{ color: '#fff', fontSize: 14 }}>✓</Text> : null}</View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14.5, color: on ? c.ink2 : c.ink, textDecorationLine: on ? 'line-through' : 'none' }}>{e.name}</Text>
                    {e.note ? <Text style={{ fontSize: 12.5, color: c.ink2, fontFamily: fonts.body }}>{e.note}</Text> : null}
                  </View>
                  <Text style={{ fontFamily: fonts.bodyBold, color: c.pinkDeep }}>{e.amt}</Text>
                </Pressable>
              );
            })}

            {d.done ? <Text style={{ color: c.holly, fontFamily: fonts.bodyBold }}>Day finished{d.onTime ? ' on the day' : ' (catch-up, no on-time bonus)'}.</Text> : (
              <>
                <Pressable disabled={!canPlay || ticked < ex.length} onPress={finish} style={[s.btn, { backgroundColor: c.pink, opacity: !canPlay || ticked < ex.length ? 0.55 : 1 }]}>
                  <Text style={{ color: c.onPink, fontFamily: fonts.bodyBold }}>{!canPlay ? 'Not open yet' : ticked < ex.length ? `Tick ${ex.length - ticked} more to finish` : `Finish day ${sel}`}</Text>
                </Pressable>
                <Text style={{ color: c.ink2, fontSize: 12, fontFamily: fonts.body }}>A parent or guardian confirms each finished day.</Text>
              </>
            )}
            {MILESTONES[sel] && !d.done ? <Text style={{ color: c.ink2, fontSize: 12.5, fontFamily: fonts.body }}>Finishing this day also wins: {MILESTONES[sel].title}</Text> : null}

            <View style={[s.finisher, { borderTopColor: c.line }]}>
              <Text style={{ fontFamily: fonts.bodyBold, color: c.ink }}>{fin.name}</Text>
              <Text style={{ color: c.ink2, fontSize: 13, fontFamily: fonts.body }}>{fin.rate}. Go all out. A parent or coach watches and counts.</Text>
              {!d.done ? <Text style={{ color: c.ink2, fontSize: 13, fontFamily: fonts.bodyBold }}>Finish the day to unlock it.</Text>
                : d.finisher != null ? <Text style={{ color: c.holly, fontFamily: fonts.bodyBold }}>Logged {d.finisher} {fin.unit === 's' ? 'seconds' : 'reps'} · +{d.finisherPoints} pts</Text>
                : st.clock.onTimeDay !== sel ? <Text style={{ color: c.ink2, fontSize: 13, fontFamily: fonts.bodyBold }}>Closed. The finisher can only be done on its own date.</Text>
                : (
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TextInput value={score} onChangeText={setScore} keyboardType="number-pad" placeholder={fin.unit === 's' ? 'Seconds' : 'Reps'} placeholderTextColor={c.ink2}
                      accessibilityLabel="Your finisher score" style={[s.input, { borderColor: c.line, color: c.ink, backgroundColor: c.bg }]} />
                    <Pressable onPress={logScore} style={[s.btn, { backgroundColor: c.pink, paddingHorizontal: 16 }]}><Text style={{ color: c.onPink, fontFamily: fonts.bodyBold }}>Log score</Text></Pressable>
                  </View>
                )}
            </View>
          </View>
        </>
      )}
    </Shell>
  );
}

function Hero({ st, clock }: { st: State | null; clock: Clock | null }) {
  const c = useColors();
  const done = st ? st.days.filter(d => d.done).length : 0;
  return (
    <View style={[s.hero, { backgroundColor: c.xmas }]}>
      <Text style={s.eyebrow}>1–24 DECEMBER · COMPETITION</Text>
      <Text style={[s.heroTitle, { fontFamily: fonts.display }]}>Christmas Strength Challenge</Text>
      <Text style={s.heroBody}>Daily strength exercises to keep your streak alive and push hard on the daily finisher.</Text>
      {st ? (
        <>
          <View style={s.bar}><View style={[s.barFill, { width: `${(done / DAYS) * 100}%` }]} /></View>
          <Text style={s.heroStat}>{done} of {DAYS} days · {st.totalPoints} pts · #{st.rank} of {st.entered}</Text>
        </>
      ) : clock?.phase === 'before' ? <Text style={s.heroStat}>Starts 1 December</Text> : null}
    </View>
  );
}

function BoardView({ board, athleteName }: { board: Board | null; athleteName: string }) {
  const c = useColors();
  if (!board) return <ActivityIndicator />;
  const row = (r: Row) => (
    <View key={`${r.rank}-${r.name}`} style={[s.lrow, { borderTopColor: c.line, backgroundColor: r.isMe ? c.blush : 'transparent' }]}>
      <Text style={{ width: 28, textAlign: 'center', fontFamily: fonts.bodyBold, color: c.ink2 }}>{r.rank}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: c.ink }}>{r.name}{r.badge ? ' ★' : ''}{r.isMe ? ' (you)' : ''}</Text>
        <Text style={{ fontSize: 12, color: c.ink2, fontFamily: fonts.body }}>{r.streak}-day streak</Text>
      </View>
      <Text style={{ fontFamily: fonts.display, fontSize: 16, color: c.ink }}>{r.pts}<Text style={{ fontSize: 11, color: c.ink2 }}> pts</Text></Text>
    </View>
  );
  return (
    <View style={{ gap: 14 }}>
      {board.me ? (
        <View style={[s.meCard, { backgroundColor: c.surface, borderColor: c.line }]}>
          <Text style={{ fontFamily: fonts.display, fontSize: 46, color: c.pink }}>#{board.me.rank}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.bodyBold, color: c.ink }}>{athleteName}</Text>
            <Text style={{ color: c.ink2, fontSize: 12.5, fontFamily: fonts.body }}>
              {board.me.pts} pts · {board.me.streak}-day streak · {board.ahead ? (board.ahead.pts === board.me.pts ? `level with ${board.ahead.name}` : `${board.ahead.pts - board.me.pts} pts behind ${board.ahead.name}`) : 'first place!'}
            </Text>
          </View>
        </View>
      ) : null}
      <View style={s.row}><Text style={{ fontFamily: fonts.display, fontSize: 19, color: c.ink, flex: 1 }}>Leaderboard</Text><Text style={{ color: c.ink2 }}>{board.entered} entered</Text></View>
      {board.top.length === 0 ? <Text style={{ color: c.ink2, fontFamily: fonts.body }}>No one has entered yet. Be the first!</Text> : <View>{board.top.map(row)}</View>}
      {board.around.length ? <><Text style={{ textAlign: 'center', color: c.ink2, letterSpacing: 4 }}>···</Text><View>{board.around.map(row)}</View></> : null}
      <Text style={{ color: c.ink2, fontSize: 12, fontFamily: fonts.body }}>Only first names and last initials are shown. Ties go to the higher finisher total.</Text>
    </View>
  );
}

const s = StyleSheet.create({
  hero: { borderRadius: 26, padding: 20, gap: 10 },
  eyebrow: { color: '#FFC2D9', fontSize: 11, letterSpacing: 1.2, fontWeight: '700' },
  heroTitle: { color: '#fff', fontSize: 27, lineHeight: 29 },
  heroBody: { color: '#fff', opacity: 0.92, fontSize: 14 },
  bar: { height: 8, backgroundColor: 'rgba(255,255,255,.25)', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, backgroundColor: '#fff', borderRadius: 4 },
  heroStat: { color: '#fff', fontSize: 13 },
  chip: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1.5 },
  tabs: { flexDirection: 'row', borderRadius: 999, padding: 3 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 999, alignItems: 'center' },
  notice: { borderRadius: 14, padding: 14 },
  cal: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  day: { width: '15%', aspectRatio: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexGrow: 1 },
  star: { position: 'absolute', top: 1, right: 4, fontSize: 10, color: '#FF8AB3' },
  streak: { borderRadius: 22, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  streakLabel: { color: '#fff', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  mult: { backgroundColor: '#fff', borderRadius: 16, paddingVertical: 8, paddingHorizontal: 14, alignItems: 'center' },
  panel: { borderRadius: 22, borderWidth: 1.5, padding: 16, gap: 10 },
  row: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  ex: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: 1 },
  tick: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  btn: { borderRadius: 999, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  finisher: { borderTopWidth: 1.5, paddingTop: 12, gap: 6 },
  input: { flex: 1, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  lrow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9, paddingHorizontal: 6, borderTopWidth: 1, borderRadius: 12 },
  meCard: { borderWidth: 1.5, borderRadius: 22, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16 },
});
