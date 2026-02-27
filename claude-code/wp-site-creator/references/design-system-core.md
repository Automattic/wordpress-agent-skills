---
name: design-system-core
description: Shared creative foundations — WCAG rules, image cohesion, design thinking, frontend aesthetics, motion by site type. Read by all design phases.
---

# Design Systems — Core Principles

Frameworks for creating distinctive, memorable web designs that avoid generic "AI slop" aesthetics.

## Absolute Rules

- **WCAG CONTRAST VERIFICATION**: Every color pairing in the design MUST pass WCAG 2.1 AA contrast minimums. This is a hard gate — do not present any design artifact (style tile, page layout, or handoff package) without verifying contrast first.

  **Thresholds:**
  - Normal text (< 24px / < 18.66px bold): **4.5:1** minimum
  - Large text (≥ 24px / ≥ 18.66px bold) and UI components: **3:1** minimum

  **Verification code** (run mentally or via tool for each pairing):

  ```python
  def relative_luminance(hex_color):
      """Calculate relative luminance per WCAG 2.1."""
      r, g, b = int(hex_color[1:3], 16) / 255, int(hex_color[3:5], 16) / 255, int(hex_color[5:7], 16) / 255
      r = r / 12.92 if r <= 0.04045 else ((r + 0.055) / 1.055) ** 2.4
      g = g / 12.92 if g <= 0.04045 else ((g + 0.055) / 1.055) ** 2.4
      b = b / 12.92 if b <= 0.04045 else ((b + 0.055) / 1.055) ** 2.4
      return 0.2126 * r + 0.7152 * g + 0.0722 * b

  def check_contrast(fg_hex, bg_hex):
      """Return contrast ratio between two hex colors."""
      l1 = relative_luminance(fg_hex)
      l2 = relative_luminance(bg_hex)
      lighter, darker = max(l1, l2), min(l1, l2)
      return (lighter + 0.05) / (darker + 0.05)
  ```

  **When to verify:**
  - **Phase 2 — Style tile creation**: Every tile's text/background pairs in both light and dark modes
  - **Phase 2 — Token extraction**: All token color pairings before writing `design-tokens.json`
  - **Phase 3 — Page designs**: All text/bg pairs, button text/bg, muted text readability
  - **Phase 4 — Handoff**: Final verification of all pairings in the design package

  **If a pairing fails:** Adjust the offending color to meet the threshold. Prefer darkening text or lightening backgrounds. Always tell the user: "Adjusted [color] from #XXX to #YYY to meet WCAG AA contrast (was N:1, now N:1)."

- **IMAGE COLOR COHESION**: Every image in the design must incorporate the site's color palette. Generic stock photos that clash with the palette break the design. This applies to hero backgrounds, feature images, team photos, and any other imagery.

  **Image sourcing hierarchy** (use these approaches in order):
  1. **AI-Generated Images** (PRIMARY) ✨ — Generated via OpenAI GPT Image 1.5 with palette colors incorporated into prompts. These images are stored locally in theme assets, work offline, and provide perfect brand alignment. The `image-generation` skill handles this automatically after design tokens are locked.
  2. **CSS gradient/color overlays using brand colors** (FALLBACK 1) — Use Cover blocks with `overlayColor` and `dimRatio` to tint images with the brand palette. Apply to Unsplash images when AI generation unavailable.
  3. **Color-matched Unsplash search** (FALLBACK 2) — Search for images that naturally contain the palette's dominant colors (e.g., "blue office interior" for a navy brand palette, "warm wood cafe" for brown/cream palettes). Hotlinked directly when AI generation unavailable.
  4. **Solid color backgrounds with typography** (FALLBACK 3) — When no suitable image exists, use a solid brand color background with typographic content instead. This is better than a clashing photo.

## Design Thinking Framework

Before designing, understand the context and commit to a BOLD aesthetic direction:

### 1. Purpose
- What problem does this design solve?
- Who uses it?
- What action should users take?

### 2. Tone
Pick an extreme position. Generic designs fail because they try to be everything. Choose ONE direction:

| Direction | Characteristics |
|-----------|----------------|
| Brutally minimal | Maximum whitespace, single accent color, stark typography |
| Maximalist chaos | Dense information, layered elements, controlled complexity |
| Retro-futuristic | Vintage meets tech, neon on dark, geometric shapes |
| Organic/natural | Soft curves, earthy tones, textured backgrounds |
| Luxury/refined | Rich colors, sophisticated typography, premium feel |
| Playful/toy-like | Bold colors, rounded shapes, unexpected interactions |
| Editorial/magazine | Grid-based, strong typographic hierarchy, clean sections |
| Brutalist/raw | Unconventional choices, exposed structure, bold statements |
| Art deco/geometric | Angular patterns, gold accents, symmetrical layouts |
| Soft/pastel | Gentle gradients, light colors, approachable feel |
| Industrial/utilitarian | Functional aesthetics, monospace fonts, exposed UI |

### 3. Constraints
- Technical requirements (framework, performance, accessibility)
- Brand guidelines (if any)
- Content requirements

### 4. Differentiation
What makes this UNFORGETTABLE? What's the one thing someone will remember?

## Frontend Aesthetics Guidelines

### Typography

Choose fonts that are beautiful, unique, and interesting.

**AVOID (overused/generic):**
- Inter
- Roboto
- Arial
- System fonts
- Space Grotesk (overused by AI)

**PREFER (distinctive choices):**
- Pair a distinctive display font with a refined body font
- Consider: Fraunces, Clash Display, Cabinet Grotesk, Satoshi, Outfit, Syne, DM Serif Display, Playfair Display, Cormorant Garamond, Archivo
- Match font personality to brand (tech: geometric sans; luxury: refined serif; creative: display fonts)

**Typography scale:**
- Use a consistent scale (1.25 or 1.333 ratio)
- Headings should command attention
- Body text should be comfortable to read (16-18px minimum)

**Text wrapping:**
- Headings: `text-wrap: balance` — prevents awkward short last lines
- Paragraphs: `text-wrap: pretty` — avoids orphaned words on the last line

### Color & Theme

Commit to a cohesive aesthetic. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.

**Strategies:**
- **Monochromatic with accent**: Single color family + one pop color
- **Complementary contrast**: Two opposing colors (careful with saturation)
- **Analogous harmony**: Adjacent colors on the wheel
- **Dark mode**: Not just inverted - design specifically for dark

**AVOID:**
- Purple gradients on white backgrounds (cliched AI aesthetic)
- Evenly distributed rainbow palettes
- Low-contrast, washed-out schemes
- Generic blue (#007bff) as primary

**Color proportions:**
- 60% dominant (backgrounds, large areas)
- 30% secondary (containers, sections)
- 10% accent (CTAs, highlights)

### Motion & Animation

Use animations for effects and micro-interactions. Prioritize CSS-only solutions.

**High-impact moments:**
- One well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions
- Scroll-triggered animations that surprise
- Hover states that respond meaningfully

**Implementation:** See the `${CLAUDE_PLUGIN_ROOT}/references/wordpress-block-theming.md` reference for CSS animation patterns and scroll-trigger integration.

### Spatial Composition

Break out of predictable layouts:

- **Asymmetry**: Off-center elements create visual interest
- **Overlap**: Elements crossing boundaries add depth
- **Diagonal flow**: Guide the eye with angled elements
- **Grid-breaking**: Strategic elements that escape the grid
- **Negative space**: Generous whitespace OR controlled density (pick one)

### Backgrounds & Visual Details

Create atmosphere and depth rather than defaulting to solid colors:

| Technique | Use Case |
|-----------|----------|
| Gradient meshes | Modern, dynamic feel |
| Noise textures | Warmth, tactile quality |
| Geometric patterns | Tech, precision |
| Layered transparencies | Depth, sophistication |
| Dramatic shadows | Premium, elevated |
| Decorative borders | Editorial, structured |
| Grain overlays | Vintage, analog feel |

### Iconography

- Use custom-designed SVG icons that align with the theme's aesthetic
- Maintain consistent stroke width and style
- Icons should complement, not compete with content

## Matching Complexity to Vision

**IMPORTANT**: Match implementation complexity to the aesthetic vision.

**Maximalist designs need:**
- Elaborate code with extensive animations
- Multiple visual layers
- Rich interactive effects
- Dense styling

**Minimalist designs need:**
- Restraint and precision
- Careful attention to spacing
- Subtle typography refinements
- Every detail intentional

Elegance comes from executing the vision well, not from adding more features.

## Motion by Site Type

Match animation intensity to user expectations. Overdoing motion on a law firm site is as bad as underdoing it on a gaming site.

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
