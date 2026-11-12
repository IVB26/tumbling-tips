export type LegalKey = 'privacy' | 'terms' | 'rules' | 'support';
export type LegalLink = { key: LegalKey; label: string; url: string };
const LABELS: Record<LegalKey, string> = { privacy: 'Privacy Policy', terms: 'Terms of Use', rules: 'Challenge Rules', support: 'Contact support' };
const ORDER: LegalKey[] = ['privacy', 'terms', 'rules', 'support'];

/** A real https page or a mailto address, and not a leftover placeholder. */
export const isValidLegalUrl = (u: string) => /^(https:\/\/[^\s]+\.[^\s]+|mailto:[^\s@]+@[^\s@]+\.[^\s@]+)$/.test(u) && !/REPLACE/i.test(u);

/** The links that are set up properly, in a fixed order. Unset or invalid ones are left out. */
export const legalLinks = (urls: Partial<Record<LegalKey, string>>): LegalLink[] =>
  ORDER.filter(k => urls[k] && isValidLegalUrl(urls[k]!)).map(k => ({ key: k, label: LABELS[k], url: urls[k]! }));
