"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Search } from "lucide-react";
import { divisions } from "@/data/locations";
import { mockNews } from "@/data/mockNews";

export default function SamagraBangladeshSection() {
  const router = useRouter();
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");

  const currentDivisionObj = divisions.find((d) => d.name === selectedDivision);
  const currentDistrictObj = currentDivisionObj?.districts.find(
    (dist) => dist.name === selectedDistrict
  );

  const handleFilterSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedDivision) params.set("division", selectedDivision);
    if (selectedDistrict) params.set("district", selectedDistrict);
    if (selectedUpazila) params.set("upazila", selectedUpazila);
    router.push(`/category/samagrabangladesh?${params.toString()}`);
  };

  const regionalNews = mockNews.filter(
    (n) => n.category === "samagrabangladesh" || n.division
  );

  const divisionList = [
    "ঢাকা",
    "চট্টগ্রাম",
    "রাজশাহী",
    "খুলনা",
    "সিলেট",
    "বরিশাল",
    "রংপুর",
    "ময়মনসিংহ",
  ];

  return (
    <section className="my-10 border-t border-gray-200 pt-8">
      {/* Category Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e5252a]"></span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              জেলা ও জনপদ
            </span>
          </div>
          <Link
            href="/category/samagrabangladesh"
            className="text-2xl sm:text-3xl font-black text-gray-950 hover:text-[#e5252a] transition font-serif"
          >
            দেশজুড়ে
          </Link>
        </div>

        {/* Division pill bar */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3 sm:mt-0">
          {divisionList.map((divName) => (
            <Link
              key={divName}
              href={`/category/samagrabangladesh?division=${encodeURIComponent(divName)}`}
              className="text-xs font-medium px-3 py-1 bg-gray-100 hover:bg-red-50 hover:text-[#e5252a] rounded-full transition duration-150"
            >
              {divName}
            </Link>
          ))}
        </div>
      </div>

      {/* Filter Dropdown Strip */}
      <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-700">
          <MapPin size={14} className="text-[#e5252a]" />
          <span>আপনার এলাকার সংবাদ দ্রুত খুঁজুন:</span>
        </div>

        <form onSubmit={handleFilterSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <select
            value={selectedDivision}
            onChange={(e) => {
              setSelectedDivision(e.target.value);
              setSelectedDistrict("");
              setSelectedUpazila("");
            }}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#e5252a]"
          >
            <option value="">বিভাগ নির্বাচন করুন</option>
            {divisions.map((d, i) => (
              <option key={i} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setSelectedUpazila("");
            }}
            disabled={!selectedDivision}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#e5252a] disabled:opacity-50"
          >
            <option value="">জেলা নির্বাচন করুন</option>
            {currentDivisionObj?.districts.map((dist, i) => (
              <option key={i} value={dist.name}>
                {dist.name}
              </option>
            ))}
          </select>

          <select
            value={selectedUpazila}
            onChange={(e) => setSelectedUpazila(e.target.value)}
            disabled={!selectedDistrict}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#e5252a] disabled:opacity-50"
          >
            <option value="">উপজেলা নির্বাচন করুন</option>
            {currentDistrictObj?.upazilas.map((upz, i) => (
              <option key={i} value={upz}>
                {upz}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-[#e5252a] hover:bg-[#c81e23] text-white font-bold py-2 px-4 rounded-lg text-xs transition duration-200 flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Search size={14} />
            <span>অনুসন্ধান</span>
          </button>
        </form>
      </div>

      {/* Regional News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regionalNews.map((news) => (
          <article
            key={news.id}
            className="group bg-white rounded-xl border border-gray-200/80 overflow-hidden shadow-2xs hover:shadow-md transition duration-200 flex flex-col justify-between"
          >
            <div>
              <Link href={`/news/${news.id}`} className="block overflow-hidden">
                <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
              </Link>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-[#e5252a] bg-red-50 px-2 py-0.5 rounded">
                    {news.district || "বাংলাদেশ"}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-[11px] text-gray-500 font-medium">
                    {news.subCategory}
                  </span>
                </div>
                <Link href={`/news/${news.id}`}>
                  <h4 className="text-base font-bold text-gray-900 group-hover:text-[#e5252a] transition line-clamp-2 leading-snug">
                    {news.title}
                  </h4>
                </Link>
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {news.subtitle}
                </p>
              </div>
            </div>
            <div className="px-4 pb-3.5 text-[11px] text-gray-400 border-t border-gray-100 pt-2.5">
              {news.publishedAt}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
