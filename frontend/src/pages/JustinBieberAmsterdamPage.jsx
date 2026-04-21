import ComingSoonEvent from "../components/ComingSoonEvent";

/**
 * Justin Bieber Amsterdam 2026 — Coming Soon Page
 * ================================================
 * No official dates announced as of Feb 2026. This page MUST stay noindex
 * (enforced server-side via UNVERIFIED_DEMAND_PAGES AND client-side via
 * the <meta robots> in ComingSoonEvent) until Bieber's team confirms a
 * Johan Cruijff ArenA date on his official channels.
 *
 * Promotion to a full event page:
 *   1. Remove the slug from /app/backend/services/event_validator.py
 *   2. Seed a real event row in `events` collection with confirmed date/venue
 *   3. Swap this file back to a full marketing page
 */

const CANONICAL = "https://euromatchtickets.com/justin-bieber-amsterdam-2026-tickets";
const EVENT_SLUG = "justin-bieber-amsterdam-2026-tickets";

const FAQS = [
  {
    q: "Is Justin Bieber confirmed to play Amsterdam in 2026?",
    a: "No. As of February 2026, Justin Bieber has not officially announced a 2026 Amsterdam concert at Johan Cruijff ArenA or any other Dutch venue. Any site claiming to sell confirmed 2026 Amsterdam tickets right now is doing so without official backing. We refuse to list speculative tickets — the moment Bieber's team drops a date, you'll hear from us first.",
  },
  {
    q: "When will Justin Bieber next tour Europe?",
    a: "Bieber's last European run was his 'Justice World Tour' (2022–2023), which was cut short. His team has hinted at a return tour tied to a new studio album, with Amsterdam's Johan Cruijff ArenA traditionally featuring in his European legs. We'll update this page within minutes of an official announcement.",
  },
  {
    q: "How do I get tickets before the general public?",
    a: "Join the notify list above. Subscribers receive the on-sale link roughly 24 hours before the general release. No spam — one single email when tickets drop, plus you'll know the exact presale code and venue layout.",
  },
  {
    q: "Why don't you just sell tickets like other sites?",
    a: "Because Google and our customers both penalise marketplaces that hype non-existent events. We'd rather wait for real dates than burn trust. Every ticket we eventually list is backed by our 100% Money-Back Guarantee and verified seller checks.",
  },
  {
    q: "What venue will Justin Bieber most likely play in Amsterdam?",
    a: "Based on past tours and current European stadium scheduling, the Johan Cruijff ArenA (capacity ~55,000) is the most likely venue for a Bieber Amsterdam date. The Ziggo Dome (~17,000) is also possible for a more intimate arena leg. We'll confirm as soon as the official tour routing drops.",
  },
];

const RELATED = [
  { title: "Coldplay Music of the Spheres — Barcelona 2026", href: "/coldplay-tour-2026", city: "Barcelona" },
  { title: "Taylor Swift — Wembley London 2026", href: "/taylor-swift-london-tickets", city: "London" },
  { title: "Bruno Mars European Tour 2026", href: "/bruno-mars-tour-2026", city: "Europe" },
  { title: "Bad Bunny — Tottenham London 2026", href: "/bad-bunny-london-2026", city: "London" },
];

const PAST_TOURS = (
  <>
    <p>
      Justin Bieber is a Canadian pop superstar whose last European stadium run
      was the <strong>Justice World Tour</strong> (2022–2023), which sold out Amsterdam's
      Johan Cruijff ArenA twice before being truncated for health reasons.
      Historically he has played Amsterdam on every major tour since 2013's
      Believe Tour.
    </p>
    <p>
      Industry insiders expect Bieber's next European run to tie in with a new
      studio album release. Typical routing places an Amsterdam stop between
      Paris and Berlin in the summer window (June–August).
    </p>
  </>
);

export default function JustinBieberAmsterdamPage() {
  return (
    <ComingSoonEvent
      artist="Justin Bieber"
      city="Amsterdam"
      venueGuess="Johan Cruijff ArenA"
      eventSlug={EVENT_SLUG}
      canonical={CANONICAL}
      heroImage="https://images.unsplash.com/photo-1770067665792-9975acdec4fb?w=1600"
      pastToursSummary={PAST_TOURS}
      faqs={FAQS}
      relatedLinks={RELATED}
    />
  );
}
