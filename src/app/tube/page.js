"use client";
import { useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import {
  AdSlot,
  PageHeading,
  NewsCard,
  SectionHeading,
} from "@/components/common/NewsElements";
import { useNews } from "@/components/news/NewsProvider";
import NewsState from "@/components/news/NewsState";
import VideoPlayer from "@/components/news/VideoPlayer";
export default function VideoPage() {
  const {articles:mockNews,error} = useNews();
  const [active, setActive] = useState(null);
  const [tab, setTab] = useState("সব ভিডিও");
  const closeRef = useRef(null);
  const videos = mockNews.filter((n) => n.videoUrl || n.mediaType === "video");
  const filtered = videos.filter(
    (n) => tab === "সব ভিডিও" || n.categoryLabel === tab,
  );
  const lead = filtered[0];
  const tabs = ["সব ভিডিও", ...new Set(videos.map((n) => n.categoryLabel).filter(Boolean))];
  useEffect(() => {
    if (!active) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const key = (e) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [active]);
  return (
    <>
      <Header />
      <AdSlot />
      <main>
        <div className="site-width">
          {error && <NewsState error/>}
          <PageHeading title="ভিডিও">
            <nav className="media-tabs" aria-label="ভিডিও বিভাগ">
              {tabs.map((t) => (
                <button
                  key={t}
                  aria-pressed={t === tab}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}
            </nav>
          </PageHeading>
        </div>
        <section className="video-stage-shell">
          <div className="site-width video-stage">
            {lead ? (
              <button
                className="video-feature"
                onClick={() => setActive(lead)}
                aria-label={`ভিডিও দেখুন: ${lead.title}`}
              >
                <div className="news-image">
                  <img src={lead.image} alt={lead.title} fetchPriority="high" />
                  <span className="play-circle">
                    <Play size={23} fill="currentColor" />
                  </span>
                  <span className="video-duration">{lead.duration}</span>
                </div>
                <h2>{lead.title}</h2>
                <p>{lead.subtitle}</p>
              </button>
            ) : (
              <div className="empty-state">এই বিভাগে ভিডিও নেই</div>
            )}
            <aside className="video-playlist">
              <h2>ভিডিওর সঙ্গে আরও সংবাদ</h2>
              {mockNews
                .filter((n) => n.image && n.id !== lead?.id)
                .slice(0, 3)
                .map((n) => (
                  <NewsCard
                    key={n.id}
                    news={n}
                    variant="compact"
                    description={false}
                  />
                ))}
            </aside>
          </div>
        </section>
        <section className="site-width media-list">
          <SectionHeading title="সব ভিডিও" href="/tube" />
          <div className="three-columns">
            {filtered.map((v) => (
              <button
                key={v.id}
                className="video-feature"
                onClick={() => setActive(v)}
              >
                <div className="news-image">
                  <img src={v.image} alt={v.title} />
                  <span className="play-circle">
                    <Play size={20} fill="currentColor" />
                  </span>
                </div>
                <h2>{v.title}</h2>
              </button>
            ))}
          </div>
        </section>
      </main>
      {active && (
        <div
          className="video-player-modal"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={() => setActive(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <div className="video-player-header">
              <h2>{active.title}</h2>
              <button
                ref={closeRef}
                aria-label="ভিডিও বন্ধ করুন"
                onClick={() => setActive(null)}
              >
                <X />
              </button>
            </div>
            {active.videoUrl ? (
              <VideoPlayer key={active.videoUrl} url={active.videoUrl} title={active.title} poster={active.image} autoPlay/>
            ) : (
              <div className="video-unavailable">
                <img src={active.image} alt={active.title} />
                <p>এই প্রতিবেদনের ভিডিও এখনো প্রকাশ করা হয়নি।</p>
              </div>
            )}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
