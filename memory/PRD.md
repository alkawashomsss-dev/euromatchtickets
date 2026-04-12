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
- 9 sitemap XML files (core, f1, football, concerts, worldcup, cities, events, international, guides)
- French/Italian/Spanish/German landing pages
- Trust/review SEO pages (euromatchtickets-review, -legit, -safe, etc.)
- Comparison pages (vs StubHub, Viagogo, Ticketmaster, SeatGeek)

### Blog & Content (DONE - April 12, 2026)
- 7 hardcoded SEO blog articles in BlogArticlePage.jsx
- BlogPage.jsx rewritten with hardcoded articles, category filter, search
- All 7 blog URLs added to sitemap-guides.xml
- Blog cross-links added to: Footer, HomePage, SpaGPPage, BlogArticlePage

### Internal Linking (DONE - April 12, 2026)
- Footer: Added "Guides & Blog" section (7 links to blog articles)
- HomePage: "Latest Guides & Tips" section (4 featured blog cards)
- SpaGPPage: "Related Guides" section (3 blog article links)
- BlogArticlePage: "More Guides" cross-links + multi-CTA ticket buttons
- BlogPage: Cross-linking sections to F1, Football, Concerts ticket pages

### Speed Optimizations (DONE - April 12, 2026)
- Added preconnect/dns-prefetch for images.pexels.com and static.prod-images
- PageLoader spinner updated to red theme (#e10600)
- All blog images use loading="lazy"

## Pages Count
- 90+ unique page components
- 30+ Spa F1 keyword routes
- 19 French routes, 19 Italian routes, 20 Spanish routes, 6 German routes
- 12 monthly event pages
- 7 blog articles
- 4 comparison pages
- 8 team hub pages

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
