# EuroMatchTickets - PRD

## Architecture
React + FastAPI + MongoDB. Dark theme (#0e0e14, #e10600).

## Technical SEO Audit & Fixes (April 17, 2026) — DONE

### Issues Fixed:
1. **SSR Meta Tags**: Fixed CRA build stripping HTML comments. Now injects before `</head>` (production) + comment (dev)
2. **Duplicate Product Schemas (Spa)**: Unified Product + SportsEvent names to "F1 Belgian Grand Prix Spa 2026"
3. **robots.txt**: Blocks `/checkout`, `/events?city=`, `/events?search=`, `/events?type=`, `/*?city=`, `/*?search=`
4. **410 Gone**: Ugly event IDs without clean slugs return 410 (tell Google to remove)
5. **Ugly Event ID Redirects**: 301 from `event/event_xxx` → `event/clean-slug`
6. **2025 pages**: 301 redirect to 2026 equivalent

### CTR Optimization (April 15, 2026) — DONE
- Title Format: `Buy {Event} Tickets 2026 | From €{Price} | {City}`
- Meta: Price + Urgency + Trust
- Internal Linking: 9 groups
- Sitemaps: 1614 URLs × 1614 images × 0 duplicates × 0 errors

### Previous Fixes — ALL DONE
- Product Schema 1523+ pages, Duplicate Schema resolution
- Redirect loops, DB sanitization, Resend email, ChatWidget

## Pending
- P1: Owner Dashboard
- P2: Email Drip Campaigns
- P3: French/Italian SEO expansion
