---
name: design-system-phase2
description: Style tile generation, embellishments, and design token extraction. Read by Phase 2 tile subagents and token extraction.
---

# Design Systems — Phase 2: Style Tiles & Tokens

## Style Tiles

Style tiles are compact design swatches — small cards that let users compare 3 aesthetic directions at a glance on a single screen. No tabs, no scrolling, no full-page style books. All 3 visible simultaneously in a grid.

### What a Style Tile Contains

Each tile is a compact rectangle in a 3-column, single-row grid. Every card shows:

- **Mood label** — 2-4 word label at the top (e.g., "Midnight Neon", "Warm Editorial", "Brutalist Edge")
- **Color dots** — 3-4 circles showing the tile's key colors: primary, accent, background, text. No hex labels, no 7-swatch palettes. Keep it visual.
- **Heading** — A single heading set in the tile's heading font. Brief, site-relevant text.
- **Body paragraph with link** — A short paragraph in the tile's body font containing one styled inline link. Enough to judge readability and link treatment.
- **Primary + secondary buttons** — Side by side. These show hover motion (transition on hover — lift, glow, color shift, etc.) to communicate the tile's motion personality.
- **Light/dark toggle** — A single global toggle in the top-right of the page header. Clicking it toggles ALL tiles simultaneously. Every tile has both a light and dark mode — toggling swaps background, surface, text, and textMuted colors while keeping primary, secondary, and accent the same. This lets users evaluate how all directions work in both modes at once.
- **Thematic embellishments** — CSS-animated decorative elements that bring the card to life and communicate the site's personality. These are NOT generic — they're tailored to the site type and tile mood. See the Embellishments section below.

### Tile Expressiveness

Each tile should feel like a **mini homepage hero**, not a swatch card. Go beyond color dots and a paragraph:

- **Use the full tile height** — with only 3 tiles in a row, each card can be tall and dramatic
- **Typography should be theatrical** — oversized headlines, dramatic weight contrasts, creative line breaks. The heading IS the design statement.
- **Color isn't just dots** — the entire card background, text treatment, and decorative elements should immerse you in the palette. The dots are a reference, not the main event.
- **Embellishments define personality** — geometric shapes for minimal, hand-drawn textures for organic, neon glows for tech, grain/noise for editorial. These aren't decorations — they're the identity.
- **Buttons should look nothing alike** across tiles — pill vs. sharp rectangle vs. ghost outline vs. chunky 3D vs. underline-only. Button style is a huge personality signal.
- **Whitespace is a design choice** — one tile can be dense and information-rich, another can be 80% empty space with a single bold statement. Don't default to the same padding on all three.

**The test:** If you squint at the 3 tiles and they look roughly the same shape and density, you've failed. They should be immediately distinguishable at a glance.

### What a Style Tile is NOT

- **Not a full page** — No hero sections, no navigation, no footer. Just the design atoms.
- **Not tabbed panels** — All 3 tiles are visible at once in a single row. The whole point is comparison.
- **Not a swatch card** — Colors alone are meaningless without typography and component context.
- **Not a mood board** — No stock photos, no collages, no vibes-only artifacts. Every element is a real rendered specimen.

### Logo Integration

If a user-supplied logo is provided, each style tile should incorporate it:

- **Placement**: Display the logo in a compact brand bar at the top of each tile — small enough not to dominate, visible enough to judge the pairing with the tile's palette and typography.
- **Color harmony**: The tile's color palette must account for the logo's dominant colors. Don't clash — complement or contrast intentionally. If the logo is warm-toned, a cool palette can work if the interplay is deliberate, but a palette that fights the logo's colors is a failure.
- **The logo is secondary**: Style tiles are about design atoms (fonts, colors, spacing, buttons). The logo is there so the user can judge whether the direction works with their brand mark — it's not the focal point of the tile.
- **Reference path**: Use a dual-path `<img>` tag that works both when opened directly as a file AND when served inside the gallery iframe. The pattern: `<img src="../<logo-filename>" onerror="this.onerror=null;this.src='/?design-asset=<logo-filename>'" alt="...">`. The relative `../` path works for direct file access (tiles are in `styles/`, images in `design/`); the `onerror` fallback loads via the gallery's asset route when the relative path fails inside an iframe. Apply the same dual-path pattern to ALL user-supplied images, not just the logo.
- **No logo, no problem**: If no logo was provided, skip the brand bar entirely. Don't use placeholder logos or text-only stand-ins.

### Thematic Embellishments

Each tile gets CSS-only decorative elements that reinforce its mood and the site's personality. These are subtle but alive — they give each card character beyond just "colors + fonts."

**Match embellishments to the site type and tile mood:**

| Site Type / Mood | Embellishment Ideas |
|-----------------|---------------------|
| Kids / Playful | Floating colored squares, bouncing dots, rotating shapes |
| Party / Event | Corner sparkles, confetti particles, shimmer effects |
| Tech / SaaS | Subtle grid lines, data particles, pulse rings |
| Restaurant / Food | Steam wisps, gentle float effects, warm glows |
| Portfolio / Creative | Floating frames, brush stroke accents, ink splashes |
| Music / Entertainment | Equalizer bars, vinyl rotation, sound wave ripples |
| Luxury / Premium | Gold dust particles, subtle spotlight, gradient shimmer |
| Brutalist / Raw | Glitch flickers, noise grain, scan lines |
| Corporate / Professional | Subtle geometric patterns, clean line animations |
| Esports / Gaming | Neon glow pulses, glitch effects, energy trails |

**Embellishment rules:**
- CSS-only (keyframe animations, pseudo-elements, gradients). No JS, no images.
- Subtle enough not to obscure the content, visible enough to communicate personality.
- Each tile's embellishments should feel different — if two tiles have the same floating dots, one of them needs to change.
- Position embellishments in corners, edges, or as background effects. Never over the text or buttons.

### Technical Format

Style tiles render as a **3-column, single-row grid** on a single viewport. No tabs, no hidden panels — all 3 cards visible at once. The grid is vertically centered on large screens and responsive: 3 columns on desktop, 2 on tablets (max-width: 1024px), 1 on mobile (max-width: 600px).

**Font loading is critical.** Users are choosing typography, so they must see actual fonts rendered in the browser. Each tile loads its own fonts via Google Fonts `<link>` tags in the `<head>`.

Each tile's CSS scopes its font-family declarations to its own card, so fonts never bleed between tiles.

Tiles are not selectable in the browser — the user picks by telling you which tile number they want in the terminal. No click-to-select, no highlight outlines.

### Generating 3 Tiles

Plan 3 radically different aesthetic directions derived from the site's topic, industry, and audience. Selection criteria:

- **Appropriate for site type** — A law firm brief should not include a Playful/Creative tile. An esports site should not include Organic/Natural. Use judgment.
- **Genuinely different** — If two tiles look like siblings, kill one and replace it. The whole point is range.
- **Brief-informed** — Pull from the user's stated preferences, brand values, industry, and audience. The tiles should feel like they were designed for this project, not pulled from a generic gallery.

### Style Tile DO NOTs

- **No light/dark variants** — Do not generate the same concept twice in light + dark. 3 tiles means 3 radically distinct directions.
- **At least 1-2 bold/unexpected choices** — Every set must include tiles that push beyond the obvious. If a user asks for a "professional SaaS" site, at least one tile should challenge their assumptions about what professional can look like.
- **No reusing font pairings** — Every tile gets its own unique heading + body font combination. Zero repeats across the set.
- **No identical embellishments** — Each tile should have a visually distinct decorative treatment.

## Design Token Extraction

When the user selects a style tile (or mixes elements from multiple tiles), extract a structured token set that carries design decisions forward into page builds.

### Token Schema

```json
{
  "tokens": {
    "colors": {
      "primary": "#hex",
      "secondary": "#hex",
      "accent": "#hex",
      "light": {
        "background": "#hex",
        "surface": "#hex",
        "text": "#hex",
        "textMuted": "#hex"
      },
      "dark": {
        "background": "#hex",
        "surface": "#hex",
        "text": "#hex",
        "textMuted": "#hex"
      }
    },
    "typography": {
      "heading": { "family": "Font Name", "weights": [500, 700] },
      "body": { "family": "Font Name", "weights": [400, 500] },
      "scale": 1.25,
      "bodySize": "17px",
      "lineHeight": 1.6
    },
    "spacing": {
      "density": "generous | balanced | compact",
      "unit": "1rem",
      "sectionGap": "6rem",
      "elementGap": "1.5rem"
    },
    "motion": {
      "level": "subtle | moderate | expressive",
      "hoverTransition": "CSS transition shorthand",
      "entranceStyle": "fade-up | slide-in | scale | none",
      "entranceDuration": "0.6s",
      "entranceStagger": "0.1s"
    },
    "surfaces": {
      "borderRadius": "8px",
      "cardShadow": "CSS box-shadow value",
      "cardHoverShadow": "CSS box-shadow value"
    }
  }
}
```

### Token Persistence

- **Write** — Save to `outputs/design-tokens.json` the moment the user locks a direction (selects a tile or confirms a mix).
- **Re-read** — At every phase transition, re-read `outputs/design-tokens.json` as the source of truth. Never rely on conversation memory for token values.
- **Update** — During Phase 3 reconciliation, tokens may be refined (e.g. adjusting contrast ratios after seeing them in a full page context). Write the updated file immediately.

### Mixing Tiles

Users will often say "I like the colors from Tile 2 but the typography from Tile 5." When mixing:

1. **Extract each block independently** — Pull the relevant token block from each source tile.
2. **Resolve conflicts** — Check for incompatible combinations. Common conflicts:
   - Light/dark mode contrast issues — verify text is readable against background in BOTH modes
   - Expressive motion + compact spacing (visual chaos) — recommend reducing one
   - Heavy display heading font + heavy body font (no hierarchy) — suggest a lighter body weight
3. **Present the merged set** — Show the full merged token object to the user and ask for confirmation before writing to `outputs/design-tokens.json`. Never silently merge.

## Design Patterns Extraction

When the user locks a tile, extract **`design-patterns.html`** alongside `design-tokens.json`. Tokens capture design primitives (colors, fonts, spacing); patterns capture the component-level personality — how cards, heroes, buttons, and embellishments actually look and behave. Without patterns, Phase 3+ agents reinvent these from scratch and the approved tile's personality is lost.

### What to Include

Extract these from the selected tile's HTML and CSS:

| Pattern | What to extract |
|---------|----------------|
| **Cards** | Full HTML structure (image area + body with tag/heading/text/button) and CSS (image gradients, foam/texture effects, hover transforms, tag styling) |
| **Hero** | HTML structure (content + decorative elements) and CSS (background gradients, ambient overlays, grain texture, content constraints, decorative animations) |
| **Buttons** | Full hover state CSS per variant (transforms, box-shadows, `::after` shimmer overlay, dark-mode adaptations) |
| **Links** | Decoration thickness, underline offset, hover transitions, dark-mode adaptations |
| **Embellishments** | HTML structure (e.g. vine with leaf/cone children, bubble extras) and complete CSS (dot patterns, wood grain layers, vine/leaf shapes, bubble float animations) |
| **Animations** | All `@keyframes` definitions from the tile |
| **Extra CSS vars** | `--overlay`, `--dot-color`, `--grain-opacity`, `--embellish-opacity` and similar decorative control properties |

### What NOT to Include

These are already captured in `design-tokens.json` — do not duplicate them:

- Palette swatches section (color dots)
- Typography specimen samples
- Spacing rhythm visualizer
- Design notes table
- Base color/font/spacing CSS custom property declarations

### Output Format

Write a self-contained HTML file to `<site-path>/design/design-patterns.html`:

- A single `<style>` block containing all pattern CSS (component styles, hover states, animations, decorative vars)
- A `<body>` with labeled sections for each pattern category — use `<section>` elements with heading comments (e.g. `<!-- Cards -->`, `<!-- Hero -->`, `<!-- Embellishments -->`) containing the HTML structures
- Include the Google Fonts `<link>` tags from the tile so patterns render correctly if opened standalone
- Estimated size: ~500 lines (vs ~1140 for the full tile)

### Persistence

- **Write** — Save to `<site-path>/design/design-patterns.html` at the same time as `design-tokens.json` when the user locks a direction
- **Read** — Phase 3 and Phase 4 agents read this file alongside `design-tokens.json` to recreate the approved component patterns

## Phase 2 Variation Requirements

When generating style tiles:

- **3 tiles**, each from a radically different aesthetic territory — they should be immediately distinguishable at a glance
- **Different font pairings** on every tile — zero repeats for heading or body fonts across the set
- **Push maximum contrast between tiles** — vary darkness, density, type style, button treatment, embellishment approach. If one is minimal, another should be maximal.
- **At least 1 bold/unexpected choice** that pushes beyond the obvious for the site type
- **Brief-informed** — every tile should reflect the user's stated goals, audience, and brand
