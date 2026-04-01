"""
MEGA SEO PUSH - Generate high-value commercial keyword pages + resubmit everything
Targets: "buy [event] tickets", "cheap [event] tickets", "[city] [sport] tickets"
"""
import pymongo
import os
from datetime import datetime, timezone

client = pymongo.MongoClient(os.environ.get('MONGO_URL'))
db = client[os.environ.get('DB_NAME', 'euromatchtickets')]

SITE = "https://euromatchtickets.com"
NOW = datetime.now(timezone.utc).isoformat()

# ═══════════════════════════════════════════════════════════════
# 1. HIGH-VALUE "BUY CHEAP" KEYWORD PAGES - F1
# ═══════════════════════════════════════════════════════════════
f1_buy_cheap_pages = [
    {
        "slug": "cheap-f1-tickets-2026",
        "title": "Cheap F1 Tickets 2026 | From €61",
        "description": "Buy the cheapest F1 tickets for 2026. All 24 Grand Prix races from €61. General admission, grandstand, VIP. 0% fees, instant delivery. Compare prices now.",
        "keywords": "cheap f1 tickets, cheapest f1 tickets 2026, f1 tickets cheap, formula 1 cheap tickets, discount f1 tickets, affordable f1 tickets",
        "category": "f1",
        "page_type": "commercial_landing",
        "content": """<h2>Cheapest F1 Tickets for 2026 Season</h2>
<p>Looking for cheap F1 tickets? EuroMatchTickets offers the lowest prices for all 24 Formula 1 Grand Prix races in 2026. Our prices are up to 40% cheaper than official outlets and major resale platforms like StubHub and Viagogo.</p>

<h3>Cheapest F1 Races in 2026</h3>
<ul>
<li><strong>Hungarian Grand Prix</strong> - Budapest, from €61</li>
<li><strong>Spanish Grand Prix</strong> - Barcelona, from €60</li>
<li><strong>Italian Grand Prix</strong> - Monza, from €61</li>
<li><strong>Emilia Romagna Grand Prix</strong> - Imola, from €61</li>
<li><strong>Belgian Grand Prix</strong> - Spa, from €67</li>
<li><strong>Chinese Grand Prix</strong> - Shanghai, from €71</li>
</ul>

<h3>Why Are Our F1 Tickets So Cheap?</h3>
<p>We work directly with verified ticket holders and official distributors, cutting out middlemen. Plus, we charge 0% service fees - the price you see is the price you pay.</p>

<h3>F1 Ticket Price Comparison 2026</h3>
<table>
<tr><th>Platform</th><th>Avg Price</th><th>Service Fee</th></tr>
<tr><td>F1.com Official</td><td>€399</td><td>10-15%</td></tr>
<tr><td>StubHub</td><td>€379</td><td>25-30%</td></tr>
<tr><td>Viagogo</td><td>€365</td><td>20-28%</td></tr>
<tr><td><strong>EuroMatchTickets</strong></td><td><strong>€189</strong></td><td><strong>0%</strong></td></tr>
</table>

<h3>Tips to Get Cheap F1 Tickets</h3>
<ol>
<li>Book early - prices increase closer to race day</li>
<li>Consider general admission for the cheapest option</li>
<li>Look at less popular races like Hungary, Spain, or Italy</li>
<li>Buy multiple race packages for additional discounts</li>
</ol>""",
        "priority": 98,
    },
    {
        "slug": "buy-f1-tickets-online",
        "title": "Buy F1 Tickets Online 2026 | All Races",
        "description": "Buy Formula 1 tickets online for all 24 Grand Prix races in 2026. Secure checkout, instant QR delivery, 100% buyer protection. From €61.",
        "keywords": "buy f1 tickets, buy f1 tickets online, buy formula 1 tickets, purchase f1 tickets, order f1 tickets online, f1 tickets for sale",
        "category": "f1",
        "page_type": "commercial_landing",
        "content": """<h2>Buy F1 Tickets Online - All 2026 Races</h2>
<p>Ready to buy F1 tickets? EuroMatchTickets is your trusted source for verified Formula 1 Grand Prix tickets. Buy tickets for any of the 24 races in the 2026 season with instant QR delivery and 100% buyer protection.</p>

<h3>How to Buy F1 Tickets</h3>
<ol>
<li>Choose your Grand Prix race from our calendar</li>
<li>Select your preferred seating category (General Admission, Grandstand, VIP, Paddock Club)</li>
<li>Complete secure checkout with instant confirmation</li>
<li>Receive your e-tickets via email immediately</li>
</ol>

<h3>Most Popular F1 Races to Buy Tickets For</h3>
<ul>
<li><strong>Monaco Grand Prix</strong> - The crown jewel of F1, from €37</li>
<li><strong>British Grand Prix Silverstone</strong> - 140,000+ fans, from €92</li>
<li><strong>Las Vegas Grand Prix</strong> - Night race spectacle, from €177</li>
<li><strong>Singapore Grand Prix</strong> - Marina Bay under lights, from €100</li>
<li><strong>Italian Grand Prix Monza</strong> - Temple of Speed, from €61</li>
</ul>

<h3>Why Buy F1 Tickets From EuroMatchTickets?</h3>
<ul>
<li>Up to 40% cheaper than official prices</li>
<li>0% service fees - what you see is what you pay</li>
<li>100% verified tickets with FanProtect guarantee</li>
<li>Instant QR delivery via email</li>
<li>Full refund if event is cancelled</li>
</ul>""",
        "priority": 98,
    },
    {
        "slug": "f1-ticket-prices-2026",
        "title": "F1 Ticket Prices 2026 | Complete Guide",
        "description": "Complete guide to F1 2026 ticket prices. Compare costs for all 24 Grand Prix races. General admission from €61, grandstand from €149, VIP from €989.",
        "keywords": "f1 ticket prices 2026, formula 1 ticket prices, how much do f1 tickets cost, f1 tickets price guide, grand prix ticket prices",
        "category": "f1",
        "page_type": "guide",
        "content": """<h2>F1 Ticket Prices 2026 - Complete Price Guide</h2>
<p>Planning to attend a Formula 1 race in 2026? Here's everything you need to know about F1 ticket prices for the 2026 season.</p>

<h3>F1 Ticket Categories & Prices</h3>
<table>
<tr><th>Category</th><th>Price Range</th><th>What's Included</th></tr>
<tr><td>General Admission</td><td>€61 - €199</td><td>Standing areas, big screens, free roaming</td></tr>
<tr><td>Grandstand</td><td>€149 - €589</td><td>Reserved seat, excellent track views</td></tr>
<tr><td>VIP Hospitality</td><td>€989 - €1,989</td><td>Premium lounge, gourmet food, open bar</td></tr>
<tr><td>Paddock Club</td><td>€2,989 - €5,989</td><td>Pit lane access, driver meet & greet, luxury dining</td></tr>
</table>

<h3>Most Expensive F1 Races 2026</h3>
<ol>
<li>Monaco Grand Prix - from €37 (GA) to €5,989 (Paddock Club)</li>
<li>Las Vegas Grand Prix - from €177 (GA) to €4,989 (VIP)</li>
<li>Singapore Grand Prix - from €100 (GA) to €3,989 (Hospitality)</li>
<li>Miami Grand Prix - from €102 (GA) to €3,500 (VIP)</li>
</ol>

<h3>Cheapest F1 Races 2026</h3>
<ol>
<li>Spanish Grand Prix Barcelona - from €60</li>
<li>Hungarian Grand Prix Budapest - from €61</li>
<li>Italian Grand Prix Monza - from €61</li>
<li>Bahrain Grand Prix - from €61</li>
</ol>""",
        "priority": 95,
    },
    {
        "slug": "f1-vip-tickets-2026",
        "title": "F1 VIP Tickets 2026 | Paddock Club",
        "description": "Buy F1 VIP hospitality and Paddock Club tickets for 2026. Premium experience with pit lane access, gourmet dining, and driver meet & greet.",
        "keywords": "f1 vip tickets, f1 hospitality tickets 2026, paddock club tickets, f1 premium tickets, formula 1 vip experience",
        "category": "f1",
        "page_type": "commercial_landing",
        "content": """<h2>F1 VIP & Paddock Club Tickets 2026</h2>
<p>Experience Formula 1 like never before with our VIP hospitality and Paddock Club packages. Get exclusive pit lane access, gourmet dining, and the chance to meet F1 drivers.</p>

<h3>VIP Hospitality Packages</h3>
<ul>
<li>Premium grandstand seating with the best views</li>
<li>Gourmet food and premium open bar</li>
<li>Exclusive lounge access</li>
<li>Pit lane walks and behind-the-scenes access</li>
<li>Official merchandise and souvenirs</li>
</ul>

<h3>Paddock Club Experience</h3>
<ul>
<li>The ultimate F1 experience - above the pit garages</li>
<li>Driver meet & greet opportunities</li>
<li>Champagne reception and fine dining</li>
<li>Personal race guide and commentary</li>
<li>From €2,989 per person</li>
</ul>""",
        "priority": 92,
    },
    {
        "slug": "last-minute-f1-tickets",
        "title": "Last Minute F1 Tickets 2026 | Buy Now",
        "description": "Last minute F1 tickets available for 2026 Grand Prix races. Limited availability, instant delivery. Don't miss out - book now!",
        "keywords": "last minute f1 tickets, f1 tickets last minute, late f1 tickets, f1 tickets available now, urgent f1 tickets",
        "category": "f1",
        "page_type": "commercial_landing",
        "content": """<h2>Last Minute F1 Tickets 2026</h2>
<p>Looking for last minute F1 tickets? We still have availability for upcoming Grand Prix races. Book now before they sell out!</p>

<h3>Next Available F1 Races</h3>
<p>Check our live inventory for the latest availability. We update ticket counts in real-time so you always know what's available.</p>

<h3>Tips for Buying Last Minute F1 Tickets</h3>
<ul>
<li>General admission tickets have the best last-minute availability</li>
<li>Prices may increase closer to race day - buy as soon as possible</li>
<li>Consider less popular races for better last-minute deals</li>
<li>All tickets come with instant QR delivery - no waiting for postal delivery</li>
</ul>""",
        "priority": 90,
    },
]

# ═══════════════════════════════════════════════════════════════
# 2. HIGH-VALUE FOOTBALL KEYWORD PAGES
# ═══════════════════════════════════════════════════════════════
football_pages = [
    {
        "slug": "cheap-champions-league-tickets",
        "title": "Cheap Champions League Tickets 2026",
        "description": "Buy cheap Champions League tickets for 2025/26 season. Group stage from €49, knockout from €89. All matches, best prices guaranteed.",
        "keywords": "cheap champions league tickets, cheapest ucl tickets, buy champions league tickets cheap, affordable champions league tickets",
        "category": "football",
        "page_type": "commercial_landing",
        "content": """<h2>Cheapest Champions League Tickets 2025/26</h2>
<p>Watch Europe's elite football competition without breaking the bank. We offer the cheapest Champions League tickets with 0% service fees.</p>
<h3>Champions League Ticket Prices</h3>
<ul>
<li>Group Stage: from €49</li>
<li>Round of 16: from €89</li>
<li>Quarter Finals: from €149</li>
<li>Semi Finals: from €249</li>
<li>Final: from €499</li>
</ul>""",
        "priority": 95,
    },
    {
        "slug": "buy-champions-league-final-tickets-2026",
        "title": "Champions League Final 2026 Tickets",
        "description": "Buy Champions League Final 2026 tickets. The biggest match in club football. Verified tickets, instant delivery, 100% buyer protection.",
        "keywords": "champions league final tickets, ucl final 2026 tickets, buy champions league final tickets, champions league final 2026",
        "category": "football",
        "page_type": "commercial_landing",
        "content": """<h2>Champions League Final 2026 Tickets</h2>
<p>The UEFA Champions League Final is the biggest match in European club football. Secure your tickets now for the 2026 final.</p>
<h3>Ticket Categories</h3>
<ul><li>Category 1: Premium seats behind the goals - from €499</li>
<li>Category 2: Side-line seats - from €699</li>
<li>Category 3: VIP Hospitality - from €1,499</li></ul>""",
        "priority": 97,
    },
    {
        "slug": "buy-premier-league-tickets",
        "title": "Buy Premier League Tickets 2026",
        "description": "Buy Premier League tickets for all clubs. Arsenal, Liverpool, Manchester United, Chelsea, Man City. From €49. Instant QR delivery.",
        "keywords": "buy premier league tickets, premier league tickets, epl tickets, english premier league tickets 2026, buy epl tickets online",
        "category": "football",
        "page_type": "commercial_landing",
        "content": """<h2>Buy Premier League Tickets 2025/26</h2>
<p>Experience the world's most exciting football league live. Buy verified Premier League tickets for all 20 clubs.</p>
<h3>Popular Premier League Tickets</h3>
<ul>
<li>Arsenal - Emirates Stadium - from €89</li>
<li>Liverpool - Anfield - from €79</li>
<li>Manchester United - Old Trafford - from €69</li>
<li>Chelsea - Stamford Bridge - from €79</li>
<li>Manchester City - Etihad Stadium - from €69</li>
<li>Tottenham - Tottenham Hotspur Stadium - from €59</li>
</ul>""",
        "priority": 95,
    },
    {
        "slug": "buy-la-liga-tickets",
        "title": "Buy La Liga Tickets 2026 | Spain",
        "description": "Buy La Liga tickets for Real Madrid, Barcelona, Atletico Madrid and more. Spanish football tickets from €39. Best prices.",
        "keywords": "buy la liga tickets, la liga tickets, spanish football tickets, real madrid tickets, barcelona tickets, spain football tickets",
        "category": "football",
        "page_type": "commercial_landing",
        "content": """<h2>Buy La Liga Tickets - Spanish Football</h2>
<p>Watch the best football in Spain live. Buy La Liga tickets for Real Madrid at Santiago Bernabeu, Barcelona at Camp Nou, and all other clubs.</p>
<h3>Top La Liga Tickets</h3>
<ul>
<li>Real Madrid - Santiago Bernabeu - from €59</li>
<li>FC Barcelona - Camp Nou - from €49</li>
<li>Atletico Madrid - Metropolitano - from €39</li>
<li>El Clasico (Real Madrid vs Barcelona) - from €199</li>
</ul>""",
        "priority": 94,
    },
    {
        "slug": "buy-serie-a-tickets",
        "title": "Buy Serie A Tickets 2026 | Italy",
        "description": "Buy Italian Serie A football tickets. Juventus, AC Milan, Inter Milan, Roma, Napoli. From €29. Best prices guaranteed.",
        "keywords": "buy serie a tickets, serie a tickets, italian football tickets, juventus tickets, ac milan tickets, inter milan tickets",
        "category": "football",
        "page_type": "commercial_landing",
        "content": """<h2>Buy Serie A Tickets - Italian Football</h2>
<p>Experience Italian football passion live. Buy Serie A tickets for Juventus, AC Milan, Inter Milan, Roma, Napoli and more.</p>
<h3>Top Serie A Tickets</h3>
<ul>
<li>Juventus - Allianz Stadium - from €39</li>
<li>AC Milan - San Siro - from €35</li>
<li>Inter Milan - San Siro - from €35</li>
<li>AS Roma - Stadio Olimpico - from €29</li>
<li>SSC Napoli - Stadio Maradona - from €29</li>
<li>Derby della Madonnina (Milan vs Inter) - from €99</li>
</ul>""",
        "priority": 93,
    },
    {
        "slug": "buy-bundesliga-tickets",
        "title": "Buy Bundesliga Tickets 2026 | Germany",
        "description": "Buy German Bundesliga tickets. Bayern Munich, Borussia Dortmund, Bayer Leverkusen. From €25. Instant delivery.",
        "keywords": "buy bundesliga tickets, bundesliga tickets, german football tickets, bayern munich tickets, borussia dortmund tickets",
        "category": "football",
        "page_type": "commercial_landing",
        "content": """<h2>Buy Bundesliga Tickets - German Football</h2>
<p>Experience the incredible atmosphere of German football. Buy Bundesliga tickets for Bayern Munich, Borussia Dortmund, and more.</p>
<h3>Top Bundesliga Tickets</h3>
<ul>
<li>Bayern Munich - Allianz Arena - from €35</li>
<li>Borussia Dortmund - Signal Iduna Park - from €25</li>
<li>Bayer Leverkusen - BayArena - from €29</li>
<li>RB Leipzig - Red Bull Arena - from €25</li>
<li>Der Klassiker (Bayern vs Dortmund) - from €89</li>
</ul>""",
        "priority": 93,
    },
]

# ═══════════════════════════════════════════════════════════════
# 3. CITY-BASED TICKET PAGES (Local SEO)
# ═══════════════════════════════════════════════════════════════
city_pages = [
    {"slug": "london-event-tickets", "title": "London Event Tickets 2026", "city": "London", "country": "UK",
     "description": "Buy tickets for events in London. Premier League, concerts, theatre. Arsenal, Chelsea, Tottenham, Wembley. From €29.",
     "keywords": "london event tickets, london football tickets, london concert tickets, buy tickets london, wembley tickets, emirates stadium tickets"},
    {"slug": "paris-event-tickets", "title": "Paris Event Tickets 2026", "city": "Paris", "country": "France",
     "description": "Buy tickets for events in Paris. PSG at Parc des Princes, concerts at Stade de France, Roland Garros. From €35.",
     "keywords": "paris event tickets, paris football tickets, psg tickets, stade de france tickets, paris concerts"},
    {"slug": "madrid-event-tickets", "title": "Madrid Event Tickets 2026", "city": "Madrid", "country": "Spain",
     "description": "Buy tickets for events in Madrid. Real Madrid at Bernabeu, Atletico Madrid, concerts, F1 Madrid GP. From €39.",
     "keywords": "madrid event tickets, real madrid tickets, atletico madrid tickets, madrid concert tickets, madrid gp tickets"},
    {"slug": "barcelona-event-tickets", "title": "Barcelona Event Tickets 2026", "city": "Barcelona", "country": "Spain",
     "description": "Buy tickets for events in Barcelona. FC Barcelona at Camp Nou, concerts, Spanish GP. From €39.",
     "keywords": "barcelona event tickets, fc barcelona tickets, camp nou tickets, barcelona concert tickets, spanish gp tickets"},
    {"slug": "milan-event-tickets", "title": "Milan Event Tickets 2026", "city": "Milan", "country": "Italy",
     "description": "Buy tickets for events in Milan. AC Milan, Inter Milan at San Siro, F1 Italian GP Monza. From €29.",
     "keywords": "milan event tickets, ac milan tickets, inter milan tickets, san siro tickets, monza gp tickets"},
    {"slug": "munich-event-tickets", "title": "Munich Event Tickets 2026", "city": "Munich", "country": "Germany",
     "description": "Buy tickets for events in Munich. Bayern Munich at Allianz Arena, concerts, Oktoberfest events. From €29.",
     "keywords": "munich event tickets, bayern munich tickets, allianz arena tickets, munich concert tickets"},
    {"slug": "amsterdam-event-tickets", "title": "Amsterdam Event Tickets 2026", "city": "Amsterdam", "country": "Netherlands",
     "description": "Buy tickets for events in Amsterdam. Ajax, concerts, F1 Dutch GP Zandvoort. From €35.",
     "keywords": "amsterdam event tickets, ajax tickets, dutch gp tickets, zandvoort tickets, amsterdam concerts"},
    {"slug": "istanbul-event-tickets", "title": "Istanbul Event Tickets 2026", "city": "Istanbul", "country": "Turkey",
     "description": "Buy tickets for events in Istanbul. Galatasaray, Fenerbahce, Besiktas, concerts. From €19.",
     "keywords": "istanbul event tickets, galatasaray tickets, fenerbahce tickets, istanbul football tickets"},
    {"slug": "lisbon-event-tickets", "title": "Lisbon Event Tickets 2026", "city": "Lisbon", "country": "Portugal",
     "description": "Buy tickets for events in Lisbon. Benfica, Sporting CP, concerts. From €25.",
     "keywords": "lisbon event tickets, benfica tickets, sporting cp tickets, lisbon concert tickets"},
    {"slug": "dubai-event-tickets", "title": "Dubai Event Tickets 2026", "city": "Dubai", "country": "UAE",
     "description": "Buy tickets for events in Dubai. Abu Dhabi GP, concerts, international matches. From €49.",
     "keywords": "dubai event tickets, abu dhabi gp tickets, dubai concert tickets, uae event tickets"},
]

# ═══════════════════════════════════════════════════════════════
# 4. CONCERT & ENTERTAINMENT KEYWORD PAGES
# ═══════════════════════════════════════════════════════════════
concert_pages = [
    {"slug": "cheap-concert-tickets-europe", "title": "Cheap Concert Tickets Europe 2026",
     "description": "Buy cheap concert tickets for Europe's biggest tours 2026. Coldplay, Taylor Swift, Ed Sheeran, The Weeknd. From €39.",
     "keywords": "cheap concert tickets europe, buy concert tickets cheap, european concert tickets, music tickets europe 2026",
     "category": "concert"},
    {"slug": "buy-coldplay-tickets-2026", "title": "Buy Coldplay Tickets 2026 Europe Tour",
     "description": "Buy Coldplay tickets for 2026 European tour. All concert dates, venues, and cheapest prices. From €59.",
     "keywords": "buy coldplay tickets, coldplay tickets 2026, coldplay europe tour tickets, coldplay concert tickets",
     "category": "concert"},
    {"slug": "buy-ed-sheeran-tickets-2026", "title": "Buy Ed Sheeran Tickets 2026 Tour",
     "description": "Buy Ed Sheeran concert tickets for 2026 European tour dates. All venues, best prices. From €49.",
     "keywords": "buy ed sheeran tickets, ed sheeran tickets 2026, ed sheeran concert tickets, ed sheeran tour 2026",
     "category": "concert"},
]

# ═══════════════════════════════════════════════════════════════
# 5. WORLD CUP 2026 KEYWORD PAGES
# ═══════════════════════════════════════════════════════════════
worldcup_pages = [
    {"slug": "cheap-world-cup-2026-tickets", "title": "Cheap World Cup 2026 Tickets",
     "description": "Buy cheap FIFA World Cup 2026 tickets. USA, Canada, Mexico. Group stage from €79. Instant delivery, 0% fees.",
     "keywords": "cheap world cup tickets, world cup 2026 tickets cheap, cheapest world cup tickets, affordable world cup 2026",
     "category": "worldcup"},
    {"slug": "buy-world-cup-final-2026-tickets", "title": "World Cup Final 2026 Tickets | MetLife",
     "description": "Buy FIFA World Cup 2026 Final tickets at MetLife Stadium, New York. The biggest sporting event. From €299.",
     "keywords": "world cup final tickets 2026, buy world cup final tickets, fifa world cup final 2026, metlife stadium world cup",
     "category": "worldcup"},
    {"slug": "world-cup-2026-schedule-tickets", "title": "World Cup 2026 Schedule & Tickets",
     "description": "Complete FIFA World Cup 2026 schedule with ticket prices. 48 teams, 104 matches across USA, Canada, Mexico.",
     "keywords": "world cup 2026 schedule, world cup 2026 fixtures, world cup 2026 match schedule, fifa world cup 2026 dates",
     "category": "worldcup"},
]

# ═══════════════════════════════════════════════════════════════
# INSERT ALL PAGES
# ═══════════════════════════════════════════════════════════════
all_new_pages = f1_buy_cheap_pages + football_pages + concert_pages + worldcup_pages

# Add city pages with standard structure
for cp in city_pages:
    all_new_pages.append({
        "slug": cp["slug"],
        "title": cp["title"],
        "description": cp["description"],
        "keywords": cp["keywords"],
        "category": "city",
        "page_type": "city_landing",
        "city": cp["city"],
        "country": cp["country"],
        "content": f"""<h2>Buy Tickets for Events in {cp['city']}</h2>
<p>Find the best tickets for football, concerts, and sporting events in {cp['city']}. EuroMatchTickets offers verified tickets with 0% service fees and instant delivery.</p>
<h3>Popular Events in {cp['city']}</h3>
<p>Browse our full selection of {cp['city']} events and book your tickets today.</p>""",
        "priority": 88,
    })

inserted = 0
updated = 0
for page in all_new_pages:
    # Set defaults
    page.setdefault("active", True)
    page.setdefault("created_at", NOW)
    page.setdefault("updated_at", NOW)
    page.setdefault("page_type", "commercial_landing")
    page.setdefault("priority", 90)
    page.setdefault("image", f"{SITE}/og-image.jpg")
    page.setdefault("meta_description", page.get("description", ""))
    
    result = db.seo_pages.update_one(
        {"slug": page["slug"]},
        {"$set": page},
        upsert=True
    )
    if result.upserted_id:
        inserted += 1
    else:
        updated += 1

total = db.seo_pages.count_documents({"active": True})
print(f"Inserted: {inserted} new pages")
print(f"Updated: {updated} existing pages")
print(f"Total active pages: {total}")

# ═══════════════════════════════════════════════════════════════
# 6. OPTIMIZE EXISTING PAGE TITLES FOR CTR
# ═══════════════════════════════════════════════════════════════
title_fixes = {
    "japanese-grand-prix-2026-tickets": "Japanese GP Tickets 2026 | Suzuka from €86",
    "chinese-grand-prix-2026-tickets": "Chinese GP Tickets 2026 | Shanghai from €71",
    "miami-grand-prix-2026-tickets": "Miami GP Tickets 2026 | Sprint from €102",
    "emilia-romagna-grand-prix-2026-tickets": "Imola F1 Tickets 2026 | Emilia Romagna GP",
    "canadian-grand-prix-2026-tickets": "Canadian GP Tickets 2026 | Montreal from €76",
    "spanish-grand-prix-2026-tickets": "Spanish GP Tickets 2026 | Barcelona from €60",
    "austrian-grand-prix-2026-tickets": "Austrian GP Tickets 2026 | Red Bull Ring €62",
    "british-grand-prix-2026-tickets": "Silverstone F1 Tickets 2026 | British GP €92",
    "hungarian-grand-prix-2026-tickets": "Hungarian GP Tickets 2026 | Budapest from €61",
    "belgian-grand-prix-2026-tickets": "Spa F1 Tickets 2026 | Belgian GP from €67",
    "dutch-grand-prix-2026-tickets": "Zandvoort F1 Tickets 2026 | Dutch GP from €101",
    "italian-grand-prix-2026-tickets": "Monza F1 Tickets 2026 | Italian GP from €61",
    "azerbaijan-grand-prix-2026-tickets": "Baku F1 Tickets 2026 | Azerbaijan GP from €169",
    "singapore-grand-prix-2026-tickets": "Singapore GP Tickets 2026 | Night Race €100",
    "united-states-grand-prix-2026-tickets": "COTA F1 Tickets 2026 | US GP Austin from €86",
    "mexico-city-grand-prix-2026-tickets": "Mexico City GP Tickets 2026 | F1 from €61",
    "brazilian-grand-prix-2026-tickets": "Interlagos F1 Tickets 2026 | Brazil GP €67",
    "las-vegas-grand-prix-2026-tickets": "Las Vegas GP Tickets 2026 | Night Race €177",
    "qatar-grand-prix-2026-tickets": "Qatar GP Tickets 2026 | Lusail Circuit from €115",
    "abu-dhabi-grand-prix-2026-tickets": "Abu Dhabi GP Tickets 2026 | Yas Marina €169",
}

title_updated = 0
for slug, new_title in title_fixes.items():
    result = db.seo_pages.update_one(
        {"slug": slug},
        {"$set": {"title": new_title, "updated_at": NOW}}
    )
    if result.modified_count > 0:
        title_updated += 1

print(f"Title-optimized: {title_updated} pages")
print("DONE!")
