import heroImg from "@/assets/hero-memoir.jpg";
import { AnimatedHeading } from "./AnimatedHeading";

export const Hero = () => {
  return (
    <header className="relative h-[100svh] w-full overflow-hidden film-grain">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="A teenage boy in a dark coat standing at the end of a misty pier, looking toward distant city lights"
          className="h-full w-full object-cover ken-burns"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-vignette" />
        <div className="absolute inset-0 bg-gradient-dusk" />
        <div className="absolute inset-0 bg-gradient-spotlight opacity-70" />
      </div>

      {/* Top bar */}
      <nav className="relative z-10 flex items-center justify-between px-8 md:px-14 pt-8">
        <span className="text-xs tracking-[0.4em] uppercase text-gold/90">Madi York</span>
        <div className="hidden md:flex gap-8 text-xs tracking-[0.35em] uppercase text-parchment/70">
          <a href="#chapters" className="hover:text-gold transition-colors">Chapters</a>
          <a href="#playlist" className="hover:text-gold transition-colors">Playlist</a>
          <a href="#about" className="hover:text-gold transition-colors">About</a>
        </div>
      </nav>

      {/* Centerpiece — title centered, anchored toward the lower third */}
      <div className="relative z-10 flex flex-col items-center justify-end text-center h-[calc(100svh-7rem)] pb-[12vh] md:pb-[14vh] px-8 md:px-14">
        <h1 className="font-display leading-[1.05] text-5xl sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl">
          <span className="block overflow-hidden">
            <span
              className="inline-block opacity-0 animate-letter-rise text-gold"
              style={{ animationDelay: "0.4s" }}
            >
              ARI WYNTER:
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className="inline-block opacity-0 animate-letter-rise text-parchment"
              style={{ animationDelay: "0.7s" }}
            >
              The Blue Hole
            </span>
          </span>
        </h1>

        <div
          className="mt-12 opacity-0 animate-fade-in-slow"
          style={{ animationDelay: "2s" }}
        >
          <a
            href="#chapters"
            className="inline-flex flex-col items-center gap-3 group"
            aria-label="Begin reading"
          >
            <span className="text-[10px] tracking-[0.5em] uppercase text-parchment/70 group-hover:text-gold transition-colors">
              Begin
            </span>
            <span className="relative block w-px h-12 bg-gold/30 overflow-hidden">
              <span className="absolute top-0 left-0 w-px h-3 bg-gold scroll-cue-dot" />
            </span>
          </a>
        </div>
      </div>
    </header>
  );
};
