import Link from "next/link";
import { decodeSegment } from "@/lib/news-format";
import { notFound } from "next/navigation";
import { BookOpen, Calendar, User } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ArticleTools from "@/components/ArticleTools";
import { getNewsDataset, getArticle } from "@/lib/news";
import ArticleReader from "@/components/news/ArticleReader";
import NewsState from "@/components/news/NewsState";
import PublicAd from "@/components/news/PublicAd";
import NewsSidebar from "@/components/news/NewsSidebar";
import EditorialStory from "@/components/news/EditorialStory";
import VideoPlayer from "@/components/news/VideoPlayer";

export async function generateMetadata({params}) {
  const id = decodeSegment((await params).id);
  const {article} = await getArticle(id);
  return {title:`${article?.title || "সংবাদ পাওয়া যায়নি"} | জনকল্যাণ নিউজ`,description:article?.subtitle,openGraph:{images:article?.image?[{url:article.image,width:1200,height:650,alt:article?.title}]:[]}};
}
export default async function Article({params}) {
  const id = decodeSegment((await params).id);
  const [{article,error,notFound:missing},{articles,categories}] = await Promise.all([getArticle(id),getNewsDataset()]);
  if(missing) notFound();
  if(error || !article) return <><Header/><main className="site-width"><NewsState error/></main><Footer/></>;
  const related=articles.filter((a)=>a.id!==id && a.category===article.category).slice(0,3);
  const minutes=Math.max(1,Math.ceil(article.content.join(" ").split(/\s+/).length/180));
  return <><Header/><PublicAd slot="BANNER_TOP"/><main className="site-width journal-article">
    <nav className="journal-breadcrumb" aria-label="পাতার অবস্থান"><Link href="/">প্রচ্ছদ</Link><span>›</span><Link href={`/category/${article.category}`}>{article.categoryLabel}</Link><span>›</span><span>সংবাদ</span></nav>
    <div className="journal-article-layout"><article className="journal-article-main">
    <header className="journal-article-heading">
      <Link className="journal-article-category" href={`/category/${article.category}`}>{article.categoryLabel}</Link>
      <h1>{article.title}</h1>
      <div className="journal-byline"><div className="journal-author"><span className="journal-author-icon"><User size={21}/></span><div><strong>{article.author}</strong><div><span><Calendar size={13}/>{article.publishedAt}</span><span><BookOpen size={13}/>{minutes.toLocaleString("bn-BD")} মিনিট পাঠ</span></div></div></div><ArticleTools id={id} title={article.title}/></div>
    </header>
      {article.image && <figure className="journal-article-photo"><img src={article.image} alt={article.title} width={1200} height={650} fetchPriority="high"/>{(article.caption || article.photoCredit) && <figcaption>{article.caption}{article.photoCredit && ` · ছবি: ${article.photoCredit}`}</figcaption>}</figure>}
      {article.videoUrl && <VideoPlayer key={article.videoUrl} url={article.videoUrl} title={article.title} poster={article.image}/>}
      <ArticleReader key={id} id={id} audioUrl={article.audioUrl} audioStatus={article.audioStatus} audioDelayed={article.audioDelayed} summary={article.aiSummary}/>
      <div className="journal-article-body prose">{article.content.map((p,i)=><p key={i}>{p}</p>)}</div>
      <PublicAd slot="IN_ARTICLE"/>
      <div className="journal-article-tags"><span>সম্পর্কিত বিষয়</span><Link href={`/category/${article.category}`}>{article.categoryLabel}</Link>{article.districts.map((d)=><Link key={d.slug} href={`/category/${article.category}?district=${encodeURIComponent(d.slug)}`}>{d.name}</Link>)}</div>
      {related.length>0 && <section className="journal-section"><div className="journal-section-heading"><h2>আরও পড়ুন</h2><Link href={`/category/${article.category}`}>সব খবর →</Link></div><div className="journal-card-grid">{related.map((a)=><EditorialStory key={a.id} story={a}/>)}</div></section>}
    </article><NewsSidebar articles={articles.filter((a)=>a.id!==id)} categories={categories}/></div>
  </main><Footer/></>;
}
