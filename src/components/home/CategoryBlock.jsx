import Link from "next/link";
import { Clock } from "lucide-react";

export default function CategoryBlock({
  title,
  href,
  leadStory,
  middleStories = [],
  sideStories = [],
}) {
  if (!leadStory) return null;

  return (
    <section className="my-8 pt-4 border-t border-gray-200">
      {/* Category Section Header (Dhaka Tribune Style: Gray Baseline + Thick Brand Red Bar) */}
      <div className="flex items-center justify-between border-b border-gray-200 mb-5 pb-0">
        <h2 className="text-xl sm:text-2xl font-black text-gray-950 border-b-2 border-[#e5252a] pb-1.5 -mb-px inline-block">
          <Link href={href} className="hover:text-[#e5252a] transition">
            {title}
          </Link>
        </h2>
        <Link
          href={href}
          className="text-xs font-bold text-[#e5252a] hover:underline"
        >
          আরও পড়ুন →
        </Link>
      </div>

      {/* Dhaka Tribune 3-Part Category Grid (50% Lead | 25% Middle | 25% Quick List) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">

        {/* Left Column (50% / 6 cols): Primary Category Lead */}
        <div className="lg:col-span-6 lg:pr-6 pb-5 lg:pb-0">
          <article className="group">
            <Link href={`/news/${leadStory.id}`} className="block overflow-hidden rounded-xs mb-3">
              <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100">
                <img
                  src={leadStory.image || "/images/robi-dakua.png"}
                  alt={leadStory.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-300"
                />
              </div>
            </Link>
            <Link href={`/news/${leadStory.id}`}>
              <h3 className="text-xl sm:text-2xl font-black text-gray-950 group-hover:text-[#e5252a] transition leading-snug line-clamp-2">
                {leadStory.title}
              </h3>
            </Link>
            {leadStory.subtitle && (
              <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                {leadStory.subtitle}
              </p>
            )}
            <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-2 font-medium">
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {leadStory.publishedAt || "আজ প্রকাশিত"}
              </span>
            </div>
          </article>
        </div>

        {/* Middle Column (25% / 3 cols): 2 Stacked Stories */}
        <div className="lg:col-span-3 lg:px-5 py-5 lg:py-0 space-y-4">
          {middleStories.map((story, idx) => (
            <article key={story.id} className={`group ${idx > 0 ? "pt-4 border-t border-gray-150" : ""}`}>
              <Link href={`/news/${story.id}`} className="block overflow-hidden rounded-xs mb-2">
                <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100">
                  <img
                    src={story.image || "/images/skincare.jpg"}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
              </Link>
              <Link href={`/news/${story.id}`}>
                <h4 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#e5252a] transition leading-snug line-clamp-2">
                  {story.title}
                </h4>
              </Link>
              <span className="text-[11px] text-gray-400 mt-1 block">
                {story.publishedAt || "কিছুক্ষণ আগে"}
              </span>
            </article>
          ))}
        </div>

        {/* Right Column (25% / 3 cols): Quick News List */}
        <div className="lg:col-span-3 lg:pl-5 pt-5 lg:pt-0 space-y-3">
          {sideStories.map((story, idx) => (
            <article key={story.id} className={`group ${idx > 0 ? "pt-3 border-t border-gray-150" : ""}`}>
              <Link href={`/news/${story.id}`}>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#e5252a] transition leading-snug line-clamp-2">
                  {story.title}
                </h4>
              </Link>
              <span className="text-[10px] text-gray-400 mt-1 block">
                {story.publishedAt || "আজ প্রকাশিত"}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
