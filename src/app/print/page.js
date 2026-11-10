import Link from "next/link";
import { Newspaper } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
export const metadata={title:"প্রিন্ট সংস্করণ | জনকল্যাণ নিউজ"};
export default function PrintEdition(){return <><Header/><main className="site-width journal-category"><div className="journal-page-heading"><div><span>জনকল্যাণ নিউজ</span><h1>প্রিন্ট সংস্করণ</h1></div></div><section className="journal-print"><Newspaper size={36} className="text-[#e5252a] mb-5"/><h2>প্রিন্ট সংস্করণ এখনো প্রকাশিত হয়নি</h2><p>সর্বশেষ সংবাদ অনলাইন সংস্করণে পড়ুন। পুরোনো সংবাদ খুঁজতে আর্কাইভের তারিখ নির্বাচন করুন।</p><Link href="/archive-calendar">আর্কাইভ দেখুন →</Link></section></main><Footer/></>;}
