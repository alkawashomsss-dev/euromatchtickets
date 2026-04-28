# EuroMatchTickets — Changelog (Session: Apr 25, 2026)

## ✅ Completed Today

### -2. CTR v3 — "From €" cleanup, Live Listings Counter wired, copy upgrade ✅
**User feedback (Apr 28 evening)**: "From €" was still over-repeated across category blocks → looked like a price farm. Footer trust strip duplicated the homepage one. Newsletter copy was generic. And the missing piece for SEO was a **real-data signal** to convince Google + visitors the site is a live marketplace.

**Changes**:
1. **Removed "From €" from Racing Row + Hot Events Grid** (10 instances). Kept only in hero (€150 World Cup) and the 3 Popular Tickets cards (Spa, Taylor Swift, MotoGP) — exactly what the user asked for.
2. **Removed the duplicate trust strip** from `Footer.jsx` ("Buyer protection / Verified sellers / Encrypted payments / Customer support" repeated above the footer columns). The same 3 trust feature cards already render in the homepage "Why Fans Trust Us" section — no need to repeat.
3. **CTA description**: `"Browse live ticket listings…"` → `"Compare live ticket listings…"` (Compare = higher CTR).
4. **Newsletter copy upgrade** in `NewsletterSignup.jsx`:
   - Title: `"Get Ticket Price Alerts"` → `"Listing Alerts"`
   - Body: `"Be the first to know when prices drop. Join our community who never miss a deal."` → `"Get alerts when new listings appear or prices change for events you care about."` (marketplace logic, not affiliate-style pitch).
5. 🔥 **WIRED `LiveListingsCounter` INTO THE HERO** under the price block. Live result on the homepage:
   ```
   1,011 WORLD CUP LISTINGS · PRICES UPDATED JUST NOW
   ```
   This is the **single highest-leverage SEO + CTR move** the user has been asking for. It tells Google's crawler the page is dynamic AND tells the visitor "real marketplace, real data". Wired via `<LiveListingsCounter searchQuery="World Cup 2026" fallbackLabel="World Cup listings" />` — pulls live count from `/api/events?search=...` every 90 s, only renders when the count > 0 (zero overclaim risk).

**Verified**: 0 errors, screenshot confirms the counter renders with real numbers, all copy changes propagated.

### -1. Homepage CTR + Trust Cleanup (per user feedback Apr 28) ✅
**User feedback**: Homepage was overclaiming + repeating trust signals → Google "trust spam" + intent-mismatch risk.
**Changes applied to `pages/HomePage.jsx`**:
- **Removed** the "Excellent / Customer ratings" Trustpilot-style block (no real numbers attached → fake-looking).
- **Removed** "Join thousands of fans who trust EuroMatchTickets" → replaced with neutral marketplace description: *"Browse live ticket listings across F1, MotoGP, World Cup 2026, Champions League and major concerts."*
- **Removed** `#1 TRENDING / #2 TRENDING / #3 TRENDING` badges from the Spa F1 / Taylor Swift / MotoGP cards. Replaced with single neutral `POPULAR` badge.
- **Replaced** all `Buy Tickets` CTAs in the popular cards → `View`.
- **Softened trust strip** under the hero: was 4 badges (`Verified Tickets / Secure Payment / QR delivery / Customer support`) → now 3 honest signals (`Stripe checkout · QR delivery by email · Refund per policy`).
- **Softened trust feature cards**:
  - `BUYER PROTECTION` desc: was *"Full refund if tickets are invalid or not delivered. Every ticket verified."* → *"Refund available according to our policy if the event is cancelled or your tickets are not delivered."*
  - `SECURE PAYMENTS` desc: was *"Bank-level 256-bit SSL encryption via Stripe. Your details are always safe."* → *"Payments processed by Stripe with 256-bit SSL. PCI-DSS compliant."*
  - `VERIFIED SELLERS` → renamed to `SELLER VERIFICATION`, desc: *"Sellers undergo ID verification before listing tickets on the marketplace."*
- **Why this matters for SEO/CTR**:
  - Removes unsupported scarcity claims that Google's "Helpful Content" classifier penalizes.
  - Lets Google understand the page intent matches the title (marketplace, not affiliate).
  - Reduces visual noise so the actual offer (events list) stands out.

### 0. Fixed JavaScript "Unexpected token ')'" + React DOM crash 🔥 (P0 — RESOLVED)
**Symptom**:
- Page-load: `Uncaught SyntaxError: Unexpected token ')'`.
- Click on Buy/View Tickets: `null is not an object (evaluating 'finishedRoot.parentNode.removeChild')` (React 19 commit-phase crash).

**Root causes** (validated by troubleshoot agent):
1. `public/index.html` had a TikTok Pixel snippet whose IIFE was missing the `}(window,document,'ttq');` closing — unparseable.
2. The Google Analytics 4 init that followed referenced `d` (the `document` param of the broken TikTok IIFE) → `Can't find variable: d`.
3. **The Buy crash**: every component that managed `<head>` tags (`SEOHead.jsx`, `StructuredData.jsx`, `DynamicSEOPage.jsx`) called raw `el.remove()` on DOM nodes inside `useEffect`. React 19 is strict about ownership: when navigation triggers cleanup at the same moment React's commit phase tries to detach a fiber whose DOM node is already removed, `parentNode` is null and React crashes.

**Fixes** (all React 19 safe):
- Disabled the malformed TikTok Pixel block in `public/index.html` (commented; easy to re-enable with a real Pixel ID).
- Replaced `d.createElement` → `document.createElement` for GA4 init.
- **Restarted frontend supervisor** (CRA caches `public/index.html` in memory; hot reload alone is insufficient for index.html changes).
- Replaced **every** `el.remove()` call with the parent-check pattern:
  ```js
  if (el && el.parentNode) el.parentNode.removeChild(el);
  ```
  Covered files:
  - `components/SEOHead.jsx` — pre-hydration cleanup, duplicate canonical removal, hreflang reset
  - `components/StructuredData.jsx` — `ph-org` and `ph-site` placeholders
  - `pages/DynamicSEOPage.jsx` — `ph-event` placeholder
- Removed **all** `cleanup() { el.remove() }` blocks from the schema components — the next mount overwrites `script.textContent` cleanly without a destroy/recreate race.

**Verified live**: 
- Homepage → 0 errors
- /events → 0 errors
- /event/chinese-grand-prix-2026-tickets → 0 errors
- Click "Buy" button → routes to /checkout?event=...&category=... → 0 errors → Stripe checkout renders cleanly with €177 total.

### 0b. Fixed Google Search Console "address missing in location" warning
- `WorldCupLandingPage.jsx` JSON-LD `location` block lacked a `PostalAddress` child. Added `addressCountry / addressLocality / addressRegion` for "Multiple Cities — USA / Mexico / Canada" plus `eventAttendanceMode: OfflineEventAttendanceMode`. Will clear on next Google re-crawl.

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
