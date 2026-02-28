---
name: design-system-phase3
description: Page layout composition, grid math, section patterns, and visual richness using locked design tokens. Read by Phase 3 page and Phase 4 mockup subagents.
---

# Design Systems — Phase 3: Page Layout Composition

## Grid Math Rules

Grids must be mathematically clean. No orphaned items, no awkward last rows.

- **No orphaned items** — If 5 features sit in a 3-column grid, the last row has 2 items and 1 empty slot. Fix it: add a 6th item, reduce to 4 items, or use a different layout (e.g. 2+3 stagger, full-width final item).
- **Equal widths** — Items in a row share width equally: `100% / n` (minus gap). No mixing 1/3 + 2/3 splits unless it is an intentional asymmetric design choice.
- **Max 4 per row** — Never exceed 4 items in a single row. Dense grids are unreadable.
- **Responsive behavior** — Mobile: 1 item per row, always. Tablet: 2 items per row maximum. Desktop: up to 4 per the max rule.

## Phase 3 Variation Requirements

> **Tokens are LAW.** Everything below is about *arrangement and composition* — how you structure sections, place content, and create visual interest. Colors, fonts, spacing values, motion timing, and surface styles come exclusively from `design-tokens.json`. Do not introduce new colors, font families, or spacing scales. Use the locked values creatively.

When generating full page designs:

- **3 layout variations** that all share the same locked design tokens from Phase 2
- **Vary layout and arrangement only** — same colors, same fonts, same motion level, different structure
- **Each layout genuinely different** — vary hero treatment, section ordering, grid patterns, content density, and visual hierarchy approach
- **Tokens are law** — do not drift from `outputs/design-tokens.json` values. If something looks wrong in context, flag it for reconciliation rather than silently changing it.

### Section Composition Patterns

Each of the 3 layout options should use a different hero composition and vary section arrangements throughout the page. Choose from these compositional approaches for any section — hero, features, testimonials, CTA, etc.:

- **Full-bleed background** — background color/gradient covers viewport width; content constrained within `--wide-size`. High visual impact for hero and CTA sections.
- **Split layout** — content and media/visual side by side using `1fr 1fr` or percentage splits (never fixed pixel widths). Good for features, about sections, and hero variants.
- **Centered/stacked** — vertically stacked elements, horizontally centered. Clean and readable for text-heavy sections, testimonials, or pricing.
- **Asymmetric placement** — off-center content that intentionally breaks the grid. Creates visual tension and draws the eye. Use for hero sections or key narrative moments.
- **Overlapping sections** — elements that cross section boundaries (negative margins, absolute positioning) to create depth and connection between adjacent sections.
- **Alternating rhythm** — sections alternate between layout approaches (e.g., left-aligned split → centered stack → right-aligned split) to create visual flow down the page.

Do NOT default to "text left, image right" for every section. Each page design should demonstrate a distinct compositional strategy.

### Hero Vertical Spacing

Hero content must start in the **upper third** of the viewport — never vertically centered in a tall container. A huge empty gap between the header and the headline looks broken, not dramatic.

- **Do NOT** use `min-height: 100vh` with `justify-content: center` or `align-items: center` on full-height heroes — this pushes the headline to the middle of the screen.
- **Instead**: use generous top padding (`clamp(4rem, 10vw, 8rem)`) to place content comfortably below the header, and let the section's natural height be determined by its content. If you want a tall hero, add bottom padding — not vertical centering.
- **If using `min-height: 100vh`**: pin content to the top with `align-items: flex-start` and use top padding for breathing room. The empty space goes below the content, not above it.

### Layout Width Constraints

These are structural layout values, independent of design tokens. They define how content sits within the viewport:

```css
:root {
    --content-size: 800px;  /* Body text and narrow content */
    --wide-size: 1280px;    /* Hero sections, headers, wide content */
}
```

**Container classes:**
- `.content-width` — `max-width: var(--content-size)`, auto margins, horizontal padding. Use for body text, paragraphs, narrow content blocks.
- `.wide-width` — `max-width: var(--wide-size)`, auto margins, horizontal padding. Use for headers, hero sections, feature grids, and wide layouts.

**Rule:** Background colors, gradients, and images can extend full viewport width, but the actual text and interactive content inside must be constrained by one of these widths.

### Responsive Layout Fit

When creating multi-column layouts, ensure elements fit within the container:

- **Use percentage or fractional widths** — `1fr 1fr`, `45% 55%`, `1fr 1.5fr`. Never fixed pixel widths on side-by-side elements.
- **Keep text blocks compact in split layouts** — headlines: 2–6 words per line; subtext: 1–2 short sentences max. Don't pad text containers excessively.
- **Mental test:** Will a ~600px text area + ~600px image + gaps fit in 1280px? If not, adjust proportions or choose a stacked/full-bleed layout instead.

### Visual Richness via CSS (Using Token Colors)

Create atmosphere and depth through CSS techniques — but always using the locked palette colors, font families, and spacing values from `design-tokens.json`. Never introduce arbitrary new colors or fonts.

- **CSS gradients** — linear, radial, and conic gradients using token palette colors for backgrounds and overlays
- **Color blocks** — bold use of token surface/background colors to create visual hierarchy between sections
- **Typography as design** — large, distinctive headings using token font families; creative use of token font weights and scale for emphasis
- **CSS patterns** — repeating gradients (stripes, dots, grids) built from token palette colors
- **Shadows & depth** — box-shadow and drop-shadow using token shadow values (or extending them with token colors)
- **Borders & frames** — decorative borders and outlines using token colors and border-radius values
- **Spacing & layout** — generous whitespace or controlled density, respecting the token spacing density setting
- **CSS pseudo-elements** — `::before` and `::after` for decorative elements, colored with token palette values
- **Color overlays** — layered elements with token colors at reduced opacity for atmospheric depth

### Using Design Patterns

`design-patterns.html` is the component-level companion to `design-tokens.json`. Tokens define the palette and primitives; patterns define how components look and behave — the site's visual personality.

**Read `<site-path>/design/design-patterns.html` before generating layouts.** It contains the approved HTML structure and CSS for cards, hero sections, buttons, links, embellishments, and animations extracted from the selected style tile.

**How to use patterns:**

- **Cards, hero sections, buttons** — Match the approved patterns' HTML structure, hover states, and decorative treatments. Adapt to the layout context (e.g. a card pattern can work in a 2-column or 3-column grid) but preserve the visual treatment (gradients, shadows, hover transforms, tag styling).
- **Embellishments and animations** — Reuse directly. These are the approved decorative personality — dot patterns, wood grain, vine shapes, bubble floats, grain textures, etc. Copy the CSS and HTML structures into your layouts. Do not replace them with generic alternatives.
- **Link styling** — Use the approved decoration thickness, underline offset, and hover transitions.
- **Decorative CSS vars** — Carry forward vars like `--overlay`, `--dot-color`, `--grain-opacity`, `--embellish-opacity` from the patterns file.

**Patterns can be adapted but not replaced.** You may adjust a card's image treatment for a different aspect ratio, or reposition embellishments to fit a new section layout. But the visual language — the gradients, textures, hover effects, and decorative elements — must remain recognizably the same as the approved tile.

### Topic Fit Litmus Test

A viewer should be able to guess what the site is about from the layout and visual treatment alone. If the page could belong to any random site, the composition is too generic — rework it.
