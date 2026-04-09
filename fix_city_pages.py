"""
Fix thin city -event-tickets pages with rich SEO content, prices, FAQs, and internal links.
"""
import pymongo
import os

client = pymongo.MongoClient(os.environ.get('MONGO_URL'))
db = client['euromatchtickets']

CITY_PAGES = {
    "paris-event-tickets": {
        "title": "Paris Event Tickets 2026 – Football, Concerts & More",
        "description": "Buy tickets for all events in Paris 2026. PSG at Parc des Princes, concerts at Stade de France, Roland Garros and more. From €35. Verified sellers, instant QR delivery!",
        "meta_description": "Buy Paris event tickets 2026! PSG Ligue 1 from €55, Stade de France concerts from €39, Roland Garros from €45. Verified sellers, instant QR delivery. FanProtect guarantee!",
        "event_name": "Paris Events",
        "city": "Paris",
        "country": "France",
        "category": "city",
        "price_low": 35,
        "price_high": 995,
        "content": """## Buy Tickets for Events in Paris 2026

Paris is Europe's premier destination for world-class events. From PSG matches at the iconic Parc des Princes to massive concerts at Stade de France, EuroMatchTickets offers the cheapest verified tickets for every major Paris event.

### Top Paris Events 2026

| Event | Venue | From |
|-------|-------|------|
| PSG Ligue 1 Matches | Parc des Princes | €55 |
| PSG Champions League | Parc des Princes | €125 |
| Stade de France Concerts | Stade de France | €39 |
| Roland Garros 2026 | Roland Garros | €45 |
| Rugby Six Nations | Stade de France | €65 |

### Why Paris is Europe's Best Event City

Paris hosts over 500 major sporting and entertainment events annually. The city boasts iconic venues including the 80,000-seat Stade de France, the legendary Parc des Princes, and Roland Garros – home of the French Open.

### Paris Football Tickets

**PSG** dominates French football. Watch Ligue 1 and Champions League action at Parc des Princes from just €55. The atmosphere at a Paris derby (PSG vs Marseille – Le Classique) is among the most electric in world football.

### Paris Concert Tickets

Stade de France and La Defense Arena host the world's biggest artists. Coldplay, Taylor Swift, Bruno Mars, and The Weeknd all have Paris dates in 2026.

### Getting to Paris Events

Paris has excellent transport links. The Metro, RER, and bus network connect all major venues. Most venues are within 30 minutes of central Paris.

- **Parc des Princes**: Metro Line 9 (Porte de Saint-Cloud)
- **Stade de France**: RER B/D (La Plaine-Stade de France)
- **Roland Garros**: Metro Line 10 (Porte d'Auteuil)""",
        "faq": [
            ["How much are Paris event tickets?", "Paris event tickets start from €35. PSG Ligue 1 from €55, concerts at Stade de France from €39, Roland Garros from €45. Champions League matches from €125."],
            ["Where can I buy Paris event tickets?", "Buy verified Paris event tickets on EuroMatchTickets. All tickets are 100% guaranteed with instant QR delivery and FanProtect money-back guarantee."],
            ["What are the best events in Paris 2026?", "Top Paris events in 2026 include PSG Champions League matches, Stade de France concerts (Coldplay, Taylor Swift), Roland Garros, and Rugby Six Nations."],
            ["How do I get to events in Paris?", "Paris has excellent Metro and RER connections to all major venues. Parc des Princes is on Metro Line 9, Stade de France on RER B/D."]
        ]
    },
    "london-event-tickets": {
        "title": "London Event Tickets 2026 – Football, Concerts & Theatre",
        "description": "Buy tickets for all events in London 2026. Premier League, West End theatre, concerts at Wembley and O2 Arena. From €29. Verified sellers, instant QR delivery!",
        "meta_description": "Buy London event tickets 2026! Arsenal from €55, Wembley concerts from €49, West End shows from €29. Verified sellers, instant QR delivery. FanProtect guarantee!",
        "event_name": "London Events",
        "city": "London",
        "country": "United Kingdom",
        "category": "city",
        "price_low": 29,
        "price_high": 1500,
        "content": """## Buy Tickets for Events in London 2026

London is the world's entertainment capital. From Premier League football at Emirates and Stamford Bridge to sold-out concerts at Wembley Stadium and The O2, EuroMatchTickets has the cheapest verified tickets.

### Top London Events 2026

| Event | Venue | From |
|-------|-------|------|
| Arsenal Premier League | Emirates Stadium | €55 |
| Chelsea Premier League | Stamford Bridge | €49 |
| Wembley Stadium Concerts | Wembley Stadium | €49 |
| The O2 Arena Concerts | The O2 | €39 |
| West End Theatre | Various | €29 |
| Tottenham Premier League | Tottenham Stadium | €45 |

### London Football Tickets

London is home to 6 Premier League clubs! Watch Arsenal at Emirates, Chelsea at Stamford Bridge, Tottenham at their new stadium, West Ham at London Stadium, Crystal Palace, and Fulham. Champions League nights in London are unforgettable.

### London Concert Tickets

Wembley Stadium (90,000 capacity) and The O2 Arena host the world's biggest artists. Taylor Swift, Coldplay, Bruno Mars and Adele all have London dates. Smaller venues like Brixton Academy and Royal Albert Hall offer intimate experiences.

### West End Theatre

London's West End rivals Broadway with shows like The Lion King, Wicked, Hamilton, and Les Misérables. Tickets from just €29.

### Getting Around London

- **Emirates Stadium**: Piccadilly Line (Arsenal station)
- **Wembley Stadium**: Metropolitan/Jubilee Line (Wembley Park)
- **The O2**: Jubilee Line (North Greenwich)
- **Stamford Bridge**: District Line (Fulham Broadway)""",
        "faq": [
            ["How much are London event tickets?", "London event tickets start from €29 for West End theatre. Premier League from €45, Wembley concerts from €49, O2 Arena from €39."],
            ["What Premier League teams play in London?", "London has 6 Premier League clubs: Arsenal, Chelsea, Tottenham, West Ham, Crystal Palace, and Fulham. All offer incredible matchday experiences."],
            ["What are the best London concerts 2026?", "Major London concerts in 2026 include Taylor Swift at Wembley, Coldplay at Wembley, and multiple shows at The O2 Arena and Royal Albert Hall."],
            ["How do I get to Wembley Stadium?", "Take the Metropolitan or Jubilee Line to Wembley Park station. It's a 10-minute walk from the station to the stadium."]
        ]
    },
    "madrid-event-tickets": {
        "title": "Madrid Event Tickets 2026 – Real Madrid, Concerts & More",
        "description": "Buy tickets for all events in Madrid 2026. Real Madrid at Bernabeu, Atletico Madrid, concerts and more. From €39. Verified sellers, instant QR delivery!",
        "meta_description": "Buy Madrid event tickets 2026! Real Madrid from €49, Atletico Madrid from €35, concerts from €39. Bernabeu, Metropolitano. Verified sellers, instant QR delivery!",
        "event_name": "Madrid Events",
        "city": "Madrid",
        "country": "Spain",
        "category": "city",
        "price_low": 35,
        "price_high": 2000,
        "content": """## Buy Tickets for Events in Madrid 2026

Madrid is Spain's sporting and cultural capital. Home to Real Madrid and Atletico Madrid, the city offers incredible football, concerts, and entertainment at world-class venues.

### Top Madrid Events 2026

| Event | Venue | From |
|-------|-------|------|
| Real Madrid La Liga | Santiago Bernabeu | €49 |
| Real Madrid Champions League | Santiago Bernabeu | €85 |
| El Clasico | Santiago Bernabeu | €195 |
| Atletico Madrid La Liga | Metropolitano | €35 |
| Madrid Concerts | WiZink Center | €39 |

### Real Madrid Tickets

The newly renovated Santiago Bernabeu is one of football's most iconic stadiums. Watch Real Madrid in La Liga from €49, Champions League from €85, or experience the legendary El Clasico against Barcelona from €195.

### Atletico Madrid Tickets

Estadio Metropolitano offers a fantastic matchday experience. Atletico Madrid La Liga tickets from just €35. The atmosphere is passionate and authentic.

### Madrid Concert & Event Tickets

Madrid's WiZink Center and Estadio Metropolitano host major international artists. The city also features bullfighting at Las Ventas, tennis at Madrid Open, and world-class museums.

### Getting to Madrid Events

- **Santiago Bernabeu**: Metro Line 10 (Santiago Bernabeu station)
- **Metropolitano**: Metro Line 7 (Estadio Metropolitano)
- **WiZink Center**: Metro Line 2 (Goya) or Line 9 (O'Donnell)""",
        "faq": [
            ["How much are Madrid event tickets?", "Madrid event tickets start from €35 for Atletico Madrid. Real Madrid from €49, El Clasico from €195, concerts from €39."],
            ["When is the next El Clasico?", "El Clasico (Real Madrid vs Barcelona) takes place twice per season – once at Bernabeu and once at Camp Nou. Check our listings for exact dates."],
            ["Can tourists buy Real Madrid tickets?", "Yes! All Real Madrid tickets on EuroMatchTickets are available to fans worldwide. No club membership required."],
            ["How do I get to the Bernabeu?", "Take Metro Line 10 to Santiago Bernabeu station. The stadium is directly above the station – you can't miss it!"]
        ]
    },
    "barcelona-event-tickets": {
        "title": "Barcelona Event Tickets 2026 – FC Barcelona, Concerts & More",
        "description": "Buy tickets for all events in Barcelona 2026. FC Barcelona at Camp Nou, concerts, festivals and more. From €39. Verified sellers, instant QR delivery!",
        "meta_description": "Buy Barcelona event tickets 2026! FC Barcelona from €45, Camp Nou concerts from €39, Spanish GP from €79. Verified sellers, instant QR delivery. FanProtect guarantee!",
        "event_name": "Barcelona Events",
        "city": "Barcelona",
        "country": "Spain",
        "category": "city",
        "price_low": 39,
        "price_high": 1800,
        "content": """## Buy Tickets for Events in Barcelona 2026

Barcelona combines world-class football, stunning architecture, and incredible nightlife. FC Barcelona at the renovated Camp Nou is a bucket-list experience for any sports fan.

### Top Barcelona Events 2026

| Event | Venue | From |
|-------|-------|------|
| FC Barcelona La Liga | Camp Nou | €45 |
| FC Barcelona Champions League | Camp Nou | €75 |
| El Clasico (Away) | Camp Nou | €195 |
| F1 Spanish Grand Prix | Circuit de Barcelona | €79 |
| Barcelona Concerts | Palau Sant Jordi | €39 |
| Primavera Sound Festival | Parc del Forum | €89 |

### FC Barcelona Tickets

The new Camp Nou is Europe's largest stadium. Watch Barça in La Liga from €45, Champions League from €75, or the legendary El Clasico from €195. The atmosphere at Camp Nou is truly special.

### F1 Spanish Grand Prix

Circuit de Barcelona-Catalunya hosts the Spanish Grand Prix each May. Grandstand tickets from €79. A fantastic circuit for F1 fans visiting the city.

### Barcelona Concert & Festival Tickets

Palau Sant Jordi and Estadi Olimpic host major concerts. Primavera Sound Festival is one of Europe's best music festivals. The city's vibrant nightlife scene adds to the experience.

### Getting to Barcelona Events

- **Camp Nou**: Metro Line 3 (Les Corts or Palau Reial)
- **Circuit de Barcelona**: Direct shuttle from Sants station
- **Palau Sant Jordi**: Metro Line 1/3 (Espanya)""",
        "faq": [
            ["How much are Barcelona event tickets?", "Barcelona event tickets start from €39 for concerts. FC Barcelona from €45, F1 Spanish GP from €79, El Clasico from €195."],
            ["Is the new Camp Nou open?", "Yes! The renovated Camp Nou is now open and is Europe's largest stadium. A spectacular matchday experience."],
            ["What events are in Barcelona 2026?", "Major events include FC Barcelona matches, F1 Spanish GP, Primavera Sound Festival, and concerts at Palau Sant Jordi and Estadi Olimpic."],
            ["How do I get to Camp Nou?", "Take Metro Line 3 to Les Corts or Palau Reial station. Both are a 5-minute walk from the stadium."]
        ]
    },
    "milan-event-tickets": {
        "title": "Milan Event Tickets 2026 – AC Milan, Inter, Concerts & F1",
        "description": "Buy tickets for all events in Milan 2026. AC Milan, Inter Milan at San Siro, Monza GP and concerts. From €29. Verified sellers, instant QR delivery!",
        "meta_description": "Buy Milan event tickets 2026! AC Milan from €35, Inter Milan from €35, Monza F1 from €69, San Siro concerts from €39. Verified sellers, instant QR delivery!",
        "event_name": "Milan Events",
        "city": "Milan",
        "country": "Italy",
        "category": "city",
        "price_low": 29,
        "price_high": 2000,
        "content": """## Buy Tickets for Events in Milan 2026

Milan is Italy's fashion and football capital. Home to AC Milan and Inter Milan at the legendary San Siro, plus the Monza F1 Grand Prix just 20km away. EuroMatchTickets has the cheapest verified tickets.

### Top Milan Events 2026

| Event | Venue | From |
|-------|-------|------|
| AC Milan Serie A | San Siro | €35 |
| Inter Milan Serie A | San Siro | €35 |
| Derby della Madonnina | San Siro | €125 |
| Champions League Final 2026 | San Siro | €195 |
| Italian Grand Prix | Autodromo Monza | €69 |
| Milan Fashion Week Events | Various | €29 |

### AC Milan & Inter Milan Tickets

The legendary San Siro (Stadio Giuseppe Meazza) hosts both AC Milan and Inter Milan. Serie A tickets from just €35. The Milan Derby (Derby della Madonnina) is one of football's most passionate rivalries – tickets from €125.

### Champions League Final 2026

San Siro hosts the 2026 Champions League Final! This once-in-a-lifetime event will bring Europe's two best clubs to Milan. Tickets from €195.

### Italian Grand Prix at Monza

Autodromo Nazionale Monza is just 20km from Milan city center. The Italian GP is F1's most atmospheric race – the Tifosi are legendary. Tickets from €69.

### Getting to Milan Events

- **San Siro**: Metro Line 5 (San Siro Stadio)
- **Monza Circuit**: Train from Milano Centrale (25 mins)
- **La Scala**: Metro Line 1/3 (Duomo)""",
        "faq": [
            ["How much are Milan event tickets?", "Milan event tickets start from €29. AC Milan/Inter Serie A from €35, Milan Derby from €125, Champions League Final from €195, Monza F1 from €69."],
            ["What is the Derby della Madonnina?", "The Derby della Madonnina is the Milan Derby between AC Milan and Inter Milan at San Siro. One of football's most intense rivalries."],
            ["Is the Champions League Final 2026 in Milan?", "Yes! The 2026 Champions League Final is at San Siro, Milan. Book your tickets now – this will sell out fast."],
            ["How do I get from Milan to Monza F1?", "Take the train from Milano Centrale to Monza station (25 minutes). Shuttle buses run from Monza station to the circuit on race days."]
        ]
    },
    "amsterdam-event-tickets": {
        "title": "Amsterdam Event Tickets 2026 – Football, Concerts & Festivals",
        "description": "Buy tickets for all events in Amsterdam 2026. Ajax at Johan Cruyff Arena, concerts and festivals. From €35. Verified sellers, instant QR delivery!",
        "meta_description": "Buy Amsterdam event tickets 2026! Ajax from €35, Johan Cruyff Arena concerts from €39, ADE festival. Verified sellers, instant QR delivery. FanProtect guarantee!",
        "event_name": "Amsterdam Events",
        "city": "Amsterdam",
        "country": "Netherlands",
        "category": "city",
        "price_low": 35,
        "price_high": 495,
        "content": """## Buy Tickets for Events in Amsterdam 2026

Amsterdam is one of Europe's most vibrant cities for live entertainment. From Ajax football at the Johan Cruyff Arena to world-famous music festivals, the city offers incredible events year-round.

### Top Amsterdam Events 2026

| Event | Venue | From |
|-------|-------|------|
| Ajax Eredivisie | Johan Cruyff Arena | €35 |
| Ajax Champions League | Johan Cruyff Arena | €75 |
| Johan Cruyff Arena Concerts | Johan Cruyff Arena | €39 |
| ADE (Amsterdam Dance Event) | Various | €49 |
| Ziggo Dome Concerts | Ziggo Dome | €45 |

### Ajax Football Tickets

The Johan Cruyff Arena is one of Europe's finest modern stadiums. Watch Ajax in the Eredivisie from €35, or Champions League action from €75. The arena's retractable roof ensures perfect conditions year-round.

### Amsterdam Concert & Festival Tickets

The Ziggo Dome and Johan Cruyff Arena host major international artists. Amsterdam Dance Event (ADE) is the world's biggest electronic music festival. The city's intimate venues like Paradiso and Melkweg offer unique experiences.

### Getting to Amsterdam Events

- **Johan Cruyff Arena**: Metro 54 (Bijlmer ArenA station)
- **Ziggo Dome**: Metro 54 (Bijlmer ArenA station)
- **Paradiso**: Tram 1/2/5 (Leidseplein)""",
        "faq": [
            ["How much are Amsterdam event tickets?", "Amsterdam event tickets start from €35 for Ajax matches. Concerts at Ziggo Dome from €45, ADE festival from €49."],
            ["What is Amsterdam Dance Event?", "ADE is the world's biggest electronic music festival, held every October in Amsterdam. Over 2,500 artists perform across 200+ venues."],
            ["Can I buy Ajax tickets as a tourist?", "Yes! All Ajax tickets on EuroMatchTickets are available to international fans. No membership required."],
            ["How do I get to Johan Cruyff Arena?", "Take Metro 54 to Bijlmer ArenA station. The arena and Ziggo Dome are both directly connected to the station."]
        ]
    },
    "dubai-event-tickets": {
        "title": "Dubai Event Tickets 2026 – Football, Concerts & Sports",
        "description": "Buy tickets for events in Dubai 2026. World-class concerts, exhibitions, and sporting events. From €39. Verified sellers, instant QR delivery!",
        "meta_description": "Buy Dubai event tickets 2026! World-class concerts from €39, sports events, exhibitions. Coca-Cola Arena, Dubai Opera. Verified sellers, instant QR delivery!",
        "event_name": "Dubai Events",
        "city": "Dubai",
        "country": "UAE",
        "category": "city",
        "price_low": 39,
        "price_high": 1500,
        "content": """## Buy Tickets for Events in Dubai 2026

Dubai has become a global entertainment hub. From the Coca-Cola Arena to the stunning Dubai Opera, the city hosts world-class concerts, sporting events, and exhibitions throughout the year.

### Top Dubai Events 2026

| Event | Venue | From |
|-------|-------|------|
| Coca-Cola Arena Concerts | Coca-Cola Arena | €39 |
| Dubai Opera Shows | Dubai Opera | €49 |
| Dubai World Cup (Horse Racing) | Meydan Racecourse | €65 |
| Abu Dhabi Grand Prix | Yas Marina Circuit | €119 |
| Dubai Rugby Sevens | The Sevens Stadium | €35 |

### Dubai Concert Tickets

The Coca-Cola Arena (17,000 capacity) attracts the world's biggest artists. John Legend, Maroon 5, and Dua Lipa all perform regularly in Dubai. Dubai Opera in Downtown Dubai offers a more intimate setting.

### Nearby: Abu Dhabi Grand Prix

Just 90 minutes from Dubai, the Abu Dhabi Grand Prix at Yas Marina Circuit is the spectacular F1 season finale. A unique sunset race experience from €119.

### Getting to Dubai Events

- **Coca-Cola Arena**: Dubai Metro (Dubai Mall station)
- **Dubai Opera**: Dubai Metro (Burj Khalifa station)
- **Yas Marina (Abu Dhabi)**: Direct buses from Dubai""",
        "faq": [
            ["How much are Dubai event tickets?", "Dubai event tickets start from €35 for rugby sevens. Coca-Cola Arena concerts from €39, Dubai Opera from €49, Abu Dhabi GP from €119."],
            ["What concerts are in Dubai 2026?", "Major artists perform regularly at the Coca-Cola Arena. Check our listings for the latest concerts in Dubai 2026."],
            ["Can I attend Abu Dhabi GP from Dubai?", "Yes! Abu Dhabi is only 90 minutes from Dubai by car. Direct buses run on race day from Dubai to Yas Marina Circuit."],
            ["Are Dubai event tickets expensive?", "Dubai offers events at various price points. Concert tickets start from €39, with VIP options available for premium experiences."]
        ]
    },
    "istanbul-event-tickets": {
        "title": "Istanbul Event Tickets 2026 – Football, Concerts & More",
        "description": "Buy tickets for events in Istanbul 2026. Galatasaray, Fenerbahce, Besiktas football and concerts. From €25. Verified sellers, instant QR delivery!",
        "meta_description": "Buy Istanbul event tickets 2026! Galatasaray from €25, Fenerbahce from €25, concerts from €35. Turkish Super Lig. Verified sellers, instant QR delivery!",
        "event_name": "Istanbul Events",
        "city": "Istanbul",
        "country": "Turkey",
        "category": "city",
        "price_low": 25,
        "price_high": 500,
        "content": """## Buy Tickets for Events in Istanbul 2026

Istanbul is a city where East meets West, and its sporting and entertainment scene reflects that diversity. Home to three of Turkey's biggest football clubs, the city offers some of Europe's most passionate fan experiences.

### Top Istanbul Events 2026

| Event | Venue | From |
|-------|-------|------|
| Galatasaray Super Lig | Ali Sami Yen Stadium | €25 |
| Fenerbahce Super Lig | Sukru Saracoglu Stadium | €25 |
| Besiktas Super Lig | Vodafone Park | €25 |
| Istanbul Concerts | Volkswagen Arena | €35 |
| Istanbul Derby | Various | €65 |

### Istanbul Football Tickets

Turkish football is famous for its incredible atmosphere. Galatasaray, Fenerbahce, and Besiktas all play in the Turkish Super Lig. The Istanbul Derby (Galatasaray vs Fenerbahce) is one of the most intense rivalries in world football.

### Istanbul Concert Tickets

The Volkswagen Arena and KucukCiftlik Park host major international and Turkish artists. Istanbul's unique atmosphere makes every concert special.

### Getting to Istanbul Events

- **Ali Sami Yen (Galatasaray)**: Metro M2 (Seyrantepe)
- **Vodafone Park (Besiktas)**: Ferry or bus to Besiktas
- **Sukru Saracoglu (Fenerbahce)**: Marmaray train""",
        "faq": [
            ["How much are Istanbul event tickets?", "Istanbul event tickets start from €25 for Turkish Super Lig matches. Concerts from €35, Istanbul Derby from €65."],
            ["What is the Istanbul Derby?", "The Istanbul Derby between Galatasaray and Fenerbahce is one of the fiercest rivalries in world football, known for its incredible atmosphere."],
            ["Are Istanbul event tickets affordable?", "Yes! Turkish football tickets are among the most affordable in Europe, starting from just €25 with verified sellers."],
            ["How do I get to Galatasaray's stadium?", "Take Metro M2 to Seyrantepe station. The Ali Sami Yen Stadium is directly connected."]
        ]
    },
    "lisbon-event-tickets": {
        "title": "Lisbon Event Tickets 2026 – Benfica, Sporting & Concerts",
        "description": "Buy tickets for events in Lisbon 2026. Benfica, Sporting CP football and concerts. From €25. Verified sellers, instant QR delivery!",
        "meta_description": "Buy Lisbon event tickets 2026! Benfica from €25, Sporting CP from €25, concerts from €35. Estadio da Luz, Jose Alvalade. Verified sellers, instant QR delivery!",
        "event_name": "Lisbon Events",
        "city": "Lisbon",
        "country": "Portugal",
        "category": "city",
        "price_low": 25,
        "price_high": 500,
        "content": """## Buy Tickets for Events in Lisbon 2026

Lisbon is Portugal's vibrant capital, home to two of Europe's most historic football clubs. The city offers incredible value for sports fans and music lovers alike.

### Top Lisbon Events 2026

| Event | Venue | From |
|-------|-------|------|
| Benfica Liga Portugal | Estadio da Luz | €25 |
| Sporting CP Liga Portugal | Jose Alvalade Stadium | €25 |
| Benfica Champions League | Estadio da Luz | €65 |
| Lisbon Concerts | Altice Arena | €35 |
| Lisbon Derby | Various | €55 |

### Lisbon Football Tickets

Benfica and Sporting CP are two of Portugal's Big Three. Benfica play at the stunning 65,000-seat Estadio da Luz, while Sporting CP's Jose Alvalade Stadium holds 50,000 fans. Liga Portugal tickets from just €25.

### Lisbon Concert Tickets

The Altice Arena (20,000 capacity) is Lisbon's premier concert venue. Major international artists regularly perform in Lisbon, and the city's intimate fado houses offer a unique cultural experience.

### Getting to Lisbon Events

- **Estadio da Luz (Benfica)**: Metro Blue Line (Colegio Militar/Luz)
- **Jose Alvalade (Sporting)**: Metro Green Line (Campo Grande)
- **Altice Arena**: Metro Red Line (Oriente)""",
        "faq": [
            ["How much are Lisbon event tickets?", "Lisbon event tickets start from €25 for Liga Portugal matches. Champions League from €65, concerts at Altice Arena from €35."],
            ["What is the Lisbon Derby?", "The Lisbon Derby between Benfica and Sporting CP is one of Portugal's biggest football rivalries, known for its passionate atmosphere."],
            ["Are Portuguese football tickets cheap?", "Yes! Portuguese football offers incredible value. Liga Portugal tickets from €25, making it one of Europe's most affordable leagues to watch live."],
            ["How do I get to Estadio da Luz?", "Take the Blue Metro Line to Colegio Militar/Luz station. The stadium is a 5-minute walk from the station."]
        ]
    },
    "munich-event-tickets": {
        "title": "Munich Event Tickets 2026 – Bayern Munich, Concerts & Oktoberfest",
        "description": "Buy tickets for events in Munich 2026. Bayern Munich at Allianz Arena, concerts and Oktoberfest. From €39. Verified sellers, instant QR delivery!",
        "meta_description": "Buy Munich event tickets 2026! Bayern Munich from €65, Allianz Arena concerts from €49, Oktoberfest. Verified sellers, instant QR delivery. FanProtect guarantee!",
        "event_name": "Munich Events",
        "city": "Munich",
        "country": "Germany",
        "category": "city",
        "price_low": 39,
        "price_high": 2000,
        "content": """## Buy Tickets for Events in Munich 2026

Munich is Bavaria's crown jewel and one of Germany's most exciting cities for live events. Home to Bayern Munich at the spectacular Allianz Arena, the city also hosts world-class concerts, Oktoberfest, and more.

### Top Munich Events 2026

| Event | Venue | From |
|-------|-------|------|
| Bayern Munich Bundesliga | Allianz Arena | €65 |
| Bayern Champions League | Allianz Arena | €125 |
| Der Klassiker (BVB vs Bayern) | Allianz Arena | €125 |
| Allianz Arena Concerts | Allianz Arena | €49 |
| Olympiahalle Concerts | Olympiahalle | €39 |

### Bayern Munich Tickets

The Allianz Arena is one of football's most iconic stadiums, famous for its illuminated exterior. Watch Bayern Munich in the Bundesliga from €65, Champions League from €125, or the legendary Der Klassiker against Borussia Dortmund from €125.

### Munich Concert Tickets

The Allianz Arena and Olympiahalle host major international artists. The city's vibrant music scene includes classical performances at the famous Gasteig cultural center.

### Oktoberfest & Special Events

Munich's Oktoberfest is the world's largest folk festival, attracting 6 million visitors annually. While entry to the festival grounds is free, special events and reserved tent seating can be booked.

### Getting to Munich Events

- **Allianz Arena**: U-Bahn U6 (Frottmaning station)
- **Olympiahalle**: U-Bahn U3 (Olympiazentrum)
- **Oktoberfest (Theresienwiese)**: U-Bahn U4/U5""",
        "faq": [
            ["How much are Munich event tickets?", "Munich event tickets start from €39 for concerts. Bayern Munich Bundesliga from €65, Champions League from €125, Der Klassiker from €125."],
            ["How do I get to Allianz Arena?", "Take U-Bahn U6 to Frottmaning station. The Allianz Arena is a 10-minute walk from the station, with covered walkways."],
            ["What is Der Klassiker?", "Der Klassiker is Bayern Munich vs Borussia Dortmund – Germany's biggest football rivalry. The atmosphere at Allianz Arena is electric."],
            ["Can tourists buy Bayern Munich tickets?", "Yes! All Bayern Munich tickets on EuroMatchTickets are available to international fans. No membership required."]
        ]
    },
}

updated = 0
for slug, data in CITY_PAGES.items():
    result = db.seo_pages.update_one(
        {"slug": slug},
        {"$set": data},
        upsert=True
    )
    if result.modified_count > 0 or result.upserted_id:
        print(f"Updated: {slug}")
        updated += 1
    else:
        print(f"No change needed: {slug}")

print(f"\nTotal updated: {updated}/{len(CITY_PAGES)}")
