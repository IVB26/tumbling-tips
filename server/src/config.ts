export type Config = {
  secret: string;
  tz: string;            // time zone that decides "which day is it" for everyone
  endDay: number;        // challenge closes at the start of this December day (default 27)
  adminEmails: string[];
  reviewLogin?: { email: string; code: string }; // fixed demo login for App Store / Play reviewers
  production: boolean;
  corsOrigins: string[];
};

export function loadConfig(env = process.env): Config {
  const production = env.NODE_ENV === 'production';
  const secret = env.SERVER_SECRET ?? '';
  if (production && secret.length < 32) throw new Error('SERVER_SECRET must be set (32+ characters) in production');
  const list = (v?: string) => (v ?? '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  return {
    secret: secret || 'dev-only-secret-not-for-production-use-0000',
    tz: env.CHALLENGE_TZ ?? 'UTC',
    endDay: Number(env.CHALLENGE_END_DAY ?? 27),
    adminEmails: list(env.ADMIN_EMAILS),
    reviewLogin: env.REVIEW_EMAIL && env.REVIEW_CODE ? { email: env.REVIEW_EMAIL.toLowerCase(), code: env.REVIEW_CODE } : undefined,
    production,
    corsOrigins: list(env.CORS_ORIGINS),
  };
}
