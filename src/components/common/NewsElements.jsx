import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Camera, Play } from "lucide-react";
import PublicAd from "@/components/news/PublicAd";

export function Brand({ english = false, className = "", imgClassName = "" }) {
  return (
    <Link
      href={english ? "/en" : "/"}
      className={`inline-flex items-center justify-center ${className}`}
      aria-label={
        english ? "Jonokollan News home" : "জনকল্যাণ নিউজ — প্রচ্ছদ"
      }
    >
      <Image
        src="/images/jonokollan-news-logo.png"
        alt="জনকল্যাণ নিউজ"
        width={450}
        height={120}
        className={imgClassName || "h-14 sm:h-16 md:h-20 lg:h-22 w-auto object-contain"}
        priority
      />
    </Link>
  );
}
export function AdSlot({ rail = false }) {
  return <PublicAd slot={rail ? "SIDEBAR" : "BANNER_TOP"} />;
}
export function PageHeading({ title, links = [], children }) {
  return (
    <div className="page-heading">
      <h1>{title}</h1>
      {links.length > 0 && (
        <nav aria-label={`${title} বিভাগ`} className="subnav">
          {links.map((l) => (
            <Link key={l.label} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
      )}
      {children}
    </div>
  );
}
export function SectionHeading({ title, href, children }) {
  return (
    <div className="section-heading">
      <h2>
        <Link href={href}>
          {title}
          <ChevronRight size={25} />
        </Link>
      </h2>
      {children}
    </div>
  );
}
export function NewsCard({
  news,
  variant = "standard",
  description = true,
  priority = false,
}) {
  if (!news) return null;
  return (
    <article
      className={`news-card card-${variant} ${!news.image ? "card-text" : ""}`}
    >
      <Link href={`/news/${news.id}`} className="card-link">
        {news.image && (
          <div className="news-image">
            <img
              src={news.image}
              alt={news.title}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
            />
            {(news.videoUrl || news.mediaType === "video") && (
              <span className="media-badge">
                <Play size={18} fill="currentColor" />
              </span>
            )}
            {news.photos && (
              <span className="media-badge">
                <Camera size={18} />
              </span>
            )}
          </div>
        )}
        <div className="card-copy">
          <h3>
            {news.isLive && <span className="live-label">সরাসরি • </span>}
            {news.title}
          </h3>
          {description && news.subtitle && (
            <p className="card-description">{news.subtitle}</p>
          )}
          <time>{news.publishedAt}</time>
        </div>
      </Link>
    </article>
  );
}
export function MostRead({ title = "সর্বশেষ সংবাদ", articles = [] }) {
  const list = [...articles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);
  return (
    <section className="most-read">
      <h2>{title}</h2>
      {list.map((n, i) => (
        <Link href={`/news/${n.id}`} key={n.id}>
          <span>{(i + 1).toLocaleString("bn-BD")}</span>
          <h3>{n.title}</h3>
        </Link>
      ))}
    </section>
  );
}
