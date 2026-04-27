// Edge function: fetch memoir chapters from WordPress.com via the Lovable connector gateway.
// Hardcoded site per architecture decision.
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const SITE = "madiyork.wordpress.com";
const GATEWAY = "https://connector-gateway.lovable.dev/wordpress_com";

interface WPPost {
  ID: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  featured_image: string;
  tags: Record<string, unknown>;
  categories: Record<string, unknown>;
}

interface Chapter {
  id: number;
  number: string;
  title: string;
  pullQuote: string;
  pullQuoteCitation?: string;
  body: string[];
  image: string;
  imageAlt: string;
  imageCaption?: string;
  is3D: boolean;
}

const stripHtml = (html: string) =>
  html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8211;|&#8212;/g, "—")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

const splitParagraphs = (html: string): string[] => {
  const blocks = html.split(/<\/p>/i).map((b) => stripHtml(b)).filter(Boolean);
  return blocks.length ? blocks : [stripHtml(html)].filter(Boolean);
};

const stripWordPressExcerptMore = (text: string) =>
  text.replace(/\s*(?:\[&hellip;\]|\[…\]|&hellip;|…)\s*$/i, "").trim();

/**
 * Extract a pull-quote from a WordPress excerpt. Supports:
 *  - Default excerpt block (plain <p> text)
 *  - Pullquote block with optional <cite> citation
 *    <figure class="wp-block-pullquote"><blockquote><p>quote</p><cite>citation</cite></blockquote></figure>
 */
const parseExcerpt = (html: string): { quote: string; citation?: string } => {
  if (!html) return { quote: "" };

  // Look for a <cite>…</cite> anywhere in the excerpt (pullquote block).
  const citeMatch = html.match(/<cite[^>]*>([\s\S]*?)<\/cite>/i);
  if (citeMatch) {
    const citation = stripHtml(citeMatch[1]);
    // Quote is everything else with the <cite> removed.
    const withoutCite = html.replace(citeMatch[0], " ");
    const quote = stripWordPressExcerptMore(stripHtml(withoutCite));
    return { quote, citation: citation || undefined };
  }

  return { quote: stripWordPressExcerptMore(stripHtml(html)) };
};

/** Extract and remove the first WordPress pullquote/blockquote from post content. */
const extractPullQuoteFromContent = (html: string): { quote: string; citation?: string; contentHtml: string } => {
  const pullQuoteMatch = html.match(/<figure[^>]*class=["'][^"']*(?:wp-block-pullquote|wp-block-quote)[^"']*["'][^>]*>[\s\S]*?<\/figure>/i)
    ?? html.match(/<blockquote[\s\S]*?<\/blockquote>/i);

  if (!pullQuoteMatch) return { quote: "", contentHtml: html };

  const blockHtml = pullQuoteMatch[0];
  const citeMatch = blockHtml.match(/<cite[^>]*>([\s\S]*?)<\/cite>/i);
  const citation = citeMatch ? stripHtml(citeMatch[1]) : undefined;
  const withoutCite = citeMatch ? blockHtml.replace(citeMatch[0], " ") : blockHtml;
  const paragraphMatch = withoutCite.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  const quote = stripWordPressExcerptMore(stripHtml(paragraphMatch?.[1] ?? withoutCite));

  return {
    quote,
    citation: citation || undefined,
    contentHtml: html.replace(blockHtml, " "),
  };
};

const firstImageSrc = (html: string): string => {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] ?? "";
};

const taxonomyNames = (taxonomy: Record<string, unknown>): string[] =>
  Object.entries(taxonomy ?? {}).flatMap(([key, value]) => {
    const names = [key];
    if (typeof value === "string") names.push(value);
    if (value && typeof value === "object") {
      const record = value as Record<string, unknown>;
      ["name", "slug", "title"].forEach((field) => {
        if (typeof record[field] === "string") names.push(record[field] as string);
      });
    }
    return names.map((name) => name.toLowerCase().trim()).filter(Boolean);
  });

const isChapterPost = (post: WPPost): boolean => {
  const names = [...taxonomyNames(post.categories), ...taxonomyNames(post.tags)];
  return names.includes("chapter") || names.includes("chapters");
};

const numberWord = (n: number): string => {
  const words = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"];
  return words[n - 1] ?? String(n);
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    const WORDPRESS_COM_API_KEY = Deno.env.get("WORDPRESS_COM_API_KEY");
    if (!WORDPRESS_COM_API_KEY) throw new Error("WORDPRESS_COM_API_KEY is not configured");

    const url = `${GATEWAY}/rest/v1.1/sites/${SITE}/posts?number=20&status=publish&type=post&order=ASC&fields=ID,slug,title,excerpt,content,date,featured_image,tags,categories`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": WORDPRESS_COM_API_KEY,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(`WordPress API failed [${res.status}]: ${JSON.stringify(data)}`);
    }

    const posts: WPPost[] = data.posts ?? [];
    const chapterPosts = posts.filter(isChapterPost);
    console.log(`wordpress-chapters fetched ${posts.length} published posts; ${chapterPosts.length} chapter posts`);

    const chapters: Chapter[] = chapterPosts.map((p, i) => {
      const tags = Object.keys(p.tags ?? {}).map((t) => t.toLowerCase());
      const { quote: excerptQuote, citation: excerptCitation } = parseExcerpt(p.excerpt || "");
      const bodyParas = splitParagraphs(p.content || "");
      // First paragraph as pull-quote if no excerpt
      const pullQuote = excerptQuote || bodyParas[0] || "";
      const body = excerptQuote ? bodyParas : bodyParas.slice(1);
      const image = p.featured_image || firstImageSrc(p.content || "");

      return {
        id: p.ID,
        number: `Chapter ${numberWord(i + 1)}`,
        title: stripHtml(p.title) || `Chapter ${i + 1}`,
        pullQuote,
        pullQuoteCitation: excerptCitation,
        body: body.length ? body : bodyParas,
        image,
        imageAlt: stripHtml(p.title) || `Chapter ${i + 1} image`,
        imageCaption: new Date(p.date).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        is3D: tags.includes("3d"),
      };
    });

    return new Response(JSON.stringify({ chapters }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("wordpress-chapters error:", msg);
    return new Response(JSON.stringify({ chapters: [], error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
