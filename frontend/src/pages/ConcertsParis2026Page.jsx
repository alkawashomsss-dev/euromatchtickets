import CityDemandPage from "../components/CityDemandPage";

const CANONICAL = "https://euromatchtickets.com/concerts-in-paris-2026";

const INTRO = [
  "Paris is the cultural powerhouse of continental Europe in 2026 — hosting over 180 major ticketed concerts annually across a blend of legendary arenas (Accor Arena Bercy, La Défense Arena) and historic theatres (Olympia, L'Olympia, Le Zénith). From stadium world tours to intimate chanson nights, the city sells more concert tickets per capita than any other European capital outside London.",
  "This page is our single source of truth for every confirmed 2026 Paris concert. We pull live data directly from Live Nation France, AEG Presents, Fimalac, and official venue calendars. Every listing below includes the on-sale status, venue, date, cheapest verified seat price, and a notify button for tours that haven't yet been announced. Refreshed nightly — no stale data.",
  "Paris 2026 pricing is trending sharply upward: Beyoncé at Stade de France doubled in ten minutes, Taylor Swift at La Défense Arena hit €680 on secondary within a day of the on-sale, and even mid-tier Accor Arena shows now average €95 versus €68 in 2023. The fastest way to beat dynamic pricing is pre-sale notify — we alert subscribers ~24 hours before general sale."
];

const VENUE_GUIDE = [
  {
    name: "Stade de France",
    capacity: "80,000",
    type: "National stadium",
    blurb: "France's biggest venue — hosts Beyoncé, Coldplay, Rammstein on stadium world tours. Pitch standing + tiered seats up to level 5. Ten minutes from Gare du Nord via RER B/D."
  },
  {
    name: "Paris La Défense Arena",
    capacity: "40,000",
    type: "Indoor arena",
    blurb: "Europe's largest indoor concert venue — Taylor Swift, The Weeknd, Harry Styles. Retractable pitch + tiered seating. Excellent acoustics despite the scale."
  },
  {
    name: "Accor Arena",
    capacity: "20,300",
    type: "Indoor arena",
    blurb: "Previously Bercy Arena — Paris's flagship arena for world tours. Dua Lipa, Kendrick Lamar, Lana Del Rey. Seated blocks K-N give the cleanest sound."
  },
  {
    name: "Le Zénith Paris",
    capacity: "6,300",
    type: "Indoor arena",
    blurb: "The mid-scale go-to — francophone stars and international indie tours. Standing pit + tiered seating. Best value tier of the Paris arena circuit."
  },
  {
    name: "L'Olympia",
    capacity: "2,000",
    type: "Historic theatre",
    blurb: "The most legendary Paris music hall — Piaf, Hallyday, Aznavour all played here. Intimate seated configuration, prestige residencies, tickets resale rarely."
  },
  {
    name: "Philharmonie de Paris",
    capacity: "2,400",
    type: "Concert hall",
    blurb: "Jean Nouvel's 2015 acoustic masterpiece in La Villette. Classical, jazz and electronic crossover tours. Every seat is world-class."
  }
];

const FAQS = [
  {
    q: "When do 2026 Paris concert tickets usually go on sale?",
    a: "Two main windows: (1) artist and fan-club pre-sales in late September–November 2025, and (2) general on-sale via Fnac Spectacles and Ticketmaster France in January–March 2026. Stade de France stadium tours often open earlier. Join our notify list and we'll alert you 24 hours before public sale."
  },
  {
    q: "How much do Paris concert tickets cost in 2026?",
    a: "Typical 2026 Paris pricing — Stadium tours (Stade de France / La Défense Arena): €95–€380. Accor Arena mid-tier tours: €75–€160. Le Zénith: €55–€110. L'Olympia: €60–€200 depending on artist prestige. VIP packages start €280 and reach €2,200 at Stade de France."
  },
  {
    q: "What's the best way to get to Paris La Défense Arena?",
    a: "Use RER A or Metro Line 1 to La Défense – Grande Arche, then a 7-minute covered walk. On concert nights, RER A runs extended service until ~1:30am. Driving is not recommended — La Défense underground car parks fill up 3 hours before showtime."
  },
  {
    q: "Is concert ticket resale legal in France?",
    a: "Yes — resale is legal under French consumer law for most concerts, provided the seller is clearly identified and the buyer protected. Our marketplace operates under full French tax compliance with seller ID verification and escrowed payments. Tickets are delivered as mobile QRs or official transfers when supported."
  },
  {
    q: "Which Paris venue has the best acoustics?",
    a: "For pure audio: the Philharmonie de Paris is world-class — every seat is acoustically engineered. For a big-show feel: Accor Arena's mid-arena blocks (K-N) punch above most European arenas. For historic atmosphere: L'Olympia is intimate and beautifully balanced."
  },
  {
    q: "How do I avoid ticket scams for Paris concerts?",
    a: "Three red flags: (1) A seller-only email with no marketplace escrow, (2) prices more than 40% below verified resale averages, (3) immediate PDF delivery with no name attached. Our platform blocks all three — all sellers are ID-verified, payments escrowed until the show, and we refund 100% if any ticket fails at the door."
  }
];

export default function ConcertsParis2026Page() {
  return (
    <CityDemandPage
      city="Paris"
      title="Concerts in Paris 2026"
      year={2026}
      canonical={CANONICAL}
      heroImage="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600"
      heroTagline="Every confirmed 2026 concert in Paris — Stade de France, La Défense Arena, Accor Arena, Le Zénith, L'Olympia — with live pricing and pre-sale notifications."
      introParagraphs={INTRO}
      venueGuide={VENUE_GUIDE}
      faqs={FAQS}
    />
  );
}
