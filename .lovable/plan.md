## Add "Back to Chapters" link at the end of each chapter

### What
After each chapter's body text, add a small centered link that scrolls the reader back to the Table of Contents section (which sits just below the hero image).

### How
1. In `src/pages/Index.tsx`, give the existing TOC wrapper an `id` (e.g. `id="toc"`) and a matching `scroll-mt-20` so the anchor lands just below the sticky-ish top.
2. In `src/components/memoir/Chapter.tsx`, after the body `<div>`, add a centered anchor:
   - Text: "↑ Back to chapters"
   - `href="#toc"`
   - Styled with the existing gold accent: small uppercase tracked label (`text-[10px] tracking-[0.5em] uppercase text-gold/80 hover:text-gold`), bracketed by the same shimmer hairlines used on the chapter eyebrow for visual symmetry.
   - Wrap in a `<nav aria-label="Back to table of contents">` with top margin (`mt-12 sm:mt-16`).

### Notes
- Pure presentation change, no data or routing changes.
- Works for both WordPress-sourced and static chapter sources since the TOC anchor exists in both rendering paths (we'll attach the `id` to the outer transition wrapper so it's always present).