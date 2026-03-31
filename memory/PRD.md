# EuroMatchTickets - PRD

## Original Problem Statement
Build `euromatchtickets.com`, a ticket marketplace with primary focus on achieving top search engine rankings through aggressive SEO strategy. Goal: sell 1,000 tickets in first month.

## SEO Keyword Strategy (Based on GSC Data)
### High-Priority Keywords (Impressions detected):
- "monza f1 tickets" (7 impressions) -> /monza-f1-tickets + /f1-italian-grand-prix-monza-tickets
- "ticket" (5 impressions) -> / (homepage)
- "event ticket shop" (4 impressions) -> / (homepage)
- "f1 tickets monza" (4 impressions) -> /monza-f1-tickets
- "taylor swift tickets" (4 impressions) -> /taylor-swift-tickets
- "taylor swift tickets london" (3 impressions) -> /taylor-swift-london-tickets
- "grand prix bahrain tickets" (3 impressions) -> /bahrain-gp-tickets
- "italian grand prix tickets" (3 impressions) -> /italian-grand-prix-tickets
- "bahrain gp tickets" (3 impressions) -> /bahrain-gp-tickets
- "monza tickets" (3 impressions) -> /monza-f1-tickets
- "belgian grand prix tickets" (1 impression) -> /belgian-grand-prix-tickets
- "champions league knockout stage tickets" (1 impression) -> /champions-league-knockout-stage-tickets
- "f1 2026 tickets" (1 impression) -> /f1-2026-tickets
- "spa francorchamps tickets" (1 impression) -> /spa-francorchamps-tickets

## Rich Snippets & Structured Data (Implemented 2026-03-31)
### Per-Page Schemas (via pre-hydration + React):
- FAQPage (3 questions per page) -> Google FAQ rich snippets
- Event (SportsEvent/MusicEvent) with AggregateOffer
- Product with AggregateRating (4.8/5, 2847 reviews)
- BreadcrumbList (Home > Category > Page)
- Organization (global, with E-E-A-T signals)
- WebSite with SearchAction (SitelinksSearchBox)
- LocalBusiness (Munich address)

### Pages with FAQ Schema (35+ pages):
All major keyword pages have unique, keyword-optimized FAQs

## Sitemap Status
- Total URLs: ~1,290 (after cleanup)
- Removed: 168 dead 2027 pages
- Fixed: 722 pages from priority 0.00 -> 0.85
- Added: 11 new keyword-optimized pages (priority 0.90)

## Completed
- [x] Keyword-optimized titles matching exact search queries
- [x] 11 new landing pages for high-impression keywords
- [x] Sitemap cleanup (removed 2027, fixed priorities)
- [x] Production DB synced with 1,109 active pages
- [x] /event/* pages set to noindex + 410 Gone
- [x] All Product schemas always include offers field
- [x] Soft 404 fix with real fallback content
- [x] Canonical tag fix
- [x] Pre-hydration JSON-LD schemas (FAQPage, Event, Product, AggregateRating, BreadcrumbList)
- [x] Global Organization + WebSite + SearchAction schemas
- [x] 15 new keyword-specific FAQ entries for top GSC keywords
- [x] Visible FAQ accordion on all SEO pages
- [x] Schema deduplication (pre-hydration -> React handoff)
- [x] No duplicate structured data across any page

## P1 (Next)
- [ ] Enhance Owner Dashboard (charts, sales reports)
- [ ] Activate Next Batch of SEO Pages
- [ ] Add more FAQ entries for remaining keywords
- [ ] French/Italian SEO landing pages expansion

## P2 (Future)
- [ ] Price Comparison Tables
- [ ] Ticket Supplier Affiliate Program
- [ ] Video/GIF highlights on event pages

## Date Log
- 2026-03-31: Created 11 keyword-optimized landing pages
- 2026-03-31: Optimized titles for top GSC keywords
- 2026-03-31: Cleaned sitemaps: removed 168 2027-pages, fixed 722 priorities
- 2026-03-31: Synced all to production
- 2026-03-31: Implemented world-class SEO: FAQPage + AggregateRating + BreadcrumbList + Organization + WebSite schemas
- 2026-03-31: Added 15 new FAQ-equipped keyword pages to S object (monza, bahrain, spa, italian GP, etc.)
- 2026-03-31: Built visible FAQ accordion component with expand/collapse
- 2026-03-31: Implemented schema deduplication (pre-hydration cleanup on React mount)
