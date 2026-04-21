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
- `/app/backend/routes/leads.py` — Lead capture endpoints (`/api/leads/capture`, `/api/leads/count`, `/api/leads/demand`)
- `/app/backend/routes/seo.py` — Canonical, redirects, dynamic sitemaps
- `/app/backend/routes/auth.py` — Google OAuth

### Frontend (React 19 + CRA/craco)
- `/app/frontend/src/components/ComingSoonEvent.jsx` — **Reusable Coming-Soon hero** (noindex, no prices, email capture)
- `/app/frontend/src/pages/JustinBieberAmsterdamPage.jsx` — Uses ComingSoonEvent (was fake demand page)
- `/app/frontend/src/webVitals.js` — **Core Web Vitals tracker** (LCP/CLS/INP/FCP/TTFB → GA4 + backend beacon)
- `/app/frontend/src/index.js` — Boots React + fires web-vitals reporter
- `/app/generate_sitemaps.py` — Filters unverified slugs from sitemap (set `UNVERIFIED_DEMAND_SLUGS`)

### MongoDB Collections
- `events` — Canonical event rows. `status`, `event_date`, `venue` drive validation.
- `event_leads` — Lead capture records (email + slug + artist + city, upserted on duplicates).
- `event_demand` — Aggregated demand signals per slug (`lead_count`, first/last signal).
- `web_vitals` — Real-User-Monitoring samples (LCP, CLS, INP, FCP, TTFB).
- `tickets`, `seo_pages`, `newsletter` — unchanged.

## 🚦 Indexing Brain (the new rules)

| State | Trigger | Robots Directive | HTTP Status |
|---|---|---|---|
| **confirmed** | Event row exists + `event_date >= today` + `venue` present | `index, follow` | 200 |
| **coming_soon** | Slug in `UNVERIFIED_DEMAND_PAGES` OR event missing date/venue | `noindex, follow` | 200 |
| **expired** | `event_date < today` OR `status in {past_event, expired, cancelled}` | `noindex, nofollow` | 301 → hub |
| **missing** | Slug not in DB AND path starts with `event/` OR `event_xxx` | `noindex, nofollow` | **404** (branded) |

Enforcement is TRIPLE-layered:
1. `SecurityHeadersMiddleware` sets `X-Robots-Tag`
2. SSR in `serve_frontend` injects `<meta name="robots">` before `</head>`
3. React component `<ComingSoonEvent>` renders `<meta name="robots" content="noindex, follow">` natively (React 19 hoists to <head>)

## ✅ Implemented — Feb 2026 (this session)

- **PHASE 1 Critical**
  - HARD HTTP 404 for missing `/event/{slug}` and `/event_xxx` URLs (was Soft 404)
  - Branded 404 HTML with internal links back to healthy hubs
  - Redirect logic for expired events → category hub (301)
- **PHASE 2 System**
  - `event_validator.py` validation engine (confirmed / coming_soon / expired / missing)
  - `UNVERIFIED_DEMAND_PAGES` set — central truth source for noindex pages
  - SSR meta injection respects validator status
- **PHASE 3 Authority (partial)**
  - Justin Bieber Amsterdam 2026 → Coming Soon + history + artist FAQ + related confirmed tours
  - Reusable `ComingSoonEvent` component for any future speculative artist page
- **PHASE 4 Data & Monetization**
  - `/api/leads/capture` — Upsert-safe lead capture → `event_leads`
  - `/api/leads/count` — Social-proof counter (public)
  - `/api/leads/demand` — Admin-only aggregated demand report (x-admin-token)
  - Demand signal bucket `event_demand` collection with `lead_count`
- **PHASE 5 Performance**
  - Core Web Vitals tracker → GA4 `event()` + beacon to `/api/metrics/vitals`
  - MongoDB `web_vitals` collection for RUM history
  - Sitemap generator filters out unverified slugs at source

## 🔴 Next Tasks (Prioritized)

### P0 — Blocker
- [ ] **MongoDB Atlas production role fix** — user must grant `readWriteAnyDatabase` to the Atlas DB user (agent cannot fix; user verification pending)
- [ ] **Deployment** — Changes only take effect after "Save to Github" + Render/Vercel redeploy

### P1 — High value
- [ ] **Artist Authority Pages** — Expand beyond Coming Soon: news feed, rumours, past tour history, discography blocks (for Justin Bieber, Harry Styles, etc.)
- [ ] **City Demand Pages** — "Concerts in Amsterdam 2026", "Events in Europe" hub pages with internal-linking engine
- [ ] **Email delivery for leads** — Wire Resend/SendGrid to the `event_leads` → send "tickets are live" blast when slug graduates to confirmed
- [ ] **Content Quality Gate** — ≥300 word minimum, noindex pages below threshold automatically
- [ ] **Admin Demand Dashboard** — Surface `/api/leads/demand` rows in `OwnerDashboard.jsx` with sparkline + "convert to event" CTA

### P2 — Nice-to-have
- [ ] French / Italian SEO expansion
- [ ] Retargeting pixel segmentation
- [ ] Cleanup of 2025 ↔ 2026 overlap / duplicate-content risk
- [ ] Web Vitals rollup dashboard (p75 LCP/CLS/INP by path)

## 🧪 Testing Notes

- Localhost 404 on `/event/missing-xyz` returns HTTP 404 ✅
- Lead capture upsert verified (no duplicate inserts) ✅
- Web vitals ingest accepts LCP/CLS and rejects garbage ✅
- Invalid email on `/api/leads/capture` returns 422 (Pydantic EmailStr) ✅
- Justin Bieber page renders Coming Soon hero, no fake prices, `<meta robots>` present ✅
- Hot reload confirmed for React 19 — removed `react-helmet-async` usage in new component (v2 is incompatible with React 19)

## 🐛 Gotchas for Future Agents

1. **React 19 + react-helmet-async v2 are INCOMPATIBLE.** New pages should use React 19 native `<title>`, `<meta>` — no Helmet wrapper needed. React hoists them to `<head>` automatically.
2. **Two sources of truth for unverified pages** must stay in sync:
   - `/app/backend/services/event_validator.py :: UNVERIFIED_DEMAND_PAGES`
   - `/app/generate_sitemaps.py :: UNVERIFIED_DEMAND_SLUGS`
3. **Preview vs Production** — The preview URL routes non-/api to the CRA dev server, so SSR meta injection and hard-404s only fire against `localhost:8001` (unit tests) or the real production URL. Always tell the user to redeploy before verifying on euromatchtickets.com.
4. **Auth on prod is broken** due to Atlas DB role, NOT code. Do not rewrite auth.
