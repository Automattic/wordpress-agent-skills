# Add Mockup Review & Approval Workflow to Phase 4

## Problem

Phase 4 of the design-site workflow generates full-page HTML mockups and writes them directly to the `approved/` folder. The automated QA loop catches visual defects, but the user never gets a chance to review, request changes, and explicitly approve the mockups before they become the specification for the WordPress build (Phase 5).

Phases 2 (Style Tiles) and 3 (Page Design) both have user-facing review steps — Phase 4 skipped this, creating a gap where the user's first real look at their site pages happens after the designs are already "locked in."

## Solution

Add a **draft → review → approved** pipeline to Phase 4, reusing the same review pattern already established in Phases 2 and 3.

### New flow

1. **Generate to `drafts/`** — The subagent writes page mockups to `design/drafts/` instead of `design/approved/`
2. **Internal QA** — Automated screenshot QA runs against drafts (unchanged behavior, just different folder)
3. **User review** — Gallery enters the `"drafts"` phase, user sees drafts and provides feedback
4. **Iteration loop** — User chooses to edit current version or create a new version; fix-up agents apply feedback accordingly
5. **Promotion** — On user approval, final versions are copied to `approved/` with clean slugs, gallery transitions to `"approved"` phase

### What changed

| File | Change |
|------|--------|
| `commands/design-site.md` | Rewrote Phase 4 with drafts folder, review prompt, iteration loop, and promotion step. Updated directory scaffolding and phase regression rules. Added tokens schema to Phase 2 locking step. Added screenshot cleanup prompts after Phase 4 approval and Phase 5 fidelity check. Added edit-vs-new-version user prompt to iteration loop. Reformatted approval promotion as 7-step checklist. Added WordPress installation verification to Phase 0.5. |
| `templates/design-gallery.php` | Changed phase 4 PHASES key to `"drafts"` (matching the `artifacts.drafts` key in `gallery.json`). Added exception so `approved` phase always shows artifacts regardless of current phase status. Fixed version label bug to read `artifact.version` field instead of array index. Added draft version grouping by base slug with collapsible version history. |
| `references/gallery.md` | Documented `drafts/` directory, `artifacts.drafts` schema, updated naming conventions, added `verification/` subfolder structure. |
| `scripts/screenshot-revealed.mjs` | **New** — Puppeteer screenshot variant that waits for CSS reveal animations to complete before capturing, preventing blank/mid-transition screenshots in mockup QA. |
| `references/design-system-phase3.md` | **New** — Image placeholder zone styling rules for Phase 3 page designs. |
| `IMPROVEMENTS.md` | Added summaries of completed improvements. |

### Design decisions

- **Reuses existing patterns** — The review/iteration flow mirrors Phases 2 and 3 exactly (present in gallery → ask for feedback → iterate → lock)
- **No max iteration limit** — Unlike the automated QA (max 2 rounds), user-driven feedback loops until the user says "approved"
- **Edit vs new version** — During iteration, the user is asked whether to update the current version in place or create a new versioned file, keeping version history meaningful without clutter
- **Clean promotion** — Approved files get clean slugs (no version suffix), so Phase 4.5 and Phase 5 are completely unaffected
- **Gallery phase count goes from 5 → 6** — The `drafts` phase sits between "Page Design" (3) and "Approved Mockups" (5), giving the user a clear visual signal that designs are in review
- **Approved artifacts always visible** — The `approved` phase shows its artifacts in the sidebar even during the `drafts` phase, supporting incremental approval
- **Phase-organized screenshots** — Verification screenshots go to subfolders (`style-exploration/`, `page-design/`, `mockup-review/`, `approved/`, `wordpress-build/`) instead of a flat directory, with cleanup prompts at natural workflow boundaries

### Bug fixes included

- **Gallery key mismatch** — The gallery PHASES key was `"review"` but `gallery.json` stored artifacts under `"drafts"`, so draft mockups never appeared in the sidebar. Aligned all references to use `"drafts"`.
- **Tokens sidebar empty** — The Phase 2 locking step didn't specify the `tokens` schema the gallery expects, so the sidebar color bar, font names, and density/motion pills rendered blank. Added the exact schema inline.
- **Gallery version labels** — Version labels used array index instead of the artifact's `version` field, causing labels to display in reverse when new versions were prepended. Fixed to read `artifact.version` with fallback.

### Session 7 improvements

- **Edit vs new version prompt** — Iteration loop now asks "update current version (vN) or save as new version (vN+1)?" so users can make minor edits without creating unnecessary version history.
- **Approval checklist** — Promotion from drafts to approved reformatted as a 7-step checklist to prevent steps from being missed (gallery cleanup was skipped in session 7).
- **WordPress installation check** — Phase 0.5 now verifies WordPress is installed after confirming Studio is running, with CLI and HTTP POST fallbacks for the known Studio CLI silent-failure issue.

### Tablet-width screenshots

Added a tablet breakpoint (768px) to all QA phases alongside the existing desktop (1440px) and mobile (375px) captures. This catches layout issues between the two extremes — navigation collapse points, grid column reflows, and touch-target sizing. Screenshots are saved with a `-tablet` suffix (e.g., `layout1-v1-tablet.png`).

### PR base

This branch builds on `add-screenshot-workflow`. Target that branch (or trunk after it merges) to avoid pulling in unrelated earlier changes.

## Test Plan

- [ ] Run design-site workflow through Phase 4 and confirm pages land in `drafts/`, not `approved/`
- [ ] Confirm gallery shows "Mockup Review" phase with draft artifacts in the sidebar
- [ ] Provide feedback, choose "update current version", and confirm file is edited in place
- [ ] Provide feedback, choose "new version", and confirm versioned copy is created in `drafts/`
- [ ] Say "approved" and confirm all 7 checklist steps complete (copy, add approved, remove drafts, set phase, screenshot, restart server, confirm)
- [ ] Confirm approved artifacts appear in sidebar even while phase is `drafts`
- [ ] Confirm gallery sidebar tokens card shows color bar, fonts, and pills after Phase 2 lock
- [ ] Confirm gallery version labels match `artifact.version` field, not array order
- [ ] Confirm Phase 4.5 content extraction reads from `approved/` (unchanged)
- [ ] Confirm Phase 5 build uses `approved/` mockups as spec (unchanged)
- [ ] Verify screenshots go to phase-specific subfolders under `verification/`
- [ ] Verify cleanup prompt appears after Phase 4 approval and Phase 5 completion
- [ ] Verify WordPress installation check runs in Phase 0.5 and handles uninstalled state
- [ ] Verify tablet-width (768px) screenshots are captured in all QA phases alongside desktop and mobile
- [ ] Verify `screenshot-revealed.mjs` waits for animations before capturing
- [ ] Verify gallery phase regression works correctly with the new phase
