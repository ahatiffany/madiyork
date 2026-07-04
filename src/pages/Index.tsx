import { useEffect } from "react";
import { Hero } from "@/components/memoir/Hero";
import { Chapter } from "@/components/memoir/Chapter";
import { About } from "@/components/memoir/About";
import { Playlist, FloatingPlaylistTab } from "@/components/memoir/Playlist";
import { Footer } from "@/components/memoir/Footer";
import { useChapters } from "@/hooks/useChapters";

const Index = () => {
  const { chapters, loading, source } = useChapters();

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
