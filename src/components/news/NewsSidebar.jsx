import Link from "next/link";
import PublicAd from "./PublicAd";
import { categoryHref } from "@/lib/navigation";

export default function NewsSidebar({articles = [], categories = []}) {
  const opinion = articles.filter((a) => a.category === "opinion").slice(0,3);
  return <aside className="journal-sidebar">
    <PublicAd slot="SIDEBAR" />
    <section className="journal-latest">
      <div className="journal-sidebar-heading"><h2>সর্বশেষ সংবাদ</h2><span className="journal-live-dot"/></div>
      <ol>{articles.slice(0,6).map((a,i) => <li key={a.id}><span>{(i+1).toLocaleString("bn-BD")}</span><Link href={`/news/${encodeURIComponent(a.id)}`}><h3>{a.title}</h3><time>{a.publishedAt}</time></Link></li>)}</ol>
      <Link className="journal-more" href="/archive">সব সংবাদ দেখুন →</Link>
    </section>
    {opinion.length > 0 && <section className="journal-opinion"><h2>মতামত ও সম্পাদকীয়</h2>{opinion.map((a)=><Link key={a.id} href={`/news/${encodeURIComponent(a.id)}`}><span>{a.author}</span><h3>{a.title}</h3></Link>)}<Link className="journal-more" href="/category/opinion">সব মতামত →</Link></section>}
    {categories.length > 0 && <section className="journal-directory"><h2>সব বিভাগ</h2><div>{categories.map((c)=><Link key={c.slug} href={categoryHref(c.slug)}>{c.name} <span>↗</span></Link>)}</div></section>}
  </aside>;
}
