import ComingSoonEvent from "../components/ComingSoonEvent";

/**
 * Taylor Swift London — Coming Soon
 * ==================================
 * The Eras Tour officially ended on December 8, 2024 in Vancouver.
 * Taylor Swift has NOT announced any 2026 European tour as of Feb 2026.
 * This page is therefore "speculative demand" — noindex + notify list only,
 * zero Product / Offer schema, zero hardcoded dates or prices.
 *
 * Promote to a full event page when an official announcement lands:
 *   1. Remove slug from UNVERIFIED_DEMAND_PAGES
 *   2. Seed a proper events row with confirmed date + venue
 *   3. Swap this file for the full marketing page again
 */

const CANONICAL = "https://euromatchtickets.com/taylor-swift-london-tickets";
const EVENT_SLUG = "taylor-swift-london-tickets";

const FAQS = [
  {
    q: "Has Taylor Swift announced a 2026 London tour?",
    a: "No. The Eras Tour officially ended on December 8, 2024 in Vancouver after 152 shows across five continents. As of February 2026, Taylor Swift's team has not announced any 2026 European or UK tour dates. Any site claiming to sell confirmed 2026 Taylor Swift Wembley tickets is doing so without official backing — we refuse to list speculative tickets.",
  },
  {
    q: "Will Taylor Swift tour again?",
    a: "Almost certainly. Her typical album cycle since 2019 (Lover, Folklore, Evermore, Midnights, The Tortured Poets Department) has produced a new tour within 12–24 months of release. Industry insiders expect a new studio album announcement in 2026, which would most likely be followed by a 2027 global tour. We track her team's statements and venue availability daily.",
  },
  {
    q: "Which London venue is Taylor Swift most likely to play next?",
    a: "Wembley Stadium (90,000 capacity) is Taylor's proven London home — she played 8 sold-out nights there on the Eras Tour in June–August 2024. Any future UK tour is overwhelmingly likely to anchor again at Wembley, with Tottenham Hotspur Stadium as a possible alternative for shorter runs.",
  },
  {
    q: "How do I get Taylor Swift tickets before everyone else?",
    a: "Join the notify list above. Subscribers receive the pre-sale link roughly 24 hours before general sale, plus the exact presale code if Ticketmaster UK requires one. No spam — one single email when tickets drop. Unsubscribe anytime.",
  },
  {
    q: "Why don't you just list 2026 tickets like other resale sites?",
    a: "Because listing tickets for a show that hasn't been officially announced is either (a) fraud or (b) a Google trust killer. We don't do either. Every ticket we eventually list is backed by our 100% Money-Back Guarantee and verified seller checks. The wait is worth it.",
  },
];

const RELATED = [
  { title: "Bad Bunny — Tottenham London 2026", href: "/bad-bunny-london-2026", city: "London" },
  { title: "Coldplay Music of the Spheres — Barcelona 2026", href: "/coldplay-tour-2026", city: "Barcelona" },
  { title: "Bruno Mars European Tour 2026", href: "/bruno-mars-tour-2026", city: "Europe" },
  { title: "Concerts in London 2026 — Full Schedule", href: "/concerts-in-london-2026", city: "London" },
];

const ABOUT = (
  <>
    <p>
      Taylor Swift is the biggest touring artist of the modern era. Her{" "}
      <strong>Eras Tour</strong> (2023–2024) grossed over $2 billion across 152
      shows — the highest-earning tour in history. She played 8 sold-out nights
      at London's Wembley Stadium in June and August 2024, earning rave reviews
      from critics and a Guinness World Record for most-attended tour.
    </p>
    <p>
      Typical Swift tour routing places London in the opening European leg
      (late May – early July), with 4–8 Wembley Stadium nights per run. Every
      Eras Tour Wembley date sold out within 60 minutes of going on sale.
    </p>
  </>
);

export default function TaylorSwiftLondonPage() {
  return (
    <ComingSoonEvent
      artist="Taylor Swift"
      city="London"
      venueGuess="Wembley Stadium"
      eventSlug={EVENT_SLUG}
      canonical={CANONICAL}
      heroImage="https://static.prod-images.emergentagent.com/jobs/fa0e14ae-0b28-4fd8-8e2c-ef65d5d1312a/images/179fab45cb26f4e79ff09209edf9509006448cd135721a81d016af1fd59c132e.png"
      pastToursSummary={ABOUT}
      faqs={FAQS}
      relatedLinks={RELATED}
    />
  );
}
