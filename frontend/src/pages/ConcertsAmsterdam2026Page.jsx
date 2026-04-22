import CityDemandPage from "../components/CityDemandPage";

const CANONICAL = "https://euromatchtickets.com/concerts-in-amsterdam-2026";

const INTRO = [
  "Amsterdam is the beating heart of European pop and electronic music in 2026. Between the 55,000-capacity Johan Cruijff ArenA, the purpose-built Ziggo Dome, and a dozen historic club-size venues, the city hosts more than 120 ticketed concerts a year — second only to London across mainland Europe.",
  "This page is the single source of truth for every confirmed Amsterdam concert we track in 2026. We refresh the list nightly from primary promoter feeds (Mojo Concerts, MOJO AGI, DGTL, Amsterdam Dance Event) plus venue box offices. If a tour has been officially announced with a date and on-sale window, it's here with live pricing. If it's still rumoured, you'll find it further down on the notify list so you can beat the general sale by 24 hours.",
  "Most arena tours in Amsterdam sell out inside an hour — especially the Johan Cruijff ArenA stadium slots in June through August. We typically see 20-40% discount on resale through our verified sellers within the first week after on-sale, and availability contracts sharply four weeks before the show. Bookmark this page or join a notify list to catch those price dips.",
];

const VENUE_GUIDE = [
  {
    name: "Johan Cruijff ArenA",
    capacity: "55,000",
    type: "Open-air stadium",
    blurb: "Home of Ajax and the city's main stadium-tier venue. Hosts Taylor Swift, Bieber, Coldplay — full production tours only. Standing GA on the pitch, seated tiers 1–3.",
  },
  {
    name: "Ziggo Dome",
    capacity: "17,000",
    type: "Indoor arena",
    blurb: "Purpose-built for concerts with some of Europe's best acoustics. Hosts mid-scale world tours — Lana Del Rey, The 1975, Stray Kids, Kendrick Lamar.",
  },
  {
    name: "AFAS Live",
    capacity: "6,000",
    type: "Indoor theatre",
    blurb: "Prestige club-tier venue near the ArenA. Hosts smaller legacy acts, comedy, and album-launch tours. Standing pit + balcony seating.",
  },
  {
    name: "Paradiso",
    capacity: "1,500",
    type: "Historic club",
    blurb: "The legendary converted church venue. Tiny and intimate. You see future headliners here 3 years before they play the Ziggo Dome.",
  },
  {
    name: "Melkweg",
    capacity: "1,500",
    type: "Club complex",
    blurb: "Two rooms, endlessly varied line-ups. Indie, hip-hop, electronic. One of Europe's most-respected small venues.",
  },
  {
    name: "RAI Amsterdam",
    capacity: "12,500",
    type: "Convention arena",
    blurb: "Used for major electronic events (Amsterdam Dance Event) and occasional pop stadium overflow.",
  },
];

const FAQS = [
  {
    q: "When do most Amsterdam 2026 concerts go on sale?",
    a: "Most major 2026 stadium tours sell during two windows: the pre-sale burst in October–December 2025 (fan clubs + Mastercard + venue members) and the general on-sale in January–March 2026. Electronic events like Amsterdam Dance Event typically drop tickets in May. Join a notify list to catch each on-sale instantly.",
  },
  {
    q: "Where is the Johan Cruijff ArenA and how do I get there?",
    a: "Johan Cruijff ArenA sits on Bijlmer Boulevard in Amsterdam Zuidoost, about 15 minutes from Amsterdam Centraal by direct train (Bijlmer ArenA station is 200m from the stadium). From Schiphol Airport it's 25 minutes by direct train. The ArenA runs additional trains for 90 minutes after every show.",
  },
  {
    q: "Are Amsterdam concert tickets cheaper than London or Berlin?",
    a: "On average, yes — typical GA standing at the Ziggo Dome runs €60–€90 versus £80–£120 at comparable London venues, and €70–€100 at Berlin Uber Arena. The gap narrows for stadium shows where global pricing aligns (Taylor Swift and Coldplay are priced identically across Europe).",
  },
  {
    q: "Is there a best seat for stadium shows at Johan Cruijff ArenA?",
    a: "For stadium concerts, Vak 111 and Vak 121 (sides, tier 1) give the best sight-line-to-price ratio. Tier 2 rings 215–220 offer clean views at the lowest seated price. Avoid rear-of-stage seating at the ArenA — it's a full curtain for most tours.",
  },
  {
    q: "How do I know a ticket from your site is real?",
    a: "Every ticket we list is backed by our Cancellation refund policy. Sellers are verified, payments are escrowed, and tickets are re-issued in your name when possible. If anything goes wrong at the venue door — you're refunded within 72 hours, no questions.",
  },
  {
    q: "Can I get accommodation + tickets as a package?",
    a: "Yes — we partner with Booking.com and venue-preferred hotels. After checkout you'll see a curated list of sub-€150/night hotels within 2km of your venue. We don't up-sell them; the commission goes to offset your booking fee.",
  },
];

export default function ConcertsAmsterdam2026Page() {
  return (
    <CityDemandPage
      city="Amsterdam"
      title="Concerts in Amsterdam 2026"
      year={2026}
      canonical={CANONICAL}
      heroImage="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1600"
      heroTagline="Every confirmed 2026 concert in Amsterdam — from the Johan Cruijff ArenA stadium tours to the Paradiso club nights — with live pricing and a notify list for the tours that haven't been announced yet."
      introParagraphs={INTRO}
      venueGuide={VENUE_GUIDE}
      faqs={FAQS}
    />
  );
}
