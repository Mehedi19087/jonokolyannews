import "./globals.css";
import "./news.css";
import NewsProvider from "@/components/news/NewsProvider";
import { getNewsDataset } from "@/lib/news";

export const metadata = {
  metadataBase: new URL("https://robidakua.vercel.app"),
  title: "জনকল্যাণ নিউজ | বস্তুনিষ্ঠ খবরের বিশ্বস্ত ঠিকানা | Jonokollan News",
  description:
    "জনকল্যাণ নিউজ - বাংলাদেশ ও আন্তর্জাতিক ব্রেকিং নিউজ, মতামত, রাজনীতি, অর্থনীতি, খেলা ও বিনোদন - সম্পাদক ও প্রকাশক: ম. ম. রবি ডাকুয়া",
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function RootLayout({ children }) {
  const data = await getNewsDataset();
  return (
    <html lang="bn" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-white text-[#1a1a1a]">
        <NewsProvider data={data}>{children}</NewsProvider>
      </body>
    </html>
  );
}
