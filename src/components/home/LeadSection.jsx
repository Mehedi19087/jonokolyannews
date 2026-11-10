"use client";

import Link from "next/link";
import { mockNews } from "@/data/mockNews";
import { Clock } from "lucide-react";

export default function LeadSection() {
  const leadStory = mockNews.find((n) => n.id === "lead-1") || mockNews[0];

  // Left column: 2 stories
  const leftStories = [
    mockNews.find((n) => n.id === "lead-sub-1") || mockNews[1],
    mockNews.find((n) => n.id === "lead-sub-2") || mockNews[2],
  ].filter(Boolean);

  // Right column: 2 stories
  const rightStories = [
    mockNews.find((n) => n.id === "lead-sub-3") || mockNews[3],
    mockNews.find((n) => n.id === "text-news-1") || mockNews[4],
  ].filter(Boolean);

  // Sub-hero strip: 4 stories directly underneath
  const subHeroStrip = [
    mockNews.find((n) => n.id === "text-news-2") || mockNews[5],
    mockNews.find((n) => n.id === "text-news-3") || mockNews[6],
    mockNews.find((n) => n.id === "text-news-4") || mockNews[7],
    mockNews.find((n) => n.id === "text-news-5") || mockNews[8],
  ].filter(Boolean);

  return (
    <section className="py-4 md:py-6 border-b border-gray-200">
      {/* 1. Dhaka Tribune Signature 3-Column Lead Grid (25% | 50% | 25%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">

        {/* Left Column (25% / 3 cols): 2 Stacked Stories */}
        <div className="lg:col-span-3 lg:pr-5 pb-5 lg:pb-0 space-y-5">
          {leftStories.map((story, idx) => (
            <article key={story.id} className={`group ${idx > 0 ? "pt-5 border-t border-gray-200" : ""}`}>
              <Link href={`/news/${story.id}`} className="block overflow-hidden rounded-xs mb-2.5">
                <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100">
                  <img
                    src={story.image || "/images/robi-dakua.png"}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
              </Link>
              <Link href={`/news/${story.id}`}>
                <h2 className="text-base sm:text-lg font-bold text-gray-950 group-hover:text-[#e5252a] transition leading-snug line-clamp-3">
                  {story.title}
                </h2>
              </Link>
              {story.subtitle && (
                <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                  {story.subtitle}
                </p>
              )}
              <span className="text-[11px] text-gray-400 mt-2 block font-medium">
                {story.publishedAt || "কিছুক্ষণ আগে"}
              </span>
            </article>
          ))}
        </div>

        {/* Center Column (50% / 6 cols): Primary Lead News Story */}
        <div className="lg:col-span-6 lg:px-6 py-5 lg:py-0">
          <article className="group">
            <Link href={`/news/${leadStory.id}`} className="block overflow-hidden rounded-xs mb-3.5">
              <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100 relative">
                <img
                  src={leadStory.image}
                  alt={leadStory.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500"
                />
                {leadStory.photoCredit && (
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] px-2 py-0.5 rounded backdrop-blur-xs font-sans">
                    ছবি: {leadStory.photoCredit}
                  </span>
                )}
              </div>
            </Link>

            <div className="space-y-2.5">
              <Link href={`/news/${leadStory.id}`}>
                <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-gray-950 group-hover:text-[#e5252a] transition duration-200 leading-[1.25]">
                  {leadStory.title}
                </h1>
              </Link>

              <p className="text-gray-700 text-sm sm:text-base leading-relaxed line-clamp-3 font-normal">
                {leadStory.subtitle}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
                <span className="text-[#e5252a] font-bold">
                  {leadStory.categoryLabel || "প্রধান সংবাদ"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {leadStory.publishedAt || "আজ প্রকাশিত"}
                </span>
              </div>
            </div>
          </article>
        </div>

        {/* Right Column (25% / 3 cols): 2 Stacked Stories */}
        <div className="lg:col-span-3 lg:pl-5 pt-5 lg:pt-0 space-y-5">
          {rightStories.map((story, idx) => (
            <article key={story.id} className={`group ${idx > 0 ? "pt-5 border-t border-gray-200" : ""}`}>
              <Link href={`/news/${story.id}`} className="block overflow-hidden rounded-xs mb-2.5">
                <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100">
                  <img
                    src={story.image || "/images/skincare.jpg"}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
              </Link>
              <Link href={`/news/${story.id}`}>
                <h2 className="text-base sm:text-lg font-bold text-gray-950 group-hover:text-[#e5252a] transition leading-snug line-clamp-3">
                  {story.title}
                </h2>
              </Link>
              {story.subtitle && (
                <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                  {story.subtitle}
                </p>
              )}
              <span className="text-[11px] text-gray-400 mt-2 block font-medium">
                {story.publishedAt || "কিছুক্ষণ আগে"}
              </span>
            </article>
          ))}
        </div>
      </div>

      {/* 2. Dhaka Tribune Sub-Hero 4-Column Strip */}
      <div className="mt-6 pt-5 border-t border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
          {subHeroStrip.map((item, index) => (
            <article
              key={item.id}
              className={`group flex sm:flex-col gap-3 sm:gap-2.5 ${
                index > 0 ? "pt-3 sm:pt-0 sm:pl-5" : ""
              }`}
            >
              <Link
                href={`/news/${item.id}`}
                className="w-28 sm:w-full shrink-0 overflow-hidden rounded-xs"
              >
                <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100">
                  <img
                    src={item.image || "/images/skincare.jpg"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
              </Link>
              <div className="flex-1">
                <Link href={`/news/${item.id}`}>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#e5252a] transition leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                </Link>
                <span className="text-[11px] text-gray-400 mt-1.5 block">
                  {item.publishedAt || "আজ প্রকাশিত"}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
