# Connectors

## Required: WordPress Studio MCP Server

This plugin requires the WordPress Studio MCP server to deploy generated themes to a real local WordPress site. Studio is configured in Claude Desktop — Cowork accesses it automatically.

### Tools Used

| Tool | Purpose |
|------|---------|
| `studio_site_list` | List existing Studio sites |
| `studio_site_create` | Create a new local WordPress site |
| `studio_site_start` | Start an existing site if not running |
| `studio_fs_write_file` | Write theme files to the site |
| `studio_wp` | Run WP-CLI commands (activate theme, set options, create pages) |
| `studio_site_status` | Get site URL and status |
| `studio_preview_create` | Create a shareable preview link |
| `studio_block_fix` | Fix invalid block markup in theme template/part files |

### Setup

1. Install [WordPress Studio](https://developer.wordpress.com/studio/)
2. Enable the CLI in Studio settings
3. The MCP server is registered automatically when Studio is installed — no additional configuration needed

No plugin-level MCP configuration is required. Cowork inherits MCP servers from Claude Desktop.

## Self-Contained Capabilities

These features do not require external services:

| Capability | Implementation |
|------------|----------------|
| Theme generation | Claude's code generation |
| Design previews | HTML artifacts with inline CSS |
