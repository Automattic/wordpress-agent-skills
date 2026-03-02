---
name: design-system-phase3
description: Page layout composition, section patterns, and visual richness using locked design tokens. Read by Phase 3 page and Phase 4 mockup subagents.
---

# Design Systems — Phase 3: Page Layout Composition

## Phase 3 Variation Requirements

> **Tokens are LAW.** Everything below is about *arrangement and composition* — how you structure sections, place content, and create visual interest. Colors, fonts, spacing values, motion timing, and surface styles come exclusively from `design-tokens.json`. Do not introduce new colors, font families, or spacing scales.

When generating full page designs:

- **3 layout variations** sharing the same locked design tokens from Phase 2
- **Vary layout and arrangement only** — same colors, same fonts, same motion level, different structure
- **Each layout genuinely different** — vary hero treatment, section ordering, grid patterns, content density, and visual hierarchy
- **Tokens are law** — do not drift from `outputs/design-tokens.json` values. Flag discrepancies for reconciliation rather than silently changing.

### Hero Vertical Spacing

Hero content must start in the **upper third** of the viewport — never vertically centered in a tall container.

- **Do NOT** use `min-height: 100vh` with `justify-content: center` or `align-items: center` on full-height heroes — this pushes the headline to the middle of the screen.
- **Instead**: use generous top padding (`clamp(4rem, 10vw, 8rem)`) and let the section's natural height be determined by content. Add bottom padding for a tall hero — not vertical centering.
- **If using `min-height: 100vh`**: pin content to the top with `align-items: flex-start` and use top padding for breathing room.

### Layout Width Constraints

```css
:root {
    --content-size: 800px;  /* Body text and narrow content */
    --wide-size: 1280px;    /* Hero sections, headers, wide content */
}
```

- `.content-width` — `max-width: var(--content-size)`, auto margins, horizontal padding. For body text and narrow content.
- `.wide-width` — `max-width: var(--wide-size)`, auto margins, horizontal padding. For headers, heroes, feature grids.
- Background colors/gradients/images can extend full viewport width, but text and interactive content must be constrained.

### Responsive Layout Fit

- **Use percentage or fractional widths** — `1fr 1fr`, `45% 55%`, `1fr 1.5fr`. Never fixed pixel widths on side-by-side elements.
- **Keep text blocks compact in split layouts** — headlines: 2–6 words per line; subtext: 1–2 short sentences max.
- **Mental test:** Will ~600px text + ~600px image + gaps fit in 1280px? If not, adjust proportions or choose stacked/full-bleed instead.

### Using Design Patterns

`design-patterns.html` is the component-level companion to `design-tokens.json`. Tokens define primitives; patterns define how components look and behave — the site's visual personality.

**Read `<site-path>/design/design-patterns.html` before generating layouts.** It contains approved HTML structure and CSS for cards, hero sections, buttons, links, embellishments, and animations.

**How to use patterns:**

- **Cards, hero sections, buttons** — Match the approved patterns' HTML structure, hover states, and decorative treatments. Adapt to layout context but preserve the visual treatment.
- **Embellishments and animations** — Reuse directly. Copy the CSS and HTML structures into layouts. Do not replace with generic alternatives.
- **Link styling** — Use the approved decoration thickness, underline offset, and hover transitions.
- **Decorative CSS vars** — Carry forward vars like `--overlay`, `--dot-color`, `--grain-opacity`, `--embellish-opacity`.

**Patterns can be adapted but not replaced.** You may adjust sizing or positioning, but the visual language — gradients, textures, hover effects, decorative elements — must remain recognizably the same.

### Topic Fit Litmus Test

A viewer should be able to guess what the site is about from the layout and visual treatment alone. If the page could belong to any random site, the composition is too generic — rework it.

## Preview HTML Patterns

Do NOT default to "image block on the right side". Choose a layout that fits the aesthetic direction. Each design direction should use a different hero layout approach.

### Full-bleed background
Image covers the entire hero with text overlaid (use color overlay for readability).
```html
<section class="hero" style="position:relative;min-height:100vh;">
  <img src="hero.jpg" alt="..."
       style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;" />
  <div class="wide-width" style="position:relative;z-index:1;"><!-- overlay content --></div>
</section>
```

### Left-aligned image
Image on the left, text on the right (50/50 split using fr units).
```html
<section class="hero wide-width" style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;min-height:100vh;align-items:center;">
  <img src="hero.jpg" alt="..." style="width:100%;height:auto;object-fit:cover;" />
  <div class="hero-content"><!-- compact text: short headline + 1-2 sentences --></div>
</section>
```

### Centered/stacked
Image above or below the headline, centered.
```html
<section class="hero wide-width" style="text-align:center;min-height:100vh;display:flex;flex-direction:column;justify-content:center;">
  <h1>Headline</h1>
  <img src="hero.jpg" alt="..." style="max-width:800px;width:100%;margin:2rem auto;" />
</section>
```

### Other approaches
- **Asymmetric placement** — Image breaking the grid, overlapping sections, or positioned unexpectedly.
- **Partial coverage** — Image covering 60-70% of hero width with text in the remaining space.
- **Split diagonal** — Image and content divided by a diagonal line using `clip-path`.
- **Framed/inset** — Image in a styled frame, border, or window effect.
- **Right-aligned** (use sparingly) — Image on the right, text on the left.

**Sizing:** For side-by-side layouts, use `1fr 1fr` or percentage splits — never fixed pixel widths that could exceed 1280px.
