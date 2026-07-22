// personalBrandGrowthLoop.cjs
// ─────────────────────────────────────────────────────────────────────────────
// Lynn Fernando personal brand growth loop (LinkedIn + Instagram)
//
// Stages:
//   1. Build next-week calendar from pillars + resource library
//   2. Draft platform-native copy (Lynn voice)
//   3. Generate on-brand IG graphics + upload to lynnfernando.com/social/ig/
//   4. Optionally schedule to Buffer (personal LI + IG)
//   5. Email Lynn a digest + optional per-task emails
//   6. Write markdown digest
//
// Usage:
//   node personalBrandGrowthLoop.cjs
//   node personalBrandGrowthLoop.cjs --dry-run          # no Buffer, no email, no upload
//   node personalBrandGrowthLoop.cjs --no-buffer
//   node personalBrandGrowthLoop.cjs --no-email
//   node personalBrandGrowthLoop.cjs --no-graphics
//   node personalBrandGrowthLoop.cjs --email-tasks      # one email per post
//   node personalBrandGrowthLoop.cjs --week-start=2026-07-20
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');

const SHARED =
  '/Users/lynnfernan/Lynn Priorities/REV Global/AI Programs/agents/revglobal-agents/node_modules';
if (fs.existsSync(SHARED)) module.paths.unshift(SHARED);

const ROOT = __dirname;
const CONFIG_PATH = path.join(ROOT, 'config', 'growthConfig.json');
const CONTEXT_PATH = path.join(ROOT, 'references', 'brand-context.md');
const { generateFromCalendar } = require('./generateIgGraphic.cjs');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
    }
  }
}

function loadConfig() {
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
}

function saveJson(p, data) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
}

function loadJson(p, fallback) {
  if (!fs.existsSync(p)) return fallback;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function argFlag(name) {
  return process.argv.includes(`--${name}`);
}

function argValue(name) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : null;
}

/** Next Monday (or this Monday if today is Monday) in LA calendar terms via UTC date math */
function getWeekStart(isoOverride) {
  if (isoOverride) return isoOverride.slice(0, 10);
  const now = new Date();
  // Use America/Los_Angeles date parts
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).formatToParts(now);
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const y = Number(map.year);
  const m = Number(map.month);
  const d = Number(map.day);
  // Approximate weekday: rebuild date at noon UTC from LA y-m-d
  const approx = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const day = approx.getUTCDay(); // 0 Sun
  const delta = day === 0 ? 1 : day === 1 ? 0 : 8 - day; // next Monday if past Mon
  // If we want "this week" Mon: if day is Mon-Sun, go back to Mon
  const backToMon = day === 0 ? -6 : 1 - day;
  const monday = new Date(approx);
  monday.setUTCDate(approx.getUTCDate() + backToMon);
  // If user runs mid-week and wants upcoming full week, use next Monday when Fri/Sat/Sun
  if (day === 0 || day >= 5) {
    const next = new Date(approx);
    next.setUTCDate(approx.getUTCDate() + (day === 0 ? 1 : 8 - day));
    return next.toISOString().slice(0, 10);
  }
  return monday.toISOString().slice(0, 10);
}

function addDays(isoDate, days) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

/** weekday: 0=Sun … 6=Sat → days from Monday */
function offsetFromMonday(weekday) {
  // cadence uses 1=Mon … 5=Fri
  return weekday - 1;
}

function toScheduledAt(localDate, hour, minute) {
  // Treat local as America/Los_Angeles PDT/PST via fixed -07:00 summer; better: use noon offset
  // For Jul use PDT (UTC-7)
  const hh = String(hour).padStart(2, '0');
  const mm = String(minute).padStart(2, '0');
  const local = `${localDate}T${hh}:${mm}:00`;
  // Convert LA wall time to ISO: use temporal approx
  // July = PDT UTC-7
  const asUtc = new Date(`${local}-07:00`);
  return asUtc.toISOString();
}

function loadResources(config) {
  try {
    const man = JSON.parse(fs.readFileSync(config.resources_manifest, 'utf8'));
    return man.resources || [];
  } catch {
    return [];
  }
}

function pickResource(resources, history, pillarKey) {
  if (!resources.length) return null;
  const used = new Set((history.resource_ids || []).slice(-40));
  const categoryHints = {
    ai_commercial: /genai|ai|digital/i,
    empire_operator: /empire|business|operator|pipeline/i,
    capital_ownership: /fund|invest|buy|wealth|capital|ownership/i,
    women_founders: /women|fund|philanthrop|ayana|access/i,
    personal_pov: /./i,
  };
  const re = categoryHints[pillarKey] || /./i;
  const pool = resources.filter(
    (r) => re.test(`${r.category} ${r.title}`) && !used.has(r.id)
  );
  const list = pool.length ? pool : resources.filter((r) => !used.has(r.id));
  return (list.length ? list : resources)[0];
}

function draftLinkedIn({ pillar, hook, resource, brand, format, series }) {
  if (series === 'wellness_wednesday' || pillar === 'wellness_wednesday') {
    return [
      'Wellness Wednesday.',
      '',
      hook,
      '',
      'I build commercial systems for a living. Lately that same lens is on wellness, because most people are still collecting fragments instead of a plan.',
      '',
      'Aura is how I am productizing that idea: personalized protocols, east and west, evidence labeled.',
      '',
      resource
        ? `If you want the longer read:\n${resource.url || 'https://wellnessbyaura.com'}`
        : 'Start here when you are ready: https://wellnessbyaura.com',
      '',
      'I will keep sharing the build out in public on Wednesdays.',
    ].join('\n');
  }
  // Human voice templates — avoid repeated "operator take" boilerplate
  if (format === 'native_text_story') {
    return [
      hook,
      '',
      'I learned this inside large systems first — then building my own.',
      '',
      'A deal is an event. The machine is what pays you after the announcement.',
      '',
      resource
        ? `Longer write-up:\n${resource.url || brand.resources}`
        : `More at ${brand.site}`,
      '',
      'If you only improve one thing this quarter, improve the machine.',
    ].join('\n');
  }
  if (format === 'native_text_framework') {
    return [
      hook,
      '',
      'What actually moved the needle was not a hack. It was a short list, run every week.',
      '',
      resource
        ? `I documented it here:\n${resource.url || brand.resources}`
        : `Frameworks at ${brand.site}`,
      '',
      'Audit the system before you audit the mood of the quarter.',
    ].join('\n');
  }
  // default native_text
  return [
    hook,
    '',
    'Most companies do not need more ideas. They need a kill list.',
    '',
    resource
      ? `${resource.title}:\n${resource.url || brand.resources}`
      : `Resources: ${brand.site}`,
    '',
    'Start with what shows up in the P&L.',
  ].join('\n');
}

function draftInstagram({ pillar, hook, resource, brand, format, series }) {
  const isWellnessWed = series === 'wellness_wednesday' || pillar === 'wellness_wednesday';
  const tags = isWellnessWed
    ? '#WellnessWednesday #LynnFernando #Aura #WellnessProtocol #IntegrativeHealth #BuildingInPublic'
    : format === 'photo_overlay'
      ? '#LynnFernando #AIStrategy #Leadership #OperatorMindset'
      : '#LynnFernando #BrandArchitect #EmpireBuilding #OperatorMindset #WomenInBusiness';

  if (isWellnessWed) {
    return [
      'Wellness Wednesday.',
      '',
      hook,
      '',
      'Most people do not need another tip. They need one plan that holds together.',
      '',
      'That is the work behind Aura. Personalized protocols. East and west. Built for real life.',
      '',
      resource
        ? `More on the site / link in bio.\n${resource.title || ''}`
        : 'More at wellnessbyaura.com. Link in bio.',
      '',
      brand.ig_handle,
      '',
      tags,
    ]
      .filter((line) => line !== undefined)
      .join('\n')
      .replace(/—/g, '. ')
      .replace(/ – /g, '. ');
  }

  if (format === 'photo_overlay') {
    return [
      hook,
      '',
      'I am not anti-pilot. I am anti-pilot with no owner on the number.',
      '',
      resource
        ? `Free checklist in bio / resources:\n${resource.title}`
        : `More → ${brand.site}`,
      '',
      brand.ig_handle,
      '',
      tags,
    ].join('\n');
  }
  // quote_card
  return [
    hook,
    '',
    resource
      ? `I wrote the longer version. Link in bio.\n${resource.title}`
      : `More on the site → ${brand.site}`,
    '',
    brand.ig_handle,
    '',
    tags,
  ].join('\n');
}

function buildWeek(config, weekStart, history) {
  const resources = loadResources(config);
  const posts = [];
  const usedResourceIds = [];

  const slots = [
    ...config.cadence.linkedin.map((s) => ({ ...s, channel: 'linkedin' })),
    ...config.cadence.instagram.map((s) => ({ ...s, channel: 'instagram' })),
  ];

  // Format diversity: alternate styles across the week
  const liFormats = ['native_text', 'native_text_story', 'native_text_framework'];
  const igFormats = ['quote_card', 'photo_overlay'];
  let liI = 0;
  let igI = 0;

  for (const slot of slots) {
    const date = addDays(weekStart, offsetFromMonday(slot.weekday));
    const pillarKey = slot.pillar;
    const pillar = config.pillars[pillarKey];
    const hooks = pillar?.hooks || ['Build systems. Own the outcome.'];
    // rotate hook by date hash
    const hook = hooks[Math.abs(date.split('-').join('').length + pillarKey.length) % hooks.length];
    const resource = pickResource(resources, history, pillarKey);
    if (resource) usedResourceIds.push(resource.id);

    const brand = config.brand;
    const format =
      slot.channel === 'linkedin'
        ? liFormats[liI++ % liFormats.length]
        : igFormats[igI++ % igFormats.length];

    const series = slot.series || null;
    // Prefer explicit format from cadence (e.g. Wellness Wednesday photo)
    const finalFormat = slot.format || format;
    const text =
      slot.channel === 'linkedin'
        ? draftLinkedIn({
            pillar: pillarKey,
            hook,
            resource,
            brand,
            format: finalFormat,
            series,
          })
        : draftInstagram({
            pillar: pillarKey,
            hook,
            resource,
            brand,
            format: finalFormat,
            series,
          });

    const scheduled_local = `${date}T${String(slot.hour).padStart(2, '0')}:${String(slot.minute).padStart(2, '0')}:00`;
    const scheduled_at = toScheduledAt(date, slot.hour, slot.minute);

    const post = {
      id: `${slot.channel}-${date}-${pillarKey}`,
      channel: slot.channel,
      format: finalFormat,
      series,
      pillar: pillarKey,
      pillar_label: pillar?.label || pillarKey,
      theme: `${pillar?.label || pillarKey}: ${hook.slice(0, 60)}`,
      scheduled_local,
      scheduled_at,
      status: 'pending',
      text,
      resource_id: resource?.id || null,
      resource_url: resource?.url || null,
    };
    if (series === 'wellness_wednesday') {
      post.hashtags = ['#WellnessWednesday'];
      post.product = 'Aura';
    }

    if (slot.channel === 'instagram') {
      post.instagram_type = 'post';
      post.graphic_title = hook.slice(0, 80);
      if (format === 'photo_overlay') {
        post.photo_url =
          config.channels.instagram.headshot ||
          'https://lynnfernando.com/images/lynn-fernando.jpg';
      } else {
        post.image = config.channels.instagram.default_image;
      }
    }

    posts.push(post);
  }

  posts.sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at));

  return {
    week_of: weekStart,
    timezone: config.cadence.timezone,
    brand: config.brand.name,
    notes: 'Personal brand growth loop — LinkedIn personal + IG @lynnfernandoofficial only',
    posts,
    used_resource_ids: usedResourceIds,
  };
}

async function scheduleToBuffer(calendar, config) {
  for (const p of config.buffer.env_paths || []) loadEnvFile(p);

  // Prefer the vendored copy (works in cloud CI); fall back to the REV repo path
  // for older local setups.
  const localBuffer = path.join(__dirname, 'lib', 'bufferPublisher.js');
  const bufferPath = fs.existsSync(localBuffer)
    ? localBuffer
    : '/Users/lynnfernan/Lynn Priorities/REV Global/AI Programs/agents/revglobal-agents/agents/bufferPublisher.js';
  const { schedulePost, getChannels } = require(bufferPath);

  if (!process.env.BUFFER_ACCESS_TOKEN) {
    throw new Error('BUFFER_ACCESS_TOKEN missing');
  }

  const channels = await getChannels();
  const liId =
    process.env.BUFFER_LINKEDIN_PROFILE_ID ||
    channels.find((c) => /lynn fernando/i.test(c.displayName || c.name || ''))?.id;
  const igId =
    process.env.BUFFER_INSTAGRAM_PROFILE_ID ||
    channels.find((c) => /lynnfernandoofficial/i.test(c.displayName || c.name || ''))?.id;

  console.log(`Buffer LI: ${liId}`);
  console.log(`Buffer IG: ${igId}`);

  const results = [];
  for (const post of calendar.posts) {
    if (!['pending', 'failed'].includes(post.status)) continue;
    const channelId = post.channel === 'instagram' ? igId : liId;
    if (!channelId) {
      post.status = 'failed';
      post.error = `No Buffer channel for ${post.channel}`;
      results.push({ id: post.id, status: 'failed', error: post.error });
      continue;
    }

    let scheduledAt = post.scheduled_at;
    if (Date.parse(scheduledAt) < Date.now()) {
      scheduledAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
    }

    try {
      const imageUrls =
        post.channel === 'instagram'
          ? Array.isArray(post.slides) && post.slides.length
            ? post.slides
            : Array.isArray(post.image_urls) && post.image_urls.length
              ? post.image_urls
              : post.image
                ? [post.image]
                : []
          : [];

      const result = await schedulePost({
        channelId,
        text: post.text,
        scheduledAt,
        imageUrls: imageUrls.length ? imageUrls : undefined,
        imageUrl: imageUrls[0],
        saveToDraft: Boolean(post.save_to_draft),
        service: post.channel,
        instagramType:
          post.instagram_type === 'carousel' ? 'post' : post.instagram_type || 'post',
      });
      post.status = post.save_to_draft ? 'in_buffer_for_approval' : 'scheduled';
      post.buffer_id = result.id;
      post.buffer_scheduled_at = result.scheduled_at || scheduledAt;
      post.buffer_images_count = imageUrls.length;
      results.push({
        id: post.id,
        status: post.status,
        buffer_id: result.id,
        images: imageUrls.length,
      });
      console.log(
        `  ✓ ${post.id} → Buffer (${imageUrls.length || 0} image(s)${post.save_to_draft ? ', draft' : ''})`
      );
    } catch (e) {
      post.status = 'failed';
      post.error = e.message;
      results.push({ id: post.id, status: 'failed', error: e.message });
      console.log(`  ✗ ${post.id}: ${e.message}`);
    }
  }
  return results;
}

async function sendDigestEmail(calendar, config) {
  for (const p of config.buffer.env_paths || []) loadEnvFile(p);
  loadEnvFile('/Users/lynnfernan/Lynn Priorities/.agents/.env');

  const nodemailer = require('nodemailer');
  const user = process.env.GMAIL_ADDRESS;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) throw new Error('Gmail creds missing');

  const to = config.email.to;
  const lines = calendar.posts.map(
    (p) =>
      `• ${p.scheduled_local.slice(0, 16)} PT | ${p.channel.toUpperCase()} | ${p.status}\n  ${p.theme}\n`
  );

  const subject = `${config.email.subject_prefix} — week of ${calendar.week_of} (${calendar.posts.length} posts)`;
  const text = [
    `Hi Lynn,`,
    ``,
    `Your personal brand growth week is ready.`,
    ``,
    `LinkedIn → personal profile only`,
    `Instagram → @lynnfernandoofficial`,
    ``,
    `SCHEDULE`,
    `--------`,
    ...lines,
    ``,
    `Buffer: posts marked "scheduled" will publish automatically.`,
    `Failed/pending: paste from the digest or re-run the loop.`,
    ``,
    `Site: ${config.brand.site}`,
    ``,
    `— Personal Brand Growth Agent`,
  ].join('\n');

  const html = `<!DOCTYPE html><html><body style="font-family:-apple-system,sans-serif;max-width:640px;margin:24px auto;padding:0 16px;line-height:1.5;color:#222">
  <h2>Personal Brand Growth — week of ${calendar.week_of}</h2>
  <p>LinkedIn (personal) + Instagram (@lynnfernandoofficial)</p>
  <ul>${calendar.posts
    .map(
      (p) =>
        `<li style="margin-bottom:12px"><strong>${p.scheduled_local.slice(0, 16)} PT</strong> · ${p.channel} · <em>${p.status}</em><br/>${p.theme}<br/><pre style="white-space:pre-wrap;background:#f5f5f4;padding:10px;border-radius:8px;font-size:13px">${(p.text || '').replace(/</g, '&lt;').slice(0, 500)}</pre></li>`
    )
    .join('')}</ul>
  <p style="color:#666">— Personal Brand Growth Agent</p>
  </body></html>`;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"${config.email.from_display}" <${user}>`,
    to,
    subject,
    text,
    html,
  });
  console.log(`  ✓ Digest emailed to ${to}`);
}

async function sendTaskEmails(calendar, config) {
  for (const p of config.buffer.env_paths || []) loadEnvFile(p);
  loadEnvFile('/Users/lynnfernan/Lynn Priorities/.agents/.env');
  const nodemailer = require('nodemailer');
  const user = process.env.GMAIL_ADDRESS;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) throw new Error('Gmail creds missing');

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  for (const post of calendar.posts) {
    const subject = `Brand task: ${post.channel.toUpperCase()} — ${post.theme.slice(0, 50)}`;
    const text = [
      `Hi Lynn,`,
      ``,
      `Personal brand task (${post.status}):`,
      `When: ${post.scheduled_local} PT`,
      `Channel: ${post.channel}`,
      ``,
      `COPY`,
      `----`,
      post.text,
      ``,
      post.resource_url ? `Resource: ${post.resource_url}` : '',
      `If Buffer status is "scheduled", you don't need to paste — just review in Buffer.`,
      ``,
      `— Personal Brand Growth Agent`,
    ].join('\n');

    await transporter.sendMail({
      from: `"${config.email.from_display}" <${user}>`,
      to: config.email.to,
      subject,
      text,
    });
    console.log(`  ✓ Task email: ${post.id}`);
    await new Promise((r) => setTimeout(r, 600));
  }
}

function writeDigestMd(calendar, config) {
  const dir = path.join(ROOT, config.paths.digests);
  fs.mkdirSync(dir, { recursive: true });
  const p = path.join(dir, `digest-${calendar.week_of}.md`);
  let md = `# Personal Brand Growth — week of ${calendar.week_of}\n\n`;
  md += `**LinkedIn:** personal · **Instagram:** @lynnfernandoofficial\n\n`;
  for (const post of calendar.posts) {
    md += `## ${post.scheduled_local} · ${post.channel} · ${post.status}\n\n`;
    md += `**Theme:** ${post.theme}\n\n`;
    md += `${post.text}\n\n---\n\n`;
  }
  fs.writeFileSync(p, md);
  return p;
}

async function run() {
  const dryRun = argFlag('dry-run');
  const noBuffer = argFlag('no-buffer') || dryRun;
  const noEmail = argFlag('no-email') || dryRun;
  const emailTasks = argFlag('email-tasks');
  const weekStart = getWeekStart(argValue('week-start'));

  console.log('✦ Lynn Fernando — Personal Brand Growth Loop\n');
  console.log(`Week starting: ${weekStart}`);
  if (dryRun) console.log('(dry-run)\n');

  const config = loadConfig();
  const historyPath = path.join(ROOT, config.paths.history);
  const history = loadJson(historyPath, { resource_ids: [], weeks: [] });

  // 1) Build calendar
  const calendar = buildWeek(config, weekStart, history);
  const calPath = path.join(ROOT, config.paths.calendar);
  saveJson(calPath, calendar);
  console.log(`\nCalendar: ${calendar.posts.length} posts → ${calPath}`);

  // 2) On-brand Instagram graphics (dark/gold) → public URL for Buffer
  const noGraphics = argFlag('no-graphics') || dryRun;
  if (!noGraphics) {
    console.log('\n--- Instagram graphics ---');
    try {
      // generateFromCalendar reads/writes social-calendar-week.json
      const graphics = await generateFromCalendar({ upload: true });
      console.log(`  ✓ ${graphics.length} graphic(s) uploaded to lynnfernando.com/social/ig/`);
      // reload calendar with image URLs
      Object.assign(calendar, JSON.parse(fs.readFileSync(calPath, 'utf8')));
    } catch (e) {
      console.log(`  ⚠ Graphics failed: ${e.message}`);
    }
  } else {
    console.log('\n--- Graphics skipped ---');
  }

  // 3) Buffer
  let bufferResults = [];
  if (!noBuffer && config.buffer.auto_schedule) {
    console.log('\n--- Buffer schedule ---');
    try {
      // ensure we use latest calendar (with image URLs)
      const latest = JSON.parse(fs.readFileSync(calPath, 'utf8'));
      bufferResults = await scheduleToBuffer(latest, config);
      saveJson(calPath, latest);
      Object.assign(calendar, latest);
    } catch (e) {
      console.log(`  ⚠ Buffer skipped: ${e.message}`);
    }
  } else {
    console.log('\n--- Buffer skipped ---');
  }

  // 3) Digest file
  const digestPath = writeDigestMd(calendar, config);
  console.log(`\nDigest: ${digestPath}`);

  // 4) Email
  if (!noEmail && config.email.enabled) {
    console.log('\n--- Email ---');
    try {
      await sendDigestEmail(calendar, config);
      if (emailTasks) await sendTaskEmails(calendar, config);
    } catch (e) {
      console.log(`  ⚠ Email failed: ${e.message}`);
    }
  }

  // 5) History
  history.resource_ids = [
    ...(history.resource_ids || []),
    ...(calendar.used_resource_ids || []),
  ].slice(-200);
  history.weeks = history.weeks || [];
  history.weeks.push({
    week_of: weekStart,
    at: new Date().toISOString(),
    posts: calendar.posts.length,
    scheduled: calendar.posts.filter((p) => p.status === 'scheduled').length,
  });
  saveJson(historyPath, history);

  const scheduled = calendar.posts.filter((p) => p.status === 'scheduled').length;
  console.log(`\n✅ Done — ${scheduled}/${calendar.posts.length} scheduled to Buffer`);
  return { weekStart, posts: calendar.posts.length, scheduled, digestPath };
}

module.exports = { run, buildWeek };

if (require.main === module) {
  run().catch((e) => {
    console.error('FAIL:', e);
    process.exit(1);
  });
}
