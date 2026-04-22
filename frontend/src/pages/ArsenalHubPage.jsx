import LiveClubHubPage from "../components/LiveClubHubPage";

export default function ArsenalHubPage() {
  return (
    <LiveClubHubPage
      club="Arsenal"
      slug="arsenal-tickets"
      homeTeamKey="arsenal"
      stadium="Emirates Stadium"
      city="London"
      country="UK"
      heroStyle="bg-gradient-to-br from-red-900 via-red-950 to-slate-950"
      accent="bg-red-700"
      faqs={[
        { q: "When do Arsenal tickets go on sale?", a: "Premier League and UEFA fixtures are released in staggered windows — Members sale first, then General sale. Public windows typically open 14–21 days before each match. Join the waitlist for alerts within 24h of each new Emirates listing." },
        { q: "Best Emirates Stadium sections?", a: "Lower Tier Block 8–17 gives you close proximity on the halfway line. For atmosphere, the North Bank (blocks 22–27) is home to Arsenal's most vocal supporters. Every seat is covered by the Emirates' wraparound roof." },
        { q: "How will Arsenal tickets be delivered?", a: "Tickets arrive as mobile QR codes or via the official Premier League transfer system. You're notified by email the day the ticket drops." },
      ]}
      relatedLinks={[
        { to: "/champions-league-tickets", label: "Champions League", hint: "2026 knockout rounds" },
        { to: "/city-tickets/london", label: "London events", hint: "All events in London" },
        { to: "/premier-league", label: "Premier League", hint: "English top-flight matches" },
      ]}
    />
  );
}
