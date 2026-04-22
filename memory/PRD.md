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
