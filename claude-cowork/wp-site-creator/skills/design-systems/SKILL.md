---
name: design-systems
description: Bold aesthetic direction guidance for web design. Use when making creative decisions about typography, color, motion, spatial composition, and overall visual style. Helps avoid generic "AI slop" aesthetics.
---

# Design Systems Skill

Frameworks for creating distinctive, memorable web designs that avoid generic "AI slop" aesthetics.

## Absolute Rules

- **NO EMOJIS**: Never use emojis anywhere in generated content - not in headings, paragraphs, button text, or any other text.

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
- **Ensure authentic diversity**. The 4 directions should vary meaningfully in color palette, typography, layout approach, and mood — but every one must feel like a plausible, thoughtful design for *this specific type of site*. Diversity comes from exploring different facets of the topic, not from importing unrelated aesthetics.
- **Name each direction specifically**. Titles should reflect the topic-grounded concept (e.g., "Warm Heritage" or "Alpine Elegance" for a Swiss chalet site), not generic labels like "Minimalist" or "Bold".


### 3. Constraints
- Technical requirements (framework, performance, accessibility)
- Brand guidelines (if any)
- Content requirements

### 4. Differentiation
What makes this UNFORGETTABLE? What's the one thing someone will remember?

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

**CSS animation patterns:**
```css
/* Staggered fade-up entrance */
.fade-up {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeUp 0.6s ease forwards;
}
.fade-up:nth-child(1) { animation-delay: 0.1s; }
.fade-up:nth-child(2) { animation-delay: 0.2s; }
.fade-up:nth-child(3) { animation-delay: 0.3s; }
.fade-up:nth-child(4) { animation-delay: 0.4s; }

@keyframes fadeUp {
  to { opacity: 1; transform: translateY(0); }
}

/* Slide-in from side */
.slide-in-left {
  opacity: 0;
  transform: translateX(-40px);
  animation: slideInLeft 0.7s ease forwards;
}
@keyframes slideInLeft {
  to { opacity: 1; transform: translateX(0); }
}

/* Scale reveal */
.scale-up {
  opacity: 0;
  transform: scale(0.9);
  animation: scaleUp 0.5s ease forwards;
}
@keyframes scaleUp {
  to { opacity: 1; transform: scale(1); }
}

/* Continuous float — decorative elements */
.float {
  animation: float 3s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Gradient background animation */
.gradient-shift {
  background-size: 200% 200%;
  animation: gradientShift 8s ease infinite;
}
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Hover transitions */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}

/* Accessibility: always include */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

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
