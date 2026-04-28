import { TiltImage } from "./TiltImage";
import { AnimatedHeading } from "./AnimatedHeading";
import { useReveal } from "@/hooks/useReveal";

export interface ChapterData {
  number: string;
  title: string;
  pullQuote: string;
  /** Optional citation shown beneath the pull-quote (from a WP pullquote block). */
  pullQuoteCitation?: string;
  body: string[];
  image: string;
  imageAlt: string;
  imageCaption?: string;
  is3D?: boolean;
  /** Deprecated — layout is now always centered. */
  reverse?: boolean;
}

interface ChapterProps {
  chapter: ChapterData;
  index: number;
}

export const Chapter = ({ chapter, index }: ChapterProps) => {
  const sectionRef = useReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id={`chapter-${index + 1}`}
      className="reveal relative py-20 sm:py-28 md:py-40 px-5 sm:px-6 md:px-14 scroll-mt-20"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Chapter eyebrow */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6">
          <span className="h-px w-8 sm:w-12 bg-gold/40 shimmer" />
          <span className="text-[10px] sm:text-xs tracking-[0.5em] uppercase text-gold">
            {chapter.number}
          </span>
          <span className="h-px w-8 sm:w-12 bg-gold/40 shimmer" />
        </div>

        {/* Title */}
        <AnimatedHeading
          text={chapter.title}
          className="text-3xl sm:text-4xl md:text-6xl text-parchment mb-8 sm:mb-10"
        />

        {/* Featured image — anchored between title and excerpt, uniform square */}
        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto mb-8 sm:mb-10">
          <div className="absolute -inset-6 sm:-inset-8 bg-gradient-spotlight opacity-60 blur-2xl pointer-events-none" />
          <div className="relative aspect-square overflow-hidden rounded-sm shadow-cinematic">
            <TiltImage
              src={chapter.image}
              alt={chapter.imageAlt}
              caption={chapter.imageCaption}
              is3D={chapter.is3D}
              className="absolute inset-0 h-full w-full [&_figure]:h-full [&>div]:h-full"
            />
          </div>
        </div>

        {/* Pull quote */}
        <figure className="mb-8 sm:mb-10 max-w-3xl">
          <blockquote className="font-display italic text-xl sm:text-2xl md:text-3xl text-gold/90 leading-snug border-l-2 border-r-2 border-gold/40 px-4 sm:px-6">
            “{chapter.pullQuote}”
          </blockquote>
          {chapter.pullQuoteCitation && (
            <figcaption className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base tracking-normal text-gold/70">
              — {chapter.pullQuoteCitation}
            </figcaption>
          )}
        </figure>

        {/* Body — justified on larger screens, left-aligned on mobile for readability */}
        <div className="space-y-5 text-base md:text-lg text-parchment/90 leading-relaxed max-w-prose text-left sm:text-justify">
          {chapter.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
};
