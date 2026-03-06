---
description: Review a WordPress post and leave actionable feedback as block notes
argument-hint: "<post ID>"
---

# Review Content

> This command uses the `readability`, `search-visibility`, `content-guidelines`, and `media-accessibility` skills.

Review a WordPress post across four quality pillars and deliver feedback as block notes that appear directly in the editor.

## Trigger

User runs `/review-content` with a post ID, or asks to review/coach/check a WordPress post.

## Workflow

### Step 1: Fetch Content and Notes

Make these two calls in parallel using `mcp__wpcom-custom__wpcom-mcp-content-authoring`:

1. **`posts.get`** with `context=edit` — returns the post content (title, raw block markup, rendered HTML) for analysis.
2. **`block-notes.list`** with `post_id` — returns:
   - A **block map** showing each top-level block's index, type, noteId, and content preview
   - All existing **notes** as threaded trees

From these two responses you have everything needed: the content to review and the note state of every block.

- If notes already exist, read them. Do not duplicate feedback that's already been given.
- If a previous note raised an issue that hasn't been addressed, you may reply to that thread — but don't repeat the same point.

### Step 2: Analyze the Content

Work through each pillar systematically. Identify the **highest-impact issues only** — do not flag everything. A useful review has 3–8 notes total, not 20.

#### Pillar 1: Readability
Apply the `readability` skill. Focus on:
- Sentences over 25 words
- Paragraphs over 4 sentences
- Passive voice (only the most impactful instances)
- Jargon with simpler alternatives

#### Pillar 2: Search Visibility
Apply the `search-visibility` skill. Focus on:
- Title/H1 issues (missing, too long, generic)
- Heading hierarchy problems (skipped levels)
- Missing internal links
- Slug quality

#### Pillar 3: Content Guidelines
Apply the `content-guidelines` skill. Focus on:
- Tone inconsistencies (the biggest shifts only)
- Unsubstantiated claims
- Filler language (only the most egregious)

#### Pillar 4: Media & Accessibility
Apply the `media-accessibility` skill. Focus on:
- Missing alt text on images (highest priority)
- Poor link text ("click here")
- Missing headings in long content

### Step 3: Ask for Confirmation

Before leaving any notes, tell the user:
- How many notes you plan to leave
- A brief summary of the issues found across each pillar

Wait for the user to confirm before proceeding. Their confirmation response will be used as the `user_confirmed` value for each note operation.

### Step 4: Leave Notes

After the user confirms, leave the notes. For each issue:

1. **Determine which block** the feedback applies to using the block map from Step 1.

2. **Choose the right operation** on `mcp__wpcom-custom__wpcom-mcp-content-authoring`:
   - Block has a `noteId` → use `block-notes.reply` with `parent_id` set to that noteId
   - Block has no `noteId` → use `block-notes.create` with `block_index`

3. **Include `user_confirmed`** in `params` with the user's confirmation response. This is required by the safety policy for all create/reply operations.

4. **Write the note.** Follow these rules strictly:
   - **50 words or fewer.** The block notes UI has limited space.
   - **Do NOT mention block index, block type, or position.** The UI highlights the block — the reader knows which block it's on.
   - **Be direct and actionable.** Say what to change and why. Don't describe what you observed.
   - **Quote the specific text** when suggesting a rewrite.
   - **One note per block.** If a block has multiple issues, combine the most important one into a single note.

### Step 5: Summarize

After leaving all notes, give the user a brief summary in chat (not as a block note):
- How many notes you left
- Which pillars had the most issues
- The single most impactful change they could make

## Constraints

- **Do NOT edit the post content.** You are a reviewer, not an editor. Leave suggestions as notes.
- **3–8 notes maximum** for a typical post. More than that overwhelms the author.
- **Skip blocks that are fine.** Not every block needs a note. No news is good news.
- **Don't be sycophantic.** Don't leave notes that say "Great paragraph!" — only leave notes that suggest improvements.
- **Author name:** Use the default (authenticated user). Only pass `author_name` if the user requests a custom name.
