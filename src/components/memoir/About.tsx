import logo from "@/assets/my-york-logo.png";
import { TiltImage } from "./TiltImage";
import { AnimatedHeading } from "./AnimatedHeading";
import { useReveal } from "@/hooks/useReveal";

export const About = () => {
  const ref = useReveal<HTMLElement>();
  return (
    <section
      ref={ref}
      id="about"
      className="reveal relative py-28 md:py-40 px-6 md:px-14"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-[2fr_3fr] gap-14 items-center">
        <div className="max-w-[280px] md:max-w-[340px] mx-auto md:mx-0 w-full">
          <TiltImage
            src={logo}
            alt="MY York logo — stylized M with feather quill"
            is3D
          />
        </div>

        <div>
          <span className="text-xs tracking-[0.5em] uppercase text-gold">About the Author</span>
          <AnimatedHeading
            text="Madi York"
            className="text-5xl md:text-7xl text-parchment mt-4 mb-8"
          />
          <div className="space-y-5 text-mist/90 leading-relaxed max-w-prose">
            <p>
              Madi York is a writer of literary fiction.
            </p>
            <p>
              <em>Ari Winters: The Blue Hole</em> is her latest novel — drawn from
              notebooks kept across two cities and thirteen winters.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {["Fiction", "Literary"].map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 text-[10px] tracking-[0.3em] uppercase text-gold border border-gold/40 rounded-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
