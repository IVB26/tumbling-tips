import { buildApp } from './app';
import { loadConfig } from './config';
import { openDb } from './db';
import { createMailer } from './mailer';

const config = loadConfig();
const db = openDb(process.env.DB_PATH ?? './data.sqlite');
// Dev/staging only: pretend it is a different moment, to test the challenge before 1 December.
const override = !config.production && process.env.NOW_OVERRIDE ? new Date(process.env.NOW_OVERRIDE) : null;
if (override && Number.isNaN(override.getTime())) throw new Error('NOW_OVERRIDE is not a valid date');
const app = buildApp({ db, config, mailer: createMailer(), now: override ? () => override : undefined });
const port = Number(process.env.PORT ?? 3000);
app.listen({ port, host: '0.0.0.0' }).then(() => console.log(`Tumble Tips API on :${port} (tz ${config.tz}${override ? `, time frozen at ${override.toISOString()}` : ''})`));
