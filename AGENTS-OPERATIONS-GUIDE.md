# Agents — Operations Guide

_Complete reference for every automated agent: what it does, how automated it is, how to start it, how to stop/cancel it, and how to verify it end-to-end. Last updated 2026-07-22._

Agents run in one of two places:
- **☁️ Cloud (GitHub Actions)** — runs on GitHub's servers on a schedule. No laptop needed. This is the source of truth going forward.
- **💻 Local cron** — runs on Lynn's Mac (only when it's awake). Being retired as each cloud agent is verified.

**Automation levels used below:**
- 🟢 **Fully automated** — runs on schedule and completes its action (send/publish/email) with no human step.
- 🟡 **Semi-automated** — runs on schedule but stops at a review point (draft, queue, or approval gate).
- 🔵 **Manual** — only runs when you trigger it.

---

## How to START / STOP / VERIFY any cloud agent (generic)

**START (on demand):** GitHub → the repo → **Actions** tab → pick the workflow (left list) → **Run workflow** button → (choose options) → **Run workflow**.
**START (scheduled):** nothing to do — it runs on its cron once the repo's secrets are set.
**STOP / PAUSE:** Actions → pick the workflow → **⋯ (top-right)** → **Disable workflow**. Re-enable the same way.
**CANCEL a run in progress:** Actions → click the running job → **Cancel workflow**.
**VERIFY:** Actions → click the latest run → all steps green = success; click a step to read its log. Then confirm the *real-world* outcome (email arrived, Buffer queue filled, commit appeared) — specifics per agent below.

**Repos:**
- `revglobal-agents` → github.com/lynnfernan/revglobal-agents
- `Aura` → github.com/lynnfernan/Aura
- `lynnfernando.com` (Personal Brand) → github.com/lynnfernan/lynnfernando.com

---

# REV GLOBAL AGENTS  (repo: `revglobal-agents`)

## 1. REV Content Pipeline  🟡
- **What it does:** generates LinkedIn posts + blog articles (via Claude + DALL·E), scores new leads (Apollo → CRM), and prepares email previews. Content is committed to the `REVGlobal` site repo. **It does NOT publish to the live site or send emails automatically.**
- **Automation:** 🟡 — content auto-commits to the GitHub repo; **email sends are approval-gated**; **live site deploy is manual** (only with `ALLOW_LIVE_DEPLOY=true`).
- **Schedule:** Mon–Fri 8am PT. Mon = full pipeline · Tue/Thu = content · Wed = content + leads · Fri = leads.
- **START:** Actions → "REV Global Content Pipeline" → Run workflow (optionally pick an agent + `approved`).
- **STOP/CANCEL:** Disable workflow (pause all) or Cancel a running job.
- **VERIFY end-to-end:**
  1. Actions run is green.
  2. New commit appears in the `lynnfernan/REVGlobal` repo (the generated content).
  3. For emails: you receive the **approval digest** email; nothing sends until you run it again with `approved`.

## 2. Buffer Social Schedule  🟡
- **What it does:** reads `data/social-calendar.json`, writes any missing post copy with Claude, and schedules posts into **Buffer** (REV LinkedIn + @revglobalinc Instagram).
- **Automation:** 🟡 — posts land in the Buffer **queue** for review; Buffer publishes per your Buffer settings.
- **Schedule:** Mondays 7am UTC (next week) + 1st of month (next month).
- **START:** Actions → "Buffer Social Schedule" → Run workflow → choose `week-next` / `month-next`.
- **STOP/CANCEL:** Disable workflow / Cancel run.
- **VERIFY:** run is green → open **publish.buffer.com** and confirm the new queued posts. Optional Slack ping if `SLACK_WEBHOOK` is set.

## 3. REV Content Status (weekly)  🟢
- **What it does:** emails a summary of what published this week (site git history) + the Buffer queue status.
- **Automation:** 🟢 — sends automatically (internal report to Lynn; no external publishing).
- **Schedule:** Fridays ~5pm PT.
- **START:** Actions → "REV Content Status (weekly)" → Run workflow.
- **STOP:** Disable workflow.
- **VERIFY:** run is green → the status email arrives at lynn@revglobalinc.com.

## 4. Manual Campaign Runners  🔵
- **What they do:** one-off email/enrolment campaigns — SMB offers, med-spa outreach, referral-partner drips, follow-up offers.
- **Automation:** 🔵 — run by hand from a terminal. **Always `--dry-run` first, then `--send`.**
- **START:** from the repo folder, e.g. `node run-smb-offer.js --email=1 --dry-run` then `--send --limit=25`. (Full list in `AGENTS-CATALOG.md`.)
- **STOP/CANCEL:** they're manual — just don't run them; press Ctrl-C to abort mid-run.
- **VERIFY:** dry-run prints the preview + recipient count; after `--send`, check `output/emails.json` and the recipient inbox / Mautic.
- **Compliance:** any email naming a deal/return/tax provision **must carry the standard disclosure block**.

## 5. Opportunity Aggregator  🟢  ⚠️ _Personal (Lynn's job search) — not a REV business function_
- **What it does:** scrapes job boards + marketplaces, scores roles with Claude, emails Lynn a 4-bucket digest.
- **Automation:** 🟢 — emails Lynn automatically (no external publishing).
- **Schedule:** weekdays 7am + 4pm PT.
- **START/STOP:** Run / Disable workflow. **VERIFY:** digest email arrives at lynn.fernando@gmail.com.

---

# AURA AGENTS  (repo: `Aura`)

## 6. Aura Daily  🟡  _(consolidated: was 3 separate jobs)_
- **What it does:** runs the growth loop (scans demand signals → drafts conversion assets) **and** emails Lynn the social/email tasks due today, in one pass. The old macOS desktop-notification job was retired.
- **Automation:** 🟡 — **drafts + emails only; never auto-publishes** to social. You publish from the drafts.
- **Schedule:** weekdays ~7am PT.
- **START:** Actions → "Aura Daily" → Run workflow.
- **STOP/CANCEL:** Disable workflow / Cancel run.
- **VERIFY:** run is green → you receive the growth digest + the due-tasks email; check the committed `agents/drafts/` for new drafts.

---

# PERSONAL BRAND AGENTS  (repo: `lynnfernando.com`)

## 7. PB Advisory Arc email  🟢
- **What it does:** sends the next week of Lynn's 16-week advisory arc to the contact list via Gmail, with per-recipient open/click tracking. Tracks progress in `output/arc-week-state.json` and advances after each send.
- **Automation:** 🟢 — **sends automatically** to real contacts. Runs weekly but a built-in 14-day gate makes it **effectively biweekly**.
- **Schedule:** Thursdays (fires every other Thursday due to the gate). Currently at **Week 4**.
- **START (manual/preview):** Actions → "PB Advisory Arc (weekly)" → Run workflow → **mode: `dry-run`** to preview, or `send` to send now.
- **STOP/CANCEL:** Disable workflow to pause. To skip/adjust a week, edit `output/arc-week-state.json` (`nextWeek`).
- **VERIFY:** dry-run shows the exact week + subject + recipient count, no send. After a live send, the counter advances (commit appears) and tracked opens/clicks flow to lynnfernando.com/track.
- **Safety:** contact list is injected from the `CONTACTS_JSON_B64` secret at runtime — never stored in git.

## 8. PB Growth Loop  🟡
- **What it does:** builds next week's content calendar, drafts platform-native copy, renders on-brand IG graphics, schedules to Buffer (personal LinkedIn + Instagram), and emails Lynn a digest.
- **Automation:** 🟡 — schedules into the Buffer **queue** + emails; you approve/publish from Buffer.
- **Schedule:** Mondays ~7:30am PT.
- **START:** Actions → "PB Growth Loop (weekly)" → Run workflow (`no_buffer: true` to generate+email only, skip scheduling).
- **STOP/CANCEL:** Disable workflow / Cancel run.
- **VERIFY:** run is green → check **publish.buffer.com** for queued personal posts + the digest email; generated calendar/graphics are committed under `agents/personal-brand-growth/`.

---

# Local cron (being retired)

Until each cloud agent above is verified, these still run on Lynn's Mac. List/edit with `crontab -l` / `crontab -e` (delete a line to stop that job).

| Local job | Cloud replacement |
|---|---|
| Aura growth + reminder + task email | Aura Daily |
| PB growth loop (Mon) | PB Growth Loop |
| REV status (Fri) | REV Content Status |
| Opportunity aggregator (7am + 4pm) | Opportunity Aggregator |

Retirement rule: verify the cloud run works → then delete the matching local cron line.

---

# Secrets (per repo)

Add under **Settings → Secrets and variables → Actions**. See `revglobal-agents/AGENTS-CATALOG.md` for the full per-repo list. Critical: `ANTHROPIC_API_KEY` must be the current valid key in every repo that scores/generates with Claude.

# Safety rules (do not change without discussion)
- **Email approval gate** — REV email sends require explicit approval (`--approved`). No auto-sends.
- **Live site deploy is manual** — the pipeline stops at the GitHub repo; publishing to site.revglobalinc.com needs `ALLOW_LIVE_DEPLOY=true`.
- **Never commit `.env` or contact lists** — secrets and PII stay out of git.
- **Emergency stop:** disable all workflows in a repo's Actions tab.
