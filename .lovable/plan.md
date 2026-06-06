## Goal

WordPress "Verse" blocks (`<pre class="wp-block-verse">`), used in Chapter 14, are currently flattened to plain prose by the edge function — line breaks collapsed, no styling. Render them as centered, italic stanzas while leaving regular paragraphs unchanged.

## Changes

### 1. `supabase/functions/wordpress-chapters/index.ts`
- Replace the current `splitParagraphs` logic with a structured walker that, before stripping HTML, extracts `<pre class="...wp-block-verse...">…</pre>` blocks (also accept the `<verse>`/`<blockquote class="wp-block-verse">` variants) and represents each body item as either:
  - `{ type: "paragraph", text: string }` — existing behavior
  - `{ type: "verse", lines: string[] }` — split on `<br>` / newlines, each line HTML-stripped and trimmed, blanks preserved as stanza breaks
- Update the `Chapter` interface's `body` field to `Array<BodyBlock>` and return the structured array.

### 2. `src/components/memoir/Chapter.tsx` + `src/data/chapters.ts`
- Update `ChapterData.body` to the same `BodyBlock[]` union (keep backward-compatible by treating a `string` entry as a paragraph block when normalizing in the component).
- In the body render loop:
  - `paragraph` → existing `<p>` styling.
  - `verse` → `<div class="my-6 text-center italic font-display text-parchment/90 leading-relaxed">` with each line as its own `<span class="block">`; blank lines render as an empty spacer line for stanza breaks.
- Keep `text-justify` only for paragraph blocks.

### 3. `src/data/chapters.ts`
- Adjust the fallback chapter typing so existing string bodies still satisfy the new union (string entries treated as paragraphs). No content change to fallback data.

## Out of scope
- No styling/system token changes beyond using existing `font-display`, `text-parchment`, italics, and centering utilities.
- No other WordPress block types.
