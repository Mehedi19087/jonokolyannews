"use client";
import Link from "next/link";
import { Newspaper, RefreshCw } from "lucide-react";

export default function NewsState({error = false, title}) {
  return <div className="news-state" role={error ? "alert" : "status"}>
    <Newspaper size={34} aria-hidden="true" />
    <h2>{title || (error ? "সংবাদ লোড করা যায়নি" : "এখনো কোনো সংবাদ প্রকাশিত হয়নি")}</h2>
    <p>{error ? "কিছুক্ষণ পর আবার চেষ্টা করুন।" : "নতুন সংবাদ প্রকাশ হলে এখানে দেখতে পাবেন।"}</p>
    {error ? <button className="outline-button" onClick={() => location.reload()}><RefreshCw size={16}/> আবার চেষ্টা করুন</button> : <Link className="outline-button" href="/archive">সব সংবাদ দেখুন</Link>}
  </div>;
}
