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
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();

const splitParagraphs = (html: string): string[] => {
  const blocks = html.split(/<\/p>/i).map((b) => stripHtml(b)).filter(Boolean);
  return blocks.length ? blocks : [stripHtml(html)].filter(Boolean);
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
    const chapters: Chapter[] = posts.map((p, i) => {
      const tags = Object.keys(p.tags ?? {}).map((t) => t.toLowerCase());
      const excerptText = stripHtml(p.excerpt || "");
      const bodyParas = splitParagraphs(p.content || "");
      // First paragraph as pull-quote if no excerpt
      const pullQuote = excerptText || bodyParas[0] || "";
      const body = excerptText ? bodyParas : bodyParas.slice(1);

      return {
        id: p.ID,
        number: `Chapter ${numberWord(i + 1)}`,
        title: stripHtml(p.title) || `Chapter ${i + 1}`,
        pullQuote,
        body: body.length ? body : bodyParas,
        image: p.featured_image || "",
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
