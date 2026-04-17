# EuroMatchTickets - PRD

## Architecture
React + FastAPI + MongoDB. Dark theme (#0e0e14, #e10600).

## Content SEO — Consistent Quality (April 17, 2026) — DONE

### Template Standard (every keyword page):
- SEOHead (title + description + canonical + image)
- ProductSchema + BreadcrumbSchema
- FAQSchemaScript (5 FAQs → Google rich snippets)
- EventFAQ component (visible on page)
- RelatedEventsLinks (internal linking)
- Rich text content (venue, dates, setlist/details, ticket categories, prices)

### 14 Keyword Pages — All Consistent:
1. JustinBieberAmsterdamPage (669L) ✅
2. SpaGPPage (729L) ✅
3. MonacoGPPage (316L) ✅
4. ChampionsLeagueTicketsPage (235L) ✅
5. ElClasicoTicketsPage (306L) ✅
6. TaylorSwiftLondonPage (332L) ✅
7. ColdplayPage (195L) ✅
8. WorldCupLandingPage (358L) ✅
9. F1TicketsPage (852L) ✅
10. TheWeekndPage (177L) ✅
11. BrunoMarsPage (170L) ✅
12. BadBunnyPage (119L) ✅
13. GunsNRosesPage (127L) ✅
14. ZandvoortGPPage (127L) ✅

### Reusable Components Created:
- EventFAQ.jsx: FAQ accordion + FAQSchemaScript
- RelatedEventsLinks.jsx: 9 link groups

### Data Accuracy:
- All dates from DB / verified sources
- Checkout shows real: name, date, time, venue, category
- Spa F1: corrected to Aug 28-30, €109, Stavelot
- Pre-hydration: single Event schema (no duplicate Product)

## Pending
- P1: Owner Dashboard
- P2: Email Drip Campaigns
