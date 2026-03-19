# Add Mockup Review & Approval Workflow to Phase 4

## Problem

Phase 4 of the design-site workflow generates full-page HTML mockups and writes them directly to the `approved/` folder. The automated QA loop catches visual defects, but the user never gets a chance to review, request changes, and explicitly approve the mockups before they become the specification for the WordPress build (Phase 5).

Phases 2 (Style Tiles) and 3 (Page Design) both have user-facing review steps — Phase 4 skipped this, creating a gap where the user's first real look at their site pages happens after the designs are already "locked in."

## Solution

Add a **draft → review → approved** pipeline to Phase 4, reusing the same review pattern already established in Phases 2 and 3.

### New flow

1. **Generate to `drafts/`** — The subagent writes page mockups to `design/drafts/` instead of `design/approved/`
2. **Internal QA** — Automated screenshot QA runs against drafts (unchanged behavior, just different folder)
3. **User review** — Gallery enters a new `"review"` phase, user sees drafts and provides feedback
4. **Iteration loop** — Fix-up agents apply user feedback, write versioned files (`homepage-v2.html`, etc.), no max iteration limit
5. **Promotion** — On user approval, final versions are copied to `approved/` with clean slugs, gallery transitions to `"approved"` phase

### What changed

| File | Change |
|------|--------|
| `commands/design-site.md` | Rewrote Phase 4 with drafts folder, review prompt, iteration loop, and promotion step. Updated directory scaffolding and phase regression rules. |
| `templates/design-gallery.php` | Added `"review"` phase (with `"Mockup Review"` label) to the gallery PHASES array between Page Design and Approved Mockups. |
| `references/gallery.md` | Documented `drafts/` directory, `"review"` phase, `artifacts.drafts` schema, and updated naming conventions. |

### Design decisions

- **Reuses existing patterns** — The review/iteration flow mirrors Phases 2 and 3 exactly (present in gallery → ask for feedback → iterate → lock)
- **No max iteration limit** — Unlike the automated QA (max 2 rounds), user-driven feedback loops until the user says "approved"
- **Clean promotion** — Approved files get clean slugs (no version suffix), so Phase 4.5 and Phase 5 are completely unaffected
- **Gallery phase count goes from 5 → 6** — The new `review` phase sits between "Page Design" (3) and "Approved Mockups" (5), giving the user a clear visual signal that designs are in review

## Test Plan

- [ ] Run design-site workflow through Phase 4 and confirm pages land in `drafts/`, not `approved/`
- [ ] Confirm gallery shows "Mockup Review" phase with draft artifacts in the sidebar
- [ ] Provide feedback and confirm iteration creates versioned files in `drafts/`
- [ ] Say "approved" and confirm files promote to `approved/` with clean slugs
- [ ] Confirm Phase 4.5 content extraction reads from `approved/` (unchanged)
- [ ] Confirm Phase 5 build uses `approved/` mockups as spec (unchanged)
- [ ] Verify gallery phase regression works correctly with the new phase
