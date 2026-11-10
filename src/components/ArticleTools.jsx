"use client";
import { useState, useSyncExternalStore } from "react";
import { Share2, Printer, Bookmark, Check, Minus, Plus } from "lucide-react";
import { FacebookIcon, TwitterIcon, WhatsAppIcon } from "./common/SocialIcons";

function subscribe(callback) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export default function ArticleTools({ id, title }) {
  const saved = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(`saved-${id}`) === "true",
    () => false,
  );
  const [status, setStatus] = useState("");

  function resize(delta) {
    const body = document.querySelector(".journal-article-body, .article-body, .prose");
    if (!body) return;
    const current = parseFloat(getComputedStyle(body).fontSize);
    const next = Math.min(30, Math.max(18, current + delta));
    body.style.setProperty("font-size", `${next}px`);
  }

  async function share() {
    try {
      if (navigator.share) await navigator.share({ title, url: location.href });
      else {
        await navigator.clipboard.writeText(location.href);
        setStatus("লিংক কপি হয়েছে");
        setTimeout(() => setStatus(""), 2500);
      }
    } catch {
      setStatus("শেয়ার করা যায়নি");
      setTimeout(() => setStatus(""), 2500);
    }
  }

  function save() {
    localStorage.setItem(`saved-${id}`, String(!saved));
    window.dispatchEvent(new Event("storage"));
    setStatus(!saved ? "সংরক্ষিত হয়েছে" : "সংরক্ষণ সরানো হয়েছে");
    setTimeout(() => setStatus(""), 2500);
  }

  const url = useSyncExternalStore(subscribe, () => window.location.href, () => "");

  return (
    <div className="journal-article-tools flex flex-wrap items-center gap-1.5 relative">
      <a
        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#1877f2] hover:border-[#1877f2] transition"
        aria-label="Facebook-এ শেয়ার"
        target="_blank"
        rel="noreferrer"
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        title="Facebook-এ শেয়ার"
      >
        <FacebookIcon size={15} />
      </a>
      <a
        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-black hover:border-black transition"
        aria-label="X-এ শেয়ার"
        target="_blank"
        rel="noreferrer"
        href={`https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        title="X-এ শেয়ার"
      >
        <TwitterIcon size={14} />
      </a>
      <a
        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#25d366] hover:border-[#25d366] transition"
        aria-label="WhatsApp-এ শেয়ার"
        target="_blank"
        rel="noreferrer"
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`}
        title="WhatsApp-এ শেয়ার"
      >
        <WhatsAppIcon size={15} />
      </a>
      <button
        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#e5252a] hover:border-[#e5252a] transition"
        aria-label="শেয়ার করুন"
        onClick={share}
        title="লিংক কপি করুন"
      >
        <Share2 size={15} />
      </button>

      <div className="flex items-center gap-1 pl-1 border-l border-gray-200">
        <button
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-950 transition"
          aria-label="অক্ষর বড় করুন"
          onClick={() => resize(2)}
          title="অক্ষর বড় করুন"
        >
          <Plus size={15} />
        </button>
        <button
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-950 transition"
          aria-label="অক্ষর ছোট করুন"
          onClick={() => resize(-2)}
          title="অক্ষর ছোট করুন"
        >
          <Minus size={15} />
        </button>
        <button
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-950 transition"
          aria-label="প্রিন্ট করুন"
          data-print-tool
          onClick={() => window.print()}
          title="মুদ্রণ করুন"
        >
          <Printer size={15} />
        </button>
      </div>

      <button
        className={`w-8 h-8 rounded-full border transition flex items-center justify-center ${
          saved
            ? "bg-[#e5252a] text-white border-[#e5252a]"
            : "border-gray-200 text-gray-600 hover:text-[#e5252a] hover:border-[#e5252a]"
        }`}
        aria-label={saved ? "সংরক্ষণ সরান" : "সংরক্ষণ করুন"}
        aria-pressed={saved}
        onClick={save}
        title={saved ? "সংরক্ষিত" : "সংরক্ষণ করুন"}
      >
        {saved ? <Check size={15} /> : <Bookmark size={15} />}
      </button>

      {status && (
        <span
          className="absolute -top-7 right-0 text-[10px] font-bold text-white bg-gray-900 px-2 py-0.5 rounded shadow-sm whitespace-nowrap"
          role="status"
        >
          {status}
        </span>
      )}
    </div>
  );
}
