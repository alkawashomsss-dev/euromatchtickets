"""
MEGA SEO UPDATE:
1. Update all gold page titles with price + urgency + delivery (CTR boost)
2. Create Champions League category pages (Final, Semi, Quarter)
3. Update team pages with better conversion content
"""
import pymongo
import os

client = pymongo.MongoClient(os.environ.get('MONGO_URL'))
db = client['euromatchtickets']

# ============================================================
# 1. CTR-OPTIMIZED TITLES FOR ALL GOLD PAGES
# ============================================================
print("=== UPDATING GOLD PAGE TITLES ===")

title_updates = {
    # Belgian GP / Spa Cluster
    "belgian-grand-prix-2026-tickets": "Belgian Grand Prix 2026 Tickets | From \u20ac129 \u2013 Instant Delivery",
    "spa-francorchamps-tickets": "Spa-Francorchamps F1 Tickets 2026 | From \u20ac129 \u2013 Verified",
    "spa-f1-tickets": "Spa F1 Tickets 2026 | From \u20ac129 \u2013 Best Prices Guaranteed",
    "belgian-gp-tickets": "Belgian GP Tickets 2026 | From \u20ac129 \u2013 Instant Delivery",
    "belgium-f1-tickets": "Belgium F1 Tickets 2026 | From \u20ac129 \u2013 Selling Fast",
    "f1-spa-tickets": "F1 Spa Tickets 2026 | From \u20ac129 \u2013 100% Guaranteed",
    "belgium-gp-tickets": "Belgium GP Tickets 2026 | From \u20ac129 \u2013 Instant QR Delivery",
    "formula-1-belgium-tickets": "Formula 1 Belgium Tickets 2026 | From \u20ac129 \u2013 Verified",

    # Taylor Swift Cluster
    "taylor-swift-wembley-tickets": "Taylor Swift Wembley Tickets 2026 | From \u00a389 \u2013 Selling Fast",
    "taylor-swift-london-tickets-2026": "Taylor Swift London Tickets 2026 | From \u00a389 \u2013 Wembley",
    "taylor-swift-tickets-2026": "Taylor Swift Tickets 2026 | Wembley From \u00a389 \u2013 Limited",
    "taylor-swift-uk-tickets": "Taylor Swift UK Tickets 2026 | Wembley From \u00a389 \u2013 Verified",
    "taylor-swift-concert-tickets": "Taylor Swift Concert Tickets 2026 | From \u00a389 \u2013 Eras Tour",

    # Bahrain GP Cluster
    "bahrain-gp-tickets": "Bahrain F1 2026 Tickets | Night Race \u2013 Best Prices + Instant Delivery",
    "bahrain-grand-prix-2026-tickets": "Bahrain Grand Prix 2026 Tickets | From \u20ac59 \u2013 Night Race",
    "bahrain-f1-tickets": "Bahrain F1 Tickets 2026 | Night Race From \u20ac59 \u2013 Verified",
    "f1-bahrain-tickets": "F1 Bahrain Tickets 2026 | Night Race \u2013 Instant Delivery",
    "formula-1-bahrain-tickets": "Formula 1 Bahrain 2026 | Night Race From \u20ac59 \u2013 Guaranteed",
}

# Also update prices: Belgian GP starts at 129 (as per user), Taylor Swift at 89 GBP
price_updates = {
    "belgian-grand-prix-2026-tickets": {"price_low": 129, "price_high": 1299},
    "spa-francorchamps-tickets": {"price_low": 129, "price_high": 1299},
    "spa-f1-tickets": {"price_low": 129, "price_high": 1299},
    "belgian-gp-tickets": {"price_low": 129, "price_high": 1299},
    "belgium-f1-tickets": {"price_low": 129, "price_high": 1299},
    "f1-spa-tickets": {"price_low": 129, "price_high": 1299},
    "belgium-gp-tickets": {"price_low": 129, "price_high": 1299},
    "formula-1-belgium-tickets": {"price_low": 129, "price_high": 1299},
    "taylor-swift-wembley-tickets": {"price_low": 89, "price_high": 549},
    "taylor-swift-london-tickets-2026": {"price_low": 89, "price_high": 549},
    "taylor-swift-tickets-2026": {"price_low": 89, "price_high": 549},
    "taylor-swift-uk-tickets": {"price_low": 89, "price_high": 549},
    "taylor-swift-concert-tickets": {"price_low": 89, "price_high": 549},
}

for slug, title in title_updates.items():
    update_data = {"title": title}
    if slug in price_updates:
        update_data.update(price_updates[slug])
    result = db.seo_pages.update_one({"slug": slug}, {"$set": update_data})
    print(f"  {'OK' if result.modified_count else 'NO CHANGE'}: {slug}")


# ============================================================
# 2. CHAMPIONS LEAGUE PAGES (Final, Semi, Quarter, Main)
# ============================================================
print("\n=== CREATING CHAMPIONS LEAGUE PAGES ===")

CL_FINAL_CONTENT = """## Champions League Final 2026 Tickets \u2013 Munich

The UEFA Champions League Final 2026 takes place at the Allianz Arena in Munich, Germany. This is the biggest club football match in the world \u2013 two of Europe's elite teams battling for the ultimate trophy.

### Champions League Final 2026 Ticket Prices

| Section | Price | Availability |
|---------|-------|-------------|
| Category 4 (Upper Tier) | From \u20ac295 | Available |
| Category 3 (Mid Tier) | From \u20ac495 | Selling Fast |
| Category 2 (Lower Tier) | From \u20ac795 | Limited |
| Category 1 (Pitch Level) | From \u20ac1,295 | Very Limited |
| VIP Hospitality | From \u20ac2,995 | Extremely Limited |

### Why the Champions League Final is Unmissable

The Champions League Final is the most-watched annual sporting event in the world. Over 400 million viewers tune in globally. Being there in person is a once-in-a-lifetime experience:

- **The atmosphere**: 70,000 fans creating an electric atmosphere
- **The stakes**: Everything on the line in one 90-minute match
- **The history**: Legends are made in the Champions League Final
- **Munich**: World-class city with incredible food, culture, and nightlife

### Getting to the Allianz Arena

- **U-Bahn U6**: Frottmaning station (10-minute walk)
- **From Munich Airport**: 30 minutes by S-Bahn + U-Bahn
- **From Munich Central**: 25 minutes by U-Bahn U6

### Important Information

- Tickets are delivered instantly via QR code
- All tickets are 100% verified and guaranteed
- If the event is cancelled, you receive a full refund
- Arrive at least 2 hours early for security checks"""

CL_FINAL_FAQ = [
    ["How much are Champions League Final 2026 tickets?", "Champions League Final 2026 tickets in Munich start from \u20ac295 for Category 4 (Upper Tier). Category 1 pitch-level tickets from \u20ac1,295. VIP Hospitality from \u20ac2,995."],
    ["Where is the Champions League Final 2026?", "The 2026 Champions League Final takes place at the Allianz Arena in Munich, Germany. The stadium has a capacity of 70,000."],
    ["When is the Champions League Final 2026?", "The Champions League Final 2026 is scheduled for late May/early June 2026 at the Allianz Arena, Munich."],
    ["Are Champions League Final tickets guaranteed?", "Yes! All tickets purchased through EuroMatchTickets are 100% verified and protected by our FanProtect money-back guarantee."],
    ["How do I receive my Champions League Final tickets?", "Tickets are delivered instantly via QR code to your email after purchase. No physical tickets needed."],
]

CL_SEMI_CONTENT = """## Champions League Semi-Final 2026 Tickets

The Champions League Semi-Finals are where the drama reaches its peak. Four teams remain, two legs to decide who reaches the Final. The atmosphere at Semi-Final matches is often even more intense than the Final itself.

### Semi-Final Ticket Prices

| Section | Price | Availability |
|---------|-------|-------------|
| Upper Tier | From \u20ac89 | Available |
| Lower Tier | From \u20ac149 | Selling Fast |
| VIP Hospitality | From \u20ac599 | Limited |

### Why Semi-Finals Are Special

- **Home advantage matters**: The roar of the home crowd can change everything
- **Two legs**: Double the drama, double the emotion
- **Away goals**: Every goal matters, creating non-stop tension
- **Best teams**: Only the elite 4 remain at this stage

### 2025/26 Semi-Final Schedule

Semi-Final 1st Legs and 2nd Legs take place in April/May 2026. Teams and venues are confirmed after the Quarter-Finals. Book early \u2013 Semi-Final tickets sell out within hours of teams being confirmed."""

CL_SEMI_FAQ = [
    ["How much are Champions League Semi-Final tickets?", "Champions League Semi-Final tickets start from \u20ac89 for Upper Tier seating. Lower Tier from \u20ac149, VIP Hospitality from \u20ac599."],
    ["When are the Champions League Semi-Finals 2026?", "The Semi-Finals take place in April/May 2026. Exact dates are confirmed after the Quarter-Final draw."],
    ["Can I buy Semi-Final tickets before teams are confirmed?", "We list tickets as soon as they become available. Sign up for alerts to be notified when Semi-Final tickets go on sale."],
    ["Are both Semi-Final legs included?", "No, tickets are sold per match (1st Leg or 2nd Leg). Many fans buy both to experience the full drama."],
]

CL_QUARTER_CONTENT = """## Champions League Quarter-Final 2026 Tickets

The Champions League Quarter-Finals feature Europe's top 8 clubs. This is where the tournament gets serious \u2013 every match is a blockbuster. Quarter-Final tickets offer the best value for experiencing elite Champions League football.

### Quarter-Final Ticket Prices

| Section | Price | Availability |
|---------|-------|-------------|
| Upper Tier | From \u20ac69 | Available |
| Lower Tier | From \u20ac119 | Available |
| VIP Hospitality | From \u20ac449 | Limited |

### Why Quarter-Finals Are Great Value

- **Best price-to-quality ratio**: Elite football at lower prices than later rounds
- **8 teams**: More matches to choose from
- **Two legs**: Home and away atmospheres
- **Surprise results**: Giant-killings happen most often at this stage

### Top Teams in 2025/26 Champions League

Real Madrid, Manchester City, Bayern Munich, Barcelona, Liverpool, PSG, Inter Milan, and Arsenal are among the favorites to reach the Quarter-Finals."""

CL_QUARTER_FAQ = [
    ["How much are Champions League Quarter-Final tickets?", "Champions League Quarter-Final tickets start from \u20ac69 for Upper Tier. Lower Tier from \u20ac119, VIP from \u20ac449. Best value for elite UCL football."],
    ["When are the Champions League Quarter-Finals?", "Quarter-Finals take place in March/April 2026. Dates confirmed after the Round of 16."],
    ["Which teams will be in the Quarter-Finals?", "The 8 Quarter-Finalists are determined after the Round of 16 in February/March 2026."],
    ["Are Quarter-Final tickets cheaper than Semi-Final?", "Yes! Quarter-Final tickets typically cost 30-40% less than Semi-Final tickets, offering excellent value."],
]

CL_MAIN_CONTENT = """## Champions League Tickets 2025/26 \u2013 All Rounds

Buy UEFA Champions League 2025/26 tickets for every round \u2013 from the Group Stage to the Final in Munich. EuroMatchTickets is Europe's trusted marketplace for verified Champions League tickets.

### Champions League 2025/26 Key Dates

| Round | Date | Tickets From |
|-------|------|-------------|
| Round of 16 | Feb-Mar 2026 | \u20ac49 |
| Quarter-Finals | Mar-Apr 2026 | \u20ac69 |
| Semi-Finals | Apr-May 2026 | \u20ac89 |
| Final (Munich) | May/Jun 2026 | \u20ac295 |

### Buy Champions League Tickets by Team

Looking for tickets for your specific team? We have Champions League tickets for every club:

**Spanish Teams**: [Real Madrid](/real-madrid-champions-league-tickets-2026) | [Barcelona](/barcelona-champions-league-tickets-2026) | [Atletico Madrid](/atletico-madrid-champions-league-tickets-2026)

**English Teams**: [Liverpool](/liverpool-champions-league-tickets-2026) | [Arsenal](/arsenal-champions-league-tickets-2026) | [Man City](/manchester-city-champions-league-tickets-2026) | [Chelsea](/chelsea-champions-league-tickets-2026)

**German Teams**: [Bayern Munich](/bayern-munich-champions-league-tickets-2026) | [Dortmund](/borussia-dortmund-champions-league-tickets-2026)

**Italian Teams**: [Inter Milan](/inter-milan-champions-league-tickets-2026) | [Juventus](/juventus-champions-league-tickets-2026) | [Napoli](/napoli-champions-league-tickets-2026)

**French Teams**: [PSG](/paris-saint-germain-champions-league-tickets-2026)

### Why Buy Champions League Tickets From Us?

- Verified tickets from trusted sellers across Europe
- Instant QR code delivery to your phone
- 100% FanProtect money-back guarantee
- Prices up to 40% cheaper than Viagogo and StubHub
- Trusted by 500,000+ customers"""

CL_MAIN_FAQ = [
    ["How much are Champions League tickets?", "Champions League ticket prices vary by round. Round of 16 from \u20ac49, Quarter-Finals from \u20ac69, Semi-Finals from \u20ac89, Final from \u20ac295."],
    ["Where is the Champions League Final 2026?", "The 2026 Champions League Final is at the Allianz Arena in Munich, Germany."],
    ["Can I buy Champions League tickets for any team?", "Yes! We sell verified tickets for all Champions League teams including Real Madrid, Barcelona, Liverpool, Man City, Bayern Munich, and more."],
    ["Are the tickets genuine?", "All tickets are 100% verified from trusted sellers and protected by our FanProtect money-back guarantee."],
    ["When do Champions League tickets go on sale?", "Tickets for each round go on sale as soon as the draw is confirmed. Sign up for alerts to be first to know."],
]

cl_pages = {
    "champions-league-tickets": {
        "title": "Champions League Tickets 2026 | From \u20ac49 \u2013 All Rounds",
        "meta_description": "Buy Champions League 2025/26 tickets. All rounds from \u20ac49. Final in Munich from \u20ac295. Verified sellers, instant QR delivery, 100% money-back guarantee!",
        "content": CL_MAIN_CONTENT,
        "faq": CL_MAIN_FAQ,
        "event_name": "UEFA Champions League 2025/26",
        "price_low": 49,
        "price_high": 2995,
        "city": "Europe",
        "country": "EU",
        "venue": "Various",
        "category": "football",
    },
    "champions-league-final-tickets": {
        "title": "Champions League Final 2026 Tickets | Munich From \u20ac295",
        "meta_description": "Buy Champions League Final 2026 tickets at Allianz Arena Munich. From \u20ac295. Verified sellers, instant QR delivery, 100% FanProtect guarantee!",
        "content": CL_FINAL_CONTENT,
        "faq": CL_FINAL_FAQ,
        "event_name": "Champions League Final 2026",
        "price_low": 295,
        "price_high": 2995,
        "city": "Munich",
        "country": "Germany",
        "venue": "Allianz Arena",
        "category": "football",
    },
    "champions-league-semi-final-tickets": {
        "title": "Champions League Semi-Final Tickets 2026 | From \u20ac89",
        "meta_description": "Buy Champions League Semi-Final 2026 tickets. From \u20ac89. Verified sellers, instant QR delivery, 100% FanProtect money-back guarantee!",
        "content": CL_SEMI_CONTENT,
        "faq": CL_SEMI_FAQ,
        "event_name": "Champions League Semi-Finals 2026",
        "price_low": 89,
        "price_high": 599,
        "city": "Europe",
        "country": "EU",
        "venue": "TBD",
        "category": "football",
    },
    "champions-league-quarter-final-tickets": {
        "title": "Champions League Quarter-Final Tickets 2026 | From \u20ac69",
        "meta_description": "Buy Champions League Quarter-Final 2026 tickets. From \u20ac69. Best value for elite UCL football. Instant QR delivery, verified sellers!",
        "content": CL_QUARTER_CONTENT,
        "faq": CL_QUARTER_FAQ,
        "event_name": "Champions League Quarter-Finals 2026",
        "price_low": 69,
        "price_high": 449,
        "city": "Europe",
        "country": "EU",
        "venue": "TBD",
        "category": "football",
    },
}

for slug, data in cl_pages.items():
    full_data = {
        **data,
        "slug": slug,
        "description": data["meta_description"],
        "active": True,
    }
    result = db.seo_pages.update_one(
        {"slug": slug},
        {"$set": full_data},
        upsert=True
    )
    print(f"  {'CREATED' if result.upserted_id else 'UPDATED'}: {slug}")

# Also update existing CL Final page
db.seo_pages.update_one(
    {"slug": "champions-league-final-2026-tickets"},
    {"$set": {
        "title": "Champions League Final 2026 Tickets Munich | From \u20ac295 \u2013 Verified",
        "meta_description": "Buy Champions League Final 2026 tickets. Allianz Arena Munich from \u20ac295. Instant QR delivery, verified sellers, 100% FanProtect guarantee!",
        "content": CL_FINAL_CONTENT,
        "faq": CL_FINAL_FAQ,
        "price_low": 295,
        "price_high": 2995,
    }}
)
print("  UPDATED: champions-league-final-2026-tickets")

# Update buy-champions-league-final-tickets-2026
db.seo_pages.update_one(
    {"slug": "buy-champions-league-final-tickets-2026"},
    {"$set": {
        "title": "Buy Champions League Final Tickets 2026 | Munich \u20ac295",
        "meta_description": "Buy Champions League Final 2026 tickets. Allianz Arena Munich from \u20ac295. Verified sellers, instant QR delivery!",
        "content": CL_FINAL_CONTENT,
        "faq": CL_FINAL_FAQ,
        "price_low": 295,
        "price_high": 2995,
    }}
)
print("  UPDATED: buy-champions-league-final-tickets-2026")


# ============================================================
# 3. UPDATE TEAM PAGE TITLES FOR CTR (price + urgency)
# ============================================================
print("\n=== UPDATING TEAM PAGE TITLES ===")

team_updates = {
    "real-madrid-tickets": {
        "title": "Real Madrid Tickets 2026 | From \u20ac49 \u2013 Bernabeu Verified",
        "meta_description": "Buy Real Madrid 2026 tickets. Santiago Bernabeu from \u20ac49. La Liga, Champions League, El Clasico. Instant QR delivery, 100% FanProtect guarantee!",
        "price_low": 49, "price_high": 995,
    },
    "barcelona-tickets": {
        "title": "FC Barcelona Tickets 2026 | From \u20ac45 \u2013 Camp Nou",
        "meta_description": "Buy FC Barcelona 2026 tickets. New Camp Nou from \u20ac45. La Liga, Champions League. Instant QR delivery, verified sellers, FanProtect guarantee!",
        "price_low": 45, "price_high": 895,
    },
    "manchester-city-tickets": {
        "title": "Man City Tickets 2026 | From \u00a345 \u2013 Etihad Stadium",
        "meta_description": "Buy Manchester City 2026 tickets. Etihad Stadium from \u00a345. Premier League, Champions League. Instant delivery, verified, FanProtect guarantee!",
        "price_low": 45, "price_high": 595,
    },
    "liverpool-tickets": {
        "title": "Liverpool FC Tickets 2026 | From \u00a349 \u2013 Anfield",
        "meta_description": "Buy Liverpool FC 2026 tickets. Anfield from \u00a349. Premier League, Champions League. Instant QR delivery, verified sellers, FanProtect guarantee!",
        "price_low": 49, "price_high": 695,
    },
    "arsenal-tickets": {
        "title": "Arsenal Tickets 2026 | From \u00a349 \u2013 Emirates Stadium",
        "meta_description": "Buy Arsenal 2026 tickets. Emirates Stadium from \u00a349. Premier League, Champions League. Instant delivery, verified, FanProtect guarantee!",
        "price_low": 49, "price_high": 595,
    },
    "bayern-munich-tickets": {
        "title": "Bayern Munich Tickets 2026 | From \u20ac65 \u2013 Allianz Arena",
        "meta_description": "Buy Bayern Munich 2026 tickets. Allianz Arena from \u20ac65. Bundesliga, Champions League. Instant QR delivery, verified sellers!",
        "price_low": 65, "price_high": 695,
    },
    "psg-tickets": {
        "title": "PSG Tickets 2026 | From \u20ac55 \u2013 Parc des Princes",
        "meta_description": "Buy PSG 2026 tickets. Parc des Princes from \u20ac55. Ligue 1, Champions League. Instant QR delivery, verified sellers, FanProtect guarantee!",
        "price_low": 55, "price_high": 595,
    },
    "juventus-tickets": {
        "title": "Juventus Tickets 2026 | From \u20ac39 \u2013 Allianz Stadium Turin",
        "meta_description": "Buy Juventus 2026 tickets. Allianz Stadium Turin from \u20ac39. Serie A, Champions League. Instant delivery, verified, FanProtect guarantee!",
        "price_low": 39, "price_high": 495,
    },
    "inter-milan-tickets": {
        "title": "Inter Milan Tickets 2026 | From \u20ac35 \u2013 San Siro",
        "meta_description": "Buy Inter Milan 2026 tickets. San Siro from \u20ac35. Serie A, Champions League. Instant QR delivery, verified sellers, FanProtect guarantee!",
        "price_low": 35, "price_high": 595,
    },
    "ac-milan-tickets": {
        "title": "AC Milan Tickets 2026 | From \u20ac35 \u2013 San Siro",
        "meta_description": "Buy AC Milan 2026 tickets. San Siro from \u20ac35. Serie A, Champions League, Milan Derby. Instant delivery, verified, FanProtect guarantee!",
        "price_low": 35, "price_high": 595,
    },
}

for slug, data in team_updates.items():
    result = db.seo_pages.update_one({"slug": slug}, {"$set": data})
    print(f"  {'OK' if result.modified_count else 'NO CHANGE'}: {slug}")

# Update CL knockout page
db.seo_pages.update_one(
    {"slug": "champions-league-knockout-stage-tickets"},
    {"$set": {
        "title": "Champions League Knockout Tickets 2026 | From \u20ac49 \u2013 Verified",
        "meta_description": "Buy Champions League Knockout Stage 2026 tickets. Round of 16, Quarter-Finals, Semi-Finals. From \u20ac49. Instant delivery, FanProtect guarantee!",
        "price_low": 49,
        "price_high": 2995,
    }}
)
print("  UPDATED: champions-league-knockout-stage-tickets")

print("\n=== DONE ===")
total = db.seo_pages.count_documents({"active": True})
print(f"Total active SEO pages: {total}")
