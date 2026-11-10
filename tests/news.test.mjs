import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeArticle, plainParagraphs, publicationDate, safeVideoUrl, decodeSegment } from '../src/lib/news-format.js';
import { getNewsDataset, getArticle, getCategoryArticles } from '../src/lib/news.js';
import { navigationItems, isHomeCategory } from '../src/lib/navigation.js';

const category={id:1,name:'অর্থনীতি',slug:'business'};
const article={id:1,slug:'বাংলা-সংবাদ',title:'বাংলা সংবাদ',category,status:'PUBLISHED',published_at:'2026-11-09T20:00:00Z'};
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}});

// These checks protect the boundary between API content and the public pages.
test('publication dates use Bangladesh time at the midnight boundary',()=>{
 assert.equal(publicationDate('2026-11-09T20:00:00Z'),'2026-11-10');
 assert.equal(publicationDate('invalid'),'');
});
test('article text removes executable markup and preserves separate paragraphs',()=>{
 assert.deepEqual(plainParagraphs('<p>প্রথম &amp; দ্বিতীয়</p><script>alert(1)</script><p>শেষ<br>লাইন</p>'),['প্রথম & দ্বিতীয়','শেষ','লাইন']);
});
test('normalization preserves real AI and audio output without inventing content',()=>{
 const data=normalizeArticle({...article,ai_summary:'সারসংক্ষেপ।',audio_status:'PENDING',audio_file_url:null});
 assert.equal(data.aiSummary,'সারসংক্ষেপ।');assert.equal(data.audioStatus,'PENDING');assert.equal(data.audioUrl,'');
 assert.deepEqual(data.content,[]);assert.equal(data.author,'নিজস্ব প্রতিবেদক');assert.equal(data.views,null);
});
test('video embeds allow supported YouTube URLs and reject executable or unknown hosts',()=>{
 assert.equal(safeVideoUrl('https://youtu.be/abc123'),'https://www.youtube-nocookie.com/embed/abc123');
 assert.equal(safeVideoUrl('https://www.youtube.com/watch?v=abc123'),'https://www.youtube-nocookie.com/embed/abc123');
 assert.equal(safeVideoUrl('javascript:alert(1)'),'');
 assert.equal(safeVideoUrl('https://example.com/embed/a'),'');
});
test('generated reel files remain playable while unknown embed URLs stay blocked',()=>{
 const url='https://res.cloudinary.com/example/video/upload/v123/article.mp4';
 assert.equal(safeVideoUrl(url),url);
 assert.equal(normalizeArticle({...article,video_url:url}).videoUrl,url);
 assert.equal(safeVideoUrl('https://example.com/news.webm?version=2'),'https://example.com/news.webm?version=2');
 assert.equal(safeVideoUrl('https://example.com/page.html'),'');
});
test('saved menu categories use the right pages without duplicate utility links',()=>{
 const categories=[{slug:'latest',name:'সর্বশেষ'},{slug:'bangladesh',name:'বাংলাদেশ'},{slug:'photostory',name:'ছবি'},{slug:'tube',name:'ভিডিও'},{slug:'newstoday',name:'আজকের সংবাদ'},{slug:'archive',name:'আর্কাইভ'}];
 const items=navigationItems(categories);
 assert.deepEqual(items.map(i=>i.href),['/archive','/category/bangladesh','/photostory','/tube','/newstoday','/archive-calendar']);
 assert.equal(new Set(items.map(i=>i.href)).size,categories.length);
 assert.deepEqual(navigationItems([]),[]);
 assert.deepEqual(categories.filter(c=>isHomeCategory(c.slug)).map(c=>c.slug),['bangladesh']);
 assert.equal(isHomeCategory('jela-songbad'),false);
});
test('district pages request the backend district grouping instead of losing tagged stories',async(t)=>{
 let requested='';
 t.mock.method(globalThis,'fetch',async(url)=>{requested=url;return json([{...article,districts:[{name:'ঢাকা',slug:'dhaka'}]}]);});
 const data=await getCategoryArticles('jela-songbad','dhaka');
 const url=new URL(requested);
 assert.equal(url.searchParams.get('category'),'jela-songbad');
 assert.equal(url.searchParams.get('district'),'dhaka');
 assert.equal(data.articles[0].category,'business');
 assert.equal(data.error,false);
});
test('Bangla route segments work in decoded and encoded forms',()=>{
 assert.equal(decodeSegment(encodeURIComponent(article.slug)),article.slug);
 assert.equal(decodeSegment(article.slug),article.slug);
 assert.equal(decodeSegment('100%'),'100%');
});
test('dataset follows pagination, sends the portal header, and excludes drafts',async(t)=>{
 const requests=[];
 t.mock.method(globalThis,'fetch',async(url,options)=>{
  requests.push({url,options});
  if(url.includes('/categories/'))return json([category]);
  if(url.includes('page=2'))return json({results:[{...article,id:2,slug:'draft',status:'DRAFT'}],next:null});
  return json({results:[article],next:'https://newspaper-web-production.up.railway.app/api/news/articles/?page=2'});
 });
 const data=await getNewsDataset();
 assert.equal(data.error,false);assert.equal(data.articles.length,1);assert.equal(data.categories[0].slug,'business');
 assert.equal(requests.length,3);
 assert.ok(requests.every(({options})=>options.headers['X-Tenant-Slug']==='jonokolyannews'));
});
test('failed news requests produce an error state with no sample news',async(t)=>{
 t.mock.method(globalThis,'fetch',async()=>json({detail:'unavailable'},503));
 const data=await getNewsDataset();
 assert.equal(data.error,true);assert.deepEqual(data.articles,[]);assert.deepEqual(data.categories,[]);
});
test('detail lookups encode a Bangla slug exactly once and distinguish missing from failed',async(t)=>{
 let requested='';
 t.mock.method(globalThis,'fetch',async(url)=>{requested=url;return json(article);});
 const data=await getArticle(encodeURIComponent(article.slug));
 assert.equal(data.article.id,article.slug);assert.ok(requested.endsWith(encodeURIComponent(article.slug)+'/'));
 globalThis.fetch=async()=>json({},404);
 assert.equal((await getArticle('missing')).notFound,true);
 globalThis.fetch=async()=>json({},503);
 assert.equal((await getArticle('failed')).error,true);
});
