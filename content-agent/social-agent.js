#!/usr/bin/env node
/**
 * Lynn Fernando — Social Media Agent
 * =====================================================
 * Reads the latest published article and generates
 * 4 platform-specific posts: 2 LinkedIn + 2 Instagram.
 * Output is saved as a .txt file in social-posts/
 *
 * Usage:
 *   node social-agent.js              → generate for latest article
 *   node social-agent.js --slug NAME  → generate for specific article slug
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
const MANIFEST_FILE = path.join(__dirname, 'articles-manifest.json');
const BRAND_GUIDE_FILE = path.join(__dirname, 'brand-guide.md');
const OUTPUT_DIR = path.join(__dirname, 'social-posts');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadManifest() {
  if (!fs.existsSync(MANIFEST_FILE)) return [];
  return JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf-8'));
}

function stripHTML(html) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function readArticleText(filename) {
  const filePath = path.join(RESOURCES_DIR, filename);
  if (!fs.existsSync(filePath)) return null;
  const html = fs.readFileSync(filePath, 'utf-8');
  return stripHTML(html);
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function buildOutputPath(slug) {
  return path.join(OUTPUT_DIR, `${today()}-${slug}-posts.txt`);
}

function formatOutput({ article, posts }) {
  const url = `https://lynnfernando.com/resources/${article.filename}`;
  const separator = '─'.repeat(60);

  return `SOCIAL MEDIA POSTS — ${article.title.replace(/<[^>]+>/g, '')}
Generated: ${new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}
Article URL: ${url}
${'='.repeat(60)}


LINKEDIN — POST 1 (Launch)
${separator}
${posts.linkedin_launch}

${separator}


LINKEDIN — POST 2 (Insight Angle)
${separator}
${posts.linkedin_insight}

${separator}


INSTAGRAM — POST 1 (Launch)
${separator}
${posts.instagram_launch}

${separator}


INSTAGRAM — POST 2 (Pull Quote)
${separator}
${posts.instagram_quote}

${separator}


NOTES
─────
• LinkedIn: Tag accounts manually when pasting — LinkedIn handles don't auto-tag in plain text.
  - Tag: Lynn Fernando, REV Global (and Ayana Foundation where relevant)
• Instagram: Handles are included in captions. Tag from the photo tagger for better reach.
• Add the article URL (above) to your LinkedIn posts before publishing.
• Update your Instagram bio link to: ${url}
`;
}

// ─── Claude API Call ──────────────────────────────────────────────────────────

async function generatePosts(client, brandGuide, article, articleText) {
  const url = `https://lynnfernando.com/resources/${article.filename}`;

  const categoryHashtagMap = {
    'Women in Business': '#WomenInBusiness #WomenEntrepreneurs #FemaleFounders #WomenLeaders #WomenWhoLead #WomenEmpowerment #FemaleLeadership #WomenInLeadership',
    'Starting or Acquiring a Business': '#Entrepreneurship #BusinessAcquisition #BuyABusiness #BusinessOwner #SmallBusiness #StartupLife #AcquireABusiness #BusinessGrowth',
    'Philanthropy & Social Impact': '#SocialImpact #Philanthropy #ImpactInvesting #GivingBack #MakingADifference #PurposeDriven #CommunityImpact #AyanaFoundation',
    'GenAI & Business': '#GenerativeAI #AIStrategy #ArtificialIntelligence #DigitalTransformation #FutureOfWork #AILeadership #GenAI #TechLeadership',
    'Empire Building': '#EmpireBuilding #WealthBuilding #BuildYourEmpire #AmbitiousWomen #FinancialFreedom #LegacyBuilding',
    'Investing': '#AngelInvesting #PrivateEquity #InvestorMindset #WealthManagement #StartupInvesting #InvestSmart #WomenInvest',
  };

  const coreHashtags = '#LynnFernando #REVGlobal #Leadership #EmpireBuilding #BusinessStrategy';
  const categoryHashtags = categoryHashtagMap[article.category] || '#BusinessStrategy #Leadership';
  const includeAyana = ['Philanthropy & Social Impact', 'Women in Business'].includes(article.category);

  const systemPrompt = `You are a social media strategist for Lynn Fernando — global entrepreneur, investor, CEO of REV Global, and Co-Founder of the Ayana Foundation.

Here is the brand guide you must follow:
${brandGuide}

You must respond with a single valid JSON object — no markdown, no commentary, just raw JSON. The object must have exactly these four keys:
- "linkedin_launch": Launch post for LinkedIn (150–250 words). Opens with a strong hook — never starts with "I". Thought leadership tone. Ends with the article URL and 3–5 hashtags. Uses line breaks between short punchy paragraphs.
- "linkedin_insight": A second LinkedIn post with a different angle — share one specific insight or counterintuitive idea from the article (100–180 words). Does NOT just repeat the launch post. Ends with the article URL and 3–5 hashtags.
- "instagram_launch": Instagram caption (80–140 words). Warm and direct. Ends with "Link in bio ↑" instead of the URL. Followed by a blank line, then all hashtags on separate lines. Tags @lynnfernandoofficial and @revglobalinc${includeAyana ? ' and @ayanafoundation_' : ''}.
- "instagram_quote": A second Instagram post built around one powerful line or idea from the article — quote-card style. Short punchy caption (50–80 words), designed to work as a standalone thought. Ends with "Link in bio ↑". Followed by hashtags.

Hashtags to use:
Core (always include): ${coreHashtags}
Category: ${categoryHashtags}

Article URL: ${url}`;

  const userMessage = `Generate 4 social posts for this article:

TITLE: ${article.title.replace(/<[^>]+>/g, '')}
CATEGORY: ${article.category}
URL: ${url}

ARTICLE TEXT:
${articleText.slice(0, 3000)}`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  const raw = response.content[0].text.trim();
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
  const slugIndex = args.indexOf('--slug');
  const targetSlug = slugIndex >= 0 ? args[slugIndex + 1] : null;

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('\nError: ANTHROPIC_API_KEY is not set.\n');
    process.exit(1);
  }

  const manifest = loadManifest();
  const articles = manifest.filter(r => r.type === 'article');

  if (articles.length === 0) {
    console.log('\nNo published articles found in manifest. Generate an article first.\n');
    process.exit(0);
  }

  // Find target article
  const article = targetSlug
    ? articles.find(a => a.slug === targetSlug)
    : articles[0]; // most recent

  if (!article) {
    console.error(`\nArticle not found: ${targetSlug}\n`);
    process.exit(1);
  }

  console.log(`\n${'─'.repeat(56)}`);
  console.log(`  Lynn Fernando — Social Media Agent`);
  console.log(`  Article: "${article.title.replace(/<[^>]+>/g, '')}"`);
  console.log(`${'─'.repeat(56)}`);

  // Read article content
  const articleText = readArticleText(article.filename);
  if (!articleText) {
    console.error(`\n  ✗ Article file not found: resources/${article.filename}\n`);
    process.exit(1);
  }

  const brandGuide = fs.readFileSync(BRAND_GUIDE_FILE, 'utf-8');
  const client = new Anthropic();

  console.log(`\n  Calling Claude API...`);
  const posts = await generatePosts(client, brandGuide, article, articleText);

  // Save output
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const outputPath = buildOutputPath(article.slug);
  const outputText = formatOutput({ article, posts });
  fs.writeFileSync(outputPath, outputText);

  const shortPath = `content-agent/social-posts/${path.basename(outputPath)}`;
  console.log(`  ✓ Posts saved: ${shortPath}`);
  console.log(`\n${'─'.repeat(56)}`);
  console.log(`  Done! Open the file to copy your posts.`);
  console.log(`${'─'.repeat(56)}\n`);
}

main().catch(err => {
  console.error('\nFatal error:', err.message);
  process.exit(1);
});
