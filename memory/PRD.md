# EuroMatchTickets - PRD

## Original Problem Statement
Build a ticket marketplace at euromatchtickets.com with aggressive SEO strategy to rank #1 on Google and sell 1,000 tickets in the first month.

## What's Been Implemented

### Session 6 (March 19, 2026)
- EventDetailsPage Complete Overhaul (StubHub-style)
- Interactive SVG venue maps, real ticket grouping

### Session 7 (March 19, 2026)
- Bing IndexNow Fix: Switched to Bing URL Submission API
- Daily Bing Indexing Cron Job (100 URLs/day)

### Session 8 (March 19, 2026) - Current
- **SEO Keyword Optimization (47 keywords from Google Search Console)**:
  - Created 3 NEW landing pages targeting high-impression keywords:
    1. `/bayern-vs-real-madrid-tickets` - Bayern vs Real Madrid Champions League (1 click, 1 impression)
    2. `/bahrain-world-cup-tickets-2026` - Bahrain World Cup 2026 (4+ impressions)
    3. `/taylor-swift-london-tickets` - Taylor Swift London (6+ impressions)
  - Added alias routes for keyword variations:
    - `/taylor-swift-tickets-london` → Taylor Swift London page
    - `/buy-bahrain-world-cup-tickets` → Bahrain WC page
    - `/bayern-real-madrid-champions-league-tickets` → Bayern page
  - Optimized 7 EXISTING page titles/descriptions for exact keyword match:
    - BahrainGPPage: "Grand Prix Bahrain tickets", "Bahrain GP tickets", "Bahrain International Circuit"
    - TaylorSwiftPage: "Taylor Swift tickets Wembley"
    - F1LandingPage: "F1 tickets 2026"
    - ChampionsLeagueTicketsPage: "Champions League 2025 tickets", "UCL 2025 tickets"
    - ChampionsLeaguePage: "UEFA Champions League 2025", "UCL Final Munich"
    - TheWeekndPage: "The Weeknd tour 2026", "concert The Weeknd 2026"
    - MotoGPTicketsPage: "MotoGP tickets", "Moto GP 2026 calendar"
    - IsleOfManTTPage: "Isle of Man TT tickets 2025"
    - F1SchedulePage: "F1 schedule 2026", "F1 calendar 2026"
  - Added rich SEO content to BahrainGPPage (3 new h2 sections with keyword-dense text)
  - Updated sitemap with all new pages
  - Updated homepage internal linking to prioritize high-impression keywords
  - Submitted all new pages to Bing API + Yandex immediately

## All SEO Pages (Keyword → Page)
| Keyword | Page | Status |
|---------|------|--------|
| bayern vs real madrid tickets | /bayern-vs-real-madrid-tickets | NEW |
| grand prix bahrain tickets | /f1-bahrain-grand-prix-tickets | OPTIMIZED |
| taylor swift tickets wembley | /taylor-swift-wembley-2026-tickets | OPTIMIZED |
| taylor swift tickets london | /taylor-swift-london-tickets | NEW |
| bahrain world cup tickets 2026 | /bahrain-world-cup-tickets-2026 | NEW |
| f1 tickets 2026 | /f1-tickets-2026 | OPTIMIZED |
| bahrain gp tickets | /f1-bahrain-grand-prix-tickets | OPTIMIZED |
| champions league 2025 tickets | /champions-league-tickets | OPTIMIZED |
| the weeknd tour 2026 | /the-weeknd-2026-tickets | OPTIMIZED |
| motogp tickets | /motogp-tickets | OPTIMIZED |
| isle of man tt tickets | /isle-of-man-tt-tickets | OPTIMIZED |
| f1 schedule 2026 | /f1-schedule-2026 | OPTIMIZED |

## Prioritized Backlog

### P0 (Completed)
- ~~EventDetailsPage overhaul~~ DONE
- ~~Bing IndexNow fix~~ DONE
- ~~SEO keyword optimization~~ DONE

### P1
- Owner Dashboard with charts and sales reports
- Login flow with user's own Google OAuth credentials (BLOCKED)

### P2
- More SEO content pages for remaining keywords
- Improve price comparison tables

### P3
- Ticket supplier affiliate program
- AI content enhancement
- Multi-language expansion (Spanish, German, Arabic)
