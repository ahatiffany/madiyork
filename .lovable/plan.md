# Uniform Chapter Featured Images

## Goal
Every chapter's featured image renders at the exact same square size, stays centered within that frame regardless of source aspect ratio, and remains sharp on high-DPI screens.

## Current behavior
In `src/components/memoir/Chapter.tsx`, the featured image sits in a responsive square (`max-w-xs sm:max-w-sm md:max-w-md`, `aspect-square`) with `object-cover`. That already gives a uniform frame, but:
- `object-cover` crops off-center subjects; tall/wide originals lose content instead of staying centered.
- No `sizes` hint or width cap on the underlying `<img>`, so browsers may fetch under- or over-sized bitmaps → occasional softness.
- WordPress often supplies multiple resolutions we're not using.

## Changes

### 1. `src/components/memoir/Chapter.tsx` — frame + fit
- Keep the square frame but lock it to a single max width across breakpoints so every chapter matches pixel-for-pixel at a given viewport:
  - `w-full max-w-sm md:max-w-md` (drop the `xs` step so small phones and larger phones don't diverge in ratio to surrounding text).
- Change the image fit from `object-cover` to `object-contain` and center it:
  - `object-contain object-center`
  - Add a neutral backdrop inside the frame (`bg-ink/40`) so letterboxed edges read as intentional matte rather than a gap.
- Result: every image occupies the identical square, centered, with no cropping.

### 2. `src/components/memoir/TiltImage.tsx` — sharpness + centering
- Pass through an `objectFit` prop (default `cover`, Chapter uses `contain`) so the tilt card doesn't force cropping.
- Add `decoding="async"`, `sizes="(min-width: 768px) 28rem, 24rem"`, and `fetchPriority` matching the existing `priority` flag, so the browser picks the right resolution from the `srcset` when present.
- If the `src` is a WordPress URL, derive a higher-DPI variant for `srcset` (e.g. append `?w=896` / `?w=448`) so 2× screens get a crisp bitmap. Fallback to plain `src` when the URL isn't WP-shaped.

### 3. No data / edge-function changes
Chapter content, ordering, and the `wordpress-chapters` function are untouched.

## Verification
- Load `/` and scroll through chapters: every featured image frame is the same square, subject centered, no cropping, no layout shift.
- Spot-check a portrait-oriented and a landscape-oriented source image — both fit fully inside the square with matte bars on the short axis.
- DevTools → Network: image requests use the higher-resolution variant on a 2× viewport.
