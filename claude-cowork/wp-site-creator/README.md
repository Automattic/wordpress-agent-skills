# WordPress Theme Creator Plugin

A Cowork plugin that creates WordPress block themes from simple descriptions and deploys them to a local WordPress Studio site.

## Requirements

- [WordPress Studio](https://developer.wordpress.com/studio/) installed with CLI enabled
- The WordPress Studio MCP server running and configured in your Claude Desktop (see [studio-mcp/README.md](../../studio-mcp/README.md#integrate-with-claude-desktop) for setup instructions)

## Installation

See the [Quick Start](../../README.md#cowork-plugin) section in the main README for the recommended installation approach.

Manual approach: cd into `claude-cowork` directory in this repository, ZIP `wp-site-creator` and upload it in the plugins section of your Cowork instance (bottom of left panel).

## Commands

| Command | Description |
|---|---|
| `/create-site` | Main workflow: describe your site, review specs, choose a design, and deploy the theme to a Studio site |
| `/preview-designs` | Regenerate design options for an existing site specification |

## Skills

| Skill | Description |
|---|---|
| `wordpress-block-theming` | WordPress FSE theme architecture, theme.json, block templates, template parts, and patterns |
| `design-systems` | Bold aesthetic direction guidance, typography, color theory, and avoiding generic "AI slop" |
| `site-specification` | Extract comprehensive site specs from simple descriptions |

## Example Workflow

```
> /create-site I want a theme for my SaaS called Agents for Everyone
