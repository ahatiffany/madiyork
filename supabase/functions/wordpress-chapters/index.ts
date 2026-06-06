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

type BodyBlock =
  | { type: "paragraph"; text: string }
  | { type: "verse"; lines: string[] };

interface Chapter {
  id: number;
  number: string;
  title: string;
  pullQuote: string;
  pullQuoteCitation?: string;
  body: BodyBlock[];
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

/**
 * Parse a WordPress "Verse" block (`<pre class="wp-block-verse">…</pre>`)
 * into individual lines. Preserves blank lines as stanza breaks.
 */
const parseVerseBlock = (innerHtml: string): string[] => {
  // Normalize <br> variants to newlines, then strip remaining tags per-line
  // so that links/spans inside a verse line are kept as text.
  const normalized = innerHtml
    .replace(/<br\s*\/?>(\r?\n)?/gi, "\n")
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
    .replace(/<\/?p[^>]*>/gi, "");
  const rawLines = normalized.split(/\n/);
  // Trim each line, but preserve blank lines as stanza breaks.
  return rawLines.map((line) => stripHtml(line));
};

/**
 * Walk the post content, extracting verse blocks as structured items and
 * splitting everything else into paragraph items.
 */
const parseBody = (html: string): BodyBlock[] => {
  if (!html) return [];
  const verseRegex = /<pre[^>]*class=["'][^"']*wp-block-verse[^"']*["'][^>]*>([\s\S]*?)<\/pre>/gi;
  const blocks: BodyBlock[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = verseRegex.exec(html)) !== null) {
    const before = html.slice(lastIndex, match.index);
    for (const p of splitParagraphs(before)) {
      blocks.push({ type: "paragraph", text: p });
    }
    const lines = parseVerseBlock(match[1]);
    // Trim leading/trailing blank lines but keep internal stanza breaks.
    let start = 0;
    let end = lines.length;
    while (start < end && lines[start].trim() === "") start++;
    while (end > start && lines[end - 1].trim() === "") end--;
    const trimmed = lines.slice(start, end);
    if (trimmed.length) blocks.push({ type: "verse", lines: trimmed });
    lastIndex = verseRegex.lastIndex;
  }

  const tail = html.slice(lastIndex);
  for (const p of splitParagraphs(tail)) {
    blocks.push({ type: "paragraph", text: p });
  }

  return blocks;
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
      const contentPullQuote = extractPullQuoteFromContent(p.content || "");
      const bodyBlocks = parseBody(contentPullQuote.contentHtml || "");
      // First paragraph as pull-quote fallback if no excerpt/pullquote.
      const firstParaIdx = bodyBlocks.findIndex((b) => b.type === "paragraph");
      const firstParaText =
        firstParaIdx >= 0 && bodyBlocks[firstParaIdx].type === "paragraph"
          ? (bodyBlocks[firstParaIdx] as { type: "paragraph"; text: string }).text
          : "";
      const pullQuote = contentPullQuote.quote || excerptQuote || firstParaText;
      const pullQuoteCitation = contentPullQuote.citation || excerptCitation;
      // If we fell back to the first paragraph for the pull-quote, drop it from body.
      const body =
        contentPullQuote.quote || excerptQuote || firstParaIdx < 0
          ? bodyBlocks
          : bodyBlocks.filter((_, idx) => idx !== firstParaIdx);
      const image = p.featured_image || firstImageSrc(p.content || "");

      return {
        id: p.ID,
        number: `Chapter ${numberWord(i + 1)}`,
        title: stripHtml(p.title) || `Chapter ${i + 1}`,
        pullQuote,
        pullQuoteCitation,
        body,
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
