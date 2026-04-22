import CityDemandPage from "../components/CityDemandPage";

const CANONICAL = "https://euromatchtickets.com/concerts-in-london-2026";

const INTRO = [
  "London is Europe's undisputed concert capital in 2026 — home to roughly 240 major ticketed shows a year across a staggering density of venues: Wembley Stadium, Tottenham Hotspur Stadium, The O2 Arena, OVO Arena Wembley, Alexandra Palace, plus dozens of legacy theatres from Shepherd's Bush Empire to the Royal Albert Hall.",
  "This page tracks every confirmed London concert we've verified for 2026. We pull data directly from promoter feeds (Live Nation UK, AEG Presents, Kilimanjaro, SJM), official venue calendars, and artist tour announcements. Every listing includes the on-sale status, venue, date, and the cheapest verified seat price — refreshed nightly so you'll never see stale data.",
  "Pricing for London 2026 is on a pronounced upward trend: Taylor Swift Wembley sold out in eight minutes at peak-dynamic pricing, Bad Bunny at Tottenham doubled between pre-sale and general sale, and the typical O2 Arena standing ticket now averages £95 versus £72 in 2024. The fastest way to beat dynamic pricing is to be on a notify list for the pre-sale — we alert subscribers roughly 24 hours before the public on-sale."
];

const VENUE_GUIDE = [
  {
    name: "Wembley Stadium",
    capacity: "90,000",
    type: "National stadium",
    blurb: "Europe's biggest purpose-built concert venue. Hosts Taylor Swift, Coldplay, Oasis, Ed Sheeran on stadium tours. Standing Golden Circle + tiered seating up to level 5."
  },
  {
    name: "Tottenham Hotspur Stadium",
    capacity: "62,000",
    type: "Stadium",
    blurb: "Fast-emerging stadium concert venue — Beyoncé, Post Malone, Bad Bunny in 2026. Excellent sightlines from the single-tier south stand."
  },
  {
    name: "The O2 Arena",
    capacity: "20,000",
    type: "Indoor arena",
    blurb: "London's flagship arena. Year-round residencies and world-tour anchors — Olivia Rodrigo, The Weeknd, SZA, Drake. Seated blocks 101-117 give the best arena sound."
  },
  {
    name: "OVO Arena Wembley",
    capacity: "12,500",
    type: "Indoor arena",
    blurb: "Was the SSE Arena — mid-scale world tours. Acoustic sweet spot is block C14-C20 on the floor."
  },
  {
    name: "Alexandra Palace",
    capacity: "10,250",
    type: "Historic hall",
    blurb: "\"The People's Palace\" — indie and electronic tours mostly. Notorious for unreserved standing and its iconic terrace views of London."
  },
  {
    name: "Royal Albert Hall",
    capacity: "5,272",
    type: "Historic theatre",
    blurb: "The most prestigious classical + legacy-rock venue in the UK. Seated only, boxes come up rarely on resale. Formal attire often expected."
  }
];

const FAQS = [
  {
    q: "When do 2026 London concert tickets usually go on sale?",
    a: "Expect two big windows: (1) artist fan-club and Spotify pre-sales in late September–November 2025 and (2) general on-sale via Ticketmaster UK in January–March 2026. O2 Arena residencies sometimes drop tickets as late as April. Join our notify list and we'll alert you 24 hours before public sale."
  },
  {
    q: "How much do London concert tickets cost in 2026?",
    a: "Typical 2026 London pricing — Stadium tours (Wembley/Tottenham): £90–£350. O2 Arena mid-tier tours: £70–£150. OVO Arena Wembley: £55–£120. Alexandra Palace: £45–£80. Historic venues (Royal Albert Hall): £60–£220 depending on act. VIP packages typically start £250 and can reach £2,000 at Wembley."
  },
  {
    q: "What's the best way to get to Wembley Stadium for a concert?",
    a: "Use Wembley Park (Jubilee + Metropolitan lines, 8-minute walk) for the best post-show service — trains run until ~12:30am on concert nights. Wembley Central (Bakerloo + Overground) has fewer queues but is a 12-minute walk. Driving is strongly discouraged — the entire Brent parking zone is event-controlled."
  },
  {
    q: "Is resale legal for 2026 London concerts?",
    a: "Yes — the UK permits face-value and above-face-value resale except for certain football and cricket fixtures. Our marketplace operates under UK Secondary Ticketing Regulations, with full seller ID verification and buyer protection. Tickets are delivered as mobile QRs or transferred via Ticketmaster Account Manager where the original issuer supports it."
  },
  {
    q: "Which London venue has the best acoustics for a concert?",
    a: "For a pure-audio experience, the Royal Albert Hall's new 2023 acoustic refit is unrivalled — every seat is within 67m of the stage. For a big-show feel with crisp sound, The O2's mid-arena blocks (sections 101–106) are far above industry average for an indoor arena. Avoid top-tier Wembley Stadium seats where sound delay noticeably degrades."
  },
  {
    q: "How do I spot a scam ticket for a London concert?",
    a: "Three red flags: (1) A seller-only email address with no marketplace escrow, (2) prices more than 40% below verified resale averages, (3) immediate delivery of a PDF with no name on it. Our platform intercepts all three — all sellers are ID-verified, payments are escrowed until the show date, and we refund 100% if any ticket fails at the door."
  }
];

export default function ConcertsLondon2026Page() {
  return (
    <CityDemandPage
      city="London"
      title="Concerts in London 2026"
      year={2026}
      canonical={CANONICAL}
      heroImage="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1600"
      heroTagline="Every confirmed 2026 concert in London — across Wembley, Tottenham, The O2, Alexandra Palace and more — with live pricing, venue guides, and a notify list for the tours that haven't dropped yet."
      introParagraphs={INTRO}
      venueGuide={VENUE_GUIDE}
      faqs={FAQS}
    />
  );
}
