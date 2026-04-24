import heroImg from "@/assets/hero-memoir.jpg";
import { AnimatedHeading } from "./AnimatedHeading";

export const Hero = () => {
  return (
    <header className="relative h-[100svh] w-full overflow-hidden film-grain">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="A woman in a dark coat at the edge of a misty pier, looking toward distant city lights"
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

      {/* Centerpiece */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-[calc(100svh-7rem)] px-6">
        <AnimatedHeading
          as="h1"
          text="Ari Winters: The Blue Hole"
          delay={0.4}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-[8.5rem] text-parchment max-w-5xl"
        />

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
