# PR Summary: Screenshot Verification, Design Quality & Workflow Reliability Improvements

**Branch:** `my-improvements` → `trunk`

## Overview

This PR adds automated screenshot verification throughout the design workflow, elevates design quality through more specific CSS guidance, and integrates 12 reliability and UX improvements discovered during real-world usage of the plugin.

---

## Changes

### New: Screenshot Verification Workflow

- **`scripts/screenshot.mjs`** — New Puppeteer-based screenshot utility. Accepts a URL, output path, and optional viewport width (defaults to 1440px, supports 375px for mobile). Rejects `file://` URLs to ensure Google Fonts and external assets load correctly. Uses the local Chrome for Testing binary.

- **`commands/design-site.md`** — Added a "screenshot QA loop" after every design phase:
  - **Phase 2 (style tiles):** Screenshots each tile HTML via the gallery asset route and evaluates font loading, color rendering, and CSS embellishments. Spawns a fix-up subagent if issues are found (max 2 rounds).
  - **Phase 3 (page layouts):** Screenshots at desktop + mobile widths. Evaluates spacing, grid alignment, hero composition, and animation initial states.
  - **Phase 4 (full mockups):** Screenshots each approved page. Evaluates cross-page consistency, content rendering, and visual polish. Saves final screenshots as the "approved specification."
  - **Phase 5 (WordPress build):** New fidelity check — screenshots the live WordPress site and compares against Phase 4 mockup screenshots. Iterates until no visible differences remain.
  - Also adds `design/verification/` directory scaffolding in Phase 0.5.

- **`port-to-wordpress-workflow.md`** — Planning document capturing the full porting strategy for these improvements (source analysis, implementation notes, screenshot naming convention).

- **`web-designer.md`** — New top-level design agent reference (added as source material).

---

### Design Quality Improvements

**`references/design-system-core.md`**
- Heading letter-spacing: `-0.03em` on h1/h2 for editorial polish
- Mandatory interactive states: every clickable element must have `:hover`, `:focus-visible`, and `:active`
- Signature easing curves: named `cubic-bezier` presets (spring, smooth decelerate, snappy) stored in `--ease-default`; hard rule against `transition: all`
- Depth & Layering System: three elevation tiers (base/elevated/floating) with distinct shadow and surface treatments
- Layered, color-tinted shadows using brand palette values instead of generic `rgba(0,0,0,...)`

**`references/design-system-phase2.md`**
- SVG `feTurbulence` grain texture pattern for editorial/vintage/luxury directions
- Token schema updates: `motion.easing`, `surfaces.shadowColor`, and `surfaces.elevationTiers` fields added

**`references/design-system-phase3.md`**
- Brand image treatment pattern: CSS gradient overlay with `mix-blend-mode: multiply` to unify photos with the brand palette

**`references/wordpress-block-theming.md`**
- SVG grain filter injection via `wp_footer` in `functions.php` for themes using `.has-grain-texture`

---

### Workflow Reliability Improvements (from IMPROVEMENTS.md)

**Screenshot Tool (`scripts/screenshot.mjs`)**
- Auto-installs `puppeteer-core` on first run if missing (dynamic import with `npm install` fallback)
- Detects WordPress proxy routes (`?design-asset=`, `?design-gallery`) and uses `domcontentloaded` wait strategy with 90s timeout instead of `networkidle2` (which times out on large HTML through WP proxy)
- New `--dev-server=URL` flag to rewrite proxy URLs to a local dev server for faster screenshots

**Phase 4 UX (`commands/design-site.md`)**
- Asset path resolution: copies logos/images from `design/` to site root so absolute paths resolve correctly in gallery iframe
- Dual preview mode: after mockup QA, starts a static dev server (`python3 -m http.server 8888`) alongside the gallery, giving instant page review without WordPress PHP overhead

**New Phase 4.5: Content Extraction (`commands/design-site.md`)**
- Inserts a content extraction step between Phase 4 (mockups) and Phase 5 (build)
- Spawns parallel agents to extract all text content from approved HTML mockups into structured JSON files (`design/content/{slug}.json`) — character-for-character
- Build agent uses these JSON files as source of truth instead of re-reading large HTML, preventing content rewriting/paraphrasing

**Phase 5 Build Reliability (`commands/design-site.md`, `commands/quick-build.md`)**
- Slug conflict resolution: checks for existing pages with conflicting slugs and trashes them before creating new pages (prevents `/portfolio-2` suffixes on redesign sites)
- WP-CLI content import fix: two-step create-then-update pattern instead of `--post_content="$(cat ...)"` which breaks on special characters
- Old theme plugin deactivation: deactivates `fusion-builder`, `fusion-core`, `revslider`, `js_composer`, `jetpack`, `jetpack-starter` after theme activation to prevent competing CSS/JS
- Link color override: documents and adds CSS overrides for WordPress `theme.json` global link color specificity issue affecting footer/dark section links
- Scroll animation background fix: sections with `has-background` keep `opacity: 1` on the wrapper and animate children instead (prevents jarring background fade-in)

**Block Markup Policy (`references/wordpress-block-theming.md`, `commands/design-site.md`, `commands/quick-build.md`)**
- Replaced absolute "NO HTML BLOCKS" rule with graduated policy: prefer core blocks always, allow `<!-- wp:html -->` as a documented last resort for patterns genuinely impossible with core blocks, never for elements with direct core block equivalents

**Gallery Hook (`templates/design-gallery.php`)**
- Verified mu-plugin correctly uses `init` hook (not `template_redirect`) — no change needed

---

## Test Plan
- [ ] Run `node scripts/screenshot.mjs <url> <output-path>` to verify auto-install and screenshot capture
- [ ] Run `node scripts/screenshot.mjs <wp-proxy-url> out.png` to confirm `domcontentloaded` strategy on proxy routes
- [ ] Run `node scripts/screenshot.mjs <wp-proxy-url> out.png --dev-server=http://localhost:8888` to confirm URL rewriting
- [ ] Run a full `design-site` workflow and confirm `design/verification/` directory is created and populated at each phase
- [ ] Confirm Phase 4.5 produces `design/content/*.json` files with accurate extracted content
- [ ] Confirm Phase 5 fidelity check produces comparison screenshots
- [ ] On a redesign site, verify old pages are trashed before new page creation (no slug suffixes)
- [ ] Verify `transition: all` hard rule appears in design system output from subagents
- [ ] Verify footer links render correctly when `theme.json` sets a global link color
