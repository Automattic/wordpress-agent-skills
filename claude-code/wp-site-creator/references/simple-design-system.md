---
name: simple-design-system
description: Design philosophy, aesthetic guidelines, and layout patterns for web design previews and themes.
---

# Design System Reference

Frameworks for creating distinctive, memorable web designs that avoid generic "AI slop" aesthetics.

## Design Thinking Framework

Before designing, understand the context and commit to a BOLD aesthetic direction:

### 1. Purpose
- What problem does this design solve?
- Who uses it?
- What action should users take?

### 2. Tone
Do NOT pick from a fixed list of generic styles. Instead, derive every direction from the site's topic, industry, culture, and audience:

- **Think like a specialist designer** who has been hired for exactly this brief. What visual references would you research? What mood boards would you create? What real-world spaces, objects, materials, or cultural artefacts inform the aesthetic?
- **Ground each direction in the topic**. For a traditional restaurant, directions might explore rustic warmth, refined elegance, or cultural heritage — never brutalist concrete. For a tech startup, directions might explore clean precision, bold disruption, or data-driven minimalism — never cozy farmhouse.
- **Explore different visual worlds**. Ask: "What are the different visual worlds this site could inhabit?" Every industry has multiple authentic aesthetic territories. A craft brewery could inhabit taproom warmth, label-art maximalism, or industrial grain-and-steel. A law firm could inhabit courtroom gravitas, modernist confidence, or neighborhood counsel. Identify the worlds specific to *this* topic.
- **Ensure authentic diversity**. The 3 directions should vary meaningfully in color palette, typography, layout approach, and mood — but every one must feel like a plausible, thoughtful design for *this specific type of site*. Diversity comes from exploring different facets of the topic, not from importing unrelated aesthetics. **Vary across multiple axes simultaneously — not just color swaps on the same layout.**
- **Name each direction specifically**. Titles should reflect the topic-grounded concept (e.g., "Warm Heritage" or "Alpine Elegance" for a Swiss chalet site), not generic labels like "Minimalist" or "Bold".

### 3. Constraints
- Technical requirements (framework, performance, accessibility)
- Brand guidelines (if any)
- Content requirements

### 4. Differentiation
What makes this UNFORGETTABLE? What's the one thing someone will remember?

### 5. Validate Topic Fit
A viewer should be able to guess what the site is about from the visual design alone, without reading the text. If the design could belong to any random site, it's too generic — rework it.

## Frontend Aesthetics Guidelines

You tend to converge toward generic, "on distribution" outputs. In frontend design, this creates what users call the "AI slop" aesthetic. Avoid this: make creative, distinctive frontends that surprise and delight.

### Typography

Choose fonts that are beautiful, unique, and interesting.

**AVOID (overused/generic):**
- Inter
- Roboto
- Arial
- System fonts
- Space Grotesk (overused by AI)
- Open Sans (generic, overused)

**PREFER (distinctive choices):**
- Pair a distinctive display font with a refined body font
- Consider: Fraunces, Clash Display, Cabinet Grotesk, Satoshi, Outfit, Syne, DM Serif Display, Playfair Display, Cormorant Garamond, Archivo
- Match font personality to brand (tech: geometric sans; luxury: refined serif; creative: display fonts)
- Unexpected, characterful font choices that elevate the frontend's aesthetics

**Typography scale:**
- Use a consistent scale (1.25 or 1.333 ratio)
- Headings should command attention
- Body text should be comfortable to read (16-18px minimum)

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
- Timid, evenly-distributed palettes

**Color proportions:**
- 60% dominant (backgrounds, large areas)
- 30% secondary (containers, sections)
- 10% accent (CTAs, highlights)

### Motion & Animation

Motion is a design system element like color and typography — it should be intentional, cohesive, and matched to the site's personality. Prioritize CSS-only solutions.

**Technique palette** — choose from these categories to create a rich, dynamic experience:

| Category | Techniques |
|----------|-----------|
| Entrance animations | Fade-up, slide-in, scale-up, clip-path reveals — with staggered delays for groups |
| Hover/focus transitions | Card lifts, button transforms, underline grows, color shifts, shadow deepens |
| Continuous subtle motion | Floating elements, pulsing accents, slow-rotating decorative shapes, gradient shifts |
| Scroll-triggered reveals | Sections/elements animate as they enter the viewport |
| Background animation | Gradient color cycling, pattern movement, ambient drift |
| Text effects | Letter-spacing transitions, weight shifts, color wipes on headings |

**Implementation:** Add scroll-triggered entrance animations, hover transitions, and ambient motion appropriate to the site's personality. Always respect `prefers-reduced-motion`. See the `${CLAUDE_PLUGIN_ROOT}/references/wordpress-block-theming.md` reference for CSS patterns and IntersectionObserver integration.

Any entrance animation class that sets `opacity: 0` or uses `transform` as a hidden state needs a corresponding `.editor-styles-wrapper` override so content remains visible in the WordPress block editor (where the reveal JavaScript does not run).

**Orchestration guidance:**
- **Pick 2-3 motion techniques per site** and use them consistently, subtly — don't scatter every technique across a single page
- **Match motion to personality**: tech sites = precise, snappy timing; luxury = slow, elegant easing; playful = bouncy, energetic curves
- **Entrance animations** should follow a clear reading order — top-to-bottom, left-to-right stagger
- **Scroll reveals** are the highest-impact pattern: sections animate as they enter the viewport, creating a sense of narrative progression

### Spatial Composition

Break out of predictable layouts. Use unexpected layouts and avoid generic patterns:

- **Asymmetry**: Off-center elements create visual interest
- **Overlap**: Elements crossing boundaries add depth
- **Diagonal flow**: Guide the eye with angled elements
- **Grid-breaking**: Strategic elements that escape the grid
- **Negative space**: Generous whitespace OR controlled density (pick one)

Do NOT default to "text left, image right". Each design direction should use a different layout approach.

Interpret creatively and make unexpected choices that feel genuinely designed for the context.

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

## Design Variety and Variation

When generating multiple designs:

Each design should feel unmistakably different — as if created by a different designer. Fully commit to each direction and push it as far as it can go.

### Never Converge
- **NEVER converge** on the same choices across generations
- No design should be the same
- Avoid overused fonts (see AVOID list above) across generations
- Each design should feel genuinely different

### Vary Core Elements

**Color Variation:**
- Mix light and dark themes
- Mix warm and cool palettes
- Mix monochromatic and colorful approaches

**Typography Variation:**
- Use different font combinations each time
- Mix serif and sans-serif headings
- Mix elegant and bold type treatments
- Vary type scale and hierarchy

**Layout Variation:**
- Mix full-width and contained layouts
- Mix asymmetric and symmetric compositions
- Vary density (spacious vs. compact)

**Style Variation:**
- Explore different aesthetic territories
- Each design should feel like it could be the foundation for a distinct, complete website
- Avoid converging on similar solutions

**Ensure significant variation:** The designs should vary meaningfully in color palette, typography, layout approach, and mood — but every one must feel like a plausible, thoughtful design for the specific site context.

Remember: Extraordinary creative work requires committing fully to a distinctive vision. Don't hold back.

## Hero & Section Layout Patterns

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
  <img src="hero.jpg" alt="..."
       style="width:100%;height:auto;object-fit:cover;" />
  <div class="hero-content"><!-- compact text: short headline + 1-2 sentences --></div>
</section>
```

### Centered/stacked
Image above or below the headline, centered (no side-by-side fitting issues).
```html
<section class="hero wide-width" style="text-align:center;min-height:100vh;display:flex;flex-direction:column;justify-content:center;">
  <h1>Headline</h1>
  <img src="hero.jpg" alt="..."
       style="max-width:800px;width:100%;margin:2rem auto;" />
</section>
```

### Asymmetric placement
Image breaking the grid, overlapping sections, or positioned unexpectedly.

### Partial coverage
Image covering 60-70% of hero width with text in the remaining space.

### Split diagonal
Image and content divided by a diagonal line or angle using `clip-path`.

### Framed/inset
Image in a styled frame, border, or window effect.

### Right-aligned (use sparingly)
Image on the right, text on the left — use sparingly, not as the default.

**Sizing reminder:** For side-by-side layouts, use `1fr 1fr` or percentage splits — never fixed pixel widths that could exceed 1280px and cause stacking.

## Layout Width Constraints

To ensure the preview accurately reflects the final WordPress theme layout, follow these constraints:

**Define CSS variables for layout widths:**
```css
:root {
    --content-size: 800px;  /* For body text and narrow content */
    --wide-size: 1280px;    /* For hero sections, headers, wide content */
}
```

**Apply constraints to content:**
- **Body/paragraph content**: Max-width of `var(--content-size)` (800px)
- **Hero sections, headers, feature areas**: Max-width of `var(--wide-size)` (1280px)
- **Only use full viewport width** for backgrounds, not content containers

**Recommended container classes:**
```css
body {
    margin: 0;
    padding: 0;
}

/* Content container for body text */
.content-width {
    max-width: var(--content-size);
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
}

/* Wide container for headers, heroes */
.wide-width {
    max-width: var(--wide-size);
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
}
```

**When to use which width:**
- Header navigation: `.wide-width` (1280px max)
- Hero sections: `.wide-width` (1280px max)
- Background layers can be full-width, but content inside should be constrained

Even with background colors/gradients that extend full-width, the actual text and content should be centered with these max-width constraints applied.

## Designing Layouts That Fit

When creating side-by-side layouts (text + image, two columns, etc.), ensure elements are sized to fit within 1280px without stacking.

- **Use percentage-based or fractional widths** for multi-column layouts:
  ```css
  /* Good: proportional columns that fit */
  .hero-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;  /* 50/50 split */
      /* or */ grid-template-columns: 45% 55%;  /* asymmetric */
      /* or */ grid-template-columns: 1fr 1.5fr;  /* fractional */
  }
  ```

- **Avoid fixed pixel widths** on side-by-side elements that could exceed the container:
  ```css
  /* Bad: fixed widths that may stack */
  .hero-text { width: 700px; }
  .hero-image { width: 700px; }  /* 1400px total - won't fit! */

  /* Good: flexible widths */
  .hero-text { flex: 1; max-width: 500px; }
  .hero-image { flex: 1; }
  ```

- **For side-by-side hero layouts**, keep text blocks compact:
  - Headlines: 2-6 words per line, not full paragraphs
  - Subtext: 1-2 short sentences max
  - Don't pad text containers excessively

- **Test mentally**: Will a ~600px text area + ~600px image + gaps fit in 1280px? If not, adjust proportions or choose a different layout (stacked, full-bleed background, etc.)

## Creating Visual Richness Beyond Images

Convey atmosphere and visual interest through CSS techniques rather than relying on stock imagery:

- **CSS Gradients**: Linear, radial, and conic gradients for depth and color
- **Color Blocks**: Bold use of background colors to create visual hierarchy
- **Typography as Design**: Large, distinctive headings; creative font pairing; varied text sizes and weights
- **CSS Patterns**: Repeating backgrounds using CSS gradients (stripes, dots, grids)
- **Shadows & Depth**: Box-shadow, text-shadow, and drop-shadow for dimension
- **Borders & Frames**: Creative use of borders, outlines, and decorative frames
- **Spacing & Layout**: Generous whitespace or controlled density to create mood
- **CSS Pseudo-elements**: ::before and ::after for decorative visual elements
- **Color Overlays**: Layered divs with transparency for atmospheric effects
