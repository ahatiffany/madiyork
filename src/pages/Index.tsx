import { useEffect } from "react";
import { Hero } from "@/components/memoir/Hero";
import { Chapter } from "@/components/memoir/Chapter";
import { About } from "@/components/memoir/About";
import { Playlist, FloatingPlaylistTab } from "@/components/memoir/Playlist";
import { Footer } from "@/components/memoir/Footer";
import { useChapters } from "@/hooks/useChapters";

const Index = () => {
  const { chapters, source } = useChapters();
  // SEO: title + meta description for the memoir landing page.
  useEffect(() => {
    document.title = "Ari Winters: The Blue Hole — by Madi York";

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
      "Ari Winters: The Blue Hole — by Madi York. Read excerpts, see photographs, and listen to the soundtrack.",
    );

    // Canonical
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
        {/* Soft transition from hero into chapters */}
        <div className="relative pt-20 pb-4 px-6 text-center">
          <span className="text-[10px] tracking-[0.6em] uppercase text-gold/80">
            The Chapters
          </span>
          <p className="font-display italic text-mist/70 mt-3 text-lg">
            {source === "wordpress" ? "Live from the author's notebook" : "Three excerpts from the memoir"}
          </p>
        </div>

        {chapters.map((c, i) => (
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
            name: "Ari Winters: The Blue Hole",
            author: { "@type": "Person", name: "Madi York" },
            bookFormat: "https://schema.org/Hardcover",
            inLanguage: "en",
            description:
              "Ari Winters: The Blue Hole — a book by Madi York.",
          }),
        }}
      />
    </main>
  );
};

export default Index;
