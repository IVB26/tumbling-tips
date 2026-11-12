// A modest filter for the first name shown on the leaderboard. It is one layer: names are also limited to a
// first name and last initial, and anyone can report a name (see /leaderboard/report) for an admin to review.

/** Long words that are not found inside real names, so they are matched anywhere in the name. */
const BLOCKED_ANYWHERE = ['fuck', 'shit', 'bitch', 'cunt', 'whore', 'slut', 'wank', 'twat', 'bastard', 'nazi', 'rape', 'porn', 'penis', 'vagina', 'bollock', 'asshole', 'dickhead', 'cocksuck', 'motherfuck'];
/** Short words that sit inside real names (Cassidy, Dickson), so they only count as a whole word. */
const BLOCKED_WHOLE_WORD = ['ass', 'arse', 'dick', 'cock', 'tit', 'tits', 'piss', 'crap', 'damn', 'hell', 'sex', 'fag', 'poo', 'poop', 'butt', 'boob', 'boobs'];

const LEET: Record<string, string> = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', '$': 's', '!': 'i' };
const squash = (s: string) => s.toLowerCase().split('').map(c => LEET[c] ?? c).join('').replace(/[^a-z]/g, '');

export function isNameAllowed(name: string): boolean {
  const words = name.toLowerCase().split(/[^a-z0-9@$!]+/).filter(Boolean).map(w => squash(w));
  if (words.some(w => BLOCKED_WHOLE_WORD.includes(w))) return false;
  const joined = words.join('');
  return !BLOCKED_ANYWHERE.some(b => joined.includes(b));
}
