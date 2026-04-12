# EuroMatchTickets - Product Requirements Document

## Original Problem Statement
Build euromatchtickets.com, a premium ticket marketplace with aggressive SEO, top Google rankings, high conversion rates, and deep buyer trust. Full-stack FastAPI/React. Premium dark-themed F1-style UI/UX.

## Architecture
- Frontend: React (CRA) + Tailwind + Shadcn/UI + Framer Motion
- Backend: FastAPI + MongoDB
- Auth: Emergent-managed Google OAuth
- Theme: Dark (#0e0e14 bg, #e10600 red accents, F1/Global-Tickets style)

## What's Been Implemented

### UI/UX (DONE)
- Complete dark/red premium theme across 100+ components
- Cookie banner matching dark theme
- Trust elements, reviews, social proof

### SEO (DONE)
- 30+ Spa F1 keyword route variations in App.js
- SpaGPPage massive SEO golden page
- Pre-hydration canonical/meta scripts in index.html
- 9 sitemap XML files covering 2,307 URLs
- French/Italian/Spanish/German landing pages
- Trust/review SEO pages (7 language variants)
- Comparison pages (vs StubHub, Viagogo, Ticketmaster, SeatGeek)
- CTR-optimized titles with prices ("From €109 | 42% Cheaper")

### Blog & Content (DONE - April 12, 2026)
- 7 hardcoded SEO blog articles in BlogArticlePage.jsx
- BlogPage.jsx with category filter and search
- All 7 blog URLs indexed in sitemap-guides.xml
- Cross-links in: Footer, HomePage, SpaGPPage, BlogArticlePage

### Newsletter System (DONE - April 12, 2026)
- NewsletterSignup component on 8 major pages
- Backend POST /api/newsletter/subscribe (MongoDB)
- "GET TICKET PRICE ALERTS" with email + "Notify Me"
- Present on: HomePage, BlogPage, BlogArticlePage, SpaGPPage, TaylorSwiftLondonPage, MonacoGPPage, F1TicketsPage, ChampionsLeaguePage

### Internal Linking (DONE - April 12, 2026)
- Footer: "Guides & Blog" section (7 links)
- HomePage: "Latest Guides & Tips" section (4 cards)
- SpaGPPage: "Related Guides" section (3 links)
- BlogArticlePage: Multi-CTA ticket buttons + "More Guides"
- BlogPage: Cross-linking to F1, Football, Concerts pages

### Speed Optimizations (DONE)
- preconnect/dns-prefetch for images.pexels.com, static.prod-images
- lazy loading on all blog images
- PageLoader red theme

### Full Sitemap Indexing (DONE - April 12, 2026)
- 2,307 total URLs indexed
- All trust/review pages (7 languages)
- All blog articles (7)
- Spa Paddock Club, Super Bowl 2027, Bayern vs Real Madrid CL
- Keyword aliases use canonical tags (not duplicated in sitemap)

## Pending / Backlog
- P1: Owner Dashboard charts & sales reports
- P2: French/Italian SEO page content expansion
- P2: Custom email templates per event type
- P3: Retargeting pixel segmentation
- P3: A/B testing for SEO page titles
- BLOCKED: Sora 2 video (needs Universal Key balance)
- BLOCKED: Login with user's own Google OAuth credentials

## Testing Status
- iteration_46.json: 100% Pass (Dark Theme)
- iteration_47.json: 100% Pass (SEO Routing)
- iteration_48.json: 100% Pass (Blog, Cross-linking, Sitemap)
- iteration_49.json: 100% Pass (Newsletter, CTAs, SEO Titles)
