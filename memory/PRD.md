# EuroMatchTickets - PRD

## Original Problem Statement
Build a ticket marketplace at euromatchtickets.com with aggressive SEO strategy to rank #1 on Google and sell 1,000 tickets in the first month.

## What's Been Implemented

### Sessions 1-5 (Previous)
- Full-stack marketplace, 80+ SEO pages, Stripe checkout, Google OAuth
- Render deployment fix, SEO overhaul, Bing verification

### Session 6 (March 19, 2026)
- EventDetailsPage StubHub-style overhaul with interactive SVG venue maps

### Session 7 (March 19, 2026)
- Bing IndexNow fix (Bing URL Submission API)
- Daily Bing indexing cron job (100 URLs/day)

### Session 8 (March 19, 2026)
- SEO keyword optimization for 47 Google Search Console keywords
- 3 new landing pages: Bayern vs Real Madrid, Bahrain World Cup, Taylor Swift London
- Optimized 9 existing page titles/descriptions for exact keyword match

### Session 9 (March 20, 2026) - Current
- **13 Ultra-Premium Realistic Events Added:**
  - FIFA Club World Cup 2025 (5 matches: Final, Semi-Final, Group Stage)
  - FIFA World Cup 2026 (3 premium matches: Final €968-€41K, USA vs England, Brazil vs Argentina)
  - Boxing: Tyson Fury vs Oleksandr Usyk III (€501-€75K), Canelo vs Benavidez (€299-€50K)
  - UFC 310 Heavyweight Championship (€399-€30K)
  - Bayern Munich vs Real Madrid UCL QF (home + away leg)
- **1,425 new realistic tickets** with market-accurate pricing tiers
- **4 AI-generated professional images**: Boxing arena, World Cup stadium, UFC octagon, VIP suite
- All events use real venues, real dates, real pricing tiers (up to €57,000 for WC Final Platinum)

## Key Events (Premium - Competitive Pricing)
| Event | Venue | Price Range | Tickets |
|-------|-------|-------------|---------|
| WC 2026 Final Premium | MetLife Stadium, NY | €260 - €1,648 | 95 |
| Fury vs Usyk III | Kingdom Arena, Riyadh | €175 - €2,050 | 92 |
| Canelo vs Benavidez | T-Mobile Arena, Vegas | €152 - €1,623 | 102 |
| CWC 2025 Final | MetLife Stadium, NY | €153 - €790 | 135 |
| Bayern vs Real Madrid UCL | Allianz Arena, Munich | €102 - €730 | 113 |

### Session 10 (March 20, 2026) - Current
- **Price Adjustment - Cheapest in Market:**
  - Scaled down ALL tickets across all events with aggressive pricing formula
  - Updated seed functions to use competitive prices for future re-seeding
  - Most expensive ticket: ~€2,050 (Fury vs Usyk Platinum)
  - Average event starting price: €24-€150

- **MotoGP & Isle of Man TT Circuit Maps:**
  - Created interactive SVG MotoGP circuit map with: Main Grandstand, Turn 1, Chicane, Pit Straight, Final Corner, GA Zones, VIP Village, Paddock Access
  - Created Snaefell Mountain Course map for Isle of Man TT with: Grandstand (Douglas), Bray Hill, Quarter Bridge, Ballaugh Bridge, Ramsey Hairpin, The Mountain
  - Updated ticket section names to match real circuit locations
  - Generated 4 professional adrenaline-pumping motorsport images
  - Updated 61 MotoGP + 7 TT events with new images
  - All tests passed (18/18 backend, 100% frontend)

## Prioritized Backlog
### P1
- Owner Dashboard with charts and sales reports
- Login flow with user's own Google OAuth credentials (BLOCKED)
### P2
- More SEO content pages
### P3
- Affiliate program, AI content, Multi-language
