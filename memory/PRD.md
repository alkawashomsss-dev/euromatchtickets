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

### Trust & Legal Pages ✅ (NEW)
- `/privacy-policy` - GDPR compliant privacy policy
- `/payment-info` - Payment methods and security info
- `/terms` - Terms of Service
- `/refund-policy` - Refund policy
- `/contact` - Contact page with form

### Multi-Language Support ✅ (NEW)
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

### Homepage Improvements ✅ (NEW)
- FIFA World Cup 2026 featured hero section
- Video background (stadium atmosphere)
- "BUY WORLD CUP TICKETS" prominent CTA
- Trust badges (Verified, Secure, Instant, 24/7 Support)
- Statistics: 50K+ Fans, 1000+ Events, 4.9 Rating, €2M+ Sold

### AI Features
- AI Live Chat support (GPT-4o powered)
- AI-generated event descriptions

### Marketing Assets ✅ (NEW)
- Google Ads promotional video: `/api/static/ad_video_landscape.mp4`
- Professional ad images generated
- Ad copy and keywords provided

---

## Pending / Blocked

### P0 - CRITICAL
- [ ] **Live Deployment Database Sync** - User must select "Use new database" when deploying

### P1 - High Priority
- [ ] "Sell Your Tickets" page - Allow users to list tickets
- [ ] Test Resend email notifications end-to-end
- [ ] Verify €0.50 test ticket payment works

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
│   │   │   ├── HomePage.jsx
│   │   │   ├── WorldCupPage.jsx
│   │   │   ├── PrivacyPolicyPage.jsx  # NEW
│   │   │   ├── PaymentInfoPage.jsx    # NEW
│   │   │   └── ...
│   │   ├── components/
│   │   │   ├── LanguageSwitcher.jsx   # Updated 16 languages
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

## Session Summary
- ✅ Created Privacy Policy page
- ✅ Created Payment Info page
- ✅ Added 16 language support
- ✅ Improved homepage with World Cup 2026 hero
- ✅ Generated Google Ads video
- ✅ Generated 6 promotional images
- ✅ Updated Footer with legal links
