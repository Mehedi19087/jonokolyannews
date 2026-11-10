export function publicationDate(value) {
  if (!value || Number.isNaN(new Date(value).getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date(value));
}

export function plainParagraphs(value = "") {
  return String(value)
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<\/(?:p|div|h[1-6]|li)>|<br\s*\/?\s*>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#(?:0*39|x27);/gi, "'")
    .split(/\n+/).map((p) => p.trim()).filter(Boolean);
}

export function normalizeArticle(article) {
  const published = article.published_at || article.created_at;
  const content = plainParagraphs(article.content);
  const summary = plainParagraphs(article.ai_summary).join(" ");
  return {
    id: article.slug, apiId: article.id, title: article.title,
    category: article.category?.slug || "", categoryLabel: article.category?.name || "সংবাদ",
    image: safeUrl(article.featured_image_url),
    subtitle: article.excerpt || summary || content[0] || "",
    content, aiSummary: summary,
    audioUrl: safeUrl(article.audio_file_url), audioStatus: article.audio_status || "",
    audioDelayed: Boolean(article.audio_is_delayed),
    videoUrl: safeVideoUrl(article.video_url),
    photos: article.photos?.map((p) => typeof p === "string" ? safeUrl(p) : safeUrl(p.url)).filter(Boolean),
    publishedISO: published || "", publicationDate: publicationDate(published),
    publishedAt: publicationDate(published) ? new Date(published).toLocaleDateString("bn-BD", {timeZone:"Asia/Dhaka", dateStyle:"long"}) : "",
    author: [article.author?.first_name, article.author?.last_name].filter(Boolean).join(" ") || "নিজস্ব প্রতিবেদক",
    districts: article.districts || [], isLive: Boolean(article.is_breaking),
    views: article.views ?? article.view_count ?? null,
    caption: article.caption || "", photoCredit: article.photo_credit || "",
  };
}

export function safeUrl(value) {
  if (!value) return "";
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) ? url.href : ""; }
  catch { return ""; }
}

export function safeVideoUrl(value) {
  const url = safeUrl(value);
  if (!url) return "";
  const parsed = new URL(url);
  if (parsed.hostname === "youtu.be") return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(parsed.pathname.slice(1))}`;
  if (["www.youtube.com", "youtube.com", "www.youtube-nocookie.com"].includes(parsed.hostname)) {
    const id = parsed.searchParams.get("v") || parsed.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1];
    return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : "";
  }
  if (/\.(mp4|webm|ogv|ogg)$/i.test(parsed.pathname)) return url;
  return "";
}

export function isEmbeddedVideo(url) {
  return Boolean(url && new URL(url).hostname === "www.youtube-nocookie.com");
}

export function decodeSegment(value) {
  try { return decodeURIComponent(value); } catch { return value; }
}
