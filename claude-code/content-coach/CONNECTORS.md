# Connectors

## Required: WordPress.com MCP Server

This plugin requires the `mcp__wpcom-custom__wpcom-mcp-content-authoring` tool from the `wpcom-custom` MCP server. It provides both content fetching and block notes operations via the STRAP pattern (Single Tool, Resource.Action, Params).

The `wpcom-custom` server is configured in `.mcp.json`:
```json
{
  "mcpServers": {
    "wpcom-custom": {
      "type": "http",
      "url": "https://public-api.wordpress.com/wpcom/v2/mcp/v1"
    }
  }
}
```

### Operations Used

| Operation | Purpose |
|---|---|
| `posts.get` | Fetch post content (title, raw block markup, rendered HTML) with `context=edit` |
| `block-notes.list` | List blocks with their noteIds, and existing notes as threaded trees |
| `block-notes.create` | Create a new note on a block (with `block_index` to associate it) |
| `block-notes.reply` | Reply to an existing note thread on a block |

### STRAP Actions

- **`list`** — Discover all available operations
- **`describe`** — Get the parameter schema for a specific operation
- **`execute`** — Run an operation with params

### Tool Call Examples

**List notes and block map (read-only, no confirmation needed):**
```json
{
  "wpcom_site": "yoursite.wordpress.com",
  "action": "execute",
  "operation": "block-notes.list",
  "params": {
    "post_id": 123
  }
}
```

**Create a note (mutative — requires `user_confirmed`):**
```json
{
  "wpcom_site": "yoursite.wordpress.com",
  "action": "execute",
  "operation": "block-notes.create",
  "params": {
    "post_id": 123,
    "content": "Consider splitting this sentence for readability.",
    "block_index": 2,
    "user_confirmed": "yes"
  }
}
```

**Reply to a note (mutative — requires `user_confirmed`):**
```json
{
  "wpcom_site": "yoursite.wordpress.com",
  "action": "execute",
  "operation": "block-notes.reply",
  "params": {
    "post_id": 123,
    "parent_id": 456,
    "content": "This has been addressed.",
    "user_confirmed": "yes"
  }
}
```

### Safety Policy

The content-authoring tool enforces a safety policy on mutative operations (create, reply). You must:
1. Describe what you plan to do to the user
2. Get their confirmation
3. Include `user_confirmed` with their response in `params`

Read-only operations (`block-notes.list`, `posts.get`) are exempt.

### Setup

Ensure `wpcom-custom` MCP server is configured in your `.mcp.json` and authenticated.

## Self-Contained Capabilities

These features do not require external services:

| Capability | Implementation |
|---|---|
| Readability analysis | Claude's language analysis |
| SEO evaluation | Claude's knowledge of search best practices |
| Content guidelines checks | Pattern matching against skill rules |
| Media accessibility review | Block markup inspection |
