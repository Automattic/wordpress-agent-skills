---
name: design-system-core
description: Shared creative foundations — WCAG rules, image cohesion, font/color constraints, motion by site type. Read by all design phases.
---

# Design Systems — Core Principles

## Absolute Rules

- **WCAG CONTRAST VERIFICATION**: Every color pairing MUST pass WCAG 2.1 AA minimums. This is a hard gate — do not present any design artifact without verifying contrast first.
  - Normal text (< 24px / < 18.66px bold): **4.5:1** minimum
  - Large text (≥ 24px / ≥ 18.66px bold) and UI components: **3:1** minimum
  - **When to verify:** Phase 2 (tile creation, token extraction), Phase 3 (page designs), Phase 4 (handoff)
  - **If a pairing fails:** Adjust the offending color. Prefer darkening text or lightening backgrounds. Always tell the user: "Adjusted [color] from #XXX to #YYY to meet WCAG AA contrast (was N:1, now N:1)."

- **IMAGE COLOR COHESION**: Every image must incorporate the site's color palette. Generic stock photos that clash with the palette break the design.

  **Image sourcing hierarchy:**
  1. **AI-Generated Images** (PRIMARY) — Generated via GPT Image with palette colors in prompts. Stored locally, work offline, perfect brand alignment.
  2. **CSS gradient/color overlays using brand colors** (FALLBACK 1) — Cover blocks with `overlayColor` and `dimRatio` to tint images.
  3. **Color-matched Unsplash search** (FALLBACK 2) — Search for images containing the palette's dominant colors.
  4. **Solid color backgrounds with typography** (FALLBACK 3) — Better than a clashing photo.

## Tone Direction

Do NOT pick from a fixed list of generic styles. Derive every direction from the site's topic, industry, culture, and audience:

- **Think like a specialist designer** hired for exactly this brief. What visual references would you research? What mood boards would you create? What real-world spaces, objects, materials, or cultural artefacts inform the aesthetic?
- **Ground each direction in the topic**. A traditional restaurant explores rustic warmth, refined elegance, or cultural heritage — never brutalist concrete. A tech startup explores clean precision, bold disruption, or data-driven minimalism — never cozy farmhouse.
- **Explore different visual worlds**. Ask: "What are the different visual worlds this site could inhabit?" Every industry has multiple authentic aesthetic territories.
- **Ensure authentic diversity**. 3 directions should vary meaningfully in color palette, typography, layout approach, and mood — but every one must feel plausible for *this specific type of site*. **Vary across multiple axes simultaneously — not just color swaps on the same layout.**
- **Name each direction specifically**. Titles should reflect the topic-grounded concept (e.g., "Warm Heritage" for a Swiss chalet), not generic labels like "Minimalist" or "Bold".

## Typography Constraints

**AVOID (overused/generic):** Inter, Roboto, Arial, System fonts, Space Grotesk, Open Sans

**PREFER (distinctive):** Pair a distinctive display font with a refined body font. Consider: Fraunces, Clash Display, Cabinet Grotesk, Satoshi, Outfit, Syne, DM Serif Display, Playfair Display, Cormorant Garamond, Archivo. Match font personality to brand.

**Text wrapping:** Headings: `text-wrap: balance`. Paragraphs: `text-wrap: pretty`.

## Color Constraints

**AVOID:** Purple gradients on white (cliched AI aesthetic), evenly distributed rainbow palettes, low-contrast washed-out schemes, generic blue (#007bff) as primary.

## Motion by Site Type

Match animation intensity to user expectations.

| Site Type | Level | Typical Effects |
|-----------|-------|-----------------|
| SaaS/Tech | Moderate | Smooth fades, staggered reveals, subtle parallax |
| Law firm/Finance | Subtle | Gentle fade-ins, minimal hover lifts |
| Restaurant/Food | Subtle-Moderate | Warm reveals, gentle image zooms |
| E-commerce | Moderate | Product hover effects, cart animations |
| Portfolio/Creative | Moderate-Expressive | Project reveals, image transitions |
| Esports/Gaming | Expressive | Glitch effects, fast reveals, neon pulses |
| Non-profit | Moderate | Impact stat count-ups, CTA pulses |
| Blog/Media | Subtle | Minimal, scroll progress, link hovers |

## General Rules (All Phases)

- **NEVER converge** on the same choices across generations
- Each option should feel like it came from a different designer
- Include at least one option that takes a creative risk
- Extraordinary creative work requires committing fully to a distinctive vision — don't hold back
