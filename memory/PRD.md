# EuroMatchTickets - PRD

## Architecture
React + FastAPI + MongoDB. Dark theme (#0e0e14, #e10600).

## Content SEO Boost (April 17, 2026) — IN PROGRESS

### Pages Enhanced with Rich Content:
- TheWeekndPage: FAQ Schema + 5 FAQs + Rich content + Internal Links + Correct dates/venues
- BrunoMarsPage: FAQ Schema + 5 FAQs + Rich content + Internal Links + Correct dates/venues
- SpaGPPage: Already strong (729L, FAQ:21, Schema:5, Links:2) — dates fixed
- JustinBieberAmsterdamPage: Already strong (669L, FAQ:21, Schema:4, Links:2)
- MonacoGPPage: Already strong (305L, FAQ:6, Links:2)
- F1TicketsPage: Already strong (841L, FAQ:2, Links:6)

### Still Need Enhancement:
- BadBunnyPage (123L, FAQ:0, Links:0)
- GunsNRosesPage (128L, FAQ:0, Links:0)
- ZandvoortGPPage (158L, FAQ:0, Links:0)

### Data Accuracy Fixes:
- Spa F1: date 2026-08-28→30, price €109, venue Stavelot
- Pre-hydration: removed duplicate Product schemas
- Checkout: real data from DB (date, time, venue, category)

## Previous Fixes — ALL DONE
- SSR Meta, robots.txt, 410/301, sitemaps 1614x1614
