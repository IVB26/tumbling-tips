import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { isValidLegalUrl, legalLinks } from './legal.ts';
import { LEGAL_URLS } from '../config.ts';

// ---- link helper
for (const ok of ['https://example.com/privacy', 'https://tumbletips.com.au/privacy-policy', 'mailto:hello@example.com'])
  assert.equal(isValidLegalUrl(ok), true, ok);
for (const bad of ['', 'http://example.com', 'example.com', 'https://REPLACE-WITH-YOUR-PRIVACY-POLICY-PAGE', 'mailto:REPLACE-WITH-YOUR-SUPPORT-EMAIL', 'javascript:alert(1)', 'https://', 'https://a b.com'])
  assert.equal(isValidLegalUrl(bad), false, bad);
assert.deepEqual(legalLinks({}), []);
assert.deepEqual(legalLinks({ support: 'mailto:a@b.co', privacy: 'https://x.io/p', terms: 'nope' }).map(l => l.key), ['privacy', 'support'], 'fixed order, invalid ones left out');
assert.deepEqual(Object.keys(LEGAL_URLS).sort(), ['privacy', 'rules', 'support', 'terms']);

// ---- the pre-build check that stops a production build without proper links
const run = (env: Record<string, string>) => spawnSync('node', ['scripts/check-release.js'], { env: { PATH: process.env.PATH ?? '', ...env }, encoding: 'utf8' });
const good = { EXPO_PUBLIC_PRIVACY_URL: 'https://x.io/privacy', EXPO_PUBLIC_TERMS_URL: 'https://x.io/terms', EXPO_PUBLIC_RULES_URL: 'https://x.io/rules', EXPO_PUBLIC_SUPPORT_URL: 'mailto:hi@x.io' };
assert.equal(run({ EAS_BUILD_PROFILE: 'preview' }).status, 0, 'test builds are not blocked');
assert.equal(run({ EAS_BUILD_PROFILE: 'production', ...good }).status, 0, 'production with real links passes');
const missing = run({ EAS_BUILD_PROFILE: 'production' });
assert.equal(missing.status, 1, 'production without links is stopped');
for (const v of ['EXPO_PUBLIC_PRIVACY_URL', 'EXPO_PUBLIC_TERMS_URL', 'EXPO_PUBLIC_RULES_URL', 'EXPO_PUBLIC_SUPPORT_URL']) assert.match(missing.stderr, new RegExp(v));
const placeholder = run({ EAS_BUILD_PROFILE: 'production', ...good, EXPO_PUBLIC_PRIVACY_URL: 'https://REPLACE-WITH-YOUR-PRIVACY-POLICY-PAGE' });
assert.equal(placeholder.status, 1, 'a placeholder link is stopped'); assert.match(placeholder.stderr, /EXPO_PUBLIC_PRIVACY_URL/); assert.doesNotMatch(placeholder.stderr, /TERMS_URL/);
assert.equal(run({ EAS_BUILD_PROFILE: 'production', ...good, EXPO_PUBLIC_SUPPORT_URL: 'http://x.io/help' }).status, 1, 'plain http is not accepted');

// ---- the settings file really asks for all four, and the hook is wired in
const eas = JSON.parse(readFileSync('eas.json', 'utf8')), pkg = JSON.parse(readFileSync('package.json', 'utf8'));
for (const v of Object.keys(good)) assert.ok(v in eas.build.production.env, `eas.json production profile defines ${v}`);
assert.equal(pkg.scripts['eas-build-pre-install'], 'node scripts/check-release.js');
console.log('legal links and release check: all tests passed');
