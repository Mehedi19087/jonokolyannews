import Link from "next/link";

export default function EditorialStory({story, variant = "card", summary = false, priority = false}) {
  if (!story) return null;
  return <article className={`journal-story journal-story-${variant}`}>
    <Link href={`/news/${encodeURIComponent(story.id)}`} className="journal-story-link">
      {story.image && <div className="journal-image"><img src={story.image} alt={story.title} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} /></div>}
      <div className="journal-copy">
        <span className="journal-kicker">{story.categoryLabel}</span>
        <h3>{story.title}</h3>
        {summary && story.subtitle && <p>{story.subtitle}</p>}
        <time dateTime={story.publishedISO}>{story.publishedAt}</time>
      </div>
    </Link>
  </article>;
}
