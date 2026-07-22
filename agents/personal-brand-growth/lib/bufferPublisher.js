// agents/bufferPublisher.js
// ─────────────────────────────────────────────────────────────────────────────
// Buffer GraphQL API client: schedule posts, list channels, check queue
// Docs: https://developers.buffer.com/reference.html
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config({ override: true });

const BASE_URL = 'https://api.buffer.com';
const ACCESS_TOKEN = process.env.BUFFER_ACCESS_TOKEN;

// ── GRAPHQL HELPER ────────────────────────────────────────────────────────────
async function graphql(query, variables = {}) {
  if (!ACCESS_TOKEN) throw new Error('BUFFER_ACCESS_TOKEN not set in .env');

  const res = await fetch(`${BASE_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Buffer HTTP error (${res.status}): ${JSON.stringify(data)}`);
  }

  if (data.errors && data.errors.length > 0) {
    throw new Error(`Buffer GraphQL error: ${data.errors[0].message}`);
  }

  return data.data;
}

// ── GET ORG ID ────────────────────────────────────────────────────────────────
async function getOrgId() {
  const query = `{ account { organizations { id name } } }`;
  const data = await graphql(query);
  return data.account?.organizations?.[0]?.id;
}

// ── GET CHANNELS ──────────────────────────────────────────────────────────────
// Returns connected Buffer channels (LinkedIn, Instagram, etc.)
async function getChannels() {
  const orgId = await getOrgId();
  const query = `
    query GetChannels($orgId: OrganizationId!) {
      channels(input: { organizationId: $orgId }) {
        id
        service
        serviceId
        name
        displayName
      }
    }
  `;
  const data = await graphql(query, { orgId });
  return data.channels || [];
}

// ── SCHEDULE POST ─────────────────────────────────────────────────────────────
// Schedule a post via Buffer GraphQL createPost mutation
// @param {Object} post
//   channelId, text, scheduledAt
//   imageUrl  - single image URL (string)
//   imageUrls - multiple image URLs (carousel) — preferred when available
//   saveToDraft, service ('instagram'|'linkedin'), instagramType
//
// Buffer schema: assets is a LIST of AssetInput, each with image: { url }.
// Multiple image assets = Instagram carousel / multi-image post.
async function schedulePost({
  channelId,
  text,
  scheduledAt,
  imageUrl,
  imageUrls,
  saveToDraft = false,
  service = null, // 'instagram' | 'linkedin' | etc.
  instagramType = 'post', // post | reel | story
  firstComment = null, // auto-posted first comment (supported: instagram, linkedin)
}) {
  if (!channelId || !text || !scheduledAt) {
    throw new Error('Missing required: channelId, text, scheduledAt');
  }

  const input = {
    channelId,
    text,
    schedulingType: 'automatic',
    mode: 'customScheduled',
    dueAt: scheduledAt,
    saveToDraft,
  };

  // Normalize to list of public HTTPS image URLs
  const urls = [];
  if (Array.isArray(imageUrls) && imageUrls.length) {
    for (const u of imageUrls) {
      if (u && typeof u === 'string') urls.push(u);
    }
  } else if (imageUrl) {
    urls.push(imageUrl);
  }

  if (urls.length) {
    // assets: [ { image: { url } }, { image: { url } }, ... ]
    input.assets = urls.map((url) => ({ image: { url } }));
  }

  // Instagram requires type + shouldShareToFeed
  const svc = (service || '').toLowerCase();
  if (svc === 'instagram') {
    input.metadata = {
      instagram: {
        type: instagramType || 'post',
        shouldShareToFeed: true,
        ...(firstComment ? { firstComment } : {}),
      },
    };
  } else if (svc === 'linkedin' && firstComment) {
    input.metadata = { linkedin: { firstComment } };
  }

  const mutation = `
    mutation CreatePost($input: CreatePostInput!) {
      createPost(input: $input) {
        __typename
        ... on PostActionSuccess {
          post {
            id
            status
            dueAt
          }
        }
        ... on InvalidInputError { message }
        ... on RestProxyError { message }
        ... on UnexpectedError { message }
      }
    }
  `;

  const data = await graphql(mutation, { input });
  const result = data.createPost;

  if (result.__typename !== 'PostActionSuccess') {
    throw new Error(`Buffer error (${result.__typename}): ${result.message}`);
  }

  return {
    id: result.post.id,
    status: result.post.status,
    scheduled_at: result.post.dueAt,
  };
}

// ── CREATE IDEA (text-only, no media required) ────────────────────────────────
// Saves a post as a Buffer Idea — appears in Ideas section, add image before publishing
// @param {string} service - Buffer Service enum value: 'instagram', 'linkedin', etc.
async function createIdea({ orgId, service, text, scheduledAt }) {
  if (!orgId || !service || !text) {
    throw new Error('Missing required: orgId, service, text');
  }

  const mutation = `
    mutation CreateIdea($input: CreateIdeaInput!) {
      createIdea(input: $input) {
        __typename
        ... on Idea { id }
        ... on IdeaResponse { idea { id } }
        ... on InvalidInputError { message }
        ... on UnauthorizedError { message }
        ... on LimitReachedError { message }
        ... on UnexpectedError { message }
      }
    }
  `;

  const input = {
    organizationId: orgId,
    content: {
      text,
      services: [service],
      ...(scheduledAt ? { date: scheduledAt } : {}),
    },
  };

  const data = await graphql(mutation, { input });
  const result = data.createIdea;

  if (result.__typename === 'Idea') return { id: result.id };
  if (result.__typename === 'IdeaResponse') return { id: result.idea?.id || 'saved' };

  throw new Error(`Buffer idea error (${result.__typename}): ${result.message}`);
}

// ── GET QUEUED POSTS ──────────────────────────────────────────────────────────
async function getQueuedPosts(channelId) {
  const query = `
    query GetPosts($channelId: String!) {
      channel(id: $channelId) {
        posts(status: scheduled) {
          edges {
            node {
              id
              text
              status
              dueAt
            }
          }
        }
      }
    }
  `;
  const data = await graphql(query, { channelId });
  return data.channel?.posts?.edges?.map(e => e.node) || [];
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
async function run({ posts, dryRun = false }) {
  console.log('📅  Buffer Publisher starting...\n');

  if (!posts || posts.length === 0) {
    console.log('   No posts to schedule.');
    return [];
  }

  const results = [];

  for (const post of posts) {
    try {
      const { channelId, text, scheduledAt, link, imageUrl } = post;
      const postText = link ? `${text}\n\n${link}` : text;

      console.log(`   Scheduling: ${new Date(scheduledAt).toISOString()}`);
      console.log(`   Copy: ${postText.substring(0, 80)}...`);

      if (dryRun) {
        console.log(`   [DRY RUN] Would schedule to Buffer\n`);
        results.push({ ...post, status: 'dry-run', buffer_id: null });
      } else {
        const result = await schedulePost({ channelId, text: postText, scheduledAt, imageUrl, saveToDraft: post.saveToDraft || false });
        const label = post.saveToDraft ? 'Draft saved' : 'Scheduled';
        console.log(`   ✓ ${label}: ${result.id}\n`);
        results.push({ ...post, status: 'scheduled', buffer_id: result.id });
      }
    } catch (error) {
      console.error(`   ✗ Failed: ${error.message}\n`);
      results.push({ ...post, status: 'failed', error: error.message });
    }
  }

  const scheduled = results.filter(r => r.status === 'scheduled').length;
  console.log(`✅  Buffer Publisher done. ${scheduled}/${results.length} scheduled.\n`);
  return results;
}

module.exports = { getChannels, schedulePost, createIdea, getQueuedPosts, run };
