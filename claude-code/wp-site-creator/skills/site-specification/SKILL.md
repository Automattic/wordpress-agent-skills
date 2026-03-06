---
name: site-specification
description: Extract comprehensive site specifications from simple descriptions. Use when analyzing a user's theme request to determine site type, audience, tone, layout requirements, and typography.
---

# Site Specification Skill

Extract detailed site specifications from user descriptions to guide theme generation. If the user has provided images, image urls or other documents, analyze them for additional clues about the brand and design preferences — logos reveal aesthetic and tone, written documents may contain explicit brand identity or design preferences.

## Site Spec Schema

```json
{
  "siteBrief": {
    "siteName": "Name of the site/business",
    "siteType": "Type of site (e.g., e-commerce, portfolio, blog, SaaS, restaurant)",
    "primaryGoal": "Main purpose or conversion goal of the site",
    "audience": "Target audience description",
    "tone": "Voice and tone for the content",
    "brandKeywords": "Keywords describing the brand aesthetic and values"
  },
  "layoutNotes": [
    "Each layout requirement as a separate string"
  ],
  "typography": {
    "primaryFont": "Main font for headings",
    "secondaryFont": "Font for body text",
    "usage": "How fonts should be applied",
    "fontImport": "Google Fonts import URL"
  }
}
```

All fields are optional — only include what can be reasonably inferred from the user's description.

## Inference Guidance

Infer site type, goal, audience, tone, layout needs, and typography from the description. Use your knowledge of industry conventions. Do not constrain font choices — describe the typographic direction in vibe terms and let the design phase select specific fonts.

## Example

**User prompt:** "Build a custom theme for my blog"

```json
{
  "siteBrief": {
    "siteType": "personal blog",
    "primaryGoal": "Share content and build readership",
    "tone": "personal, approachable"
  },
  "layoutNotes": [
    "Hero with featured post or welcome message",
    "Recent posts grid or list",
    "About the author section",
    "Categories/tags navigation",
    "Newsletter signup"
  ]
}
```

Note: only fields that can be inferred are included. Typography is omitted when the description provides no aesthetic cues — let the design phase handle font selection.

## Presentation Format

Present the extracted spec to the user for confirmation. Use the table format below unless the calling command specifies a different presentation format:

| Field | Value |
|-------|-------|
| Site Name | [name] |
| Site Type | [type] |
| Primary Goal | [goal] |
| Target Audience | [audience] |
| Tone | [tone] |
| Brand Keywords | [keywords] |
| Key Sections | [comma-separated list from layoutNotes] |

Then ask: "Does this capture your vision? Let me know if you'd like to adjust anything before we proceed to design options."
