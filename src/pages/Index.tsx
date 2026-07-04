import { useEffect } from "react";
import { Hero } from "@/components/memoir/Hero";
import { Chapter } from "@/components/memoir/Chapter";
import { About } from "@/components/memoir/About";
import { Playlist, FloatingPlaylistTab } from "@/components/memoir/Playlist";
import { Footer } from "@/components/memoir/Footer";
import { useChapters } from "@/hooks/useChapters";

const Index = () => {
  const { chapters, loading, source } = useChapters();
  // SEO: title + meta description for the memoir landing page.
  useEffect(() => {
    document.title = "ARI WYNTER: The Blue Hole — by Madi York";

    const setMeta = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setMeta(
      "description",
      "ARI WYNTER: The Blue Hole — by Madi York. Read excerpts, see photographs, and listen to the soundtrack.",
    );

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = window.location.origin + "/";
  }, []);

  return (
    <main className="relative bg-background text-foreground overflow-x-hidden">
      <Hero />

      <section id="chapters" className="relative">
        <div id="toc" className="relative pt-16 sm:pt-20 pb-4 px-5 sm:px-6 text-center scroll-mt-20">
          <span className="text-[10px] tracking-[0.5em] sm:tracking-[0.6em] uppercase text-gold/80">
            The Chapters
          </span>

          {loading ? (
            <p className="font-display italic text-mist/60 mt-6 text-base sm:text-lg">
              Loading chapters…
            </p>
          ) : source === "wordpress" && chapters.length > 0 ? (
            <nav aria-label="Table of contents" className="mt-6 max-w-2xl mx-auto">
              <ul className="flex flex-col gap-2">
                {chapters.map((c, i) => (
                  <li key={`toc-${i}`}>
                    <a
                      href={`#chapter-${i + 1}`}
                      className="group inline-flex flex-wrap items-baseline justify-center gap-2 sm:gap-3 font-display italic text-mist/80 hover:text-gold transition-colors px-2"
                    >
                      <span className="text-[10px] not-italic tracking-[0.4em] uppercase text-gold/70">
                        {c.number}
                      </span>
                      <span className="text-base sm:text-lg group-hover:underline underline-offset-4 decoration-gold/50">
                        {c.title}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : (
            <p className="font-display italic text-mist/60 mt-6 text-base sm:text-lg">
              Chapters coming soon.
            </p>
          )}
        </div>

        {!loading &&
          chapters.map((c, i) => (
            <Chapter key={`${c.number}-${i}`} chapter={c} index={i} />
          ))}
      </section>

      <Playlist />
      <About />
      <Footer />

      <FloatingPlaylistTab />

      {/* JSON-LD: Book schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Book",
            name: "ARI WYNTER: The Blue Hole",
            author: { "@type": "Person", name: "Madi York" },
            bookFormat: "https://schema.org/Hardcover",
            inLanguage: "en",
            description:
              "ARI WYNTER: The Blue Hole — a book by Madi York.",
          }),
        }}
      />
    </main>
  );
};

export default Index;
