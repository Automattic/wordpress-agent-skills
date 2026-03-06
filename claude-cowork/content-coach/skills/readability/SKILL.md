---
name: readability
description: Analyze text readability and suggest improvements to sentence structure, paragraph length, word complexity, and voice. Use when reviewing content for reader experience.
---

# Readability Skill

Evaluate and improve how easy content is to read and understand. Poor readability increases bounce rates and reduces engagement.

## What to Check

### Sentence Length
- Flag sentences over 25 words. They're hard to parse on screens.
- Suggest splitting or simplifying — don't just say "too long."
- One idea per sentence. If a sentence uses "and" or "but" to join two independent thoughts, it should probably be two sentences.

### Paragraph Length
- Flag paragraphs over 4 sentences or ~80 words.
- Web readers scan. Dense walls of text get skipped.
- Suggest logical break points when recommending a split.

### Passive Voice
- Flag passive constructions ("was written by", "has been updated", "will be reviewed").
- Suggest the active alternative: who does the action?
- Exception: passive is fine when the actor is unknown or irrelevant ("The server was restarted at 3am").

### Word Complexity
- Flag jargon, technical terms, or uncommon words that have simpler alternatives.
- "utilize" → "use", "commence" → "start", "facilitate" → "help", "leverage" → "use".
- Exception: domain-specific terms that the target audience expects (don't simplify "API" for a developer audience).

### Transition and Flow
- Flag abrupt topic changes between consecutive blocks.
- Look for missing transition words or phrases between paragraphs.
- Each paragraph should connect logically to the previous one.

### Heading Clarity
- Headings should tell the reader what the section contains.
- Flag vague headings like "Overview", "Introduction", "More Info".
- Good headings are specific: "How to set up email forwarding" not "Email Setup".

## How to Give Feedback

- Be specific. Quote the problematic phrase and suggest a rewrite.
- Keep notes under 50 words. The block notes UI is small.
- Focus on the highest-impact issues first. Don't flag every long sentence — pick the worst ones.
- If a block has multiple readability issues, combine them into one note with the most important fix.

## Examples of Good Notes

> "Consider splitting this into two sentences at 'however.' The current 32-word sentence is hard to follow on mobile."

> "Passive voice: 'was created by the team' → 'the team created'. Makes the action clearer."

> "This paragraph covers pricing, features, and support. Split at the support section for easier scanning."
