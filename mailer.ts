export interface Mailer { send(to: string, subject: string, text: string): Promise<void> }

/** Development: prints the email. */
export class ConsoleMailer implements Mailer {
  async send(to: string, subject: string, text: string) { console.log(`\n[email to ${to}] ${subject}\n${text}\n`); }
}
/** Tests: keeps emails in memory so a test can read the login code. */
export class MemoryMailer implements Mailer {
  outbox: { to: string; subject: string; text: string }[] = [];
  async send(to: string, subject: string, text: string) { this.outbox.push({ to, subject, text }); }
  lastCode(to: string) { const m = [...this.outbox].reverse().find(x => x.to.toLowerCase() === to.toLowerCase()); return m?.text.match(/\b(\d{6})\b/)?.[1]; }
}

type FetchLike = (url: string, init: { method: string; headers: Record<string, string>; body: string; signal?: AbortSignal }) => Promise<{ ok: boolean; status: number; json(): Promise<any> }>;

/** Sends through Resend's HTTP API (https://resend.com/docs/api-reference/emails/send-email). */
export class ResendMailer implements Mailer {
  constructor(private apiKey: string, private from: string, private fetchImpl: FetchLike = fetch as unknown as FetchLike) {}
  async send(to: string, subject: string, text: string) {
    const res = await this.fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${this.apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from: this.from, to: [to], subject, text }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      const detail = await res.json().catch(() => ({}));
      // Log the reason for you, but never the API key or the email body (it contains the login code).
      throw new Error(`Resend rejected the email (${res.status}): ${detail?.message ?? 'no details'}`);
    }
  }
}

/** Production must have Resend set up. Development falls back to printing the email. */
export function createMailer(env: Record<string, string | undefined> = process.env): Mailer {
  const key = env.RESEND_API_KEY, from = env.EMAIL_FROM;
  if (key) {
    if (!from) throw new Error('EMAIL_FROM is required when RESEND_API_KEY is set, e.g. "Tayah\'s Tumble Tips <login@yourdomain.com>"');
    return new ResendMailer(key, from);
  }
  if (env.NODE_ENV === 'production') throw new Error('RESEND_API_KEY and EMAIL_FROM must be set in production, or nobody can receive a sign-in code');
  return new ConsoleMailer();
}
