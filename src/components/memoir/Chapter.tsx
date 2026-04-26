import { TiltImage } from "./TiltImage";
import { AnimatedHeading } from "./AnimatedHeading";
import { useReveal } from "@/hooks/useReveal";

export interface ChapterData {
  number: string;
  title: string;
  pullQuote: string;
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
      className="reveal relative py-28 md:py-40 px-6 md:px-14 scroll-mt-20"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Chapter eyebrow */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="h-px w-12 bg-gold/40 shimmer" />
          <span className="text-xs tracking-[0.5em] uppercase text-gold">
            {chapter.number}
          </span>
          <span className="h-px w-12 bg-gold/40 shimmer" />
        </div>

        {/* Title */}
        <AnimatedHeading
          text={chapter.title}
          className="text-4xl md:text-6xl text-parchment mb-8"
        />

        {/* Pull quote */}
        <p className="font-display italic text-2xl md:text-3xl text-gold/90 leading-snug mb-10 max-w-3xl border-l-2 border-r-2 border-gold/40 px-6">
          "{chapter.pullQuote}"
        </p>

        {/* Body — justified */}
        <div className="space-y-5 text-base md:text-lg text-parchment/90 leading-relaxed max-w-prose text-justify mb-12">
          {chapter.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* Featured image — centered, below excerpt */}
        <div className="relative w-full max-w-3xl mx-auto">
          <div className="absolute -inset-10 bg-gradient-spotlight opacity-60 blur-2xl pointer-events-none" />
          <TiltImage
            src={chapter.image}
            alt={chapter.imageAlt}
            caption={chapter.imageCaption}
            is3D={chapter.is3D}
            className="relative"
          />
        </div>
      </div>
    </section>
  );
};
