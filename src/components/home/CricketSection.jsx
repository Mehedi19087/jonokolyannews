import Link from "next/link";

const cricketNews = {
  main: {
    id: "cricket-main",
    title: "পাকিস্তানের বিপক্ষে ঐতিহাসিক টেস্ট জয় বাংলাদেশের",
    subtitle: "রাওয়ালপিন্ডিতে দ্বিতীয় টেস্টেও স্বাগতিকদের ৬ উইকেটে হারিয়ে প্রথমবারের মতো টেস্ট সিরিজ জয় করল টাইগাররা।",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1000&q=80"
  },
  side1: {
    id: "cricket-side-1",
    title: "দ্রুততম ফিফটির বিশ্বরেকর্ড",
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80"
  },
  side2: {
    id: "cricket-side-2",
    title: "নেপালে সাইফের ৭১, ব্যাটিংয়ে দুর্দান্ত প্রত্যাবর্তন",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80"
  }
};

export default function CricketSection() {
  return (
    <section className="my-8">
      {/* Category Title with red underline */}
      <div className="border-b border-gray-200 mb-4 pb-1">
        <Link
          href="/category/sport"
          className="text-xl sm:text-2xl font-black text-gray-900 border-b-2 border-[#e5252a] pb-1.5 inline-block hover:text-[#e5252a] transition"
        >
          ক্রিকেট
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Cricket Story (Left 7 Cols) */}
        <div className="lg:col-span-7">
          <Link href={`/news/${cricketNews.main.id}`} className="group block">
            <div className="aspect-[16/10] overflow-hidden bg-gray-100 mb-2.5">
              <img
                src={cricketNews.main.image}
                alt={cricketNews.main.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-[#e5252a] transition leading-snug">
              {cricketNews.main.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1.5 leading-relaxed">
              {cricketNews.main.subtitle}
            </p>
          </Link>
        </div>

        {/* 2 Side Cards (Right 5 Cols) */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <Link href={`/news/${cricketNews.side1.id}`} className="group block">
            <div className="aspect-[4/3] overflow-hidden bg-gray-100 mb-2">
              <img
                src={cricketNews.side1.image}
                alt={cricketNews.side1.title}
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#e5252a] transition leading-snug line-clamp-2">
              {cricketNews.side1.title}
            </h4>
          </Link>

          <Link href={`/news/${cricketNews.side2.id}`} className="group block">
            <div className="aspect-[4/3] overflow-hidden bg-gray-100 mb-2">
              <img
                src={cricketNews.side2.image}
                alt={cricketNews.side2.title}
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#e5252a] transition leading-snug line-clamp-2">
              {cricketNews.side2.title}
            </h4>
          </Link>
        </div>
      </div>
    </section>
  );
}
