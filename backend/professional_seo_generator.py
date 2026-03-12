"""
PROFESSIONAL SEO PAGE GENERATOR
Creates unique, high-quality content for each page
No duplicates - Every page has original content
"""

import os
import asyncio
import logging
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
import hashlib

logger = logging.getLogger(__name__)

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'ticket_marketplace')

# Professional Images
IMAGES = {
    "f1": "https://static.prod-images.emergentagent.com/jobs/775fd9a1-fbbf-459e-af56-55fb2499685c/images/79ead8c047997bb096a7732818e1c67372ec2621b502006730e57432cc9f97bc.png",
    "football": "https://static.prod-images.emergentagent.com/jobs/775fd9a1-fbbf-459e-af56-55fb2499685c/images/1fbd02bc7c9ace598e3e415ccb8016af16f84d05e8c265e0e6b5e3f427c3f094.png",
    "worldcup": "https://static.prod-images.emergentagent.com/jobs/775fd9a1-fbbf-459e-af56-55fb2499685c/images/05d1221f89c0b02e7b60a2c357633e81ec178eb2044cc15e0b6a54756cb7e589.png",
    "concert": "https://static.prod-images.emergentagent.com/jobs/775fd9a1-fbbf-459e-af56-55fb2499685c/images/4519b497dfd3f12d435889edf28484201965968db2c1130568eb0818f42f758c.png",
}


def clean_slug(text):
    """Create clean URL slug"""
    return text.lower().replace(' ', '-').replace("'", "").replace('&', 'and').replace(',', '')


def generate_unique_f1_content(race_name, city, country, circuit, year, ticket_type=None):
    """Generate unique F1 content"""
    
    # Circuit-specific details
    circuit_details = {
        "Monaco": {
            "highlight": "the glamorous streets of Monte Carlo",
            "feature": "legendary Casino Square and the famous tunnel section",
            "atmosphere": "yachts line the harbor as F1 cars race through the narrow streets",
            "tip": "Book a balcony overlooking the track for the ultimate Monaco experience"
        },
        "Silverstone": {
            "highlight": "the home of British motorsport",
            "feature": "high-speed Maggots-Becketts complex and iconic Copse corner",
            "atmosphere": "passionate British fans create an electric atmosphere",
            "tip": "The Wellington Straight grandstand offers incredible overtaking action"
        },
        "Monza": {
            "highlight": "the Temple of Speed in the royal park",
            "feature": "legendary Parabolica and the high-speed chicanes",
            "atmosphere": "the Tifosi create a sea of red supporting Ferrari",
            "tip": "Arrive early to experience the passionate Italian fans"
        },
        "Spa": {
            "highlight": "the legendary Ardennes forest circuit",
            "feature": "famous Eau Rouge-Raidillon combination",
            "atmosphere": "unpredictable weather adds drama to every session",
            "tip": "Bring rain gear - Spa weather changes in minutes"
        },
        "Suzuka": {
            "highlight": "the figure-8 layout masterpiece",
            "feature": "challenging 130R corner and technical Esses section",
            "atmosphere": "Japanese fans show incredible dedication and respect",
            "tip": "Visit the Honda museum near the circuit"
        },
        "Singapore": {
            "highlight": "the spectacular night race under floodlights",
            "feature": "23 corners through the Marina Bay street circuit",
            "atmosphere": "the Singapore skyline creates a stunning backdrop",
            "tip": "The humidity is intense - stay hydrated"
        },
        "Abu Dhabi": {
            "highlight": "the season finale at the twilight circuit",
            "feature": "racing under the Yas Hotel and into the night",
            "atmosphere": "the championship often decided here in dramatic fashion",
            "tip": "Stay for the post-race concert on the track"
        },
        "Las Vegas": {
            "highlight": "racing down the famous Las Vegas Strip",
            "feature": "high-speed blasts past iconic casinos and hotels",
            "atmosphere": "the entertainment capital meets Formula 1 glamour",
            "tip": "Book a hotel room overlooking the track"
        },
    }
    
    details = circuit_details.get(city, {
        "highlight": f"the incredible {circuit}",
        "feature": "challenging corners and high-speed sections",
        "atmosphere": "passionate fans from around the world",
        "tip": "Arrive early to explore the circuit"
    })
    
    if ticket_type:
        content = f"""# {race_name} {ticket_type} Tickets {year}

## Premium {ticket_type} Experience at {circuit}

Experience the {race_name} from the exclusive {ticket_type} section at {details['highlight']}. This premium ticket category offers an unmatched view of the {details['feature']}.

### What's Included in Your {ticket_type} Ticket

"""
        if ticket_type == "Paddock Club":
            content += """- **Exclusive Paddock Access**: Walk where the teams work
- **Pit Lane Tours**: See the cars up close before the race
- **Gourmet Dining**: World-class cuisine throughout the weekend
- **Open Premium Bar**: Champagne and fine wines
- **Grid Walk**: Stand on the starting grid before the race
- **Driver Appearances**: Meet F1 personalities
- **Best Seats**: Prime viewing position overlooking pit lane
- **Air-Conditioned Suite**: Comfort in any weather

**Price Range**: €3,500 - €6,000 per person"""

        elif ticket_type == "VIP Hospitality":
            content += """- **Premium Hospitality Suite**: Dedicated viewing area
- **Gourmet Catering**: Breakfast, lunch, and afternoon tea
- **Open Bar**: Premium beverages all day
- **Pit Lane Walk**: Pre-race access (selected packages)
- **Padded Seats**: Comfortable viewing position
- **Big Screen TV**: Never miss any action
- **Exclusive Merchandise**: VIP gift pack included

**Price Range**: €1,500 - €3,500 per person"""

        elif ticket_type == "Grandstand":
            content += """- **Reserved Seat**: Your guaranteed spot for all sessions
- **Covered Options**: Protection from sun and rain (selected stands)
- **Giant Screens**: Follow all the action
- **Food & Drink Vendors**: Easy access to refreshments
- **Official Programme**: Included in ticket price
- **Multiple Locations**: Choose your preferred viewing angle

**Price Range**: €350 - €1,200 per person"""

        else:
            content += """- **Circuit Access**: Full weekend admission
- **Multiple Viewing Areas**: Explore the circuit
- **Fan Zone Access**: Entertainment and activities
- **Big Screens**: Watch live timing and footage
- **Merchandise Stands**: Official F1 gear available

**Price Range**: €150 - €400 per person"""

    else:
        content = f"""# {race_name} {year} Tickets - Complete Guide

## Experience Formula 1 at {details['highlight']}

The {race_name} at {circuit} in {city}, {country} is one of the most anticipated events on the F1 calendar. Watch the world's best drivers tackle the {details['feature']} as {details['atmosphere']}.

### Why the {race_name} is Special

The {city} Grand Prix offers a unique Formula 1 experience. The {circuit} challenges drivers with its distinctive layout, creating spectacular racing and memorable overtakes. Whether you're watching Max Verstappen defend his championship, Lewis Hamilton chase history, or young talents like Charles Leclerc and Lando Norris battle for victory, this race delivers non-stop excitement.

### {year} Race Weekend Schedule

- **Friday**: Free Practice 1 & 2 - Teams dial in their setups
- **Saturday**: Free Practice 3 & Qualifying - The battle for pole position
- **Sunday**: Race Day - {race_name} Grand Prix

### Ticket Categories Available

#### General Admission (from €150)
Access to general viewing areas around the circuit. Move between different vantage points throughout the weekend to experience the full spectacle.

#### Grandstand Tickets (from €350)
Reserved seating with guaranteed views. Choose from:
- **Main Straight Grandstands**: See the start, finish, and pit stops
- **Corner Grandstands**: Watch cars push to the limit through technical sections
- **Premium Grandstands**: Best views with additional amenities

#### VIP Hospitality (from €1,500)
Elevate your experience with:
- Exclusive hospitality suites
- Gourmet catering and open bar
- Pit lane walks and driver appearances
- Best seats in the house

#### Paddock Club (from €3,500)
The ultimate F1 experience:
- Behind-the-scenes paddock access
- Grid walks before the race
- Meet F1 drivers and team principals
- Fine dining with champagne
- Unparalleled views of pit lane

### Getting to {city}

{city} is well-connected by international flights. The circuit offers shuttle services from major hotels and the city center on race weekends. Book your accommodation early as hotels fill up fast during the Grand Prix.

### Insider Tip

{details['tip']}

### Why Book with EuroMatchTickets?

- **100% Verified Tickets**: Every ticket authenticated
- **FanProtect Guarantee**: Full refund if cancelled
- **Instant Digital Delivery**: Tickets sent immediately
- **24/7 Customer Support**: We're here to help
- **Best Price Guarantee**: Competitive pricing

### Frequently Asked Questions

**When should I arrive at the circuit?**
Gates typically open 3 hours before the first session. Arriving early lets you explore, find your seats, and soak up the atmosphere.

**Can I bring my own food and drinks?**
Policies vary by circuit, but most allow small amounts of food and sealed water bottles. Check the specific circuit guidelines.

**What should I wear?**
Comfortable shoes are essential - you'll walk a lot! Dress for the weather and bring sun protection or rain gear as needed.

**Are children allowed?**
Yes! F1 is family-friendly. Children under a certain age often get free admission to general areas.

Book your {race_name} {year} tickets now and experience the thrill of Formula 1!"""

    return content


def generate_unique_football_content(club_name, city, country, stadium, league, competition=None, opponent=None):
    """Generate unique football content"""
    
    # Club-specific details
    club_details = {
        "Real Madrid": {
            "nickname": "Los Blancos",
            "history": "the most successful club in European football history with 15 Champions League titles",
            "legends": "Di Stéfano, Cristiano Ronaldo, and Raúl",
            "atmosphere": "the famous Santiago Bernabeu roar",
            "rivals": "Barcelona in El Clásico, Atlético Madrid in the Madrid Derby"
        },
        "FC Barcelona": {
            "nickname": "Blaugrana",
            "history": "home to the legendary tiki-taka style and La Masia academy",
            "legends": "Messi, Cruyff, and Xavi",
            "atmosphere": "100,000 fans singing the club anthem",
            "rivals": "Real Madrid in El Clásico"
        },
        "Manchester United": {
            "nickname": "The Red Devils",
            "history": "England's most successful club with 20 league titles",
            "legends": "Best, Charlton, Cantona, and Rooney",
            "atmosphere": "the Theatre of Dreams comes alive",
            "rivals": "Manchester City, Liverpool"
        },
        "Liverpool": {
            "nickname": "The Reds",
            "history": "six-time European champions with legendary nights at Anfield",
            "legends": "Dalglish, Gerrard, and Salah",
            "atmosphere": "You'll Never Walk Alone echoing around Anfield",
            "rivals": "Manchester United, Everton"
        },
        "Bayern Munich": {
            "nickname": "Die Roten",
            "history": "Germany's most successful club with 6 European Cups",
            "legends": "Beckenbauer, Müller, and Lahm",
            "atmosphere": "the Südkurve creates an incredible wall of sound",
            "rivals": "Borussia Dortmund in Der Klassiker"
        },
    }
    
    details = club_details.get(club_name, {
        "nickname": "the team",
        "history": "a proud history in European football",
        "legends": "legendary players",
        "atmosphere": "passionate supporters",
        "rivals": "fierce local rivals"
    })
    
    if opponent:
        content = f"""# {club_name} vs {opponent} Tickets

## The Ultimate Football Rivalry

Experience one of football's greatest matchups as {club_name} faces {opponent}. This fixture brings together two of the sport's most storied clubs in a battle that captivates millions worldwide.

### Match Atmosphere

When {club_name} and {opponent} meet, the atmosphere is electric. Expect:
- Sold-out stadium with 50,000+ passionate fans
- Incredible choreographed displays from supporter groups
- Non-stop chanting and singing throughout the match
- Post-match celebrations (if the home team wins!)

### Historical Significance

This fixture has produced some of football's most memorable moments. From last-minute winners to controversial decisions, {club_name} vs {opponent} never disappoints.

### Ticket Categories

- **Standard Seats**: Great views from the upper tiers
- **Premium Seats**: Closer to the action with better sightlines
- **VIP Hospitality**: Pre-match dining, premium seats, and post-match access
- **Executive Box**: Private suite for groups

### Prices

Tickets typically range from €80 for upper tier seats to €500+ for premium hospitality packages. Prices increase significantly for rivalry matches.

Book early - these tickets sell out within hours!"""

    elif competition:
        content = f"""# {club_name} {competition} Tickets {datetime.now().year}

## European Nights at {stadium}

Experience the magic of {competition} football at {stadium}. {club_name}, {details['history']}, brings elite European competition to {city}.

### What Makes {competition} Special

The {competition} represents the pinnacle of club football. When {club_name} plays under the floodlights in European competition, {details['atmosphere']}.

### Available Matches

We have tickets for all {club_name}'s {competition} home matches:
- Group Stage fixtures
- Knockout round matches (subject to qualification)
- Potential Semi-Final and Final tickets

### The {competition} Experience

Expect:
- The iconic {competition} anthem before kick-off
- Elite opposition from across Europe
- Enhanced matchday entertainment
- Exclusive {competition} merchandise

### Ticket Information

{competition} tickets are highly sought after. Prices range from €100 for group stage matches to €300+ for knockout rounds.

### Stadium Guide

{stadium} transforms for European nights. The atmosphere is intensified as {club_name} supporters unite behind their team in pursuit of continental glory."""

    else:
        content = f"""# {club_name} Tickets - {stadium}, {city}

## Welcome to {stadium}

Experience {details['nickname']} live at the iconic {stadium} in {city}, {country}. {club_name} is {details['history']}.

### Club Heritage

{club_name} has been home to legends like {details['legends']}. Walking into {stadium} means stepping into footballing history.

### The {stadium} Atmosphere

Nothing compares to {details['atmosphere']}. The passion of {club_name} fans creates an unforgettable matchday experience.

### Available Competitions

We have tickets for all {club_name} home matches:
- **{league}**: Every domestic league game
- **Champions League/Europa League**: European fixtures
- **Cup Competitions**: Domestic cup matches
- **Friendly Matches**: Pre-season and special events

### Seating Categories

#### Standard Tickets (from €50)
Good views from the upper tiers. Experience the full stadium atmosphere.

#### Premium Seats (from €120)
Lower tier seating closer to the pitch. Better sightlines and atmosphere.

#### VIP Hospitality (from €350)
The complete matchday experience:
- Pre-match gourmet dining
- Open bar
- Premium padded seats
- Half-time refreshments
- Post-match access

#### Executive Boxes (from €2,000)
Private suite for groups of 10-20:
- Your own hospitality space
- Dedicated host
- Premium catering
- Best views in the stadium

### Rivalries

Don't miss the biggest matches against {details['rivals']}. These fixtures sell out instantly.

### Getting to {stadium}

Located in {city}, {stadium} is accessible by public transport. Metro and bus services run frequently on matchdays, with extended hours after evening games.

### Why Book With Us?

- 100% Verified Tickets
- Instant Digital Delivery
- Best Price Guarantee
- FanProtect Guarantee
- 24/7 Support

Experience {club_name} live - book your tickets today!"""

    return content


def generate_unique_concert_content(artist_name, genre, tour_name, city=None, venue=None):
    """Generate unique concert content"""
    
    artist_details = {
        "Taylor Swift": {
            "style": "stadium-filling pop spectacle",
            "known_for": "incredible storytelling and surprise song selections",
            "fans": "Swifties",
            "highlight": "the iconic Eras Tour production with 10 distinct acts"
        },
        "Ed Sheeran": {
            "style": "intimate yet massive solo performance",
            "known_for": "playing to 80,000 fans with just his guitar and loop pedal",
            "fans": "Sheerios",
            "highlight": "the emotional acoustic moments"
        },
        "Coldplay": {
            "style": "immersive visual experience",
            "known_for": "LED wristbands creating a sea of synchronized lights",
            "fans": "devoted followers",
            "highlight": "the breathtaking light show during Yellow and Fix You"
        },
        "Bruno Mars": {
            "style": "high-energy funk and R&B extravaganza",
            "known_for": "incredible dance moves and live band",
            "fans": "Hooligans",
            "highlight": "the non-stop dancing and showmanship"
        },
        "The Weeknd": {
            "style": "cinematic concert experience",
            "known_for": "stunning visuals and atmospheric production",
            "fans": "XO fans",
            "highlight": "the immersive After Hours aesthetic"
        },
    }
    
    details = artist_details.get(artist_name, {
        "style": "incredible live performance",
        "known_for": "unforgettable concerts",
        "fans": "dedicated fans",
        "highlight": "the full concert experience"
    })
    
    if city and venue:
        content = f"""# {artist_name} {city} Concert Tickets

## {tour_name} Comes to {city}

Don't miss {artist_name}'s {details['style']} at {venue} in {city}. The {tour_name} has been described as {details['known_for']}.

### Concert Details

- **Artist**: {artist_name}
- **Tour**: {tour_name}
- **Venue**: {venue}
- **City**: {city}
- **Genre**: {genre}

### What to Expect

{artist_name} concerts are legendary. {details['fans']} travel from around the world to experience {details['highlight']}.

### Setlist Expectations

Based on previous {tour_name} shows, expect hits spanning {artist_name}'s entire career. The typical setlist includes 20+ songs over 2+ hours.

### {venue} Information

{venue} is one of {city}'s premier concert venues, offering:
- Excellent acoustics
- Modern amenities
- Easy public transport access
- Nearby restaurants and bars

### Ticket Options

- **General Admission/Standing**: Get close to the stage
- **Seated Tickets**: Comfortable viewing with great sightlines
- **VIP Packages**: Meet & greet, early entry, exclusive merchandise
- **Premium Seats**: Best views in the house

### Tips for {artist_name} Concerts

1. Arrive early - lines form hours before doors open
2. Check the bag policy - many venues have restrictions
3. Wear comfortable shoes - you'll be standing/dancing!
4. Charge your phone - you'll want photos!
5. Learn the lyrics - singalongs are part of the experience

Book your {artist_name} {city} tickets now!"""

    else:
        content = f"""# {artist_name} Concert Tickets - {tour_name}

## Experience {artist_name} Live

{artist_name} brings their {details['style']} to fans across Europe with the {tour_name}. Known for {details['known_for']}, this tour promises unforgettable nights of music.

### About {artist_name}

{artist_name} has established themselves as one of {genre}'s biggest stars. Their concerts attract {details['fans']} from around the world, all eager to experience {details['highlight']}.

### {tour_name} Details

The {tour_name} features:
- State-of-the-art production
- Career-spanning setlist
- Special guest appearances (selected shows)
- Exclusive merchandise

### European Tour Dates

{artist_name} will perform in major cities including:
- London, UK
- Paris, France
- Berlin, Germany
- Amsterdam, Netherlands
- Madrid, Spain
- Milan, Italy
- And more!

### Ticket Categories

#### Standing/General Admission (from €80)
Get up close to the stage and feel the energy of the crowd.

#### Seated Tickets (from €100)
Lower and upper bowl seating with excellent views.

#### VIP Packages (from €350)
Premium experiences including:
- Early entry
- Exclusive merchandise pack
- Premium seating
- Commemorative laminate

#### Meet & Greet (from €800)
The ultimate fan experience:
- Meet {artist_name} in person
- Photo opportunity
- Signed memorabilia
- Soundcheck access
- Best seats in the house

### Why Book With EuroMatchTickets?

- Verified tickets from trusted sellers
- Buyer protection guarantee
- Instant delivery
- 24/7 customer support

Don't miss {artist_name} live - secure your tickets today!"""

    return content


async def generate_professional_seo_pages():
    """Generate professional SEO pages with unique content"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    pages_created = 0
    now = datetime.now(timezone.utc)
    
    # F1 RACES with unique content
    f1_races = [
        {"name": "Monaco Grand Prix", "city": "Monaco", "country": "Monaco", "circuit": "Circuit de Monaco", "price_low": 450, "price_high": 6000},
        {"name": "British Grand Prix", "city": "Silverstone", "country": "UK", "circuit": "Silverstone Circuit", "price_low": 250, "price_high": 4000},
        {"name": "Italian Grand Prix", "city": "Monza", "country": "Italy", "circuit": "Autodromo Nazionale Monza", "price_low": 200, "price_high": 3500},
        {"name": "Belgian Grand Prix", "city": "Spa", "country": "Belgium", "circuit": "Spa-Francorchamps", "price_low": 220, "price_high": 3500},
        {"name": "Japanese Grand Prix", "city": "Suzuka", "country": "Japan", "circuit": "Suzuka Circuit", "price_low": 300, "price_high": 4500},
        {"name": "Singapore Grand Prix", "city": "Singapore", "country": "Singapore", "circuit": "Marina Bay Street Circuit", "price_low": 350, "price_high": 5000},
        {"name": "Abu Dhabi Grand Prix", "city": "Abu Dhabi", "country": "UAE", "circuit": "Yas Marina Circuit", "price_low": 300, "price_high": 4500},
        {"name": "Las Vegas Grand Prix", "city": "Las Vegas", "country": "USA", "circuit": "Las Vegas Strip Circuit", "price_low": 500, "price_high": 7000},
        {"name": "Miami Grand Prix", "city": "Miami", "country": "USA", "circuit": "Miami International Autodrome", "price_low": 400, "price_high": 5500},
        {"name": "Australian Grand Prix", "city": "Melbourne", "country": "Australia", "circuit": "Albert Park", "price_low": 250, "price_high": 4000},
    ]
    
    ticket_types = ["General Admission", "Grandstand", "VIP Hospitality", "Paddock Club"]
    
    for race in f1_races:
        for year in ["2025", "2026"]:
            # Main race page
            slug = clean_slug(f"{race['name']}-{year}-tickets")
            content = generate_unique_f1_content(race['name'], race['city'], race['country'], race['circuit'], year)
            
            page = {
                "slug": slug,
                "title": f"{race['name']} {year} Tickets | Buy F1 Tickets | EuroMatchTickets",
                "description": f"Buy {race['name']} {year} tickets at {race['circuit']}. Grandstand, VIP & Paddock Club. 100% verified, instant delivery.",
                "keywords": f"{race['name']} tickets, {race['name']} {year}, F1 {race['city']} tickets, buy {race['name']} tickets, {race['circuit']} F1",
                "content": content,
                "category": "f1",
                "event_name": race['name'],
                "city": race['city'],
                "country": race['country'],
                "venue": race['circuit'],
                "year": year,
                "image": IMAGES["f1"],
                "price_range": {"low": race['price_low'], "high": race['price_high']},
                "priority": 0.95,
                "page_type": "f1_race",
                "created_at": now,
                "updated_at": now,
            }
            
            await db.seo_pages.update_one({"slug": slug}, {"$set": page}, upsert=True)
            pages_created += 1
            
            # Ticket type pages
            for tt in ticket_types:
                tt_slug = clean_slug(f"{race['name']}-{tt}-tickets-{year}")
                tt_content = generate_unique_f1_content(race['name'], race['city'], race['country'], race['circuit'], year, tt)
                
                tt_page = {
                    "slug": tt_slug,
                    "title": f"{race['name']} {tt} Tickets {year} | {race['city']} F1",
                    "description": f"Buy {race['name']} {tt} tickets {year}. {race['circuit']}. Secure booking, instant delivery.",
                    "keywords": f"{race['name']} {tt} tickets, F1 {tt} {race['city']}, {race['name']} {year} {tt}",
                    "content": tt_content,
                    "category": "f1",
                    "ticket_type": tt,
                    "event_name": race['name'],
                    "city": race['city'],
                    "venue": race['circuit'],
                    "year": year,
                    "image": IMAGES["f1"],
                    "priority": 0.85,
                    "page_type": "f1_ticket_type",
                    "created_at": now,
                    "updated_at": now,
                }
                
                await db.seo_pages.update_one({"slug": tt_slug}, {"$set": tt_page}, upsert=True)
                pages_created += 1
    
    # FOOTBALL CLUBS with unique content
    clubs = [
        {"name": "Real Madrid", "city": "Madrid", "country": "Spain", "stadium": "Santiago Bernabeu", "league": "La Liga"},
        {"name": "FC Barcelona", "city": "Barcelona", "country": "Spain", "stadium": "Camp Nou", "league": "La Liga"},
        {"name": "Manchester United", "city": "Manchester", "country": "UK", "stadium": "Old Trafford", "league": "Premier League"},
        {"name": "Liverpool", "city": "Liverpool", "country": "UK", "stadium": "Anfield", "league": "Premier League"},
        {"name": "Bayern Munich", "city": "Munich", "country": "Germany", "stadium": "Allianz Arena", "league": "Bundesliga"},
        {"name": "PSG", "city": "Paris", "country": "France", "stadium": "Parc des Princes", "league": "Ligue 1"},
        {"name": "Juventus", "city": "Turin", "country": "Italy", "stadium": "Allianz Stadium", "league": "Serie A"},
        {"name": "Manchester City", "city": "Manchester", "country": "UK", "stadium": "Etihad Stadium", "league": "Premier League"},
        {"name": "Arsenal", "city": "London", "country": "UK", "stadium": "Emirates Stadium", "league": "Premier League"},
        {"name": "Chelsea", "city": "London", "country": "UK", "stadium": "Stamford Bridge", "league": "Premier League"},
    ]
    
    competitions = ["Champions League", "Europa League"]
    
    for club in clubs:
        # Main club page
        slug = clean_slug(f"{club['name']}-tickets")
        content = generate_unique_football_content(club['name'], club['city'], club['country'], club['stadium'], club['league'])
        
        page = {
            "slug": slug,
            "title": f"{club['name']} Tickets | {club['stadium']} | EuroMatchTickets",
            "description": f"Buy {club['name']} tickets at {club['stadium']}. {club['league']} & Champions League. 100% verified.",
            "keywords": f"{club['name']} tickets, {club['stadium']} tickets, {club['league']} {club['name']}, buy {club['name']} tickets",
            "content": content,
            "category": "football",
            "event_name": club['name'],
            "city": club['city'],
            "country": club['country'],
            "venue": club['stadium'],
            "league": club['league'],
            "image": IMAGES["football"],
            "priority": 0.90,
            "page_type": "football_club",
            "created_at": now,
            "updated_at": now,
        }
        
        await db.seo_pages.update_one({"slug": slug}, {"$set": page}, upsert=True)
        pages_created += 1
        
        # Competition pages
        for comp in competitions:
            comp_slug = clean_slug(f"{club['name']}-{comp}-tickets")
            comp_content = generate_unique_football_content(club['name'], club['city'], club['country'], club['stadium'], club['league'], comp)
            
            comp_page = {
                "slug": comp_slug,
                "title": f"{club['name']} {comp} Tickets | European Football",
                "description": f"Buy {club['name']} {comp} tickets. Watch European football at {club['stadium']}.",
                "keywords": f"{club['name']} {comp} tickets, {comp} {club['city']}, {club['name']} Europe",
                "content": comp_content,
                "category": "football",
                "competition": comp,
                "event_name": club['name'],
                "city": club['city'],
                "venue": club['stadium'],
                "image": IMAGES["football"],
                "priority": 0.85,
                "page_type": "football_competition",
                "created_at": now,
                "updated_at": now,
            }
            
            await db.seo_pages.update_one({"slug": comp_slug}, {"$set": comp_page}, upsert=True)
            pages_created += 1
    
    # MATCHUPS
    matchups = [
        ("Real Madrid", "FC Barcelona"),
        ("Manchester United", "Liverpool"),
        ("Manchester United", "Manchester City"),
        ("Bayern Munich", "Borussia Dortmund"),
        ("AC Milan", "Inter Milan"),
        ("Arsenal", "Tottenham"),
        ("Real Madrid", "Atletico Madrid"),
    ]
    
    for club1, club2 in matchups:
        slug = clean_slug(f"{club1}-vs-{club2}-tickets")
        content = f"""# {club1} vs {club2} Tickets

## One of Football's Greatest Rivalries

Experience the electric atmosphere when {club1} faces {club2}. This fixture is one of the most anticipated matches in world football.

### Historical Significance

{club1} and {club2} have a rivalry spanning decades. Every meeting brings drama, passion, and unforgettable moments.

### What to Expect

- Sold-out stadium atmosphere
- Incredible fan displays
- High-intensity football
- Potential for drama and late goals

### Ticket Information

These matches sell out instantly. Prices range from €150 for upper tier to €800+ for premium seats.

### Book Early

Don't miss this iconic fixture - secure your tickets as soon as they become available!"""

        page = {
            "slug": slug,
            "title": f"{club1} vs {club2} Tickets | Derby Match",
            "description": f"Buy {club1} vs {club2} tickets. One of football's greatest rivalries. Secure your seats now.",
            "keywords": f"{club1} vs {club2} tickets, {club1} {club2} match, derby tickets",
            "content": content,
            "category": "football",
            "matchup": f"{club1} vs {club2}",
            "image": IMAGES["football"],
            "priority": 0.88,
            "page_type": "matchup",
            "created_at": now,
            "updated_at": now,
        }
        
        await db.seo_pages.update_one({"slug": slug}, {"$set": page}, upsert=True)
        pages_created += 1
    
    # CONCERTS with unique content
    artists = [
        {"name": "Taylor Swift", "genre": "Pop", "tour": "Eras Tour"},
        {"name": "Ed Sheeran", "genre": "Pop", "tour": "Mathematics Tour"},
        {"name": "Coldplay", "genre": "Rock", "tour": "Music of the Spheres"},
        {"name": "Bruno Mars", "genre": "R&B/Pop", "tour": "24K Magic World Tour"},
        {"name": "The Weeknd", "genre": "R&B", "tour": "After Hours Til Dawn"},
        {"name": "Beyonce", "genre": "R&B/Pop", "tour": "Renaissance World Tour"},
        {"name": "Adele", "genre": "Soul/Pop", "tour": "Weekends with Adele"},
        {"name": "Harry Styles", "genre": "Pop", "tour": "Love On Tour"},
    ]
    
    cities = [
        {"name": "London", "venue": "Wembley Stadium"},
        {"name": "Paris", "venue": "Stade de France"},
        {"name": "Berlin", "venue": "Olympiastadion"},
        {"name": "Amsterdam", "venue": "Johan Cruyff Arena"},
        {"name": "Madrid", "venue": "Santiago Bernabeu"},
    ]
    
    for artist in artists:
        # Main artist page
        slug = clean_slug(f"{artist['name']}-concert-tickets")
        content = generate_unique_concert_content(artist['name'], artist['genre'], artist['tour'])
        
        page = {
            "slug": slug,
            "title": f"{artist['name']} Concert Tickets | {artist['tour']} | EuroMatchTickets",
            "description": f"Buy {artist['name']} concert tickets. {artist['tour']} Europe dates. VIP & Meet & Greet available.",
            "keywords": f"{artist['name']} tickets, {artist['name']} concert, {artist['tour']} tickets, {artist['name']} tour",
            "content": content,
            "category": "concert",
            "artist": artist['name'],
            "genre": artist['genre'],
            "tour": artist['tour'],
            "image": IMAGES["concert"],
            "priority": 0.90,
            "page_type": "artist_main",
            "created_at": now,
            "updated_at": now,
        }
        
        await db.seo_pages.update_one({"slug": slug}, {"$set": page}, upsert=True)
        pages_created += 1
        
        # City-specific pages
        for city in cities:
            city_slug = clean_slug(f"{artist['name']}-{city['name']}-tickets")
            city_content = generate_unique_concert_content(artist['name'], artist['genre'], artist['tour'], city['name'], city['venue'])
            
            city_page = {
                "slug": city_slug,
                "title": f"{artist['name']} {city['name']} Concert Tickets | {city['venue']}",
                "description": f"Buy {artist['name']} tickets in {city['name']} at {city['venue']}. {artist['tour']}.",
                "keywords": f"{artist['name']} {city['name']} tickets, {artist['name']} {city['venue']}, {artist['name']} concert {city['name']}",
                "content": city_content,
                "category": "concert",
                "artist": artist['name'],
                "city": city['name'],
                "venue": city['venue'],
                "image": IMAGES["concert"],
                "priority": 0.80,
                "page_type": "artist_city",
                "created_at": now,
                "updated_at": now,
            }
            
            await db.seo_pages.update_one({"slug": city_slug}, {"$set": city_page}, upsert=True)
            pages_created += 1
    
    logger.info(f"✅ Generated {pages_created} unique SEO pages")
    return pages_created


if __name__ == "__main__":
    asyncio.run(generate_professional_seo_pages())
