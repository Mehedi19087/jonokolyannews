import { cache } from "react";
import { normalizeArticle, decodeSegment } from "./news-format.js";
import { categoryOrder } from "./navigation.js";

export const API_BASE = (process.env.NEWS_API_BASE_URL || "https://newspaper-web-production.up.railway.app").replace(/\/+$/, "");
export const TENANT_SLUG = process.env.NEWS_TENANT_SLUG || "jonokolyannews";

export async function newsRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}/api/news/${path}`, {
    ...options,
    headers: { "X-Tenant-Slug": TENANT_SLUG, ...options.headers },
    cache: "no-store",
    signal: options.signal || AbortSignal.timeout(12000),
  });
  if (!response.ok) {
    const error = new Error(`News request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return response.status === 204 ? null : response.json();
}

async function list(path) {
  let data = await newsRequest(path);
  const rows = Array.isArray(data) ? data : data.results || [];
  const visited = new Set();
  while (data.next && !visited.has(data.next)) {
    visited.add(data.next);
    const next = new URL(data.next, API_BASE);
    if (next.origin !== new URL(API_BASE).origin || !next.pathname.startsWith("/api/news/")) break;
    data = await newsRequest(next.pathname.slice("/api/news/".length) + next.search);
    rows.push(...(Array.isArray(data) ? data : data.results || []));
  }
  return rows;
}

export const getNewsDataset = cache(async () => {
  const results = await Promise.allSettled([list("categories/"), list("articles/")]);
  const categories = results[0].status === "fulfilled" ? results[0].value.map((c) => ({id:c.id, name:c.name, slug:c.slug, subcategories:[]})) : [];
  categories.sort((a,b) => (categoryOrder.indexOf(a.slug) < 0 ? 99 : categoryOrder.indexOf(a.slug)) - (categoryOrder.indexOf(b.slug) < 0 ? 99 : categoryOrder.indexOf(b.slug)));
  const articles = results[1].status === "fulfilled" ? results[1].value.filter((a) => !a.status || a.status === "PUBLISHED").map(normalizeArticle).sort((a,b) => new Date(b.publishedISO)-new Date(a.publishedISO)) : [];
  return { categories, articles, dateLabel: new Date().toLocaleDateString("bn-BD", {timeZone:"Asia/Dhaka", dateStyle:"full"}), error: results.some((r) => r.status === "rejected") };
});

export const getArticle = cache(async (slug) => {
  try { return { article: normalizeArticle(await newsRequest(`articles/${encodeURIComponent(decodeSegment(slug))}/`)), error: false }; }
  catch(error) { return { article: null, error: error.status !== 404, notFound: error.status === 404 }; }
});

export const getCategoryArticles = cache(async (slug, district = "") => {
  const query = new URLSearchParams({ category: slug, ...(district ? { district } : {}) });
  try {
    const rows = await list(`articles/?${query}`);
    return { articles: rows.filter((a) => !a.status || a.status === "PUBLISHED").map(normalizeArticle), error: false };
  } catch { return { articles: [], error: true }; }
});
