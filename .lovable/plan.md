## Change

In `src/components/memoir/Playlist.tsx`, add a new "Visual Inspirations" block below the Spotify iframe (still inside the same section, same `max-w-5xl` container) that embeds 4 YouTube videos.

### Layout
- Header above the videos, matching the existing Playlist typography but smaller:
  - Eyebrow: `Visual Inspirations` — gold, uppercase, tracked (same style as "Interlude").
  - Heading: `Scenes That Shaped The Story` — `font-display`, ~2xl/3xl.
  - Subcopy: short line in `text-mist/80` (e.g., "Films and moments that lived in my head while writing.").
- Responsive grid: `grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6` (2×2 on desktop, stacked on mobile — fits 4 videos cleanly).
- Each video: `aspect-video` wrapper with the same card chrome as the Spotify embed (`rounded-md overflow-hidden shadow-cinematic border border-border bg-card`).
- Caption under each: the video title in `font-display italic text-mist/80 text-sm sm:text-base`, centered, `mt-3`.
- Spacing from the Spotify embed: `mt-16 sm:mt-20` so it reads as a related sub-section.

### Videos
Embed via `https://www.youtube.com/embed/{id}` with `title`, `loading="lazy"`, `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"`, `allowFullScreen`.

| # | Title | YouTube ID |
|---|---|---|
| 1 | Dean's Blue Hole | `uQITWbAaDx0` |
| 2 | Breathless | `bdBuDg7mrT8` |
| 3 | Tango 1 | `YO73nkU3wEk` |
| 4 | Tango 2 | `i3vsiiRK5GU` |

### Files
- `src/components/memoir/Playlist.tsx`

No other files change. `FloatingPlaylistTab` stays untouched.
