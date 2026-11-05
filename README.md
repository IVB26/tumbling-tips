# Tayah's Tumble Tips

Mobile app (iPhone and Android) for tumbling skills, parent and coach guides, and the Christmas Strength Challenge.

| Folder | What it is |
|--------|------------|
| `app/` | The mobile app (React Native with Expo, TypeScript). Run it with `cd app && npm install && npx expo start`. |
| `server/` | The API (Node.js, Fastify). Accounts, email sign-in, and **all challenge scoring**. See `server/README.md`. |
| `DEPLOY.md` | How to deploy the server to Railway. |

The scoring rules live in one file, `app/src/lib/challenge.ts`, which both the app (to display) and the server (to decide points) use.

## Tests
```bash
cd app && npm test       # scoring rules, skill player, catalog, library
cd server && npm test    # login, access control, dates, scoring, leaderboard, email
```

## Status
Working: Explore, Skills, Library, Challenge (with accounts and server scoring), Account.
Not yet: real in-app purchases (unlocking is a free demo), guide text editor, Challenge tree and rules pop-ups.
See `DEPLOY.md` and `server/README.md` for what is needed before launch.
