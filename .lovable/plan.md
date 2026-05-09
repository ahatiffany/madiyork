## Changes

### 1. Reduce space between chapters
In `src/components/memoir/Chapter.tsx`, reduce the `<section>` vertical padding:
- From: `py-20 sm:py-28 md:py-40`
- To: `py-10 sm:py-14 md:py-20` (roughly half)

### 2. Replace "Back to chapters" link with a Playlist-style button
Currently it's a centered anchor with shimmer rules and "↑ Back to chapters" text.

New treatment, right-aligned at the end of each chapter:
- Wrapper: `mt-10 sm:mt-12 flex justify-end` (right-aligned to body text width — placed inside the existing centered container but with a `max-w-prose w-full` wrapper so it aligns to the right edge of the body text)
- Button: an `<a href="#toc">` styled to match the floating playlist tab:
  - `inline-flex items-center gap-2 px-4 py-3 bg-card/90 backdrop-blur-md border border-gold/30 rounded-md shadow-cinematic`
  - Label: `text-xs tracking-[0.3em] uppercase text-gold`
  - Icon: `ArrowLeft` from `lucide-react` at `h-3.5 w-3.5`
  - Text: `Back`
  - Hover: subtle `hover:bg-card transition-colors`

### Files
- `src/components/memoir/Chapter.tsx` — only file touched.

### Notes
- Pure presentation change; no logic, data, or routing changes.
- "Right aligned to the text" interpreted as right-aligned to the body paragraph column (`max-w-prose`), not the full page width.
