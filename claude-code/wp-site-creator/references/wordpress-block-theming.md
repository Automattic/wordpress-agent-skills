---
name: wordpress-block-theming
description: WordPress Full Site Editing (FSE) theme architecture. Use when generating theme.json, block templates, template parts, patterns, and functions.php for WordPress block themes.
---

# WordPress Block Theming Skill

## Absolute Rules

- **NO HTML BLOCKS**: Never use `<!-- wp:html -->` (the `core/html` block). HTML blocks are opaque blobs in the block editor — users cannot select, style, or rearrange individual elements inside them. Every piece of content MUST use a proper core block (`wp:group`, `wp:heading`, `wp:paragraph`, `wp:columns`, etc.). If you find yourself reaching for `wp:html`, stop and decompose the content into the correct core blocks with `className` attributes and CSS instead.
- **NO DECORATIVE HTML COMMENTS**: Never insert non-block HTML comments like `<!-- Hero Section -->` or `<!-- Features -->` in templates, template parts, or patterns. The only HTML comments allowed are WordPress block delimiters (`<!-- wp:block-name -->` / `<!-- /wp:block-name -->`).

## theme.json

- **Font size scale**: Keep sizes grounded. Body: 1rem. Headings: scale modestly (h1 ≤ 2.5–3rem). Use `clamp()` for responsive display text, cap at ~3.5rem. A good 6-step scale: 0.875rem / 1rem / 1.25rem / 1.75rem / 2.25rem / clamp(2.5rem, 4vw, 3.5rem).
- **Line height**: Body text: 1.5–1.65. Headings: 1.1–1.3. Never below 1.0.

## Cover Block Pitfalls

### Hero Height

WordPress cover blocks use flexbox with `align-items: center` to vertically center content. Combined with `min-height: 100vh` and large padding, content floats in the middle with excessive whitespace.

- **Use `60vh`** as the default hero cover block height
- Keep top padding modest (e.g., `5rem`) — the cover's flexbox centering handles vertical positioning
- Cover block `minHeight` only accepts number + unit (e.g., `60` + `vh`), not CSS functions like `clamp()`

### Centered Decorative Badges

Badges with `::before`/`::after` lines require `flex` display. Cover block inner container uses flexbox centering only — no `text-align: center`.

```css
/* WRONG — left-aligns inside cover blocks */
.hero-badge { display: inline-flex; }

/* RIGHT — centers properly */
.hero-badge { display: flex; justify-content: center; align-items: center; gap: 0.5rem; }
```

## Template Parts

### Header Requirements
- Constrained layout group with site-appropriate background
- Flex row: `site-title` (level:0 — renders `<p>` not `<h1>`) + `navigation`

### Footer Requirements
- Constrained layout group, matching or complementing header style
- Include footer margin reset in style.css

### Page Title
Include a page title template by default that reflects the main landing page design. Use `<!-- wp:post-title /-->` for dynamic titles.

## functions.php

**IMPORTANT:** Always use `enqueue_block_assets` hook (not `wp_enqueue_scripts`) to ensure fonts load in BOTH front-end AND block editor.

## Animation & Motion in Block Themes

### The className Pattern

Add animation classes to blocks via the `className` JSON attribute:

```html
<!-- wp:group {"className":"fade-up","align":"full","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull fade-up"><!-- content --></div>
<!-- /wp:group -->
```

Works on any block — groups, columns, headings, paragraphs, buttons, images.

### Scroll-Triggered Reveals via functions.php

Output an IntersectionObserver script via `wp_footer`:

```php
function theme_slug_scroll_animations() {
    ?>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        var els = document.querySelectorAll('.animate-on-scroll');
        if (!els.length) return;
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        els.forEach(function(el) { observer.observe(el); });
    });
    </script>
    <?php
}
add_action( 'wp_footer', 'theme_slug_scroll_animations' );
```

Pair with CSS:
```css
.animate-on-scroll { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
.animate-on-scroll.is-visible { opacity: 1; transform: translateY(0); }
```

### prefers-reduced-motion (Required)

Every theme MUST include:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  .animate-on-scroll, .fade-up, .fade-in, .slide-in-left, .slide-in-right, .scale-up {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

### Editor Visibility (Required)

The IntersectionObserver runs only on the front-end — not inside the editor iframe. Any block with an entrance animation class that sets `opacity: 0` will be invisible in the editor. WordPress wraps editor content in `.editor-styles-wrapper`.

Every theme MUST include:
```css
.editor-styles-wrapper .fade-up,
.editor-styles-wrapper .fade-in,
.editor-styles-wrapper .slide-in-left,
.editor-styles-wrapper .slide-in-right,
.editor-styles-wrapper .scale-up,
.editor-styles-wrapper .animate-on-scroll,
.editor-styles-wrapper .stagger-children > * {
  opacity: 1 !important;
  transform: none !important;
  animation: none !important;
  transition: none !important;
}
```

If the theme uses custom animation classes that hide content, add corresponding `.editor-styles-wrapper` selectors.

## Card Layouts

For equal-height, equal-width cards with optional bottom-aligned CTAs:

```
Columns (className: "equal-cards")
  └── Column (verticalAlignment: "stretch", width: "X%" where X = 100/N)
        └── Group [card wrapper]
              └── [content]
              └── (optional) Buttons (className: "cta-bottom")
```

**Required CSS:**
```css
.equal-cards > .wp-block-column { display: flex; flex-direction: column; flex-grow: 0; }
.equal-cards > .wp-block-column > .wp-block-group { display: flex; flex-direction: column; flex-grow: 1; }
.equal-cards .cta-bottom { margin-top: auto; justify-content: center; }
.wp-site-blocks > footer { margin-block-start: 0; }
```

## Landing Page Composition

### Section Architecture

- **Section margin reset**: Add `"style":{"spacing":{"margin":{"top":"0"}}}` to every top-level Group block wrapping a landing page section.
- **Section layout widths**: Hero, header, cover, feature grids → `"align":"wide"` or `"align":"full"`. Only use default alignment for text-heavy reading sections.
- Do **not** use `<inner-blocks>`; output full expanded markup.
- **Columns**: ALWAYS set `"align":"wide"` on `wp:columns` blocks.
- **No HTML blocks**, **no decorative HTML comments**.

### Common Block Mistakes

**1. Complex layout in an HTML block** — WRONG:
```html
<!-- wp:html -->
<div class="features-grid"><div class="feature"><h3>Fast</h3><p>Quick.</p></div></div>
<!-- /wp:html -->
```
RIGHT — use `wp:columns` with `wp:column` containing `wp:heading` and `wp:paragraph` blocks.

**2. Styled heading in an HTML block** — WRONG:
```html
<!-- wp:html --><h2 class="gradient-text">Our Services</h2><!-- /wp:html -->
```
RIGHT — use `className` on `wp:heading`, define `.gradient-text` in `style.css`.

**3. Entire section in an HTML block** — Use `wp:group` with `className`, define styles in `style.css`. Decompose all content into core blocks.

**4. Decorative HTML comments** — Remove all non-block comments. Only `<!-- wp:block-name -->` delimiters allowed.

**Full-bleed wrapper, constrained content pattern:**
```
<!-- wp:group {"align":"full","backgroundColor":"...","layout":{"type":"constrained"}} -->
```
**Never use `{"layout":{"type":"constrained"}}` without `"align":"full"` for homepage sections.** Without `alignfull`, sections render at 800px and look narrow.

**YOU DECIDE** which sections best serve the site. Do not follow a rigid template.

## Image Handling

ONLY add user-provided images/image URLs to the site build. Stock image URLs often fail to load and break the design. Look at user-supplied images carefully and include them if appropriate.

## Design Package Schema

```json
{
  "brief": { "siteName": "", "siteType": "", "primaryGoal": "", "audience": "", "tone": "", "brandKeywords": "" },
  "tokens": "← full design-tokens.json content",
  "layout": {
    "selectedOption": "",
    "hero": { "type": "cover | split | minimal | video", "headline": "", "subheadline": "", "cta": "", "minHeight": "80vh" },
    "sections": [{ "name": "", "type": "", "description": "" }],
    "header": { "style": "minimal | centered | split", "sticky": true, "transparent": false },
    "footer": { "style": "simple | multi-column | minimal", "columns": 3 }
  },
  "pages": [{ "title": "", "slug": "", "sourceFile": "", "isHomePage": true, "sections": [] }],
  "motion": { "pageLoad": "", "scrollTriggers": "", "hover": "" },
  "customCSS": { "global": "", "sections": "", "elements": "" },
  "wpNotes": []
}
```
