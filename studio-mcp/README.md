# WordPress Studio MCP Server

This project connects [WordPress Studio](https://developer.wordpress.com/studio/) with AI tools via the **Model Context Protocol (MCP)**.

It enables AI assistants (such as **Claude Desktop**) to manage local WordPress sites with natural language:

### 🛠 Site Management

- List, create, start, stop, and delete WordPress sites
- Configure PHP/WordPress versions, custom domains, HTTPS, Xdebug
- Check site status and authentication

### 📁 File System Operations

- List directories, read, write, and delete files
- Safely sandboxed to site directories only

### 🌐 Preview Sites

- Create, update, list, and delete shareable preview links (\*.wp.build)

### ⚡ WP-CLI Integration

- Full access to WP-CLI commands: plugins, themes, posts, pages, users, options, database, and more
- Install plugins, create content, manage settings — all through natural language

## Demo

[![Watch the demo](https://img.youtube.com/vi/so5iux5EEqU/maxresdefault.jpg)](https://youtu.be/so5iux5EEqU)

## Pre-setup

To use this MCP server, you need the **WordPress Studio CLI** available on your machine.

> Note: This pre-setup will be unnecessary once Studio CLI becomes a standalone npm package.

1. Download and install **Studio**: https://developer.wordpress.com/studio/
2. Open **Studio**
3. Go to **Settings** → **Preferences**
4. Enable: **"Enable the studio command in the terminal"**

Verify it works:

```bash
studio --version
```

## Integrate with Claude Desktop

No `npm install` or build step required — `dist/index.js` is a pre-built, self-contained bundle.

1. Open the MCP server configuration:

   - **Claude Desktop**: **Settings** → **Developer** → **Edit Config**

2. Add the MCP server entry:

```json
{
	"mcpServers": {
		"wordpress-studio-mcp-server": {
			"command": "node",
			"args": [ "/ABSOLUTE/PATH/TO/wordpress-agent-skills/studio-mcp/dist/index.js" ]
		}
	}
}
```

3. Quit and reopen the app

## Available Tools

| Category     | Tools                                                                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Sites**    | `studio_site_list`, `studio_site_status`, `studio_site_start`, `studio_site_stop`, `studio_site_create`, `studio_site_delete`, `studio_site_set` |
| **Files**    | `studio_fs_list_dir`, `studio_fs_read_file`, `studio_fs_write_file`, `studio_fs_delete`                                                          |
| **Previews** | `studio_preview_list`, `studio_preview_create`, `studio_preview_update`, `studio_preview_delete`                                                 |
| **Auth**     | `studio_auth_status`, `studio_auth_logout`                                                                                                       |
| **WP-CLI**   | `studio_wp` — run any WP-CLI command (plugins, themes, posts, users, options, etc.)                                                              |
| **Blocks**   | `studio_block_fix` — fix invalid WordPress block markup in theme template and part files                                                         |

## Development notes:

1. Inspector
   - When using the MCP Inspector together with `npm run build:watch`, click “Restart” in the Inspector UI after code changes.
   - File rebuilds happen automatically, but the MCP server process must be restarted.
2. Claude Desktop
   - When developing with `npm run build:watch`, you should quit and reopen Claude Desktop after code changes.
   - Restarting the connector alone may sometimes work (I encountered it a few times), but it is not reliable.

## ⚠️ Platform support

This project officially supports **macOS only**.

> Windows support is **not available yet**, but will be added soon.
