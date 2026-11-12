/**
 * Paid content (guides, drills, tips) is OFF for the first store release.
 *
 * Apple and Google require digital content to be sold through their own In-App Purchase systems.
 * Until that is connected, no screen may offer a purchase or a free "unlock" of paid content.
 *
 * DO NOT set this to true until the Buy / Unlock buttons call real In-App Purchases
 * (see OwnedContext.tsx, where unlocking is currently free and stored on the device).
 */
export const PURCHASES_ENABLED = process.env.EXPO_PUBLIC_PURCHASES_ENABLED === 'true';

/**
 * Prizes beyond the Elf Strength badge (vouchers, free skills, personal video feedback) are hidden until you
 * confirm you can deliver them. Paid content is switched off, so vouchers and skill unlocks cannot be used yet.
 * See legal/00-READ-ME-FIRST.md. Set EXPO_PUBLIC_PRIZES_CONFIRMED=true in eas.json when you are ready.
 */
export const PRIZES_CONFIRMED = process.env.EXPO_PUBLIC_PRIZES_CONFIRMED === 'true';

/**
 * The full shop (paid guides, bundles, coach products) is hidden for the first App Store release.
 * Almost all of it is unfinished: there is no video, the guides have titles but no text, and nothing can be bought yet.
 * Apple rejects apps with placeholder or "coming soon" content, so only content that really exists is shown:
 * the Challenge, the free skill breakdowns, and the free tips.
 * Set EXPO_PUBLIC_FULL_CATALOGUE=true when the paid content is real.
 */
export const FULL_CATALOGUE = process.env.EXPO_PUBLIC_FULL_CATALOGUE === 'true';

/** Public pages that both stores require. Set in eas.json; production builds refuse to start without them (scripts/check-release.js). */
export const LEGAL_URLS = {
  privacy: process.env.EXPO_PUBLIC_PRIVACY_URL ?? '',
  terms: process.env.EXPO_PUBLIC_TERMS_URL ?? '',
  rules: process.env.EXPO_PUBLIC_RULES_URL ?? '',
  support: process.env.EXPO_PUBLIC_SUPPORT_URL ?? '',
};
