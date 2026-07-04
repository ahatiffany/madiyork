## Goal

Never show the bundled sample chapters. On first paint, render the Hero and section intro; the WordPress chapters appear when the fetch resolves. If the fetch fails or returns nothing, show a small empty state.

## Changes

**`src/hooks/useChapters.ts`**
- Initialize `chapters` state as `[]` (remove `fallbackChapters` import and usage).
- On successful fetch with usable posts → set chapters + `source: "wordpress"`.
- On error or empty result → leave chapters as `[]`, `source: "fallback"` (or rename to `"empty"`).
- Keep `loading` true until the fetch resolves.

**`src/pages/Index.tsx`**
- While `loading`, render Hero + section header, and show a small centered "Loading chapters…" line in the existing gold/mist styling in place of the TOC and chapter list.
- After loading:
  - If `chapters.length > 0` → render TOC + chapters as today.
  - If `chapters.length === 0` → show a brief empty state (e.g. "Chapters coming soon.") in the same styling. No sample chapters.

**`src/data/chapters.ts`**
- Delete the file (no longer referenced).

**`src/assets/chapter-1.jpg`, `chapter-2.jpg`, `chapter-3.jpg`**
- Delete the three sample images (only used by `chapters.ts`).

## Result

The reader never sees the placeholder Chapter One/Two/Three. They see the Hero, a brief loading line, then the real WordPress chapters — or a clean empty state if WordPress is unreachable.
