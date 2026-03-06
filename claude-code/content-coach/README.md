# Content Coach Plugin

An AI-powered content reviewer that analyzes WordPress posts and delivers actionable feedback as block notes directly in the editor.

## Requirements

- A WordPress.com site with the block notes feature enabled
- The WordPress.com MCP server with `wpcom-mcp-content-authoring` enabled

## Setup

### Claude Code

Install from the marketplace:

```bash
claude plugin install content-coach-code
```

Or load directly from the directory:

```bash
claude --plugin-dir ./claude-code/content-coach
```

### MCP Server

Add the WordPress.com MCP server to your `.mcp.json`:

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

## Usage

```
/review-content <post-id>
```

Claude will:
1. Fetch the post content and block map in parallel
2. Analyze content across four quality pillars
3. Ask for your confirmation before leaving notes
4. Leave 3–8 concise, actionable block notes in the editor
5. Summarize the findings in chat

## Commands

| Command | Description |
|---|---|
| `/review-content` | Review a WordPress post across four quality pillars and leave feedback as block notes |

## Skills

| Skill | What It Checks |
|---|---|
| `readability` | Sentence/paragraph length, passive voice, word complexity, heading clarity |
| `search-visibility` | Title/H1, heading hierarchy, meta descriptions, internal links, URL slugs |
| `content-guidelines` | Tone consistency, point of view, filler language, unsourced claims |
| `media-accessibility` | Alt text, link text, heading structure, content accessibility |

## How It Works

1. Run `/review-content <post-id>`
2. The plugin fetches the post content via `posts.get` and the block map + notes via `block-notes.list` — both through the `wpcom-mcp-content-authoring` tool
3. Claude analyzes the content across all four pillars using the skill knowledge bases
4. After showing you a summary and getting your confirmation, feedback is delivered as block notes
5. The author sees the notes in the WordPress editor, highlighted on the relevant blocks
