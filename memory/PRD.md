# EuroMatchTickets - PRD

## Architecture
React + FastAPI + MongoDB. Dark theme (#0e0e14, #e10600).

## CTR & SEO Optimization (April 15, 2026) — DONE

### Title Format: `Buy {Event} Tickets 2026 | From €{Price} | {City}`
### Meta Description: Price + Urgency + Trust (100% Money-Back Guarantee)

#### 10 Priority Pages:
1. Justin Bieber Amsterdam — From €89 | Johan Cruijff ArenA
2. Spa F1 Belgian Grand Prix — From €109 | Spa-Francorchamps
3. Monaco Grand Prix — From €249 | Monte Carlo
4. Champions League — UCL Final From €85 | Munich
5. El Clasico — Real Madrid vs Barcelona From €89
6. Taylor Swift London — Wembley From €79
7. Coldplay Tour — Europe Concerts From €69 | Barcelona
8. FIFA World Cup 2026 — From €65 | USA, Mexico, Canada
9. Formula 1 Tickets — All 24 Grand Prix From €79
10. Premier League → redirects to Champions League

#### Internal Linking (RelatedEventsLinks component):
- 9 link groups connecting all key pages bidirectionally
- Contextual "You May Also Like" sections on every priority page

#### Sitemap: 100% Clean, 100% Images
- 1614 unique URLs across 9 sitemaps
- EVERY URL has `<image:image>` tag
- Zero duplicates across all sitemaps
- Zero query parameter URLs
- Fixed wrong images (Champions League→football, F1→f1-red)
- Removed redirect pages from sitemaps
- Generator script (`generate_sitemaps.py`) permanently fixed

#### New 301 Redirects:
- /formula-1-tickets → /f1-tickets
- /coldplay-tour-2026-tickets → /coldplay-tour-2026
- /fifa-world-cup-2026-tickets → /world-cup-2026-tickets
- /monaco-grand-prix-2026-tickets → /f1-monaco-grand-prix-tickets
- /premier-league-tickets → /champions-league-tickets

## Product Schema Expansion (April 14, 2026) — DONE
- 1523+ pages with Product JSON-LD
- All 36 dedicated pages + EventDetailsPage + DynamicSEOPage

## Previous Fixes — ALL DONE
- SSR Meta Tag Injection (server.py)
- Duplicate Product Schema resolution (39 pages)
- 15 redirect loops fixed
- CheckoutPage 404 elimination
- DB sanitization (dates, prices, duplicates)
- Resend email integration
- ChatWidget replacement

## Pending
- P1: Owner Dashboard (charts, sales reports)
- P2: Email Drip Campaigns (segmented by event type)
- P3: French/Italian SEO expansion
- P4: Retargeting Pixel segmentation
- P5: Social Signals (Reddit/TikTok tracking)
