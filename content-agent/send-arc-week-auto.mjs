// send-arc-week-auto.mjs
// ─────────────────────────────────────────────────────────────────────────────
// Weekly-scheduler wrapper around send-arc-week-gmail.js. Tracks which week of
// the 16-week advisory arc goes out next, sends it (with the built-in per-
// recipient open/click tracking), then advances the counter. Designed to run
// once a week from GitHub Actions; commit output/arc-week-state.json back so the
// counter persists across cloud runs.
//
// Usage:
//   node send-arc-week-auto.mjs --dry-run   → preview the next week, no send, no advance
//   node send-arc-week-auto.mjs --send      → send the next week live, then advance
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { WEEKS } from './send-arc-week-content.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_PATH = path.join(__dirname, 'output', 'arc-week-state.json');
const args = process.argv.slice(2);
const isSend = args.includes('--send');

const weekNums = Object.keys(WEEKS).map(Number).sort((a, b) => a - b);
const MAX_WEEK = Math.max(...weekNums);

function loadState() {
  if (fs.existsSync(STATE_PATH)) return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
  // First run with no state: default to week 1. (Committed state overrides this.)
  return { nextWeek: 1, lastSentWeek: null, lastSentAt: null };
}

function saveState(state) {
  fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true });
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

// Biweekly cadence: this wrapper is the cooldown authority. It sends only if at
// least MIN_DAYS have passed since the last send, then passes --no-cooldown to
// the child so the child doesn't double-gate (which could drop a week at the
// 14-day boundary). Run the workflow weekly; it effectively fires every 2 weeks.
const MIN_DAYS = 14;

const state = loadState();
const week = state.nextWeek;

if (week > MAX_WEEK) {
  console.log(`✅ Advisory arc complete — week ${state.lastSentWeek}/${MAX_WEEK} was the last. Nothing to send.`);
  process.exit(0);
}
if (!WEEKS[week]) {
  console.error(`✗ Week ${week} not found in WEEKS (valid: ${weekNums.join(',')}). Fix arc-week-state.json.`);
  process.exit(1);
}

// Biweekly gate (live sends only; dry-run always previews).
if (isSend && state.lastSentAt) {
  const daysSince = (Date.now() - new Date(state.lastSentAt).getTime()) / 86400000;
  if (daysSince < MIN_DAYS) {
    const waitDays = Math.ceil(MIN_DAYS - daysSince);
    console.log(`⏳ Last send was ${daysSince.toFixed(1)}d ago (< ${MIN_DAYS}d biweekly gap). Skipping — next eligible in ~${waitDays}d. Counter unchanged (still week ${week}).`);
    process.exit(0);
  }
}

console.log(`📅 Advisory arc → next up: Week ${week}/${MAX_WEEK}${isSend ? ' (LIVE SEND)' : ' (dry run)'}`);

const childArgs = [path.join(__dirname, 'send-arc-week-gmail.js'), `--week=${week}`];
if (isSend) childArgs.push('--send', '--no-cooldown');

const res = spawnSync(process.execPath, childArgs, { cwd: __dirname, stdio: 'inherit', env: process.env });

if (res.status !== 0) {
  console.error(`✗ Week ${week} send failed (exit ${res.status}) — NOT advancing the counter.`);
  process.exit(res.status || 1);
}

// Only advance the counter on a real send.
if (isSend) {
  state.lastSentWeek = week;
  state.lastSentAt = new Date().toISOString();
  state.nextWeek = week + 1;
  saveState(state);
  console.log(`✓ Week ${week} sent. Counter advanced → next week ${state.nextWeek}.`);
} else {
  console.log(`(dry run — counter unchanged, still on week ${week})`);
}
