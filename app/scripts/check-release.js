#!/usr/bin/env node
// Runs automatically before every EAS production build (package.json: "eas-build-pre-install"), and by hand with
// `npm run check-release`. Both stores require public Privacy Policy and support pages, and the app must link to them,
// so a production build without proper links is stopped here, with a clear message, instead of being rejected later.
const profile = process.env.EAS_BUILD_PROFILE;
if (profile && profile !== 'production') process.exit(0);   // only production builds go to the stores

const REQUIRED = [
  ['EXPO_PUBLIC_PRIVACY_URL', 'the Privacy Policy page'],
  ['EXPO_PUBLIC_TERMS_URL', 'the Terms of Use page'],
  ['EXPO_PUBLIC_RULES_URL', 'the Challenge Rules page'],
  ['EXPO_PUBLIC_SUPPORT_URL', 'a support page, or a mailto: address'],
];
const valid = u => /^(https:\/\/[^\s]+\.[^\s]+|mailto:[^\s@]+@[^\s@]+\.[^\s@]+)$/.test(u || '') && !/REPLACE/i.test(u);
const bad = REQUIRED.filter(([name]) => !valid(process.env[name]));
if (bad.length) {
  console.error('\nProduction build stopped: the app needs real links for the App Store.\n');
  for (const [name, what] of bad) console.error(`  - ${name} must be set to ${what} (found: ${process.env[name] || 'nothing'})`);
  console.error('\nPut them in app/eas.json under build.production.env, then build again.');
  console.error('Links must start with https:// (or mailto: for support) and must not contain REPLACE.\n');
  process.exit(1);
}
console.log('Release check passed: Privacy, Terms, Rules and Support links are set.');
