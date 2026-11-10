# Public pages and their APIs

This site keeps জনকল্যাণ নিউজ branding and uses the public news contract from the local `bhalukabeautiful` project. The home page excludes district news, opinion, technology, lifestyle, and latest category sections. It has no category jump bar. These categories remain available through the navigation and category pages. Each visible section filters by its category slug. Stories from another category are never inserted to fill a section.

## Configuration

Copy `.env.example` to `.env.local`, then restart Next.js:

```env
NEWS_API_BASE_URL=https://newspaper-web-production.up.railway.app
NEWS_TENANT_SLUG=jonokolyannews
```

`jonokolyannews` is the portal selected for this publication. The backend source is the separate `newspaper` repository. The reference project uses a separate portal. Every upstream request sends `X-Tenant-Slug`. No login token is needed for these public pages.

## Requests shared by the pages

The root layout fetches `GET /api/news/categories/` and `GET /api/news/articles/` on the server. The layout supplies the category menu, footer, search suggestions, and client pages. Page components share the same requests through React's request cache. Requests use `cache: no-store` so new visits see current published news. Lists support both arrays and paginated `{results, next}` responses. Pagination only follows links on the configured backend.

## Page map

| Page | APIs and behavior |
| --- | --- |
| `/` | Shared category and published article lists. A lead story, latest news sidebar, opinion sidebar, and six category sections. District news, opinion, technology, lifestyle, and latest category sections are hidden. No category jump bar. `GET /api/news/ads/?slot=BANNER_TOP` and `?slot=SIDEBAR`. |
| `/category/[slug]` | Shared lists. Normal categories filter by their backend slug. District news uses `GET /api/news/articles/?category=jela-songbad` so stories tagged with districts also appear. District selections use `GET /api/news/articles/?category={slug}&district={district}` and preserve the backend's title matching. Twelve stories per page; district selection stays in pagination links. Banner and sidebar ads. |
| `/news/[slug]` | `GET /api/news/articles/{slug}/` for full content, `ai_summary`, `audio_file_url`, `audio_status`, and `audio_is_delayed`. Shared lists supply related stories, latest news, and category links. `POST /api/news/articles/{slug}/view/` sends `{referrer_url}` after the article opens in a browser. Banner, sidebar, and in-article ads. |
| `/article/[slug]` | Redirects to `/news/[slug]` for compatibility with reference links. |
| `/archive` | Shared lists. Search, author, category, and date filters run on the loaded published articles. Dates use `published_at` in `Asia/Dhaka`. Results can show more stories without another request. |
| `/search?q=…` | Same search page, filters, and API data as `/archive`. |
| `/newstoday` | Same search page, with today's date selected in Bangladesh time. |
| `/archive-calendar` | Shared layout data. Calendar links open `/archive?date=YYYY-MM-DD`; future dates are disabled. No calendar API is required. |
| `/tube`, `/videos` | Shared article list. Published `video_url` values support native MP4/WebM/OGG playback and supported YouTube embeds. The player and category tabs use those stories. No made-up video URLs. |
| `/photostory` | Shared article list and images. Stories in the saved `photostory` category use their featured image; `photos` arrays also work if supplied. The backend currently has no dedicated gallery endpoint. |
| `/print` | Clear unpublished state and an archive link. The reference backend has no print-edition API. |
| `/about`, `/contact`, `/advertise`, `/privacy`, `/terms` | Local publication information with shared layout data. No extra content API exists in the reference. |
| `/en` | Clear notice that English reports are unavailable. No automatic translations or invented English stories. |
| Invalid category/article | A real missing record shows the not-found page. API failures show a retry action instead. |

Saved utility categories route to their pages: `latest` → `/archive`, `photostory` → `/photostory`, `tube` → `/tube`, `newstoday` → `/newstoday`, and `archive` → `/archive-calendar`. The header, footer, and section directory use the same mapping. Direct utility category URLs redirect to those pages.

Legacy `/category/national`, `/category/sport`, `/category/glitz`, and `/category/samagrabangladesh` links redirect to their corresponding current API categories when available.

## Article audio and AI summary

The detail endpoint supplies both features. The frontend does not call an AI generator or audio generator.

- Audio controls support play, pause, seeking, ten-second rewind, and 1×, 1.25×, 1.5×, and 2× speed.
- Missing audio, pending audio, delayed generation, failed generation, and playback errors have distinct messages.
- Pending audio polls the article detail endpoint every 15 seconds for up to 12 attempts. Polling stops when audio is ready, fails, or the reader leaves.
- `ai_summary` becomes a readable list under “সংবাদটি এক নজরে”. Readers can open or close the list.
- Missing AI output has a clear message. Article text is never presented as AI output.
- HTML from the backend is converted to plain paragraphs and rendered as text.

## Ads and the local proxy

Browser requests use `/api/news/[...path]` on this site. That route adds the configured portal header before calling the backend. It only permits public list/detail reads and the three tracking actions. It does not forward authentication or admin writes.

| Action | Upstream request |
| --- | --- |
| Load active ads | `GET /api/news/ads/?slot=BANNER_TOP`, `SIDEBAR`, or `IN_ARTICLE` |
| Visible ad | `POST /api/news/ads/{id}/impression/` |
| Ad click | `POST /api/news/ads/{id}/click/` |
| Article view | `POST /api/news/articles/{slug}/view/` |

Empty ad slots occupy no space. An impression is sent when at least half of an ad enters the screen. Broken ad requests do not block reading.

## Checks

Run `npm test`, `npm run lint`, and `npm run build`. Data tests cover Bangladesh date boundaries, HTML stripping, API pagination, portal headers, unpublished stories, failures, and Bangla article slugs. Browser checks cover public routes, category sections, mobile overflow, calendar navigation, search, real audio playback, speed changes, and AI summary expansion.

The admin console from the reference is a separate app. This change covers the public news pages and their public APIs.

## Tenant setup verified on 10 November 2026

All 15 menu entries are stored as category rows owned by tenant `jonokolyannews` (tenant ID 4). They are read through `GET /api/news/categories/` with `X-Tenant-Slug: jonokolyannews`.

| Saved slug | Menu label | Page |
| --- | --- | --- |
| `latest` | সর্বশেষ | `/archive` |
| `bangladesh` | বাংলাদেশ | `/category/bangladesh` |
| `politics` | রাজনীতি | `/category/politics` |
| `jela-songbad` | জেলা সংবাদ | `/category/jela-songbad` |
| `world` | আন্তর্জাতিক | `/category/world` |
| `business` | অর্থনীতি | `/category/business` |
| `sports` | খেলা | `/category/sports` |
| `culture` | বিনোদন | `/category/culture` |
| `opinion` | মতামত | `/category/opinion` |
| `tech` | প্রযুক্তি | `/category/tech` |
| `lifestyle` | জীবনযাপন | `/category/lifestyle` |
| `photostory` | ছবি | `/photostory` |
| `tube` | ভিডিও | `/tube` |
| `newstoday` | আজকের সংবাদ | `/newstoday` |
| `archive` | আর্কাইভ | `/archive-calendar` |

Setup used a transaction and `get_or_create(tenant=target, slug=slug)`. It created only missing rows. A before-and-after hash of all other tenants' category rows stayed identical. No migration, article generation, article publication, or backend deployment ran.

At verification time, this tenant had zero article records. All 15 menu destinations returned HTTP 200 and showed appropriate empty states. Playback with this tenant's live content remains dependent on published articles with generated media. The frontend data tests cover native video URLs, Bangla slugs, district queries, and menu mapping. Eight existing Django category and tenant-scope tests also passed.
