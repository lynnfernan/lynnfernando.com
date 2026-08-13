# Buffer GraphQL API Support Request

**Date:** May 6, 2026  
**Account:** Lynn Fernando (@lynnfernandoofficial)  
**Issue:** Unable to create scheduled Instagram posts via GraphQL API

## What We're Trying to Do

Automate Instagram post scheduling using Buffer's GraphQL API. Posts should:
- Be scheduled for specific dates/times (e.g., May 7, 2026 at 10:00 AM PT)
- Include caption text with UTM parameters
- Be in "customScheduled" mode (scheduled for specific time)

## What Works ✅

1. **Authentication:** Bearer token authentication works correctly
2. **Account Query:** Successfully querying account and organization data
3. **Channels Query:** Successfully retrieving Instagram channels
4. **Organization ID:** `69fbc91cc661baec3b91599f`
5. **Instagram Channel ID:** `69fbca275c4c051afa1a83f9` (@lynnfernandoofficial)

## What Doesn't Work ❌

The `createPost` mutation returns `UnexpectedError` with no error message.

### Mutation Being Attempted

```graphql
mutation {
  createPost(input: {
    channelId: "69fbca275c4c051afa1a83f9"
    text: "Test post content here"
    schedulingType: automatic
    mode: customScheduled
    dueAt: "2026-05-07T17:00:00Z"
  }) {
    ... on PostActionSuccess {
      post {
        id
      }
    }
    __typename
  }
}
```

### Response Received

```json
{
  "data": {
    "createPost": {
      "__typename": "UnexpectedError"
    }
  }
}
```

## API Details Used

- **GraphQL Endpoint:** `https://api.buffer.com/graphql`
- **Authentication:** `Authorization: Bearer {API_KEY}`
- **API Key Type:** Personal Key (generated from Buffer settings)
- **API Status:** Beta (as shown in Buffer UI)

## Questions for Buffer Support

1. Are there account-level permissions or settings required to enable API post creation?
2. Is the `createPost` mutation the correct endpoint for scheduling posts? (vs. other mutation names)
3. What are valid input combinations for the `createPost` mutation?
4. Why is `UnexpectedError` returned with no error details?
5. Are there any known issues with the GraphQL API in beta?
6. Is there required validation or pre-configuration needed before posts can be created via API?

## Context

This is for an automation system that needs to:
- Schedule 8 Instagram posts across 4 content categories
- Posts to be published weekly starting May 7, 2026
- All posts include article links with UTM tracking parameters

## Files Available

- Scheduler Script: `/Users/lynnfernan/Lynn Priorities/Personal Brand/content-agent/buffer-instagram-scheduler.js`
- Configuration: `/Users/lynnfernan/Lynn Priorities/Personal Brand/content-agent/buffer-schedule-config.json`
- Social Posts: `/Users/lynnfernan/Lynn Priorities/Personal Brand/content-agent/social-posts/`

---

**Support Contact:** lynn@revglobalinc.com
