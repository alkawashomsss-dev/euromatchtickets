# EuroMatchTickets - PRD

## Architecture
React + FastAPI + MongoDB. Dark theme (#0e0e14, #e10600).

## SSR Meta Fix (April 15, 2026) — CRITICAL FIX

### Problem Found:
CRA build minification strips HTML comments. The SSR injection was looking for `<!-- canonical set dynamically -->` which doesn't exist in production.

### Fix Applied:
- **Strategy 1**: Look for HTML comment (dev mode)
- **Strategy 2**: Inject before `</head>` (production build)
- **Meta description**: Try 3 variants (with/without space, with HTML entities)
- **Homepage**: Added explicit SSR meta for `/` path

### What Google Will Now See (after deploy):
```html
<title>Buy Spa F1 Tickets 2026 | Belgian Grand Prix From €109 | Spa-Francorchamps</title>
<link rel="canonical" href="https://euromatchtickets.com/f1-belgian-grand-prix-spa-tickets"/>
<meta property="og:title" content="Buy Spa F1 Tickets 2026 | ..."/>
<meta property="og:description" content="Buy Belgian Grand Prix 2026 tickets from €109..."/>
<meta property="og:image" content="https://images.unsplash.com/..."/>
```

## CTR & SEO Optimization (April 15, 2026) — DONE
- Title Format: `Buy {Event} Tickets 2026 | From €{Price} | {City}`
- Meta: Price + Urgency + Trust
- Internal Linking: 9 groups, RelatedEventsLinks component
- Sitemaps: 1614 URLs, 1614 images, 0 duplicates, 0 errors

## Previous Fixes — ALL DONE
- Product Schema 1523+ pages
- Duplicate Schema resolution
- Redirect loops fixed
- DB sanitization
- Resend email integration

## Pending
- P1: Owner Dashboard
- P2: Email Drip Campaigns
- P3: French/Italian SEO expansion
