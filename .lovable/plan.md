## Problem

Italic text authored in WordPress (`<em>` / `<i>`) renders as plain text on the site. The edge function `supabase/functions/wordpress-chapters/index.ts` runs every paragraph and verse line through `stripHtml`, which removes ALL tags — so `<em>`, `<i>`, `<strong>`, `<b>` are discarded before the content ever reaches the frontend. The frontend then renders body text as plain strings inside `<p>{block.text}</p>`, which wouldn't render HTML anyway.

## Fix

Preserve a small allow-list of safe inline formatting tags end-to-end.

### 1. Edge function — `supabase/functions/wordpress-chapters/index.ts`

- Add a new helper `stripHtmlKeepInline(html)` that behaves like `stripHtml` but preserves `<em>`, `<i>`, `<strong>`, `<b>` (and their closing tags). All other tags, scripts, styles, and entities are handled exactly as today.
- Use `stripHtmlKeepInline` for:
  - Paragraph text inside `splitParagraphs`
  - Verse lines inside `parseVerseBlock`
- Keep the existing `stripHtml` for titles, pull-quote text, citations, and image alt text (those should stay plain).

### 2. Frontend — `src/components/memoir/Chapter.tsx`

- Render paragraph and verse content with `dangerouslySetInnerHTML` since the body now contains a tiny allow-list of inline tags:
  - Paragraph: `<p ... dangerouslySetInnerHTML={{ __html: block.text }} />`
  - Verse line: `<span ... dangerouslySetInnerHTML={{ __html: line || "&nbsp;" }} />`
- Safety: the edge function is the only writer of this content and only lets `<em>/<i>/<strong>/<b>` through — no attributes, no scripts, no links — so this is a bounded allow-list, not arbitrary HTML.

### 3. No other changes

- Pull-quote, citation, title, TOC, and About section are unaffected.
- No CSS changes: Tailwind's default styles already italicize `<em>`/`<i>` and bold `<strong>`/`<b>`.

## Verification

- Reload the preview; any WordPress chapter paragraph containing italicized words (e.g. book titles, foreign terms) should now render italic.
- Non-italic paragraphs should look identical to today.
