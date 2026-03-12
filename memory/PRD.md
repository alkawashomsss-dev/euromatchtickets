# EuroMatchTickets - Product Requirements Document

## Original Problem Statement
Build a ticket marketplace (euromatchtickets.com) with aggressive SEO strategy to dominate search rankings and sell 1,000 tickets.

## Architecture
- Frontend: React (CRA) + Tailwind CSS + Shadcn UI
- Backend: FastAPI + MongoDB (Motor)
- Hosting: Render | DB: MongoDB Atlas | Payments: Stripe
- Auth: Direct Google OAuth 2.0
- SEO: IndexNow, Image Sitemaps, Schema.org, GZip, WebP

## Completed Features (Mar 12, 2026)

### AI-Generated Professional Images
- 15+ unique AI images across all categories (no duplicates)
- F1 = Red Ferrari theme, Football = Green stadium, Concert = Purple laser, MotoGP = Orange, World Cup = Gold trophy
- 3 responsive sizes per image: sm(400px), md(800px), lg(1536px) in WebP + JPEG fallback
- Professional logo: favicon, apple-touch-icon, OG image, manifest.json
- Smart image mapping: each event gets unique image via hash function

### Google Image Sitemap (NEW)
- All 1,849+ URLs now include `<image:image>` tags for Google Image Search indexing
- Category-aware image assignment (F1 pages → F1 red image, concerts → purple image, etc.)
- `xmlns:image` namespace added to all sitemaps

### Site Speed Optimization
- WebP images with responsive srcset via `<picture>` element
- Preload critical hero images (LCP optimization)
- DNS prefetch + preconnect to all CDNs
- GZip compression on all API responses
- Cache-Control headers on API endpoints
- Font display:swap for faster rendering

### Google OAuth 2.0 (replaced Emergent Auth)
- Direct Google OAuth for custom domain support
- Retry logic for cold starts
- Legacy Emergent auth kept as fallback

### Schema.org Fixes
- No duplicate FAQPage (removed inline duplicates)
- `performer` field on ALL Event schemas
- `description` field on all dynamic SEO pages
- Organization logo as ImageObject (not just string URL)

### Sitemap Fix
- Empty articles.xml removed (was causing GSC error)
- Dynamic sitemap-index conditionally includes articles

### Internal Linking
- `/api/seo/related-pages` with database-driven recommendations

## User Actions Required
1. Google Cloud Console: Add redirect URI `https://euromatchtickets.com/auth/callback`
2. Publish OAuth Consent Screen (Testing → Production)
3. Render .env: Add GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET
4. Deploy latest code to Render

## Backlog
- P2: Comparison Pages, Owner Dashboard
- P3: Affiliate Program, 5000+ SEO pages
