# Tumble Tips server

Node.js (Fastify) API for accounts and the Christmas Challenge. **The server decides every point.**
It imports the scoring rules from `../app/src/lib/challenge.ts`, the same file the app uses to display them.

## Run
```bash
cd server && npm install
npm run dev            # http://localhost:3000, emails are printed to the console
npm test               # 22 tests
# Try the challenge before 1 December:
NOW_OVERRIDE=2026-12-05T12:00:00Z npm run dev
```
The app reads `EXPO_PUBLIC_API_URL` (default `http://localhost:3000`).

## What it does
- **Login:** email + 6-digit code (10 min, 5 tries, single use). No passwords. New accounts must confirm they are a parent/guardian.
- **Athletes:** child profiles under the parent; names limited to first name + last initial.
- **Access:** every athlete route checks the athlete belongs to the signed-in parent (tested).
- **Dates:** one fixed time zone (`CHALLENGE_TZ`) decides the day. Future days, finished days, and the finisher on any other date are refused.
- **Points:** 10 per exercise, +20 finish, +10 on the day, streak multiplier, finisher points. Catch-up days score without the bonus or streak.
- **Fair play:** hard maximum on finisher scores; unusually high ones are flagged for an admin to review or void.
- **Leaderboard:** shows only first name, last initial, points, streak. No ids or emails.
- **Delete account:** removes the user, athletes and scores (required by both stores).

## Before launch
1. **Decide `CHALLENGE_TZ`** (open decision).
2. **Email (Resend), set up once:**
   1. Create a Resend account, then add and verify your sending domain (Resend shows the DNS records to add).
   2. Create an API key with sending access.
   3. Set `RESEND_API_KEY` and `EMAIL_FROM` (an address on the verified domain) on your host.
   The server picks Resend automatically when the key is set, prints emails to the console in development, and **refuses to start in production without it**. If Resend is down, the app shows "try again" and no dead code is left behind.
3. **Hosting + database.** Dev uses SQLite (`node:sqlite`). For production use a host with a persistent disk, or move `src/db.ts` to Postgres.
4. **Privacy policy, terms and rules pages.** The consent checkbox mentions them but there are no links yet. Bump `CONSENT_VERSION` in the app when they change.
5. **Reviewer login.** Set `REVIEW_EMAIL` / `REVIEW_CODE` and put them in the store review notes.
6. **Backups** of the database, and an uptime alert on `/health`.
7. Remove `NOW_OVERRIDE` (it is ignored in production anyway).
