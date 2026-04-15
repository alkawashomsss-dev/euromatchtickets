"""Seed ALL missing events that checkout buttons reference - with real tickets."""
import asyncio
import random
from motor.motor_asyncio import AsyncIOMotorClient

MISSING_EVENTS = [
    # F1
    {"slug": "australian-grand-prix-2026-tickets", "alt": "australia-grand-prix-2026", "title": "Australian Grand Prix 2026", "event_type": "f1", "venue": "Albert Park Circuit", "city": "Melbourne", "country": "Australia", "event_date": "2026-04-06T05:00:00Z", "price_from": 169},
    {"slug": "austrian-grand-prix-2026-tickets", "alt": "austria-grand-prix-2026", "title": "Austrian Grand Prix 2026", "event_type": "f1", "venue": "Red Bull Ring", "city": "Spielberg", "country": "Austria", "event_date": "2026-07-05T13:00:00Z", "price_from": 139},
    {"slug": "bahrain-grand-prix-2026-tickets", "alt": "bahrain-grand-prix", "title": "Bahrain Grand Prix 2026", "event_type": "f1", "venue": "Bahrain International Circuit", "city": "Sakhir", "country": "Bahrain", "event_date": "2026-03-08T15:00:00Z", "price_from": 149},
    {"slug": "saudi-arabian-grand-prix-2026-tickets", "alt": "saudi-grand-prix-2026", "title": "Saudi Arabian Grand Prix 2026", "event_type": "f1", "venue": "Jeddah Corniche Circuit", "city": "Jeddah", "country": "Saudi Arabia", "event_date": "2026-03-22T17:00:00Z", "price_from": 199},
    {"slug": "japanese-grand-prix-2026-tickets", "alt": "japan-grand-prix-2026", "title": "Japanese Grand Prix 2026", "event_type": "f1", "venue": "Suzuka International Racing Course", "city": "Suzuka", "country": "Japan", "event_date": "2026-04-20T05:00:00Z", "price_from": 179},
    {"slug": "chinese-grand-prix-2026-tickets", "alt": "f1-chinese-grand-prix-2026", "title": "Chinese Grand Prix 2026", "event_type": "f1", "venue": "Shanghai International Circuit", "city": "Shanghai", "country": "China", "event_date": "2026-05-04T07:00:00Z", "price_from": 159},
    {"slug": "miami-grand-prix-2026-tickets", "alt": "miami-grand-prix-2026", "title": "Miami Grand Prix 2026", "event_type": "f1", "venue": "Miami International Autodrome", "city": "Miami", "country": "USA", "event_date": "2026-05-18T20:00:00Z", "price_from": 229},
    {"slug": "canadian-grand-prix-2026-tickets", "alt": "f1-canadian-grand-prix-2026", "title": "Canadian Grand Prix 2026", "event_type": "f1", "venue": "Circuit Gilles Villeneuve", "city": "Montreal", "country": "Canada", "event_date": "2026-06-28T18:00:00Z", "price_from": 159},
    {"slug": "spanish-grand-prix-2026-tickets", "alt": "spain-grand-prix-2026", "title": "Spanish Grand Prix 2026", "event_type": "f1", "venue": "Circuit de Barcelona-Catalunya", "city": "Barcelona", "country": "Spain", "event_date": "2026-06-14T13:00:00Z", "price_from": 129},
    {"slug": "hungarian-grand-prix-2026-tickets", "alt": "hungary-grand-prix-2026", "title": "Hungarian Grand Prix 2026", "event_type": "f1", "venue": "Hungaroring", "city": "Budapest", "country": "Hungary", "event_date": "2026-08-02T13:00:00Z", "price_from": 119},
    {"slug": "british-grand-prix-2026-tickets", "alt": "silverstone-grand-prix-2026", "title": "British Grand Prix 2026", "event_type": "f1", "venue": "Silverstone Circuit", "city": "Silverstone", "country": "UK", "event_date": "2026-07-19T14:00:00Z", "price_from": 149},
    {"slug": "dutch-grand-prix-2026-tickets", "alt": "zandvoort-grand-prix-2026", "title": "Dutch Grand Prix 2026", "event_type": "f1", "venue": "Circuit Zandvoort", "city": "Zandvoort", "country": "Netherlands", "event_date": "2026-09-06T13:00:00Z", "price_from": 149},
    {"slug": "italian-grand-prix-2026-tickets", "alt": "f1-italian-grand-prix-monza-2026", "title": "Italian Grand Prix 2026", "event_type": "f1", "venue": "Autodromo Nazionale Monza", "city": "Monza", "country": "Italy", "event_date": "2026-09-13T13:00:00Z", "price_from": 89},
    {"slug": "monaco-grand-prix-2026-tickets", "alt": "f1-monaco-grand-prix-2026", "title": "Monaco Grand Prix 2026", "event_type": "f1", "venue": "Circuit de Monaco", "city": "Monte Carlo", "country": "Monaco", "event_date": "2026-05-31T13:00:00Z", "price_from": 249},
    {"slug": "singapore-grand-prix-2026-tickets", "alt": "singapore-grand-prix-2026", "title": "Singapore Grand Prix 2026", "event_type": "f1", "venue": "Marina Bay Street Circuit", "city": "Singapore", "country": "Singapore", "event_date": "2026-10-04T20:00:00Z", "price_from": 189},
    {"slug": "las-vegas-grand-prix-2026-tickets", "alt": "las-vegas-grand-prix-2026", "title": "Las Vegas Grand Prix 2026", "event_type": "f1", "venue": "Las Vegas Strip Circuit", "city": "Las Vegas", "country": "USA", "event_date": "2026-11-22T22:00:00Z", "price_from": 249},
    {"slug": "united-states-grand-prix-2026-tickets", "alt": "f1-us-grand-prix-2026", "title": "United States Grand Prix 2026", "event_type": "f1", "venue": "Circuit of the Americas", "city": "Austin", "country": "USA", "event_date": "2026-10-18T19:00:00Z", "price_from": 189},
    {"slug": "mexico-city-grand-prix-2026-tickets", "alt": "f1-mexico-grand-prix-2026", "title": "Mexico City Grand Prix 2026", "event_type": "f1", "venue": "Autodromo Hermanos Rodriguez", "city": "Mexico City", "country": "Mexico", "event_date": "2026-10-25T20:00:00Z", "price_from": 129},
    {"slug": "brazilian-grand-prix-2026-tickets", "alt": "f1-brazil-grand-prix-2026", "title": "Brazilian Grand Prix 2026", "event_type": "f1", "venue": "Interlagos", "city": "Sao Paulo", "country": "Brazil", "event_date": "2026-11-08T17:00:00Z", "price_from": 139},
    {"slug": "qatar-grand-prix-2026-tickets", "alt": "f1-qatar-grand-prix-2026", "title": "Qatar Grand Prix 2026", "event_type": "f1", "venue": "Lusail International Circuit", "city": "Lusail", "country": "Qatar", "event_date": "2026-11-29T17:00:00Z", "price_from": 179},
    {"slug": "abu-dhabi-grand-prix-2026-tickets", "alt": "abu-dhabi-grand-prix-2026", "title": "Abu Dhabi Grand Prix 2026", "event_type": "f1", "venue": "Yas Marina Circuit", "city": "Abu Dhabi", "country": "UAE", "event_date": "2026-12-06T13:00:00Z", "price_from": 199},
    {"slug": "azerbaijan-grand-prix-2026-tickets", "alt": "f1-azerbaijan-grand-prix-2026", "title": "Azerbaijan Grand Prix 2026", "event_type": "f1", "venue": "Baku City Circuit", "city": "Baku", "country": "Azerbaijan", "event_date": "2026-09-20T11:00:00Z", "price_from": 149},
    # Concerts
    {"slug": "taylor-swift-eras-tour-london-2026-tickets", "alt": "taylor-swift-london-2026", "title": "Taylor Swift - Eras Tour London 2026", "event_type": "concert", "venue": "Wembley Stadium", "city": "London", "country": "UK", "event_date": "2026-06-19T18:30:00Z", "price_from": 89},
    {"slug": "the-weeknd-tour-2026-tickets", "alt": "the-weeknd-2026", "title": "The Weeknd - After Hours Til Dawn Tour 2026", "event_type": "concert", "venue": "Wembley Stadium", "city": "London", "country": "UK", "event_date": "2026-09-05T20:00:00Z", "price_from": 79},
    {"slug": "bruno-mars-tour-2026-tickets", "alt": "bruno-mars-2026", "title": "Bruno Mars - The Romantic Tour 2026", "event_type": "concert", "venue": "Wembley Stadium", "city": "London", "country": "UK", "event_date": "2026-09-19T20:00:00Z", "price_from": 89},
    {"slug": "bad-bunny-london-2026-tickets", "alt": "bad-bunny-2026", "title": "Bad Bunny London 2026", "event_type": "concert", "venue": "Tottenham Hotspur Stadium", "city": "London", "country": "UK", "event_date": "2026-08-22T20:00:00Z", "price_from": 79},
    {"slug": "coldplay-tour-2026-tickets", "alt": "coldplay-2026", "title": "Coldplay - Music of the Spheres Tour 2026", "event_type": "concert", "venue": "Olympiastadion", "city": "Berlin", "country": "Germany", "event_date": "2026-07-04T19:30:00Z", "price_from": 79},
    {"slug": "guns-n-roses-tour-2026-tickets", "alt": "guns-n-roses-2026", "title": "Guns N' Roses European Stadium Tour 2026", "event_type": "concert", "venue": "Olympic Stadium", "city": "London", "country": "UK", "event_date": "2026-07-25T19:00:00Z", "price_from": 89},
    # Football
    {"slug": "champions-league-2026-tickets", "alt": "champions-league-2026", "title": "UEFA Champions League 2026", "event_type": "football", "venue": "Allianz Arena", "city": "Munich", "country": "Germany", "event_date": "2026-05-30T20:00:00Z", "price_from": 99},
    {"slug": "bayern-munich-vs-real-madrid-ucl-2026-tickets", "alt": "bayern-munich-vs-real-madrid-ucl-2026", "title": "Bayern Munich vs Real Madrid - UCL 2026", "event_type": "football", "venue": "Allianz Arena", "city": "Munich", "country": "Germany", "event_date": "2026-04-08T20:00:00Z", "price_from": 129},
    {"slug": "bayern-vs-dortmund-2026-tickets", "alt": "bayern-vs-dortmund", "title": "Bayern Munich vs Borussia Dortmund - Der Klassiker", "event_type": "football", "venue": "Allianz Arena", "city": "Munich", "country": "Germany", "event_date": "2026-10-24T17:30:00Z", "price_from": 89},
    {"slug": "bayern-vs-barcelona-2026-tickets", "alt": "bayern-vs-barcelona", "title": "Bayern Munich vs FC Barcelona - UCL", "event_type": "football", "venue": "Allianz Arena", "city": "Munich", "country": "Germany", "event_date": "2026-11-05T20:00:00Z", "price_from": 119},
    {"slug": "bayern-vs-leipzig-2026-tickets", "alt": "bayern-vs-leipzig", "title": "Bayern Munich vs RB Leipzig - Bundesliga", "event_type": "football", "venue": "Allianz Arena", "city": "Munich", "country": "Germany", "event_date": "2026-09-19T17:30:00Z", "price_from": 69},
    {"slug": "bayern-vs-leverkusen-2026-tickets", "alt": "bayern-vs-leverkusen", "title": "Bayern Munich vs Bayer Leverkusen - Bundesliga", "event_type": "football", "venue": "Allianz Arena", "city": "Munich", "country": "Germany", "event_date": "2026-12-12T17:30:00Z", "price_from": 69},
    {"slug": "juventus-tickets-2026", "alt": "juventus-tickets", "title": "Juventus FC - Serie A 2026", "event_type": "football", "venue": "Allianz Stadium", "city": "Turin", "country": "Italy", "event_date": "2026-09-12T20:45:00Z", "price_from": 49},
    {"slug": "juventus-vs-inter-2026-tickets", "alt": "juventus-vs-inter", "title": "Juventus vs Inter Milan - Derby d'Italia", "event_type": "football", "venue": "Allianz Stadium", "city": "Turin", "country": "Italy", "event_date": "2026-10-03T20:45:00Z", "price_from": 89},
    {"slug": "juventus-vs-milan-2026-tickets", "alt": "juventus-vs-milan", "title": "Juventus vs AC Milan - Serie A", "event_type": "football", "venue": "Allianz Stadium", "city": "Turin", "country": "Italy", "event_date": "2026-11-07T20:45:00Z", "price_from": 79},
    {"slug": "juventus-vs-napoli-2026-tickets", "alt": "juventus-vs-napoli", "title": "Juventus vs Napoli - Serie A", "event_type": "football", "venue": "Allianz Stadium", "city": "Turin", "country": "Italy", "event_date": "2026-12-14T18:00:00Z", "price_from": 69},
    {"slug": "juventus-vs-roma-2026-tickets", "alt": "juventus-vs-roma", "title": "Juventus vs AS Roma - Serie A", "event_type": "football", "venue": "Allianz Stadium", "city": "Turin", "country": "Italy", "event_date": "2027-01-17T20:45:00Z", "price_from": 59},
    {"slug": "psg-tickets-2026", "alt": "psg-tickets", "title": "Paris Saint-Germain - Ligue 1 2026", "event_type": "football", "venue": "Parc des Princes", "city": "Paris", "country": "France", "event_date": "2026-09-12T20:45:00Z", "price_from": 59},
    {"slug": "psg-vs-marseille-2026-tickets", "alt": "psg-vs-marseille", "title": "PSG vs Olympique Marseille - Le Classique", "event_type": "football", "venue": "Parc des Princes", "city": "Paris", "country": "France", "event_date": "2026-10-24T20:45:00Z", "price_from": 99},
    {"slug": "psg-vs-lyon-2026-tickets", "alt": "psg-vs-lyon", "title": "PSG vs Olympique Lyon - Ligue 1", "event_type": "football", "venue": "Parc des Princes", "city": "Paris", "country": "France", "event_date": "2026-11-21T20:45:00Z", "price_from": 69},
    {"slug": "psg-vs-monaco-2026-tickets", "alt": "psg-vs-monaco", "title": "PSG vs AS Monaco - Ligue 1", "event_type": "football", "venue": "Parc des Princes", "city": "Paris", "country": "France", "event_date": "2026-12-19T20:45:00Z", "price_from": 69},
    {"slug": "psg-vs-real-madrid-2026-tickets", "alt": "psg-vs-real-madrid", "title": "PSG vs Real Madrid - UCL", "event_type": "football", "venue": "Parc des Princes", "city": "Paris", "country": "France", "event_date": "2026-11-05T20:00:00Z", "price_from": 129},
    # MotoGP
    {"slug": "motogp-mugello-2026-tickets", "alt": "motogp-mugello-2026", "title": "Italian MotoGP Mugello 2026", "event_type": "motogp", "venue": "Mugello Circuit", "city": "Mugello", "country": "Italy", "event_date": "2026-05-31T13:00:00Z", "price_from": 49},
    # World Cup
    {"slug": "world-cup-2026-bahrain-tickets", "alt": "world-cup-2026-bahrain", "title": "FIFA World Cup 2026 - Bahrain Matches", "event_type": "worldcup", "venue": "MetLife Stadium", "city": "New York", "country": "USA", "event_date": "2026-06-15T18:00:00Z", "price_from": 99},
]


async def seed_all():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client['euromatchtickets']
    
    created_events = 0
    created_tickets = 0
    
    for ev in MISSING_EVENTS:
        slug = ev["slug"]
        alt_slug = ev.get("alt", "")
        
        # Check if event already exists by slug or alt slug
        existing = await db.events.find_one({"$or": [{"slug": slug}, {"slug": alt_slug}]})
        if existing:
            # Make sure alt slug also resolves - add alt as event_id alias
            if alt_slug and existing.get("slug") != alt_slug:
                await db.events.update_one({"_id": existing["_id"]}, {"$set": {"alt_slugs": [alt_slug, slug]}})
            continue
        
        event_id = slug.replace("-tickets", "").replace("-", "_")
        event = {
            "event_id": event_id,
            "slug": slug,
            "title": ev["title"],
            "event_type": ev["event_type"],
            "venue": ev["venue"],
            "city": ev["city"],
            "country": ev["country"],
            "event_date": ev["event_date"],
            "price_from": ev["price_from"],
            "price_to": ev["price_from"] * 8,
            "currency": "EUR",
            "status": "active",
            "featured": False,
            "image_url": "",
            "home_team": "",
            "away_team": "",
            "league": "",
            "capacity": 50000,
            "tickets_available": random.randint(50, 500),
            "alt_slugs": [alt_slug] if alt_slug else [],
        }
        
        await db.events.insert_one(event)
        created_events += 1
        
        # Create tickets
        sections = [
            ("General Admission", ev["price_from"], ev["price_from"] * 1.3, 40),
            ("Category 2", ev["price_from"] * 1.4, ev["price_from"] * 1.8, 30),
            ("Category 1", ev["price_from"] * 2, ev["price_from"] * 2.5, 20),
            ("VIP", ev["price_from"] * 4, ev["price_from"] * 5, 8),
        ]
        
        tickets = []
        for section, lo, hi, count in sections:
            for i in range(count):
                tickets.append({
                    "ticket_id": f"{event_id}_{section.lower().replace(' ','_')}_{i}",
                    "event_id": event_id,
                    "section": section,
                    "category": section,
                    "row": str(random.randint(1, 30)),
                    "seat": str(random.randint(1, 50)),
                    "price": round(random.uniform(lo, hi), 2),
                    "currency": "EUR",
                    "status": "available",
                    "seller_id": "euromatch_official",
                })
        
        if tickets:
            await db.tickets.insert_many(tickets)
            created_tickets += len(tickets)
    
    print(f"Created {created_events} events, {created_tickets} tickets")
    print(f"Total events: {await db.events.count_documents({})}")

asyncio.run(seed_all())
