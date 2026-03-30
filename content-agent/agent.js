#!/usr/bin/env node
/**
 * Lynn Fernando — Content Agent
 * =====================================================
 * Reads from articles-queue.txt, generates an article
 * in Lynn's voice using the Claude API, writes a ready-
 * to-deploy HTML file into resources/, and regenerates
 * the resources/index.html hub page.
 *
 * Usage:
 *   node agent.js           → write next article in queue
 *   node agent.js --all     → write all articles in queue
 *   node agent.js --index   → regenerate index page only
 *
 * Requires: ANTHROPIC_API_KEY env variable
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const RESOURCES_DIR = path.join(ROOT, 'resources');
const QUEUE_FILE = path.join(__dirname, 'articles-queue.txt');
const MANIFEST_FILE = path.join(__dirname, 'articles-manifest.json');
const VOICE_GUIDE_FILE = path.join(__dirname, 'voice-guide.md');

// ─── Queue Parsing ────────────────────────────────────────────────────────────

function parseQueue(content) {
  return content
    .split(/\n---\n/)
    .map(block => block.trim())
    .filter(Boolean)
    .map(block => {
      const item = {};
      for (const line of block.split('\n')) {
        const match = line.match(/^([A-Z]+(?:\s[A-Z]+)*):\s*(.+)$/);
        if (match) item[match[1].toLowerCase()] = match[2].trim();
      }
      return item;
    })
    .filter(item => item.topic && item.category);
}

function serializeQueue(items) {
  return items
    .map(item => {
      let block = `TOPIC: ${item.topic}\nCATEGORY: ${item.category}`;
      if (item.angle) block += `\nANGLE: ${item.angle}`;
      return block;
    })
    .join('\n\n---\n\n');
}

// ─── Manifest ─────────────────────────────────────────────────────────────────

function loadManifest() {
  if (!fs.existsSync(MANIFEST_FILE)) return [];
  return JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf-8'));
}

function saveManifest(manifest) {
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2) + '\n');
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toSlug(title) {
  return title
    .replace(/<[^>]+>/g, '') // strip html tags
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 70);
}

function formatDisplayDate(isoDate) {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function today() {
  return new Date().toISOString().split('T')[0];
}

// ─── Home Page: Latest Articles Updater ──────────────────────────────────────

function updateHomePageArticles(manifest) {
  const indexPath = path.join(ROOT, 'index.html');
  if (!fs.existsSync(indexPath)) return;

  const articles = manifest.filter(r => r.type === 'article').slice(0, 3);
  if (articles.length === 0) return;

  const [featured, ...rest] = articles;

  const featuredDate = featured.date ? `<span class="resource-article-card__date">${formatDisplayDate(featured.date)}</span>` : '';
  const featuredBlock = `
          <a href="resources/${featured.filename}" class="resource-article-card resource-article-card--featured" target="_blank" rel="noopener">
            <div class="resource-article-card__inner">
              <div class="resource-article-card__meta">
                <span class="resource-article-card__new">New</span>
                <span class="resource-article-card__cat">${featured.category}</span>
                ${featuredDate}
              </div>
              <h3 class="resource-article-card__title">${featured.title}</h3>
              <p class="resource-article-card__desc">${featured.description}</p>
            </div>
            <span class="resource-article-card__cta">Read Now →</span>
          </a>`;

  const restBlocks = rest.map(a => {
    const dateHTML = a.date ? `<span class="resource-article-card__date">${formatDisplayDate(a.date)}</span>` : '';
    return `
          <a href="resources/${a.filename}" class="resource-article-card" target="_blank" rel="noopener">
            <div class="resource-article-card__meta">
              <span class="resource-article-card__cat">${a.category}</span>
              ${dateHTML}
            </div>
            <h3 class="resource-article-card__title">${a.title}</h3>
            <p class="resource-article-card__desc">${a.description}</p>
            <span class="resource-article-card__cta">Read Now →</span>
          </a>`;
  }).join('\n');

  const newBlock = `<!-- LATEST-ARTICLES-START -->
        <div class="resources-group-label">Latest Articles</div>
        <div class="resources-latest-grid">
${featuredBlock}
${restBlocks}
        </div>
        <!-- LATEST-ARTICLES-END -->`;

  const html = fs.readFileSync(indexPath, 'utf-8');
  const updated = html.replace(
    /<!-- LATEST-ARTICLES-START -->[\s\S]*?<!-- LATEST-ARTICLES-END -->/,
    newBlock
  );
  fs.writeFileSync(indexPath, updated);
}

// ─── Article HTML Builder ─────────────────────────────────────────────────────

function buildArticleHTML({ title, slug, metaDescription, heroSubtitle, category, htmlSections, date }) {
  const displayDate = formatDisplayDate(date);
  const year = date ? date.split('-')[0] : new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title.replace(/<[^>]+>/g, '')} — Lynn Fernando</title>
  <meta name="description" content="${metaDescription}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@300;400;500&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../styles.css" />
  <link rel="stylesheet" href="./resources.css" />
  <style>
    .res-author-bio {
      margin-top: 56px;
      padding: 32px 36px;
      background: #111;
      border: 1px solid rgba(201,168,76,0.15);
      border-radius: 4px;
      display: flex;
      gap: 24px;
      align-items: flex-start;
    }
    .res-author-bio__dot {
      width: 4px;
      flex-shrink: 0;
      background: #c9a84c;
      border-radius: 2px;
      align-self: stretch;
    }
    .res-author-bio__text p {
      font-size: 14px;
      color: #8a8a8a;
      line-height: 1.75;
      margin-bottom: 20px;
    }
    .res-content__divider {
      height: 1px;
      background: rgba(255,255,255,0.07);
      margin: 48px 0;
    }
    .res-article-date {
      font-family: 'Montserrat', sans-serif;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.1em;
      color: #555;
      text-transform: uppercase;
      margin-top: 12px;
    }
    @media (max-width: 640px) {
      .res-author-bio { flex-direction: column; gap: 16px; }
      .res-author-bio__dot { width: 48px; height: 4px; align-self: auto; }
    }
  </style>
</head>
<body>

  <!-- NAV -->
  <nav class="res-nav">
    <div class="res-nav__inner">
      <a href="../index.html#resources" class="res-nav__back">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Resources
      </a>
      <a href="../index.html" class="res-nav__logo">Lynn Fernando</a>
      <a href="./index.html" class="res-nav__resources">All Resources</a>
    </div>
  </nav>

  <!-- HERO -->
  <section class="res-hero">
    <div class="res-hero__inner">
      <div class="res-hero__meta">
        <span class="res-hero__tag">${category}</span>
        <span class="res-hero__access res-hero__access--free">Free</span>
      </div>
      <h1 class="res-hero__title">${title}</h1>
      <p class="res-hero__desc">${heroSubtitle}</p>
      ${displayDate ? `<p class="res-article-date">${displayDate}</p>` : ''}
    </div>
  </section>

  <!-- BODY -->
  <main class="res-body">
    <div class="res-content">

${htmlSections}

      <!-- Author Bio -->
      <div class="res-author-bio">
        <div class="res-author-bio__dot"></div>
        <div class="res-author-bio__text">
          <p>Lynn Fernando is a global entrepreneur, investor, and strategic advisor. CEO of REV Global and Co-Founder of the Ayana Foundation. She works with serious leaders building empires across business, investment, and impact.</p>
          <a href="../index.html#contact" class="btn btn-primary" style="width: auto; display: inline-flex;">Work With Lynn</a>
        </div>
      </div>

    </div>
  </main>

  <!-- FOOTER -->
  <footer class="res-footer">
    <div class="res-footer__inner">
      <p class="res-footer__copy">&copy; ${year} Lynn Fernando. All rights reserved.</p>
      <div class="res-footer__links">
        <a href="../index.html">Home</a>
        <a href="./index.html">Resources</a>
        <a href="../index.html#contact">Contact</a>
        <a href="../media-kit.html">Media Kit</a>
      </div>
    </div>
  </footer>

</body>
</html>`;
}

// ─── Resources Index Builder ──────────────────────────────────────────────────

function buildIndexHTML(manifest) {
  // Separate articles (generated) from existing resources
  const articles = manifest.filter(r => r.type === 'article');
  const guides = manifest.filter(r => r.type === 'guide');
  const tools = manifest.filter(r => r.type === 'tool');
  const templates = manifest.filter(r => r.type === 'template');

  function featuredArticleCard(r) {
    const dateHTML = r.date ? `<span class="idx-featured__date">${formatDisplayDate(r.date)}</span>` : '';
    return `
    <a href="./${r.filename}" class="idx-featured">
      <div class="idx-featured__inner">
        <div class="idx-featured__meta">
          <span class="idx-featured__new">New</span>
          <span class="idx-featured__cat">${r.category}</span>
          ${dateHTML}
        </div>
        <h2 class="idx-featured__title">${r.title}</h2>
        <p class="idx-featured__desc">${r.description}</p>
        <span class="idx-featured__cta">Read Now →</span>
      </div>
    </a>`;
  }

  function articleCard(r) {
    const date = r.date ? `<div class="idx-card__date">${formatDisplayDate(r.date)}</div>` : '';
    const tag = `<span class="idx-card__tag">${r.category}</span>`;
    return `
          <a href="./${r.filename}" class="idx-card idx-card--article">
            <div class="idx-card__top">${tag}${date}</div>
            <h3 class="idx-card__title">${r.title}</h3>
            <p class="idx-card__desc">${r.description}</p>
            <span class="idx-card__cta">Read →</span>
          </a>`;
  }

  function resourceCard(r) {
    const typeLabel = { guide: 'Guide', tool: 'Tool', template: 'Template' }[r.type] || r.type;
    return `
          <a href="./${r.filename}" class="idx-card idx-card--resource">
            <div class="idx-card__top"><span class="idx-card__tag">${r.category}</span><span class="idx-card__type">${typeLabel}</span></div>
            <h3 class="idx-card__title">${r.title}</h3>
            <p class="idx-card__desc">${r.description}</p>
            <span class="idx-card__cta">Open →</span>
          </a>`;
  }

  const [newestArticle, ...olderArticles] = articles;

  const articlesSection = articles.length > 0 ? `
    <!-- Featured latest article -->
    ${featuredArticleCard(newestArticle)}

    ${olderArticles.length > 0 ? `
    <!-- Older articles grid -->
    <section class="idx-section" style="margin-top: 48px;">
      <div class="idx-section__header">
        <h2 class="idx-section__title">More <em>Articles</em></h2>
      </div>
      <div class="idx-grid">
        ${olderArticles.map(articleCard).join('')}
      </div>
    </section>` : ''}

    <div class="idx-divider"></div>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Resources — Lynn Fernando</title>
  <meta name="description" content="Guides, articles, frameworks, and tools for leaders building at scale across business, investing, and impact." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@300;400;500&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../styles.css" />
  <link rel="stylesheet" href="./resources.css" />
  <style>
    .idx-hero {
      padding: 80px 24px 64px;
      max-width: 900px;
      margin: 0 auto;
    }
    .idx-hero__eyebrow {
      font-family: 'Montserrat', sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #c9a84c;
      margin-bottom: 16px;
    }
    .idx-hero__title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: clamp(32px, 5vw, 52px);
      font-weight: 300;
      color: #f5f0eb;
      line-height: 1.15;
      margin-bottom: 20px;
    }
    .idx-hero__title em { font-style: italic; }
    .idx-hero__desc {
      font-size: 16px;
      color: #8a8a8a;
      line-height: 1.75;
      max-width: 560px;
    }
    .idx-featured {
      display: block;
      padding: 40px 44px;
      background: #111;
      border: 1px solid rgba(201,168,76,0.15);
      border-radius: 4px;
      text-decoration: none;
      transition: border-color 0.2s;
      margin-bottom: 0;
    }
    .idx-featured:hover { border-color: rgba(201,168,76,0.35); }
    .idx-featured__meta {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    .idx-featured__new {
      font-family: 'Montserrat', sans-serif;
      font-size: 8px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #0a0a0a;
      background: #c9a84c;
      padding: 3px 8px;
      border-radius: 2px;
    }
    .idx-featured__cat {
      font-family: 'Montserrat', sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #c9a84c;
    }
    .idx-featured__date {
      font-family: 'Montserrat', sans-serif;
      font-size: 10px;
      color: #444;
    }
    .idx-featured__title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: clamp(26px, 3.5vw, 38px);
      font-weight: 300;
      color: #f5f0eb;
      line-height: 1.2;
      margin-bottom: 14px;
    }
    .idx-featured__title em { font-style: italic; }
    .idx-featured__desc {
      font-size: 15px;
      color: #8a8a8a;
      line-height: 1.7;
      max-width: 640px;
      margin-bottom: 24px;
    }
    .idx-featured__cta {
      font-family: 'Montserrat', sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #c9a84c;
    }
    .idx-newsletter {
      margin-top: 40px;
      padding: 32px 36px;
      background: #111;
      border: 1px solid rgba(201,168,76,0.2);
      border-radius: 4px;
      max-width: 560px;
    }
    .idx-newsletter__label {
      font-family: 'Montserrat', sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #c9a84c;
      margin-bottom: 8px;
    }
    .idx-newsletter__title {
      font-size: 18px;
      color: #f5f0eb;
      font-weight: 400;
      margin-bottom: 6px;
    }
    .idx-newsletter__sub {
      font-size: 13px;
      color: #666;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .idx-newsletter__form {
      display: flex;
      gap: 10px;
    }
    .idx-newsletter__input {
      flex: 1;
      padding: 11px 16px;
      background: #0a0a0a;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 3px;
      color: #f5f0eb;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }
    .idx-newsletter__input::placeholder { color: #444; }
    .idx-newsletter__input:focus { border-color: rgba(201,168,76,0.4); }
    .idx-newsletter__btn {
      padding: 11px 22px;
      background: #c9a84c;
      color: #0a0a0a;
      font-family: 'Montserrat', sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.2s;
    }
    .idx-newsletter__btn:hover { background: #d4b55a; }
    .idx-body {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 24px 80px;
    }
    .idx-section { margin-bottom: 0; }
    .idx-section__header { margin-bottom: 32px; }
    .idx-section__title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: clamp(24px, 3vw, 34px);
      font-weight: 300;
      color: #f5f0eb;
      margin-bottom: 8px;
    }
    .idx-section__title em { font-style: italic; }
    .idx-section__sub {
      font-size: 14px;
      color: #666;
      line-height: 1.6;
    }
    .idx-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 16px;
    }
    .idx-card {
      display: flex;
      flex-direction: column;
      padding: 24px 22px;
      background: #111;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 3px;
      text-decoration: none;
      transition: border-color 0.2s, background 0.2s;
    }
    .idx-card:hover {
      border-color: rgba(201,168,76,0.25);
      background: #131313;
    }
    .idx-card__top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      gap: 8px;
    }
    .idx-card__tag {
      font-family: 'Montserrat', sans-serif;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #c9a84c;
    }
    .idx-card__type {
      font-family: 'Montserrat', sans-serif;
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #444;
    }
    .idx-card__date {
      font-family: 'Montserrat', sans-serif;
      font-size: 10px;
      color: #444;
    }
    .idx-card__title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 20px;
      font-weight: 400;
      color: #f5f0eb;
      line-height: 1.25;
      margin-bottom: 10px;
    }
    .idx-card__title em { font-style: italic; }
    .idx-card__desc {
      font-size: 13px;
      color: #777;
      line-height: 1.65;
      flex: 1;
      margin-bottom: 16px;
    }
    .idx-card__cta {
      font-family: 'Montserrat', sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #c9a84c;
      margin-top: auto;
    }
    .idx-divider {
      height: 1px;
      background: rgba(255,255,255,0.06);
      margin: 56px 0;
    }
    @media (max-width: 640px) {
      .idx-newsletter__form { flex-direction: column; }
      .idx-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

  <!-- NAV -->
  <nav class="res-nav">
    <div class="res-nav__inner">
      <a href="../index.html" class="res-nav__back">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Home
      </a>
      <a href="../index.html" class="res-nav__logo">Lynn Fernando</a>
      <a href="../index.html#contact" class="res-nav__resources">Contact</a>
    </div>
  </nav>

  <!-- HERO -->
  <div class="idx-hero">
    <p class="idx-hero__eyebrow">Knowledge Library</p>
    <h1 class="idx-hero__title">Resources for <em>Serious Leaders.</em></h1>
    <p class="idx-hero__desc">Guides, articles, frameworks, and tools for leaders building at scale — across business, investing, and impact. All free. No fluff.</p>

    <!-- Newsletter signup -->
    <div class="idx-newsletter">
      <p class="idx-newsletter__label">Newsletter</p>
      <p class="idx-newsletter__title">New resources, straight to your inbox.</p>
      <p class="idx-newsletter__sub">When a new article or guide drops, you'll be the first to know.</p>
      <form class="idx-newsletter__form" action="https://formspree.io/f/mnjgydbk" method="POST">
        <input type="email" name="email" class="idx-newsletter__input" placeholder="your@email.com" required />
        <button type="submit" class="idx-newsletter__btn">Subscribe</button>
      </form>
    </div>
  </div>

  <!-- BODY -->
  <div class="idx-body">

    ${articlesSection}

    <!-- Guides & Resources -->
    <section class="idx-section">
      <div class="idx-section__header">
        <h2 class="idx-section__title">Guides, Tools <em>&amp; Templates</em></h2>
        <p class="idx-section__sub">In-depth frameworks and working tools for operators and leaders.</p>
      </div>
      <div class="idx-grid">
        ${[...guides, ...tools, ...templates].map(resourceCard).join('')}
      </div>
    </section>

  </div>

  <!-- FOOTER -->
  <footer class="res-footer">
    <div class="res-footer__inner">
      <p class="res-footer__copy">&copy; ${new Date().getFullYear()} Lynn Fernando. All rights reserved.</p>
      <div class="res-footer__links">
        <a href="../index.html">Home</a>
        <a href="../index.html#contact">Contact</a>
        <a href="../media-kit.html">Media Kit</a>
      </div>
    </div>
  </footer>

</body>
</html>`;
}

// ─── Claude API Call ──────────────────────────────────────────────────────────

async function generateArticle(client, voiceGuide, item) {
  console.log(`\n  Calling Claude API...`);

  const systemPrompt = `You are a content writer for Lynn Fernando's personal website. Write exclusively in her voice, exactly as described in this style guide:

${voiceGuide}

You must respond with a single valid JSON object — no markdown fences, no commentary, just raw JSON. The object must have exactly these keys:

- "title": The article title as an HTML string. Wrap the last 2-3 words in <em> tags for the italic luxury style. Example: "The Fastest Path to <em>Business Ownership</em>"
- "meta_description": SEO meta description, under 155 characters, no quotes inside.
- "hero_subtitle": One sentence for the hero section, under 120 characters. Direct and sharp.
- "html_sections": The inner HTML body of the article. Use this exact structure:

      <div class="res-content__section">
        <h2>Section Heading</h2>
        <p>Paragraph text...</p>
      </div>

      <div class="res-content__divider"></div>

      <div class="res-content__section">
        <h2>Section Heading</h2>
        <p>Paragraph text...</p>
      </div>

Rules for html_sections:
- 2 to 3 sections separated by <div class="res-content__divider"></div>
- Each section: one h2 + 1 to 2 short paragraphs
- You may include ONE pull quote using: <div class="res-content__pull"><p>"Quote text"</p></div>
- Use <strong style="color: #f5f0eb;"> for emphasis within sentences (sparingly)
- Total word count across all sections: 400–500 words. No more.
- Do not include the author bio or nav — only the content sections`;

  const userMessage = `Write an article for the following brief:

TOPIC: ${item.topic}
CATEGORY: ${item.category}
${item.angle ? `ANGLE: ${item.angle}` : ''}

Remember: professional but accessible, simple and direct, 400–500 words max.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  const raw = response.content[0].text.trim();

  // Strip markdown code fences if present
  const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('\n  Raw response:\n', raw);
    throw new Error(`Failed to parse Claude response as JSON: ${err.message}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const writeAll = args.includes('--all');
  const indexOnly = args.includes('--index');

  // Check API key
  if (!process.env.ANTHROPIC_API_KEY && !indexOnly) {
    console.error('\nError: ANTHROPIC_API_KEY environment variable is not set.');
    console.error('Add it to your shell profile or run:');
    console.error('  ANTHROPIC_API_KEY=your-key node agent.js\n');
    process.exit(1);
  }

  const client = new Anthropic();
  const voiceGuide = fs.readFileSync(VOICE_GUIDE_FILE, 'utf-8');

  // Index-only mode
  if (indexOnly) {
    const manifest = loadManifest();
    const indexHTML = buildIndexHTML(manifest);
    fs.writeFileSync(path.join(RESOURCES_DIR, 'index.html'), indexHTML);
    console.log('✓ Regenerated resources/index.html');
    updateHomePageArticles(manifest);
    console.log('✓ Home page Latest Articles updated');
    return;
  }

  // Read queue
  if (!fs.existsSync(QUEUE_FILE)) {
    console.error('\nError: articles-queue.txt not found.\n');
    process.exit(1);
  }

  const queueContent = fs.readFileSync(QUEUE_FILE, 'utf-8').trim();
  let queue = queueContent ? parseQueue(queueContent) : [];

  if (queue.length === 0) {
    console.log('\nThe queue is empty. Add topics to content-agent/articles-queue.txt to generate content.\n');
    process.exit(0);
  }

  const itemsToProcess = writeAll ? queue : [queue[0]];
  console.log(`\n${'─'.repeat(56)}`);
  console.log(`  Lynn Fernando — Content Agent`);
  console.log(`  Processing ${itemsToProcess.length} article${itemsToProcess.length > 1 ? 's' : ''}`);
  console.log(`${'─'.repeat(56)}`);

  for (const item of itemsToProcess) {
    console.log(`\n→ "${item.topic}"`);
    console.log(`  Category: ${item.category}`);

    try {
      // Generate via Claude
      const data = await generateArticle(client, voiceGuide, item);

      // Build slug and filename
      const slug = toSlug(data.title);
      const filename = `${slug}.html`;
      const date = today();

      // Build HTML
      const html = buildArticleHTML({
        title: data.title,
        slug,
        metaDescription: data.meta_description,
        heroSubtitle: data.hero_subtitle,
        category: item.category,
        htmlSections: data.html_sections,
        date,
      });

      // Write article file
      const outputPath = path.join(RESOURCES_DIR, filename);
      fs.writeFileSync(outputPath, html);
      console.log(`  ✓ Written: resources/${filename}`);

      // Update manifest — prepend new article
      const manifest = loadManifest();
      const existing = manifest.findIndex(r => r.slug === slug);
      const entry = {
        title: data.title,
        slug,
        category: item.category,
        date,
        description: data.meta_description,
        filename,
        type: 'article',
      };
      if (existing >= 0) {
        manifest[existing] = entry;
      } else {
        manifest.unshift(entry);
      }
      saveManifest(manifest);
      console.log(`  ✓ Manifest updated`);

      // Remove processed item from queue
      queue = queue.filter(q => q.topic !== item.topic);
      const newQueue = serializeQueue(queue);
      fs.writeFileSync(QUEUE_FILE, newQueue + (queue.length > 0 ? '\n' : ''));
      console.log(`  ✓ Removed from queue (${queue.length} remaining)`);

      // Regenerate resources index and update home page
      const updatedManifest = loadManifest();
      const indexHTML = buildIndexHTML(updatedManifest);
      fs.writeFileSync(path.join(RESOURCES_DIR, 'index.html'), indexHTML);
      console.log(`  ✓ resources/index.html regenerated`);
      updateHomePageArticles(updatedManifest);
      console.log(`  ✓ Home page Latest Articles updated`);

    } catch (err) {
      console.error(`\n  ✗ Failed: ${err.message}`);
      if (!writeAll) process.exit(1);
    }
  }

  console.log(`\n${'─'.repeat(56)}`);
  console.log(`  Done!`);
  console.log(`\n  Deploy when ready:`);
  console.log(`  bash deploy.sh lynnfernando.com 35.80.180.230 ~/Downloads/LightsailDefaultKey-us-west-2.pem`);
  console.log(`${'─'.repeat(56)}\n`);
}

main().catch(err => {
  console.error('\nFatal error:', err.message);
  process.exit(1);
});
