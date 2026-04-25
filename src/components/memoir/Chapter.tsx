import { TiltImage } from "./TiltImage";
import { AnimatedHeading } from "./AnimatedHeading";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

export interface ChapterData {
  number: string;
  title: string;
  pullQuote: string;
  body: string[];
  image: string;
  imageAlt: string;
  imageCaption?: string;
  is3D?: boolean;
  /** Flips the layout so image sits on the right. */
  reverse?: boolean;
}

interface ChapterProps {
  chapter: ChapterData;
  index: number;
}

export const Chapter = ({ chapter, index }: ChapterProps) => {
  const sectionRef = useReveal<HTMLElement>();
  const isReverse = chapter.reverse ?? index % 2 === 1;

  return (
    <section
      ref={sectionRef}
      id={`chapter-${index + 1}`}
      className="reveal relative py-28 md:py-40 px-6 md:px-14 scroll-mt-20"
    >
      <div
        className={cn(
          "max-w-7xl mx-auto grid gap-12 md:gap-20 items-center",
          "md:grid-cols-2",
        )}
      >
        {/* Image side */}
        <div className={cn("relative", isReverse && "md:order-2")}>
          <div className="absolute -inset-10 bg-gradient-spotlight opacity-60 blur-2xl pointer-events-none" />
          <TiltImage
            src={chapter.image}
            alt={chapter.imageAlt}
            caption={chapter.imageCaption}
            is3D={chapter.is3D}
            className="relative"
          />
        </div>

        {/* Text side */}
        <div className={cn("relative", isReverse && "md:order-1")}>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs tracking-[0.5em] uppercase text-gold">
              {chapter.number}
            </span>
            <span className="h-px w-16 bg-gold/40 shimmer" />
          </div>

          <AnimatedHeading
            text={chapter.title}
            className="text-4xl md:text-6xl text-parchment mb-8"
          />

          <p className="font-display italic text-2xl md:text-3xl text-gold/90 leading-snug mb-8 border-l-2 border-gold/40 pl-6">
            "{chapter.pullQuote}"
          </p>

          <div className="space-y-5 text-base md:text-lg text-parchment/90 leading-relaxed max-w-prose">
            {chapter.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
