## Issue

In `src/components/memoir/Chapter.tsx`, verse blocks render with `font-display` (Cormorant Garamond, a serif). Paragraphs use the default Inter (sans). At the same nominal font size (`text-base md:text-lg` inherited from the wrapper), Cormorant has a smaller x-height than Inter and visually reads noticeably smaller — especially visible in Chapter 14's poetry blocks.

## Change

In `src/components/memoir/Chapter.tsx`, update the verse `<div>` to explicitly bump its type size so it optically matches surrounding paragraphs:

- Add `text-lg md:text-xl` to the verse container (Cormorant at roughly one step larger matches Inter's apparent size at `text-base md:text-lg`).
- Keep `font-display italic text-center text-parchment/90 leading-relaxed` and the spacing classes as-is.

No other changes — paragraph styling, edge function, and content remain untouched.

## Out of scope

- Switching the verse font away from Cormorant
- Any change to the WordPress edge function or chapter data
