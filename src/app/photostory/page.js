import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import {
  AdSlot,
  PageHeading,
  NewsCard,
  SectionHeading,
} from "@/components/common/NewsElements";
import PhotoGallery from "@/components/PhotoGallery";
import { getNewsDataset } from "@/lib/news";
import NewsState from "@/components/news/NewsState";
import Link from "next/link";
export const metadata = {
  title: "ছবি | জনকল্যাণ নিউজ",
  description: "দেশ ও বিশ্বের খবর ছবিতে।",
};
export default async function PhotoPage() {
  const {articles:mockNews,error} = await getNewsDataset();
  const stories = mockNews.filter((n) => n.category === "photostory" && n.image || n.photos?.length);
  const lead = stories[0];
  return (
    <>
      <Header />
      <AdSlot />
      <main className="site-width">
        <PageHeading
          title="ছবি"
          links={[
            { label: "সব ছবি", href: "/photostory" },
            { label: "বাংলাদেশ", href: "/category/national" },
            { label: "প্রকৃতি", href: "/photostory" },
            { label: "খেলা", href: "/category/sports" },
            { label: "জীবনযাপন", href: "/category/lifestyle" },
          ]}
        />
        {error && <NewsState error/>}
        {!error && !lead && <NewsState title="ছবির গল্প এখনো প্রকাশিত হয়নি"/>}
        {lead && (
          <div className="gallery-layout">
            <div>
              <PhotoGallery photos={lead.photos?.length ? lead.photos : [lead.image]} title={lead.title} />
              <div className="photo-description">
                <Link href={`/news/${lead.id}`}>
                  <h2>{lead.title}</h2>
                </Link>
                <p>{lead.subtitle}</p>
                <time>{lead.publishedAt}</time>
              </div>
            </div>
            <aside>
              <AdSlot rail />
              <SectionHeading title="আরও ছবির গল্প" href="/photostory" />
              {stories.map((n) => (
                <NewsCard key={n.id} news={n} description={false} />
              ))}
            </aside>
          </div>
        )}
        <section className="editorial-section">
          <SectionHeading title="চিত্রে সংবাদ" href="/archive" />
          <div className="four-columns">
            {mockNews
              .filter((n) => n.image)
              .slice(3, 7)
              .map((n) => (
                <NewsCard key={n.id} news={n} description={false} />
              ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
