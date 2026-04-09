"""
SEO POWER FIX: Optimize top 3 gold pages + create keyword variants + redirect 2025→2026
"""
import pymongo
import os
import re

client = pymongo.MongoClient(os.environ.get('MONGO_URL'))
db = client['euromatchtickets']

# ============================================================
# 1. BELGIAN GP / SPA - THE #1 OPPORTUNITY
# ============================================================
BELGIAN_GP_CONTENT = """## Belgian Grand Prix 2026 Tickets – Spa-Francorchamps

Experience the thrill of Formula 1 at Spa-Francorchamps, one of the most iconic circuits in the world. Secure your Belgian Grand Prix 2026 tickets with verified sellers and instant e-ticket delivery.

All tickets are protected by our 100% FanProtect money-back guarantee.

### Spa-Francorchamps 2026 Ticket Prices

| Section | Price | Availability |
|---------|-------|-------------|
| General Admission | From €59 | Available |
| Gold Grandstand (Eau Rouge) | From €149 | Selling Fast |
| Silver Grandstand (La Source) | From €129 | Available |
| Bronze Grandstand | From €99 | Available |
| VIP Hospitality | From €499 | Limited |
| Paddock Club | From €1,299 | Very Limited |

### Why Spa-Francorchamps is F1's Best Circuit

Spa-Francorchamps is a 7.004km monster track through the Belgian Ardennes forest. Eau Rouge, Pouhon, and Blanchimont are among F1's most thrilling corners. The unpredictable weather adds drama – rain can arrive at one corner while sun shines at another.

**The 2026 Belgian Grand Prix** takes place in late July, making it one of the highlights of the F1 calendar. With over 100,000 fans expected, tickets sell out months in advance.

### What's Included With Your Ticket

- Full access to your chosen grandstand or zone
- Access to all on-track support races (F2, F3, Porsche Supercup)
- Free parking at designated areas
- Access to fan zones, merchandise areas, and food courts
- Big screens with live timing throughout the circuit

### Getting to Spa-Francorchamps

The circuit is located near Stavelot, Belgium, approximately:
- **Brussels**: 1.5 hours by car
- **Cologne**: 1.5 hours by car
- **Luxembourg**: 1.5 hours by car
- **Liège**: 45 minutes by car

Shuttle buses operate from Verviers and Spa town on race days. Many fans camp at the circuit – camping passes are available separately.

### Best Grandstands at Spa

- **Eau Rouge/Raidillon**: The most iconic corner in F1. Watch cars power uphill at 300+ km/h
- **La Source**: See the first corner action and hairpin battles
- **Pouhon**: High-speed double-left corner with incredible G-forces
- **Bus Stop Chicane**: The final corner before the start/finish straight"""

BELGIAN_GP_FAQ = [
    ["How much are Belgian Grand Prix 2026 tickets?", "Belgian Grand Prix 2026 tickets at Spa-Francorchamps start from €59 for General Admission. Grandstand tickets from €99, VIP Hospitality from €499, and Paddock Club from €1,299."],
    ["When is the Belgian Grand Prix 2026?", "The 2026 Belgian Grand Prix at Spa-Francorchamps takes place in late July 2026. The race weekend runs Friday to Sunday with practice, qualifying, and the race."],
    ["Where is the best seat at Spa-Francorchamps?", "The Gold Grandstand at Eau Rouge/Raidillon is the most popular seat at Spa. It offers a view of F1's most iconic corner as cars power uphill at over 300 km/h."],
    ["How do I get to Spa-Francorchamps?", "Spa-Francorchamps is 1.5 hours from Brussels, Cologne, and Luxembourg by car. Shuttle buses run from Verviers and Spa town on race days. Many fans camp at the circuit."],
    ["Are Belgian GP tickets refundable?", "All tickets purchased through EuroMatchTickets are protected by our 100% FanProtect money-back guarantee. If the event is cancelled, you get a full refund."],
    ["Can I buy F1 Spa tickets as a tourist?", "Yes! All Belgian Grand Prix tickets on EuroMatchTickets are available to fans worldwide. No membership or nationality requirement."]
]

# Update main Belgian GP page
db.seo_pages.update_one(
    {"slug": "belgian-grand-prix-2026-tickets"},
    {"$set": {
        "title": "Belgian Grand Prix 2026 Tickets | F1 Spa Tickets",
        "description": "Buy Belgian Grand Prix 2026 tickets for Spa-Francorchamps. Best prices for Formula 1 Belgium tickets with instant delivery and 100% money-back guarantee.",
        "meta_description": "Buy Belgian Grand Prix 2026 tickets for Spa-Francorchamps. F1 Belgium tickets from €59. Instant QR delivery, verified sellers, 100% FanProtect guarantee!",
        "content": BELGIAN_GP_CONTENT,
        "faq": BELGIAN_GP_FAQ,
        "event_name": "Belgian Grand Prix 2026",
        "price_low": 59,
        "price_high": 1299,
        "city": "Stavelot",
        "country": "Belgium",
        "venue": "Circuit de Spa-Francorchamps",
        "category": "f1",
        "active": True
    }}
)
print("✅ Updated: belgian-grand-prix-2026-tickets")

# Update Spa-Francorchamps page
db.seo_pages.update_one(
    {"slug": "spa-francorchamps-tickets"},
    {"$set": {
        "title": "Spa-Francorchamps F1 Tickets 2026 | Belgian GP",
        "description": "Buy Spa-Francorchamps F1 tickets for the 2026 Belgian Grand Prix. Best prices, verified sellers, instant e-ticket delivery.",
        "meta_description": "Buy Spa-Francorchamps F1 2026 tickets. Belgian Grand Prix from €59. Verified sellers, instant QR delivery, 100% FanProtect money-back guarantee!",
        "content": BELGIAN_GP_CONTENT,
        "faq": BELGIAN_GP_FAQ,
        "event_name": "Spa-Francorchamps F1 2026",
        "price_low": 59,
        "price_high": 1299,
        "city": "Stavelot",
        "country": "Belgium",
        "venue": "Circuit de Spa-Francorchamps",
        "category": "f1",
        "active": True
    }}
)
print("✅ Updated: spa-francorchamps-tickets")

# Create NEW slug variants for Belgian GP keyword coverage
belgian_variants = {
    "spa-f1-tickets": {
        "title": "Spa F1 Tickets 2026 | Belgian Grand Prix Spa-Francorchamps",
        "meta_description": "Buy Spa F1 2026 tickets. Belgian Grand Prix at Spa-Francorchamps from €59. Verified sellers, instant QR delivery, 100% money-back guarantee!",
    },
    "belgian-gp-tickets": {
        "title": "Belgian GP Tickets 2026 | F1 Spa-Francorchamps",
        "meta_description": "Buy Belgian GP 2026 tickets for Spa-Francorchamps. F1 Belgium tickets from €59. Instant delivery, verified sellers, FanProtect guarantee!",
    },
    "belgium-f1-tickets": {
        "title": "Belgium F1 Tickets 2026 | Belgian Grand Prix Spa",
        "meta_description": "Buy Belgium F1 2026 tickets. Belgian Grand Prix at Spa-Francorchamps from €59. Verified sellers, instant QR delivery, 100% money-back guarantee!",
    },
    "f1-spa-tickets": {
        "title": "F1 Spa Tickets 2026 | Belgian Grand Prix Tickets",
        "meta_description": "Buy F1 Spa 2026 tickets. Belgian Grand Prix at Spa-Francorchamps from €59. Best prices, verified sellers, instant QR delivery!",
    },
    "belgium-gp-tickets": {
        "title": "Belgium GP Tickets 2026 | F1 Spa-Francorchamps",
        "meta_description": "Buy Belgium GP 2026 tickets. Belgian Grand Prix at Spa-Francorchamps from €59. Verified sellers, instant delivery, FanProtect guarantee!",
    },
    "formula-1-belgium-tickets": {
        "title": "Formula 1 Belgium Tickets 2026 | Spa-Francorchamps",
        "meta_description": "Buy Formula 1 Belgium 2026 tickets for Spa-Francorchamps. Belgian Grand Prix from €59. Instant QR delivery, verified sellers!",
    },
}

for slug, meta in belgian_variants.items():
    db.seo_pages.update_one(
        {"slug": slug},
        {"$set": {
            "title": meta["title"],
            "description": meta["meta_description"],
            "meta_description": meta["meta_description"],
            "content": BELGIAN_GP_CONTENT,
            "faq": BELGIAN_GP_FAQ,
            "event_name": "Belgian Grand Prix 2026",
            "price_low": 59,
            "price_high": 1299,
            "city": "Stavelot",
            "country": "Belgium",
            "venue": "Circuit de Spa-Francorchamps",
            "category": "f1",
            "active": True
        }},
        upsert=True
    )
    print(f"✅ Created/Updated: {slug}")


# ============================================================
# 2. TAYLOR SWIFT LONDON / WEMBLEY - THE #2 OPPORTUNITY
# ============================================================
TAYLOR_SWIFT_CONTENT = """## Taylor Swift London Tickets 2026 – Wembley Stadium

Taylor Swift returns to London's iconic Wembley Stadium for the Eras Tour 2026. After selling out multiple nights at Wembley in previous years, this is the most anticipated concert event in London.

Secure your verified Taylor Swift Wembley tickets with instant QR delivery and 100% FanProtect guarantee.

### Taylor Swift Wembley 2026 Ticket Prices

| Section | Price | Availability |
|---------|-------|-------------|
| General Standing | From €79 | Selling Fast |
| Lower Tier Seated | From €99 | Available |
| Upper Tier Seated | From €69 | Available |
| Floor Standing (B Stage) | From €129 | Very Limited |
| VIP Packages | From €349 | Limited |

### Why Wembley Stadium for Taylor Swift?

Wembley Stadium is London's largest venue with 90,000 capacity. Taylor Swift's Eras Tour is the highest-grossing concert tour in history. Her Wembley shows feature:

- **3.5-hour setlist** spanning her entire career
- **Spectacular stage production** with pyrotechnics and LED screens
- **Surprise songs** – every night is unique
- **Friendship bracelet trading** – a beloved fan tradition

### Taylor Swift Wembley Night 1 vs Night 2

Taylor Swift typically plays multiple consecutive nights at Wembley. Each night features different surprise songs from her acoustic set. Many fans attend multiple nights to catch different songs.

### Getting to Wembley Stadium

- **Wembley Park Station**: Metropolitan & Jubilee Lines (5-minute walk)
- **Wembley Stadium Station**: Chiltern Railways from Marylebone
- **By Car**: Limited parking – public transport strongly recommended
- **From Central London**: 30 minutes by Tube

### What to Bring

- Your mobile phone with QR ticket
- Friendship bracelets to trade
- Comfortable shoes for standing
- Light jacket (outdoor venue, British weather!)
- Clear bag (venue policy)"""

TAYLOR_SWIFT_FAQ = [
    ["How much are Taylor Swift London tickets?", "Taylor Swift London 2026 tickets at Wembley start from €69 for Upper Tier seated. Standing from €79, Lower Tier from €99, Floor Standing from €129, VIP from €349."],
    ["When is Taylor Swift playing Wembley 2026?", "Taylor Swift plays multiple nights at Wembley Stadium in summer 2026. Check our listings for exact dates and availability."],
    ["Are Taylor Swift Wembley tickets sold out?", "While official tickets sold out fast, verified resale tickets are available on EuroMatchTickets. All tickets come with our 100% FanProtect guarantee."],
    ["How do I get to Wembley Stadium?", "Take the Metropolitan or Jubilee Line to Wembley Park station. It's a 5-minute walk to the stadium. Allow extra time on concert nights."],
    ["Can I buy Taylor Swift tickets from abroad?", "Yes! All Taylor Swift Wembley tickets on EuroMatchTickets are available to fans worldwide. QR tickets are delivered instantly to your email."],
    ["What is the Taylor Swift Eras Tour setlist?", "The Eras Tour spans Taylor's entire career with songs from every album. Each show features 2 unique surprise songs during the acoustic set."]
]

# Update existing Taylor Swift London pages
db.seo_pages.update_one(
    {"slug": "taylor-swift-london-tickets-2026"},
    {"$set": {
        "title": "Taylor Swift London Tickets 2026 | Wembley Stadium",
        "description": "Buy Taylor Swift London 2026 tickets for Wembley Stadium. Eras Tour tickets from €69. Verified resale, instant QR delivery, 100% FanProtect guarantee.",
        "meta_description": "Buy Taylor Swift London 2026 tickets for Wembley Stadium. Eras Tour from €69. Verified sellers, instant QR delivery, 100% FanProtect money-back guarantee!",
        "content": TAYLOR_SWIFT_CONTENT,
        "faq": TAYLOR_SWIFT_FAQ,
        "event_name": "Taylor Swift London 2026",
        "price_low": 69,
        "price_high": 349,
        "city": "London",
        "country": "United Kingdom",
        "venue": "Wembley Stadium",
        "category": "concert",
        "active": True
    }}
)
print("✅ Updated: taylor-swift-london-tickets-2026")

db.seo_pages.update_one(
    {"slug": "taylor-swift-tickets-2026"},
    {"$set": {
        "title": "Taylor Swift Tickets 2026 | Eras Tour Wembley London",
        "description": "Buy Taylor Swift 2026 tickets for the Eras Tour at Wembley Stadium London. From €69. Verified sellers, instant QR delivery.",
        "meta_description": "Buy Taylor Swift 2026 Eras Tour tickets. Wembley Stadium London from €69. Verified sellers, instant QR delivery, 100% FanProtect guarantee!",
        "content": TAYLOR_SWIFT_CONTENT,
        "faq": TAYLOR_SWIFT_FAQ,
        "event_name": "Taylor Swift 2026",
        "price_low": 69,
        "price_high": 349,
        "city": "London",
        "country": "United Kingdom",
        "venue": "Wembley Stadium",
        "category": "concert",
        "active": True
    }}
)
print("✅ Updated: taylor-swift-tickets-2026")

# Create NEW Taylor Swift keyword variant pages
taylor_variants = {
    "taylor-swift-wembley-tickets": {
        "title": "Taylor Swift Wembley Tickets 2026 | Eras Tour London",
        "meta_description": "Buy Taylor Swift Wembley 2026 tickets. Eras Tour at Wembley Stadium from €69. Verified resale, instant QR delivery, 100% FanProtect guarantee!",
    },
    "taylor-swift-uk-tickets": {
        "title": "Taylor Swift UK Tickets 2026 | Eras Tour Wembley",
        "meta_description": "Buy Taylor Swift UK 2026 tickets. Eras Tour at Wembley Stadium London from €69. Verified sellers, instant QR delivery!",
    },
    "taylor-swift-concert-tickets": {
        "title": "Taylor Swift Concert Tickets 2026 | Eras Tour Europe",
        "meta_description": "Buy Taylor Swift concert tickets 2026. Eras Tour at Wembley Stadium London from €69. Verified sellers, instant QR delivery, FanProtect guarantee!",
    },
}

for slug, meta in taylor_variants.items():
    db.seo_pages.update_one(
        {"slug": slug},
        {"$set": {
            "title": meta["title"],
            "description": meta["meta_description"],
            "meta_description": meta["meta_description"],
            "content": TAYLOR_SWIFT_CONTENT,
            "faq": TAYLOR_SWIFT_FAQ,
            "event_name": "Taylor Swift 2026",
            "price_low": 69,
            "price_high": 349,
            "city": "London",
            "country": "United Kingdom",
            "venue": "Wembley Stadium",
            "category": "concert",
            "active": True
        }},
        upsert=True
    )
    print(f"✅ Created/Updated: {slug}")


# ============================================================
# 3. BAHRAIN GP - THE #3 OPPORTUNITY
# ============================================================
BAHRAIN_GP_CONTENT = """## Bahrain Grand Prix 2026 Tickets – Sakhir Night Race

The Bahrain Grand Prix is F1's spectacular season-opening night race at the Bahrain International Circuit in Sakhir. Racing under floodlights in the desert creates one of F1's most dramatic spectacles.

All tickets include instant QR delivery and 100% FanProtect money-back guarantee.

### Bahrain GP 2026 Ticket Prices

| Section | Price | Availability |
|---------|-------|-------------|
| General Admission | From €59 | Available |
| Main Grandstand | From €129 | Selling Fast |
| Turn 1 Grandstand | From €149 | Available |
| Batelco Grandstand | From €119 | Available |
| VIP Hospitality | From €499 | Limited |
| Paddock Club | From €1,499 | Very Limited |

### Why the Bahrain Grand Prix is Special

The Bahrain Grand Prix is the **only F1 night race in the Middle East**. The race starts at sunset and finishes under floodlights, creating a stunning visual spectacle. Key highlights:

- **Night race atmosphere** with dramatic desert sunset
- **Season opener** – sets the tone for the championship
- **Excellent facilities** at the modern Bahrain International Circuit
- **Desert weather** – warm evenings (25-30°C), no rain
- **Fan zone** with live music, karting, and entertainment

### Best Grandstands at Bahrain International Circuit

- **Main Grandstand**: Overlooks the start/finish straight with pit lane views
- **Turn 1 Grandstand**: See the dramatic first corner braking zone
- **Batelco Grandstand**: Excellent view of the technical section
- **General Admission**: Access to multiple viewing areas around the circuit

### Getting to Bahrain International Circuit

- **From Manama**: 30 minutes by car/taxi (40km south)
- **From Bahrain Airport**: 20 minutes by car
- **Shuttle buses**: Free shuttles from major hotels on race days
- **Dubai**: Many fans combine with a Dubai trip (1-hour flight)

### Tips for Bahrain GP

- Bring sunglasses and sunscreen for afternoon sessions
- Comfortable walking shoes – the circuit area is large
- Arrive early for the spectacular sunset before the race
- Combine with a Dubai or Abu Dhabi holiday"""

BAHRAIN_GP_FAQ = [
    ["How much are Bahrain Grand Prix tickets?", "Bahrain Grand Prix 2026 tickets start from €59 for General Admission. Main Grandstand from €129, Turn 1 from €149, VIP from €499, Paddock Club from €1,499."],
    ["When is the Bahrain Grand Prix 2026?", "The Bahrain Grand Prix 2026 takes place in early March as the F1 season opener. The race is held at night under floodlights at the Bahrain International Circuit."],
    ["Is the Bahrain GP a night race?", "Yes! The Bahrain Grand Prix is a spectacular night race. It starts at sunset and finishes under floodlights, creating one of F1's most dramatic atmospheres."],
    ["How do I get to Bahrain International Circuit?", "The circuit is 30 minutes from Manama and 20 minutes from Bahrain Airport. Free shuttle buses run from major hotels on race days."],
    ["Can I combine Bahrain GP with a Dubai trip?", "Yes! Dubai is only a 1-hour flight from Bahrain. Many fans combine the Bahrain GP with a Dubai holiday or the Abu Dhabi GP."],
    ["What's the weather like for Bahrain GP?", "March in Bahrain is warm and dry. Expect 25-30°C in the evenings. No rain expected. Bring sunscreen for daytime sessions."]
]

# Update main Bahrain GP pages
for slug in ["bahrain-gp-tickets", "bahrain-grand-prix-2026-tickets"]:
    title_var = "Bahrain GP Tickets 2026 | F1 Night Race Sakhir" if "gp-tickets" in slug else "Bahrain Grand Prix 2026 Tickets | F1 Night Race"
    db.seo_pages.update_one(
        {"slug": slug},
        {"$set": {
            "title": title_var,
            "description": "Buy Bahrain Grand Prix 2026 tickets. F1 night race at Sakhir from €59. Verified sellers, instant QR delivery, 100% FanProtect guarantee.",
            "meta_description": "Buy Bahrain Grand Prix 2026 tickets. F1 night race at Bahrain International Circuit from €59. Instant QR delivery, verified sellers, FanProtect guarantee!",
            "content": BAHRAIN_GP_CONTENT,
            "faq": BAHRAIN_GP_FAQ,
            "event_name": "Bahrain Grand Prix 2026",
            "price_low": 59,
            "price_high": 1499,
            "city": "Sakhir",
            "country": "Bahrain",
            "venue": "Bahrain International Circuit",
            "category": "f1",
            "active": True
        }}
    )
    print(f"✅ Updated: {slug}")

# Create Bahrain keyword variants
bahrain_variants = {
    "bahrain-f1-tickets": {
        "title": "Bahrain F1 Tickets 2026 | Grand Prix Night Race",
        "meta_description": "Buy Bahrain F1 2026 tickets. Grand Prix night race at Sakhir from €59. Verified sellers, instant QR delivery, FanProtect guarantee!",
    },
    "f1-bahrain-tickets": {
        "title": "F1 Bahrain Tickets 2026 | Grand Prix Sakhir",
        "meta_description": "Buy F1 Bahrain 2026 tickets. Grand Prix night race at Bahrain International Circuit from €59. Instant QR delivery, verified sellers!",
    },
    "formula-1-bahrain-tickets": {
        "title": "Formula 1 Bahrain Tickets 2026 | GP Night Race",
        "meta_description": "Buy Formula 1 Bahrain 2026 tickets. Grand Prix night race from €59. Verified sellers, instant QR delivery, 100% money-back guarantee!",
    },
}

for slug, meta in bahrain_variants.items():
    db.seo_pages.update_one(
        {"slug": slug},
        {"$set": {
            "title": meta["title"],
            "description": meta["meta_description"],
            "meta_description": meta["meta_description"],
            "content": BAHRAIN_GP_CONTENT,
            "faq": BAHRAIN_GP_FAQ,
            "event_name": "Bahrain Grand Prix 2026",
            "price_low": 59,
            "price_high": 1499,
            "city": "Sakhir",
            "country": "Bahrain",
            "venue": "Bahrain International Circuit",
            "category": "f1",
            "active": True
        }},
        upsert=True
    )
    print(f"✅ Created/Updated: {slug}")


# ============================================================
# 4. REDIRECT ALL 2025 PAGES TO 2026 EQUIVALENTS
# ============================================================
print("\n🔄 Processing 2025 → 2026 redirects...")

pages_2025 = list(db.seo_pages.find({"slug": {"$regex": "2025"}, "active": True}, {"_id": 0, "slug": 1}))
redirected = 0
deactivated = 0

for page in pages_2025:
    old_slug = page["slug"]
    new_slug = old_slug.replace("2025", "2026")
    
    # Check if 2026 version exists
    existing_2026 = db.seo_pages.find_one({"slug": new_slug})
    
    if existing_2026:
        # 2026 version exists - deactivate 2025 and mark for redirect
        db.seo_pages.update_one(
            {"slug": old_slug},
            {"$set": {"active": False, "redirect_to": new_slug}}
        )
        deactivated += 1
    else:
        # No 2026 version - update slug to 2026
        db.seo_pages.update_one(
            {"slug": old_slug},
            {"$set": {
                "slug": new_slug,
                "title": page.get("title", "").replace("2025", "2026") if "title" in page else None,
            }}
        )
        redirected += 1

print(f"✅ Deactivated {deactivated} pages with 2026 equivalents")
print(f"✅ Renamed {redirected} pages from 2025 to 2026")
print(f"📊 Total 2025 pages processed: {len(pages_2025)}")

# Final count
total_active = db.seo_pages.count_documents({"active": True})
print(f"\n📊 Total active SEO pages: {total_active}")
