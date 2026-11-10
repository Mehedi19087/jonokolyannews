"use client";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { AdSlot, NewsCard } from "@/components/common/NewsElements";
import { useNews } from "@/components/news/NewsProvider";
import NewsState from "@/components/news/NewsState";
import { publicationDate } from "@/lib/news-format";
function SearchContent({todayOnly = false}) {
  const {articles:mockNews, categories, error} = useNews();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [date, setDate] = useState(todayOnly ? publicationDate(new Date()) : params.get("date") || "");
  const [author, setAuthor] = useState("");
  const [limit, setLimit] = useState(10);
  const results = useMemo(() => {
    const filtered = mockNews.filter(
      (n) =>
        (!query.trim() ||
          `${n.title} ${n.subtitle || ""} ${(n.content || []).join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase())) &&
        (category === "all" || n.category === category) &&
        (!author || n.author === author) &&
        (!date || n.publicationDate === date),
    );
    return sort === "popular"
      ? [...filtered].sort((a, b) => (b.views || 0) - (a.views || 0))
      : [...filtered].sort((a,b)=>new Date(b.publishedISO)-new Date(a.publishedISO));
  }, [mockNews, query, category, sort, author, date]);
  function reset() {
    setQuery("");
    setCategory("all");
    setDate("");
    setAuthor("");
    setLimit(10);
  }
  return (
    <main className="site-width">
      <div className="archive-content">
        <h1>{todayOnly ? "আজকের সংবাদ" : "সংবাদ খুঁজুন"}</h1>
        {error && <NewsState error/>}
        <form
          className="search-form"
          onSubmit={(e) => {
            e.preventDefault();
            const url = new URL(location.href);
            query
              ? url.searchParams.set("q", query)
              : url.searchParams.delete("q");
            date ? url.searchParams.set("date", date) : url.searchParams.delete("date");
            history.replaceState(null, "", url);
            setLimit(10);
          }}
        >
          <input
            aria-label="যা খুঁজতে চান"
            placeholder="যা খুঁজতে চান"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(10);
            }}
          />
          <button aria-label="অনুসন্ধান করুন">
            <Search size={25} />
          </button>
        </form>
        <div className="search-filters">
          <label>
            তারিখ
            <input
              type="date"
              aria-label="প্রকাশের তারিখ"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setLimit(10);
              }}
            />
          </label>
          <label>
            লেখক
            <select
              aria-label="লেখক"
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
                setLimit(10);
              }}
            >
              <option value="">সব লেখক</option>
              {[...new Set(mockNews.map((n) => n.author).filter(Boolean))].map(
                (a) => (
                  <option key={a}>{a}</option>
                ),
              )}
            </select>
          </label>
          <label>
            সেকশন
            <select
              aria-label="সেকশন"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setLimit(10);
              }}
            >
              <option value="all">সকল বিভাগ</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="search-summary">
          <span>
            প্রাপ্ত ফলাফল:{" "}
            <strong>{results.length.toLocaleString("bn-BD")}</strong>
          </span>
          <label>
            সাজানো
            <select
              aria-label="সাজানো"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">সর্বশেষ</option>
              {mockNews.some((n)=>n.views !== null) && <option value="popular">সর্বাধিক পঠিত</option>}
            </select>
          </label>
        </div>
        {results.length ? (
          <>
            <div className="archive-results">
              {results.slice(0, limit).map((n) => (
                <NewsCard key={n.id} news={n} variant="list" />
              ))}
            </div>
            {limit < results.length && (
              <div className="load-more">
                <button
                  className="outline-button"
                  onClick={() => setLimit(limit + 10)}
                >
                  আরও সংবাদ
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <h2>কোনো সংবাদ পাওয়া যায়নি</h2>
            <p>অন্য শব্দ দিয়ে খুঁজুন অথবা ফিল্টার পরিবর্তন করুন।</p>
            <button onClick={reset} className="outline-button">
              সব সংবাদ দেখুন
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
function SearchRouteContent({todayOnly}) {
  const params = useSearchParams();
  return <SearchContent key={`${params.get("q") || ""}|${params.get("date") || ""}|${todayOnly}`} todayOnly={todayOnly}/>;
}
export default function Archive({todayOnly = false}) {
  return (
    <>
      <Header />
      <AdSlot />
      <Suspense
        fallback={<main className="site-width empty-state">লোড হচ্ছে…</main>}
      >
        <SearchRouteContent todayOnly={todayOnly} />
      </Suspense>
      <Footer />
    </>
  );
}
