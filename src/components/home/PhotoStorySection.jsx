import Link from "next/link";
import { Camera } from "lucide-react";
import { mockNews } from "@/data/mockNews";

export default function PhotoStorySection() {
  const photoStories = [
    ...mockNews.filter((n) => n.category === "photostory" || n.photos),
    ...mockNews.filter((n) => n.image && n.category !== "photostory").slice(0, 2),
  ].slice(0, 3);

  return (
    <section className="my-10 border-t border-gray-200 pt-8">
      <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-6">
        <div className="flex items-center space-x-2">
          <Camera className="text-[#e5252a]" size={24} />
          <Link
            href="/photostory"
            className="text-2xl font-black text-gray-900 border-b-2 border-[#e5252a] pb-1 hover:text-[#e5252a] transition"
          >
            ছবির গল্প
          </Link>
        </div>
        <Link
          href="/photostory"
          className="text-xs font-bold text-[#e5252a] hover:underline"
        >
          সব ছবির গল্প দেখুন →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photoStories.map((story) => (
          <div
            key={story.id}
            className="group relative rounded-lg overflow-hidden bg-black shadow-md"
          >
            <Link href={`/news/${story.id}`}>
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90 group-hover:opacity-100"
                />
              </div>

              {/* Photo count badge */}
              <div className="absolute top-3 right-3 bg-black/75 text-white px-2 py-1 rounded text-xs flex items-center space-x-1 font-bold">
                <Camera size={14} />
                <span>{story.photoCount || 8}টি ছবি</span>
              </div>

              {/* Caption Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4 text-white">
                <span className="text-[11px] font-bold text-red-500 block mb-1">
                  {story.subCategory}
                </span>
                <h4 className="text-base font-bold leading-snug group-hover:text-red-300 transition">
                  {story.title}
                </h4>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
