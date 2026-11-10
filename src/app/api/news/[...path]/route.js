import { decodeSegment } from "@/lib/news-format";
import { newsRequest } from "@/lib/news";

async function proxy(request, {params}) {
  const path = (await params).path.map(decodeSegment);
  const read = request.method === "GET" && ((path.length === 1 && ["categories", "articles", "ads"].includes(path[0])) || (path.length === 2 && ["categories", "articles"].includes(path[0])));
  const track = request.method === "POST" && path.length === 3 && ((path[0] === "articles" && path[2] === "view") || (path[0] === "ads" && /^\d+$/.test(path[1]) && ["impression", "click"].includes(path[2])));
  if (!read && !track) return Response.json({detail:"Not found"}, {status:404});
  if (track && request.headers.get("origin") && request.headers.get("origin") !== new URL(request.url).origin) return Response.json({detail:"Invalid origin"}, {status:403});
  try {
    const suffix = new URL(request.url).search;
    const options = track ? {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(path[2] === "view" ? {referrer_url:(await request.json().catch(()=>({}))).referrer_url || ""} : {})} : {};
    const data = await newsRequest(path.map(encodeURIComponent).join("/") + "/" + suffix, options);
    return Response.json(data);
  } catch(error) { return Response.json({detail:"সংবাদ সেবা এখন পাওয়া যাচ্ছে না।"}, {status:error.status || 502}); }
}
export const GET = proxy;
export const POST = proxy;
