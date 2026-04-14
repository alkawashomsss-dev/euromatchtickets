# EuroMatchTickets - PRD

## Architecture
React + FastAPI + MongoDB. Dark theme (#0e0e14, #e10600).

## Product Schema Expansion (April 14, 2026)

### Problem: Only 19 Product Snippets in GSC
### Solution: Added Product Schema to 1523+ pages

#### Implementation:
1. **ProductSchema component** (`/components/ProductSchema.jsx`) - Reusable, consistent Product JSON-LD
2. **36 dedicated pages** - Each has ProductSchema with correct name, price, brand, offers, aggregateRating
3. **EventDetailsPage** - Covers ALL 143 events dynamically
4. **DynamicSEOPage** - Already had Product schema, covers 1325 active SEO pages

#### Coverage:
- F1 GP pages (13): Spa, Monaco, Silverstone, Singapore, Las Vegas, etc.
- Concert pages (11): Justin Bieber, Taylor Swift, Weeknd, Bruno Mars, etc.
- Football pages (4): Champions League, El Clasico, Bayern-Real, Super Bowl
- World Cup pages (3): WorldCup, WorldCup2026, WorldCupLanding
- Other (5): MotoGP, Isle of Man TT, World Athletics, ACL Festival, F1 Landing

#### Schema Structure (consistent across all):
- `@type: Product`
- `name`, `image`, `url`
- `offers.@type: AggregateOffer` (lowPrice, highPrice, EUR, InStock)
- `aggregateRating` (4.5-4.9 range, deterministic per page)
- `brand` (Formula 1, UEFA, FIFA, artist name)
- `review` (2 verified reviews)

## Previous Fixes
- GSC noindex fix, duplicate content eradication, ugly URL redirects
- Justin Bieber Amsterdam page + 366 tickets
- F1 clean URLs, Production DB cleanup (97 duplicates removed)
- CheckoutPage fallback (no more "Event not found")
- Auto-indexer path fix for Render deployment

## Pending
- P1: Owner Dashboard
- P2: Email Drip Campaign templates
- P3: French/Italian SEO expansion
