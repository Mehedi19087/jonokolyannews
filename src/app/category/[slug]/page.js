import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { AdSlot } from "@/components/common/NewsElements";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { decodeSegment } from "@/lib/news-format";
import { getNewsDataset, getCategoryArticles } from "@/lib/news";
import { categoryHref } from "@/lib/navigation";
import EditorialStory from "@/components/news/EditorialStory";
import NewsSidebar from "@/components/news/NewsSidebar";
import NewsState from "@/components/news/NewsState";

export async function generateMetadata({params}) {
  const slug = decodeSegment((await params).slug);
  const {categories} = await getNewsDataset();
  return {title:`${categories.find((c)=>c.slug===slug)?.name || "বিভাগ"} | জনকল্যাণ নিউজ`};
}

export default async function CategoryPage({params,searchParams}) {
  const slug = decodeSegment((await params).slug);
  const query = await searchParams;
  const {articles,categories,error} = await getNewsDataset();
  const destination = categoryHref(slug);
  if (!destination.startsWith("/category/")) redirect(destination);
  const aliases = {sport:"sports",glitz:categories.some((c)=>c.slug==="culture")?"culture":"entertainment",samagrabangladesh:categories.some((c)=>c.slug==="jela-songbad")?"jela-songbad":"country",national:"bangladesh"};
  if (!categories.some((c)=>c.slug===slug) && categories.some((c)=>c.slug===aliases[slug])) redirect(`/category/${aliases[slug]}`);
  const category = categories.find((c)=>c.slug===slug);
  if (!category && !error) notFound();
  const district = typeof query.district === "string" ? query.district : "";
  const categoryData = slug === "jela-songbad" ? await getCategoryArticles(slug) : {articles:articles.filter((a)=>a.category===slug),error:false};
  const all = categoryData.articles;
  const districts = [...new Map(all.flatMap((a)=>a.districts).map((d)=>[d.slug,d])).values()];
  const districtData = district ? await getCategoryArticles(slug,district) : categoryData;
  const items = districtData.articles;
  const loadError = error || categoryData.error || districtData.error;
  const pageCount = Math.ceil(items.length/12);
  const page = Math.min(Math.max(1,Number(query.page)||1),Math.max(1,pageCount));
  const feed = items.slice((page-1)*12,page*12);
  return <><Header/><AdSlot/><main className="site-width journal-category">
    <nav className="journal-breadcrumb" aria-label="পাতার অবস্থান"><Link href="/">প্রচ্ছদ</Link><span>›</span><span>{category?.name || "বিভাগ"}</span></nav>
    <div className="journal-page-heading"><div><span>বিভাগের সংবাদ</span><h1>{category?.name || "বিভাগ"}</h1></div><p>{items.length.toLocaleString("bn-BD")}টি সংবাদ</p></div>
    {districts.length>0 && <nav className="journal-filters" aria-label="জেলার সংবাদ"><Link aria-current={!district?"page":undefined} href={`/category/${slug}`}>সব জেলা</Link>{districts.map((d)=><Link key={d.slug} aria-current={district===d.slug?"page":undefined} href={`/category/${slug}?district=${encodeURIComponent(d.slug)}`}>{d.name}</Link>)}</nav>}
    {loadError ? <NewsState error/> : items.length ? <div className="journal-listing-layout"><div>
      {page===1 && <div className="journal-category-feature"><EditorialStory story={feed[0]} variant="lead" summary priority/><div>{feed.slice(1,3).map((a)=><EditorialStory key={a.id} story={a} variant="horizontal"/>)}</div></div>}
      <div className="journal-card-grid">{(page===1?feed.slice(3):feed).map((a)=><EditorialStory key={a.id} story={a}/>)}</div>
      {pageCount>1 && <nav className="journal-pagination" aria-label="সংবাদ পৃষ্ঠা">{Array.from({length:pageCount},(_,i)=><Link key={i} aria-current={page===i+1?"page":undefined} href={`/category/${slug}?${new URLSearchParams({...(district?{district}:{}),page:String(i+1)})}`}>{(i+1).toLocaleString("bn-BD")}</Link>)}</nav>}
    </div><NewsSidebar articles={articles} categories={categories}/></div> : <NewsState title="এই বিভাগে এখনো কোনো সংবাদ নেই"/>}
  </main><Footer/></>;
}
