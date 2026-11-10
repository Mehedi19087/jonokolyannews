import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { AdSlot } from "@/components/common/NewsElements";
import { notFound } from "next/navigation";
const pages = {
  about: {
    title: "আমাদের সম্পর্কে",
    paragraphs: [
      "জনকল্যাণ নিউজ একটি নিরপেক্ষ বাংলা সংবাদ ও মতামতের প্রকাশনা। এখানে বাংলাদেশ, বিশ্ব, খেলা, বাণিজ্য, প্রযুক্তি, জীবনযাপন ও সাহিত্যবিষয়ক প্রতিবেদন পড়তে পারেন।",
      "সম্পাদক ও প্রকাশক: ম. ম. রবি ডাকুয়া।",
    ],
  },
  contact: {
    title: "যোগাযোগ",
    paragraphs: [
      "সম্পাদক ও প্রকাশক: ম. ম. রবি ডাকুয়া।",
      "প্রকাশনার যোগাযোগের ঠিকানা ও ফোন নম্বর এখনো প্রকাশ করা হয়নি।",
    ],
  },
  advertise: {
    title: "বিজ্ঞাপন",
    paragraphs: [
      "ওয়েবসাইটে বিজ্ঞাপন প্রকাশের বিষয়ে যোগাযোগের বিস্তারিত তথ্য এখানে প্রকাশ করা হবে।",
    ],
  },
  privacy: {
    title: "গোপনীয়তা নীতি",
    paragraphs: [
      "সংবাদ সংরক্ষণ করলে আপনার নির্বাচিত সংবাদের তথ্য এই ব্রাউজারেই রাখা হয়। ব্রাউজারের তথ্য মুছে দিলে সংরক্ষিত তালিকাও মুছে যাবে।",
      "বহিরাগত ছবি, ফন্ট, সামাজিক যোগাযোগমাধ্যমের লিংক ও ভিডিও সেবার নিজস্ব গোপনীয়তা নীতি প্রযোজ্য। পূর্ণাঙ্গ প্রকাশনা নীতি এখানে হালনাগাদ করা হবে।",
    ],
  },
  terms: {
    title: "ব্যবহারের শর্তাবলি",
    paragraphs: [
      "এই প্রকাশনার সংবাদ ও মতামত পড়ার সময় সংশ্লিষ্ট প্রতিবেদনটির প্রকাশের তারিখ এবং উৎস বিবেচনায় নিন।",
      "কোনো লেখা বা ছবি পুনঃপ্রকাশের আগে সংশ্লিষ্ট স্বত্বাধিকারীর অনুমতি নিন। বিস্তারিত প্রকাশনা নীতি এখানে হালনাগাদ করা হবে।",
    ],
  },
};
export function generateStaticParams() {
  return Object.keys(pages).map((section) => ({ section }));
}
export async function generateMetadata({ params }) {
  const { section } = await params;
  return {
    title: `${pages[section]?.title || "পৃষ্ঠা পাওয়া যায়নি"} | জনকল্যাণ নিউজ`,
  };
}
export default async function Info({ params }) {
  const { section } = await params;
  const p = pages[section];
  if (!p) notFound();
  return (
    <>
      <Header />
      <AdSlot />
      <main className="site-width info-page">
        <h1>{p.title}</h1>
        {p.paragraphs.map((t) => (
          <p key={t}>{t}</p>
        ))}
      </main>
      <Footer />
    </>
  );
}
