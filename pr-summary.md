# PR Summary: Screenshot Verification & Design Quality Improvements

**Branch:** `my-improvements` → `trunk`

## Overview

This PR adds automated screenshot verification throughout the design workflow and elevates design quality through more specific CSS guidance.

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

## Test Plan
- [ ] Run `node scripts/screenshot.mjs <url> <output-path>` to verify screenshot utility works with the local Chrome binary
- [ ] Run a full `design-site` workflow and confirm `design/verification/` directory is created and populated at each phase
- [ ] Confirm Phase 5 fidelity check produces comparison screenshots
- [ ] Verify `transition: all` hard rule appears in design system output from subagents
