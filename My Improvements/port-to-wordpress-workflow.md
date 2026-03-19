# Improvements to Port to WordPress Design Workflow

Sourced from the web-designer.md agent and frontend-design skill. Prioritized by impact on output quality.

## Working Directory & Key Paths

**Plugin to modify (your fork, `my-improvements` branch):**
```
/Users/josephpascucci/Documents/GitHub/wordpress-agent-skills/claude-code/wp-site-creator/
```

**Key files in the plugin:**
```
commands/design-site.md          ← main multi-phase workflow orchestrator
commands/quick-build.md          ← simpler single-pass workflow
commands/preview-designs.md      ← design preview generation
references/design-system-core.md ← shared design principles (all phases)
references/design-system-phase2.md ← style tiles, tokens, embellishments
references/design-system-phase3.md ← page layout, grid math, sections
references/simple-design-system.md ← simplified design system for quick-build
references/wordpress-block-theming.md ← WP block markup, theme architecture
references/gallery.md            ← gallery mu-plugin schema
skills/site-specification/SKILL.md ← site spec extraction
scripts/block-fixer/cli.js       ← block markup validator
templates/design-gallery.php     ← gallery mu-plugin
```

**Source material to reference (read-only — do not modify these):**
```
/Users/josephpascucci/Desktop/Wordpress workflow brainstorming/web-designer.md
```
Contains: screenshot workflow, anti-generic guardrails, reference image matching, mobile preview, brand asset handling. The existing `screenshot.mjs` and `serve.mjs` scripts in that project root are reference implementations for Puppeteer-based screenshotting.

**Existing Puppeteer setup (from web-designer project):**
- `puppeteer-core` is installed in the brainstorming project
- Chrome binary: `~/.cache/puppeteer/chrome/mac-145.0.7632.77/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`
- `screenshot.mjs` — takes a URL + optional label, saves to `./temporary screenshots/screenshot-N.png`
- `serve.mjs` — serves a directory at `http://localhost:3000`

**Testing your changes:**
```bash
cd ~/Studio
claude --plugin-dir /Users/josephpascucci/Documents/GitHub/wordpress-agent-skills/claude-code/wp-site-creator
```

---

## 1. Screenshot Verification Throughout Design Phases (High Impact)

**Source:** web-designer.md screenshot workflow
**Target:** design-site.md Phases 2, 3, 4, and 5

The web designer agent's core superpower is that it *sees its own output* and iteratively refines it. Currently, every subagent in the WordPress workflow codes blind — writing HTML or block markup without ever seeing what it renders. Adding screenshot verification at each phase catches issues early, before they cascade downstream.

### Phase 2 — Style Tiles
After each style tile subagent completes, screenshot the HTML file and verify:
- Google Fonts loaded correctly (not falling back to system fonts)
- Color palette renders as intended (contrast, vibrancy)
- Light/dark mode toggle works
- CSS embellishments render correctly
- Button styles and hover states are visible

**Why it matters here:** Tokens get extracted from the chosen tile. If the tile has a broken font load or wrong color rendering, the extracted tokens are wrong and everything downstream inherits the error.

### Phase 3 — Page Layouts
After the layout agent completes, screenshot each layout and verify:
- Section spacing and visual rhythm
- Grid alignment and column proportions
- Hero composition and vertical positioning
- Responsive behavior (capture at desktop + mobile widths)
- Animation initial states render correctly (elements aren't invisibly stuck at opacity: 0)

### Phase 4 — Full Mockups
After the mockup agent completes, screenshot each page and verify:
- Cross-page consistency (header, footer, nav, typography, colors)
- Page-specific content renders correctly (pricing tables, blog post layouts, etc.)
- Hover states and interactive elements
- Overall visual polish and premium feel

**Why it matters here:** These are the "approved" specifications that Phase 5 will try to faithfully reproduce. Higher-quality mockups = better WordPress output.

### Phase 5 — WordPress Build (Fidelity Check)
After deploying the WordPress theme, screenshot the live site and compare against the approved Phase 4 HTML mockup screenshots. This is a fidelity comparison — the WordPress site should match the mockups.
- Side-by-side comparison against Phase 4 mockup screenshots
- Iterative fix cycle: identify mismatches (spacing, color, font weight, alignment), update theme files, re-run block-fixer, re-screenshot
- At least 2 comparison rounds
- Stop when no visible differences remain or user says done

### Implementation details:

**Who runs screenshots — orchestrator vs subagent:**
- **Phases 2-4 (HTML artifacts):** The orchestrator runs screenshots AFTER each subagent returns. Subagents write their HTML files and return. The orchestrator then screenshots each file, reads the screenshot with the Read tool (Claude can see images), evaluates quality, and either approves or spawns a fix-up subagent with the screenshot + specific issues to fix. This keeps the screenshot tooling out of subagent prompts and centralizes the QA loop.
- **Phase 5 (WordPress site):** The orchestrator screenshots the deployed WordPress site URL and compares against the Phase 4 mockup screenshots already saved in `design/verification/`.

**Serving local HTML files for screenshots:**
The web-designer.md says "never screenshot a `file:///` URL" — Google Fonts and other external resources won't load. For Phases 2-4, the design gallery mu-plugin already serves HTML artifacts via `http://<site-url>/?design-asset=<path>`. Use this existing route to screenshot design artifacts rather than building a separate local server. If the gallery is not available (e.g., quick-build path), fall back to a simple local server similar to the web-designer's `serve.mjs`.

**Screenshot script:**
Create `scripts/screenshot.mjs` in the plugin directory. Reference the existing `screenshot.mjs` in the brainstorming project as a starting point (`/Users/josephpascucci/Desktop/Wordpress workflow brainstorming/screenshot.mjs`). Adapt it to:
- Accept a URL (either `http://localhost:...` for WordPress or `http://<site-url>/?design-asset=...` for HTML artifacts)
- Accept an output path (save to `<site-path>/design/verification/`)
- Accept an optional viewport width parameter (for mobile screenshots: 375px, desktop: 1440px)
- Use the Chrome binary at `~/.cache/puppeteer/chrome/mac-145.0.7632.77/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`

**Screenshot naming convention:**
```
<site-path>/design/verification/
  phase2-tile1-v1.png
  phase2-tile2-v1.png
  phase2-tile3-v1.png
  phase3-layout1-v1.png
  phase3-layout1-v1-mobile.png
  phase4-homepage-v1.png
  phase4-about-v1.png
  phase5-homepage-v1.png        ← WordPress build
  phase5-homepage-v2.png        ← after first fix iteration
```

**Orchestrator QA loop (add to design-site.md after each phase):**
```
After subagent(s) complete:
1. Screenshot each artifact via: node ${CLAUDE_PLUGIN_ROOT}/scripts/screenshot.mjs <url> <output-path>
2. Read each screenshot with the Read tool
3. Evaluate against the phase-specific checklist (see checklists above)
4. If issues found: spawn a fix-up subagent with the screenshot + specific issues
5. Re-screenshot and re-evaluate (max 2 fix rounds per artifact)
6. Save final screenshots for downstream comparison
```

**Files to modify:**
- `commands/design-site.md` — add QA loop after Phases 2, 3, 4, and a fidelity check sub-phase after Phase 5
- New script: `scripts/screenshot.mjs` — Puppeteer screenshot utility adapted for WordPress URLs and local HTML artifacts
- `commands/design-site.md` Phase 0.5 — add `mkdir -p <site-path>/design/verification` to directory scaffold

---

## 2. Specific CSS Values (Medium-High Impact)

**Source:** web-designer.md anti-generic guardrails
**Target:** design system references + token extraction schema

Concrete values the WordPress workflow currently leaves vague:

| Property | Value to add | Where |
|---|---|---|
| Heading letter-spacing | `-0.03em` on large headings (h1, h2) | design-system-core.md, token schema |
| Shadow approach | Layered, color-tinted shadows with low opacity (not flat `box-shadow`) | design-system-core.md |
| Easing character | Spring-style easing (`cubic-bezier(0.34, 1.56, 0.64, 1)` or similar) | design-system-core.md, motion tokens |
| Image treatment | `background: linear-gradient(...)` overlay + `mix-blend-multiply` layer | design-system-phase3.md |

**Files to modify:**
- `references/design-system-core.md` — add specific values to typography and motion sections
- `references/design-system-phase3.md` — add image treatment technique
- `references/design-system-phase2.md` — update token extraction schema with easing and shadow fields

---

## 3. Depth / Layering System (Medium Impact)

**Source:** web-designer.md
**Target:** design-system-core.md

> "Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane."

Three elevation tiers with distinct shadow/background treatments:
- **Base** — flat, primary background color
- **Elevated** — subtle shadow, slightly lighter/darker surface
- **Floating** — pronounced shadow, distinct surface color (cards, modals, dropdowns)

Implement via CSS classes on `wp:group` blocks. Add to token schema as `surfaces.elevationTiers`.

**Files to modify:**
- `references/design-system-core.md` — add layering system concept
- `references/design-system-phase2.md` — add elevation tiers to token extraction

---

## 4. Interactive States as Hard Rule (Medium Impact)

**Source:** web-designer.md
**Target:** wordpress-block-theming.md

> "Every clickable element needs hover, focus-visible, and active states. No exceptions."

Currently the WordPress skill encourages hover states but doesn't enforce focus-visible or active. Making all three mandatory improves both accessibility and perceived quality.

Applies to: buttons, links, cards with hover-lift, nav items, any clickable element.

**Files to modify:**
- `references/wordpress-block-theming.md` — add as a hard rule in the CSS section
- `references/design-system-core.md` — add to motion/interaction section

---

## 5. SVG Noise Filter for Texture/Grain (Low-Medium Impact)

**Source:** web-designer.md
**Target:** design-system-phase2.md embellishments section

Inline SVG `<feTurbulence>` filter applied as a background overlay for subtle grain/texture. Adds tactile depth that flat CSS gradients lack.

Implementation in WordPress: inject SVG filter via `functions.php` (`wp_footer` hook), reference in CSS via utility class (e.g., `.has-grain-texture::after`).

**Files to modify:**
- `references/design-system-phase2.md` — add as an embellishment technique with code example
- `references/wordpress-block-theming.md` — add implementation pattern for functions.php injection

---

## 6. Reference Image Matching for Redesigns (Low-Medium Impact)

**Source:** web-designer.md reference image workflow
**Target:** design-site.md Phase 0 redesign workflow

When redesigning an existing site, screenshot the original site and use it as a visual reference during design phases — not to match it, but to understand what to preserve vs. what to change.

**What to implement:**
- Screenshot the original site URL during Phase 0 content import
- Store in `design/inspiration/screenshots/`
- Reference during Phase 1 direction planning (what works, what doesn't)
- Optionally compare against during Phase 2-3 to ensure the redesign is a clear improvement

**Files to modify:**
- `commands/design-site.md` — enhance Phase 0 redesign workflow

---

## 7. Mobile Preview URL (Low Impact)

**Source:** web-designer.md mobile preview section
**Target:** design-site.md Phase 5 completion message

After deployment, get local IP (`ipconfig getifaddr en0`) and offer the user a network URL for phone preview alongside the Studio URL.

**Files to modify:**
- `commands/design-site.md` — add to Phase 5 completion output

---

## Implementation Order

**Batch A — Reference file edits (items 2-5):** These are small, independent additions to existing reference files. Can be done in parallel. No new scripts or workflow changes needed. Read each target file, find the appropriate section, and insert the new content.

**Batch B — Workflow changes (items 1, 6, 7):** These modify `commands/design-site.md` and add new infrastructure. Item 1 (screenshot verification) is the largest change and should be done first since items 6 and 7 both depend on the screenshot script it introduces.

Suggested order:
1. Items 2, 3, 4, 5 (reference file edits — do all at once)
2. Item 1 (screenshot verification — create script + modify design-site.md)
3. Item 6 (redesign screenshots — extends item 1's screenshot script)
4. Item 7 (mobile preview URL — small addition to design-site.md)
