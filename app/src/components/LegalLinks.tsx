import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '../ThemeContext';
import { fonts } from '../theme';
import { LEGAL_URLS } from '../config';
import { isValidLegalUrl, legalLinks } from '../lib/legal';

const open = (url: string) => { Linking.openURL(url).catch(() => {}); };

/** A tappable word inside a sentence. If the link is not set up, it is plain text. */
export function LinkText({ url, children }: { url: string; children: React.ReactNode }) {
  const c = useColors();
  if (!isValidLegalUrl(url)) return <>{children}</>;
  return <Text accessibilityRole="link" onPress={() => open(url)} style={{ color: c.pinkDeep, textDecorationLine: 'underline', fontFamily: fonts.bodyBold }}>{children}</Text>;
}

/** The "About" list: Privacy Policy, Terms, Challenge Rules and Support. Shows only the links that are set up. */
export function LegalLinksList() {
  const c = useColors();
  const links = legalLinks(LEGAL_URLS);
  if (!links.length) return null;
  return (
    <View style={{ gap: 4 }}>
      <Text style={{ fontFamily: fonts.display, fontSize: 19, color: c.ink, marginBottom: 4 }}>About</Text>
      <View style={[s.card, { backgroundColor: c.surface, borderColor: c.line }]}>
        {links.map((l, i) => (
          <Pressable key={l.key} accessibilityRole="link" accessibilityLabel={l.label} onPress={() => open(l.url)}
            style={[s.row, { borderTopColor: c.line, borderTopWidth: i ? 1 : 0 }]}>
            <Text style={{ flex: 1, fontFamily: fonts.bodyBold, fontSize: 14.5, color: c.ink }}>{l.label}</Text>
            <Text style={{ color: c.ink2, fontSize: 18 }}>›</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  card: { borderWidth: 1.5, borderRadius: 18, paddingHorizontal: 14 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13 },
});
