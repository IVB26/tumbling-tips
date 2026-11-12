import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '../ThemeContext';
import { fonts } from '../theme';
import { api } from '../api';

/** Report a leaderboard name. An admin is emailed and can rename it. */
export default function ReportSheet({ target, token, onClose }: { target: { name: string; ref: string } | null; token: string | null; onClose: () => void }) {
  const c = useColors();
  const [state, setState] = useState<'ask' | 'sending' | 'done'>('ask');
  const [error, setError] = useState('');
  const close = () => { setState('ask'); setError(''); onClose(); };
  const send = async (reason: 'inappropriate_name' | 'other') => {
    if (!target) return;
    setState('sending'); setError('');
    try { await api('POST', '/leaderboard/report', token, { ref: target.ref, reason }); setState('done'); }
    catch (e: any) { setError(e.message ?? 'Could not send the report.'); setState('ask'); }
  };
  return (
    <Modal visible={!!target} transparent animationType="fade" onRequestClose={close}>
      <View style={s.backdrop}>
        {target ? (
          <View style={[s.card, { backgroundColor: c.surface }]} accessibilityViewIsModal>
            {state === 'done' ? (
              <>
                <Text style={{ fontFamily: fonts.display, fontSize: 21, color: c.ink }}>Thank you</Text>
                <Text style={{ color: c.ink2, fontFamily: fonts.body, lineHeight: 20 }}>We’ve been told, and we’ll look at “{target.name}” and change the name if it’s not suitable.</Text>
                <Pressable onPress={close} style={[s.btn, { backgroundColor: c.pink }]}><Text style={{ color: c.onPink, fontFamily: fonts.bodyBold, textAlign: 'center' }}>Done</Text></Pressable>
              </>
            ) : (
              <>
                <Text style={{ fontFamily: fonts.display, fontSize: 21, color: c.ink }}>Report this name?</Text>
                <Text style={{ color: c.ink2, fontFamily: fonts.body, lineHeight: 20 }}>“{target.name}” will be checked by us. You won’t be named to them.</Text>
                {error ? <Text accessibilityRole="alert" style={{ color: '#C8102E', fontFamily: fonts.bodyBold, fontSize: 13 }}>{error}</Text> : null}
                <Pressable disabled={state === 'sending'} onPress={() => send('inappropriate_name')} style={[s.btn, { backgroundColor: c.pink, opacity: state === 'sending' ? 0.55 : 1 }]}>
                  <Text style={{ color: c.onPink, fontFamily: fonts.bodyBold, textAlign: 'center' }}>It’s an inappropriate name</Text>
                </Pressable>
                <Pressable disabled={state === 'sending'} onPress={() => send('other')} style={[s.btn, { backgroundColor: c.blush, opacity: state === 'sending' ? 0.55 : 1 }]}>
                  <Text style={{ color: c.pinkDeep, fontFamily: fonts.bodyBold, textAlign: 'center' }}>Something else is wrong</Text>
                </Pressable>
                <Pressable onPress={close} accessibilityRole="button"><Text style={{ color: c.ink2, fontFamily: fonts.bodyBold, textAlign: 'center', paddingTop: 4 }}>Cancel</Text></Pressable>
              </>
            )}
          </View>
        ) : null}
      </View>
    </Modal>
  );
}
const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(42,6,20,.62)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { borderRadius: 24, padding: 22, gap: 12, maxWidth: 340, width: '100%' },
  btn: { borderRadius: 999, paddingVertical: 12, paddingHorizontal: 20 },
});
