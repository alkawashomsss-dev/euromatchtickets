"""
Smart Template Content Generator - No AI Required
Generates unique, varied content for each SEO page using randomized templates.
"""
import random
import hashlib
from datetime import datetime, timezone
from database.db import db

# ─── Reusable Fragments ──────────────────────────────────────────────

OPENERS_F1 = [
    "There's nothing quite like the roar of Formula 1 engines echoing through {venue}.",
    "If you've ever dreamed of watching F1 cars scream past at 300km/h, {city} is where that dream comes alive.",
    "Every F1 fan has a bucket list, and {title_short} sits right near the top.",
    "Let's be honest — {title_short} isn't just a race. It's an experience that stays with you long after the chequered flag drops.",
    "Picture this: you're trackside at {venue}, the lights go out, and twenty cars launch into the first corner.",
    "For pure racing drama, few events on the F1 calendar match what {city} delivers year after year.",
    "Ask any seasoned F1 traveller about {title_short}, and watch their eyes light up.",
]

OPENERS_FOOTBALL = [
    "Football in {city} isn't just a sport — it's a way of life that pulses through every street and café.",
    "There's a reason {title_short} draws fans from every corner of the globe.",
    "If you haven't experienced live football at {venue}, you're missing something truly special.",
    "The atmosphere at {venue} on matchday is something television simply cannot capture.",
    "Some football matches you watch. {title_short}? That's one you feel in your bones.",
    "Whether you're a lifelong supporter or a first-time visitor, {title_short} delivers unforgettable moments.",
    "Few things in sport compare to the noise that erupts at {venue} when the home side scores.",
]

OPENERS_CONCERT = [
    "Live music hits different, and {title_short} is proof of that.",
    "There's a reason fans travel thousands of miles to see {title_short} in person.",
    "If you're after a night you'll never forget, {title_short} should be at the top of your list.",
    "Some concerts are good. Some are great. And then there's {title_short}.",
    "Close your eyes and imagine the crowd singing every word back. That's what {title_short} feels like.",
    "The energy at a live show is something no streaming service can replicate, and {title_short} proves it.",
    "Music fans know the difference between a concert and an event. {title_short} is firmly in the second category.",
]

OPENERS_WORLDCUP = [
    "The FIFA World Cup 2026 is the biggest sporting event on the planet, and {title_short} puts you right in the middle of it.",
    "Every four years, football stops being a sport and becomes something closer to a global celebration.",
    "World Cup fever is real, and {title_short} is your chance to catch it firsthand.",
    "There's no atmosphere in sport quite like a World Cup match — the flags, the songs, the tension.",
    "For many fans, attending a World Cup match is a once-in-a-lifetime experience. Make sure you don't miss {title_short}.",
]

OPENERS_GENERIC = [
    "Looking for an experience that goes beyond the ordinary? {title_short} delivers exactly that.",
    "Some events you attend. Others you remember for years. {title_short} falls squarely in the second camp.",
    "If {city} is on your travel radar, timing your visit around {title_short} is a seriously smart move.",
]

# ─── Ticket Advice Paragraphs ────────────────────────────────────────

TICKET_ADVICE = [
    "<p>When it comes to tickets, here's my honest advice: don't wait until the last minute. Prices for {title_short} typically start around €{price_low} for standard seating and can climb to €{price_high} or more for premium spots. The sweet spot? Book about 6-8 weeks before the event. That's when you'll find the best balance between availability and price. Early birds get decent seats without the panic premium, and you'll have time to sort travel and accommodation too.</p>",
    "<p>Let's talk tickets. For {title_short}, you're looking at a range from €{price_low} to €{price_high} depending on what kind of experience you want. General admission gives you the atmosphere without breaking the bank, while premium seats or VIP packages add comfort and perks like hospitality lounges. My take? If it's your first time, go for something in the mid-range — you'll get great views without the nosebleed price tag. And whatever you do, buy from a trusted source.</p>",
    "<p>Ticket prices for {title_short} vary quite a bit. Budget-friendly options start at €{price_low}, which gets you through the gates and into the action. If you want something more special — better sightlines, comfortable seating, maybe some food included — expect to pay closer to €{price_high}. The key thing is buying early. Prices only go one direction as the event approaches, and that direction isn't down. We've seen last-minute tickets go for double the original price, so plan ahead.</p>",
    "<p>Here's the thing about ticket pricing for {title_short}: it rewards people who plan ahead. Early prices hover around €{price_low} for entry-level tickets, and even the premium categories around €{price_high} represent decent value when you consider what you're getting. Compare that to resale prices closer to the date, which can be eye-watering. A little organisation goes a long way. Set a reminder, compare your options, and lock in your tickets before the rush.</p>",
]

# ─── Venue/City Paragraphs ───────────────────────────────────────────

VENUE_F1 = [
    "<p>{venue} in {city} is one of those circuits that looks even more impressive in person than on TV. The layout rewards aggressive racing, and the atmosphere around the track is electric — food stalls, merchandise stands, and fans from dozens of countries creating a mini festival. Getting there is straightforward: most circuits have dedicated shuttle services from the city centre, and local transport runs extended hours on race days. Arrive early, grab a spot near your favourite corner, and soak it all in.</p>",
    "<p>What makes {venue} special isn't just the racing — it's everything around it. {city} transforms during the Grand Prix weekend. Hotels fill up, restaurants buzz, and there's a genuine sense of occasion wherever you go. The circuit itself offers multiple viewing options, from grandstands with panoramic views to general admission areas where you can move around and find your perfect vantage point. Pro tip: bring good walking shoes, sunscreen, and patience with the queues.</p>",
]

VENUE_FOOTBALL = [
    "<p>{venue} is one of those stadiums that gives you goosebumps the moment you walk through the gates. {city} takes its football seriously, and you'll feel that energy building hours before kickoff — fans gathering outside, street vendors selling scarves and snacks, songs echoing from the nearby bars. Inside, the acoustics amplify every chant and every gasp. If you can, grab a seat behind the goal or in the lower tiers for maximum atmosphere.</p>",
    "<p>Matchday at {venue} is an all-day event. Fans in {city} don't just turn up at kickoff — they arrive early, meet at favourite bars, walk to the stadium together, and turn the whole area into a party. The stadium itself is well-connected by public transport, and there's food and drink inside to keep you going. Arrive at least an hour before kickoff to enjoy the pre-match build-up. Trust me, the warm-up is worth watching too.</p>",
]

VENUE_CONCERT = [
    "<p>The venue makes a huge difference at a live show, and {title_short} is no exception. Whether it's an arena show or an outdoor festival stage, the production values these days are incredible — massive LED screens, immersive light shows, and sound systems that make every bass note hit you in the chest. If you're in {city}, getting to the venue is usually straightforward with public transport, and most venues have bars and food options inside. Arrive a bit early to grab your spot and settle in.</p>",
    "<p>Concert nights have their own rhythm. For {title_short}, expect doors to open well before the main act — usually an hour or two. That's your window to find your spot, grab a drink, and catch any support acts. In {city}, the venues are generally well-organised with clear signage and helpful staff. Standing tickets put you closer to the action, while seated areas give you a more relaxed experience. Either way, the energy when the main lights go down is absolutely electric.</p>",
]

VENUE_WORLDCUP = [
    "<p>World Cup 2026 stadiums are something else. The host cities have pulled out all the stops — expanded capacity, upgraded facilities, and fan zones that extend far beyond the stadium walls. In {city}, you'll find big-screen viewing areas, food from every culture, and a carnival atmosphere that makes even the walk to the stadium feel like an event. Inside, the roar of tens of thousands of fans from different nations is genuinely spine-tingling.</p>",
]

# ─── Why EuroMatchTickets ────────────────────────────────────────────

WHY_EMT = [
    "<p>Buying through EuroMatchTickets comes with the FanProtect guarantee, which means your purchase is covered if anything goes wrong — full refund for cancellations, replacement tickets if there's an issue, and real human support if you need help. Every ticket comes as a secure QR code delivered straight to your phone, so there's no waiting for post or worrying about lost physical tickets. It's genuinely hassle-free, and that matters when you're spending good money on a live event.</p>",
    "<p>Why EuroMatchTickets instead of other platforms? Simple: the FanProtect guarantee gives you real peace of mind. If the event gets cancelled, you get your money back. If there's a problem with your tickets, they sort it out. No runarounds, no weeks of waiting. Plus, all tickets are delivered digitally with QR codes — instant access on your phone, no printing needed. When you compare that to some sellers who ship physical tickets internationally with no tracking, the choice is pretty clear.</p>",
    "<p>Look, there are plenty of places to buy tickets online. But EuroMatchTickets stands out for a few reasons. First, the FanProtect buyer guarantee — it's not just marketing speak, it's a genuine refund and replacement policy. Second, instant QR code delivery means you've got your tickets in hand within minutes, not days. Third, they actually have customer support that responds. If you've ever dealt with a faceless resale platform and hit a wall trying to get help, you'll appreciate the difference.</p>",
]

# ─── Local Tips ──────────────────────────────────────────────────────

LOCAL_TIPS = {
    "London": "If you're in London, skip the tourist traps around the venue and head to one of the local pubs instead — you'll find better food, cheaper drinks, and a much better pre-event atmosphere. The Tube gets packed after events, so consider walking to a station one or two stops down the line for a quicker journey home.",
    "Paris": "In Paris, don't eat at the restaurants directly outside the venue — walk two blocks in any direction and you'll find much better options at half the price. The Metro is your best friend on event days, and a carnet of tickets works out cheaper than buying singles.",
    "Madrid": "Madrid's food scene alone is worth the trip. Before the event, grab some tapas and a caña at any bar in the La Latina neighbourhood — it's cheap, authentic, and properly delicious. The Metro runs late on event nights, so you don't need to worry about getting back.",
    "Barcelona": "In Barcelona, head to the Raval or Gràcia neighbourhoods for pre-event food and drinks. The tourist spots near Las Ramblas are overpriced and overcrowded. If you're near Camp Nou, the bars on Travessera de les Corts fill up with fans and have great atmosphere.",
    "Milan": "Milan's Navigli district is perfect for a pre-event meal — canal-side restaurants with great pasta at reasonable prices. Get there by tram rather than taxi, and you'll see more of the city too. San Siro is best reached by Metro line 5.",
    "Berlin": "Berlin's Kreuzberg and Neukölln areas have fantastic street food and bars that stay open incredibly late. Public transport is reliable and cheap, and the vibe before big events is always buzzing.",
    "Amsterdam": "In Amsterdam, rent a bike — seriously. It's the fastest way to get around, and you'll blend right in with the locals. For food, head to the Jordaan district and avoid anything within sight of Dam Square.",
    "Munich": "Munich's beer halls are legendary, and a visit to Augustiner or Hofbräuhaus before the event is practically mandatory. The U-Bahn system is efficient and clean, and runs extra services on event nights.",
    "Monaco": "Monaco is expensive, there's no way around it. But here's a local trick: eat and drink in nearby Beausoleil or Cap-d'Ail — just across the border in France — where prices drop by half. Walk into Monaco for the event and save a fortune.",
    "Singapore": "Singapore's hawker centres are the best-kept secret for event-goers — incredible food for under €5. Maxwell Food Centre and Lau Pa Sat are both easy to reach and serve everything from chicken rice to laksa.",
    "Melbourne": "Melbourne's coffee culture is world-class, so start your event day with a flat white from one of the laneway cafes. The free City Circle tram can get you close to most venues, and the bars on Flinders Lane are perfect for post-event drinks.",
    "Jeddah": "In Jeddah, the Al-Balad historic district is worth exploring before the event — it's a UNESCO site with incredible architecture. For food, the seafood restaurants along the Corniche serve some of the freshest fish you'll ever taste.",
}

DEFAULT_TIP = "Wherever the event takes you, here's a universal tip: arrive early, explore the area around the venue, and eat where the locals eat rather than at the tourist spots right outside. You'll save money, eat better, and probably stumble into some pre-event atmosphere that makes the whole experience richer."

# ─── Closing CTAs ────────────────────────────────────────────────────

CLOSINGS = [
    "<p>Bottom line: {title_short} is the kind of event you'll be talking about for years. Don't let ticket availability be the reason you miss it. Grab your tickets now through <a href=\"/events\">EuroMatchTickets</a>, lock in your seats, and start planning the rest of your trip. You won't regret it.</p>",
    "<p>So here's the question: are you going to watch {title_short} on a screen, or are you going to be there? Tickets are available now on <a href=\"/events\">EuroMatchTickets</a> with full FanProtect coverage and instant QR delivery. Don't overthink it — some experiences are worth every euro.</p>",
    "<p>If you've read this far, you're clearly interested. Take the next step: check the available tickets for {title_short} on <a href=\"/events\">EuroMatchTickets</a> and find the option that fits your budget. With FanProtect backing every purchase, there's really nothing to lose — except the event itself if you wait too long.</p>",
    "<p>{title_short} tickets won't last forever. If you're even considering going, now is the time to secure your spot through <a href=\"/events\">EuroMatchTickets</a>. Instant QR delivery, buyer protection, and seats across every price range — it doesn't get much easier than that.</p>",
]

# ─── Category-Specific Middle Paragraphs ─────────────────────────────

F1_MIDDLES = [
    "<p>What sets this Grand Prix apart? The track layout for one — {venue} produces some of the best wheel-to-wheel racing on the calendar. Add in the unpredictability of weather, tyre strategy, and safety car periods, and you've got a recipe for drama. The support races on Saturday are worth catching too, with F2 and F3 providing plenty of action before the main event on Sunday. The whole weekend builds to a crescendo that makes Sunday afternoon feel absolutely massive.</p>",
    "<p>F1 weekends are about much more than the race itself. Free practice sessions on Friday let you see the cars up close and hear the raw power of these machines. Qualifying on Saturday brings the tension — those final laps in Q3 are genuinely nail-biting. And then the race on Sunday ties it all together. At {venue}, the <a href=\"/f1-tickets\">viewing options</a> range from covered grandstands to open-air areas where you can move between corners and find the best action.</p>",
]

FOOTBALL_MIDDLES = [
    "<p>What you'll notice first at {venue} is the noise. European football stadiums have an atmosphere that's genuinely unlike anything else in sport. The ultras sections create a wall of sound that doesn't let up for 90 minutes, and even in the family stands, the energy is infectious. Big matches attract fans who've travelled from across Europe, so you'll hear chants in half a dozen languages. If you want to experience football at its most passionate, this is it.</p>",
    "<p>European football has a rhythm to it that you only appreciate in person. The pre-match tension, the eruption when the teams walk out, the collective holding of breath during a penalty — these moments are what make live <a href=\"/events\">football matches</a> so addictive. At {venue}, the sightlines are excellent from most seats, and the stadium's design amplifies the atmosphere. Even if you're in the upper tiers, you feel part of the action.</p>",
]

CONCERT_MIDDLES = [
    "<p>The thing about seeing {title_short} live is that it's a completely different experience from listening at home. The production — lights, visuals, stage design — transforms the music into something immersive. Add in thousands of fans singing along, and you've got goosebumps guaranteed. The setlist usually includes the biggest hits alongside deeper cuts that reward the real fans. Whether you're a casual listener or a dedicated follower, the show delivers.</p>",
    "<p>Live shows have a magic that recordings just can't capture. {title_short} is known for incredible stage production — we're talking massive LED setups, pyrotechnics, and sound systems that fill every corner of the venue. The <a href=\"/events\">concert experience</a> hits different when you're surrounded by fans who know every lyric. Grab a standing ticket if you want to be in the thick of it, or go for seated if you prefer to take it all in with a bit more comfort.</p>",
]

WORLDCUP_MIDDLES = [
    "<p>The World Cup is football distilled to its purest form — nation against nation, with everything on the line. {title_short} brings together fans who've saved for years to be here, creating an atmosphere that's part sporting event, part cultural festival. The songs, the colours, the tension of knockout rounds — it's overwhelming in the best possible way. And with 2026 being the largest World Cup ever, the scale is going to be something we haven't seen before.</p>",
]


def _seed_random(slug: str):
    """Seed random based on slug for reproducible but varied content."""
    seed = int(hashlib.md5(slug.encode()).hexdigest()[:8], 16)
    return random.Random(seed)


def _get_title_short(page: dict) -> str:
    title = page.get("title", page.get("slug", "").replace("-", " ").title())
    return title.split("|")[0].strip()


def generate_template_content(page: dict) -> str:
    """Generate unique template-based content for one SEO page."""
    slug = page.get("slug", "")
    rng = _seed_random(slug)
    category = page.get("category", "events")
    city = page.get("city", "")
    venue = page.get("venue", "the venue")
    title_short = _get_title_short(page)
    price_low = page.get("price_low", 49)
    price_high = page.get("price_high", 299)
    if not price_low:
        price_low = 49
    if not price_high:
        price_high = 299

    fmt = {"title_short": title_short, "city": city or "the host city", "venue": venue or "the venue", "price_low": price_low, "price_high": price_high}

    paragraphs = []

    # 1. Opener
    if category == "f1":
        openers = OPENERS_F1
    elif category == "football":
        openers = OPENERS_FOOTBALL
    elif category in ("concert", "concerts"):
        openers = OPENERS_CONCERT
    elif category == "worldcup":
        openers = OPENERS_WORLDCUP
    else:
        openers = OPENERS_GENERIC
    paragraphs.append("<p>" + rng.choice(openers).format(**fmt) + "</p>")

    # 2. Middle (category-specific detail)
    if category == "f1":
        paragraphs.append(rng.choice(F1_MIDDLES).format(**fmt))
    elif category == "football":
        paragraphs.append(rng.choice(FOOTBALL_MIDDLES).format(**fmt))
    elif category in ("concert", "concerts"):
        paragraphs.append(rng.choice(CONCERT_MIDDLES).format(**fmt))
    elif category == "worldcup":
        paragraphs.append(rng.choice(WORLDCUP_MIDDLES).format(**fmt))
    else:
        mid = "<p>{title_short} is one of those events where the live experience completely outshines anything you'd get watching from home. The crowd energy, the production, the little moments you'd miss on a broadcast — they all add up to something genuinely memorable. If you're the kind of person who collects experiences over things, this belongs on your list.</p>"
        paragraphs.append(mid.format(**fmt))

    # 3. Ticket advice
    paragraphs.append(rng.choice(TICKET_ADVICE).format(**fmt))

    # 4. Venue/city details
    if category == "f1":
        paragraphs.append(rng.choice(VENUE_F1).format(**fmt))
    elif category == "football":
        paragraphs.append(rng.choice(VENUE_FOOTBALL).format(**fmt))
    elif category in ("concert", "concerts"):
        paragraphs.append(rng.choice(VENUE_CONCERT).format(**fmt))
    elif category == "worldcup":
        paragraphs.append(rng.choice(VENUE_WORLDCUP).format(**fmt))
    else:
        v = "<p>Getting to the venue is usually straightforward — check local transport options and plan to arrive at least an hour early. The area around {venue} in {city} often has plenty of food and drink options, but the smart move is to explore a bit further out for better value and a more authentic local experience.</p>"
        paragraphs.append(v.format(**fmt))

    # 5. Local tip
    tip = LOCAL_TIPS.get(city, DEFAULT_TIP)
    paragraphs.append("<p>" + tip + "</p>")

    # 6. Why EuroMatchTickets
    paragraphs.append(rng.choice(WHY_EMT))

    # 7. Closing CTA
    paragraphs.append(rng.choice(CLOSINGS).format(**fmt))

    return "\n\n".join(paragraphs)


async def generate_all_template_content() -> dict:
    """Generate template content for ALL pages without AI content."""
    pages = await db.seo_pages.find(
        {"content_generated_at": {"$exists": False}},
        {"_id": 0},
    ).to_list(5000)

    if not pages:
        return {"generated": 0, "message": "All pages already have content"}

    generated = 0
    errors = 0
    now = datetime.now(timezone.utc)

    for page in pages:
        try:
            content = generate_template_content(page)
            if content and len(content) > 200:
                await db.seo_pages.update_one(
                    {"slug": page["slug"]},
                    {"$set": {
                        "content": content,
                        "content_generated_at": now.isoformat(),
                        "content_quality": "smart_template",
                        "updated_at": now,
                    }},
                )
                generated += 1
            else:
                errors += 1
        except Exception:
            errors += 1

    return {"generated": generated, "errors": errors, "total_processed": len(pages)}
