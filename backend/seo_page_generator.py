"""
SEO Page Generator Bot - Creates hundreds of SEO-optimized pages daily
Generates landing pages for:
- F1 races
- Football clubs and matches
- Concert tours
- Cities and venues
"""

import os
import asyncio
import logging
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient

logger = logging.getLogger(__name__)

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'ticket_marketplace')

# SEO Page Templates
F1_RACES_2026 = [
    {"name": "Bahrain Grand Prix", "city": "Sakhir", "country": "Bahrain", "date": "2026-03-08", "circuit": "Bahrain International Circuit"},
    {"name": "Saudi Arabian Grand Prix", "city": "Jeddah", "country": "Saudi Arabia", "date": "2026-03-15", "circuit": "Jeddah Corniche Circuit"},
    {"name": "Australian Grand Prix", "city": "Melbourne", "country": "Australia", "date": "2026-03-22", "circuit": "Albert Park Circuit"},
    {"name": "Japanese Grand Prix", "city": "Suzuka", "country": "Japan", "date": "2026-04-05", "circuit": "Suzuka International Racing Course"},
    {"name": "Chinese Grand Prix", "city": "Shanghai", "country": "China", "date": "2026-04-19", "circuit": "Shanghai International Circuit"},
    {"name": "Miami Grand Prix", "city": "Miami", "country": "USA", "date": "2026-05-03", "circuit": "Miami International Autodrome"},
    {"name": "Emilia Romagna Grand Prix", "city": "Imola", "country": "Italy", "date": "2026-05-17", "circuit": "Autodromo Enzo e Dino Ferrari"},
    {"name": "Monaco Grand Prix", "city": "Monte Carlo", "country": "Monaco", "date": "2026-05-24", "circuit": "Circuit de Monaco"},
    {"name": "Canadian Grand Prix", "city": "Montreal", "country": "Canada", "date": "2026-06-07", "circuit": "Circuit Gilles Villeneuve"},
    {"name": "Spanish Grand Prix", "city": "Barcelona", "country": "Spain", "date": "2026-06-21", "circuit": "Circuit de Barcelona-Catalunya"},
    {"name": "Austrian Grand Prix", "city": "Spielberg", "country": "Austria", "date": "2026-06-28", "circuit": "Red Bull Ring"},
    {"name": "British Grand Prix", "city": "Silverstone", "country": "UK", "date": "2026-07-05", "circuit": "Silverstone Circuit"},
    {"name": "Hungarian Grand Prix", "city": "Budapest", "country": "Hungary", "date": "2026-07-19", "circuit": "Hungaroring"},
    {"name": "Belgian Grand Prix", "city": "Spa", "country": "Belgium", "date": "2026-07-26", "circuit": "Circuit de Spa-Francorchamps"},
    {"name": "Dutch Grand Prix", "city": "Zandvoort", "country": "Netherlands", "date": "2026-08-30", "circuit": "Circuit Zandvoort"},
    {"name": "Italian Grand Prix", "city": "Monza", "country": "Italy", "date": "2026-09-06", "circuit": "Autodromo Nazionale Monza"},
    {"name": "Azerbaijan Grand Prix", "city": "Baku", "country": "Azerbaijan", "date": "2026-09-20", "circuit": "Baku City Circuit"},
    {"name": "Singapore Grand Prix", "city": "Singapore", "country": "Singapore", "date": "2026-10-04", "circuit": "Marina Bay Street Circuit"},
    {"name": "United States Grand Prix", "city": "Austin", "country": "USA", "date": "2026-10-18", "circuit": "Circuit of the Americas"},
    {"name": "Mexico City Grand Prix", "city": "Mexico City", "country": "Mexico", "date": "2026-10-25", "circuit": "Autodromo Hermanos Rodriguez"},
    {"name": "Brazilian Grand Prix", "city": "Sao Paulo", "country": "Brazil", "date": "2026-11-08", "circuit": "Autodromo Jose Carlos Pace"},
    {"name": "Las Vegas Grand Prix", "city": "Las Vegas", "country": "USA", "date": "2026-11-22", "circuit": "Las Vegas Strip Circuit"},
    {"name": "Qatar Grand Prix", "city": "Lusail", "country": "Qatar", "date": "2026-11-29", "circuit": "Lusail International Circuit"},
    {"name": "Abu Dhabi Grand Prix", "city": "Abu Dhabi", "country": "UAE", "date": "2026-12-06", "circuit": "Yas Marina Circuit"},
]

FOOTBALL_CLUBS = [
    {"name": "Real Madrid", "city": "Madrid", "country": "Spain", "stadium": "Santiago Bernabeu", "league": "La Liga"},
    {"name": "FC Barcelona", "city": "Barcelona", "country": "Spain", "stadium": "Camp Nou", "league": "La Liga"},
    {"name": "Manchester United", "city": "Manchester", "country": "UK", "stadium": "Old Trafford", "league": "Premier League"},
    {"name": "Manchester City", "city": "Manchester", "country": "UK", "stadium": "Etihad Stadium", "league": "Premier League"},
    {"name": "Liverpool", "city": "Liverpool", "country": "UK", "stadium": "Anfield", "league": "Premier League"},
    {"name": "Arsenal", "city": "London", "country": "UK", "stadium": "Emirates Stadium", "league": "Premier League"},
    {"name": "Chelsea", "city": "London", "country": "UK", "stadium": "Stamford Bridge", "league": "Premier League"},
    {"name": "Tottenham", "city": "London", "country": "UK", "stadium": "Tottenham Hotspur Stadium", "league": "Premier League"},
    {"name": "Bayern Munich", "city": "Munich", "country": "Germany", "stadium": "Allianz Arena", "league": "Bundesliga"},
    {"name": "Borussia Dortmund", "city": "Dortmund", "country": "Germany", "stadium": "Signal Iduna Park", "league": "Bundesliga"},
    {"name": "PSG", "city": "Paris", "country": "France", "stadium": "Parc des Princes", "league": "Ligue 1"},
    {"name": "Juventus", "city": "Turin", "country": "Italy", "stadium": "Allianz Stadium", "league": "Serie A"},
    {"name": "AC Milan", "city": "Milan", "country": "Italy", "stadium": "San Siro", "league": "Serie A"},
    {"name": "Inter Milan", "city": "Milan", "country": "Italy", "stadium": "San Siro", "league": "Serie A"},
    {"name": "Atletico Madrid", "city": "Madrid", "country": "Spain", "stadium": "Civitas Metropolitano", "league": "La Liga"},
]

CITIES = [
    {"name": "London", "country": "UK", "venues": ["Wembley Stadium", "Emirates Stadium", "Stamford Bridge", "O2 Arena"]},
    {"name": "Madrid", "country": "Spain", "venues": ["Santiago Bernabeu", "Civitas Metropolitano", "WiZink Center"]},
    {"name": "Barcelona", "country": "Spain", "venues": ["Camp Nou", "Palau Sant Jordi"]},
    {"name": "Paris", "country": "France", "venues": ["Parc des Princes", "Stade de France", "AccorHotels Arena"]},
    {"name": "Munich", "country": "Germany", "venues": ["Allianz Arena", "Olympiahalle"]},
    {"name": "Milan", "country": "Italy", "venues": ["San Siro", "Mediolanum Forum"]},
    {"name": "Berlin", "country": "Germany", "venues": ["Olympiastadion", "Mercedes-Benz Arena"]},
    {"name": "Amsterdam", "country": "Netherlands", "venues": ["Johan Cruyff Arena", "Ziggo Dome"]},
    {"name": "Manchester", "country": "UK", "venues": ["Old Trafford", "Etihad Stadium", "AO Arena"]},
    {"name": "Liverpool", "country": "UK", "venues": ["Anfield", "M&S Bank Arena"]},
]

CONCERT_ARTISTS = [
    {"name": "Bruno Mars", "genre": "Pop/R&B", "tour": "24K Magic World Tour 2026"},
    {"name": "Coldplay", "genre": "Rock/Pop", "tour": "Music of the Spheres 2026"},
    {"name": "Ed Sheeran", "genre": "Pop", "tour": "Mathematics Tour 2026"},
    {"name": "Taylor Swift", "genre": "Pop", "tour": "Eras Tour 2026"},
    {"name": "The Weeknd", "genre": "R&B/Pop", "tour": "After Hours Til Dawn 2026"},
    {"name": "Beyonce", "genre": "R&B/Pop", "tour": "Renaissance World Tour 2026"},
    {"name": "Drake", "genre": "Hip-Hop", "tour": "It's All A Blur 2026"},
    {"name": "Harry Styles", "genre": "Pop", "tour": "Love On Tour 2026"},
    {"name": "Billie Eilish", "genre": "Pop", "tour": "Happier Than Ever 2026"},
    {"name": "Dua Lipa", "genre": "Pop", "tour": "Future Nostalgia Tour 2026"},
]


def generate_f1_seo_content(race):
    """Generate SEO content for F1 race page"""
    content = f"""
# {race['name']} 2026 Tickets

Experience the thrill of Formula 1 at the {race['circuit']} in {race['city']}, {race['country']}.

## Event Details
- **Date:** {race['date']}
- **Location:** {race['city']}, {race['country']}
- **Circuit:** {race['circuit']}

## Ticket Categories Available
- **General Admission** - Access to general viewing areas
- **Grandstand** - Reserved seating with excellent track views
- **VIP Hospitality** - Premium experience with catering
- **Paddock Club** - Ultimate F1 experience with pit lane access

## Why Buy {race['name']} Tickets from EuroMatchTickets?
- 100% Verified Tickets
- FanProtect Guarantee
- Instant Digital Delivery
- Secure Payment
- 24/7 Customer Support

## About {race['circuit']}
The {race['circuit']} in {race['city']} is one of the most iconic tracks on the Formula 1 calendar. 
Known for its challenging corners and incredible atmosphere, this race is a must-see for any F1 fan.

## How to Get to {race['city']}
{race['city']} is easily accessible by air, with direct flights from major European cities. 
The circuit is well-connected by public transport on race weekends.

## Frequently Asked Questions

**When do {race['name']} 2026 tickets go on sale?**
Tickets are available now! Book early to secure the best seats and prices.

**What is the best grandstand at {race['circuit']}?**
The main grandstand offers excellent views of the start/finish straight and pit lane.

**Are VIP packages worth it?**
VIP hospitality packages include premium catering, open bar, and exclusive viewing areas - perfect for a special experience.
"""
    return content


def generate_club_seo_content(club):
    """Generate SEO content for football club page"""
    content = f"""
# {club['name']} Tickets 2026

Get tickets for all {club['name']} home matches at {club['stadium']}.

## Club Information
- **Stadium:** {club['stadium']}
- **City:** {club['city']}, {club['country']}
- **League:** {club['league']}

## Available Matches
- {club['league']} Home Games
- Champions League Matches
- Cup Competitions

## Ticket Categories
- **Standard** - General seating
- **Premium** - Better views
- **Category 1** - Best seats in the house
- **VIP Hospitality** - Exclusive experience with catering

## Why Buy {club['name']} Tickets from EuroMatchTickets?
- 100% Verified Tickets
- Best Prices Guaranteed
- Instant Delivery
- FanProtect Guarantee

## About {club['stadium']}
{club['stadium']} is the legendary home of {club['name']}. 
The atmosphere on matchday is electric, with passionate fans creating an unforgettable experience.

## How to Get to {club['stadium']}
Located in {club['city']}, the stadium is easily accessible by public transport. 
We recommend arriving early to soak in the pre-match atmosphere.
"""
    return content


def generate_city_seo_content(city):
    """Generate SEO content for city events page"""
    venues_list = ", ".join(city['venues'])
    content = f"""
# {city['name']} Events & Tickets 2026

Find tickets for all major events in {city['name']}, {city['country']}.

## Popular Venues in {city['name']}
{venues_list}

## Upcoming Events
- Football Matches
- Concerts & Music Events
- Sports Events
- Theatre & Shows

## Why Visit {city['name']} for Events?
{city['name']} is one of Europe's premier destinations for live entertainment. 
With world-class venues and a vibrant atmosphere, it's the perfect place to experience unforgettable events.

## Getting to {city['name']}
{city['name']} is well-connected by air, rail, and road. 
Most venues are easily accessible by public transport.

## Accommodation Near Venues
We recommend booking accommodation in the city center for easy access to all venues.
"""
    return content


async def generate_seo_pages():
    """Generate all SEO pages and save to database"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    pages_created = 0
    
    # Generate F1 race pages
    for race in F1_RACES_2026:
        slug = race['name'].lower().replace(' ', '-').replace("'", "") + "-2026-tickets"
        page_data = {
            "slug": slug,
            "title": f"{race['name']} 2026 Tickets | Buy F1 Tickets | EuroMatchTickets",
            "description": f"Buy {race['name']} 2026 tickets. {race['circuit']}, {race['city']}. Grandstand, VIP & Paddock Club available. Secure booking, instant delivery.",
            "keywords": f"{race['name']} tickets, F1 {race['city']} tickets, {race['circuit']} tickets, Formula 1 {race['country']}",
            "content": generate_f1_seo_content(race),
            "category": "f1",
            "event_date": race['date'],
            "city": race['city'],
            "country": race['country'],
            "venue": race['circuit'],
            "page_type": "event_landing",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        }
        
        await db.seo_pages.update_one(
            {"slug": slug},
            {"$set": page_data},
            upsert=True
        )
        pages_created += 1
    
    # Generate Football club pages
    for club in FOOTBALL_CLUBS:
        slug = club['name'].lower().replace(' ', '-').replace("fc-", "") + "-tickets"
        page_data = {
            "slug": slug,
            "title": f"{club['name']} Tickets 2026 | {club['stadium']} | EuroMatchTickets",
            "description": f"Buy {club['name']} tickets for all home matches at {club['stadium']}. {club['league']} & Champions League. Secure booking.",
            "keywords": f"{club['name']} tickets, {club['stadium']} tickets, {club['league']} tickets, {club['city']} football",
            "content": generate_club_seo_content(club),
            "category": "football",
            "city": club['city'],
            "country": club['country'],
            "venue": club['stadium'],
            "page_type": "club_landing",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        }
        
        await db.seo_pages.update_one(
            {"slug": slug},
            {"$set": page_data},
            upsert=True
        )
        pages_created += 1
    
    # Generate City pages
    for city in CITIES:
        slug = city['name'].lower().replace(' ', '-') + "-events"
        page_data = {
            "slug": slug,
            "title": f"{city['name']} Events & Tickets 2026 | Concerts, Football, Sports",
            "description": f"Find tickets for all events in {city['name']}, {city['country']}. Football, concerts, sports & more. Verified tickets, instant delivery.",
            "keywords": f"{city['name']} events, {city['name']} concerts, {city['name']} tickets, {city['name']} football",
            "content": generate_city_seo_content(city),
            "category": "city",
            "city": city['name'],
            "country": city['country'],
            "venues": city['venues'],
            "page_type": "city_landing",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        }
        
        await db.seo_pages.update_one(
            {"slug": slug},
            {"$set": page_data},
            upsert=True
        )
        pages_created += 1
    
    # Generate Artist pages
    for artist in CONCERT_ARTISTS:
        slug = artist['name'].lower().replace(' ', '-') + "-tour-2026-tickets"
        page_data = {
            "slug": slug,
            "title": f"{artist['name']} {artist['tour']} Tickets | EuroMatchTickets",
            "description": f"Buy {artist['name']} concert tickets for {artist['tour']}. {artist['genre']} live in Europe. Verified tickets, instant delivery.",
            "keywords": f"{artist['name']} tickets, {artist['name']} tour 2026, {artist['name']} concert, {artist['genre']} concerts",
            "content": f"# {artist['name']} Tour 2026 Tickets\n\nGet tickets for {artist['tour']}.",
            "category": "concert",
            "artist": artist['name'],
            "genre": artist['genre'],
            "tour_name": artist['tour'],
            "page_type": "artist_landing",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        }
        
        await db.seo_pages.update_one(
            {"slug": slug},
            {"$set": page_data},
            upsert=True
        )
        pages_created += 1
    
    logger.info(f"SEO Page Generator: Created/Updated {pages_created} pages")
    return pages_created


async def get_all_seo_pages():
    """Get all generated SEO pages"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    pages = await db.seo_pages.find(
        {},
        {"_id": 0}
    ).to_list(1000)
    
    return pages


if __name__ == "__main__":
    asyncio.run(generate_seo_pages())
