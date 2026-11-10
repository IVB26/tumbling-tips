import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useColors } from '../ThemeContext';
import { fonts } from '../theme';
import { daysLeftText, pointsLine, rankLine } from '../lib/reward';
import { Ornament } from './Tree';

export type Reward = {
  day: number; points: number; multiplier: number; rankBefore: number; rankAfter: number; entered: number;
  daysLeft: number; prize?: { title: string; body: string }; finisherNext: boolean;
};

/** The "Day N done!" pop-up shown after a parent finishes a day. */
export default function RewardModal({ reward, onClose }: { reward: Reward | null; onClose: () => void }) {
  const c = useColors();
  return (
    <Modal visible={!!reward} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.backdrop}>
        {reward ? (
          <View style={[s.card, { backgroundColor: c.surface }]} accessibilityViewIsModal>
            <Svg width={96} height={110} viewBox="-24 -30 48 56" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <Path d="M0 -30v14" stroke={c.ink2} strokeWidth={1.2} />
              <Ornament day={reward.day} x={0} y={4} r={16} />
            </Svg>
            <Text style={{ fontFamily: fonts.display, fontSize: 24, color: c.ink }}>Day {reward.day} done!</Text>
            <Text style={{ color: c.ink2, textAlign: 'center', fontFamily: fonts.body }}>{daysLeftText(reward.daysLeft)}</Text>
            {reward.prize ? (
              <View style={[s.box, { backgroundColor: c.blush }]}>
                <Text style={{ fontFamily: fonts.bodyBold, color: c.pinkDeep }}>Prize won: {reward.prize.title}</Text>
                <Text style={{ fontSize: 13, color: c.ink2, fontFamily: fonts.body }}>{reward.prize.body}</Text>
              </View>
            ) : null}
            <View style={[s.box, { backgroundColor: c.blush }]}>
              <Text style={{ fontFamily: fonts.bodyBold, color: c.pinkDeep }}>{pointsLine(reward.day, reward.points, reward.multiplier)}</Text>
              <Text style={{ fontSize: 13, color: c.ink2, fontFamily: fonts.body }}>{rankLine(reward.rankBefore, reward.rankAfter, reward.entered)}</Text>
            </View>
            {reward.finisherNext ? <Text style={{ color: c.ink2, textAlign: 'center', fontFamily: fonts.body }}>Now do the finisher for today.</Text> : null}
            <Pressable onPress={onClose} style={[s.btn, { backgroundColor: c.pink }]}>
              <Text style={{ color: c.onPink, fontFamily: fonts.bodyBold }}>{reward.finisherNext ? 'Go to the finisher' : 'See my tree'}</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}
const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(42,6,20,.62)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { borderRadius: 26, padding: 24, alignItems: 'center', gap: 10, maxWidth: 320, width: '100%' },
  box: { borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14, alignSelf: 'stretch', gap: 2 },
  btn: { borderRadius: 999, paddingVertical: 12, paddingHorizontal: 24, marginTop: 4 },
});
