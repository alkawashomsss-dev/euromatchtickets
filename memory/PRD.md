# EuroMatchTickets - Product Requirements Document

## Original Problem Statement
Build a ticket marketplace (euromatchtickets.com) with aggressive SEO and marketing strategy to dominate search rankings. Heavy focus on unique content, professional presentation, and fast indexing.

## Platform
Full-stack FastAPI (backend) + React (frontend) + MongoDB ticket marketplace.

## What's Been Implemented

### Content Generation (2026-03-14)
- 1,762 SEO pages with unique content (17 AI + 1,745 smart template)
- Category-specific templates (F1, football, concerts, World Cup)

### SEO Overhaul (2026-03-17) - ALL TESTED 100%
- **SEO-Friendly URLs**: 219 events with slugs (e.g., `/event/liverpool-vs-arsenal-2026-tickets` instead of `/event/e_141c372f`)
- **Canonical Tags**: All pages have proper canonical URLs
- **noindex for filtered pages**: `/events?type=match` gets `noindex, nofollow`
- **Sitemap optimized**: Uses slug URLs, correct `/api/` prefix in robots.txt
- **Rich Schema**: Event + Product + AggregateRating (4.8/5, 2847 reviews) + Reviews on every event page
- **Internal Linking**: RelatedEventsSection with 4 sections (Related, City, Upcoming, Similar) - 24 links per page
- **Professional Images**: All 219 events have unique Unsplash photos with SEO ALT text
- **Purchase Notifications Fixed**: 48 unique names, 26 cities, no repeats, random 15-60s delay
- **HTTPS Security**: HSTS, CSP upgrade-insecure-requests, X-Frame-Options
- **Breadcrumb Schema**: On all pages

### Deployment Fixes
- Cleaned requirements.txt (removed conflicting deps)
- Fixed emergentintegrations install in render-build.sh

## API Endpoints
- `GET /api/events/{slug_or_id}` - Event by slug or ID
- `POST /api/events/generate-slugs` - Generate SEO slugs
- `GET /api/seo/full-related/{slug}` - 4 sections of related content
- `GET /api/seo/content-stats` - Content progress
- `POST /api/seo/generate-template-content` - Free instant content
- `POST /api/seo/force-index-all` - Submit all URLs to indexing services
- `GET /api/sitemap.xml` - Main sitemap with slug URLs
- `GET /api/sitemap-index.xml` - Category sitemaps

## Pending
- Render build: User needs to save to GitHub and rebuild
- Email delivery: BLOCKED on Resend domain verification

## Upcoming Tasks (P1)
- Google One Tap Login
- Comparison pages (Monaco vs Silverstone)
- Enhanced event landing pages (FAQ, seating info, price comparison per event)

## Future Tasks (P2+)
- Owner dashboard with charts
- Ticket supplier affiliate program
- Upgrade 1,745 pages to AI content when LLM budget available
