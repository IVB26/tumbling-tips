import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useColors } from '../ThemeContext';
import { fonts } from '../theme';
import { useAuth } from '../AuthContext';
import { api } from '../api';

/** Adds a child profile. Only a first name and last initial are accepted (the server checks too). */
export default function AthleteForm({ title = 'Add your athlete', onDone }: { title?: string; onDone?: (id: string) => void }) {
  const c = useColors();
  const { token, refreshMe, selectAthlete } = useAuth();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    setBusy(true); setError('');
    try { const a = await api<{ id: string }>('POST', '/athletes', token, { name: name.trim() }); await refreshMe(); selectAthlete(a.id); setName(''); onDone?.(a.id); }
    catch (e: any) { setError(e.message); } finally { setBusy(false); }
  };
  return (
    <View style={[s.card, { backgroundColor: c.surface, borderColor: c.line }]}>
      <Text style={{ fontFamily: fonts.display, fontSize: 18, color: c.ink }}>{title}</Text>
      <Text style={{ color: c.ink2, fontSize: 13, fontFamily: fonts.body }}>Free to enter. Only a first name and last initial are shown on the leaderboard, so please don’t use a full name.</Text>
      <TextInput value={name} onChangeText={setName} maxLength={20} placeholder="e.g. Mia R." placeholderTextColor={c.ink2} accessibilityLabel="Athlete first name and last initial"
        style={[s.input, { borderColor: c.line, color: c.ink, backgroundColor: c.bg }]} onSubmitEditing={submit} />
      {error ? <Text accessibilityRole="alert" style={{ color: '#C8102E', fontSize: 13, fontFamily: fonts.bodyBold }}>{error}</Text> : null}
      <Pressable disabled={busy || !name.trim()} onPress={submit} style={[s.btn, { backgroundColor: c.pink, opacity: busy || !name.trim() ? 0.55 : 1 }]}>
        <Text style={{ color: c.onPink, fontFamily: fonts.bodyBold }}>Enter the competition</Text>
      </Pressable>
    </View>
  );
}
const s = StyleSheet.create({
  card: { borderWidth: 1.5, borderRadius: 22, padding: 16, gap: 10 },
  input: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
  btn: { borderRadius: 999, paddingVertical: 12, alignItems: 'center' },
});
