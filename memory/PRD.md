# EuroMatchTickets - Product Requirements Document

## Original Problem Statement
Build a ticket marketplace (euromatchtickets.com) with aggressive SEO strategy to dominate search rankings and sell 1,000 tickets in the first month.

## Architecture (v2.0 - Modular)
```
backend/
├── server.py              (slim entry point)
├── routes/ (auth, events, tickets, seo, admin, marketing, seed)
├── seo_bot.py             (scheduled SEO bot with IndexNow)
├── generate_sitemaps.py   (static sitemap generator script)
└── uploads/
frontend/public/
├── robots.txt             (max-image-preview:large, no /api/ block)
├── sitemap-index.xml      (static XML)
├── sitemap.xml            (static XML alias)
├── sitemaps/*.xml          (7 category sitemaps)
└── [IndexNow key].txt     (verification file)
```

## Completed Features (This Session - March 12, 2026)

### 1. Sell Your Tickets (Tested 100%)
- Multi-step form, file upload, backend API

### 2. Customer Reviews System (Tested 100%)
- Frontend connected to backend API, AggregateRating schema

### 3. Schema.org Complete Fix
- ALL 37 event pages: location, eventStatus, endDate, image, organizer
- ALL 32 AggregateOffer pages: url, validFrom, highPrice
- F1 Schedule nested items: description, offers
- All PostalAddress properly structured

### 4. Static Sitemaps (Fix HTML issue)
- Generated static XML files in frontend/public/
- Content-Type: application/xml (verified)
- Total: 1,849 URLs (pages:77, F1:528, Football:292, Concerts:850, WorldCup:22, Cities:80)

### 5. robots.txt Fixed
- Removed Disallow /api/
- Added max-image-preview:large, max-snippet:-1, max-video-preview:-1
- Points to root-level sitemaps

### 6. IndexNow Integration
- POST /api/seo/indexnow - Submit all 1762 SEO pages to Bing/Yandex
- POST /api/seo/submit-url - Submit single URL
- Verification key file in frontend/public/
- SEO bot updated to use IndexNow (replaces deprecated Google/Bing ping)

### 7. Event Images Fixed
- Added images to 213 events (was 94 without images)
- Varied images per event type (F1, concerts, football, etc.)

### 8. Auth Improvements
- localStorage token storage for cross-origin support
- Better error messages on auth failure

### 9. Organization + WebSite Schema (in index.html)
- Organization with AggregateRating
- WebSite with SearchAction for Google Sitelinks

## Prioritized Backlog

### P1 - Deploy to live site
- [ ] "Save to GitHub" → Render auto-deploys
- [ ] Submit sitemap: https://euromatchtickets.com/sitemap-index.xml
- [ ] Run IndexNow: POST /api/seo/indexnow

### P2 - More Content (User's 12-phase plan)
- [ ] Generate 300+ articles (AI content)
- [ ] Generate 200+ MotoGP pages
- [ ] Comparison pages (Monaco vs Silverstone, etc.)
- [ ] City guide pages

### P3 - Technical
- [ ] Verify Resend domain for email
- [ ] Owner dashboard with charts
- [ ] Stripe Connect

## 3rd Party Integrations
Stripe, MongoDB Atlas, OpenAI GPT-4o, Facebook Pixel, Google Analytics, IndexNow, Resend (blocked)
