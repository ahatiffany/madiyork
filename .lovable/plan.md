## Goal
Make the pull-quote (with citation) and default excerpt block visually balanced so the quote line(s) and the citation line have similar visual length — no single line dominates.

## Where it applies
Any place an excerpt/pullquote renders. In this project that's currently the `<figure>` block inside `src/components/memoir/Chapter.tsx` (used for both the WordPress default excerpt and the pullquote-with-citation block, since both flow through `chapter.pullQuote` + optional `chapter.pullQuoteCitation`).

## Changes

### `src/components/memoir/Chapter.tsx` — pull-quote figure
1. Constrain the quote width tighter so long quotes wrap into ~2 balanced lines instead of one wide line:
   - Replace `max-w-3xl` on the `<figure>` with `max-w-xl sm:max-w-2xl`.
2. Apply CSS line-balancing to both the quote and citation:
   - Add `text-balance` (Tailwind utility for `text-wrap: balance`) to the `<blockquote>` and `<figcaption>`.
   - Add `mx-auto` + `max-w-[28ch] sm:max-w-[36ch] md:max-w-[44ch]` on the `<blockquote>` so wrapping is driven by character count, producing visually similar line widths regardless of quote length.
3. Keep the citation visually lighter but make sure its line sits centered under the quote with comparable visual length:
   - Add `max-w-[24ch] mx-auto text-balance` to the `<figcaption>`.
4. Leave font sizes/colors as-is (per "balance line lengths" choice — not equalizing weight/size).

### Result
- Short quotes still center cleanly.
- Long quotes break into ~2 balanced lines (`text-wrap: balance`) with a constrained measure so no line stretches the full container.
- Citation wraps within a narrow measure and stays centered, matching the quote's visual rhythm.

## Out of scope
- No edge-function/business-logic changes — `wordpress-chapters` already returns `pullQuote` + `pullQuoteCitation` correctly.
- No font-size or color changes (user chose "balance line lengths" only).
