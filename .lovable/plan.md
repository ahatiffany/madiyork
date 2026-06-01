## Goal
Make the author photo in the About section align visually with the YouTube videos in the Visual Inspirations grid above it, and tidy the section's padding so the two blocks share the same horizontal rhythm.

## Changes (single file: `src/components/memoir/About.tsx`)

1. **Match container width to Playlist**
   - Change `max-w-6xl` → `max-w-5xl` on the inner wrapper so About uses the same content width as the Playlist section (which is `max-w-5xl`).

2. **Match horizontal padding to Playlist**
   - Keep `px-5 sm:px-6 md:px-14` consistent (already matches Playlist) — no change needed, just verified.

3. **Align logo column with the left video tile**
   - The video grid is `grid-cols-1 sm:grid-cols-2 gap-6`, so each tile is ~50% width minus half the gap.
   - Update About's grid from `grid-cols-[auto_1fr]` to `md:grid-cols-2 gap-6` so the logo image column occupies the same left half as the top-left video tile.
   - Remove the `max-w-[220px] sm:max-w-[280px] md:max-w-[340px]` cap on the logo wrapper at `md` and up; instead let the logo fill its column with an `aspect-video`-style framing (or keep `w-full` with `max-w-full`) so its right edge lines up with the right edge of the left video tile. Keep the smaller caps for mobile.
   - Center the logo image inside its column (`mx-auto`) and keep the existing tilt behavior untouched.

4. **Vertical alignment**
   - Keep `items-center` so the text column stays vertically centered against the logo.

## Out of scope
- No changes to Playlist, Footer, or other sections.
- No copy or color changes.
- No changes to `TiltImage` component internals.

## Technical detail
File: `src/components/memoir/About.tsx`
- `max-w-6xl` → `max-w-5xl`
- `grid md:grid-cols-[auto_1fr] gap-10 md:gap-10` → `grid md:grid-cols-2 gap-6 sm:gap-6`
- Logo wrapper: drop `md:max-w-[340px]`, keep mobile caps, ensure `w-full mx-auto` so the image's right edge matches the left video tile's right edge.
