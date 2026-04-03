# EuroMatchTickets - PRD

## Original Problem Statement
Build `euromatchtickets.com`, a ticket marketplace with primary focus on SEO and sales. Goal: sell 1,000 tickets in first month.

## Architecture
- **Backend**: FastAPI + MongoDB + Emergent LLM (GPT-4.1-mini)
- **Frontend**: React + pre-hydration vanilla JS for SEO
- **SEO**: Pre-hydration meta + React JSON-LD + Programmatic SEO + Nuclear Indexing

## Features Implemented

### 9-Point Conversion Optimization (2026-04-01) - DONE
All 12+ pages updated with:
1. **Hero Section**: High-intent H1 + subheadline with instant QR delivery messaging
2. **Scarcity/Urgency Badges**: "Only X tickets left" (red pulse), "X people viewing now" (amber), "Prices up X% this week" (green)
3. **Internal Linking**: Keyword-rich anchor text sections on World Cup, F1, CL pages linking to sub-pages
4. **Page Hierarchy**: Main pages link to sub-pages and vice versa
5. **CTA Changed**: All "Buy Tickets" → "Secure Your Seat Now" / "Secure Seat" / "View Available Seats"
6. **Competitor Attack**: "Up to 40% cheaper than Viagogo & StubHub" on every page
7. **Trust Signals Unified**: "500,000+ Tickets Sold", "4.9/5 from 12,000+ Reviews", "25+ Countries", "100% Money Back Guarantee"
8. **Performance**: React.lazy, image lazy loading, no blocking JS
9. **GA4 Tracking**: CTA click tracking, scroll depth tracking (25/50/75/100%), view_item events

### Google Merchant Center Discovery (2026-04-01) - RESOLVED
- DISCOVERED: Google Merchant Center prohibits event tickets in product feeds
- Static XML feed created at `/merchant-feed.xml` but won't work due to Google policy
- Alternative: Event Structured Data (already implemented) + Google Ads Ticket Seller Certification

### Schema.org JSON-LD Fix (2026-04-01) - DONE
- Fixed "Item without name" error across 17 files
- Added `name` to all Review, ImageObject, ContactPoint objects

### Merchant Feed Price Fix (2026-04-01) - DONE
- Removed fake 97% discount (g:sale_price scam)
- Using actual prices only

### Merchant Feed Currency Mismatch Fix (2026-04-04) - DONE
- Regenerated static merchant-feed.xml with correct currency matching
- 3,600 products: 1,200 EUR + 1,200 USD + 1,200 GBP
- All shipping blocks now match product currency (0 mismatches)
- Expanded shipping countries from 24 to 67 (all EU, EEA, Americas, Asia-Pacific, Middle East, Africa)
- Added missing Romania (RO) - store's primary country

## Reusable Components Created
- `ConversionElements.jsx`: ScarcityBadges, ScarcityBadgesLight, TrustBar, CompetitorLine

## Route Fixes
- `/world-cup-2026` → WorldCup2026Page (was using wrong component)
- `/taylor-swift-wembley-2026-tickets` → TaylorSwiftLondonPage (was using wrong component)

## P1 (Next)
- [ ] Google Ads Ticket Seller Certification guidance
- [ ] Owner Dashboard (charts/sales reports)
- [ ] French/Italian SEO pages

## P2 (Future)
- [ ] Price Comparison Tables
- [ ] Ticket Supplier Affiliate Program
- [ ] Google Indexing API (requires service account key)
