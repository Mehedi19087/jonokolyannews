"use client";

import Link from "next/link";
import { mockNews } from "@/data/mockNews";
import { Quote, Feather } from "lucide-react";

export default function OpinionSection() {
  const opinionStories = mockNews.filter((n) => n.category === "opinion");
  const robiStory =
    opinionStories.find((n) => n.author.includes("রবি ডাকুয়া")) ||
    opinionStories[0];

  return (
    <section className="my-10 bg-[#faf9f5] border border-[#e8e6df] rounded-2xl p-6 sm:p-8">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[#e5e3dc] pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-100/70 text-[#e5252a] flex items-center justify-center">
            <Feather size={18} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-950 font-serif">
              মতামত ও সম্পাদকীয়
            </h2>
            <p className="text-xs text-gray-500">
              বস্তুনিষ্ঠ বিশ্লেষণ, মুক্তচিন্তা ও গভীর দৃষ্টিভঙ্গি
            </p>
          </div>
        </div>
        <Link
          href="/category/opinion"
          className="text-xs font-bold text-[#e5252a] hover:underline"
        >
          সকল মতামত পড়ুন →
        </Link>
      </div>

      {/* Featured Lead Columnist */}
      {robiStory && (
        <div className="bg-white rounded-xl border border-[#e5e3dc] p-6 mb-6 shadow-2xs hover:shadow-md transition duration-300">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-3 border-[#e5252a] mb-3 shadow-xs">
                <img
                  src={robiStory.authorImage}
                  alt={robiStory.author}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-gray-950 text-lg font-serif">
                {robiStory.author}
              </h3>
              <p className="text-xs text-[#e5252a] font-semibold mt-0.5">
                {robiStory.authorTitle}
              </p>
              <span className="mt-2.5 inline-block bg-red-50 text-[#e5252a] text-[11px] font-bold px-3 py-0.5 rounded-full border border-red-100">
                নিয়মিত কলাম
              </span>
            </div>

            <div className="md:col-span-8 space-y-3 relative">
              <Quote className="absolute -top-3 -right-1 text-gray-150 w-12 h-12 -z-0 opacity-40" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
                রবি ডাকুয়ার দৃষ্টিতে
              </span>
              <Link href={`/news/${robiStory.id}`} className="block group">
                <h4 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-[#e5252a] transition leading-snug font-serif">
                  {robiStory.title}
                </h4>
              </Link>
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed italic">
                &ldquo;{robiStory.subtitle}&rdquo;
              </p>
              <div className="text-xs text-gray-400 pt-2 flex items-center justify-between">
                <span>{robiStory.publishedAt}</span>
                <Link
                  href={`/news/${robiStory.id}`}
                  className="text-xs font-bold text-[#e5252a] hover:underline"
                >
                  সম্পূর্ণ কলাম পড়ুন →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3 Secondary Opinion Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-[#e5e3dc] shadow-2xs hover:shadow-sm transition">
          <span className="inline-block text-[11px] font-bold text-[#e5252a] uppercase tracking-wider mb-2">
            সম্পাদকীয়
          </span>
          <h4 className="text-sm font-bold text-gray-900 hover:text-[#e5252a] cursor-pointer leading-snug">
            মজুরি কমিশন বাস্তবায়ন ও পোশাক খাতের টেকসই সমাধান
          </h4>
          <p className="text-xs text-gray-500 mt-2">জনকল্যাণ সম্পাদকীয় বিভাগ</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#e5e3dc] shadow-2xs hover:shadow-sm transition">
          <span className="inline-block text-[11px] font-bold text-[#e5252a] uppercase tracking-wider mb-2">
            বিশ্লেষণ
          </span>
          <h4 className="text-sm font-bold text-gray-900 hover:text-[#e5252a] cursor-pointer leading-snug">
            নভেম্বর বিপ্লব ও বাংলাদেশের ভবিষ্যৎ রাজনীতির দিকনির্দেশনা
          </h4>
          <p className="text-xs text-gray-500 mt-2">ড. আসিফ মাহমুদ</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#e5e3dc] shadow-2xs hover:shadow-sm transition">
          <span className="inline-block text-[11px] font-bold text-[#e5252a] uppercase tracking-wider mb-2">
            পরিবেশ ও সমাজ
          </span>
          <h4 className="text-sm font-bold text-gray-900 hover:text-[#e5252a] cursor-pointer leading-snug">
            উপকূলীয় জলবায়ু পরিবর্তন: বাঁধ নয়, দরকার দীর্ঘমেয়াদি সুরক্ষা
          </h4>
          <p className="text-xs text-gray-500 mt-2">তানভীর হাসান</p>
        </div>
      </div>
    </section>
  );
}
