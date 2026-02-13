# WordPress Theme Creator Plugin

A Cowork plugin that creates WordPress block themes from simple descriptions and deploys them to a local WordPress Studio site.

## Requirements

- [WordPress Studio](https://developer.wordpress.com/studio/) installed with CLI enabled
- Studio MCP server is registered automatically when Studio is installed

## Installation

CD into `claude-cowork` folder and ZIP `wp-site-creator` and upload it to your Cowork instance

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
