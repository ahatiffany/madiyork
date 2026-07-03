import { useRef, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface TiltImageProps {
  src: string;
  alt: string;
  caption?: string;
  /** When true, applies a stronger 3D parallax tilt on mouse move. */
  is3D?: boolean;
  className?: string;
  priority?: boolean;
  /** How the image fills its frame. Defaults to "cover". */
  objectFit?: "cover" | "contain";
  /** Passed through to <img sizes>, helps the browser pick the right srcset entry. */
  sizes?: string;
  /** Apply a subtle film-grain overlay. Defaults to true. */
  grain?: boolean;
  /** Apply a vignette edge gradient. Defaults to true. */
  vignette?: boolean;
}

/** Build a WordPress-friendly srcset from a source URL. Returns undefined for non-WP URLs. */
const buildWpSrcSet = (src: string): string | undefined => {
  try {
    const url = new URL(src, window.location.origin);
    const isWp =
      /wp-content\/uploads/i.test(url.pathname) ||
      url.searchParams.has("w") ||
      /\.wp\.com$/i.test(url.hostname);
    if (!isWp) return undefined;

    const widths = [448, 640, 896, 1200];
    return widths
      .map((w) => {
        const u = new URL(url.toString());
        u.searchParams.set("w", String(w));
        return `${u.toString()} ${w}w`;
      })
      .join(", ");
  } catch {
    return undefined;
  }
};

/**
 * Cinematic image card. When `is3D` is true, tracks the cursor and
 * tilts the surface in 3D for a parallax/diorama effect.
 */
export const TiltImage = ({
  src,
  alt,
  caption,
  is3D = false,
  className,
  priority = false,
  objectFit = "cover",
  sizes,
}: TiltImageProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!is3D || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rx = (-y * 10).toFixed(2);
    const ry = (x * 14).toFixed(2);
    wrapRef.current.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };

  const handleLeave = () => {
    if (!is3D || !wrapRef.current) return;
    wrapRef.current.style.transform = "perspective(1200px) rotateX(0) rotateY(0)";
  };

  const srcSet = typeof window !== "undefined" ? buildWpSrcSet(src) : undefined;

  return (
    <figure className={cn("relative", className)}>
      <div
        ref={wrapRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={cn(
          "relative overflow-hidden rounded-sm shadow-cinematic film-grain vignette",
          is3D && "tilt-card",
        )}
      >
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          className={cn(
            "block w-full h-full object-center",
            objectFit === "contain" ? "object-contain" : "object-cover",
          )}
        />
        {is3D && (
          <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] tracking-[0.3em] uppercase text-gold/90 border border-gold/40 bg-ink/40 backdrop-blur-sm rounded-sm">
            3D
          </span>
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-xs tracking-[0.25em] uppercase text-mist/70">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
