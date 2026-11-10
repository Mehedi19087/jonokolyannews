import { decodeSegment } from "@/lib/news-format";
import { redirect } from "next/navigation";
export default async function ArticleAlias({params}) {
  const {id} = await params;
  redirect(`/news/${encodeURIComponent(decodeSegment(id))}`);
}
