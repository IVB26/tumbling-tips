import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../ThemeContext';
import { fonts } from '../theme';
import { useAuth } from '../AuthContext';
import { api } from '../api';
import LoginForm from '../components/LoginForm';
import AthleteForm from '../components/AthleteForm';

export default function AccountScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { status, me, token, refreshMe, signOut, deleteAccount } = useAuth();
  const [confirming, setConfirming] = useState<string | null>(null); // 'account' or an athlete id
  const [error, setError] = useState('');
  const run = async (fn: () => Promise<unknown>) => { setError(''); try { await fn(); } catch (e: any) { setError(e.message); } finally { setConfirming(null); } };
  const btn = (label: string, onPress: () => void, danger = false) => (
    <Pressable onPress={onPress} accessibilityRole="button" style={{ borderRadius: 999, paddingVertical: 12, alignItems: 'center', backgroundColor: danger ? '#C8102E' : c.blush }}>
      <Text style={{ fontFamily: fonts.bodyBold, color: danger ? '#fff' : c.pinkDeep }}>{label}</Text>
    </Pressable>
  );

  return (
    <ScrollView style={{ backgroundColor: c.bg }} contentContainerStyle={{ padding: 18, paddingTop: insets.top + 12, gap: 16 }}>
      <Text style={{ fontFamily: fonts.display, fontSize: 26, color: c.ink }}>Account</Text>
      {status !== 'in' || !me ? <LoginForm /> : (
        <>
          <View style={{ backgroundColor: c.surface, borderColor: c.line, borderWidth: 1.5, borderRadius: 22, padding: 16, gap: 4 }}>
            <Text style={{ color: c.ink2, fontSize: 12, fontFamily: fonts.bodyBold, letterSpacing: 0.8 }}>SIGNED IN AS</Text>
            <Text style={{ color: c.ink, fontFamily: fonts.bodyBold, fontSize: 16 }}>{me.user.email}</Text>
          </View>

          <Text style={{ fontFamily: fonts.display, fontSize: 19, color: c.ink }}>Athletes</Text>
          {me.athletes.map(a => (
            <View key={a.id} style={{ backgroundColor: c.surface, borderColor: c.line, borderWidth: 1.5, borderRadius: 16, padding: 14, gap: 8 }}>
              <Text style={{ fontFamily: fonts.bodyBold, color: c.ink }}>{a.name}</Text>
              {confirming === a.id
                ? <>{btn(`Yes, remove ${a.name} and their scores`, () => run(async () => { await api('DELETE', `/athletes/${a.id}`, token); await refreshMe(); }), true)}{btn('Cancel', () => setConfirming(null))}</>
                : btn('Remove athlete', () => setConfirming(a.id))}
            </View>
          ))}
          {me.athletes.length < 6 ? <AthleteForm title="Add another athlete" /> : null}

          {error ? <Text accessibilityRole="alert" style={{ color: '#C8102E', fontFamily: fonts.bodyBold }}>{error}</Text> : null}
          {btn('Sign out', () => run(signOut))}
          <View style={{ gap: 8, marginTop: 8 }}>
            <Text style={{ color: c.ink2, fontSize: 12.5, fontFamily: fonts.body }}>Deleting your account permanently removes your email, your athletes and all their scores. This can’t be undone.</Text>
            {confirming === 'account'
              ? <>{btn('Yes, delete my account', () => run(deleteAccount), true)}{btn('Cancel', () => setConfirming(null))}</>
              : btn('Delete my account', () => setConfirming('account'), true)}
          </View>
        </>
      )}
    </ScrollView>
  );
}
