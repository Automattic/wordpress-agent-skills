# WordPress Theme Creator Plugin

A Claude Code plugin that creates WordPress block themes from simple descriptions and deploys them to a local WordPress Studio site.

## Requirements

- [WordPress Studio](https://developer.wordpress.com/studio/) installed with CLI enabled (`studio` command available in your shell)

## Installation

Test locally during development:

```bash
claude --plugin-dir ./claude-code/wp-site-creator
```

## Commands

| Command | Description |
|---|---|
| `/quick-build` | Main workflow: describe your site, review specs, choose a design, and deploy the theme to a Studio site |
| `/preview-designs` | Regenerate design options for an existing site specification |

## Skills

| Skill | Description |
|---|---|
| `wordpress-block-theming` | WordPress FSE theme architecture, theme.json, block templates, template parts, and patterns |
| `design-system-core` | Shared creative foundations — WCAG rules, image cohesion, design thinking, frontend aesthetics |
| `design-system-phase2` | Style tile generation, embellishments, and design token extraction |
| `design-system-phase3` | Page layout composition, grid math, section patterns, visual richness |
| `site-specification` | Extract comprehensive site specs from simple descriptions |

### References

| Reference | Description |
|---|---|
| `references/design-system-core.md` | Shared design principles, aesthetics, motion — read by all phase subagents |
| `references/design-system-phase2.md` | Style tiles, embellishments, token extraction — read by Phase 2 subagents |
| `references/design-system-phase3.md` | Page layout, grid math, visual richness — read by Phase 3/4 subagents |
| `references/simple-design-system.md` | Design philosophy, aesthetic guidelines, and layout patterns — read by subagents at execution time (not auto-loaded) |

## Telemetry

This plugin collects anonymous, count-only usage statistics to help us understand how the commands are used and how far through the workflow users get. No user identity, machine fingerprints, site names, file paths, or personal data are collected — just simple counters (a group name + stat name + daily count).

**What's tracked:**

| Group | Stat | When |
|---|---|---|
| `agent-site-builder` | `started` | `/quick-build` invoked |
| `agent-site-builder` | `theme-activated` | Theme deployed and activated |

**Opt out:** Set the environment variable before running Claude:

```bash
export WP_SITE_CREATOR_NO_TELEMETRY=1
```

## Example Workflow

```
> /create-a-wp-site:quick-build I want a theme for my SaaS called Agents for Everyone
```
