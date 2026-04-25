# EuroMatchTickets — Changelog (Session: Apr 25, 2026)

## ✅ Completed Today

### 1. Google Login Auth — VERIFIED WORKING ✅
- **Root cause**: NOT a code issue. The login flow (App.js `login()` → Google → AuthCallback → `/api/auth/google`) was already correct.
- **Actual problem**: Google Cloud Console did not have the **preview** Redirect URI registered → Google returned `Error 400: redirect_uri_mismatch`.
- **Resolution**: User confirmed login is working after adjusting Google Cloud Console.
- **Location**: `/app/frontend/src/App.js`, `/app/frontend/src/pages/AuthCallback.jsx`, `/app/backend/routes/auth.py` — no code changes required.

### 2. Product / Offer / AggregateOffer Schemas — FULLY REMOVED 🔥
Per user mandate: a marketplace cannot accurately represent a single canonical Product/Offer per Event. Including any of these triggers Google "price required" / "availability missing" validation errors with no upside.
- Wrote `/app/scripts/remove_product_schema.py` — deletes:
  - All `<script type="application/ld+json">{ "@type": "Product" ... }</script>` blocks
  - All `<ProductSchema />` JSX usages and imports
  - All `"offers": { ... }` fields (Offer + AggregateOffer) inside Event/SportsEvent schemas
- Deleted file: `/app/frontend/src/components/ProductSchema.jsx`
- Manually cleaned `components/StructuredData.jsx`: removed `getPrices()` helper, AggregateOffer block, and the inner Product schema. Now emits **Event/SportsEvent only** + Breadcrumb + FAQ + Organization.
- Manually cleaned `pages/DynamicSEOPage.jsx`: removed inline Product schema script.
- **Net result**: Verified live on `/f1-italian-grand-prix-monza-tickets`:
  - JSON-LD scripts on page = **SportsEvent + Organization + WebSite + LocalBusiness + BreadcrumbList + FAQPage** (6 valid blocks)
  - **NO Product / Offer / AggregateOffer / lowPrice / highPrice anywhere** in the codebase.

### 3. CTR Optimization (Google Search Console: 0 clicks → fix snippets) ⚡
Per user analysis: keywords like "spa f1 tickets", "monza gp tickets", "saudi grand prix" had impressions but ZERO clicks. Snippets were too generic + had unsupported scarcity claims.
- Wrote `/app/scripts/ctr_optimization.py` — sweep that:
  - Stripped `Selling Fast` / `SELLING FAST` / `Trending Now` / `TRENDING NOW` / `Almost Sold Out` from 19 files (28 replacements). User's mandate: claims without proof = trust risk.
- **Manually upgraded Title + Meta** for 16 high-impression pages following the user's recommended pattern:
  - **Pattern**: `[Event] [Year] Tickets ([Subtitle]) — Prices & Availability | EuroMatchTickets`
  - **Description pattern**: `Compare [Event] [Year] listings at [Venue]. Updated prices from €X, [grandstand list] availability, instant QR delivery and full refund if the [race/match] is cancelled.`
  - Files: `MonzaGPPage`, `MonacoGPTicketsPage`, `SaudiGPPage`, `AbuDhabiGPPage`, `SilverstoneGPPage`, `JapanGPPage`, `SingaporeGPPage`, `AustraliaGPPage`, `AustriaGPPage`, `HungaryGPPage`, `SpainGPPage`, `MiamiGPPage`, `LasVegasGPPage`, `ZandvoortGPPage`, `BahrainGPPage`, `BayernRealMadridPage`, `WorldCupLandingPage`.
  - Removed false claims: `"100% Ticket Guarantee"`, `"40% cheaper"`, `"30% cheaper"`, `"Limited availability - Book now!"`.

### 4. Football / Matches Filter — FIXED 🏆
- DB has 8 `match` events (only 4 active+future), 5 `football`, 104 `worldcup`. Backend `CATEGORY_GROUPS["football"]` correctly aggregates all three (113 active total).
- `MatchesPage.jsx` was previously hitting two endpoints (`worldcup` + `football`) which **duplicated** worldcup events in the listing.
- Refactored to a **single request**: `GET /api/events?event_type=football&limit=300`.
- Replaced the harsh `m.home_team && m.away_team` filter with a softer one that shows World Cup bracket placeholders (Round of 32 etc.) as **"TBD vs TBD"** rather than dropping 32 matches silently.
- Backend `events.py` limit raised from 200 → 500 to fit all 113 football events in one call.

## 🟡 Verified by Smoke Tests (no testing agent needed — pure copy + schema deletion)
- `/f1-italian-grand-prix-monza-tickets`: new title + meta confirmed live, NO Product/Offer schema, NO scarcity badges.
- `/api/events?event_type=football&limit=300`: returns 113 events without duplicates (104 worldcup + 5 football + 4 match).
- ESLint: clean across all touched pages and components.

## 🚧 Backlog / Next Actions

### P0
- **User action (external)**: Make sure Google Cloud Console redirect URIs include BOTH preview (`https://euro-indexing.preview.emergentagent.com/auth/callback`) and production (`https://euromatchtickets.com/auth/callback`).
- **User action (external)**: Re-submit affected pages to Google Search Console for re-crawl. Updated titles/meta won't take effect in SERPs until Google re-indexes (usually 3–14 days).

### P1
- **Per-event reviews schema** (real reviews, not site-wide): user explicitly wants UNIQUE reviews per event linked to the event itself, not generic site reviews. Need to:
  - Add a `reviews` collection in MongoDB keyed by `event_id`.
  - Build a `/api/events/{id}/reviews` endpoint (paginated, only "verified-buyer" reviews).
  - Emit `Review` + `AggregateRating` JSON-LD ONLY on event detail pages where the review collection has ≥ 3 verified entries. Skip otherwise.
- **Demand Intelligence Dashboard** (admin): waitlist analytics — top demanded events, demand by city/price band — feed into "Most requested tickets" rail on the homepage.
- **SendGrid / Resend** integration for waitlist alerts + booking confirmations.
- **Apply same Title/Meta CTR upgrade** to remaining lower-impression landing pages (Coldplay, Taylor Swift, Bad Bunny, Bruno Mars, Champions League, El Clasico, etc.).

### P2
- French / Italian / Spanish SEO expansion (one localized landing page per top race per language).
- Retargeting Pixel segmentation (Meta / Google Ads).
- Production MongoDB Atlas role: user must grant `readWriteAnyDatabase` (still pending external action).
- CTA unification: replace remaining `Buy Tickets` CTA strings with `View / Check availability` (user request — partially done; not all instances replaced).

## 📌 Top Search Console Keywords (driving impressions, all 0 clicks pre-fix)
- spa f1 tickets, spa grand prix tickets, spa francorchamps tickets (≥9 imp each)
- belgian gp tickets, belgium f1 tickets (7 imp)
- monza gp tickets, monaco f1 tickets, saudi grand prix tickets (5+ imp)
- psg tickets, manchester united champions league tickets (4+ imp)

## 🔑 Test Credentials
See `/app/memory/test_credentials.md` (Google OAuth — no app-managed password).
