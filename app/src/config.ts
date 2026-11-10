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
