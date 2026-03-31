# WordPress Theme Creator Plugin

A Claude Code plugin that creates WordPress block themes through interactive design workflows and deploys them to a local WordPress Studio site.

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
| `/design-site` | Full design workflow: style tiles, page layouts, full mockups with screenshot QA, then WordPress theme build |
| `/quick-build` | Fast workflow: describe site, pick from 3 design previews, deploy theme |
| `/preview-designs` | Generate or regenerate design preview options for a site |

## Workflow Overview

### `/design-site` — Full Design Workflow

A comprehensive 6-phase process that produces high-fidelity designs before building the WordPress theme:

```
Phase 0.5: Studio Setup
Phase 0:   New or Redesign detection
Phase 1:   Brief & Direction Planning (site spec, 3 aesthetic directions)
Phase 2:   Style Tiles (parallel generation, screenshot QA, token extraction)
Phase 3:   Page Layouts (3 layout options, screenshot QA)
Phase 4:   Full Site Mockups (all pages as HTML, screenshot QA)
Phase 5:   WordPress Build (theme generation, deployment, fidelity checks)
```

Each phase produces design artifacts in `<site-path>/design/` and uses a design gallery (`?design-gallery`) for visual review. The workflow pauses for user approval at key gates (style tile selection, layout selection, mockup approval) before proceeding.

### `/quick-build` — Fast Workflow

A streamlined 4-step process for getting a theme deployed quickly:

```
Step 0: Verify Studio environment
Step 1: Gather requirements & extract site spec
Step 2: Create Studio site & design workspace
Step 3: Generate 3 design previews (header + hero only)
Step 4: Build full theme from chosen direction & deploy
```

This workflow generates design previews (header + hero section) rather than full mockups, then extrapolates the chosen direction into a complete theme.

### `/preview-designs` — Design Previews

Generates 3 distinct visual design directions as self-contained HTML files. Used standalone or called by `/quick-build` during its design step.

## Design Artifacts

Both workflows create files under `<site-path>/design/`. The `/design-site` workflow produces the full set:

```
<site-path>/design/
  site-spec.md              # Confirmed site specification (source of truth)
  gallery.json              # Gallery state and artifact tracking
  design-tokens.json        # Locked design tokens (colors, fonts, spacing)
  design-patterns.html      # Component patterns (cards, buttons, embellishments)
  design-package.json       # Layout structure for WordPress build
  import/                   # Content from redesign imports
  inspiration/screenshots/  # Reference screenshots
  styles/                   # Style tile HTML files (Phase 2)
  pages/                    # Page layout HTML files (Phase 3)
  approved/                 # Final mockup HTML files (Phase 4)
  verification/             # Screenshot QA captures
```

The `/quick-build` workflow creates a simpler structure:

```
<site-path>/design/
  design-1.html             # Design preview option 1
  design-2.html             # Design preview option 2
  design-3.html             # Design preview option 3
  <user images>             # Any logos/photos provided by the user
```

## Skills

| Skill | Description |
|---|---|
| `site-specification` | Extract comprehensive site specs from simple descriptions |

## References

| Reference | Description |
|---|---|
| `references/design-system-core.md` | Shared design principles, aesthetics, motion — read by all phase subagents |
| `references/design-system-phase2.md` | Style tiles, embellishments, token extraction — read by Phase 2 subagents |
| `references/design-system-phase3.md` | Page layout, grid math, visual richness — read by Phase 3/4 subagents |
| `references/simple-design-system.md` | Design philosophy, aesthetic guidelines, and layout patterns — read by `/quick-build` and `/preview-designs` subagents |
| `references/wordpress-block-theming.md` | WordPress FSE theme architecture, theme.json, block templates, template parts, and patterns |
| `references/gallery.md` | Gallery mu-plugin setup and gallery.json schema |

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

## Examples

### Full design workflow

```
> /create-wp-site:design-site A modern portfolio site for a photographer named Lena Voss
```

### Quick build

```
> /create-wp-site:quick-build I want a theme for my SaaS called Agents for Everyone
```
