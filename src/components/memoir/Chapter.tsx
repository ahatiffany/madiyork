import { ArrowUp } from "lucide-react";
import { TiltImage } from "./TiltImage";
import { AnimatedHeading } from "./AnimatedHeading";
import { useReveal } from "@/hooks/useReveal";

export type ChapterBodyBlock =
  | { type: "paragraph"; text: string }
  | { type: "verse"; lines: string[] };

export interface ChapterData {
  number: string;
  title: string;
  pullQuote: string;
  /** Optional citation shown beneath the pull-quote (from a WP pullquote block). */
  pullQuoteCitation?: string;
  /** Plain strings are treated as paragraphs for backward compatibility. */
  body: Array<string | ChapterBodyBlock>;
  image: string;
  imageAlt: string;
  imageCaption?: string;
  is3D?: boolean;
  /** Deprecated — layout is now always centered. */
  reverse?: boolean;
}

const normalizeBodyBlock = (
  block: string | ChapterBodyBlock,
): ChapterBodyBlock =>
  typeof block === "string" ? { type: "paragraph", text: block } : block;

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
      className="reveal relative py-10 sm:py-14 md:py-20 px-5 sm:px-6 md:px-14 scroll-mt-20"
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
        <div className="relative w-full max-w-sm md:max-w-md mx-auto mb-8 sm:mb-10">
          <div className="absolute -inset-6 sm:-inset-8 bg-gradient-spotlight opacity-60 blur-2xl pointer-events-none" />
          <div className="relative aspect-square overflow-hidden rounded-sm shadow-cinematic bg-ink/40">
            <TiltImage
              src={chapter.image}
              alt={chapter.imageAlt}
              caption={chapter.imageCaption}
              is3D={chapter.is3D}
              objectFit="contain"
              sizes="(min-width: 768px) 28rem, 24rem"
              className="absolute inset-0 h-full w-full [&_figure]:h-full [&>div]:h-full"
            />
          </div>
        </div>

        {/* Pull quote */}
        <figure className="mb-8 sm:mb-10 max-w-xl sm:max-w-2xl mx-auto">
          <blockquote className="font-display italic text-xl sm:text-2xl md:text-3xl text-gold/90 leading-snug border-l-2 border-r-2 border-gold/40 px-4 sm:px-6 mx-auto text-balance max-w-[28ch] sm:max-w-[36ch] md:max-w-[44ch]">
            “{chapter.pullQuote}”
          </blockquote>
          {chapter.pullQuoteCitation && (
            <figcaption className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base tracking-normal text-gold/70 mx-auto max-w-[24ch] text-balance">
              — {chapter.pullQuoteCitation}
            </figcaption>
          )}
        </figure>

        {/* Body — paragraphs are justified on larger screens; verse blocks are centered + italic. */}
        <div className="space-y-5 text-base md:text-lg text-parchment/90 leading-relaxed max-w-prose w-full">
          {chapter.body.map((raw, i) => {
            const block = normalizeBodyBlock(raw);
            if (block.type === "verse") {
              return (
                <div
                  key={i}
                  className="my-6 sm:my-8 font-display italic text-center text-parchment/90 leading-relaxed text-lg md:text-xl"
                >
                  {block.lines.map((line, li) => (
                    <span key={li} className="block min-h-[1em]">
                      {line || "\u00A0"}
                    </span>
                  ))}
                </div>
              );
            }
            return (
              <p key={i} className="text-left sm:text-justify">
                {block.text}
              </p>
            );
          })}
        </div>


        {/* Back to table of contents */}
        <nav
          aria-label="Back to table of contents"
          className="mt-10 sm:mt-12 w-full max-w-prose flex justify-center"
        >
          <a
            href="#toc"
            className="inline-flex items-center gap-2 px-4 py-3 bg-card/90 backdrop-blur-md border border-gold/30 rounded-md shadow-cinematic text-xs tracking-[0.3em] uppercase text-gold hover:bg-card transition-colors"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            Top
          </a>
        </nav>
      </div>
    </section>
  );
};
