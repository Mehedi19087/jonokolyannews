"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  Home,
  Menu,
  Search,
  X,
} from "lucide-react";
import {
  FacebookIcon,
  TwitterIcon,
  YoutubeIcon,
  LinkedinIcon,
  PinterestIcon,
} from "./SocialIcons";
import { useNews } from "@/components/news/NewsProvider";
import { Brand } from "./NewsElements";
import { navigationItems, categoryHref } from "@/lib/navigation";

export default function Header({ english = false }) {
  const { categories, articles, dateLabel } = useNews();
  const navItems = navigationItems(categories);
  const [panel, setPanel] = useState(null);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const closeRef = useRef(null);

  useEffect(() => {
    if (!panel) return;
    const previous = document.activeElement;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const keys = (e) => {
      if (e.key === "Escape") setPanel(null);
      if (e.key === "Tab") {
        const els = [
          ...document.querySelectorAll(
            ".header-panel button,.header-panel a,.header-panel input",
          ),
        ].filter((el) => el.offsetParent !== null);
        const first = els[0],
          last = els.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", keys);
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener("keydown", keys);
      previous?.focus();
    };
  }, [panel]);

  const results = query.trim()
    ? articles
        .filter((n) =>
          `${n.title} ${n.subtitle || ""}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        )
        .slice(0, 5)
    : [];

  function submit(e) {
    e.preventDefault();
    setPanel(null);
    router.push(`/archive?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="news-site-header bg-white border-b border-gray-200">
      {/* Utility bar */}
      <div className="bg-[#e9ebee] border-b border-[#d8d8d8] text-xs text-gray-800 py-1.5">
        <div className="site-width flex items-center justify-between">
          {/* Left: Calendar Icon + Bengali Date */}
          <div className="flex items-center gap-2 font-medium text-gray-900">
            <Calendar size={14} className="text-gray-700 shrink-0" />
            <span className="font-semibold tracking-wide">
              {dateLabel}
            </span>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            {/* Social Icons Strip */}
            <div className="flex items-center gap-2.5 text-gray-700">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="hover:text-[#1877f2] transition"
              >
                <FacebookIcon size={14} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="hover:text-black transition"
              >
                <TwitterIcon size={13} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="hover:text-[#ff0000] transition"
              >
                <YoutubeIcon size={15} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="hover:text-[#0077b5] transition"
              >
                <LinkedinIcon size={13} />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Pinterest"
                className="hover:text-[#bd081c] transition"
              >
                <PinterestIcon size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Compact centered masthead */}
      <div className="site-width pt-1 pb-3 flex justify-center items-center">
        <Brand
          english={english}
          imgClassName="h-16 sm:h-18 md:h-20 w-auto object-contain hover:opacity-95 transition"
        />
      </div>

      {/* Category navigation */}
      <nav
        aria-label="প্রধান নেভিগেশন"
        className="border-t border-b border-gray-200 bg-white"
      >
        <div className="site-width flex items-center justify-between">
          {/* Left Home Icon + Category Menu Links */}
          <div className="news-nav-links flex items-center lg:justify-between overflow-x-auto scrollbar-none py-1.5 gap-3 lg:gap-2 xl:gap-2.5 flex-1 min-w-0 pr-3">
            {/* Home Icon (Solid / Filled) */}
            <Link
              href={english ? "/en" : "/"}
              className={`text-gray-900 hover:text-[#e5252a] transition shrink-0 p-1 ${
                pathname === "/" || pathname === "/en" ? "text-[#e5252a]" : ""
              }`}
              aria-label="হোমপেজ"
            >
              <Home size={19} className="fill-current" />
            </Link>

            {/* Category Navigation Links */}
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-lg sm:text-xl leading-normal font-bold whitespace-nowrap transition shrink-0 ${
                    isActive
                      ? "text-[#e5252a]"
                      : "text-gray-900 hover:text-[#e5252a]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Icons: Hamburger Menu + Search */}
          <div className="news-nav-actions flex items-center gap-1.5 shrink-0 pl-3 border-l border-gray-200 text-gray-800">
            <button
              onClick={() => setPanel("menu")}
              aria-label="সকল বিভাগ"
              title="সকল বিভাগ"
              className="p-1.5 rounded hover:bg-gray-100 hover:text-[#e5252a] transition"
            >
              <Menu size={21} />
            </button>
            <button
              onClick={() => setPanel("search")}
              aria-label="খবর খুঁজুন"
              title="অনুসন্ধান"
              className="p-1.5 rounded hover:bg-gray-100 hover:text-[#e5252a] transition"
            >
              <Search size={19} />
            </button>
          </div>
        </div>
      </nav>

      {/* Side Menu / Search Modal */}
      {panel && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-start"
          onClick={() => setPanel(null)}
        >
          <section
            className="header-panel w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label={panel === "search" ? "খবর অনুসন্ধান" : "সকল বিভাগ"}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
              <Brand english={english} imgClassName="h-12 w-auto object-contain" />
              <button
                ref={closeRef}
                onClick={() => setPanel(null)}
                aria-label="বন্ধ করুন"
                className="p-1 rounded-full hover:bg-gray-100 text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {panel === "search" ? (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">অনুসন্ধান</h2>
                <form onSubmit={submit} className="flex gap-2 mb-4">
                  <input
                    aria-label="খবর খুঁজুন"
                    placeholder="কী খুঁজছেন লিখুন..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e5252a]"
                    autoFocus
                  />
                  <button
                    type="submit"
                    aria-label="অনুসন্ধান করুন"
                    className="bg-[#e5252a] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#c81e23] transition"
                  >
                    <Search size={18} />
                  </button>
                </form>

                <div className="space-y-2 mt-4">
                  {results.map((n) => (
                    <Link
                      key={n.id}
                      href={`/news/${n.id}`}
                      onClick={() => setPanel(null)}
                      className="block p-2.5 rounded-lg hover:bg-gray-50 text-sm font-semibold text-gray-900 border-b border-gray-100 hover:text-[#e5252a]"
                    >
                      {n.title}
                    </Link>
                  ))}
                  {query && !results.length && (
                    <p className="text-xs text-gray-500 py-4 text-center">
                      কোনো সংবাদ পাওয়া যায়নি। অন্য কোনো শব্দ দিয়ে খুঁজুন।
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-base font-bold uppercase tracking-wider mb-4 text-[#e5252a]">
                  সকল বিভাগ
                </h2>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {categories.map((c) => (
                    <div key={c.id} className="space-y-1">
                      <Link
                        href={categoryHref(c.slug)}
                        onClick={() => setPanel(null)}
                        className="font-bold text-sm text-gray-900 hover:text-[#e5252a] block"
                      >
                        {c.name}
                      </Link>
                      {c.subcategories?.slice(0, 3).map((s) => (
                        <Link
                          key={s}
                          href={`/category/${c.slug}?sub=${encodeURIComponent(s)}`}
                          onClick={() => setPanel(null)}
                          className="block text-xs text-gray-600 hover:text-[#e5252a]"
                        >
                          {s}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-200 flex flex-col gap-2.5 text-sm font-semibold text-gray-700">
                  <Link
                    href="/archive"
                    onClick={() => setPanel(null)}
                    className="hover:text-[#e5252a]"
                  >
                    সর্বশেষ সংবাদ
                  </Link>
                  <Link
                    href="/photostory"
                    onClick={() => setPanel(null)}
                    className="hover:text-[#e5252a]"
                  >
                    ছবি গ্যালারি
                  </Link>
                  <Link
                    href="/tube"
                    onClick={() => setPanel(null)}
                    className="hover:text-[#e5252a]"
                  >
                    ভিডিও সংবাদ
                  </Link>
                  <Link
                    href="/newstoday"
                    onClick={() => setPanel(null)}
                    className="hover:text-[#e5252a] font-bold text-[#e5252a]"
                  >
                    আজকের সংবাদ
                  </Link>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </header>
  );
}
