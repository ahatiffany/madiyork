import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ChapterData } from "@/components/memoir/Chapter";

interface UseChaptersResult {
  chapters: ChapterData[];
  loading: boolean;
  source: "wordpress" | "empty";
}

/**
 * Fetches memoir chapters from WordPress.com via the `wordpress-chapters`
 * edge function. Renders nothing until the fetch resolves; if it fails or
 * returns no usable posts, chapters remain empty and the UI shows a small
 * empty state instead of placeholder content.
 */
export const useChapters = (): UseChaptersResult => {
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"wordpress" | "empty">("empty");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("wordpress-chapters");
        if (cancelled) return;
        if (error) throw error;

        const incoming = (data?.chapters ?? []) as ChapterData[];
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
        console.warn("[useChapters] failed to load chapters:", e);
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
