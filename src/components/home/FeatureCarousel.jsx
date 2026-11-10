"use client";

import Link from "next/link";
import { Sparkles, ChevronRight } from "lucide-react";
import { mockNews } from "@/data/mockNews";

export default function FeatureCarousel() {
  const items = [
    mockNews.find((n) => n.id === "tech-1") || mockNews[0],
    mockNews.find((n) => n.id === "lifestyle-1") || mockNews[1],
    mockNews.find((n) => n.id === "sport-1") || mockNews[2],
    mockNews.find((n) => n.id === "photo-1") || mockNews[3],
  ];

  return (
    <section className="my-10 bg-gray-50/70 border border-gray-200/70 rounded-2xl p-6">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center text-[#e5252a]">
            <Sparkles size={16} />
          </div>
          <h2 className="text-xl font-black text-gray-950 font-serif">
            আজকের বিশেষ প্রতিবেদন
          </h2>
        </div>
        <Link
          href="/archive"
          className="text-xs font-bold text-[#e5252a] hover:underline flex items-center gap-1"
        >
          সব বিশেষ প্রতিবেদন <ChevronRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item) => (
          <article
            key={item.id}
            className="group bg-white rounded-xl border border-gray-200/80 overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition duration-200 flex flex-col justify-between"
          >
            <div>
              <Link href={`/news/${item.id}`} className="block overflow-hidden">
                <div className="aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
              </Link>
              <div className="p-3.5">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#e5252a] bg-red-50 px-2 py-0.5 rounded mb-1.5">
                  {item.categoryLabel || item.subCategory || "ফিচার"}
                </span>
                <Link href={`/news/${item.id}`}>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#e5252a] transition leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                </Link>
              </div>
            </div>
            <div className="px-3.5 pb-3 text-[11px] text-gray-400">
              {item.publishedAt}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
