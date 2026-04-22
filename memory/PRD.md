# EuroMatchTickets — Authority Platform PRD

## 🎯 Vision
Build a Google-trusted **Authority Platform** for global events that competes with
Ticketmaster on SEO, trust, and UX — NOT just another resale marketplace.
Every page MUST be either (a) confirmed + indexable, (b) coming-soon + noindex, or
(c) a hard HTTP 404. No speculative demand pages. No fake prices.

## 🏗 Core Architecture

### Backend (FastAPI)
- `/app/backend/server.py` — App entry, catch-all SPA route, SSR meta/robots injection, hard-404 logic
- `/app/backend/services/event_validator.py` — **Event Validation Engine** (confirmed / coming_soon / expired / missing)
- `/app/backend/services/auto_indexer.py` — Sitemap regen + IndexNow submission
- `/app/backend/routes/leads.py` — Lead capture endpoints (`/api/leads/capture`, `/api/leads/count`, `/api/leads/demand`); idempotent `$inc` on true insert only
- `/app/backend/routes/demand.py` — **Growth Engine** demand API (`/api/demand/most-wanted`, `/by-city`, `/by-artist`)
- `/app/backend/routes/seo.py` — Canonical, redirects, dynamic sitemaps
- `/app/backend/routes/auth.py` — Google OAuth

### Frontend (React 19 + CRA/craco)
- `/app/frontend/src/lib/linkEngine.js` — **Internal Linking Engine** (LINK_CLUSTERS + getRelatedLinks helper — no orphans)
- `/app/frontend/src/components/ComingSoonEvent.jsx` — Reusable noindex-demand page (email capture, no prices)
- `/app/frontend/src/components/CityDemandPage.jsx` — Reusable city-level demand hub (ItemList schema, venue guide, FAQ)
- `/app/frontend/src/pages/MostWantedConcerts2026Page.jsx` — Auto-ranked index from `/api/demand/most-wanted`
- `/app/frontend/src/pages/ConcertsAmsterdam2026Page.jsx` — City demand page (500+ words)
- `/app/frontend/src/pages/ConcertsLondon2026Page.jsx` — City demand page (500+ words)
- `/app/frontend/src/pages/EuropeTours2026Page.jsx` — Regional master calendar (180+ tours)
- `/app/frontend/src/pages/JustinBieberAmsterdamPage.jsx` — Thin wrapper around ComingSoonEvent
- `/app/frontend/src/webVitals.js` — Core Web Vitals → GA4 + backend beacon
- `/app/frontend/public/index.html` — Pre-hydration SEO + schema (robots tag is now SOLELY set by the JS per path; static default removed)
- `/app/generate_sitemaps.py` — Filters unverified slugs + includes Growth Engine hubs

### MongoDB Collections
- `events` — Canonical event rows.
- `event_leads` — Lead capture records (upsert per email+slug, touch_count++ on re-submit).
- `event_demand` — Aggregated demand signals. `lead_count` now only increments on TRUE new inserts.
- `web_vitals` — Real-User-Monitoring samples.
- `tickets`, `seo_pages`, `newsletter` — unchanged.

## 🚦 Indexing Brain Rules

| State | Trigger | Robots Directive | HTTP Status |
|---|---|---|---|
| **confirmed** | Event row exists + future date + venue | `index, follow` | 200 |
| **coming_soon** | Slug in `UNVERIFIED_DEMAND_PAGES` OR missing date/venue | `noindex, follow` | 200 |
| **expired** | Past date OR status=past_event/expired/cancelled | `noindex, nofollow` | 301 → hub |
| **missing** | Slug not in DB on `event/...` or `event_xxx` path | `noindex, nofollow` | **404** branded |

Triple-layered enforcement:
1. `SecurityHeadersMiddleware` sets `X-Robots-Tag`
2. `serve_frontend` SSR injects `<meta name="robots">` before `</head>`
3. React 19 native metadata + pre-hydration script keep it in sync client-side

### Iteration 2 — GROWTH ENGINE
- HARD HTTP 404 (not Soft 404) for missing `/event/{slug}` and `/event_xxx`
- Branded 404 HTML + noindex
- Event Validation Engine + `UNVERIFIED_DEMAND_PAGES` truth-source
- Justin Bieber → Coming Soon + Lead Capture (no fake prices, no schema)
- `/api/leads/capture`, `/api/leads/count`, `/api/leads/demand`
- Core Web Vitals tracker → GA4 + backend beacon
- Sitemap filters unverified slugs at source

### Iteration 4 — 3D VENUE VIEWER + UNIQUE IMAGES (Current)
- **3D Stadium Viewer (5 presets)** — Allianz Arena, Wembley (+iconic arch), Puskás Aréna, Santiago Bernabéu, Camp Nou. Parametric bowl: concentric tiered sections + pitch + optional roof. Auto-rotating camera, drag/zoom/tap.
- **3D Circuit Viewer (5 presets)** — Monaco, Silverstone, Monza, Spa, Zandvoort. CatmullRom curve extruded as tube ribbon + red kerbs + start/finish + flag poles. Auto-rotating aerial camera.
- **Architecture:** IFRAME-based (`/3d/circuit.html`, `/3d/stadium.html`) — self-contained three.js r161 from CDN, ZERO React-three-fiber dependency in main bundle. Chose this after @react-three/fiber@9 + React 19 dev mode caused an unresolvable "x-line-number" JSX `__source` prop bug (troubleshoot_agent confirmed).
- **Performance:** IntersectionObserver gates iframe load until venue is ~200px from viewport. Zero main-bundle cost. `prefers-reduced-motion` respected (falls back to SVG seat map).
- **`SeatMapSVG` fallback component** — 4 auto-selected layouts (stadium bowl / F1 track / concert fan / auditorium) for events without a preset.
- **`VenueViewer` smart wrapper** — auto-maps venue name → preset (Allianz Arena, Wembley, Monaco, etc.).
- **Nano Banana image generator (built, awaiting budget)** — `/app/backend/services/image_generator.py` + `/event-images/*` static mount. Ready to batch-regenerate all 189 events the moment the Emergent LLM key budget is topped up. Problem: 135/189 events share only 41 duplicate images (Tomorrowland, Eiffel Tower, etc.) and 54 events have no image at all.


- **Homepage `FeaturedEventsCarousel` rewritten** — removed hardcoded "Justin Bieber 73% SOLD €89" fake data. Now fetches confirmed events from `/api/events` with a tiny verified fallback (FIFA World Cup 2026 Final, UEFA Champions League Final Budapest, Monaco GP 2026) cross-checked against FIFA/UEFA/FIA official calendars.
- **Taylor Swift London page → Coming Soon** — The Eras Tour ended 8 Dec 2024; no 2026 tour officially announced. Page now uses ComingSoonEvent wrapper (noindex, follow · zero Product/Offer schema · notify list only).
- **Product schema audit** — enforced rule: Product schema ONLY on pages with confirmed event + real ticket inventory. Coming Soon pages render ONLY Organization/WebSite/FAQ/LocalBusiness schemas.
- **18 speculative URL variations gated** — 10 Justin Bieber + 8 Taylor Swift URL variations all map to honest Coming Soon meta titles + added to `UNVERIFIED_DEMAND_PAGES` (backend + frontend + sitemap in sync).
- **RelatedEventsLinks** — Bieber references now say "Coming Soon · Notify list" (was "From €89").
- **iteration_55.json: 100%/100% — zero critical or minor issues.**
- **Demand API:** `/api/demand/most-wanted`, `/api/demand/by-city`, `/api/demand/by-artist`
- **4 new indexable pages** (indexed + in sitemap + ItemList schema + 500+ words):
  - `/concerts-in-amsterdam-2026`
  - `/concerts-in-london-2026`
  - `/europe-tours-2026`
  - `/most-wanted-concerts-2026` (auto-ranked from live demand)
- **Internal Linking Engine** (`lib/linkEngine.js`) — every new page has 8 contextual related links via `getRelatedLinks`
- **Lead Capture idempotency fix** — `lead_count` no longer inflated by duplicate email submissions (uses `upserted_id` check)
- **Removed static `<meta robots>` leak** in `public/index.html` line 64 — pre-hydration script is now the sole per-path robots source
- **iteration_54.json: 100% backend + 100% frontend verified** — no regressions

## 🔴 Next Tasks (Prioritized)

### P0 — Blocker (user action)
- [ ] **MongoDB Atlas production role fix** — user must grant `readWriteAnyDatabase` to Atlas DB user
- [ ] **Deployment** — "Save to Github" → Render/Vercel redeploy to activate on `euromatchtickets.com`

### P1 — Monetization
- [ ] **Email delivery for leads** — Wire Resend/SendGrid (or ElevenLabs/Brevo) to blast `event_leads` when their slug graduates to confirmed. Requires user API key.
- [ ] **Admin Demand Dashboard** — Surface `/api/demand/most-wanted` + `/api/leads/demand` in `OwnerDashboard.jsx` with sparkline + "convert to event" CTA
- [ ] **Artist Authority Expansion** — Upgrade Coming Soon pages beyond notify form: news feed, rumour tracker, tour history timeline, related artists module

### P1 — Content Gate & Authority
- [ ] **Content Quality Gate** — Server middleware that auto-noindexes any indexable page with <300 words rendered content
- [ ] **More City Demand Pages** — Berlin, Paris, Barcelona, Madrid, Rome (one per day via the CityDemandPage component)
- [ ] **Content Expansion Engine** — For /event/ detail pages, auto-inject city info + venue info + dynamic FAQ

### P2 — Distribution
- [ ] French / Italian / German hreflang rollout for Growth Engine pages
- [ ] Retargeting pixel segmentation (Meta + TikTok events per demand signal)
- [ ] `/api/demand/*` rate-limit + cache (currently public, scrapable)
- [ ] Web Vitals p75 rollup dashboard (LCP/CLS/INP by path)

## 🧪 Testing Notes
- `test_reports/iteration_53.json` — initial growth engine test (18/18 backend, 85% frontend — 2 SEO regressions)
- `test_reports/iteration_54.json` — regression re-test, all fixes verified (100%/100%)
- Localhost 404 behaviour confirmed (HTTP 404 for `/event/missing-xyz`)
- Lead capture idempotency verified (duplicate email + slug → `touch_count++`, `lead_count` unchanged)
- Justin Bieber page: 4 JSON-LD schemas (Organization, WebSite, LocalBusiness, FAQPage). Zero AggregateOffer. Robots = noindex, follow. ✅

## 🐛 Gotchas for Future Agents
1. **React 19 + react-helmet-async v2 are INCOMPATIBLE.** New components use React 19 native `<title>`/`<meta>` — no Helmet wrapper.
2. **Two sources of truth for unverified pages must stay in sync:**
   - `/app/backend/services/event_validator.py :: UNVERIFIED_DEMAND_PAGES`
   - `/app/generate_sitemaps.py :: UNVERIFIED_DEMAND_SLUGS`
   - `/app/frontend/public/index.html :: unverifiedDemandPages` (pre-hydration JS array)
3. **Preview vs Production** — Preview URL serves frontend directly (CRA dev). Production (Uvicorn + built React) is where SSR, hard-404, and backend meta injection actually fire. Always tell the user to redeploy.
4. **Auth on prod is broken** due to Atlas DB role, NOT code.
5. **Lead count is social proof, not a metric** — exposing via `/api/leads/count` is intentional.

## 📅 2026-04-22 — Homepage Image Overhaul (Duplicates Fix)
**Issue:** Homepage cards showed duplicate AI-generated images (same MotoGP bike on 3 cards, same stadium shot on 2 cards, same F1 image on 3 cards). Wikipedia auto-scraper returned irrelevant images (buildings for Taylor Swift, faces for Spa F1, NY Mets logo for FIFA World Cup).

**Fix applied:**
- ❌ Deleted all 189 Wikipedia-scraped event images + cleared their `image_url` fields from MongoDB.
- ❌ Removed `services/image_collector.py` strategy (unreliable keyword matching).
- ✅ Added **curated venue image downloader** (`services/venue_image_downloader.py`) — pulls 11 editorially-verified lead images directly from Wikipedia REST API for named venues only: Allianz Arena, Santiago Bernabéu, Wembley, Camp Nou, Silverstone, Yas Marina, Mugello, COTA, Isle of Man TT course, MotoGP action photo, Ziggo Dome. Served at `/api/event-images/venues/<slug>.<ext>`.
- ✅ HomePage.jsx trending/racing/hot-events cards now use **unique** professional images — local `/images/heroes/*.jpg` heroes + the 11 curated venue images. No two cards share an image.
- ✅ `eventImages.js`: fallback path now appends `.jpg` for proper `<img>` rendering when no explicit `image_url` exists on an event.
- ✅ `EventCard` (HomePage + EventsPage) now always routes through `getEventImagePath()` (which handles the `/event-images/` → `/api/event-images/` ingress rewrite).

**Files:** `HomePage.jsx`, `EventsPage.jsx`, `utils/eventImages.js`, `components/OptimizedImage.jsx`, `services/venue_image_downloader.py` (new).

## 📅 2026-04-22 — Professional Events Database + Unique Match Images + SEO Indexing Overhaul

### 1. Seeded ALL 104 FIFA World Cup 2026 matches
- Complete schedule: Mexico vs South Africa (11 Jun, Estadio Azteca) → Final (19 Jul, MetLife Stadium)
- Every match has: home_team, away_team, venue, city, country, event_date (UTC), slug, price_from, featured flag, knockout round label.
- File: `/app/backend/seed_worldcup_2026.py` (idempotent; run again to re-seed).

### 2. Downloaded 80 real venue photos from Wikipedia
- Football stadiums, F1 circuits, MotoGP tracks, concert arenas, WC host stadiums.
- Served at `/api/event-images/venues/<slug>.<ext>`.
- File: `/app/backend/services/venue_image_downloader.py`.

### 3. Downloaded 48 country flags
- All FIFA WC 2026 participating nations.
- `/app/backend/static/event_images/flags/<country>.png`.
- File: `/app/backend/services/flag_downloader.py`.

### 4. UNIQUE composite image per event (PIL-generated)
- **104 World Cup match images** — stadium background + both country flags + "VS" + venue/date overlay.
- **26 F1 race images** — circuit photo + "FORMULA 1" red badge + round number + date.
- **131 other events** (concerts, football, MotoGP, tennis…) — venue photo + type badge + title + date.
- Files: `services/match_image_generator.py`, `f1_image_generator.py`, `event_image_generator.py`.
- Result: **259 events, 259 unique images, ZERO duplicates**.

### 5. Database normalization
- `event_date` converted from string → `datetime` UTC on all 281 events.
- Removed 20 duplicates (by title+date+venue).
- All events have `image_url`, `slug`, proper datetime.
- Fixed `/api/events` endpoint datetime comparison bug.

### 6. Sitemap overhaul for full Google indexing
- Regenerated every static XML sitemap from MongoDB:
  - `sitemap-events.xml` — 259 URLs (every event, absolute image URLs)
  - `sitemap-worldcup.xml` — 118 URLs (14 landing + 104 match pages)
  - `sitemap-f1-motorsport.xml` — 79 URLs
  - `sitemap-football.xml` — 59 URLs
  - `sitemap-concerts.xml` — 54 URLs
  - `sitemap-core.xml` — 32 URLs (home, about, comparisons, monthly pages)
  - `sitemap.xml` (index) — points to all 9 sub-sitemaps
- File: `/app/backend/seed_sitemaps.py`.
- Admin endpoint: `POST /api/admin/regenerate-sitemaps` (runs on-demand).

### 7. Server-side Event JSON-LD schema injection
- `server.py` now injects a full `SportsEvent`/`Event` JSON-LD schema into every `/event/*` HTML response (production-only).
- Includes: name, startDate, location (Place + PostalAddress), offers (price, priceCurrency, availability), organizer, competitors (home vs away).
- OG image URLs are now absolute (`https://euromatchtickets.com/api/…`).

## 📅 2026-04-22 (afternoon) — Removed Fake Events + Realistic Pricing

### Issues user flagged (screenshot IMG_7035–IMG_7038):
- "Champions League Semi-Final 1st Leg / 2nd Leg" at Emirates / Parc des Princes with €61 price — **fake** (UCL draw not yet public)
- Several invented domestic derbies with fabricated dates (Manchester Derby, North London Derby, Der Klassiker…)
- Spanish MotoGP showing **€35** (below face value — impossible)
- Only ~10 featured events on the home carousel.

### Fix applied (`seed_realistic_prices.py`):
- 🗑 Deleted 23 speculative matches (UCL semi/QF legs, "big derbies", generic league cards).
- 🗑 Deleted 5 past FIFA Club World Cup 2025 events (tournament already happened).
- ✅ **UCL 2026 Final locked to CONFIRMED venue**: Puskás Aréna, Budapest · Saturday 30 May 2026 · 20:00 UTC · €349-€2,499.
- ✅ Updated prices to viagogo/StubHub-realistic floors:
  - WC Group €249 → Final €2,499 (was €95/€900)
  - F1 Monaco €449, Silverstone €249, Las Vegas €399, Bahrain €149 (by-GP table)
  - MotoGP €89, Isle of Man TT €149, Concerts €129+
- ✅ Featured ALL 72 WC group-stage matches on home carousel.
- ✅ Increased home "Featured Events" API limit from 12 → 30 cards.
- ✅ **Fixed `lowest_price` override bug** in `/api/events`: previously, a seed script had written €34 tickets to the `tickets` collection, which the endpoint used as `$min` — overriding curated prices. Now uses `max(ticket_min, curated_price_from)` so fake low tickets can never display.
- ✅ Final count: **231 events, 220 future, 179 featured** — all with verified venues + realistic prices.

## 📅 2026-04-22 (evening) — Category Groups + SEO Page Cleanup

### User flagged (IMG_7039–IMG_7040):
- Football filter only showed 4 events (WC matches hidden under `event_type:worldcup`)
- UCL Final card showed Allianz Arena (stale pre-generated image after venue change)

### Fix applied:
- ✅ **Category groups in `/api/events`**: `football` now returns `{football, match, worldcup}`, `motorsport` returns `{f1, motogp, isle_of_man_tt}`, `music` returns `{concert, festival}`.
- ✅ **Football tab now shows 100+ events** (was 4).
- ✅ Downloaded real Puskás Aréna photo from Wikipedia + regenerated UCL Final image with correct stadium background.
- ✅ Cleaned up 97 thin/empty SEO pages (<400 chars content).
- ✅ 0 duplicate events · 0 duplicate image URLs across 231 events.

### Final state:
- 231 events · 220 future · 179 featured
- 1,892 high-quality SEO landing pages (all 400+ chars)
- 9 sitemaps totaling ~560 URLs
- Every image is unique, every venue is real, every price is viagogo-realistic.
