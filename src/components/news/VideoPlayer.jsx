"use client";
import { useState } from "react";
import { isEmbeddedVideo } from "@/lib/news-format";

export default function VideoPlayer({url, title, poster, autoPlay = false}) {
  const [failed, setFailed] = useState(false);
  if (!url) return null;
  if (isEmbeddedVideo(url)) return <iframe className="journal-article-video" src={`${url}${autoPlay ? "?autoplay=1" : ""}`} title={title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen/>;
  return <div className="native-video-player">
    <video src={url} poster={poster || undefined} aria-label={title} controls playsInline preload="metadata" autoPlay={autoPlay} onError={() => setFailed(true)}/>
    {failed && <p role="alert">ভিডিও চালু করা যায়নি। পরে আবার চেষ্টা করুন।</p>}
  </div>;
}
