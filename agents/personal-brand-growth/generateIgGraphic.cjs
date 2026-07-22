// generateIgGraphic.cjs
// On-brand 1080×1080 Instagram cards for Lynn Fernando
// Dark luxury + gold — matches brand-guidelines visual identity
//
// Usage:
//   node generateIgGraphic.cjs --title="Three AI use cases" --label="AI STRATEGY" --out=./out.png
//   node generateIgGraphic.cjs --from-calendar
//   node generateIgGraphic.cjs --from-calendar --upload

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const SHARED =
  '/Users/lynnfernan/Lynn Priorities/REV Global/AI Programs/agents/revglobal-agents/node_modules';
if (fs.existsSync(SHARED)) module.paths.unshift(SHARED);

const { createCanvas, GlobalFonts, loadImage } = require('@napi-rs/canvas');

const ROOT = __dirname;
const OUT_DIR = path.join(ROOT, 'output', 'graphics');
const CAL_PATH = path.join(ROOT, 'data', 'social-calendar-week.json');
const LIBRARY_PATH = path.join(ROOT, 'data', 'asset-library.json');

const COLORS = {
  black: '#0a0a0a',
  dark: '#111111',
  dark2: '#1a1a1a',
  gold: '#c9a84c',
  goldLight: '#e2c47a',
  white: '#ffffff',
  offWhite: '#f5f0eb',
  muted: '#c0b9b0',
};

const PILLAR_LABELS = {
  ai_commercial: 'AI STRATEGY',
  empire_operator: 'EMPIRE BUILDING',
  capital_ownership: 'OWNERSHIP',
  women_founders: 'WOMEN · CAPITAL · ACCESS',
  personal_pov: 'POINT OF VIEW',
};

// Register fonts (macOS system + optional brand)
function registerFonts() {
  const candidates = [
    // macOS
    ['Georgia', '/System/Library/Fonts/Supplemental/Georgia.ttf'],
    ['GeorgiaItalic', '/System/Library/Fonts/Supplemental/Georgia Italic.ttf'],
    ['GeorgiaBold', '/System/Library/Fonts/Supplemental/Georgia Bold.ttf'],
    ['Helvetica', '/System/Library/Fonts/Helvetica.ttc'],
    ['Arial', '/System/Library/Fonts/Supplemental/Arial.ttf'],
    // Linux / cloud CI (apt: fonts-dejavu, fonts-liberation). DejaVu Serif
    // stands in for Georgia; Liberation Sans for Arial/Helvetica.
    ['Georgia', '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'],
    ['GeorgiaBold', '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'],
    ['GeorgiaItalic', '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Italic.ttf'],
    ['Arial', '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'],
    ['Helvetica', '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'],
  ];
  for (const [name, file] of candidates) {
    if (fs.existsSync(file)) {
      try {
        GlobalFonts.registerFromPath(file, name);
      } catch (_) {
        /* ttc may fail; ignore */
      }
    }
  }
}

function wrapText(ctx, text, maxWidth) {
  const words = String(text || '').split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * @param {object} opts
 * @param {string} opts.title - Main headline
 * @param {string} [opts.label] - Gold eyebrow
 * @param {string} [opts.sub] - Optional subline
 * @param {string} [opts.footer] - Bottom brand line
 * @param {string} [opts.outPath] - Output PNG path
 */
/**
 * Photo + dark scrim + gold type (diversify from quote cards)
 */
async function generatePhotoOverlay(opts) {
  registerFonts();
  const W = 1080;
  const H = 1080;
  // Instagram 1:1 + grid safe inset
  const SAFE = 80;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  const title = opts.title || 'Build the machine.';
  const label = (opts.label || 'LYNN FERNANDO').toUpperCase();
  const sub = opts.sub || '';
  const footer = opts.footer || '';
  const photoUrl =
    opts.photoUrl || 'https://lynnfernando.com/images/lynn-fernando.jpg';

  // Photo background (cover)
  try {
    const img = await loadImage(photoUrl);
    const scale = Math.max(W / img.width, H / img.height);
    const iw = img.width * scale;
    const ih = img.height * scale;
    const ix = (W - iw) / 2;
    const iy = (H - ih) / 2;
    ctx.drawImage(img, ix, iy, iw, ih);
  } catch (_) {
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(0, 0, W, H);
  }

  // Dark gradient scrim (bottom-heavy for text)
  const scrim = ctx.createLinearGradient(0, H * 0.25, 0, H);
  scrim.addColorStop(0, 'rgba(10,10,10,0.15)');
  scrim.addColorStop(0.45, 'rgba(10,10,10,0.55)');
  scrim.addColorStop(1, 'rgba(10,10,10,0.92)');
  ctx.fillStyle = scrim;
  ctx.fillRect(0, 0, W, H);

  // Gold top accent (inside safe zone)
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(SAFE, SAFE, 100, 3);

  ctx.fillStyle = COLORS.gold;
  ctx.font = '600 20px Arial';
  ctx.fillText(label, SAFE, SAFE + 48);

  ctx.fillStyle = COLORS.white;
  let fontSize = 48;
  ctx.font = `italic ${fontSize}px Georgia`;
  const maxTitleWidth = W - SAFE * 2 - 8;
  let lines = wrapText(ctx, title, maxTitleWidth);
  while (lines.length > 4 && fontSize > 34) {
    fontSize -= 2;
    ctx.font = `italic ${fontSize}px Georgia`;
    lines = wrapText(ctx, title, maxTitleWidth);
  }
  // Keep title block inside lower safe band (not edge-cropped on grid)
  let y = Math.min(H - SAFE - 160, H - 280);
  for (const ln of lines.slice(0, 4)) {
    ctx.fillText(ln, SAFE + 4, y);
    y += fontSize * 1.15;
  }

  y += 14;
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(SAFE + 4, y, 56, 2);
  y += 36;

  if (sub) {
    ctx.fillStyle = COLORS.offWhite;
    ctx.font = '24px Arial';
    ctx.fillText(sub.slice(0, 60), SAFE + 4, Math.min(y, H - SAFE - 24));
  }

  // Optional bottom-right handle only (skip if empty / clean mode)
  if (footer && footer.trim()) {
    ctx.fillStyle = COLORS.muted;
    ctx.font = '18px Arial';
    const fw = ctx.measureText(footer).width;
    ctx.fillText(footer, W - SAFE - fw, H - SAFE + 8);
  }

  fs.mkdirSync(path.dirname(opts.outPath), { recursive: true });
  fs.writeFileSync(opts.outPath, canvas.toBuffer('image/png'));
  return opts.outPath;
}

/**
 * Text-only quote layouts (2025–26 IG trends, luxury dark/gold):
 * - bold oversized type that fills the frame (less dead whitespace)
 * - high contrast, short quote, mobile-first
 * - subtle brand, no name footer
 * Layouts: hero | bar | stacked
 */
async function generateQuoteCard(opts) {
  registerFonts();
  const W = 1080;
  const H = 1080;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  const title = opts.title || 'Build the machine.';
  const label = (opts.label || 'INSIGHT').toUpperCase();
  const sub = opts.sub || '';
  const footer = opts.footer || '';
  // Lynn preferred defaults for text-only quotes: bar, then stacked (no hero)
  const layouts = ['bar', 'stacked'];
  const layout =
    opts.layout && layouts.includes(opts.layout)
      ? opts.layout
      : opts.layout === 'hero'
        ? 'bar' // map retired hero → bar
        : layouts[Math.abs(String(title).length + String(label).length) % layouts.length];

  // Base black + soft grain via second rect
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0d0d0d');
  bg.addColorStop(0.5, '#121212');
  bg.addColorStop(1, '#0a0a0a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Giant watermark quote mark (editorial trend)
  ctx.fillStyle = 'rgba(201,168,76,0.08)';
  ctx.font = 'italic 420px Georgia';
  ctx.fillText('“', layout === 'bar' ? 100 : -20, layout === 'stacked' ? 520 : 480);

  // Match IG grid safe zone (config safe_zone_px: 80)
  const margin = 80;
  const maxTitleWidth = layout === 'bar' ? W - 200 : W - margin * 2;

  // Fit type LARGE — fill vertical space (trend: bold type as the design)
  let fontSize = 92;
  ctx.font = `italic ${fontSize}px Georgia`;
  let lines = wrapText(ctx, title, maxTitleWidth);
  while (
    (lines.length > 4 || lines.some((l) => ctx.measureText(l).width > maxTitleWidth)) &&
    fontSize > 48
  ) {
    fontSize -= 2;
    ctx.font = `italic ${fontSize}px Georgia`;
    lines = wrapText(ctx, title, maxTitleWidth);
  }
  if (lines.length > 5) {
    lines = lines.slice(0, 5);
    lines[4] = lines[4].replace(/\s+\S*$/, '') + '…';
  }
  const lineHeight = fontSize * 1.12;
  const blockH = lines.length * lineHeight;

  if (layout === 'bar') {
    // Full-height gold bar (editorial / freeform)
    ctx.fillStyle = COLORS.gold;
    ctx.fillRect(0, 0, 28, H);
    // Accent block top
    ctx.fillStyle = COLORS.dark2;
    ctx.fillRect(28, 0, W - 28, 160);
    ctx.fillStyle = COLORS.gold;
    ctx.font = '700 22px Arial';
    ctx.fillText(label, 64, 90);
    if (sub) {
      ctx.fillStyle = COLORS.muted;
      ctx.font = '22px Arial';
      ctx.fillText(sub.slice(0, 48), 64, 128);
    }
    // Dense type block middle-left
    let y = (H - blockH) / 2 + fontSize * 0.2;
    y = Math.max(y, 220);
    ctx.fillStyle = COLORS.white;
    ctx.font = `italic ${fontSize}px Georgia`;
    for (const ln of lines) {
      ctx.fillText(ln, 64, y);
      y += lineHeight;
    }
    // Bottom gold strip
    ctx.fillStyle = COLORS.gold;
    ctx.fillRect(28, H - 12, W - 28, 12);
  } else if (layout === 'stacked') {
    // Tight stacked card — type owns center, less void
    ctx.strokeStyle = 'rgba(201,168,76,0.45)';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, W - 80, H - 80);

    ctx.fillStyle = COLORS.gold;
    ctx.font = '700 20px Arial';
    ctx.fillText(label, 80, 120);

    // Thin double rule
    ctx.fillStyle = COLORS.gold;
    ctx.fillRect(80, 148, 160, 2);
    ctx.fillRect(80, 156, 80, 1);

    let y = 240;
    ctx.fillStyle = COLORS.white;
    ctx.font = `italic ${fontSize}px Georgia`;
    for (const ln of lines) {
      ctx.fillText(ln, 80, y);
      y += lineHeight;
    }
    y += 36;
    ctx.fillStyle = COLORS.gold;
    ctx.fillRect(80, y, 100, 3);
    y += 48;
    if (sub) {
      ctx.fillStyle = COLORS.offWhite;
      ctx.font = '26px Arial';
      for (const ln of wrapText(ctx, sub, maxTitleWidth - 40).slice(0, 3)) {
        ctx.fillText(ln, 80, y);
        y += 36;
      }
    }
    // Bottom filled band (kills empty bottom third)
    ctx.fillStyle = COLORS.dark2;
    ctx.fillRect(40, H - 140, W - 80, 100);
    ctx.fillStyle = COLORS.gold;
    ctx.font = '700 18px Arial';
    ctx.fillText('WELLNESS · SYSTEMS · OWNERSHIP', 80, H - 80);
  } else {
    // HERO — default: oversized type fills mid-frame, centered vertically with purpose
    // Top meta bar
    ctx.fillStyle = 'rgba(26,26,26,0.95)';
    ctx.fillRect(0, 0, W, 120);
    ctx.fillStyle = COLORS.gold;
    ctx.fillRect(0, 120, W, 3);
    ctx.font = '700 20px Arial';
    ctx.fillText(label, margin, 72);

    // Center type block (use more of canvas)
    let y = (H - blockH) / 2 + fontSize * 0.35;
    // Bias slightly up so it doesn't float in bottom void
    y = Math.min(Math.max(y, 280), 360);
    ctx.fillStyle = COLORS.white;
    ctx.font = `italic ${fontSize}px Georgia`;
    for (const ln of lines) {
      ctx.fillText(ln, margin, y);
      y += lineHeight;
    }
    y += 28;
    ctx.fillStyle = COLORS.gold;
    ctx.fillRect(margin, y, 120, 4);
    y += 52;
    if (sub) {
      ctx.fillStyle = COLORS.offWhite;
      ctx.font = '28px Arial';
      for (const ln of wrapText(ctx, sub, maxTitleWidth).slice(0, 2)) {
        ctx.fillText(ln, margin, y);
        y += 38;
      }
    }
    // Bottom edge accent (fills empty bottom)
    ctx.fillStyle = COLORS.gold;
    ctx.fillRect(0, H - 16, W, 16);
    // Soft side frame
    ctx.fillStyle = 'rgba(201,168,76,0.12)';
    ctx.fillRect(0, 123, 16, H - 139);
  }

  if (footer && footer.trim()) {
    ctx.fillStyle = COLORS.muted;
    ctx.font = '18px Arial';
    const fw = ctx.measureText(footer).width;
    ctx.fillText(footer, W - margin - fw, H - 36);
  }

  fs.mkdirSync(path.dirname(opts.outPath), { recursive: true });
  fs.writeFileSync(opts.outPath, canvas.toBuffer('image/png'));
  return { path: opts.outPath, layout };
}

async function generateGraphic(opts) {
  if (opts.format === 'photo_overlay') {
    return generatePhotoOverlay(opts);
  }
  // Default text-only = modern quote layouts
  return generateQuoteCard({
    ...opts,
    footer: opts.footer === undefined ? '' : opts.footer,
  });
}

function headlineFromPost(post) {
  // Prefer theme; clean for display
  let t = post.theme || post.text?.split('\n')[0] || 'Lynn Fernando';
  t = t.replace(/^[^:]+:\s*/, ''); // strip pillar prefix
  if (t.length > 90) t = t.slice(0, 87) + '…';
  return t;
}

function subFromPost(post) {
  if (post.resource_url) return 'Free resource · link in bio';
  return 'lynnfernando.com';
}

async function generateFromCalendar({ upload = false } = {}) {
  const calendar = JSON.parse(fs.readFileSync(CAL_PATH, 'utf8'));
  const results = [];

  for (const post of calendar.posts) {
    if (post.channel !== 'instagram') continue;

    const label =
      PILLAR_LABELS[post.pillar] ||
      post.creative_label ||
      'LYNN FERNANDO';
    const outName = `${post.id}.png`;
    const outPath = path.join(OUT_DIR, outName);

    const format =
      post.format ||
      post.creative?.format ||
      (post.image_style === 'photo' ? 'photo_overlay' : 'quote_card');

    // Skip graphic generation for photo-native posts that use a live headshot URL only
    if (format === 'native_photo' && post.image && post.image.startsWith('http')) {
      results.push({ id: post.id, outPath: null, publicUrl: post.image, skipped: true });
      console.log(`⏭  Native photo (no render): ${post.id}`);
      continue;
    }

    const result = await generateGraphic({
      title: post.graphic_title || headlineFromPost(post),
      label: post.graphic_label || label,
      sub: post.graphic_sub || subFromPost(post),
      footer: '', // clean text cards — no name/handle on image
      noLogo: true,
      outPath,
      format: format === 'photo_overlay' ? 'photo_overlay' : 'quote_card',
      photoUrl: post.photo_url || post.image,
      layout: post.quote_layout,
    });

    const layoutUsed =
      result && typeof result === 'object' ? result.layout : format;
    post.image_local = outPath;
    post.creative = {
      format: format === 'photo_overlay' ? 'photo_overlay' : 'quote_card',
      layout: layoutUsed,
      label: post.graphic_label || label,
      size: '1080x1080',
      palette: 'dark_gold',
      design: 'ig_quote_2026_dense',
    };

    const publicUrl = `https://lynnfernando.com/social/ig/${outName}`;
    post.image = publicUrl;
    results.push({ id: post.id, outPath, publicUrl, layout: layoutUsed });
    console.log(`✓ Graphic: ${outPath}${layoutUsed ? ` [${layoutUsed}]` : ''}`);
  }

  if (upload && results.length) {
    uploadGraphics(results.map((r) => r.outPath).filter(Boolean));
  }

  fs.writeFileSync(CAL_PATH, JSON.stringify(calendar, null, 2) + '\n');
  return results;
}

function uploadGraphics(filePaths) {
  const key = `${process.env.HOME}/.ssh/lightsail-key.pem`;
  const host = 'admin@35.80.180.230';
  const remoteDir = '/usr/share/nginx/html/social/ig';

  console.log('\nUploading to lynnfernando.com/social/ig/ …');
  execFileSync('ssh', [
    '-i',
    key,
    '-o',
    'StrictHostKeyChecking=no',
    host,
    `sudo mkdir -p ${remoteDir} && sudo chown admin:admin ${remoteDir}`,
  ]);

  for (const file of filePaths) {
    const base = path.basename(file);
    execFileSync('scp', [
      '-i',
      key,
      '-o',
      'StrictHostKeyChecking=no',
      file,
      `${host}:${remoteDir}/${base}`,
    ]);
    console.log(`  ↑ ${base}`);
  }
  // ensure world-readable
  execFileSync('ssh', [
    '-i',
    key,
    '-o',
    'StrictHostKeyChecking=no',
    host,
    `sudo chmod -R a+r ${remoteDir}`,
  ]);
  console.log('✓ Upload complete');
}

async function main() {
  const fromCal = process.argv.includes('--from-calendar');
  const upload = process.argv.includes('--upload');

  if (fromCal) {
    const results = await generateFromCalendar({ upload });
    console.log(`\nDone: ${results.length} Instagram graphic(s)`);
    return;
  }

  const title =
    (process.argv.find((a) => a.startsWith('--title=')) || '').slice(8) ||
    'Build the machine.';
  const label =
    (process.argv.find((a) => a.startsWith('--label=')) || '').slice(8) ||
    'EMPIRE BUILDING';
  const out =
    (process.argv.find((a) => a.startsWith('--out=')) || '').slice(6) ||
    path.join(OUT_DIR, 'sample.png');

  await generateGraphic({
    title: decodeURIComponent(title.replace(/\+/g, ' ')),
    label: decodeURIComponent(label.replace(/\+/g, ' ')),
    sub: 'lynnfernando.com',
    outPath: out,
  });
  console.log('✓', out);
  if (upload) uploadGraphics([out]);
}

module.exports = {
  generateGraphic,
  generateFromCalendar,
  uploadGraphics,
  PILLAR_LABELS,
};

if (require.main === module) {
  main().catch((e) => {
    console.error('FAIL:', e);
    process.exit(1);
  });
}
