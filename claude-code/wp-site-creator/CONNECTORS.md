# Connectors

## Required: WordPress Studio CLI

This plugin requires the WordPress Studio CLI (`studio` command) to deploy generated themes to a real local WordPress site. No MCP server is needed — the plugin uses the `studio` CLI and direct file system access.

### Commands Used

| CLI Command | Purpose |
|---|---|
| `studio site list` | List existing Studio sites |
| `studio site create --path <path> --name <name> --skip-browser` | Create a new local WordPress site |
| `studio site start --path <path>` | Start an existing site if not running |
| `studio site status --path <path>` | Get site URL and status |
| `studio wp --path <path> <command>` | Run WP-CLI commands (activate theme, set options, create pages) |
| `studio preview create --path <path>` | Create a shareable preview link |

### File Operations

Theme files are written directly to the file system using the Write tool. The theme directory is at `~/Studio/<site>/wp-content/themes/<slug>/`. Directories are created with `mkdir -p` (Bash) before writing files.

### Block Fixer

Block markup validation and fixing is handled by a bundled Node.js script:

```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/block-fixer/cli.js <theme-dir>
```

### Setup

1. Install [WordPress Studio](https://developer.wordpress.com/studio/)
2. Enable the CLI in Studio settings (the `studio` command must be available in your shell)

## Self-Contained Capabilities

These features do not require external services:

| Capability | Implementation |
|---|---|
| Theme generation | Claude's code generation |
| Design previews | HTML artifacts with inline CSS |
