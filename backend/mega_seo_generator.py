"""
MEGA SEO PAGE GENERATOR - Creates 10,000+ SEO-optimized pages
Focuses on:
- High-value keywords
- Upcoming events
- Premium/VIP tickets
- Long-tail keywords for Google ranking
"""

import os
import asyncio
import logging
from datetime import datetime, timezone, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
import random

logger = logging.getLogger(__name__)

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'ticket_marketplace')

# Professional Images for each category
SEO_IMAGES = {
    "f1": "https://static.prod-images.emergentagent.com/jobs/775fd9a1-fbbf-459e-af56-55fb2499685c/images/79ead8c047997bb096a7732818e1c67372ec2621b502006730e57432cc9f97bc.png",
    "football": "https://static.prod-images.emergentagent.com/jobs/775fd9a1-fbbf-459e-af56-55fb2499685c/images/1fbd02bc7c9ace598e3e415ccb8016af16f84d05e8c265e0e6b5e3f427c3f094.png",
    "worldcup": "https://static.prod-images.emergentagent.com/jobs/775fd9a1-fbbf-459e-af56-55fb2499685c/images/05d1221f89c0b02e7b60a2c357633e81ec178eb2044cc15e0b6a54756cb7e589.png",
    "concert": "https://static.prod-images.emergentagent.com/jobs/775fd9a1-fbbf-459e-af56-55fb2499685c/images/4519b497dfd3f12d435889edf28484201965968db2c1130568eb0818f42f758c.png",
    "motogp": "https://static.prod-images.emergentagent.com/jobs/775fd9a1-fbbf-459e-af56-55fb2499685c/images/01adb2ff2a447955d7325065a41d129aa3aa7e4b6306d3a1f35096f61263de06.png",
}

# ==================== F1 DATA ====================
F1_RACES = [
    {"name": "Bahrain Grand Prix", "city": "Sakhir", "country": "Bahrain", "circuit": "Bahrain International Circuit", "month": "March"},
    {"name": "Saudi Arabian Grand Prix", "city": "Jeddah", "country": "Saudi Arabia", "circuit": "Jeddah Corniche Circuit", "month": "March"},
    {"name": "Australian Grand Prix", "city": "Melbourne", "country": "Australia", "circuit": "Albert Park", "month": "March"},
    {"name": "Japanese Grand Prix", "city": "Suzuka", "country": "Japan", "circuit": "Suzuka Circuit", "month": "April"},
    {"name": "Chinese Grand Prix", "city": "Shanghai", "country": "China", "circuit": "Shanghai International Circuit", "month": "April"},
    {"name": "Miami Grand Prix", "city": "Miami", "country": "USA", "circuit": "Miami International Autodrome", "month": "May"},
    {"name": "Emilia Romagna Grand Prix", "city": "Imola", "country": "Italy", "circuit": "Autodromo Enzo e Dino Ferrari", "month": "May"},
    {"name": "Monaco Grand Prix", "city": "Monte Carlo", "country": "Monaco", "circuit": "Circuit de Monaco", "month": "May"},
    {"name": "Canadian Grand Prix", "city": "Montreal", "country": "Canada", "circuit": "Circuit Gilles Villeneuve", "month": "June"},
    {"name": "Spanish Grand Prix", "city": "Barcelona", "country": "Spain", "circuit": "Circuit de Barcelona-Catalunya", "month": "June"},
    {"name": "Austrian Grand Prix", "city": "Spielberg", "country": "Austria", "circuit": "Red Bull Ring", "month": "June"},
    {"name": "British Grand Prix", "city": "Silverstone", "country": "UK", "circuit": "Silverstone Circuit", "month": "July"},
    {"name": "Hungarian Grand Prix", "city": "Budapest", "country": "Hungary", "circuit": "Hungaroring", "month": "July"},
    {"name": "Belgian Grand Prix", "city": "Spa", "country": "Belgium", "circuit": "Spa-Francorchamps", "month": "July"},
    {"name": "Dutch Grand Prix", "city": "Zandvoort", "country": "Netherlands", "circuit": "Circuit Zandvoort", "month": "August"},
    {"name": "Italian Grand Prix", "city": "Monza", "country": "Italy", "circuit": "Autodromo Nazionale Monza", "month": "September"},
    {"name": "Azerbaijan Grand Prix", "city": "Baku", "country": "Azerbaijan", "circuit": "Baku City Circuit", "month": "September"},
    {"name": "Singapore Grand Prix", "city": "Singapore", "country": "Singapore", "circuit": "Marina Bay Street Circuit", "month": "October"},
    {"name": "United States Grand Prix", "city": "Austin", "country": "USA", "circuit": "Circuit of the Americas", "month": "October"},
    {"name": "Mexico City Grand Prix", "city": "Mexico City", "country": "Mexico", "circuit": "Autodromo Hermanos Rodriguez", "month": "October"},
    {"name": "Brazilian Grand Prix", "city": "Sao Paulo", "country": "Brazil", "circuit": "Interlagos", "month": "November"},
    {"name": "Las Vegas Grand Prix", "city": "Las Vegas", "country": "USA", "circuit": "Las Vegas Strip Circuit", "month": "November"},
    {"name": "Qatar Grand Prix", "city": "Lusail", "country": "Qatar", "circuit": "Lusail International Circuit", "month": "November"},
    {"name": "Abu Dhabi Grand Prix", "city": "Abu Dhabi", "country": "UAE", "circuit": "Yas Marina Circuit", "month": "December"},
]

F1_TICKET_TYPES = ["General Admission", "Grandstand", "VIP Hospitality", "Paddock Club", "Premium Grandstand", "Pit Lane Walk", "Grid Walk Experience"]
F1_YEARS = ["2025", "2026", "2027"]

# ==================== FOOTBALL DATA ====================
FOOTBALL_CLUBS = [
    {"name": "Real Madrid", "city": "Madrid", "country": "Spain", "stadium": "Santiago Bernabeu", "league": "La Liga"},
    {"name": "FC Barcelona", "city": "Barcelona", "country": "Spain", "stadium": "Camp Nou", "league": "La Liga"},
    {"name": "Manchester United", "city": "Manchester", "country": "UK", "stadium": "Old Trafford", "league": "Premier League"},
    {"name": "Manchester City", "city": "Manchester", "country": "UK", "stadium": "Etihad Stadium", "league": "Premier League"},
    {"name": "Liverpool", "city": "Liverpool", "country": "UK", "stadium": "Anfield", "league": "Premier League"},
    {"name": "Arsenal", "city": "London", "country": "UK", "stadium": "Emirates Stadium", "league": "Premier League"},
    {"name": "Chelsea", "city": "London", "country": "UK", "stadium": "Stamford Bridge", "league": "Premier League"},
    {"name": "Tottenham Hotspur", "city": "London", "country": "UK", "stadium": "Tottenham Hotspur Stadium", "league": "Premier League"},
    {"name": "Bayern Munich", "city": "Munich", "country": "Germany", "stadium": "Allianz Arena", "league": "Bundesliga"},
    {"name": "Borussia Dortmund", "city": "Dortmund", "country": "Germany", "stadium": "Signal Iduna Park", "league": "Bundesliga"},
    {"name": "PSG", "city": "Paris", "country": "France", "stadium": "Parc des Princes", "league": "Ligue 1"},
    {"name": "Juventus", "city": "Turin", "country": "Italy", "stadium": "Allianz Stadium", "league": "Serie A"},
    {"name": "AC Milan", "city": "Milan", "country": "Italy", "stadium": "San Siro", "league": "Serie A"},
    {"name": "Inter Milan", "city": "Milan", "country": "Italy", "stadium": "San Siro", "league": "Serie A"},
    {"name": "Atletico Madrid", "city": "Madrid", "country": "Spain", "stadium": "Civitas Metropolitano", "league": "La Liga"},
    {"name": "Napoli", "city": "Naples", "country": "Italy", "stadium": "Diego Armando Maradona Stadium", "league": "Serie A"},
    {"name": "RB Leipzig", "city": "Leipzig", "country": "Germany", "stadium": "Red Bull Arena", "league": "Bundesliga"},
    {"name": "Benfica", "city": "Lisbon", "country": "Portugal", "stadium": "Estadio da Luz", "league": "Primeira Liga"},
    {"name": "Porto", "city": "Porto", "country": "Portugal", "stadium": "Estadio do Dragao", "league": "Primeira Liga"},
    {"name": "Ajax", "city": "Amsterdam", "country": "Netherlands", "stadium": "Johan Cruyff Arena", "league": "Eredivisie"},
]

FOOTBALL_COMPETITIONS = ["Champions League", "Europa League", "Premier League", "La Liga", "Bundesliga", "Serie A", "Ligue 1", "FA Cup", "Copa del Rey", "DFB Pokal"]
FOOTBALL_TICKET_TYPES = ["Standard", "Premium", "VIP Box", "Hospitality Suite", "Family Section", "Away Section", "Ultra Section"]

# ==================== CONCERT DATA ====================
CONCERT_ARTISTS = [
    {"name": "Taylor Swift", "genre": "Pop", "tour": "Eras Tour"},
    {"name": "Ed Sheeran", "genre": "Pop", "tour": "Mathematics Tour"},
    {"name": "Coldplay", "genre": "Rock", "tour": "Music of the Spheres"},
    {"name": "Bruno Mars", "genre": "Pop/R&B", "tour": "24K Magic World Tour"},
    {"name": "The Weeknd", "genre": "R&B", "tour": "After Hours Til Dawn"},
    {"name": "Beyonce", "genre": "R&B/Pop", "tour": "Renaissance World Tour"},
    {"name": "Drake", "genre": "Hip-Hop", "tour": "It's All A Blur"},
    {"name": "Harry Styles", "genre": "Pop", "tour": "Love On Tour"},
    {"name": "Billie Eilish", "genre": "Pop", "tour": "Happier Than Ever"},
    {"name": "Dua Lipa", "genre": "Pop", "tour": "Future Nostalgia"},
    {"name": "Bad Bunny", "genre": "Reggaeton", "tour": "Most Wanted Tour"},
    {"name": "Adele", "genre": "Pop/Soul", "tour": "Weekends with Adele"},
    {"name": "Post Malone", "genre": "Hip-Hop/Pop", "tour": "Twelve Carat Tour"},
    {"name": "Rihanna", "genre": "R&B/Pop", "tour": "Anti World Tour"},
    {"name": "Justin Bieber", "genre": "Pop", "tour": "Justice World Tour"},
    {"name": "Metallica", "genre": "Metal", "tour": "M72 World Tour"},
    {"name": "Guns N Roses", "genre": "Rock", "tour": "We're F'N Back Tour"},
    {"name": "U2", "genre": "Rock", "tour": "UV Achtung Baby Live"},
    {"name": "Foo Fighters", "genre": "Rock", "tour": "Everything or Nothing Tour"},
    {"name": "Red Hot Chili Peppers", "genre": "Rock", "tour": "Unlimited Love Tour"},
]

CONCERT_TICKET_TYPES = ["General Admission", "Floor", "Lower Bowl", "Upper Bowl", "VIP", "Meet & Greet", "Platinum", "Gold Circle"]

# ==================== CITIES DATA ====================
CITIES = [
    {"name": "London", "country": "UK", "venues": ["Wembley Stadium", "O2 Arena", "Emirates Stadium", "Stamford Bridge"]},
    {"name": "Madrid", "country": "Spain", "venues": ["Santiago Bernabeu", "Civitas Metropolitano", "WiZink Center"]},
    {"name": "Barcelona", "country": "Spain", "venues": ["Camp Nou", "Palau Sant Jordi", "Spotify Camp Nou"]},
    {"name": "Paris", "country": "France", "venues": ["Parc des Princes", "Stade de France", "AccorHotels Arena"]},
    {"name": "Munich", "country": "Germany", "venues": ["Allianz Arena", "Olympiahalle", "Olympiastadion"]},
    {"name": "Milan", "country": "Italy", "venues": ["San Siro", "Mediolanum Forum"]},
    {"name": "Berlin", "country": "Germany", "venues": ["Olympiastadion", "Mercedes-Benz Arena", "Waldbuhne"]},
    {"name": "Amsterdam", "country": "Netherlands", "venues": ["Johan Cruyff Arena", "Ziggo Dome"]},
    {"name": "Manchester", "country": "UK", "venues": ["Old Trafford", "Etihad Stadium", "AO Arena"]},
    {"name": "Liverpool", "country": "UK", "venues": ["Anfield", "M&S Bank Arena"]},
    {"name": "Rome", "country": "Italy", "venues": ["Stadio Olimpico", "Palazzo dello Sport"]},
    {"name": "Lisbon", "country": "Portugal", "venues": ["Estadio da Luz", "MEO Arena"]},
    {"name": "Vienna", "country": "Austria", "venues": ["Ernst Happel Stadium", "Wiener Stadthalle"]},
    {"name": "Zurich", "country": "Switzerland", "venues": ["Letzigrund", "Hallenstadion"]},
    {"name": "Dubai", "country": "UAE", "venues": ["Dubai Sports City", "Coca-Cola Arena"]},
    {"name": "Abu Dhabi", "country": "UAE", "venues": ["Yas Marina Circuit", "Etihad Arena"]},
    {"name": "New York", "country": "USA", "venues": ["Madison Square Garden", "MetLife Stadium"]},
    {"name": "Las Vegas", "country": "USA", "venues": ["Allegiant Stadium", "T-Mobile Arena", "Sphere"]},
    {"name": "Miami", "country": "USA", "venues": ["Hard Rock Stadium", "Miami International Autodrome"]},
    {"name": "Los Angeles", "country": "USA", "venues": ["SoFi Stadium", "Crypto.com Arena"]},
]

# ==================== LONG-TAIL KEYWORDS ====================
LONG_TAIL_PREFIXES = [
    "buy", "cheap", "discount", "best", "affordable", "premium", "vip", 
    "last minute", "sold out", "resale", "official", "verified", "secure",
    "how to get", "where to buy", "best seats", "best price"
]

LONG_TAIL_SUFFIXES = [
    "tickets", "tickets online", "tickets cheap", "tickets 2025", "tickets 2026",
    "vip tickets", "hospitality tickets", "premium tickets", "front row tickets",
    "tickets near me", "tickets europe", "tickets uk", "tickets germany",
    "ticket prices", "ticket availability", "tickets for sale", "resale tickets"
]


def generate_seo_keywords(category, event_name, city=None, year="2026"):
    """Generate professional SEO keywords"""
    keywords = []
    
    # Basic keywords
    keywords.append(f"{event_name} tickets")
    keywords.append(f"{event_name} tickets {year}")
    keywords.append(f"buy {event_name} tickets")
    
    if city:
        keywords.append(f"{event_name} {city} tickets")
        keywords.append(f"{city} {event_name} tickets {year}")
    
    # Long-tail keywords
    for prefix in random.sample(LONG_TAIL_PREFIXES, 5):
        keywords.append(f"{prefix} {event_name} tickets")
    
    for suffix in random.sample(LONG_TAIL_SUFFIXES, 5):
        keywords.append(f"{event_name} {suffix}")
    
    # Category specific
    if category == "f1":
        keywords.extend([
            f"formula 1 {event_name} tickets",
            f"f1 {event_name} grandstand tickets",
            f"f1 {event_name} paddock club",
            f"{event_name} vip hospitality",
            f"{event_name} grid walk experience",
        ])
    elif category == "football":
        keywords.extend([
            f"{event_name} match tickets",
            f"{event_name} home tickets",
            f"{event_name} away tickets",
            f"{event_name} champions league tickets",
            f"{event_name} vip box tickets",
        ])
    elif category == "concert":
        keywords.extend([
            f"{event_name} concert tickets",
            f"{event_name} tour tickets",
            f"{event_name} live tickets",
            f"{event_name} meet and greet",
            f"{event_name} vip experience",
        ])
    
    return ", ".join(keywords[:20])


def generate_seo_description(category, event_name, city, venue, year="2026"):
    """Generate professional meta description"""
    descriptions = {
        "f1": f"Buy {event_name} {year} tickets. {venue}, {city}. Grandstand, VIP Hospitality & Paddock Club available. 100% verified tickets with instant delivery. FanProtect guarantee included.",
        "football": f"Get {event_name} tickets for all home matches at {venue}. Champions League, League & Cup games. Premium & VIP hospitality packages. Secure booking with buyer protection.",
        "concert": f"Buy {event_name} concert tickets. {city} {year}. Floor, VIP & Meet & Greet packages available. Official resale marketplace with 100% verified tickets. Book now!",
        "worldcup": f"FIFA World Cup 2026 {event_name} tickets. All matches, all venues. VIP hospitality & standard tickets. Secure your seats for the biggest football event!",
    }
    return descriptions.get(category, f"Buy {event_name} tickets at {venue}, {city}. Secure booking with instant delivery. 100% verified tickets.")


def generate_seo_content(category, event_name, city, venue, year="2026", ticket_types=None):
    """Generate 500+ words SEO content"""
    
    if category == "f1":
        content = f"""
# {event_name} {year} Tickets - Official Resale Marketplace

Experience the thrill of Formula 1 at the legendary {venue} in {city}. The {event_name} is one of the most anticipated races on the F1 calendar, attracting hundreds of thousands of motorsport fans from around the world.

## Why Attend {event_name}?

The {event_name} offers an unparalleled Formula 1 experience. From the roar of the engines to the electric atmosphere in the grandstands, this race delivers unforgettable moments. Watch the world's best drivers including Max Verstappen, Lewis Hamilton, Charles Leclerc, and Lando Norris battle for supremacy on one of F1's most challenging circuits.

## Ticket Categories Available

### General Admission
Access to general viewing areas around the circuit. Perfect for fans who want to explore different vantage points throughout the weekend.

### Grandstand Seats
Reserved seating with excellent track views. Choose from main straight grandstands for start/finish action or corner grandstands for overtaking opportunities.

### VIP Hospitality
Premium experience including:
- Exclusive viewing areas
- Gourmet catering & open bar
- Pit lane walks
- Driver appearances
- Air-conditioned hospitality suites

### Paddock Club
The ultimate F1 experience:
- Behind-the-scenes access
- Pit lane walks & grid access
- Meet F1 personalities
- Fine dining with champagne
- Best seats in the house

## {event_name} Circuit Information

{venue} in {city} is renowned for its challenging layout and spectacular racing. The circuit features high-speed straights, technical sections, and overtaking opportunities that create thrilling on-track action.

## How to Get to {city}

{city} is well-connected by air, with direct flights from major European and international cities. The circuit offers shuttle services from the city center on race weekends.

## Accommodation Tips

We recommend booking accommodation well in advance as hotels fill up quickly during the Grand Prix weekend. Consider staying in the city center for easy access to restaurants and nightlife.

## Why Buy from EuroMatchTickets?

- **100% Verified Tickets**: Every ticket is authenticated
- **FanProtect Guarantee**: Full refund if event is cancelled
- **Instant Delivery**: Digital tickets sent immediately
- **Secure Payment**: Protected by Stripe
- **24/7 Support**: We're here to help

## Frequently Asked Questions

**When do {event_name} {year} tickets go on sale?**
Tickets are available now! Book early to secure the best seats and prices.

**What's the best grandstand at {venue}?**
The main straight grandstands offer the best views of starts, finishes, and pit stops.

**Are VIP packages worth the price?**
Absolutely! VIP hospitality includes premium catering, exclusive access, and the best viewing positions.

**Can I buy paddock club tickets?**
Yes! Paddock Club packages are available and offer the ultimate F1 experience.

Book your {event_name} {year} tickets now and experience Formula 1 at its finest!
"""

    elif category == "football":
        content = f"""
# {event_name} Tickets {year} - Official Resale Marketplace

Get your tickets for {event_name} matches at the iconic {venue} in {city}. Experience world-class football in one of Europe's most atmospheric stadiums.

## About {event_name}

{event_name} is one of the most successful and popular football clubs in the world. With a rich history of trophies and legendary players, watching {event_name} live is a bucket-list experience for any football fan.

## Available Matches

We have tickets available for:
- **League Matches**: All home games
- **Champions League**: Group stage and knockout rounds
- **Cup Competitions**: Domestic cup fixtures
- **Derby Matches**: The most intense rivalries

## Ticket Categories

### Standard Tickets
Great value seats with good views of the pitch. Perfect for experiencing the incredible atmosphere.

### Premium Seats
Better locations with enhanced amenities. Closer to the action with superior sightlines.

### VIP Hospitality
The ultimate matchday experience:
- Pre-match dining
- Open bar
- Padded seats with best views
- Half-time refreshments
- Post-match access

### Executive Boxes
Private boxes for groups:
- Your own suite
- Dedicated host
- Premium catering
- Private bathroom facilities

## {venue} Stadium Guide

{venue} is one of football's most iconic venues, with a capacity of over 80,000 fans creating an incredible atmosphere. The stadium features modern amenities while preserving its historic character.

## Getting to the Stadium

The stadium is easily accessible by public transport. Metro and bus services run frequently on matchdays, with extended hours after evening games.

## Why Choose EuroMatchTickets?

- **Verified Tickets**: 100% authentic guaranteed
- **Secure Booking**: Encrypted payment processing
- **Instant Delivery**: E-tickets to your inbox
- **Fan Protection**: Full refund if match is cancelled
- **Expert Support**: Football experts ready to help

## Match Day Tips

- Arrive early to soak up the atmosphere
- Visit the club shop and museum
- Try local food and drinks near the stadium
- Download the official app for stadium navigation

Book your {event_name} tickets now and experience football at its finest!
"""

    elif category == "concert":
        content = f"""
# {event_name} Concert Tickets {year} - Official Resale

Don't miss {event_name} live in concert! Get your tickets for an unforgettable night of music and entertainment.

## About {event_name}

{event_name} is one of the biggest names in music, known for spectacular live performances and chart-topping hits. Their concerts are legendary experiences that fans remember forever.

## {year} Tour Dates

{event_name} will be performing across Europe in {year}. Major cities include London, Paris, Berlin, Amsterdam, and more. Check our listings for the show nearest you.

## Ticket Options

### General Admission / Standing
Get close to the stage and experience the energy of the crowd. Perfect for dedicated fans who want to be in the heart of the action.

### Seated Tickets
- **Floor Seats**: Closest seated sections to the stage
- **Lower Bowl**: Excellent views with comfortable seating
- **Upper Bowl**: Great value with full stage visibility

### VIP Packages
Premium experiences including:
- Best seats in the house
- Exclusive merchandise
- Early entry
- VIP lounge access
- Commemorative laminate

### Meet & Greet
The ultimate fan experience:
- Meet {event_name} in person
- Photo opportunity
- Signed memorabilia
- Soundcheck access
- Premium seating

## What to Expect

{event_name} concerts feature:
- State-of-the-art production
- Stunning visual effects
- Multiple costume changes
- Special guests and surprises
- 2+ hours of non-stop entertainment

## Venue Information

Concerts take place at major arenas and stadiums across Europe, all featuring excellent acoustics and sightlines. Each venue offers food, drinks, and merchandise stands.

## Booking Tips

- Book early - popular shows sell out fast
- VIP packages offer best value for serious fans
- Check our seating charts for view comparisons
- Sign up for alerts on new ticket releases

## Why EuroMatchTickets?

- **100% Verified**: Every ticket authenticated
- **Buyer Protection**: Full refund guarantee
- **Instant Delivery**: E-tickets immediately
- **Price Match**: Competitive pricing
- **24/7 Support**: Always here to help

Get your {event_name} tickets now and experience the concert of a lifetime!
"""

    else:
        content = f"""
# {event_name} Tickets {year}

Get your tickets for {event_name} at {venue}, {city}. Secure booking with instant delivery and FanProtect guarantee.

## Event Details

Join thousands of fans for this incredible event. {event_name} promises to be one of the highlights of {year}.

## Ticket Categories

We offer various ticket options to suit every budget:
- Standard tickets
- Premium seating
- VIP hospitality
- Family packages

## Why Book With Us?

- 100% Verified Tickets
- Instant Digital Delivery
- Secure Payment
- FanProtect Guarantee
- 24/7 Customer Support

Book your tickets now!
"""
    
    return content.strip()


async def generate_mega_seo_pages(batch_size=500):
    """Generate thousands of SEO pages"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    pages_created = 0
    all_pages = []
    
    now = datetime.now(timezone.utc)
    today = now.strftime('%Y-%m-%d')
    
    # ==================== F1 PAGES ====================
    for race in F1_RACES:
        for year in F1_YEARS:
            # Main race page
            slug = f"{race['name'].lower().replace(' ', '-').replace('\'', '')}-{year}-tickets"
            page = {
                "slug": slug,
                "title": f"{race['name']} {year} Tickets | Buy F1 Tickets {race['city']} | EuroMatchTickets",
                "description": generate_seo_description("f1", race['name'], race['city'], race['circuit'], year),
                "keywords": generate_seo_keywords("f1", race['name'], race['city'], year),
                "content": generate_seo_content("f1", race['name'], race['city'], race['circuit'], year),
                "category": "f1",
                "event_name": race['name'],
                "city": race['city'],
                "country": race['country'],
                "venue": race['circuit'],
                "year": year,
                "month": race['month'],
                "image": SEO_IMAGES["f1"],
                "price_range": {"low": 150, "high": 5000},
                "priority": 0.95,
                "page_type": "event_landing",
                "created_at": now,
                "updated_at": now,
            }
            all_pages.append(page)
            
            # Ticket type pages
            for ticket_type in F1_TICKET_TYPES:
                tt_slug = f"{race['name'].lower().replace(' ', '-').replace('\'', '')}-{ticket_type.lower().replace(' ', '-').replace('&', 'and')}-tickets-{year}"
                tt_page = {
                    "slug": tt_slug,
                    "title": f"{race['name']} {ticket_type} Tickets {year} | {race['city']} F1",
                    "description": f"Buy {race['name']} {ticket_type} tickets for {year}. {race['circuit']}, {race['city']}. Secure booking, instant delivery.",
                    "keywords": f"{race['name']} {ticket_type} tickets, {race['name']} {ticket_type} {year}, F1 {race['city']} {ticket_type}",
                    "content": f"# {race['name']} {ticket_type} Tickets {year}\n\nGet {ticket_type} tickets for {race['name']} at {race['circuit']}.",
                    "category": "f1",
                    "event_name": race['name'],
                    "ticket_type": ticket_type,
                    "city": race['city'],
                    "venue": race['circuit'],
                    "year": year,
                    "image": SEO_IMAGES["f1"],
                    "priority": 0.85,
                    "page_type": "ticket_type",
                    "created_at": now,
                    "updated_at": now,
                }
                all_pages.append(tt_page)
    
    # ==================== FOOTBALL PAGES ====================
    for club in FOOTBALL_CLUBS:
        for year in ["2025", "2026"]:
            # Main club page
            club_slug = f"{club['name'].lower().replace(' ', '-')}-tickets-{year}"
            clean_name = club['name'].lower().replace(' ', '-')
            clean_name = clean_name.replace('fc-', '')
            club_slug = f"{clean_name}-tickets-{year}"
            club_page = {
                "slug": club_slug,
                "title": f"{club['name']} Tickets {year} | {club['stadium']} | EuroMatchTickets",
                "description": generate_seo_description("football", club['name'], club['city'], club['stadium'], year),
                "keywords": generate_seo_keywords("football", club['name'], club['city'], year),
                "content": generate_seo_content("football", club['name'], club['city'], club['stadium'], year),
                "category": "football",
                "event_name": club['name'],
                "city": club['city'],
                "country": club['country'],
                "venue": club['stadium'],
                "league": club['league'],
                "year": year,
                "image": SEO_IMAGES["football"],
                "price_range": {"low": 50, "high": 2000},
                "priority": 0.90,
                "page_type": "club_landing",
                "created_at": now,
                "updated_at": now,
            }
            all_pages.append(club_page)
            
            # Competition pages
            for comp in FOOTBALL_COMPETITIONS[:5]:
                comp_slug = f"{club['name'].lower().replace(' ', '-').replace('fc-', '')}-{comp.lower().replace(' ', '-')}-tickets-{year}"
                comp_page = {
                    "slug": comp_slug,
                    "title": f"{club['name']} {comp} Tickets {year}",
                    "description": f"Buy {club['name']} {comp} tickets for {year}. {club['stadium']}, {club['city']}.",
                    "keywords": f"{club['name']} {comp} tickets, {club['name']} {comp} {year}",
                    "content": f"# {club['name']} {comp} Tickets {year}\n\nGet tickets for {club['name']} in the {comp}.",
                    "category": "football",
                    "competition": comp,
                    "event_name": club['name'],
                    "city": club['city'],
                    "venue": club['stadium'],
                    "year": year,
                    "image": SEO_IMAGES["football"],
                    "priority": 0.85,
                    "page_type": "competition",
                    "created_at": now,
                    "updated_at": now,
                }
                all_pages.append(comp_page)
    
    # Club vs Club matchup pages
    for i, club1 in enumerate(FOOTBALL_CLUBS[:15]):
        for club2 in FOOTBALL_CLUBS[i+1:15]:
            matchup_slug = f"{club1['name'].lower().replace(' ', '-').replace('fc-', '')}-vs-{club2['name'].lower().replace(' ', '-').replace('fc-', '')}-tickets"
            matchup_page = {
                "slug": matchup_slug,
                "title": f"{club1['name']} vs {club2['name']} Tickets | Book Now",
                "description": f"Buy {club1['name']} vs {club2['name']} match tickets. All competitions. Secure booking, instant delivery.",
                "keywords": f"{club1['name']} vs {club2['name']} tickets, {club1['name']} {club2['name']} match",
                "content": f"# {club1['name']} vs {club2['name']} Tickets\n\nGet tickets for this exciting matchup!",
                "category": "football",
                "matchup": f"{club1['name']} vs {club2['name']}",
                "image": SEO_IMAGES["football"],
                "priority": 0.80,
                "page_type": "matchup",
                "created_at": now,
                "updated_at": now,
            }
            all_pages.append(matchup_page)
    
    # ==================== CONCERT PAGES ====================
    for artist in CONCERT_ARTISTS:
        for year in ["2025", "2026"]:
            # Main artist page
            artist_slug = f"{artist['name'].lower().replace(' ', '-')}-concert-tickets-{year}"
            artist_page = {
                "slug": artist_slug,
                "title": f"{artist['name']} Concert Tickets {year} | {artist['tour']} | EuroMatchTickets",
                "description": generate_seo_description("concert", artist['name'], "Europe", "Various Venues", year),
                "keywords": generate_seo_keywords("concert", artist['name'], None, year),
                "content": generate_seo_content("concert", artist['name'], "Europe", "Various Venues", year),
                "category": "concert",
                "artist": artist['name'],
                "genre": artist['genre'],
                "tour": artist['tour'],
                "year": year,
                "image": SEO_IMAGES["concert"],
                "price_range": {"low": 80, "high": 1500},
                "priority": 0.90,
                "page_type": "artist_landing",
                "created_at": now,
                "updated_at": now,
            }
            all_pages.append(artist_page)
            
            # City-specific artist pages
            for city in CITIES[:10]:
                city_artist_slug = f"{artist['name'].lower().replace(' ', '-')}-{city['name'].lower()}-tickets-{year}"
                city_artist_page = {
                    "slug": city_artist_slug,
                    "title": f"{artist['name']} {city['name']} Tickets {year} | {artist['tour']}",
                    "description": f"Buy {artist['name']} concert tickets in {city['name']} {year}. {artist['tour']}. VIP & Meet & Greet available.",
                    "keywords": f"{artist['name']} {city['name']} tickets, {artist['name']} {city['name']} {year}, {artist['name']} concert {city['name']}",
                    "content": f"# {artist['name']} in {city['name']} - {year}\n\nCatch {artist['name']}'s {artist['tour']} in {city['name']}!",
                    "category": "concert",
                    "artist": artist['name'],
                    "city": city['name'],
                    "country": city['country'],
                    "year": year,
                    "image": SEO_IMAGES["concert"],
                    "priority": 0.80,
                    "page_type": "city_artist",
                    "created_at": now,
                    "updated_at": now,
                }
                all_pages.append(city_artist_page)
    
    # ==================== CITY PAGES ====================
    for city in CITIES:
        for category in ["concerts", "football", "sports", "events"]:
            city_cat_slug = f"{city['name'].lower()}-{category}-tickets"
            city_cat_page = {
                "slug": city_cat_slug,
                "title": f"{city['name']} {category.title()} Tickets 2026 | All Events",
                "description": f"Buy tickets for {category} in {city['name']}, {city['country']}. All venues including {', '.join(city['venues'][:2])}.",
                "keywords": f"{city['name']} {category} tickets, {city['name']} {category} 2026, {category} in {city['name']}",
                "content": f"# {city['name']} {category.title()} Tickets\n\nFind tickets for all {category} events in {city['name']}.",
                "category": category,
                "city": city['name'],
                "country": city['country'],
                "venues": city['venues'],
                "image": SEO_IMAGES.get(category, SEO_IMAGES["concert"]),
                "priority": 0.75,
                "page_type": "city_category",
                "created_at": now,
                "updated_at": now,
            }
            all_pages.append(city_cat_page)
    
    # ==================== WORLD CUP PAGES ====================
    wc_countries = ["USA", "Mexico", "Canada"]
    wc_stages = ["Group Stage", "Round of 16", "Quarter Final", "Semi Final", "Final", "Third Place"]
    wc_groups = ["Group A", "Group B", "Group C", "Group D", "Group E", "Group F", "Group G", "Group H"]
    
    for stage in wc_stages:
        stage_slug = f"world-cup-2026-{stage.lower().replace(' ', '-')}-tickets"
        stage_page = {
            "slug": stage_slug,
            "title": f"FIFA World Cup 2026 {stage} Tickets | Buy Now",
            "description": f"Buy FIFA World Cup 2026 {stage} tickets. USA, Mexico & Canada. All {stage} matches available. Secure booking.",
            "keywords": f"World Cup 2026 {stage} tickets, FIFA 2026 {stage}, World Cup {stage} tickets",
            "content": f"# FIFA World Cup 2026 {stage} Tickets\n\nGet tickets for all {stage} matches!",
            "category": "worldcup",
            "stage": stage,
            "year": "2026",
            "image": SEO_IMAGES["worldcup"],
            "priority": 0.95,
            "page_type": "wc_stage",
            "created_at": now,
            "updated_at": now,
        }
        all_pages.append(stage_page)
    
    for group in wc_groups:
        group_slug = f"world-cup-2026-{group.lower().replace(' ', '-')}-tickets"
        group_page = {
            "slug": group_slug,
            "title": f"FIFA World Cup 2026 {group} Tickets | All Matches",
            "description": f"Buy FIFA World Cup 2026 {group} tickets. All {group} matches. Secure booking, instant delivery.",
            "keywords": f"World Cup 2026 {group} tickets, FIFA 2026 {group}, {group} World Cup tickets",
            "content": f"# FIFA World Cup 2026 {group} Tickets\n\nGet tickets for all {group} matches!",
            "category": "worldcup",
            "group": group,
            "year": "2026",
            "image": SEO_IMAGES["worldcup"],
            "priority": 0.90,
            "page_type": "wc_group",
            "created_at": now,
            "updated_at": now,
        }
        all_pages.append(group_page)
    
    # ==================== BULK INSERT ====================
    logger.info(f"🚀 Generating {len(all_pages)} SEO pages...")
    
    # Insert in batches
    for i in range(0, len(all_pages), batch_size):
        batch = all_pages[i:i+batch_size]
        
        # Use update with upsert for each page
        for page in batch:
            await db.seo_pages.update_one(
                {"slug": page["slug"]},
                {"$set": page},
                upsert=True
            )
            pages_created += 1
        
        logger.info(f"📄 Processed {min(i+batch_size, len(all_pages))}/{len(all_pages)} pages...")
    
    logger.info(f"✅ MEGA SEO Generator: Created/Updated {pages_created} pages")
    return pages_created


if __name__ == "__main__":
    asyncio.run(generate_mega_seo_pages())
