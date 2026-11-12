import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useColors } from '../ThemeContext';
import { fonts } from '../theme';
import { useAuth } from '../AuthContext';
import { LinkText } from './LegalLinks';
import { LEGAL_URLS } from '../config';

/** Email + 6-digit code. No passwords to store or forget. */
export default function LoginForm() {
  const c = useColors();
  const { requestCode, verify } = useAuth();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [consent, setConsent] = useState(false);
  const [needConsent, setNeedConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const wrap = async (fn: () => Promise<void>) => { setBusy(true); setError(''); try { await fn(); } catch (e: any) { setError(e.message ?? 'Something went wrong.'); } finally { setBusy(false); } };
  const sendCode = () => wrap(async () => { await requestCode(email.trim()); setStep('code'); });
  const submit = () => wrap(async () => {
    const r = await verify(email.trim(), code.trim(), consent);
    if (r === 'consent_required') { setNeedConsent(true); setError(consent ? '' : 'Please tick the box to create your account.'); }
  });

  const input = [s.input, { borderColor: c.line, color: c.ink, backgroundColor: c.bg }];
  return (
    <View style={[s.card, { backgroundColor: c.surface, borderColor: c.line }]}>
      <Text style={{ fontFamily: fonts.display, fontSize: 20, color: c.ink }}>{step === 'email' ? 'Sign in to join the challenge' : 'Check your email'}</Text>
      <Text style={{ color: c.ink2, fontFamily: fonts.body, fontSize: 13.5 }}>
        {step === 'email' ? 'A parent or guardian signs in. We email you a 6-digit code, so there is no password to remember.'
          : `We sent a 6-digit code to ${email.trim()}. It works for 10 minutes.`}
      </Text>
      {step === 'email' ? (
        <TextInput value={email} onChangeText={setEmail} placeholder="Parent email" placeholderTextColor={c.ink2} autoCapitalize="none" autoComplete="email"
          keyboardType="email-address" textContentType="emailAddress" accessibilityLabel="Parent email" style={input} onSubmitEditing={sendCode} />
      ) : (
        <TextInput value={code} onChangeText={t => setCode(t.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit code" placeholderTextColor={c.ink2} keyboardType="number-pad"
          autoComplete="one-time-code" textContentType="oneTimeCode" accessibilityLabel="Sign-in code" style={input} onSubmitEditing={submit} />
      )}
      {step === 'code' && needConsent ? (
        <Pressable onPress={() => setConsent(v => !v)} accessibilityRole="checkbox" accessibilityState={{ checked: consent }} style={s.consent}>
          <View style={[s.box, { borderColor: consent ? c.pink : c.line, backgroundColor: consent ? c.pink : 'transparent' }]}>{consent ? <Text style={{ color: '#fff', fontSize: 13 }}>✓</Text> : null}</View>
          <Text style={{ flex: 1, color: c.ink, fontSize: 13, fontFamily: fonts.body }}>
            I am a parent or guardian, and I agree to the <LinkText url={LEGAL_URLS.terms}>Terms</LinkText> and the <LinkText url={LEGAL_URLS.privacy}>Privacy Policy</LinkText>. I understand only my child’s first name and last initial are shown on the leaderboard.
          </Text>
        </Pressable>
      ) : null}
      {error ? <Text accessibilityRole="alert" style={{ color: '#C8102E', fontSize: 13, fontFamily: fonts.bodyBold }}>{error}</Text> : null}
      <Pressable disabled={busy || (step === 'email' ? !email.includes('@') : code.length !== 6)} onPress={step === 'email' ? sendCode : submit}
        style={[s.btn, { backgroundColor: c.pink, opacity: busy || (step === 'email' ? !email.includes('@') : code.length !== 6) ? 0.55 : 1 }]}>
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={{ color: c.onPink, fontFamily: fonts.bodyBold }}>{step === 'email' ? 'Email me a code' : needConsent ? 'Create account' : 'Sign in'}</Text>}
      </Pressable>
      {step === 'code' ? <Pressable onPress={() => { setStep('email'); setCode(''); setError(''); setNeedConsent(false); }}><Text style={{ color: c.pinkDeep, fontFamily: fonts.bodyBold, textAlign: 'center' }}>Use a different email</Text></Pressable> : null}
    </View>
  );
}
const s = StyleSheet.create({
  card: { borderWidth: 1.5, borderRadius: 22, padding: 16, gap: 12 },
  input: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
  btn: { borderRadius: 999, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  consent: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  box: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
});
