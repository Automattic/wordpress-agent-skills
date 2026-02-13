# WordPress Theme Creator Plugin

A Cowork plugin that creates WordPress block themes from simple descriptions and deploys them to a local WordPress Studio site.

## Requirements

- [WordPress Studio](https://developer.wordpress.com/studio/) installed with CLI enabled
- Studio MCP server is registered automatically when Studio is installed

## Installation

### Development mode (session-only)

```bash
claude --plugin-dir /path/to/wp-site-creator
```

### Permanent installation

```bash
claude plugins add /path/to/wp-site-creator
```

## Commands

| Command | Description |
|---|---|
| `/create-site` | Main workflow: describe your site, review specs, choose a design, and deploy the theme to a Studio site |
| `/preview-designs` | Regenerate design options for an existing site specification |
| `/export-theme` | Package the theme as a ZIP, create a shareable preview link, or copy files to another location |

## Skills

| Skill | Description |
|---|---|
| `wordpress-block-theming` | WordPress FSE theme architecture, theme.json, block templates, template parts, and patterns |
| `design-systems` | Bold aesthetic direction guidance, typography, color theory, and avoiding generic "AI slop" |
| `site-specification` | Extract comprehensive site specs from simple descriptions |

## Example Workflow

```
> /create-site I want a theme for my SaaS called Agents for Everyone

[Claude extracts site specifications and presents them for review]

| Field | Value |
|-------|-------|
| Site Name | Agents for Everyone |
| Site Type | SaaS / Technology |
| Primary Goal | Convert visitors to signups |
| Tone | Professional, innovative, approachable |

Does this capture your vision?

> Yes, looks good

[Claude generates 3 design previews as an interactive HTML artifact]
- Option 1: Dark Gradient (neon accents, glowing CTAs)
- Option 2: Clean Minimal (whitespace, strategic color)
- Option 3: Bold Geometric (angular, strong contrasts)

Which direction appeals to you?

> Option 2, but with a darker header

[Claude asks about Studio site — new or existing]
[Creates/selects a Studio site via MCP]
[Generates the full WordPress block theme]
[Writes all theme files to the Studio site]
[Activates the theme and configures the site]

Your theme is live on your local Studio site.

| Detail | Value |
|--------|-------|
| Site URL | http://localhost:8881 |
| Theme | agents-for-everyone |
| Site Path | ~/Studio/agents-for-everyone |

Would you like to iterate on the design, share a preview link, or add more pages?
```

## What Gets Generated

A complete WordPress block theme including:

```
theme-slug/
├── theme.json           # Colors, typography, spacing, layout settings
├── style.css            # Theme metadata + custom CSS
├── functions.php        # Font enqueuing, pattern registration
├── templates/
│   ├── index.html       # Homepage/blog
│   ├── single.html      # Single post
│   ├── page.html        # Page template
│   ├── archive.html     # Archive
│   └── 404.html         # Not found
├── parts/
│   ├── header.html      # Navigation + branding
│   └── footer.html      # Footer content
└── patterns/
    ├── hero.php         # Hero section
    ├── features.php     # Feature grid
    ├── testimonials.php # Social proof
    └── cta.php          # Call to action
```

## MCP Integrations

This plugin requires the **WordPress Studio MCP server** for deploying themes to local WordPress sites. Studio provides:

- Site creation and management (`studio_site_create`, `studio_site_list`)
- File system access (`studio_fs_write_file`)
- WP-CLI execution (`studio_wp`)
- Shareable preview links (`studio_preview_create`)

Design previews are self-contained HTML artifacts with inline CSS.
