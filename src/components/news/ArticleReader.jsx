"use client";
import { useEffect, useRef, useState } from "react";
import { Headphones, Play, Pause, Sparkles, ChevronDown, Check, Volume2, RotateCcw } from "lucide-react";
import { plainParagraphs, safeUrl } from "@/lib/news-format";

export function formatTime(value) {
  if (!Number.isFinite(value) || value < 0) return "00:00";
  return `${String(Math.floor(value/60)).padStart(2,"0")}:${String(Math.floor(value%60)).padStart(2,"0")}`;
}

export default function ArticleReader({id, audioUrl, audioStatus, audioDelayed, summary}) {
  const [media, setMedia] = useState({url:audioUrl, status:audioStatus, delayed:audioDelayed});
  const [aiSummary,setAiSummary] = useState(summary);
  const [playing,setPlaying] = useState(false);
  const [current,setCurrent] = useState(0);
  const [duration,setDuration] = useState(0);
  const [speed,setSpeed] = useState(1);
  const [error,setError] = useState("");
  const [expanded,setExpanded] = useState(true);
  const audio = useRef(null);
  const url = safeUrl(media.url);
  const pending = ["PENDING","RUNNING"].includes(media.status);
  const points = plainParagraphs(aiSummary).join(" ").split(/(?<=[।!?])\s*|\n+/).map((p)=>p.replace(/^[•\-\s]+/,"").trim()).filter(Boolean);

  useEffect(()=>{
    const controller = new AbortController();
    // Count a detail view only after the article reaches a browser.
    fetch(`/api/news/articles/${encodeURIComponent(id)}/view/`, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({referrer_url:document.referrer}),signal:controller.signal}).catch(()=>{});
    return ()=>{controller.abort();};
  },[id]);

  useEffect(()=>{
    if (!pending || url) return;
    let attempts=0;
    const controller = new AbortController();
    const timer=setInterval(async()=>{
      if (++attempts >= 12) clearInterval(timer);
      try {
        const response=await fetch(`/api/news/articles/${encodeURIComponent(id)}/`,{signal:controller.signal});
        if (!response.ok) return;
        const data=await response.json();
        setMedia({url:safeUrl(data.audio_file_url),status:data.audio_status,delayed:data.audio_is_delayed});
        if (data.ai_summary) setAiSummary(data.ai_summary);
      } catch { /* Keep the readable article available while audio is pending. */ }
    },15000);
    return ()=>{clearInterval(timer);controller.abort();};
  },[id,pending,url]);

  async function toggle() {
    if (!audio.current || !url) return;
    if (playing) audio.current.pause();
    else {
      setError("");
      try { await audio.current.play(); }
      catch { setError("অডিও চালু করা যায়নি। আবার চেষ্টা করুন।"); }
    }
  }
  function seek(value) {
    if (!audio.current || !duration) return;
    const next=Math.min(duration,Math.max(0,Number(value)));
    audio.current.currentTime=next;setCurrent(next);
  }
  function cycleSpeed() {
    const speeds=[1,1.25,1.5,2];
    const next=speeds[(speeds.indexOf(speed)+1)%speeds.length];
    setSpeed(next);if(audio.current) audio.current.playbackRate=next;
  }
  return <div className="article-reader">
    <section className="reader-audio" aria-label="সংবাদের অডিও">
      {url && <audio ref={audio} src={url} preload="metadata" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onTimeUpdate={()=>setCurrent(audio.current?.currentTime||0)} onLoadedMetadata={()=>setDuration(Number.isFinite(audio.current?.duration)?audio.current.duration:0)} onEnded={()=>setPlaying(false)} onError={()=>{setPlaying(false);setError("অডিও লোড করা যায়নি। পরে আবার চেষ্টা করুন।");}}/>}
      <div className="reader-audio-heading"><span><Headphones size={16}/> অডিও সংবাদ</span><span>পড়ার পাশাপাশি শুনুন</span></div>
      <div className="reader-audio-main">
        <button className="reader-play" onClick={toggle} disabled={!url} aria-label={playing?"অডিও থামান":"অডিও শুনুন"}>{playing?<Pause size={23} fill="currentColor"/>:<Play size={23} fill="currentColor"/>}</button>
        <div className="reader-audio-copy"><h2>সংবাদটি শুনুন</h2><p role="status">{error || (playing?"অডিও চলছে…":url?"প্লে করুন, পুরো সংবাদ শুনুন":pending?(media.delayed?"অডিও তৈরি হতে কিছুটা সময় লাগছে।":"অডিও তৈরি হচ্ছে…"):media.status==="FAILED"?"অডিও এখন পাওয়া যাচ্ছে না।":"এই সংবাদের অডিও এখনো প্রকাশিত হয়নি।")}</p></div>
        <button className="reader-speed" onClick={cycleSpeed} disabled={!url} aria-label={`অডিওর গতি পরিবর্তন, এখন ${speed} গুণ`}>{speed}×</button>
      </div>
      {url && <div className="reader-timeline"><button aria-label="দশ সেকেন্ড পেছনে যান" onClick={()=>seek(current-10)} disabled={!duration}><RotateCcw size={17}/></button><span>{formatTime(current)}</span><input type="range" aria-label="অডিও অগ্রগতি" min="0" max={duration||1} step="0.1" value={Math.min(current,duration||1)} disabled={!duration} onChange={(e)=>seek(e.target.value)}/><span>{formatTime(duration)}</span><Volume2 size={16} aria-hidden="true"/></div>}
    </section>
    <section className="reader-summary" aria-label="এআই সারসংক্ষেপ">
      <button className="reader-summary-toggle" aria-expanded={expanded} aria-controls="article-ai-points" onClick={()=>setExpanded(!expanded)}>
        <span className="reader-summary-icon"><Sparkles size={21}/></span><span><span className="reader-eyebrow">দ্রুত জানুন</span><strong>সংবাদটি এক নজরে</strong></span><span className="reader-ai-badge">AI সারসংক্ষেপ</span><ChevronDown size={20} className={expanded?"reader-chevron-open":""}/>
      </button>
      <div id="article-ai-points" hidden={!expanded}>
        {points.length ? <ul>{points.map((point,i)=><li key={i}><span><Check size={13} strokeWidth={3}/></span><p>{point}</p></li>)}</ul> : <p className="reader-summary-empty">এই সংবাদের এআই সারসংক্ষেপ এখনো পাওয়া যায়নি।</p>}
        {points.length>0 && <p className="reader-summary-note">এআই সহায়তায় তৈরি সংক্ষিপ্তসার। বিস্তারিত জানতে পুরো প্রতিবেদন পড়ুন।</p>}
      </div>
    </section>
  </div>;
}
