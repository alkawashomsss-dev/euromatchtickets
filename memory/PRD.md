# EuroMatchTickets - Ticket Marketplace PRD

## Original Problem Statement
Build a comprehensive ticket marketplace for European events:
- 10% platform commission via Stripe
- Full payment to owner's Stripe account  
- Excellent SEO for sales goal
- Domain: euromatchtickets.com

## Current Status: PREVIEW WORKING ✅

### ⚠️ CRITICAL DEPLOYMENT ISSUE
**Live site (euromatchtickets.com) uses OLD database!**
- User must re-deploy with "Use new database" option
- Preview environment has all fixes and new features

---

## Features Implemented ✅

### Core Marketplace
- ⚽ Football tickets (Champions League, Premier League, La Liga, World Cup 2026)
- 🎵 Concert tickets (The Weeknd, Bruno Mars, Guns N' Roses, Bad Bunny)
- 100% Stripe Live Mode payments
- 10% commission on all sales
- Google OAuth authentication

### SEO & Landing Pages
- Dynamic `sitemap.xml` with all pages
- Schema.org markup for events
- High-value landing pages:
  - `/world-cup-2026` - FIFA World Cup 2026
  - `/champions-league-tickets`
  - `/the-weeknd-tour-2026`
  - `/bruno-mars-tour-2026`
  - `/guns-n-roses-tour-2026`
  - `/bad-bunny-london-2026`

### Trust & Legal Pages ✅
- `/buyer-protection` - **NEW** Comprehensive buyer guarantee page
- `/privacy-policy` - GDPR compliant privacy policy
- `/payment-info` - Payment methods and security info
- `/terms` - Terms of Service
- `/refund-policy` - Refund policy
- `/contact` - Contact page with form

### Multi-Language Support ✅
16 languages supported:
| Europe | Americas | Middle East | Asia |
|--------|----------|-------------|------|
| 🇬🇧 English | 🇲🇽 Español (MX) | 🇸🇦 العربية | 🇨🇳 中文 |
| 🇩🇪 Deutsch | 🇧🇷 Português (BR) | | 🇯🇵 日本語 |
| 🇫🇷 Français | | | 🇰🇷 한국어 |
| 🇪🇸 Español | | | 🇮🇳 हिन्दी |
| 🇮🇹 Italiano | | | |
| 🇵🇹 Português | | | |
| 🇳🇱 Nederlands | | | |
| 🇵🇱 Polski | | | |
| 🇹🇷 Türkçe | | | |

### Homepage Improvements ✅
- FIFA World Cup 2026 featured hero section
- Video background (stadium atmosphere)
- "BUY WORLD CUP TICKETS" prominent CTA
- **Realistic statistics:** 100+ Events, 20+ Countries, 100% Protected, 24/7 Support
- Trust badges with links to protection pages

### Event Card Features ✅ (NEW)
- **Live Inventory Counter:** Shows available tickets in real-time
- **Limited Availability Badge:** Red badge when ≤10 tickets left
- **Selling Fast Badge:** Orange badge when ≤25 tickets left
- **Countdown Timer:** Shows days/hours until event (for events within 30 days)

### AI Features
- AI Live Chat support (GPT-4o powered)
- AI-generated event descriptions

### Marketing Assets ✅
- Google Ads promotional video: `/api/static/ad_video_landscape.mp4`
- 6 Professional ad images (landscape, square, vertical)
- Ad copy and keywords provided

---

## Compliance Improvements ✅

### Ad Platform Compliance
1. **Removed fake statistics** - No more "50K+ Happy Fans" or "€2M+ Tickets Sold"
2. **Buyer Protection page** - Required for Google/Meta Ads approval
3. **Clear refund policy** - What's covered vs not covered
4. **Trust indicators** - Real, verifiable claims only

### Legal Compliance
- GDPR compliant Privacy Policy
- Clear Terms of Service
- Transparent Payment Information
- Buyer Protection Guarantee explained

---

## Pending / Blocked

### P0 - CRITICAL
- [ ] **Live Deployment Database Sync** - User must select "Use new database" when deploying

### P1 - High Priority
- [ ] "Sell Your Tickets" page - Allow users to list tickets
- [ ] Test Resend email notifications end-to-end
- [ ] Replace stock images with licensed/royalty-free images

### P2 - Medium Priority  
- [ ] Google Analytics integration - Needs Web Stream ID (G-XXXX)
- [ ] Facebook Pixel integration - Needs Pixel ID

### Future Tasks
- Seller payouts dashboard
- Owner dashboard charts
- More language translations

---

## Technical Architecture

```
/app/
├── backend/
│   ├── server.py          # FastAPI main file
│   ├── email_service.py   # Resend integration
│   ├── static/            # Video/asset files
│   └── .env               # Environment variables
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx           # Updated with realistic stats
│   │   │   ├── BuyerProtectionPage.jsx # NEW - Guarantee page
│   │   │   ├── PrivacyPolicyPage.jsx   
│   │   │   ├── PaymentInfoPage.jsx    
│   │   │   └── ...
│   │   ├── components/
│   │   │   ├── LanguageSwitcher.jsx   # 16 languages
│   │   │   ├── AIChatWidget.jsx
│   │   │   └── ...
│   │   └── i18n/                      # Translations
│   └── .env
└── memory/
    └── PRD.md
```

## Key Endpoints
- `GET /api/health` - Health check
- `GET /api/sitemap.xml` - Dynamic sitemap
- `POST /api/create-checkout-session` - Stripe checkout
- `POST /api/chat` - AI chat support
- `GET /api/static/*` - Static files (videos, etc.)

## Credentials for Testing
- **Login:** Google OAuth
- **Test Payment:** €0.50 ticket exists for World Cup Opening Ceremony

---

## Last Updated
February 24, 2026

## Session Summary (Latest)
- ✅ Changed statistics to realistic numbers (no legal risk)
- ✅ Created Buyer Protection page with Triple Guarantee
- ✅ Added Live Inventory Counter to event cards
- ✅ Added Limited Availability badges (Only X left!)
- ✅ Added Selling Fast badges
- ✅ Added Countdown Timer to events
- ✅ Updated Trust section with links to protection pages
- ✅ Updated Footer with Buyer Protection link
