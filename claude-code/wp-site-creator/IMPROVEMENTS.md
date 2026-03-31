# Improvement Notes

Observations from real usage of the design-site workflow.

## Phase 4: Dual Preview Mode

After generating approved mockups, serve **both** preview options:

1. **Gallery** (`?design-gallery`) — good during generation because it auto-polls and shows new assets as they land
2. **Static HTML dev server** (e.g., `python3 -m http.server 8888` from `design/approved/`) — far faster for actual review, no PHP/iframe overhead

The gallery loads pages slowly due to large HTML files (30-60KB) routed through WordPress PHP into iframes. Direct HTTP serving is instant. Both should be offered at the end of Phase 4.

## Logo / Asset Path Resolution

Mockups reference logos and images with absolute paths (e.g., `/logo-black.png`). In the gallery iframe, these resolve against the WordPress site root — not the `design/approved/` directory.

**Fix:** Copy assets (logos, images) to the site root directory during Phase 4 so they resolve correctly in both the gallery and direct HTML preview.

## Gallery Mu-Plugin Hook

The mu-plugin must hook on `init`, not `template_redirect`. The latter fires after WordPress canonical redirect, which encodes `/` to `%2F` in query params — causing 301 loops on the `design-asset` endpoint.

This fix has already been applied to the template but should be verified in `templates/design-gallery.php`.

## Screenshot Tool: WordPress Proxy Timeout

`screenshot.mjs` uses `networkidle0` (now `networkidle2`) for page load detection. Both strategies time out when screenshotting pages served through WordPress Studio's proxy (`?design-asset=...`). The WordPress PHP layer is too slow for Puppeteer's 30s timeout on large HTML files.

**Workaround:** Use a local dev server (`python3 -m http.server 8888` from `design/approved/`) for screenshots instead of the WordPress proxy. The dev server completes in under 5 seconds per page.

**Suggested fix:** The screenshot QA workflow should prefer the dev server URL when available, falling back to the WordPress proxy. Alternatively, use `domcontentloaded` wait strategy for WordPress-proxied routes.

## Screenshot Tool: `puppeteer-core` Installation

`screenshot.mjs` requires `puppeteer-core` but the scripts directory has no `package.json` or install instructions beyond comments. Global npm installs don't work with ESM imports — the package must be installed locally in the scripts directory.

**Fix:** Add a `package.json` to `scripts/` with `puppeteer-core` as a dependency, or document the local install requirement more prominently.

## Phase 5: Build Agent Content Fidelity

The build agent rewrites page content instead of extracting it verbatim from the approved mockups. Given 6 large HTML files (30-60KB each) plus reference docs, the agent generates "plausible" content rather than faithfully reproducing what's in the mockups.

**Fix (implemented):** Add an intermediate step between Phase 4 and Phase 5: extract all content from approved mockups into structured JSON files (`design/content/{slug}.json`) using parallel agents. Each JSON captures sections, headings, body text, CTAs, image URLs, form fields, etc. — all character-for-character. The build agent then uses these JSON files as the source of truth rather than reading the raw HTML.

This two-step approach (extract then build) is more reliable than asking a single agent to read HTML and produce WP markup simultaneously.

## Phase 5: Old Page Slug Conflicts on Redesigns

When building on a redesign site, old pages (from Avada, etc.) still hold the correct slugs (`/portfolio`, `/blog`). New pages created via WP-CLI get suffixed slugs (`portfolio-2`, `blog-2`). Visitors then see old Avada content with broken shortcodes.

**Fix:** Before creating new pages, draft or delete all existing pages with conflicting slugs. The build workflow should run `wp post list --post_type=page --post_status=publish` first and handle slug conflicts.

## Phase 5: WP-CLI Content Import

`studio wp post create --post_content="$(cat file.html)"` breaks on special characters and shell escaping. Stdin redirect (`< file.html`) also doesn't work with Studio's CLI wrapper.

**Working approach:** Create the page first (empty), then update it with content:
```
studio wp post create --post_type=page --post_title="Title" --post_name="slug" --post_status=publish
CONTENT=$(cat pages/slug.html) && studio wp post update PAGE_ID --post_content="$CONTENT"
```

## Phase 5: Deactivate Old Theme Plugins

On redesign sites, old theme plugins (Fusion Builder, Fusion Core, RevSlider for Avada sites) inject competing CSS/JS that overrides the new theme. The build workflow should deactivate known page-builder plugins after theme activation.

## Screenshot Tool: Scroll-Reveal Animation Visibility

Pages using IntersectionObserver-based scroll-reveal animations (elements start at `opacity: 0`) appear blank in Puppeteer screenshots because the tool doesn't scroll through the page.

**Fix (implemented):** Added a scroll-through step to `screenshot.mjs` that scrolls the full page height in steps, triggering all IntersectionObservers, waits for animations to complete (1.5s), then scrolls back to top before capturing.

## Phase 5: Scroll Animations on Colored Background Sections

Sections with `animate-on-scroll` that also have colored backgrounds (`has-background`) fade in from white/transparent because the entire section wrapper starts at `opacity: 0`. This is visually jarring on dark, olive, or teal sections — the background color appears to fade in from nothing.

**Fix:** The CSS should not animate `opacity` on the section wrapper itself when it has a background color. Instead, keep the section at `opacity: 1; transform: none` and animate the children elements. The selectors:

```css
.wp-block-group.alignfull.animate-on-scroll.has-background,
.wp-block-cover.alignfull.animate-on-scroll {
  opacity: 1;
  transform: none;
}
/* Then animate direct children of the inner container */
```

The IntersectionObserver still adds `is-visible` to the section — the CSS cascades to children via `.is-visible > container > *`.

**Screenshot QA implication:** Even with scroll-through implemented, if the screenshot tool captures before `is-visible` propagates to children, sections will appear to have their backgrounds but blank content. The tool should wait for all `.animate-on-scroll.is-visible` elements to have visible children before capturing.

## Phase 5: WordPress theme.json Global Link Color Override

When `theme.json` sets a global link color (e.g., `"link": { "color": { "text": "#1BADA6" } }`), it applies via WordPress specificity that overrides custom class-based link colors in the footer and other dark sections. Footer nav links, social links, etc. appear teal instead of the intended muted white.

**Fix:** Footer link styles need `!important` and a scoped anchor reset:

```css
.site-footer a { color: inherit; text-decoration: none; }
.footer-nav-link, .footer-nav-link a { color: rgba(255,255,255,0.5) !important; }
```

This is a common issue when block themes use global link color — any section with custom link styling needs explicit overrides.

## Phase 5: WP Block Markup vs Raw HTML Trade-offs

Several UI patterns from approved HTML mockups are difficult to faithfully reproduce using WordPress block markup alone:

- **Shop/resource card grids** with overlay badges, aspect ratios, and pseudo-element gradients
- **Button groups** needing specific `gap`, `flex-wrap`, and mixed button styles (primary + ghost)
- **Portfolio headers** with flex-row title/button alignment

**Recommendation:** Use `<!-- wp:html -->` blocks for these patterns rather than fighting WP block constraints. The `wp:html` block preserves the exact HTML from the mockup, ensuring visual fidelity. Reserve standard WP blocks for content that benefits from editor-level editing (text, images, headings).
