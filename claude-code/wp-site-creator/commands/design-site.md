---
description: Design a WordPress site, starting with a clear design direction and style tokens, then intial page layouts, followed by a full custom theme build with content pages deployed to a local Studio site
argument-hint: "<site description>"
disable-model-invocation: true
---

# Design Site — Orchestrator

You are a workflow orchestrator. Delegate heavy creative work to Task() subagents that read reference files at execution time. You do NOT hold design system knowledge — the references do.

## Reference Paths

- `${CLAUDE_PLUGIN_ROOT}/references/design-system-core.md` — shared design principles, aesthetics, rules
- `${CLAUDE_PLUGIN_ROOT}/references/design-system-phase2.md` — style tiles, embellishments, token extraction
- `${CLAUDE_PLUGIN_ROOT}/references/design-system-phase3.md` — page layout composition, grid math, visual richness
- `${CLAUDE_PLUGIN_ROOT}/references/wordpress-block-theming.md` — WordPress theme architecture, block markup
- `${CLAUDE_PLUGIN_ROOT}/references/gallery.md` — gallery mu-plugin setup, gallery.json schema

**Already in your context** (auto-loaded, do NOT read or load these — they're already here): `site-specification`

## Path Conventions

All design outputs: `<site-path>/design/`. Theme files: `<site-path>/wp-content/themes/<slug>/`. `<site-path>` is set in Phase 0.5. Use absolute paths in all tool calls.

Key subdirectories: `design/{import,inspiration/screenshots,styles,pages,approved}` plus `design-tokens.json`, `design-package.json`, `site-spec.json`, `gallery.json` at the design root. Gallery is served at `http://<site-url>/?design-gallery`.

## Trigger

User runs `/design-site` with a site description, or asks to design/build/make a WordPress site.

## Workflow

```
0.5 Studio Setup → 0 New/Redesign? → 1 Brief + Directions → 2 Style Tiles (Task) → 3 Page Design (Task) → 4 Full Mockup (Task) → 5 WP Build (Task)
```

---

## Phase 0.5: Studio Environment Setup

Before any design work begins, confirm that WordPress Studio is installed, the CLI is active, and establish the site path that all subsequent phases will use.

1. Run `studio site list` (Bash) to get all existing site paths.
2. **If the command fails** (non-zero exit code, "command not found", or connection error): Studio is either not installed or its CLI is not enabled. Tell the user:

   "It looks like either WordPress Studio is not installed, or the CLI is not turned on.

   - **To install WordPress Studio:** <https://developer.wordpress.com/studio/>
   - **To enable the CLI:** <https://developer.wordpress.com/docs/developer-tools/studio/cli/>

   Once Studio is installed and the CLI is enabled, run `/design-site` again."

   **Stop here** — do not proceed with the rest of the workflow.

3. **If the command succeeds**, derive the Studio home folder:
   - If sites exist, extract the common parent directory from their paths (e.g., if sites are at `~/Studio/my-site` and `~/Studio/another`, the Studio home is `~/Studio`)
   - If no sites exist yet, default to `~/Studio`
4. **Resolve the Studio home to an absolute path** (expand `~`) and store it as `STUDIO_HOME`
5. **Check the current working directory** against `STUDIO_HOME`:
   - If the current working directory **is** `STUDIO_HOME` (or a subdirectory of it): proceed — the agent is in the right place
   - Note that in MacOS dir names are case-insensitive, so treat `~/studio` and `~/Studio` as the same path
   - If the current working directory is **not** within `STUDIO_HOME`: tell the user:

     "It looks like you're running Claude from `<current-dir>`, but your Studio sites live in `<STUDIO_HOME>`.

     You have two options:
     1. **Re-run Claude from the Studio folder** — `cd <STUDIO_HOME>` and start a new session
     2. **Tell me the path** — if your Studio sites are in a different location, let me know and I'll use that

     Which would you prefer?"

     Wait for the user's response. If they provide a path, validate it exists and update `STUDIO_HOME` accordingly. If they choose to re-run, stop here.

6. Ask the user: use an existing Studio site or create a new one?
7. If **new**: derive a theme slug from the site name (kebab-case, validate: `^[a-z0-9-]+$`), then:
   ```bash
   studio site create --path <STUDIO_HOME>/<theme-slug> --name "<site-name>" --skip-browser
   ```
8. If **existing**: use the selected site's path; run `studio site start --path <site-path>` if the site is not already running

Store `<site-path>` for all subsequent phases. Use `STUDIO_HOME` and `<site-path>` in all paths from this point forward.

9. **Install gallery mu-plugin:**
   ```bash
   mkdir -p <site-path>/wp-content/mu-plugins
   cp ${CLAUDE_PLUGIN_ROOT}/templates/design-gallery.php <site-path>/wp-content/mu-plugins/
   ```
10. **Get site URL:** `studio site status --path <site-path>` — store the URL as `<site-url>` for gallery access.

---

## Phase 0: New or Redesign?

**Goal:** Determine if this is a new site or a redesign of an existing one.

**Skill:** `content-import`

### Auto-Detection

Check `$ARGUMENTS` for redesign signals:
- **Keywords**: redesign, redo, refresh, rebuild, revamp, remake, overhaul, update the look, new design for
- **URLs**: any `http://` or `https://` URL that looks like an existing site (not a reference/inspiration URL)

If redesign is detected, proceed with content import. If not, skip directly to Phase 1.

### Redesign Workflow

1. **Confirm intent**: "It sounds like you want to redesign an existing site. I'll analyze [URL/description] and use your existing content as the foundation. The old design goes away — your content gets a fresh look."

2. **Gather content**: Use the `content-import` skill:
   - If the user provides a URL, scrape it via WebFetch
   - If the user provides a WordPress XML export, parse it
   - If neither, ask: "Can you share the site URL or a WordPress XML export? I'll pull your existing content from there."

3. **Write content summary**: Save to `<site-path>/design/import/content-summary.json` using the schema from the `content-import` skill

4. **Present findings**: Show the user what was imported (page list, content overview, recommendations for gaps)

5. **Proceed to Phase 1**: The content summary pre-populates the site specification. The user can adjust before moving on.

### New Site (Default)

If no redesign signals detected, skip Phase 0 entirely and go to Phase 1.

---

## Phase 1: Brief & Direction Planning

**Goal:** Understand what the user wants, establish creative direction, plan 3 aesthetic directions.

Uses the `site-specification` skill (already loaded in your context — do not read or re-load it).

### If `$ARGUMENTS` contains a site description:

1. Use the `site-specification` skill to extract comprehensive site specs, including the direction fields (`colorDirection`, `spatialDirection`, `motionDirection`) inferred from the description
2. If the brief is thin (one sentence, no aesthetic cues), offer inspiration — but don't gate progress on it:
   - "Want to share any sites you like? I can pull direction from them."
   - Or briefly describe 2-3 aesthetic directions tailored to the site type
   - If the user says "just go," go
3. Present the spec as a left-edge-only card (~72 chars wide, no right border) with three zones: brief with `▓▒░` name treatment, DESIGN DIRECTION, and STRUCTURE (tree-style wireframe). All prose sections use natural language. (This overrides the default table format from the `site-specification` skill.)

Follow the card with ONE casual sentence — the single most interesting design hook you noticed. Talk like a person, not a design textbook. Examples:
- "Light/dark duality is the obvious hook — the site should feel like the app."
- "Coffee shops sell warmth, not coffee. The site should feel like a hug."
- "Law firms are boring. Let's make this one less boring."

Then ask: "Anything to adjust?"

**HARD RULES:**
- Brief and Design Direction are natural language prose — no key:value pairs, no field labels.
- Design Direction must NOT name specific fonts — describe the type direction in vibe terms ("clean geometric type," not "Satoshi").
- Structure uses tree markers (`┌ ├ └`), one line per section.
- No right border — left edge only. ~72 chars wide, ~25 lines max.
- The editorial is ONE sentence. Not two. Not a paragraph. One.
- No jargon. No "visual language," "design motif," "spatial composition," or "typographic hierarchy." Talk like you're explaining it to a friend.
- No markdown formatting (no bold, no italics, no bullets) in the editorial.
- The card + one sentence + "Anything to adjust?" is the ENTIRE Phase 1 output. That's it. Done.

### If `$ARGUMENTS` is empty:

Ask the user to describe their site:
"Tell me about the site you want to create. Include the name, what it's for, and any style preferences you have."

### Image Collection

After the spec is confirmed and before planning directions, ask:

"If you have any images or design documents that will inform the design — logos, photos, brand guidelines, mood boards, etc. — please share the folder they are located in with me."

Wait for the user's response. They may provide a folder path, individual file paths, or indicate they have none.

If images are provided:
1. Copy them into the design folder: `cp <source>/* <site-path>/design/` (or individual files)
2. **Identify the logo**: Look for files with "logo" in the name (e.g., `site_logo.png`, `logo.svg`). Store the filename as `logo-filename` (or empty if none found).
3. **Catalogue all images**: Store the full list as `user-image-filenames`. Briefly note what each non-logo image appears to show (e.g., "shop interior", "coffee beans close-up") so later phases can place them contextually.

If no images are provided, set `logo-filename` to empty and `user-image-filenames` to "none".

### Direction Planning

After the user confirms the brief, plan 3 design directions. For each: mood name (2-4 words), color palette concept, font pairing concept (vibe terms, not names), spacing density, motion level, button style, embellishment approach.

Present as a compact numbered list — 3-4 lines per direction. Then say: "Generating these 3 directions now —" and **immediately proceed to Phase 2 without waiting for approval.** Do not ask if the user wants to adjust. Do not pause. The user can interrupt (ESC) if they want changes. Speed matters more than gatekeeping here.

**Output:** Site spec + 3 direction briefs → flow directly into Phase 2.

---

## Phase 2: Style Tiles

**Goal:** Explore aesthetic directions and lock design tokens.

After direction approval, execute IN PARALLEL:

**A. Scaffold Gallery** (orchestrator): Create dirs (`mkdir -p <site-path>/design/{import,inspiration/screenshots,styles,pages,approved}`). **Read `${CLAUDE_PLUGIN_ROOT}/references/gallery.md` first** for the full schema, then write `gallery.json` with initial data (project, brief, phase, startedAt, siteUrl, empty artifacts). Open gallery: `open "http://<site-url>/?design-gallery"`. Say: "Design gallery is open — it auto-refreshes as I add designs."

**B. Spawn 3 Tile Subagents** (parallel Task() calls, one per direction):

**Permission warm-up (before spawning):** Subagents cannot prompt the user for file permissions — they just get denied and fail. Before launching tile agents, the orchestrator must trigger permission approval for every path the subagents will need by running these calls itself:

```
Read(${CLAUDE_PLUGIN_ROOT}/references/design-system-core.md, limit=1)
Read(${CLAUDE_PLUGIN_ROOT}/references/design-system-phase2.md, limit=1)
Write(<site-path>/design/styles/.warm, "")
```

This costs almost zero context (1 line per read) and ensures subagents inherit read/write access.

> **Subagent prompt:** You are generating a style tile. Read `${CLAUDE_PLUGIN_ROOT}/references/design-system-core.md` and `${CLAUDE_PLUGIN_ROOT}/references/design-system-phase2.md`. SITE SPEC: [paste]. DIRECTION: [this tile's mood/color/font/density/motion/button/embellishment brief]. LOGO: [if `logo-filename` is set, include: "A user-supplied logo exists at `<site-path>/design/<logo-filename>`. Display it in a compact brand bar at the top of the tile and ensure your color palette complements the logo's colors — don't clash. Use the dual-path image pattern so the logo works both when the file is opened directly AND inside the gallery iframe: `<img src=\"../<logo-filename>\" onerror=\"this.onerror=null;this.src='/?design-asset=<logo-filename>'\" alt=\"...\">`. Apply this same dual-path pattern to ALL user-supplied images." If no logo, omit this section.] OUTPUT: `<site-path>/design/styles/v[N]-tile[1|2|3].html`. Requirements: real Google Fonts via `<link>`, light+dark mode CSS custom properties, CSS-only embellishments, WCAG AA contrast, no emojis.

### After Subagents Complete

1. Update `gallery.json` — add all 3 tiles to `artifacts.styles`. Each entry MUST include a descriptive `label` that is the mood/aesthetic name (e.g., "Butcher Block", "Smoke House", "Prairie Modern") — never a generic name like "v1" or "Tile 1".
2. Say: "Style tiles ready — 3 directions in the gallery. Which one feels right?"

### Iteration

Spawn new subagents for `v[next]-tile[1|2|3].html`. Always increment version. Update `gallery.json` (always include a descriptive mood-name `label`).

### Locking: Design Tokens

When user selects a tile (or mixes): delegate extraction to a subagent reading `${CLAUDE_PLUGIN_ROOT}/references/design-system-phase2.md` (Token Extraction AND Design Patterns Extraction sections).

**Permission warm-up (before spawning):**

```
Read(${CLAUDE_PLUGIN_ROOT}/references/design-system-phase2.md, limit=1)
Write(<site-path>/design/.warm, "")
```

Run WCAG contrast verification. Write to `<site-path>/design/design-tokens.json` AND `<site-path>/design/design-patterns.html`. Update `gallery.json` — set `phase` to `pages`, add `tokens` object. Confirm with summary.

**Output:** `<site-path>/design/design-tokens.json`, `<site-path>/design/design-patterns.html`

---

## Handoff: Phase 2 → 3 (Context Reset)

After token lock, all design decisions are captured in files on disk (`design-tokens.json` for primitives, `design-patterns.html` for component personality). The context from Phases 0–2 (Studio setup, brief gathering, style tile iteration) is no longer needed.

Collect these variables — they are the **only** state required from this point forward:

| Variable | Source |
|----------|--------|
| `site-path` | From Phase 0.5 |
| `theme-slug` | From Phase 0.5 |
| `site-name` | From Phase 1 |
| `site-spec` | The confirmed site specification (compact summary) |
| `CLAUDE_PLUGIN_ROOT` | Plugin root path |
| `gallery-state` | Current `gallery.json` phase and version counters |
| `user-image-filenames` | List of image files in `<site-path>/design/`, or "none". Identify which is the logo and briefly describe what each photo shows (e.g., "shop interior", "coffee beans close-up") so the agent can place them in appropriate sections. |

From here forward, all Task agent prompts reference **files on disk** (`design-tokens.json`, approved mockups) rather than pasted conversation context.

---

## Phase 3: Page Design

**Goal:** Explore layout directions using locked tokens.

Launch a **single Task agent** (`subagent_type: "general-purpose"`) to generate all 3 layouts. This keeps layout generation out of the orchestrator's context — only file paths and brief descriptions come back.

Replace every `<placeholder>` with actual values collected above.

**Permission warm-up (before spawning):**

```
Read(${CLAUDE_PLUGIN_ROOT}/references/design-system-core.md, limit=1)
Read(${CLAUDE_PLUGIN_ROOT}/references/design-system-phase3.md, limit=1)
Read(<site-path>/design/design-tokens.json, limit=1)
Read(<site-path>/design/design-patterns.html, limit=1)
Write(<site-path>/design/pages/.warm, "")
```

> **Task agent prompt:** You are generating 3 page layout options for a website. Read these files first: `<CLAUDE_PLUGIN_ROOT>/references/design-system-core.md` and `<CLAUDE_PLUGIN_ROOT>/references/design-system-phase3.md`, then `<site-path>/design/design-tokens.json` (these tokens are LAW — do not deviate), then `<site-path>/design/design-patterns.html`. Use the patterns in `design-patterns.html` to recreate the approved component patterns (cards, hero, embellishments, buttons, link styling, animations). These patterns define the site's personality — do not reinvent them. SITE SPEC: [paste compact summary]. USER IMAGES: [paste `user-image-filenames` — if not "none", include: "These user-supplied images are in `<site-path>/design/`. The logo (`<logo-filename>`) MUST appear in the header. Place other images in contextually appropriate sections (hero, about, gallery, etc.). Use the dual-path image pattern so images work both when opened directly AND inside the gallery iframe: `<img src=\"../<filename>\" onerror=\"this.onerror=null;this.src='/?design-asset=<filename>'\" alt=\"...\">`. Every provided image should feel intentionally placed, not just dropped in. If no images were provided, use CSS gradients and color blocks instead."] 3 LAYOUT BRIEFS: [for each: hero treatment, section ordering, grid patterns, density]. Write 3 files: `<site-path>/design/pages/v[N]-layout1.html`, `v[N]-layout2.html`, `v[N]-layout3.html`. Requirements: realistic content (no lorem ipsum), full page header-to-footer, responsive, hover states, scroll animations, real Google Fonts, same tokens across all 3, no emojis. Return: for each layout, the file path and a 1-line description of the layout approach.

### After Agent Completes

1. Update `gallery.json` — add all 3 layouts to `artifacts.pages`. Each entry MUST include a descriptive `label` that names the layout approach (e.g., "Magazine Grid", "Bold Hero", "Minimal Scroll") — never a generic name like "v1" or "Layout 1".
2. Say: "Page layouts ready — 3 options in the gallery. Which direction works?"

### Iteration

Spawn a new Task agent for revisions: `v[next]-layout[1|2|3].html`. Update `gallery.json` (always include a descriptive layout-approach `label`). Token changes: update `design-tokens.json`, call out the change.

**Output:** Selected layout direction.

---

## Phase 4: Full Site Mockup

**Goal:** Build every page as a complete HTML document for review.

### Plan Pages

Suggest based on site type:

| Site Type | Suggested Pages |
|-----------|----------------|
| SaaS | Homepage, Features, Pricing, About, Contact, Blog, Blog Post |
| Restaurant | Homepage, Menu, About, Reservations, Gallery |
| Portfolio | Homepage, Work, Project Detail, About, Contact |
| Law Firm | Homepage, Practice Areas, Team, About, Contact |
| Blog | Homepage, About, Contact, Blog, Blog Post |
| Non-profit | Homepage, Programs, About, Donate, Contact |
| Agency | Homepage, Services, Work, About, Contact |
| E-commerce | Homepage, Shop, About, FAQ, Contact |

Present conversationally. Wait for confirmation.

### Generate Pages (Task Agent)

Launch a **single Task agent** (`subagent_type: "general-purpose"`) to generate all page mockups. This keeps the full page content out of the orchestrator's context.

Replace every `<placeholder>` with actual values.

**Permission warm-up (before spawning):**

```
Read(${CLAUDE_PLUGIN_ROOT}/references/design-system-core.md, limit=1)
Read(${CLAUDE_PLUGIN_ROOT}/references/design-system-phase3.md, limit=1)
Read(<site-path>/design/design-tokens.json, limit=1)
Read(<site-path>/design/design-patterns.html, limit=1)
Write(<site-path>/design/approved/.warm, "")
```

> **Task agent prompt:** You are generating full-page HTML mockups for a website. Read these files first: `<CLAUDE_PLUGIN_ROOT>/references/design-system-core.md` and `<CLAUDE_PLUGIN_ROOT>/references/design-system-phase3.md`, then `<site-path>/design/design-tokens.json` (these tokens are LAW), then `<site-path>/design/design-patterns.html`. Use the patterns in `design-patterns.html` to recreate the approved component patterns (cards, hero, embellishments, buttons, link styling, animations) consistently across all pages. These patterns define the site's personality — do not reinvent them. SITE SPEC: [paste compact summary]. CHOSEN LAYOUT: [description of selected layout direction from Phase 3]. USER IMAGES: [paste `user-image-filenames` — if not "none", include: "These user-supplied images are in `<site-path>/design/`. The logo (`<logo-filename>`) MUST appear in the header of every page. Place other images in contextually appropriate sections — choose the best fit per page (hero shots on homepage, team/interior photos on about, product shots on features, etc.). Use the dual-path image pattern so images work both when opened directly AND inside the gallery iframe: `<img src=\"../<filename>\" onerror=\"this.onerror=null;this.src='/?design-asset=<filename>'\" alt=\"...\">`. Every provided image should feel intentionally placed and styled to match the design direction. If no images were provided, use CSS gradients and color blocks instead."] PAGE BRIEFS: [for each page: title, slug, purpose, key sections]. Write one file per page to `<site-path>/design/approved/[slug].html`. Requirements: complete self-contained HTML, real content (no lorem ipsum), real Google Fonts, hover states, scroll animations, consistent identity across all pages, page-specific content (blog: posts with dates; pricing: plan toggle; etc.), no emojis. Return: for each page, the file path and a 1-line description.

### After Agent Completes

Update `gallery.json` — set `phase` to `approved`, add page files to `artifacts.approved`. Say: "Full site mockup ready — [N] pages in the gallery."

### Iteration

Page changes: spawn a new Task agent writing `[slug]-v2.html`. New pages: new file. Token changes: update and propagate. Always increment, never overwrite.

**Output:** Approved HTML mockups in `<site-path>/design/approved/`.

---

## Handoff: Phase 4 → 5 (Context Reset)

After mockup approval, every design decision is captured in files on disk:
- `<site-path>/design/design-tokens.json`
- `<site-path>/design/design-patterns.html`
- Approved HTML mockups in `<site-path>/design/approved/`
- `<site-path>/design/gallery.json`

Collect these variables for the final handoff:

| Variable | Source |
|----------|--------|
| `site-path` | From Phase 0.5 |
| `theme-slug` | From Phase 0.5 |
| `site-name` | From Phase 1 |
| `approved-pages` | List of page slugs from Phase 4 (e.g., `homepage, about, contact, pricing`) |
| `CLAUDE_PLUGIN_ROOT` | Plugin root path |
| `user-image-filenames` | List of image files in `<site-path>/design/`, or "none". Identify which is the logo and briefly describe what each photo shows so the agent can place them in appropriate sections. |

---

## Phase 5: WordPress Build

**Goal:** Generate a complete WordPress site and deploy to Studio.

Ask: "The mockups are approved — ready to build the WordPress theme?" Wait for confirmation.

### Launch the build agent

Delegate the entire build to a **new Task agent** (`subagent_type: "general-purpose"`) so it starts with a clean context window. Replace every `<placeholder>` with actual values.

**Permission warm-up (before spawning):**

```
Read(${CLAUDE_PLUGIN_ROOT}/references/design-system-core.md, limit=1)
Read(${CLAUDE_PLUGIN_ROOT}/references/wordpress-block-theming.md, limit=1)
Read(<site-path>/design/design-tokens.json, limit=1)
Read(<site-path>/design/design-patterns.html, limit=1)
Read(<site-path>/design/approved/<first-page-slug>.html, limit=1)
Write(<site-path>/wp-content/themes/<theme-slug>/.warm, "")
```

> **Task agent prompt:** You are building a complete WordPress site from approved HTML mockups and deploying it to a local Studio site.
>
> Context: Site path: `<site-path>`. Theme slug: `<theme-slug>`. Site name: `<site-name>`. Plugin root: `<CLAUDE_PLUGIN_ROOT>`. Approved pages: `<list of page slugs>`.
>
> **Step 1 — Read references:** `<CLAUDE_PLUGIN_ROOT>/references/design-system-core.md`, `<CLAUDE_PLUGIN_ROOT>/references/wordpress-block-theming.md`, `<site-path>/design/design-tokens.json`, `<site-path>/design/design-patterns.html`, and all approved mockups in `<site-path>/design/approved/`.
>
> **Step 2 — Design package:** Create `<site-path>/design/design-package.json` with layout structure, sections, and custom CSS extracted from the approved mockups and tokens. For each approved page, catalogue every CSS class and its rules. These will be ported directly into `style.css` — do not skip or simplify any component styles.
>
> **Fidelity rule:** The approved mockups are the specification, not inspiration. The WordPress site must visually match them. Extract every CSS rule from the approved mockups' `<style>` blocks and from `design-patterns.html` into `style.css`, preserving all class names, values, and component structures. Do not regenerate CSS from tokens alone — the mockups contain custom component styles (card layouts, embellishments, section treatments) that go beyond what tokens capture.
>
> **Core blocks only:** You must do your best to faithfully reproduce the mockup designs using core blocks only. Do not resort to `<!-- wp:html -->` to achieve this, but get as close as possible using standard core blocks (`wp:group`, `wp:columns`, `wp:cover`, `wp:image`, `wp:paragraph`, `wp:heading`, `wp:buttons`, etc.) with additional CSS classes and custom properties. When a mockup pattern requires a specific internal structure (e.g., a horizontal card with a colored sidebar), use nested `wp:group` and `wp:columns` blocks with CSS classes that trigger the correct layout in `style.css`.
>
> **Step 3 — Build theme:** Generate all theme files to `<site-path>/wp-content/themes/<theme-slug>/`: theme.json (map design tokens), style.css (rich CSS with animations/hover/dark-mode), functions.php (Google Fonts via enqueue_block_assets, scroll observer), templates/ (templates must use `{"type":"default"}` layout on the main content wrapper so full-width blocks render edge-to-edge; only use `"constrained"` on inner groups where you need a max-width), parts/ (header.html, footer.html, page-title.html), patterns/ (if needed), assets/ (copy user images from `<site-path>/design/` to `assets/`), pages/ (WordPress block markup for each approved page, to be imported via WP-CLI). USER IMAGES: [paste `user-image-filenames`]. If user images exist: the logo MUST appear in header.html (use `<!-- wp:image -->` or `<!-- wp:site-logo -->`). Place other images in contextually appropriate page sections using `<!-- wp:image -->` blocks or as backgrounds in Cover/Group blocks — every image should feel intentionally placed and styled to match the design direction. Do not just copy them to assets and ignore them. If no user images, use CSS gradients and color blocks. Requirements: no emojis, no stock image URLs.
>
> **Step 4 — Fix block markup:** Run `node <CLAUDE_PLUGIN_ROOT>/scripts/block-fixer/cli.js <site-path>/wp-content/themes/<theme-slug>`
>
> **Step 5 — Activate and deploy:** (a) `studio wp --path <site-path> theme activate <theme-slug>`, (b) `studio wp --path <site-path> option update blogname "<site-name>"`, (c) for each page: `studio wp --path <site-path> post create --post_type=page --post_title="<title>" --post_name="<slug>" --post_content="$(cat <site-path>/wp-content/themes/<theme-slug>/pages/<page-slug>.html)" --post_status=publish`, (d) set front page: `studio wp --path <site-path> option update show_on_front page` then `studio wp --path <site-path> option update page_on_front <home-page-id>`, (e) `studio site status --path <site-path>` to get the site URL.
>
> **Step 5b — Verify:** For each page, compare the CSS classes used in the page block markup against what exists in `style.css`. If any class from the approved mockups is missing from `style.css`, add it. This is a safety net — every component class must have a corresponding CSS rule.
>
> **Step 6 — Tracking:** Run `bash <CLAUDE_PLUGIN_ROOT>/scripts/track.sh agent-site-builder claude-code-theme-activated &`
>
> **Return:** Site URL, theme name, site path, number of pages created. Nothing else.

### After Agent Completes

Update `gallery.json` — set `phase` to `theme`, add theme slug to `themeSlugs`.

"Your site is live — all [N] pages built in WordPress.

| Detail | Value |
|--------|-------|
| Site URL | `<site-url>` |
| Theme | `<theme-name>` |
| Site Path | `<site-path>` |

Would you like to iterate, edit content, share a preview, or go back to mockups?"

### Iteration

Re-read `design-package.json` before changes. Run block-fixer after markup changes. Update tokens and design-package if needed.

---

## Gallery Management

The orchestrator owns gallery state. Subagents NEVER write to `gallery.json`.

- **Scaffold:** Create directory structure, write initial `gallery.json`, open `http://<site-url>/?design-gallery`
- **Update:** Update `gallery.json` after each subagent completes (the gallery auto-polls and re-renders)
- **Open browser:** Once during scaffold. Never again — the gallery auto-refreshes.
- **Phase tracking:** Update `gallery.json` phase at each transition

## Phase Regression

- **Phase 3 -> 2:** New tiles as `v[next]`. Phase to `"styles"`. New lock overwrites tokens.
- **Phase 4 -> 3:** Re-read tokens, new layouts as `v[next]`. Phase to `"pages"`.
- **Phase 5 -> 4:** Return to mockup iteration. Phase to `"approved"`. Re-run Phase 5 when done.
- Always increment versions. Never overwrite.

## Follow-up Actions

1. **Iterate**: Modify theme files, re-run block-fixer
2. **Edit content**: `studio wp --path <site-path> post update`
3. **Share**: `studio preview create --path <site-path>`
4. **Back to mockups**: Phase 4 iteration
5. **Redesign**: Phase 2 or 3 regression

## Notes

- Theme slug: kebab-case, validate `^[a-z0-9-]+$`
- Run block-fixer after any template/part .html changes
- NO EMOJIS anywhere in generated content
- Validate all user-provided slugs and paths
