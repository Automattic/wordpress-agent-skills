# Gallery

A WordPress mu-plugin that serves a design gallery from within the Studio site. The agent drops the plugin once, then only updates `gallery.json` — the gallery reads it on each request and auto-polls for changes every 3 seconds.

## Setup (Phase 0.5)

Copy the mu-plugin into the Studio site and get the site URL:

```bash
mkdir -p <site-path>/wp-content/mu-plugins
cp ${CLAUDE_PLUGIN_ROOT}/templates/design-gallery.php <site-path>/wp-content/mu-plugins/
```

Then run `studio site status --path <site-path>` to get the site URL. Store it — you'll need it for `gallery.json` and for opening the gallery.

## Output Directory Structure

All design outputs live inside the Studio site at `<site-path>/design/`. Theme files go to `<site-path>/wp-content/themes/<slug>/`.

```
<site-path>/design/
├── gallery.json                 # Project metadata — single source of truth for the gallery
│
├── import/                      # Phase 0 artifacts (redesign only)
│   └── content-summary.json
│
├── inspiration/                 # Phase 1 artifacts
│   ├── refs.json
│   └── screenshots/
│
├── styles/                      # Phase 2 artifacts
│   ├── v1-tile1.html
│   ├── v1-tile2.html
│   ├── v1-tile3.html
│   └── ...
│
├── pages/                       # Phase 3 artifacts
│   ├── v1-layout1.html
│   ├── v1-layout2.html
│   ├── v1-layout3.html
│   └── ...
│
├── approved/                    # Phase 4 artifacts
│   ├── homepage.html
│   ├── about.html
│   └── ...
│
├── design-tokens.json
├── design-patterns.html
├── design-package.json
├── site-spec.json
├── image-prompts.json
├── image-generation-status.json
└── image-generation.log
```

## Naming Conventions

- Style tiles: `v1-tile1.html`, `v1-tile2.html`, `v1-tile3.html`, then `v2-tile1.html`, etc.
- Page layouts: `v1-layout1.html`, `v1-layout2.html`, `v1-layout3.html`, then `v2-layout1.html`, etc.
- Latest version is always the highest number. Never overwrite — always create the next version.
- No restart naming (`-r2`) — just keep incrementing.
- `design-tokens.json` and `design-package.json` live at `<site-path>/design/` root (contracts, not visual artifacts).

## Image Paths in Design Artifacts

User-supplied images (logos, photos) live in `<site-path>/design/` while HTML artifacts live in subdirectories (`styles/`, `pages/`, `approved/`). This creates a path problem: relative paths like `../logo.png` work when files are opened directly in a browser, but break inside the gallery iframe (served via `?design-asset=`).

**Solution — dual-path `<img>` tags:** Use an `onerror` fallback so images resolve in both contexts:

```html
<img src="../logo.png" onerror="this.onerror=null;this.src='/?design-asset=logo.png'" alt="...">
```

- **Direct file access**: `../logo.png` resolves correctly (up from `styles/` to `design/`)
- **Gallery iframe**: The relative path fails, `onerror` fires, loads via the gallery's `?design-asset=` route

Apply this pattern to ALL user-supplied images in style tiles, page layouts, and approved mockups. The `?design-asset=` route serves images with correct MIME types (png, jpg, webp, svg, etc.).

## gallery.json Schema

Written by the orchestrator during gallery scaffolding. Updated as phases progress. This is the **single source of truth** — the mu-plugin reads it on every request.

```json
{
  "project": "Site Name",
  "brief": "One-line description",
  "phase": "styles",
  "startedAt": "2026-02-06T18:00:00Z",
  "siteUrl": "http://localhost:PORT",
  "references": [
    {
      "url": "https://example.com",
      "title": "Site Name",
      "notes": "What's interesting about this reference"
    }
  ],
  "artifacts": {
    "styles": [
      { "file": "styles/v1-tile1.html", "version": 1, "label": "Tile 1: Mood Name", "colors": ["#hex1", "#hex2"] }
    ],
    "pages": [],
    "approved": []
  },
  "tokens": null,
  "themeSlugs": []
}
```

### Field Reference

| Field | Type | Description |
|-------|------|-------------|
| `project` | string | Site name from the brief |
| `brief` | string | One-line site description |
| `phase` | string | Current phase: `inspiration`, `styles`, `pages`, `approved`, `theme` |
| `startedAt` | string | ISO 8601 timestamp |
| `siteUrl` | string | Studio site URL (from `studio site status`) |
| `references` | array | URL references from Phase 1 (empty array if none) |
| `artifacts` | object | Artifact arrays keyed by phase (`styles`, `pages`, `approved`) |
| `tokens` | object/null | Design tokens (set when tokens are locked in Phase 2) |
| `themeSlugs` | array | Theme folder names created in Phase 5 |

### Artifact Object

```json
{ "file": "styles/v1-tile1.html", "version": 1, "label": "Tile 1: Mood Name", "colors": ["#hex1", "#hex2"] }
```

- `file` — path relative to `design/`, including the phase directory prefix (e.g., `styles/v1-tile1.html`, `pages/v1-layout1.html`, `approved/homepage.html`).
- `version` — integer version number
- `label` — **required** — short, descriptive mood/theme name shown in the sidebar (e.g., "Butcher Block", "Smoke House", "Street Cart"). Never leave blank or use generic names like "v1" or "Tile 1". For style tiles use the mood/aesthetic name; for page layouts use the layout approach name.
- `colors` — array of hex colors for the color dots in the sidebar

### Tokens Object (when set)

```json
{
  "colors": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "light": { "background": "#hex", "surface": "#hex" },
    "dark": { "background": "#hex", "surface": "#hex" }
  },
  "typography": {
    "heading": { "family": "Font Name" },
    "body": { "family": "Font Name" }
  },
  "spacing": { "density": "comfortable" },
  "motion": { "level": "subtle" }
}
```

## How the Agent Interacts

The orchestrator owns gallery state. Subagents NEVER touch `gallery.json`.

**Phase 0.5** — Copy mu-plugin, get site URL.

**Phase 2 (scaffold)** — Create directory structure, write initial `gallery.json`, open gallery in browser.

**Phase 2 (tiles)** — Subagents write tile HTML files. Orchestrator updates `gallery.json` artifacts. Gallery auto-refreshes.

**Phase 2 (lock)** — Update `gallery.json`: set `phase` to `pages`, add `tokens` object.

**Phase 3** — Subagent writes layout HTML files. Orchestrator updates `gallery.json` artifacts.

**Phase 4** — Subagent writes approved page HTML files. Orchestrator updates `gallery.json`: set `phase` to `approved`, add files to `artifacts.approved`.

**Phase 5** — Subagent builds WordPress theme. Orchestrator updates `gallery.json`: set `phase` to `theme`, add theme slug to `themeSlugs`.

## Gallery URL

```
http://<site-url>/?design-gallery
```

Open once after scaffolding. The gallery auto-polls — no need to refresh or re-open.
