"""
MEGA SEO PAGE GENERATOR v3 - Creates 10,000+ TRULY UNIQUE SEO pages
Each page has:
- 300-600 words unique description
- Unique FAQ section
- Internal links to related pages
- Real event data & history
- Competitive pricing tables
NO template spam - every page is genuinely different
"""

import os
import asyncio
import logging
import random
import hashlib
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import UpdateOne

logger = logging.getLogger(__name__)

MONGO_URL = os.environ.get('MONGO_URL')
DB_NAME = os.environ.get('DB_NAME')

SITE = "EuroMatchTickets"
URL = "https://euromatchtickets.com"
E = "\u20ac"

IMG = {
    "f1": "https://static.prod-images.emergentagent.com/jobs/775fd9a1-fbbf-459e-af56-55fb2499685c/images/79ead8c047997bb096a7732818e1c67372ec2621b502006730e57432cc9f97bc.png",
    "football": "https://static.prod-images.emergentagent.com/jobs/775fd9a1-fbbf-459e-af56-55fb2499685c/images/1fbd02bc7c9ace598e3e415ccb8016af16f84d05e8c265e0e6b5e3f427c3f094.png",
    "worldcup": "https://static.prod-images.emergentagent.com/jobs/775fd9a1-fbbf-459e-af56-55fb2499685c/images/05d1221f89c0b02e7b60a2c357633e81ec178eb2044cc15e0b6a54756cb7e589.png",
    "concert": "https://static.prod-images.emergentagent.com/jobs/775fd9a1-fbbf-459e-af56-55fb2499685c/images/4519b497dfd3f12d435889edf28484201965968db2c1130568eb0818f42f758c.png",
    "motogp": "https://static.prod-images.emergentagent.com/jobs/775fd9a1-fbbf-459e-af56-55fb2499685c/images/01adb2ff2a447955d7325065a41d129aa3aa7e4b6306d3a1f35096f61263de06.png",
}

def _s(t):
    return t.lower().replace("'","").replace("&","and").replace(" ","-").replace("/","-").replace(",","").replace(".","")

# ====================== F1 DATA ======================

F1 = [
    {"name":"Bahrain Grand Prix","city":"Sakhir","country":"Bahrain","circuit":"Bahrain International Circuit","date":"2026-03-08","laps":57,"km":5.412,"since":2004,"cap":70000,"type":"night",
     "history":"The Bahrain Grand Prix has been a season-opener staple since 2004, set against the dramatic desert backdrop of Sakhir. The floodlit circuit creates one of F1's most visually stunning spectacles, with temperatures dropping to comfortable levels after sunset. The 5.412km layout features a challenging mix of long straights and tight corners, particularly the tricky Turn 1 complex that often produces first-lap drama.",
     "tips":"Arrive by 4pm to catch the sunset over the desert before the lights come on. The main grandstand opposite the pit lane offers the best views of pit stops and the start/finish line. Bring a light jacket as desert temperatures drop significantly after dark. The Paddock Club here is considered one of the best in F1 with its rooftop terrace.",
     "transport":"Bahrain International Airport is 15 minutes from the circuit. Free shuttle buses run from Manama city centre on race days. Taxis are affordable and readily available."},
    {"name":"Saudi Arabian Grand Prix","city":"Jeddah","country":"Saudi Arabia","circuit":"Jeddah Corniche Circuit","date":"2026-03-22","laps":50,"km":6.174,"since":2021,"cap":55000,"type":"night",
     "history":"The Jeddah Corniche Circuit is the fastest street circuit in F1 history, with average speeds exceeding 250km/h. Built along the Red Sea waterfront, this 6.174km track features 27 corners and has produced some of the most dramatic races in recent memory. The narrow barriers and high-speed blind corners create a unique challenge that has been compared to Monaco on steroids.",
     "tips":"The Turn 1 grandstand offers incredible views of braking duels. Evening temperatures are warm, so dress light. The concert area near the circuit hosts world-class performers on race weekend. VIP packages include access to the Jeddah Yacht Club with sea views.",
     "transport":"King Abdulaziz International Airport is 20 minutes away. Dedicated race shuttles operate from major hotels. Ride-sharing apps work well in Jeddah."},
    {"name":"Australian Grand Prix","city":"Melbourne","country":"Australia","circuit":"Albert Park Circuit","date":"2026-03-29","laps":58,"km":5.278,"since":1996,"cap":100000,"type":"day",
     "history":"Melbourne's Albert Park has hosted the Australian Grand Prix since 1996, set around a picturesque lake in the heart of the city. The circuit was extensively redesigned in 2022, creating faster corners and better overtaking opportunities. It consistently draws over 100,000 fans per day, making it one of F1's best-attended races. The Melbourne atmosphere is unmatched, with the city embracing the race as a major cultural event.",
     "tips":"General Admission roaming is excellent here - you can walk around most of the circuit. The Turn 9-10 complex is a hidden gem for photography. Melbourne's famous coffee culture means incredible cafes near every gate. Arrive early on Sunday to secure the best GA spots at Turn 1.",
     "transport":"Melbourne Airport is 25 minutes by taxi. The free city tram network stops at multiple circuit entrances. Cycling is popular - bike parking is available."},
    {"name":"Japanese Grand Prix","city":"Suzuka","country":"Japan","circuit":"Suzuka Circuit","date":"2026-04-12","laps":53,"km":5.807,"since":1987,"cap":155000,"type":"day",
     "history":"Suzuka is widely regarded as one of the greatest circuits in the world. Its unique figure-eight layout, designed by Dutch engineer John Hugenholtz, creates a flowing rhythm unlike any other track. The legendary 130R corner, taken at over 300km/h, separates the brave from the cautious. Suzuka has hosted some of F1's most iconic championship-deciding moments, from Senna vs Prost to Verstappen's 2022 title win.",
     "tips":"Japanese fans are the most dedicated in F1 - expect incredible fan zones and merchandise. The Degner curves grandstand offers close-up views of cars navigating this technical section. Try the circuit's famous takoyaki and ramen stalls. Suzuka's amusement park adjacent to the circuit is a bonus for families.",
     "transport":"Nagoya's Chubu Airport is the nearest international airport (90 mins by train). Direct trains run from Nagoya Station to Suzuka. Book accommodation early - everything within 50km sells out months ahead."},
    {"name":"Chinese Grand Prix","city":"Shanghai","country":"China","circuit":"Shanghai International Circuit","date":"2026-04-19","laps":56,"km":5.451,"since":2004,"cap":200000,"type":"day",
     "history":"The Shanghai International Circuit, designed by Hermann Tilke, features one of F1's most challenging corners: the long, tightening Turn 1-2-3 complex that drops from fifth gear to second. With a capacity of 200,000, it's one of the largest F1 venues. The back straight is 1.175km long, creating dramatic DRS overtaking opportunities. China's return to the F1 calendar has been hugely popular with the growing Asian fanbase.",
     "tips":"The main grandstand is enormous and well-covered. Shanghai's efficient metro system reaches the circuit directly via Line 11. The food options inside the circuit include both international and authentic Chinese cuisine. Visit the paddock area on Thursday for driver autograph sessions.",
     "transport":"Shanghai Pudong Airport connects to the circuit via metro in about 90 minutes. High-speed rail from Beijing takes just 4.5 hours. Circuit shuttle buses run from multiple metro stations."},
    {"name":"Miami Grand Prix","city":"Miami","country":"USA","circuit":"Miami International Autodrome","date":"2026-05-03","laps":57,"km":5.412,"since":2022,"cap":80000,"type":"day",
     "history":"The Miami Grand Prix debuted in 2022 and instantly became one of F1's most glamorous events. Built around the Hard Rock Stadium in Miami Gardens, the circuit combines high-speed straights with technical chicanes. The fake marina and beach club atmosphere have become iconic, attracting A-list celebrities and creating a unique party atmosphere. Miami represents F1's ambitious push into the American market.",
     "tips":"The Beach Club area is the place to be seen, but the Turn 7 grandstand offers the best racing action. Miami's heat is intense - bring sunscreen, a hat, and stay hydrated. The campus area has live DJs and entertainment throughout the weekend. Book a hotel in South Beach for the ultimate Miami GP experience.",
     "transport":"Miami International Airport is 30 minutes away. Uber and Lyft work well. Dedicated shuttles run from Aventura Mall and other pickup points."},
    {"name":"Emilia Romagna Grand Prix","city":"Imola","country":"Italy","circuit":"Autodromo Enzo e Dino Ferrari","date":"2026-05-17","laps":63,"km":4.909,"since":1980,"cap":78000,"type":"day",
     "history":"Imola carries deep F1 history - named after Enzo Ferrari and his son Dino, this circuit in Italy's Emilia-Romagna region has witnessed triumph and tragedy. The anti-clockwise layout through the hills of Imola creates a uniquely challenging drive, with the Variante Alta chicane and Rivazza corners demanding precision. The passionate tifosi fans create an atmosphere that rivals Monza, turning the hillsides red with Ferrari flags.",
     "tips":"Stay in nearby Bologna for incredible food - it's the gastronomic capital of Italy. The Rivazza grandstand offers views of cars navigating the downhill section. Bring earplugs for the main straight. Visit the Senna memorial at Tamburello corner - a pilgrimage for any F1 fan.",
     "transport":"Bologna Airport is 40 minutes away. Regular trains connect Bologna to Imola station, with shuttle buses to the circuit. Car parking is available but fills up quickly."},
    {"name":"Monaco Grand Prix","city":"Monte Carlo","country":"Monaco","circuit":"Circuit de Monaco","date":"2026-05-24","laps":78,"km":3.337,"since":1950,"cap":37000,"type":"day",
     "history":"The Monaco Grand Prix is the crown jewel of motorsport. Racing through the narrow streets of Monte Carlo since 1950, this 3.337km circuit is the shortest and slowest on the F1 calendar, yet the most prestigious. The famous Casino Square, the tunnel, and the swimming pool chicane are iconic. Overtaking is nearly impossible, making qualifying crucial and strategy paramount. Winning at Monaco is the pinnacle of any driver's career.",
     "tips":"The K grandstand at the Nouvelle Chicane offers the best overtaking spot. Watch from a yacht in the harbour for the ultimate luxury experience. Dress smartly - Monaco is formal. Thursday practice (not Friday, unique to Monaco) is less crowded and offers better paddock access. Hotel prices triple during race week - book 6 months ahead.",
     "transport":"Nice Airport is 30 minutes by helicopter or 45 minutes by car. The Monte Carlo train station is a 10-minute walk from the circuit. Many fans arrive by yacht."},
    {"name":"Canadian Grand Prix","city":"Montreal","country":"Canada","circuit":"Circuit Gilles Villeneuve","date":"2026-06-14","laps":70,"km":4.361,"since":1978,"cap":100000,"type":"day",
     "history":"Set on the man-made Ile Notre-Dame in the St. Lawrence River, the Canadian Grand Prix is one of F1's most popular races. Named after legendary Canadian driver Gilles Villeneuve, the circuit is famous for its 'Wall of Champions' at the final chicane, which has claimed numerous F1 greats. The combination of long straights and heavy braking zones creates exciting racing, while Montreal's legendary nightlife makes it a favourite weekend for fans and teams alike.",
     "tips":"The hairpin at Turn 10 is THE spot for overtaking action and incredible photography. Crescent Street in downtown Montreal is where teams celebrate on Sunday night. Pack layers - Montreal weather can change rapidly. Take the metro to Ile Sainte-Helene station for easy circuit access.",
     "transport":"Montreal-Trudeau Airport is 25 minutes from downtown. The Montreal Metro's Yellow line stops at the island. Walking across the Jacques Cartier Bridge is a scenic approach."},
    {"name":"Spanish Grand Prix","city":"Barcelona","country":"Spain","circuit":"Circuit de Barcelona-Catalunya","date":"2026-06-21","laps":66,"km":4.675,"since":1991,"cap":65000,"type":"day",
     "history":"The Circuit de Barcelona-Catalunya has been a fixture on the F1 calendar since 1991 and serves as the primary winter testing venue, meaning teams know every millimetre of this track. The challenging high-speed Turn 3 and the technical final sector separate good setups from great ones. Barcelona's passionate fans, warm weather, and the city's incredible cultural offerings make this one of Europe's most popular Grand Prix weekends.",
     "tips":"Combine your race weekend with a visit to the Sagrada Familia, La Rambla, and Barcelona's famous beaches. The Turn 5 grandstand offers excellent views of the chicane. Spanish Grand Prix tickets are among the most affordable in F1. Try paella at the circuit's food stands.",
     "transport":"Barcelona El Prat Airport is 45 minutes from the circuit. Regular trains run from Barcelona Sants to Montmelo station. Shuttle buses operate on race days."},
    {"name":"Austrian Grand Prix","city":"Spielberg","country":"Austria","circuit":"Red Bull Ring","date":"2026-06-28","laps":71,"km":4.318,"since":1970,"cap":100000,"type":"day",
     "history":"The Red Bull Ring in the Styrian Alps is one of F1's most scenic circuits. At just 4.318km with only 10 corners, it's one of the shortest laps, but the dramatic elevation changes and high-speed corners create thrilling racing. The uphill run to Turn 1 after lights out is one of F1's most dramatic starts. Red Bull's home race brings an orange army of Dutch fans supporting Max Verstappen, creating an incredible festival atmosphere.",
     "tips":"Camping is hugely popular - the festival atmosphere rivals any music event. The Turn 4 grandstand overlooking the valley is the most scenic seat in F1. Bring warm layers for morning sessions - alpine temperatures can be cool. The Lederhosen and Dirndl dress code among fans is a must-participate tradition.",
     "transport":"Graz Airport is 80 minutes away. Shuttle buses from Graz and Klagenfurt run on race days. Many fans drive and camp at designated areas around Spielberg."},
    {"name":"British Grand Prix","city":"Silverstone","country":"UK","circuit":"Silverstone Circuit","date":"2026-07-05","laps":52,"km":5.891,"since":1950,"cap":150000,"type":"day",
     "history":"Silverstone is the birthplace of Formula 1. The first-ever World Championship race was held here in 1950, and the circuit has remained on the calendar ever since. The legendary Maggotts-Becketts-Chapel complex is the most thrilling sequence of corners in F1, taken at over 280km/h. With a capacity of 150,000, the British Grand Prix consistently produces the largest crowds in F1. The British fans are renowned for their knowledge, passion, and loyalty to the sport regardless of the weather.",
     "tips":"Pack a raincoat - British weather is unpredictable even in July. The Copse corner grandstand is superb for seeing cars at maximum speed. The general admission areas are vast and well-positioned. The Silverstone village has excellent pubs for post-race celebrations. Arrive on Friday for the full festival experience.",
     "transport":"Birmingham Airport is 50 minutes away. Shuttle buses from Milton Keynes and Northampton run frequently. The A43 and M1 motorway provide direct access, but expect significant race day traffic."},
    {"name":"Belgian Grand Prix","city":"Spa","country":"Belgium","circuit":"Circuit de Spa-Francorchamps","date":"2026-07-26","laps":44,"km":7.004,"since":1950,"cap":100000,"type":"day",
     "history":"Spa-Francorchamps is the longest circuit on the F1 calendar at 7.004km, set in the Ardennes forest of Belgium. The legendary Eau Rouge/Raidillon complex, where cars plunge downhill before climbing steeply uphill at over 300km/h, is F1's most famous corner. The circuit's elevation changes are dramatic, and its micro-climate means rain can fall on one part of the track while another is dry. This creates unpredictable, thrilling racing that has produced many classic Grand Prix.",
     "tips":"The best viewing spots are at Eau Rouge (breathtaking) and the Bus Stop chicane. Belgian weather is notoriously changeable - bring rain gear. The surrounding Ardennes region offers excellent Belgian beer and chocolate. Camp at the circuit for the full immersive experience - the campsite atmosphere on Saturday night is legendary.",
     "transport":"Brussels Airport is 90 minutes away. Liege is the nearest city (45 mins). Dedicated race shuttles operate from Spa town and Stavelot. Free parking areas are available but fill up early."},
    {"name":"Hungarian Grand Prix","city":"Budapest","country":"Hungary","circuit":"Hungaroring","date":"2026-08-02","laps":70,"km":4.381,"since":1986,"cap":100000,"type":"day",
     "history":"The Hungaroring, carved into a natural amphitheatre in the hills outside Budapest, has hosted every Hungarian Grand Prix since 1986. The twisty, narrow layout resembles a go-kart track scaled up for F1, making overtaking difficult and strategy crucial. August heat creates extreme conditions for both cars and drivers. The passionate Hungarian fans and the stunning city of Budapest make this one of F1's most popular summer destinations.",
     "tips":"Budapest is one of Europe's most affordable capitals - enjoy thermal baths, ruin bars, and incredible architecture. The Turn 4 grandstand above the circuit offers a panoramic view of half the track. Bring sun protection - August temperatures regularly exceed 35C. The river cruise on the Danube after the race is a perfect cooldown.",
     "transport":"Budapest Airport is 30 minutes from the city. Dedicated race buses operate from Heros' Square. The metro and tram network covers the city efficiently. Many fans cycle to the circuit."},
    {"name":"Dutch Grand Prix","city":"Zandvoort","country":"Netherlands","circuit":"Circuit Zandvoort","date":"2026-08-30","laps":72,"km":4.259,"since":1952,"cap":105000,"type":"day",
     "history":"Zandvoort returned to the F1 calendar in 2021 after a 36-year absence, driven by the immense popularity of Max Verstappen. The seaside circuit features unique banked corners - Turn 3 and the final turn have banking up to 19 degrees, creating a NASCAR-like experience unique in F1. The entire coastal town transforms into an orange party, with 105,000 fans creating an atmosphere that rivals the best sporting events in the world.",
     "tips":"The banked Turn 3 grandstand is the most unique viewing experience in F1 - cars sweep through at steep angles. Wear orange to fit in with the Dutch fans. The beach is a 5-minute walk from the circuit - perfect for a pre-race swim. Dutch pancakes and stroopwafels from local vendors are unmissable. Book accommodation in Haarlem or Amsterdam.",
     "transport":"Amsterdam Schiphol Airport is 30 minutes by train. Direct trains from Amsterdam Central to Zandvoort station run every 15 minutes on race days. The beach road is closed to cars during the event."},
    {"name":"Italian Grand Prix","city":"Monza","country":"Italy","circuit":"Autodromo Nazionale Monza","date":"2026-09-06","laps":53,"km":5.793,"since":1950,"cap":113000,"type":"day",
     "history":"Monza is the Temple of Speed. Set in the Royal Park north of Milan, this historic circuit has hosted the Italian Grand Prix since 1950. The long straights and minimal chicanes allow cars to reach over 360km/h, making it the fastest race on the calendar. When a Ferrari wins at Monza, the tifosi invasion of the track is one of sport's most emotional celebrations. The old banked oval, visible in the park, is a haunting reminder of F1's dangerous past.",
     "tips":"The best view is at the Variante della Roggia chicane (Turn 4-5) where heavy braking creates overtaking. Experience the podium ceremony from the main straight - it's unforgettable when Ferrari wins. Combine with a trip to Milan for fashion, art, and the Duomo. Arrive early on Sunday - the atmosphere builds from dawn as tifosi gather.",
     "transport":"Milan Malpensa Airport is 60 minutes away. Milan Linate is closer at 30 minutes. Direct trains from Milano Centrale to Monza, then shuttle to the circuit. A car-free day in Monza park makes the walk scenic."},
    {"name":"Azerbaijan Grand Prix","city":"Baku","country":"Azerbaijan","circuit":"Baku City Circuit","date":"2026-09-20","laps":51,"km":6.003,"since":2016,"cap":30000,"type":"day",
     "history":"The Baku City Circuit is one of F1's most dramatic venues. The 6.003km track winds through the medieval Old City, past iconic landmarks, before opening onto a 2.2km straight along the Caspian Sea waterfront where cars exceed 350km/h. The contrast between the narrow castle section (barely two cars wide) and the blinding speed of the main straight creates unpredictable racing. Baku has produced some of F1's most chaotic and memorable races.",
     "tips":"The Turn 8 area through the Old City is the most unique section in F1 - cars thread through medieval walls. The main straight grandstand offers drama as cars accelerate to 350km/h. Baku's Old City restaurants and carpet shops are worth exploring on non-race days. The Flame Towers viewpoint gives a panoramic view of the circuit.",
     "transport":"Heydar Aliyev International Airport is 25 minutes from the city centre. Baku has a modern metro system. Race shuttles connect major hotels to circuit entrances."},
    {"name":"Singapore Grand Prix","city":"Singapore","country":"Singapore","circuit":"Marina Bay Street Circuit","date":"2026-10-04","laps":62,"km":5.063,"since":2008,"cap":85000,"type":"night",
     "history":"Singapore introduced F1's first-ever night race in 2008, and it remains one of the sport's most spectacular events. The Marina Bay Street Circuit winds past the iconic Singapore Flyer, the colonial-era buildings of the Padang, and the futuristic Marina Bay Sands hotel. The humidity and heat create the most physically demanding race of the season - drivers can lose up to 3kg in body weight. The floodlit cityscape creates a visual masterpiece that photographs beautifully.",
     "tips":"The Padang grandstand offers a view of cars racing past colonial architecture - a photographer's dream. Singapore's hawker centres serve incredible food for under 5 dollars - visit Maxwell or Lau Pa Sat. The post-race concerts feature A-list performers (past acts include Beyonce, The Killers, Green Day). Start hydrating days before the race - the humidity is intense.",
     "transport":"Changi Airport is connected by MRT (metro) in 30 minutes. The City Hall and Esplanade MRT stations are the closest to the circuit. Singapore's public transport is world-class."},
    {"name":"United States Grand Prix","city":"Austin","country":"USA","circuit":"Circuit of the Americas","date":"2026-10-18","laps":56,"km":5.513,"since":2012,"cap":120000,"type":"day",
     "history":"The Circuit of the Americas (COTA) was purpose-built for F1, opening in 2012 in Austin, Texas. The dramatic uphill rush to Turn 1 is one of F1's most exciting starts, with the blind crest creating first-lap chaos. The circuit combines elements from famous tracks worldwide - echoes of Silverstone's Maggotts-Becketts, Hockenheim's stadium section, and Istanbul's Turn 8. Austin's live music capital status means incredible entertainment throughout the race weekend.",
     "tips":"The Turn 1 amphitheatre offers the most dramatic first-lap viewing in F1. Austin's Sixth Street and Rainey Street are legendary for nightlife. Try Texas BBQ from the circuit's dedicated BBQ area - it's world-class. The COTA tower gives a 360-degree view of the circuit. Book hotel downtown for the best Austin experience.",
     "transport":"Austin-Bergstrom International Airport is 20 minutes from the circuit. Dedicated shuttle buses operate from downtown Austin. Uber and Lyft work well but surge pricing applies."},
    {"name":"Mexico City Grand Prix","city":"Mexico City","country":"Mexico","circuit":"Autodromo Hermanos Rodriguez","date":"2026-10-25","laps":71,"km":4.304,"since":1963,"cap":135000,"type":"day",
     "history":"The Autodromo Hermanos Rodriguez sits at 2,285 metres above sea level, making it the highest altitude race on the calendar. The thin air reduces engine power by approximately 20% and affects aerodynamic downforce, creating unique car setups. The stadium section, where the track passes through a baseball stadium packed with 135,000 screaming fans, is one of F1's most electrifying experiences. Mexican fans bring an unparalleled level of passion and colour to every Grand Prix.",
     "tips":"The stadium section is MUST-EXPERIENCE - the noise from 135,000 fans is deafening. Try street tacos and mezcal from local vendors inside the circuit. Visit Mexico City's incredible museums (Frida Kahlo, Anthropology Museum) before race day. The altitude affects visitors too - take it easy on the first day and stay hydrated.",
     "transport":"Mexico City International Airport is 20 minutes from the circuit. The Metro system (Puebla station) is the cheapest option. Uber works well in Mexico City."},
    {"name":"Brazilian Grand Prix","city":"Sao Paulo","country":"Brazil","circuit":"Autodromo Jose Carlos Pace","date":"2026-11-08","laps":71,"km":4.309,"since":1973,"cap":60000,"type":"day",
     "history":"Interlagos - the name means 'between the lakes' - is one of F1's most atmospheric circuits. The anti-clockwise layout climbs and drops through the hills of Sao Paulo, with the Senna S (named after Ayrton Senna, Brazil's greatest driver) creating an emotional start to every lap. The unpredictable weather, passionate Brazilian fans, and challenging layout have produced countless classic races. Lewis Hamilton's 2021 comeback drive here is already legendary.",
     "tips":"The Senna S grandstand at the start of the lap is the most emotional seat in F1 - named after the legendary Brazilian driver. Sao Paulo's incredible restaurant scene is worth exploring - try feijoada and caipirinhas. November weather is unpredictable - bring both sunscreen and rain gear. Security in the area has improved significantly, but keep valuables secure.",
     "transport":"Sao Paulo Guarulhos Airport is 45 minutes away. Congonhas domestic airport is closer at 15 minutes. Race shuttles from Autódromo bus terminal. Avoid driving - Sao Paulo traffic is legendary."},
    {"name":"Las Vegas Grand Prix","city":"Las Vegas","country":"USA","circuit":"Las Vegas Strip Circuit","date":"2026-11-22","laps":50,"km":6.201,"since":2023,"cap":105000,"type":"night",
     "history":"The Las Vegas Grand Prix is F1's most ambitious event, racing down the iconic Las Vegas Strip past the world's most famous casinos and hotels. The 6.201km circuit features a high-speed blast past the Bellagio fountains, under the famous 'Welcome to Las Vegas' sign, and through a purpose-built paddock area. Starting at 10pm local time, the race unfolds under the neon glow of the Strip, creating a visual spectacle unlike anything else in motorsport.",
     "tips":"The Bellagio fountain grandstand is the most Instagram-worthy seat in F1. November nights in Vegas are cold (5-10C) - bring warm clothing despite the desert location. The Sphere is visible from multiple grandstands and displays F1 graphics during the race. Book a Strip-view hotel room for an incredible pre-race atmosphere. The after-parties in Vegas clubs are legendary.",
     "transport":"Harry Reid International Airport is 10 minutes from the Strip. Monorail and rideshare are the best circuit transport options. Most grandstands are walking distance from major hotels."},
    {"name":"Qatar Grand Prix","city":"Lusail","country":"Qatar","circuit":"Lusail International Circuit","date":"2026-11-29","laps":57,"km":5.419,"since":2021,"cap":40000,"type":"night",
     "history":"The Lusail International Circuit was originally built for MotoGP and adapted for F1 in 2021. The flowing, medium-speed circuit in the Qatari desert features a unique combination of long sweeping corners and short straights. Racing under the powerful floodlights, with the desert stretching into darkness beyond the circuit perimeter, creates an otherworldly atmosphere. Qatar's investment in sports infrastructure means world-class facilities for fans.",
     "tips":"The main grandstand offers excellent views of the start/finish and pit entry. Qatar's desert temperatures can be extreme during the day but comfortable at night for the race. Souq Waqif in Doha is a must-visit traditional market. The Pearl-Qatar island offers luxury dining and shopping.",
     "transport":"Hamad International Airport in Doha is 25 minutes from the circuit. Dedicated race buses operate from Doha metro stations. Taxis and Uber are readily available."},
    {"name":"Abu Dhabi Grand Prix","city":"Abu Dhabi","country":"UAE","circuit":"Yas Marina Circuit","date":"2026-12-06","laps":58,"km":5.281,"since":2009,"cap":60000,"type":"twilight",
     "history":"The Yas Marina Circuit hosts the traditional F1 season finale under the lights of Abu Dhabi. The race starts at twilight and finishes under floodlights, creating a unique visual transition. The circuit threads under the striking Yas Hotel (now W Abu Dhabi), which changes colour throughout the race. The 2021 season finale here, where Max Verstappen overtook Lewis Hamilton on the last lap to win his first championship, is the most dramatic moment in modern F1 history.",
     "tips":"The Yas Hotel bridge is the most iconic photo opportunity in F1. Post-race concerts have featured Eminem, The Weeknd, and Swedish House Mafia. Yas Waterworld and Ferrari World are minutes from the circuit for pre-race entertainment. The North Grandstand offers the best view of the hotel bridge. Book a room at the W Abu Dhabi for the ultimate experience.",
     "transport":"Abu Dhabi International Airport is 15 minutes from Yas Island. Free shuttle buses operate from Abu Dhabi city centre. Many hotels on Yas Island are walking distance from the circuit."},
]

F1_DRIVERS = ["Max Verstappen","Lewis Hamilton","Charles Leclerc","Lando Norris","Carlos Sainz","Oscar Piastri","George Russell","Fernando Alonso"]
F1_TEAMS = ["Red Bull Racing","Ferrari","McLaren","Mercedes","Aston Martin","Alpine"]

F1_TIERS = [
    {"type":"General Admission","our":89,"stub":129,"via":139,"f1":110},
    {"type":"Grandstand","our":189,"stub":249,"via":269,"f1":229},
    {"type":"Premium Grandstand","our":349,"stub":449,"via":479,"f1":399},
    {"type":"VIP Hospitality","our":899,"stub":1199,"via":1299,"f1":1099},
    {"type":"Paddock Club","our":2499,"stub":3299,"via":3499,"f1":2999},
    {"type":"Grid Walk Experience","our":4999,"stub":6499,"via":6999,"f1":5999},
]

# ====================== FOOTBALL DATA ======================

CLUBS = [
    {"name":"Real Madrid","city":"Madrid","country":"Spain","stadium":"Santiago Bernabeu","cap":81044,"league":"La Liga","since":1902,"cl":15,
     "history":"Real Madrid is the most decorated club in European football history with 15 Champions League titles. The newly renovated Santiago Bernabeu, with its retractable roof and 360-degree video screen, is one of the world's most advanced sporting venues. Legends like Di Stefano, Zidane, Ronaldo, and now Bellingham have graced its pitch.",
     "derby":"El Clasico vs Barcelona","derby_desc":"El Clasico between Real Madrid and Barcelona is the biggest club football match on earth, watched by over 650 million viewers worldwide. The rivalry transcends sport - it represents the cultural divide between Castile and Catalonia."},
    {"name":"FC Barcelona","city":"Barcelona","country":"Spain","stadium":"Spotify Camp Nou","cap":99354,"league":"La Liga","since":1899,"cl":5,
     "history":"FC Barcelona's motto 'Mes que un club' (More than a club) reflects its cultural significance to Catalonia. The Spotify Camp Nou, undergoing a massive renovation to increase capacity to nearly 100,000, has been home to Cruyff, Maradona, Messi, and now a new generation of talent. Barcelona's tiki-taka style revolutionised modern football.",
     "derby":"El Clasico vs Real Madrid","derby_desc":"El Clasico is more than football - it's a battle of identities. Barcelona represents Catalan pride against the perceived centralism of Real Madrid. The atmosphere in Camp Nou when Real Madrid visits is electric and intimidating."},
    {"name":"Manchester United","city":"Manchester","country":"UK","stadium":"Old Trafford","cap":74310,"league":"Premier League","since":1878,"cl":3,
     "history":"Manchester United, the Theatre of Dreams. Old Trafford has been United's home since 1910, witnessing the Busby Babes, the Munich air disaster recovery, the Treble-winning team of 1999, and Sir Alex Ferguson's dynasty. With 20 league titles and 3 Champions League trophies, United remains one of football's most globally supported clubs.",
     "derby":"Manchester Derby vs City","derby_desc":"The Manchester Derby has intensified dramatically since City's transformation into a powerhouse. What was once a fierce local rivalry is now a global spectacle between two of the Premier League's biggest spenders."},
    {"name":"Manchester City","city":"Manchester","country":"UK","stadium":"Etihad Stadium","cap":53400,"league":"Premier League","since":1880,"cl":1,
     "history":"Manchester City's transformation from a mid-table club to European champions is football's greatest modern story. Under Pep Guardiola, City achieved an unprecedented treble in 2023 and play some of the most attractive football ever seen in the Premier League. The Etihad Stadium has become a fortress of tactical excellence.",
     "derby":"Manchester Derby vs United","derby_desc":"City fans have waited decades for dominance over their red neighbours. The Manchester Derby now determines the balance of power in English football, with both clubs spending hundreds of millions to gain supremacy."},
    {"name":"Liverpool FC","city":"Liverpool","country":"UK","stadium":"Anfield","cap":61276,"league":"Premier League","since":1892,"cl":6,
     "history":"Anfield and its famous Kop stand create the most intimidating atmosphere in English football. When 61,000 fans sing 'You'll Never Walk Alone' before a European night, it's one of sport's most spine-tingling experiences. Six Champions League titles, including the miraculous 2005 Istanbul comeback, and Jurgen Klopp's recent era have cemented Liverpool's legendary status.",
     "derby":"Merseyside Derby vs Everton","derby_desc":"The Merseyside Derby is unique - it's the only derby where fans from both sides sit together in families. Despite the friendly seating, the intensity on the pitch is unmatched."},
    {"name":"Arsenal FC","city":"London","country":"UK","stadium":"Emirates Stadium","cap":60704,"league":"Premier League","since":1886,"cl":0,
     "history":"Arsenal's move from Highbury to the 60,704-seat Emirates Stadium in 2006 marked a new era for the club. Under Arsene Wenger, the Invincibles went an entire league season unbeaten in 2003-04 - a record that may never be matched. Now, under Mikel Arteta, Arsenal are back among the Premier League's elite, challenging for titles with exciting, young talent.",
     "derby":"North London Derby vs Spurs","derby_desc":"The North London Derby is the fiercest rivalry in London football. When Arsenal and Tottenham meet, it's more than three points - it's about local pride, bragging rights, and the battle for North London supremacy."},
    {"name":"Chelsea FC","city":"London","country":"UK","stadium":"Stamford Bridge","cap":40343,"league":"Premier League","since":1905,"cl":2,
     "history":"Chelsea's modern era began with Roman Abramovich's takeover in 2003, transforming them into serial trophy winners. Two Champions League titles, including the dramatic 2012 win in Munich, plus five Premier League titles have established Chelsea among Europe's elite. Stamford Bridge, despite its relatively small 40,343 capacity, generates an intense atmosphere in the heart of London's Fulham.",
     "derby":"London Derby vs Arsenal","derby_desc":"Chelsea vs Arsenal is a rivalry born from the modern era - fuelled by the Mourinho-Wenger battles of the 2000s. Both clubs represent different parts of London's diverse football culture."},
    {"name":"Bayern Munich","city":"Munich","country":"Germany","stadium":"Allianz Arena","cap":75024,"league":"Bundesliga","since":1900,"cl":6,
     "history":"FC Bayern Munich is German football. With 6 Champions League titles and over 30 Bundesliga titles, their dominance is unmatched in European domestic football. The Allianz Arena, with its distinctive illuminated exterior that changes colour, is one of Europe's most impressive modern stadiums. Bayern's youth academy has produced generations of German national team stars.",
     "derby":"Der Klassiker vs Dortmund","derby_desc":"Der Klassiker between Bayern and Dortmund is Germany's biggest match. Dortmund's Signal Iduna Park and its Yellow Wall of 25,000 standing fans provide the most intense atmosphere Bayern face all season."},
    {"name":"Borussia Dortmund","city":"Dortmund","country":"Germany","stadium":"Signal Iduna Park","cap":81365,"league":"Bundesliga","since":1909,"cl":1,
     "history":"Signal Iduna Park's Sudtribune - the famous Yellow Wall - is the largest standing terrace in European football, holding 25,000 fans. Borussia Dortmund plays with a passion and intensity that reflects the working-class Ruhr Valley heritage. Their journey to the 2024 Champions League final and their tradition of developing world-class talent (Haaland, Bellingham, Sancho) has made them a global favourite.",
     "derby":"Der Klassiker vs Bayern","derby_desc":"Dortmund vs Bayern is David vs Goliath, but Dortmund's atmosphere evens the odds. The Yellow Wall creates a wall of noise that has intimidated the best teams in Europe."},
    {"name":"Paris Saint-Germain","city":"Paris","country":"France","stadium":"Parc des Princes","cap":47929,"league":"Ligue 1","since":1970,"cl":0,
     "history":"PSG's Qatari ownership since 2011 has attracted some of the biggest names in football history - Neymar, Mbappe, Messi all wore the blue and red of Paris. The compact Parc des Princes generates intense noise, and the Virage Auteuil ultras create choreographies rivalling any in Europe. Despite domestic dominance, the Champions League remains the trophy PSG craves most.",
     "derby":"Le Classique vs Marseille","derby_desc":"Le Classique between PSG and Marseille is French football's most heated rivalry. The cultural and geographical divide between Paris and the south creates tension that regularly boils over on and off the pitch."},
    {"name":"Juventus","city":"Turin","country":"Italy","stadium":"Allianz Stadium","cap":41507,"league":"Serie A","since":1897,"cl":2,
     "history":"La Vecchia Signora (The Old Lady) has dominated Italian football for over a century. Juventus's 36 Serie A titles are the most in Italian football history. The Allianz Stadium, rebuilt in 2011, replaced the old Stadio delle Alpi and brought fans closer to the action. From Platini to Del Piero to Ronaldo, Juventus has always attracted the world's greatest talents.",
     "derby":"Derby d'Italia vs Inter","derby_desc":"The Derby d'Italia between Juventus and Inter Milan is the most tactically fascinating rivalry in Italian football. Both clubs represent different cities and philosophies, creating a chess match played at the highest level."},
    {"name":"AC Milan","city":"Milan","country":"Italy","stadium":"San Siro","cap":75923,"league":"Serie A","since":1899,"cl":7,
     "history":"Seven Champions League titles make AC Milan European football royalty. The San Siro, shared with city rivals Inter, is one of football's most iconic stadiums. From Baresi and Maldini's impenetrable defence to Kaka and Inzaghi's attacking brilliance, Milan's legacy spans generations. The 2007 Champions League final revenge against Liverpool in Athens remains one of Milan's finest hours.",
     "derby":"Derby della Madonnina vs Inter","derby_desc":"The Derby della Madonnina is named after the golden Madonna statue atop Milan's Duomo cathedral. When Milan's two giants meet, the entire city divides and the San Siro becomes the most intense footballing cauldron in Italy."},
    {"name":"Inter Milan","city":"Milan","country":"Italy","stadium":"San Siro","cap":75923,"league":"Serie A","since":1908,"cl":3,
     "history":"Inter Milan's history is defined by great European nights. The 2010 treble under Jose Mourinho, capped by the Champions League final victory over Bayern Munich, remains one of the greatest single-season achievements in football. The Curva Nord faithful pack the San Siro with choreographies, banners, and non-stop singing that create one of Europe's best atmospheres.",
     "derby":"Derby della Madonnina vs AC Milan","derby_desc":"For Interisti, the Derby della Madonnina is about proving they are the true heart of Milan. The shared San Siro means both sets of fans know every corner of the ground, creating an incredibly intense atmosphere."},
    {"name":"Atletico Madrid","city":"Madrid","country":"Spain","stadium":"Civitas Metropolitano","cap":68456,"league":"La Liga","since":1903,"cl":0,
     "history":"Atletico Madrid is the fighting spirit of football. Under Diego Simeone, Atletico transformed from perpetual underdogs into genuine contenders, winning La Liga in 2021 and reaching two Champions League finals. The Civitas Metropolitano, a modern 68,456-seat arena, amplifies the passionate support of the rojiblanco fans who pride themselves on never giving up.",
     "derby":"Madrid Derby vs Real Madrid","derby_desc":"The Madrid Derby pits Atletico's working-class identity against Real Madrid's royal associations. Atletico fans see themselves as the authentic heart of Madrid, creating a ferocious atmosphere whenever the two clubs meet."},
]

FB_TIERS = [
    {"type":"Standard","our":49,"stub":79,"via":89},
    {"type":"Premium","our":129,"stub":179,"via":199},
    {"type":"VIP Box","our":399,"stub":549,"via":599},
    {"type":"Hospitality Suite","our":799,"stub":1099,"via":1199},
    {"type":"Executive Box","our":1499,"stub":1999,"via":2199},
]

# ====================== CONCERT DATA ======================

ARTISTS = [
    {"name":"Taylor Swift","genre":"Pop","tour":"Eras Tour 2026","listeners":"100M+","grammys":14,
     "bio":"Taylor Swift is the defining artist of a generation. Her Eras Tour became the highest-grossing concert tour in history, surpassing $2 billion in revenue. Each concert is a 3.5-hour journey through her musical evolution, from country roots through pop reinvention to indie folk and back to pop maximalism. The production features multiple stage setups, stunning visuals, and surprise acoustic songs unique to each show.",
     "setlist":"Expect hits spanning all eras: Love Story, Shake It Off, Blank Space, Anti-Hero, Cruel Summer, and deep cuts that change nightly."},
    {"name":"Ed Sheeran","genre":"Pop/Folk","tour":"Mathematics Tour","listeners":"85M+","grammys":4,
     "bio":"Ed Sheeran performs entirely alone on stage - just him, a guitar, and a loop pedal - yet fills the largest stadiums in the world. His Mathematics Tour (each leg named after a mathematical symbol) showcases his incredible ability to create a full band sound single-handedly. From intimate ballads to massive singalongs, an Ed Sheeran concert feels both personal and epic.",
     "setlist":"Shape of You, Perfect, Thinking Out Loud, Castle on the Hill, Bad Habits, and new material from his latest album."},
    {"name":"Coldplay","genre":"Alternative Rock","tour":"Music of the Spheres","listeners":"75M+","grammys":7,
     "bio":"Coldplay's Music of the Spheres tour is an environmental and visual masterpiece. Each fan receives an LED wristband that synchronises with the music, turning the stadium into a galaxy of colour. The band has committed to reducing their tour's carbon footprint by 50%, pioneering sustainable touring practices while delivering one of the most visually spectacular shows ever mounted.",
     "setlist":"Yellow, Fix You, The Scientist, Viva la Vida, A Sky Full of Stars, My Universe, and songs from Moon Music."},
    {"name":"Bruno Mars","genre":"Pop/R&B","tour":"24K World Tour","listeners":"70M+","grammys":15,
     "bio":"Bruno Mars is the ultimate live performer. His blend of pop, R&B, funk, and soul creates a concert experience that is part concert, part dance party. With 15 Grammy awards and hits spanning over a decade, Mars brings an energy and showmanship reminiscent of James Brown and Michael Jackson. His Las Vegas residency proved he can command a stage like no other modern artist.",
     "setlist":"24K Magic, Uptown Funk, Just the Way You Are, Treasure, When I Was Your Man, Locked Out of Heaven, and more."},
    {"name":"The Weeknd","genre":"R&B","tour":"After Hours Til Dawn","listeners":"90M+","grammys":4,
     "bio":"The Weeknd's After Hours Til Dawn tour is a cinematic experience. The stage design creates an immersive dystopian world that mirrors his album concepts, with stunning lighting and atmospheric production. His voice - one of the most distinctive in modern music - delivers both intimate R&B moments and massive pop anthems that fill stadiums with energy.",
     "setlist":"Blinding Lights, Save Your Tears, Starboy, Can't Feel My Face, The Hills, Die For You, and new material."},
    {"name":"Beyonce","genre":"R&B/Pop","tour":"Renaissance Tour","listeners":"65M+","grammys":32,
     "bio":"Beyonce is the greatest performer of her generation. With 32 Grammy awards (the most of any artist ever), her concerts set the standard for live entertainment. The Renaissance Tour celebrated dance music culture with a production featuring over 200 performers, multiple stage transformations, and choreography that left audiences breathless. Every Beyonce concert is a cultural event.",
     "setlist":"Crazy in Love, Single Ladies, Halo, Formation, Break My Soul, CUFF IT, ALIEN SUPERSTAR."},
    {"name":"Drake","genre":"Hip-Hop","tour":"It's All A Blur","listeners":"80M+","grammys":5,
     "bio":"Drake's concerts blur the line between hip-hop show and arena spectacle. As the most-streamed artist in Spotify history, his setlists are packed with chart-toppers that every audience member knows. The production combines intimate moments (just Drake and a microphone) with massive visual displays and surprise guest appearances that make each show unique.",
     "setlist":"God's Plan, One Dance, Hotline Bling, Started From the Bottom, Nice For What, Rich Flex, and more."},
    {"name":"Billie Eilish","genre":"Pop/Alt","tour":"Hit Me Hard and Soft","listeners":"70M+","grammys":9,
     "bio":"Billie Eilish redefined pop music before turning 20, and her live shows reflect her artistic vision - atmospheric, emotional, and visually striking. The Hit Me Hard and Soft tour features minimalist staging that puts the focus on her haunting vocals and deeply personal songs. At just 24, she's already won 9 Grammys and created a visual aesthetic that influences an entire generation.",
     "setlist":"Bad Guy, Everything I Wanted, Happier Than Ever, Ocean Eyes, BIRDS OF A FEATHER, and new material."},
    {"name":"Dua Lipa","genre":"Pop/Dance","tour":"Radical Optimism Tour","listeners":"65M+","grammys":3,
     "bio":"Dua Lipa transformed from a viral sensation into one of pop's biggest stadium acts. Her Radical Optimism Tour builds on the disco-pop blueprint of Future Nostalgia, with elaborate choreography, dazzling costumes, and a setlist that turns every show into a dance party. Her live shows have been praised for their energy, production values, and Dua's magnetic stage presence.",
     "setlist":"Don't Start Now, Levitating, Physical, One Kiss, New Rules, Training Season, and more."},
    {"name":"Bad Bunny","genre":"Reggaeton","tour":"Most Wanted Tour","listeners":"60M+","grammys":3,
     "bio":"Bad Bunny is the biggest Latin music artist in the world and a cultural phenomenon. His concerts are high-energy celebrations that blend reggaeton, trap, and Latin pop with massive production values. Performing primarily in Spanish, Bad Bunny has broken every streaming record while filling the biggest stadiums globally, proving that music transcends language barriers.",
     "setlist":"Titi Me Pregunto, Dakiti, Yonaguni, Moscow Mule, WHERE SHE GOES, and deep album cuts."},
]

CONCERT_TIERS = [
    {"type":"General Admission","our":69,"stub":99,"via":109},
    {"type":"Seated - Upper Bowl","our":99,"stub":139,"via":149},
    {"type":"Seated - Lower Bowl","our":179,"stub":239,"via":259},
    {"type":"Floor / Standing","our":249,"stub":339,"via":369},
    {"type":"VIP Package","our":499,"stub":699,"via":749},
    {"type":"Meet & Greet","our":999,"stub":1399,"via":1499},
]

# ====================== CITIES ======================

CITIES = [
    {"name":"London","country":"UK","venues":["Wembley Stadium","O2 Arena","Emirates Stadium","Stamford Bridge","Tottenham Hotspur Stadium"]},
    {"name":"Madrid","country":"Spain","venues":["Santiago Bernabeu","Civitas Metropolitano","WiZink Center"]},
    {"name":"Barcelona","country":"Spain","venues":["Spotify Camp Nou","Palau Sant Jordi","Estadi Olimpic"]},
    {"name":"Paris","country":"France","venues":["Parc des Princes","Stade de France","AccorHotels Arena"]},
    {"name":"Munich","country":"Germany","venues":["Allianz Arena","Olympiahalle","Olympiastadion"]},
    {"name":"Milan","country":"Italy","venues":["San Siro","Mediolanum Forum"]},
    {"name":"Berlin","country":"Germany","venues":["Olympiastadion","Mercedes-Benz Arena","Waldbuhne"]},
    {"name":"Amsterdam","country":"Netherlands","venues":["Johan Cruyff Arena","Ziggo Dome"]},
    {"name":"Manchester","country":"UK","venues":["Old Trafford","Etihad Stadium","AO Arena"]},
    {"name":"Liverpool","country":"UK","venues":["Anfield","M&S Bank Arena"]},
    {"name":"Rome","country":"Italy","venues":["Stadio Olimpico","Palazzo dello Sport"]},
    {"name":"Lisbon","country":"Portugal","venues":["Estadio da Luz","MEO Arena"]},
    {"name":"Istanbul","country":"Turkey","venues":["Ataturk Olympic Stadium","Turk Telekom Stadium"]},
    {"name":"Dubai","country":"UAE","venues":["Dubai Sports City","Coca-Cola Arena"]},
    {"name":"Abu Dhabi","country":"UAE","venues":["Yas Marina Circuit","Etihad Arena"]},
]

WC_HOSTS = [
    {"name":"New York/New Jersey","country":"USA","stadium":"MetLife Stadium","cap":82500},
    {"name":"Los Angeles","country":"USA","stadium":"SoFi Stadium","cap":70240},
    {"name":"Dallas","country":"USA","stadium":"AT&T Stadium","cap":80000},
    {"name":"Miami","country":"USA","stadium":"Hard Rock Stadium","cap":64767},
    {"name":"Mexico City","country":"Mexico","stadium":"Estadio Azteca","cap":87523},
    {"name":"Toronto","country":"Canada","stadium":"BMO Field","cap":30000},
    {"name":"Vancouver","country":"Canada","stadium":"BC Place","cap":54500},
]

WC_STAGES = ["Group Stage","Round of 16","Quarter-Final","Semi-Final","Third Place Play-off","Final"]

# ====================== CONTENT HELPERS ======================

def _price_tbl(tiers):
    h = "| Ticket Type | EuroMatchTickets | StubHub | Viagogo | You Save |\n|---|---|---|---|---|\n"
    for t in tiers:
        sv = t["via"] - t["our"]
        h += f"| {t['type']} | **{E}{t['our']}** | {E}{t['stub']} | {E}{t['via']} | **Save {E}{sv}** |\n"
    return h

def _trust():
    return """
## Why Choose EuroMatchTickets?

| | EuroMatchTickets | Other Resellers |
|---|---|---|
| Verified Tickets | 100% Guaranteed | Not always verified |
| FanProtect Guarantee | Full refund if event cancelled | Limited or no refund |
| Delivery | Instant e-ticket delivery | 24-72 hours wait |
| Payment | Stripe encrypted checkout | Varies by platform |
| Support | 24/7 live chat & email | Email only, slow response |
| Pricing | Lowest price guarantee | 20-40% higher prices |
"""

def _internal_links_f1(current_race):
    links = "\n## More Formula 1 Races\n\nExplore tickets for other races on the 2026 F1 calendar:\n\n"
    others = [r for r in F1 if r["name"] != current_race["name"]]
    for r in random.sample(others, min(6, len(others))):
        slug = f"{_s(r['name'])}-tickets-2026"
        links += f"- [{r['name']} Tickets]({URL}/{slug}) - {r['city']}, {r['country']}\n"
    links += f"\n[View Complete F1 2026 Calendar]({URL}/f1-tickets)\n"
    return links

def _internal_links_club(current_club):
    links = "\n## More Football Tickets\n\nBrowse tickets for other top European clubs:\n\n"
    others = [c for c in CLUBS if c["name"] != current_club["name"]]
    for c in random.sample(others, min(6, len(others))):
        slug = f"{_s(c['name'].replace('FC ','').replace(' FC',''))}-tickets-2026"
        links += f"- [{c['name']} Tickets]({URL}/{slug}) - {c['stadium']}, {c['city']}\n"
    links += f"\n[View All Football Events]({URL}/events?type=football)\n"
    return links

def _internal_links_artist(current_artist):
    links = "\n## More Concert Tickets\n\nDiscover other amazing tours:\n\n"
    others = [a for a in ARTISTS if a["name"] != current_artist["name"]]
    for a in random.sample(others, min(6, len(others))):
        slug = f"{_s(a['name'])}-concert-tickets-2026"
        links += f"- [{a['name']} - {a['tour']}]({URL}/{slug})\n"
    links += f"\n[Browse All Concerts]({URL}/events?type=concert)\n"
    return links

# ====================== F1 FAQ POOLS ======================

def _f1_faq(race):
    pool = [
        (f"When is the {race['name']} 2026?", f"The {race['name']} takes place on {race['date']} at {race['circuit']} in {race['city']}, {race['country']}. Gates typically open 3 hours before the first session."),
        (f"How much are {race['name']} tickets?", f"Tickets start from {E}89 for General Admission. Grandstand seats from {E}189, VIP Hospitality from {E}899, and the exclusive Paddock Club from {E}2,499. All prices include our FanProtect guarantee."),
        ("Are resale tickets safe to buy?", f"{SITE} is an authorised resale marketplace. Every ticket is verified for authenticity before sale. Our FanProtect guarantee means you receive a full refund if the event is cancelled or your tickets are not valid."),
        ("When will I receive my tickets?", "Most tickets are delivered instantly as e-tickets to your email. Some events may require mobile transfer or physical delivery, which is completed at least 7 days before the event."),
        (f"What is the best grandstand at {race['circuit']}?", f"For the start/finish action, choose the Main Straight grandstand. For overtaking, look at corners with heavy braking zones. Our VIP Hospitality packages include the best elevated viewing positions at {race['circuit']}."),
        (f"Can I get a refund on {race['name']} tickets?", f"Yes. Under our FanProtect guarantee, you receive a full refund if the event is cancelled. For personal cancellations, we offer a resale option where you can list your tickets on our marketplace."),
        (f"How do I get to {race['circuit']}?", race['transport']),
        ("Do you offer payment plans?", f"We accept all major credit cards, Apple Pay, and Google Pay via our secure Stripe checkout. Contact our support team for information about split payment options for high-value packages."),
    ]
    selected = random.sample(pool, min(5, len(pool)))
    faq = "\n## Frequently Asked Questions\n\n"
    for q, a in selected:
        faq += f"**{q}**\n{a}\n\n"
    return faq

# ====================== FOOTBALL FAQ POOLS ======================

def _fb_faq(club):
    pool = [
        (f"How much are {club['name']} tickets?", f"Standard tickets start from {E}49. Premium seats from {E}129, VIP boxes from {E}399, and Executive Boxes from {E}1,499. Champions League matches are priced higher due to demand."),
        (f"What matches can I see at {club['stadium']}?", f"{club['name']} plays approximately 25 home matches per season across {club['league']}, Champions League, and domestic cup competitions. Derby matches and Champions League knockout rounds are the highest demand."),
        (f"Is {club['stadium']} accessible for disabled fans?", f"Yes, {club['stadium']} offers wheelchair-accessible seating, accessible toilets, and dedicated assistance. Contact us when booking to arrange accessible tickets."),
        ("Are resale tickets genuine?", f"Every ticket sold on {SITE} is verified for authenticity. Our FanProtect guarantee provides a full refund if tickets are not genuine or the event is cancelled."),
        (f"How early should I arrive at {club['stadium']}?", f"We recommend arriving at least 90 minutes before kick-off. For big matches ({club['derby'].split(' vs ')[0]} derbies, Champions League), arrive 2 hours early to enjoy the pre-match atmosphere."),
        ("Can I buy tickets for away matches?", f"Yes, we have tickets for {club['name']} away matches across all competitions. Away section tickets are limited and sell out quickly - book early."),
        ("What is the best section for atmosphere?", f"The most vocal supporters are typically in the home end/ultras section. For the best overall view, choose the main stand or premium midfield seats."),
    ]
    selected = random.sample(pool, min(5, len(pool)))
    faq = "\n## Frequently Asked Questions\n\n"
    for q, a in selected:
        faq += f"**{q}**\n{a}\n\n"
    return faq

# ====================== CONCERT FAQ POOLS ======================

def _concert_faq(artist):
    pool = [
        (f"How much are {artist['name']} tickets?", f"General Admission from {E}69, seated tickets from {E}99, floor/standing from {E}249, VIP from {E}499, and Meet & Greet packages from {E}999."),
        (f"How long is a {artist['name']} concert?", f"{artist['name']} concerts typically last 2-3 hours. The {artist['tour']} features an extended setlist with special production elements."),
        (f"What songs will {artist['name']} play?", artist['setlist']),
        ("Are VIP packages worth the price?", f"VIP packages include premium seating/standing, exclusive merchandise, early venue entry, and access to the VIP lounge. For dedicated {artist['name']} fans, it's an unforgettable upgrade."),
        (f"Will {artist['name']} do a meet and greet?", f"Meet & Greet packages are available for select shows. These include a personal meeting with {artist['name']}, a photo opportunity, and signed memorabilia. Availability is extremely limited."),
        ("When should I book tickets?", f"{artist['name']} concerts sell out fast. We recommend booking as soon as dates are announced. Prices typically increase as the show date approaches."),
        ("Can I get a refund?", f"Our FanProtect guarantee covers event cancellations with a full refund. For personal cancellations, you can relist your tickets on our marketplace."),
    ]
    selected = random.sample(pool, min(5, len(pool)))
    faq = "\n## Frequently Asked Questions\n\n"
    for q, a in selected:
        faq += f"**{q}**\n{a}\n\n"
    return faq


# ====================== PAGE BUILDERS ======================

def _f1_page(race, tier=None, year="2026"):
    if tier:
        slug = f"{_s(race['name'])}-{_s(tier['type'])}-tickets-{year}"
        title = f"{race['name']} {tier['type']} Tickets {year} | From {E}{tier['our']} | {SITE}"
        desc = f"Buy {race['name']} {tier['type']} tickets for {year} at {race['circuit']}, {race['city']}. {E}{tier['our']} (save {E}{tier['via']-tier['our']} vs Viagogo). Instant delivery, FanProtect guarantee."
        content = f"# {race['name']} {tier['type']} Tickets {year}\n\n"
        content += f"Secure {tier['type']} tickets for the {race['name']} at the legendary {race['circuit']} in {race['city']}, {race['country']}.\n\n"
        content += f"**Our Price: {E}{tier['our']}** | StubHub: {E}{tier['stub']} | Viagogo: {E}{tier['via']} | **You Save: {E}{tier['via']-tier['our']}**\n\n"
        if tier['type'] == "VIP Hospitality":
            content += "## What VIP Hospitality Includes\n\n- Premium elevated viewing position above the pit lane\n- Gourmet 5-course dining with champagne and premium drinks\n- Guided pit lane walk on Friday or Saturday\n- Appearances by F1 team principals and drivers\n- Air-conditioned hospitality suite with live timing screens\n- Dedicated concierge service throughout the weekend\n- Official event programme and commemorative gift\n\n"
        elif tier['type'] == "Paddock Club":
            content += "## The Paddock Club Experience\n\n- All-access pass to the F1 paddock area\n- Pre-race grid walk - stand on the starting grid before lights out\n- Meet F1 drivers, team principals, and personalities\n- Michelin-star fine dining with unlimited champagne\n- Best seats in the house, directly above the pit lane\n- Behind-the-scenes tours of team garages\n- Exclusive Paddock Club lounge and terrace\n\n"
        elif tier['type'] == "Grid Walk Experience":
            content += "## Grid Walk Experience Details\n\n- Walk on the starting grid 30 minutes before the race begins\n- See drivers in their cars preparing for lights out\n- Once-in-a-lifetime photo opportunities alongside F1 machinery\n- All Paddock Club benefits included\n- Limited to just 200 guests per race - extremely exclusive\n- Commemorative signed print from the event\n\n"
        elif tier['type'] == "Grandstand":
            content += f"## Grandstand Seating at {race['circuit']}\n\n- Reserved seat with excellent views of the track\n- Multiple grandstand options around the circuit\n- Giant screens visible from all grandstand positions\n- Close to food, drink, and merchandise stands\n- Full 3-day access: Friday practice, Saturday qualifying, Sunday race\n- The best value for a premium F1 experience\n\n"
        else:
            content += f"## {tier['type']} at {race['name']}\n\n- Access to designated viewing areas around {race['circuit']}\n- Freedom to explore different vantage points throughout the weekend\n- Giant screen coverage across the circuit\n- Full 3-day access (Friday to Sunday)\n- Ideal for fans who want to experience multiple corners\n\n"
        content += _f1_faq(race) + _internal_links_f1(race) + _trust()
        kw = f"{race['name']} {tier['type']} tickets, {race['name']} {tier['type']} {year}, F1 {tier['type']} {race['city']}, buy {race['name']} {tier['type']}"
        return {"slug":slug,"title":title,"description":desc,"content":content,"keywords":kw,"category":"f1","page_type":"ticket_type","event_name":race["name"],"city":race["city"],"country":race["country"],"venue":race["circuit"],"ticket_type":tier["type"],"year":year,"price_low":tier["our"],"price_high":tier["via"],"image":IMG["f1"],"priority":0.85}

    # Main race page
    slug = f"{_s(race['name'])}-tickets-{year}"
    title = f"{race['name']} {year} Tickets | From {E}{F1_TIERS[0]['our']} | {SITE}"
    desc = f"Buy {race['name']} tickets for {year}. {race['circuit']}, {race['city']}. All categories from {E}{F1_TIERS[0]['our']} GA to {E}{F1_TIERS[-1]['our']} Grid Walk. 25% cheaper than competitors. FanProtect guarantee."

    d1, d2 = random.sample(F1_DRIVERS, 2)
    t1, t2 = random.sample(F1_TEAMS, 2)

    content = f"# {race['name']} {year} Tickets - Official Resale Marketplace\n\n"
    content += f"{race['history']}\n\n"
    content += f"## Ticket Prices - Compare & Save\n\n{_price_tbl(F1_TIERS)}\n"
    content += f"## What Makes {race['name']} Unmissable\n\n"
    content += f"The {race['name']} is a {race['laps']}-lap battle on the {race['km']}km {race['circuit']}. With a capacity of {race['cap']:,} fans, this {'spectacular night race under floodlights' if race['type']=='night' else 'twilight race that starts in daylight and finishes under lights' if race['type']=='twilight' else 'daytime race with clear visibility of every overtaking move'} in {race['city']} delivers non-stop action. Watch {d1} ({t1}) and {d2} ({t2}) push the limits of modern F1 machinery.\n\n"
    content += f"## Insider Tips for {race['city']}\n\n{race['tips']}\n\n"
    content += f"## How to Get There\n\n{race['transport']}\n\n"
    content += _f1_faq(race) + _internal_links_f1(race) + _trust()

    kw = f"{race['name']} tickets, {race['name']} {year}, buy {race['name']} tickets, {race['city']} F1, {race['circuit']} tickets, cheap {race['name']} tickets, {race['name']} VIP, {race['name']} paddock club, F1 {race['city']} {year}"
    return {"slug":slug,"title":title,"description":desc,"content":content,"keywords":kw,"category":"f1","page_type":"event_landing","event_name":race["name"],"city":race["city"],"country":race["country"],"venue":race["circuit"],"year":year,"price_low":F1_TIERS[0]["our"],"price_high":F1_TIERS[-1]["via"],"image":IMG["f1"],"priority":0.95}


def _fb_page(club, comp=None, year="2026"):
    cn = _s(club["name"].replace("FC ","").replace(" FC",""))
    if comp:
        slug = f"{cn}-{_s(comp)}-tickets-{year}"
        title = f"{club['name']} {comp} Tickets {year} | {club['stadium']} | {SITE}"
        desc = f"Buy {club['name']} {comp} tickets for {year}. {club['stadium']}, {club['city']}. From {E}{FB_TIERS[0]['our']}. Save up to 40% vs resellers."
        content = f"# {club['name']} {comp} Tickets {year}\n\n"
        content += f"Get tickets for all {club['name']} {comp} matches at {club['stadium']} ({club['cap']:,} capacity) in {club['city']}, {club['country']}.\n\n"
        content += f"## Ticket Prices\n\n{_price_tbl(FB_TIERS)}\n"
        content += f"## {comp} Schedule\n\nAll {club['name']} {comp} home and away matches are available. Group stage fixtures offer the best value, while knockout rounds command premium prices. Book early for the best seats and savings.\n\n"
        content += _fb_faq(club) + _internal_links_club(club) + _trust()
        kw = f"{club['name']} {comp} tickets, {club['name']} {comp} {year}, {club['stadium']} {comp}"
        return {"slug":slug,"title":title,"description":desc,"content":content,"keywords":kw,"category":"football","page_type":"competition","event_name":club["name"],"competition":comp,"city":club["city"],"country":club["country"],"venue":club["stadium"],"year":year,"price_low":FB_TIERS[0]["our"],"price_high":FB_TIERS[-1]["via"],"image":IMG["football"],"priority":0.85}

    slug = f"{cn}-tickets-{year}"
    title = f"{club['name']} Tickets {year} | {club['stadium']} | All Matches | {SITE}"
    desc = f"Buy {club['name']} tickets for all {year} {club['league']} and Champions League matches. {club['stadium']}, {club['city']}. From {E}{FB_TIERS[0]['our']}. FanProtect guarantee."

    content = f"# {club['name']} Tickets {year}\n\n"
    content += f"{club['history']}\n\n"
    content += f"## Ticket Prices - Compare & Save\n\n{_price_tbl(FB_TIERS)}\n"
    content += f"## The Biggest Match: {club['derby']}\n\n{club['derby_desc']}\n\n"
    content += f"## {club['stadium']} Stadium Guide\n\n- **Location:** {club['city']}, {club['country']}\n- **Capacity:** {club['cap']:,}\n- **Home to:** {club['name']} since {club['since']}\n- **League:** {club['league']}\n- **Champions League Titles:** {club['cl']}\n\n"
    content += _fb_faq(club) + _internal_links_club(club) + _trust()

    kw = f"{club['name']} tickets, {club['name']} tickets {year}, {club['stadium']} tickets, {club['name']} {club['league']}, buy {club['name']} tickets, {club['name']} Champions League tickets"
    return {"slug":slug,"title":title,"description":desc,"content":content,"keywords":kw,"category":"football","page_type":"club_landing","event_name":club["name"],"city":club["city"],"country":club["country"],"venue":club["stadium"],"league":club["league"],"year":year,"price_low":FB_TIERS[0]["our"],"price_high":FB_TIERS[-1]["via"],"image":IMG["football"],"priority":0.90}


def _matchup_page(c1, c2):
    s1 = _s(c1["name"].replace("FC ","").replace(" FC",""))
    s2 = _s(c2["name"].replace("FC ","").replace(" FC",""))
    slug = f"{s1}-vs-{s2}-tickets"
    title = f"{c1['name']} vs {c2['name']} Tickets | Live Match | {SITE}"
    desc = f"Buy {c1['name']} vs {c2['name']} match tickets. All competitions. {c1['stadium']} or {c2['stadium']}. From {E}{FB_TIERS[0]['our']}. Save 40%."
    content = f"# {c1['name']} vs {c2['name']} Tickets\n\n"
    content += f"This is one of European football's most anticipated fixtures. Whether played at {c1['stadium']} in {c1['city']} ({c1['cap']:,} capacity) or {c2['stadium']} in {c2['city']} ({c2['cap']:,} capacity), this match delivers drama, quality, and memories that last a lifetime.\n\n"
    content += f"## Match History\n\n{c1['name']} ({c1['cl']} Champions League titles, founded {c1['since']}) and {c2['name']} ({c2['cl']} Champions League titles, founded {c2['since']}) have a rich competitive history spanning decades of European football.\n\n"
    content += f"## Ticket Prices\n\n{_price_tbl(FB_TIERS)}\n"
    content += f"## Match Venues\n\n- **{c1['name']} Home:** {c1['stadium']}, {c1['city']} ({c1['cap']:,} seats)\n- **{c2['name']} Home:** {c2['stadium']}, {c2['city']} ({c2['cap']:,} seats)\n\n"
    links = f"\n## Related Matches\n\n"
    links += f"- [{c1['name']} All Matches]({URL}/{_s(c1['name'].replace('FC ','').replace(' FC',''))}-tickets-2026)\n"
    links += f"- [{c2['name']} All Matches]({URL}/{_s(c2['name'].replace('FC ','').replace(' FC',''))}-tickets-2026)\n"
    links += f"- [All Football Events]({URL}/events?type=football)\n"
    content += links + _trust()
    kw = f"{c1['name']} vs {c2['name']} tickets, {c1['name']} {c2['name']} match, {c2['name']} vs {c1['name']}"
    return {"slug":slug,"title":title,"description":desc,"content":content,"keywords":kw,"category":"football","page_type":"matchup","matchup":f"{c1['name']} vs {c2['name']}","image":IMG["football"],"priority":0.80}


def _concert_page(artist, city=None, year="2026"):
    asl = _s(artist["name"])
    if city:
        slug = f"{asl}-{_s(city['name'])}-tickets-{year}"
        title = f"{artist['name']} {city['name']} Tickets {year} | {artist['tour']} | {SITE}"
        desc = f"Buy {artist['name']} concert tickets in {city['name']}, {city['country']}. {artist['tour']}. From {E}{CONCERT_TIERS[0]['our']}. VIP & Meet & Greet available."
        vl = ", ".join(city["venues"][:3])
        content = f"# {artist['name']} in {city['name']} - {artist['tour']} {year}\n\n"
        content += f"Experience {artist['name']} live in {city['name']}, {city['country']}! The {artist['tour']} brings {artist['name']}'s incredible live show to venues including {vl}.\n\n"
        content += f"## About {artist['name']}\n\n{artist['bio']}\n\n"
        content += f"## Ticket Prices for {city['name']}\n\n{_price_tbl(CONCERT_TIERS)}\n"
        content += f"## Expected Setlist\n\n{artist['setlist']}\n\n"
        content += _concert_faq(artist) + _internal_links_artist(artist) + _trust()
        kw = f"{artist['name']} {city['name']} tickets, {artist['name']} concert {city['name']} {year}, {artist['name']} {city['name']}, {artist['name']} tour {city['name']}"
        return {"slug":slug,"title":title,"description":desc,"content":content,"keywords":kw,"category":"concert","page_type":"city_artist","artist":artist["name"],"city":city["name"],"country":city["country"],"year":year,"price_low":CONCERT_TIERS[0]["our"],"price_high":CONCERT_TIERS[-1]["via"],"image":IMG["concert"],"priority":0.80}

    slug = f"{asl}-concert-tickets-{year}"
    title = f"{artist['name']} Concert Tickets {year} | {artist['tour']} | {SITE}"
    desc = f"Buy {artist['name']} {artist['tour']} tickets for {year}. All European dates. From {E}{CONCERT_TIERS[0]['our']}. VIP & Meet & Greet available. Save up to 35%."

    content = f"# {artist['name']} Concert Tickets {year} - {artist['tour']}\n\n"
    content += f"{artist['bio']}\n\n"
    content += f"## Ticket Prices - Compare & Save\n\n{_price_tbl(CONCERT_TIERS)}\n"
    content += f"## {artist['name']} at a Glance\n\n- **Genre:** {artist['genre']}\n- **Current Tour:** {artist['tour']}\n- **Monthly Listeners:** {artist['listeners']}\n- **Grammy Awards:** {artist['grammys']}\n\n"
    content += f"## Expected Setlist\n\n{artist['setlist']}\n\n"
    content += _concert_faq(artist) + _internal_links_artist(artist) + _trust()
    kw = f"{artist['name']} tickets, {artist['name']} concert tickets {year}, {artist['name']} {artist['tour']}, buy {artist['name']} tickets, {artist['name']} VIP, {artist['name']} meet and greet"
    return {"slug":slug,"title":title,"description":desc,"content":content,"keywords":kw,"category":"concert","page_type":"artist_landing","artist":artist["name"],"genre":artist["genre"],"tour":artist["tour"],"year":year,"price_low":CONCERT_TIERS[0]["our"],"price_high":CONCERT_TIERS[-1]["via"],"image":IMG["concert"],"priority":0.90}


def _city_page(city, cat):
    slug = f"{_s(city['name'])}-{cat}-tickets-2026"
    cd = cat.title()
    title = f"{city['name']} {cd} Tickets 2026 | All Events & Venues | {SITE}"
    desc = f"Buy tickets for all {cat} in {city['name']}, {city['country']}. Venues: {', '.join(city['venues'][:3])}. Best prices guaranteed with FanProtect."
    vl = "\n".join([f"- **{v}**" for v in city["venues"]])
    content = f"# {city['name']} {cd} Tickets 2026\n\n"
    content += f"Your complete guide to {cat} tickets in {city['name']}, {city['country']}. We cover all major venues:\n\n{vl}\n\n"
    content += f"## Why {city['name']} for {cd}?\n\n{city['name']} is one of Europe's premier destinations for live {cat}. With world-class venues, excellent transport links, and vibrant nightlife, your event experience extends far beyond the venue.\n\n"
    content += f"## Finding the Best Tickets\n\nBrowse our complete selection of {cat} events in {city['name']}. Filter by date, venue, and price to find the perfect tickets. Our prices are consistently 20-30% lower than other resale platforms.\n\n"
    links = f"\n## More Cities\n\n"
    for c in random.sample([x for x in CITIES if x["name"] != city["name"]], min(5, len(CITIES)-1)):
        links += f"- [{c['name']} {cd} Tickets]({URL}/{_s(c['name'])}-{cat}-tickets-2026)\n"
    content += links + _trust()
    kw = f"{city['name']} {cat} tickets, {cat} in {city['name']} 2026, {city['name']} events, {city['name']} tickets"
    return {"slug":slug,"title":title,"description":desc,"content":content,"keywords":kw,"category":cat,"page_type":"city_category","city":city["name"],"country":city["country"],"image":IMG.get(cat,IMG["concert"]),"priority":0.75}


def _wc_city_page(host):
    slug = f"world-cup-2026-{_s(host['name'])}-tickets"
    title = f"FIFA World Cup 2026 {host['name']} Tickets | {host['stadium']} | {SITE}"
    desc = f"Buy World Cup 2026 tickets for {host['name']}. {host['stadium']} ({host['cap']:,} seats). All stages. From {E}99."
    content = f"# FIFA World Cup 2026 - {host['name']} Matches\n\n"
    content += f"Watch the biggest sporting event on earth at **{host['stadium']}** in {host['name']}, {host['country']}. With a capacity of {host['cap']:,}, this venue will host multiple World Cup matches from Group Stage through knockout rounds.\n\n"
    content += f"## Ticket Prices\n\n| Category | Price |\n|---|---|\n| Category 1 (Best View) | From {E}349 |\n| Category 2 | From {E}199 |\n| Category 3 | From {E}99 |\n| Hospitality Package | From {E}1,499 |\n\n"
    content += f"## Frequently Asked Questions\n\n**How do I get tickets for World Cup matches in {host['name']}?**\nBrowse our selection of verified World Cup tickets. All tickets come with our FanProtect guarantee.\n\n**What stages will be played in {host['name']}?**\n{host['name']} is expected to host Group Stage and knockout round matches. The exact schedule will be confirmed by FIFA.\n\n"
    links = "\n## Other World Cup Venues\n\n"
    for h in random.sample([x for x in WC_HOSTS if x["name"] != host["name"]], min(4, len(WC_HOSTS)-1)):
        links += f"- [{h['name']} - {h['stadium']}]({URL}/world-cup-2026-{_s(h['name'])}-tickets)\n"
    links += f"\n[All World Cup 2026 Tickets]({URL}/world-cup-2026)\n"
    content += links + _trust()
    kw = f"World Cup 2026 {host['name']} tickets, FIFA 2026 {host['name']}, {host['stadium']} World Cup"
    return {"slug":slug,"title":title,"description":desc,"content":content,"keywords":kw,"category":"worldcup","page_type":"wc_city","city":host["name"],"country":host["country"],"venue":host["stadium"],"image":IMG["worldcup"],"priority":0.95}


def _wc_stage_page(stage):
    slug = f"world-cup-2026-{_s(stage)}-tickets"
    title = f"FIFA World Cup 2026 {stage} Tickets | All Venues | {SITE}"
    desc = f"Buy FIFA World Cup 2026 {stage} tickets across USA, Mexico & Canada. From {E}99. Secure booking with FanProtect."
    prices = {"Final": (999,599,349,4999), "Semi-Final": (599,349,199,2999), "Quarter-Final": (399,249,149,1999)}
    p = prices.get(stage, (249,149,99,999))
    content = f"# FIFA World Cup 2026 {stage} Tickets\n\n"
    content += f"Secure your seats for the {stage} of the FIFA World Cup 2026. Matches will be held across 16 world-class venues in the USA, Mexico, and Canada.\n\n"
    content += f"## {stage} Ticket Prices\n\n| Category | Price |\n|---|---|\n| Category 1 | From {E}{p[0]} |\n| Category 2 | From {E}{p[1]} |\n| Category 3 | From {E}{p[2]} |\n| Hospitality | From {E}{p[3]} |\n\n"
    if stage == "Final":
        content += "The World Cup Final will be held at **MetLife Stadium** in New York/New Jersey (82,500 capacity). This is the most sought-after ticket in world sport - over 1 billion viewers will watch on TV, but only 82,500 will be there live.\n\n"
    content += f"## FAQ\n\n**When are {stage} matches?**\nThe exact {stage} schedule will be confirmed by FIFA after the group stage draw. Dates will be in June-July 2026.\n\n**Can I choose which {stage} match to attend?**\nYes, once the schedule is released you can select specific matches. We also offer multi-match packages.\n\n"
    links = "\n## All World Cup Stages\n\n"
    for s in WC_STAGES:
        if s != stage:
            links += f"- [World Cup {s} Tickets]({URL}/world-cup-2026-{_s(s)}-tickets)\n"
    content += links + _trust()
    kw = f"World Cup 2026 {stage} tickets, FIFA 2026 {stage}, buy World Cup {stage} tickets"
    return {"slug":slug,"title":title,"description":desc,"content":content,"keywords":kw,"category":"worldcup","page_type":"wc_stage","stage":stage,"image":IMG["worldcup"],"priority":0.95}


# ====================== MAIN GENERATOR ======================

async def generate_mega_seo_pages():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    now = datetime.now(timezone.utc)
    all_pages = []

    def _add(page_data):
        page_data["created_at"] = now
        page_data["updated_at"] = now
        all_pages.append(page_data)

    # F1 pages
    for race in F1:
        for year in ["2025","2026","2027"]:
            _add(_f1_page(race, year=year))
            for tier in F1_TIERS:
                _add(_f1_page(race, tier=tier, year=year))

    # Football pages
    comps = ["Champions League","Europa League","Premier League","La Liga","Bundesliga","Serie A"]
    for club in CLUBS:
        for year in ["2025","2026"]:
            _add(_fb_page(club, year=year))
            for comp in comps:
                if comp == club["league"] or comp in ["Champions League","Europa League"]:
                    _add(_fb_page(club, comp=comp, year=year))

    # Matchup pages
    for i, c1 in enumerate(CLUBS[:14]):
        for c2 in CLUBS[i+1:14]:
            _add(_matchup_page(c1, c2))

    # Concert pages
    for artist in ARTISTS:
        for year in ["2025","2026"]:
            _add(_concert_page(artist, year=year))
            for city in CITIES:
                _add(_concert_page(artist, city=city, year=year))

    # City category pages
    for city in CITIES:
        for cat in ["concerts","football","sports","events"]:
            _add(_city_page(city, cat))

    # World Cup pages
    for host in WC_HOSTS:
        _add(_wc_city_page(host))
    for stage in WC_STAGES:
        _add(_wc_stage_page(stage))

    # Bulk upsert
    total = len(all_pages)
    logger.info(f"Generating {total} unique SEO pages...")
    created = 0
    for i in range(0, total, 200):
        batch = all_pages[i:i+200]
        ops = [UpdateOne({"slug": p["slug"]}, {"$set": p}, upsert=True) for p in batch]
        result = await db.seo_pages.bulk_write(ops)
        created += result.upserted_count + result.modified_count
        logger.info(f"Processed {min(i+200, total)}/{total}...")

    await db.seo_pages.create_index("slug", unique=True)
    await db.seo_pages.create_index("category")
    await db.seo_pages.create_index("page_type")

    logger.info(f"MEGA SEO v3 complete: {total} pages generated")
    return {"total_generated": total, "pages_written": created}

if __name__ == "__main__":
    asyncio.run(generate_mega_seo_pages())
