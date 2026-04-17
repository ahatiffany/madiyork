import { cn } from "@/lib/utils";

interface AnimatedHeadingProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  /** Delay before the animation starts, in seconds. */
  delay?: number;
}

/**
 * Splits text into words and animates each one rising into place.
 * Used for cinematic chapter and hero titles.
 */
export const AnimatedHeading = ({ text, className, as: Tag = "h2", delay = 0 }: AnimatedHeadingProps) => {
  const words = text.split(" ");
  return (
    <Tag className={cn("font-display leading-[1.05]", className)}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.25em]">
          <span
            className="inline-block opacity-0 animate-letter-rise"
            style={{ animationDelay: `${delay + i * 0.08}s` }}
          >
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
};
