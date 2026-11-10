"use client";
import { useEffect, useRef, useState } from "react";
import { safeUrl } from "@/lib/news-format";

export default function PublicAd({slot}) {
  const [ad, setAd] = useState(null);
  const anchor = useRef(null);
  const impressed = useRef(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/news/ads/?slot=${slot}`, {signal:controller.signal})
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setAd((Array.isArray(data) ? data : data.results || [])[0] || null))
      .catch(() => {});
    return () => controller.abort();
  }, [slot]);
  useEffect(() => {
    if (!ad || !anchor.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && impressed.current !== ad.id) {
        impressed.current = ad.id;
        fetch(`/api/news/ads/${ad.id}/impression/`, {method:"POST"}).catch(()=>{});
        observer.disconnect();
      }
    }, {threshold:0.5});
    observer.observe(anchor.current);
    return () => observer.disconnect();
  }, [ad]);
  if (!ad || !safeUrl(ad.image_url) || !safeUrl(ad.target_url)) return null;
  return <div className={`public-ad public-ad-${slot.toLowerCase()}`}>
    <span>বিজ্ঞাপন</span>
    <a ref={anchor} href={safeUrl(ad.target_url)} target="_blank" rel="noopener sponsored" aria-label={`${ad.title} — বিজ্ঞাপন`}
      onClick={() => {fetch(`/api/news/ads/${ad.id}/click/`, {method:"POST", keepalive:true}).catch(()=>{});}}>
      <img src={safeUrl(ad.image_url)} alt={ad.title} loading="lazy" />
    </a>
  </div>;
}
