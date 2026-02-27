---
name: site-specification
description: Extract comprehensive site specifications from simple descriptions. Use when analyzing a user's theme request to determine site type, audience, tone, layout requirements, and typography.
---

# Site Specification Skill

Extract detailed site specifications from user descriptions to guide theme generation. If the user has provided images, image urls or other documents, analyze them for additional clues about the brand and design preferences - obviously things like an exising logo image can be very informative about the brand's aesthetic, tone, and values, and any written documents can contain explicit statements about the brand identity or design preferences.

## Site Spec Schema

A complete site specification uses this JSON structure:

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
    "Each layout requirement as a separate string",
    "Sections, features, and visual elements"
  ],
  "typography": {
    "primaryFont": "Main font for headings",
    "secondaryFont": "Font for body text",
    "usage": "How fonts should be applied",
    "fontImport": "Google Fonts import URL"
  }
}
```

All fields are optional - only include what can be reasonably inferred from the user's description.

## Inference Patterns by Site Type

### SaaS / Technology

**Infer:**
- Primary goal: Drive signups or demo requests
- Audience: Technical decision-makers, developers, or business users
- Tone: Professional, innovative, trustworthy
- Brand keywords: Modern, efficient, powerful, seamless

**Typical layout:**
- Hero with value proposition and CTA
- Feature grid or comparison
- Social proof (logos, testimonials)
- Pricing section
- FAQ
- Final CTA

**Typography tendency:**
- Clean geometric sans-serifs
- Strong hierarchy for scanning
- Consider: Satoshi, Plus Jakarta Sans, Outfit

### E-commerce / Retail

**Infer:**
- Primary goal: Drive purchases
- Audience: Consumers with specific interests
- Tone: Varies by brand (luxury vs. casual vs. value)
- Brand keywords: Depends on positioning

**Typical layout:**
- Hero with featured products or promotion
- Category navigation
- Featured products grid
- Trust signals (reviews, guarantees)
- Newsletter signup

**Typography tendency:**
- Match to brand positioning
- Luxury: refined serifs
- Modern: geometric sans
- Playful: display fonts

### Professional Services (Law, Finance, Consulting)

**Infer:**
- Primary goal: Generate inquiries or establish credibility
- Audience: Business decision-makers, individuals seeking expertise
- Tone: Professional, authoritative, trustworthy
- Brand keywords: Expertise, integrity, established, reliable

**Typical layout:**
- Hero with credentials or value statement
- Services/practice areas
- Team profiles
- Case studies or results
- Testimonials from clients
- Contact/consultation CTA

**Typography tendency:**
- Traditional serifs for headings (credibility)
- Clean sans-serif for body (readability)
- Consider: Cormorant Garamond, DM Serif Display, Source Sans Pro

### Restaurant / Food Service

**Infer:**
- Primary goal: Drive reservations or visits
- Audience: Local diners, food enthusiasts
- Tone: Warm, inviting, appetite-inducing
- Brand keywords: Fresh, handcrafted, cozy, authentic

**Typical layout:**
- Hero with appetizing food imagery
- Menu sections
- About/story
- Location and hours
- Reservation CTA
- Instagram or gallery

**Typography tendency:**
- Display fonts for personality
- Readable serif or sans for menus
- Consider: Playfair Display, Lora, Josefin Sans

### Creative / Portfolio

**Infer:**
- Primary goal: Showcase work and attract clients
- Audience: Potential clients, art directors, collaborators
- Tone: Creative, distinctive, personality-driven
- Brand keywords: Original, crafted, artistic, unique

**Typical layout:**
- Full-bleed portfolio hero
- Project gallery or case studies
- About/bio section
- Services offered
- Contact or inquiry form

**Typography tendency:**
- Distinctive display fonts
- Personal to the creator's style
- Consider: Clash Display, Fraunces, Syne

### Blog / Media

**Infer:**
- Primary goal: Engage readers and build audience
- Audience: Readers with specific interests
- Tone: Varies by niche (authoritative, casual, entertaining)
- Brand keywords: Informative, engaging, credible

**Typical layout:**
- Featured post hero
- Recent posts grid or list
- Category navigation
- About the author
- Newsletter signup
- Popular/trending section

**Typography tendency:**
- Readable body fonts (critical for long-form)
- Clean heading fonts
- Consider: Merriweather, Source Serif Pro, DM Sans

### Non-profit / Organization

**Infer:**
- Primary goal: Drive donations, volunteers, or awareness
- Audience: Supporters, potential donors, community members
- Tone: Compassionate, urgent, trustworthy
- Brand keywords: Impact, community, change, hope

**Typical layout:**
- Hero with mission statement and CTA
- Impact statistics
- Programs/initiatives
- Stories of impact
- Ways to help (donate, volunteer)
- Newsletter/updates signup

**Typography tendency:**
- Warm, approachable fonts
- Avoid cold corporate feel
- Consider: Lato, Open Sans, PT Serif

## Examples

### Example 1: Coffee Shop

**User prompt:** "Create a theme for my coffee shop called Bean & Brew"

```json
{
  "siteBrief": {
    "siteName": "Bean & Brew",
    "siteType": "coffee shop",
    "primaryGoal": "Attract local customers and showcase menu",
    "audience": "Coffee enthusiasts, local community members, remote workers looking for a cozy workspace",
    "tone": "warm, inviting, artisanal, community-focused",
    "brandKeywords": "cozy, handcrafted, aromatic, rustic wood, warm browns, cream accents"
  },
  "layoutNotes": [
    "Hero with inviting coffee shop interior or signature drink",
    "Menu section with categories (espresso, specialty drinks, pastries)",
    "About section with story and values",
    "Location and hours with embedded map",
    "Instagram feed integration",
    "Warm color palette (browns, creams, coffee tones)"
  ],
  "typography": {
    "primaryFont": "\"Playfair Display\", serif",
    "secondaryFont": "\"Lato\", sans-serif",
    "usage": "Playfair Display for elegant headings, Lato for readable body text",
    "fontImport": "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@300;400;700&display=swap"
  }
}
```

### Example 2: Law Firm

**User prompt:** "I need a theme for my law firm, Harrison & Associates. We specialize in corporate law and mergers. Very professional, trustworthy vibe."

```json
{
  "siteBrief": {
    "siteName": "Harrison & Associates",
    "siteType": "law firm",
    "primaryGoal": "Establish credibility and generate client inquiries for corporate law services",
    "audience": "Business executives, corporate decision-makers, companies seeking M&A legal counsel",
    "tone": "professional, authoritative, trustworthy, sophisticated",
    "brandKeywords": "corporate excellence, integrity, deep navy, gold accents, marble textures, clean lines"
  },
  "layoutNotes": [
    "Hero with professional office imagery or abstract corporate graphics",
    "Practice areas section highlighting corporate law and M&A expertise",
    "Attorney profiles with credentials and specializations",
    "Case studies or notable transactions (anonymized)",
    "Client testimonials from business leaders",
    "Contact section with consultation booking",
    "Color palette: navy blue, white, gold accents"
  ],
  "typography": {
    "primaryFont": "\"Cormorant Garamond\", serif",
    "secondaryFont": "\"Source Sans Pro\", sans-serif",
    "usage": "Cormorant Garamond for prestigious headings, Source Sans Pro for professional body text",
    "fontImport": "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Source+Sans+Pro:wght@300;400;600&display=swap"
  }
}
```

### Example 3: Esports Team

**User prompt:** "Make a theme for NeonPulse Gaming - an esports team. We compete in FPS games and want something edgy and fast."

```json
{
  "siteBrief": {
    "siteName": "NeonPulse Gaming",
    "siteType": "esports team",
    "primaryGoal": "Build fan community, attract sponsors, and recruit talented players",
    "audience": "Gaming enthusiasts, esports fans, potential sponsors, aspiring pro gamers",
    "tone": "edgy, high-energy, competitive, bold",
    "brandKeywords": "neon glow, cyberpunk, electric purple, hot pink, dark backgrounds, glitch effects, speed lines"
  },
  "layoutNotes": [
    "Hero with team action shots or dynamic gaming footage background",
    "Player roster with stats and social links",
    "Match schedule and live stream integration",
    "Tournament achievements and trophies",
    "Sponsor showcase",
    "Merchandise store link",
    "News/blog for team updates",
    "Dark theme with neon accents (purple, pink, cyan)"
  ],
  "typography": {
    "primaryFont": "\"Rajdhani\", sans-serif",
    "secondaryFont": "\"DM Sans\", sans-serif",
    "usage": "Rajdhani for aggressive tech headings, DM Sans for clean readable content",
    "fontImport": "https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=DM+Sans:wght@300;400;600&display=swap"
  }
}
```

### Example 4: Minimal Request

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
  ],
  "typography": {
    "primaryFont": "\"Outfit\", sans-serif",
    "secondaryFont": "\"Merriweather\", serif",
    "usage": "Outfit for clean headings, Merriweather for comfortable long-form reading",
    "fontImport": "https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=Merriweather:wght@300;400;700&display=swap"
  }
}
```

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
| Typography | [primaryFont] + [secondaryFont] |

Then ask: "Does this capture your vision? Let me know if you'd like to adjust anything before we proceed to design options."
