"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, X } from "lucide-react";

const tubeVideos = [
  {
    id: "tube-main",
    title: "নারায়ণগঞ্জে শ্রমিক-পুলিশ ধাওয়া-পাল্টা ধাওয়া",
    subtitle: "ন্যূনতম মাসিক মজুরি ৩০ হাজার টাকা নির্ধারণের দাবি আদায়ে টানা তৃতীয় দিনের মতো সড়কে নেমেছেন নারায়ণগঞ্জের ফতুল্লার কয়েকটি পোশাক কারখানার শ্রমিকরা। বুধবার সকাল ১০টার দিকে ঢাকা-নারায়ণগঞ্জ সংযোগ সড়কের পাশে কুতুবআইল কাঠেরপুল এলাকায় জড়ো হয়ে বিক্ষোভ শুরু করেন শ্রমিকরা।",
    image: "https://images.unsplash.com/photo-1579208575657-c595a05383b7?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "tube-1",
    title: "সাভারে মহাসড়ক অবরোধ, শ্রমিক-পুলিশ সংঘর্ষ",
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "tube-2",
    title: "যুক্তরাষ্ট্রের মধ্যবর্তী নির্বাচন: কংগ্রেসের নিয়ন্ত্রণ নিয়ে লড়াই চলছে",
    image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "tube-3",
    title: "‘ধর্মীয় চিন্তা থেকে সংবিধান সংশোধন নয়’",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "tube-4",
    title: "বাংলাদেশ-চীন মৈত্রী সম্মেলন কেন্দ্রে শুরু সোলার এক্সপো",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "tube-5",
    title: "সংবিধান সংশোধনে অন্তর্ভুক্তিমূলক ব্যবস্থা চান সারা হোসেন",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "tube-6",
    title: "নারায়ণগঞ্জে পুলিশ-শ্রমিক সংঘর্ষ, ধাওয়া-পাল্টা ধাওয়া",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  }
];

export default function TubeVideoSection() {
  const [activeVideo, setActiveVideo] = useState(null);
  const mainVideo = tubeVideos[0];
  const sideVideos = tubeVideos.slice(1);

  return (
    <section className="my-8 bg-[#111827] text-white p-4 sm:p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between border-b border-gray-700 pb-3 mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-[#e5252a] rounded flex items-center justify-center">
            <Play size={14} fill="white" className="ml-0.5" />
          </div>
          <Link
            href="/tube"
            className="text-2xl font-black text-white hover:text-red-500 transition"
          >
            জনকল্যাণ টিউব ও ভিডিও
          </Link>
        </div>
        <Link
          href="/tube"
          className="text-xs font-bold text-red-500 hover:text-red-300 hover:underline"
        >
          সব ভিডিও দেখুন →
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Video (Left 8 Cols) */}
        <div className="lg:col-span-8">
          <div
            className="relative aspect-[16/9] w-full overflow-hidden bg-black cursor-pointer group rounded"
            onClick={() => setActiveVideo(mainVideo)}
          >
            <img
              src={mainVideo.image}
              alt={mainVideo.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            {/* Top-left brand watermark */}
            <div className="absolute top-3 left-3 flex items-center bg-black/70 px-2.5 py-1 rounded backdrop-blur-sm">
              <div className="w-5 h-5 bg-[#e5252a] rounded flex items-center justify-center mr-1.5">
                <Play size={10} fill="white" className="ml-0.5" />
              </div>
              <span className="text-white text-xs font-bold tracking-tight">জনকল্যাণ নিউজ</span>
            </div>

            {/* Bottom Yellow Caption Overlay on Video */}
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <span className="text-xl sm:text-2xl font-black text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-tight">
                {mainVideo.title}
              </span>
            </div>
          </div>

          {/* Title & Brief below Main Video */}
          <div className="pt-4 space-y-2">
            <h3
              onClick={() => setActiveVideo(mainVideo)}
              className="text-lg sm:text-xl font-bold text-white hover:text-red-500 cursor-pointer transition leading-snug"
            >
              {mainVideo.title}
            </h3>
            <p className="text-xs sm:text-[13px] text-gray-300 leading-relaxed">
              {mainVideo.subtitle}
            </p>
          </div>
        </div>

        {/* Side Playlist (Right 4 Cols) */}
        <div className="lg:col-span-4 divide-y divide-gray-700/60">
          {sideVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group cursor-pointer hover:bg-white/5 px-2 rounded transition"
            >
              <h4 className="text-xs sm:text-[13px] font-semibold text-white group-hover:text-red-300 leading-snug line-clamp-2 flex-1">
                {video.title}
              </h4>
              <div className="relative w-24 h-14 shrink-0 overflow-hidden rounded bg-black/40">
                <img
                  src={video.image}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-4 bg-[#e5252a] rounded flex items-center justify-center">
                    <Play size={8} fill="white" className="ml-0.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded max-w-3xl w-full overflow-hidden shadow-2xl">
            <div className="p-3 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white truncate pr-4">
                {activeVideo.title}
              </h3>
              <button
                onClick={() => setActiveVideo(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="aspect-[16/9] bg-black">
              <iframe
                src={`${activeVideo.videoUrl}?autoplay=1`}
                title={activeVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
