# Deploying the server to Railway

The repo root has `railway.json` and `package.json`, so Railway builds from the **repo root** (the server needs
`app/src/lib/challenge.ts`, the shared scoring rules). Do **not** set a "Root Directory" in Railway.

## One-time setup
1. **Project:** Railway > New Project > Deploy from GitHub repo > pick this repo. Leave Root Directory empty.
2. **Volume (keeps the database between deploys):** service > Settings > Volumes > Add Volume, mount path `/data`.
3. **Variables** (service > Variables). Paste secrets here only, never into chat or git:

   | Name | Value |
   |------|-------|
   | `NODE_ENV` | `production` |
   | `SERVER_SECRET` | 40+ random characters (run `openssl rand -hex 32`) |
   | `DB_PATH` | `/data/data.sqlite` |
   | `CHALLENGE_TZ` | your time zone, e.g. `Australia/Sydney` (decides when each day starts) |
   | `RESEND_API_KEY` | from Resend |
   | `EMAIL_FROM` | `Tayah's Tumble Tips <login@your-verified-domain>` |
   | `ADMIN_EMAILS` | your email (can review flagged scores) |
   | `REVIEW_EMAIL`, `REVIEW_CODE` | demo login for Apple/Google reviewers, e.g. `review@yourdomain` and a 6-digit code |

4. **Public URL:** service > Settings > Networking > Generate Domain. Check `https://<that-domain>/health` shows `{"ok":true}`.
5. **Tell the app where the server is:** build the app with `EXPO_PUBLIC_API_URL=https://<that-domain>`.

## Notes
- One instance only: the SQLite database lives on the volume. Don't add replicas. For more scale, move `src/db.ts` to Postgres.
- Back up the volume (Railway volume backups, or a scheduled copy of `/data/data.sqlite`).
- `NOW_OVERRIDE` is ignored in production. To test the challenge before 1 December use a separate staging service with `NODE_ENV=development`.
- Add an uptime alert on `/health`.
