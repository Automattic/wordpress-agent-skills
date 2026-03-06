---
name: media-accessibility
description: Review images, media, and visual elements for accessibility compliance and quality. Use when checking alt text, captions, and media best practices.
---

# Media & Accessibility Skill

Ensure all media elements are accessible, properly described, and enhance the content rather than just decorating it.

## What to Check

### Alt Text
- Every image block MUST have alt text. Flag any `core/image` block with empty or missing alt.
- Alt text should describe what the image *shows*, not what it *is*.
  - Bad: "image1.jpg", "photo", "screenshot"
  - Bad: "Image of a person" (too generic)
  - Good: "A hiker standing at the edge of a cliff overlooking a valley at sunrise"
- Decorative images (spacers, dividers, background textures) should have empty alt (`alt=""`), not missing alt. But in practice, most images in post content are not decorative.
- Flag alt text that starts with "Image of..." or "Photo of..." — screen readers already announce it as an image.
- Flag excessively long alt text (over 125 characters). Keep it concise.

### Image Quality Signals
- Flag images with generic file names: `IMG_4532.jpg`, `screenshot-2024.png`, `image.png`.
- Suggest descriptive file names that match the content.
- Flag if a post has no images at all — for most content types, at least one image improves engagement.

### Captions
- Captions are optional but valuable. They're among the most-read text on a page.
- Don't flag missing captions as an error — suggest them as an enhancement for key images.
- Flag captions that just repeat the alt text. They should add context the alt text doesn't provide.

### Heading Accessibility
- Headings should not be empty.
- Heading blocks used purely for visual styling (making text big/bold) without semantic meaning is an accessibility issue.
- Content should be readable in heading order — if you read just the headings top to bottom, they should outline the post.

### Link Accessibility
- Flag links with text like "click here", "read more", "this link", "here". Screen readers often navigate by link text alone.
- Good link text describes the destination: "read our pricing guide" not "click here."
- Flag links that open in new tabs without indicating it (though this is hard to detect from markup alone — note as a general guideline).

### Color and Contrast
- Cannot be checked from markup alone, but flag cases where the author relies on color to convey meaning (e.g., "the items in red are required").
- Suggest adding text labels alongside color indicators.

### Content Structure
- Flag very long posts with no headings — screen reader users rely on headings to navigate.
- Flag content that uses bold text as a pseudo-heading instead of proper heading blocks.

## How to Give Feedback

- Frame accessibility feedback as helping *all* readers, not just compliance.
- Be specific: "Add alt text describing what this chart shows" not "missing alt text."
- Keep notes under 50 words.
- Prioritize: missing alt text > heading issues > link text > everything else.

## Examples of Good Notes

> "Missing alt text. Describe what this image shows — e.g., 'Bar chart comparing monthly sales for Q1 2024 across three product lines.'"

> "Link text 'click here' doesn't describe the destination. Try: 'view our return policy' so it makes sense out of context."

> "No headings in 800+ words of content. Add H2s to break this into scannable sections — readers and screen readers both benefit."
