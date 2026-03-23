# Changelog: add-screenshot-workflow → my-improvements-v2

**Commits:** 2
- `33c68f3` Integrate 12 workflow reliability improvements from real-world usage
- `0472d94` Refactor code structure for improved readability and maintainability

---

## Summary

Building on the screenshot verification workflow, `my-improvements-v2` adds **+419 lines** of reliability improvements, workarounds, and workflow enhancements discovered during real-world usage of the plugin. It also adds new top-level reference files and an updated PR summary.

---

## New Files

- **`pr-summary.md`** — Expanded PR summary covering all changes (screenshot verification + reliability improvements + test plan)
- **`web-designer.md`** — Top-level design agent reference document with anti-generic guardrails, screenshot workflow instructions, brand asset handling, and mobile preview setup
- **`port-to-wordpress-workflow.md`** — Moved back to repo root from `My Improvements/`
- Removed `My Improvements/add-screenshot-workflow-pr-summary.md` (superseded by top-level `pr-summary.md`)

## Plugin Version

- Bumped plugin version from `0.0.1A` to `0.0.1B` in [plugin.json](claude-code/wp-site-creator/.claude-plugin/plugin.json)

---

## screenshot.mjs — Robustness Improvements

- **Auto-install fallback:** If `puppeteer-core` isn't found, automatically runs `npm install` in the script directory before retrying the import (dynamic import with fallback).
- **WordPress proxy route detection:** New `isWordPressProxyRoute()` function detects URLs containing `design-asset=` or `design-gallery` and switches to `domcontentloaded` wait strategy with 90s timeout (fixes timeouts on large HTML streamed through WordPress proxy).
- **`--dev-server=URL` flag:** New `maybeRewriteForDevServer()` rewrites WordPress proxy URLs to hit a local dev server directly for faster screenshots (e.g., `?design-asset=pages/home.html` → `http://localhost:8888/pages/home.html`).
- **Argument parsing:** Switched from positional-only `process.argv` to a loop that separates positional args from named flags.

---

## design-site.md — Workflow Enhancements

### Phase 4 Improvements
- **Asset path resolution:** After mockup approval, copies all user-supplied assets (png/jpg/svg) from `design/` to the site root so absolute paths (e.g., `/logo-black.png`) resolve correctly in the gallery iframe.
- **Dual Preview Mode:** After mockup QA, starts a static dev server (`python3 -m http.server 8888`) alongside the gallery for instant page review without WordPress PHP overhead. Presents both URLs to the user. Server is killed before Phase 5.

### New Phase 4.5: Content Extraction
- Inserts a full content extraction step between mockup approval and WordPress build.
- Spawns parallel Task agents to extract all text content from each approved HTML mockup into structured JSON files at `design/content/{slug}.json`.
- JSON schema captures every heading, paragraph, link, image, and form element — character-for-character, with class names, hrefs, srcs, and alt text.
- Validates that each JSON file has a non-empty `sections` array matching the HTML structure.
- Added `content-jsons` to the Phase 4→5 handoff variables.

### Phase 5 Build Reliability
- **Content source of truth:** Build agent instructed to use `design/content/*.json` as the authoritative text source — no re-reading or paraphrasing from raw HTML.
- **Link color override fix:** When `theme.json` sets a global link color, it overrides custom link colors in footers/dark sections. Added scoped CSS overrides (`.site-footer a { color: inherit; }`, `!important` for footer nav links).
- **Background animation fix:** Sections with `has-background` + `animate-on-scroll` no longer animate opacity on the wrapper (prevents jarring background fade-in). Instead, the wrapper stays at `opacity: 1; transform: none` and only children animate.
- **Slug conflict resolution:** Before creating pages, checks for existing pages with conflicting slugs via `studio wp post list` and trashes them with `studio wp post delete --force` to prevent `/portfolio-2` suffixes.
- **Two-step page creation:** Changed from single `post create --post_content="$(cat ...)"` to create-then-update pattern to avoid shell escaping issues with special characters in block markup.
- **Plugin deactivation:** After theme activation, deactivates competing page-builder plugins (`fusion-builder`, `fusion-core`, `revslider`, `js_composer`, `jetpack`, `jetpack-starter`) to prevent conflicting CSS/JS.
- **Graduated block markup policy:** Changed from absolute "NO HTML BLOCKS" to a nuanced policy — prefer core blocks always, allow `<!-- wp:html -->` as a documented last resort for patterns genuinely impossible with core blocks, never for elements with direct core block equivalents.

---

## quick-build.md — Build Improvements

- **Link color override caution** added to the build checklist.
- **Graduated block markup policy** — same nuanced approach as design-site.md.
- **Two-step page creation** for the "Add pages" follow-up action (same create-then-update pattern).

---

## wordpress-block-theming.md — Reference Additions

- **Graduated HTML block policy:** Replaced absolute ban with a three-tier approach: (1) always attempt core blocks, (2) document why core blocks failed before using `wp:html`, (3) keep HTML blocks minimal, never for single elements with core equivalents.
- **Global Link Color Override section:** Documents the WordPress `theme.json` link color specificity issue and provides the CSS fix pattern.
- **Background section animation fix:** Documents the CSS pattern for `has-background` + `animate-on-scroll` — keep wrapper visible, animate children only.
