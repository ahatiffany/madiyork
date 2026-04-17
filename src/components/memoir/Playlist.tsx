import { useState } from "react";
import { Music, ChevronDown } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

/**
 * Embedded Spotify playlist section + a sticky floating mini-player
 * that follows the reader as they scroll the memoir.
 */
export const Playlist = () => {
  const sectionRef = useReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="playlist"
      className="reveal relative py-28 md:py-40 px-6 md:px-14"
    >
      <div className="max-w-5xl mx-auto text-center">
        <span className="text-xs tracking-[0.5em] uppercase text-gold">Interlude</span>
        <h2 className="font-display text-4xl md:text-6xl text-parchment mt-4 mb-6">
          The Soundtrack of <em>Quiet Hours</em>
        </h2>
        <p className="text-mist/80 max-w-2xl mx-auto mb-14 leading-relaxed">
          Songs that lived alongside the writing — for the long evenings,
          the train rides, and the silences in between. Press play and read on.
        </p>

        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-spotlight opacity-70 blur-2xl pointer-events-none" />
          <div className="relative rounded-md overflow-hidden shadow-cinematic border border-border bg-card">
            <iframe
              title="The Weight of Quiet Hours — Memoir Playlist"
              src="https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ?utm_source=generator&theme=0"
              width="100%"
              height="420"
              frameBorder={0}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="block"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

/** Small floating player that hangs in the corner once the user scrolls past the hero. */
export const FloatingPlaylistTab = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 hidden md:block">
      <div
        className={cn(
          "bg-card/90 backdrop-blur-md border border-gold/30 rounded-md shadow-cinematic overflow-hidden transition-all duration-500",
          open ? "w-[340px]" : "w-[180px]",
        )}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 group"
          aria-expanded={open}
          aria-label="Toggle playlist"
        >
          <span className="flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-gold">
            <Music className="h-3.5 w-3.5" />
            Playlist
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-gold transition-transform duration-500",
              open ? "rotate-180" : "rotate-0",
            )}
          />
        </button>
        <div
          className={cn(
            "transition-all duration-500 ease-out",
            open ? "max-h-[180px] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <iframe
            title="Floating playlist"
            src="https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ?utm_source=generator&theme=0"
            width="100%"
            height="160"
            frameBorder={0}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};
