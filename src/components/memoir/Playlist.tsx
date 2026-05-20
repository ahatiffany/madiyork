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
      className="reveal relative py-20 sm:py-28 md:py-40 px-5 sm:px-6 md:px-14"
    >
      <div className="max-w-5xl mx-auto text-center">
        <span className="text-[10px] sm:text-xs tracking-[0.5em] uppercase text-gold">Interlude</span>
        <h2 className="font-display text-3xl sm:text-4xl md:text-6xl text-parchment mt-4 mb-6">
          The Soundtrack of <em>The Blue Hole</em>
        </h2>
        <p className="text-sm sm:text-base text-mist/80 max-w-2xl mx-auto mb-10 sm:mb-14 leading-relaxed px-2">
          Songs that inspired the writing.
          <br />
          Press play and be transported to the world of ARI WYNTER.
        </p>

        <div className="relative">
          <div className="absolute -inset-4 sm:-inset-6 bg-gradient-spotlight opacity-70 blur-2xl pointer-events-none" />
          <div className="relative rounded-md overflow-hidden shadow-cinematic border border-border bg-card">
            <iframe
              title="Ari Winters: The Blue Hole — Playlist"
              src="https://open.spotify.com/embed/playlist/3qHLTcjpo2tabtaG10xwSs?utm_source=generator&theme=0"
              width="100%"
              height="380"
              frameBorder={0}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="block w-full h-[352px] sm:h-[420px]"
            />
          </div>
        </div>

        <div className="mt-16 sm:mt-20">
          <span className="text-[10px] sm:text-xs tracking-[0.5em] uppercase text-gold">Visual Inspirations</span>
          <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-parchment mt-3 mb-4">
            Scenes That Shaped <em>The Story</em>
          </h3>
          <p className="text-sm sm:text-base text-mist/80 max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed px-2">
            Films and moments that lived in my head while writing.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-left">
            {[
              { title: "Dean's Blue Hole", id: "uQITWbAaDx0" },
              { title: "Breathless", id: "bdBuDg7mrT8" },
              { title: "Tango 1", id: "YO73nkU3wEk" },
              { title: "Tango 2", id: "i3vsiiRK5GU" },
            ].map((v) => (
              <figure key={v.id}>
                <div className="relative rounded-md overflow-hidden shadow-cinematic border border-border bg-card aspect-video">
                  <iframe
                    title={v.title}
                    src={`https://www.youtube.com/embed/${v.id}`}
                    className="absolute inset-0 w-full h-full"
                    frameBorder={0}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <figcaption className="font-display italic text-mist/80 text-sm sm:text-base text-center mt-3">
                  {v.title}
                </figcaption>
              </figure>
            ))}
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
            src="https://open.spotify.com/embed/playlist/3qHLTcjpo2tabtaG10xwSs?utm_source=generator&theme=0"
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
