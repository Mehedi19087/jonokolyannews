import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { AdSlot } from "@/components/common/NewsElements";
import { getNewsDataset } from "@/lib/news";
import EditorialStory from "@/components/news/EditorialStory";
import NewsSidebar from "@/components/news/NewsSidebar";
import NewsState from "@/components/news/NewsState";
import { isHomeCategory } from "@/lib/navigation";

export default async function Home() {
  const {articles, categories, error} = await getNewsDataset();
  const homeCategories = categories.filter((c) => isHomeCategory(c.slug));
  const lead = articles.find((a)=>a.image) || articles[0];
  const rest = articles.filter((a)=>a.id!==lead?.id);
  return <>
    <Header /><AdSlot />
    <main className="site-width journal-home">
      <h1 className="sr-only">জনকল্যাণ নিউজ — মানুষের কল্যাণে প্রতিদিন</h1>
      {error && <NewsState error />}
      {!error && !articles.length && <NewsState />}
      {articles.length > 0 && <div className="journal-front">
        <div className="journal-front-lead">
          <EditorialStory story={lead} variant="lead" summary priority />
          {rest.slice(6,8).map((a)=><EditorialStory key={a.id} story={a} variant="horizontal" />)}
        </div>
        <div className="journal-front-grid">{rest.slice(0,6).map((a)=><EditorialStory key={a.id} story={a} />)}</div>
        <NewsSidebar articles={articles} />
      </div>}
      {homeCategories.map((category)=>{
        const stories = articles.filter((a)=>a.category===category.slug).slice(0,5);
        return <section key={category.slug} id={`section-${category.slug}`} className="journal-section" data-category={category.slug}>
          <div className="journal-section-heading"><h2><Link href={`/category/${category.slug}`}>{category.name} <span>›</span></Link></h2><Link href={`/category/${category.slug}`}>সব খবর <span>→</span></Link></div>
          {stories.length ? <div className={`journal-section-grid${stories.length === 1 ? " journal-section-single" : stories.length === 2 ? " journal-section-pair" : ""}`}><EditorialStory story={stories[0]} variant="feature" summary />{stories.length > 1 && <div className="journal-section-rest">{stories.slice(1).map((a)=><EditorialStory key={a.id} story={a} variant="horizontal" />)}</div>}</div> : <p className="journal-section-empty">এই বিভাগে নতুন সংবাদ প্রকাশ হলে এখানে দেখতে পাবেন।</p>}
        </section>;
      })}
    </main><Footer />
  </>;
}
