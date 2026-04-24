import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { chapters as fallbackChapters } from "@/data/chapters";
import type { ChapterData } from "@/components/memoir/Chapter";

interface UseChaptersResult {
  chapters: ChapterData[];
  loading: boolean;
  source: "wordpress" | "fallback";
}

/**
 * Fetches memoir chapters from WordPress.com via the `wordpress-chapters`
 * edge function. Falls back to the bundled sample chapters whenever the
 * site has no posts (e.g. the only post is the default "New Post" stub)
 * or the request fails — this keeps the cinematic experience intact while
 * the author is still drafting.
 */
export const useChapters = (): UseChaptersResult => {
  const [chapters, setChapters] = useState<ChapterData[]>(fallbackChapters);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"wordpress" | "fallback">("fallback");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("wordpress-chapters");
        if (cancelled) return;
        if (error) throw error;

        const incoming = (data?.chapters ?? []) as ChapterData[];
        // Skip placeholder posts (no real title/body, missing image).
        const usable = incoming.filter(
          (c) =>
            c.title &&
            c.title.toLowerCase() !== "new post" &&
            (c.body?.length ?? 0) > 0,
        );

        if (usable.length > 0) {
          setChapters(usable);
          setSource("wordpress");
        }
      } catch (e) {
        console.warn("[useChapters] using fallback chapters:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { chapters, loading, source };
};
