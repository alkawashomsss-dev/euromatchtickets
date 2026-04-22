import LiveClubHubPage from "../components/LiveClubHubPage";

export default function LiverpoolHubPage() {
  return (
    <LiveClubHubPage
      club="Liverpool"
      slug="liverpool-tickets"
      homeTeamKey="liverpool"
      stadium="Anfield"
      city="Liverpool"
      country="UK"
      heroStyle="bg-gradient-to-br from-red-900 via-red-950 to-slate-950"
      accent="bg-red-700"
      faqs={[
        { q: "When do Liverpool tickets go on sale?", a: "Premier League and UEFA fixtures at Anfield are released 14–21 days before each match. Members get first priority. Join the waitlist for alerts within 24h of each new Anfield listing." },
        { q: "Best sections at Anfield?", a: "Main Stand Lower Block L5–L10 delivers a classic central view. The Kop (Blocks 205–208) is Liverpool's iconic atmosphere end — the home of 'You'll Never Walk Alone'. The renovated Anfield Road end now adds ~7,000 more seats." },
        { q: "How will Liverpool tickets be delivered?", a: "All tickets are delivered as mobile QR codes or via the Premier League transfer system. No paper tickets." },
      ]}
      relatedLinks={[
        { to: "/champions-league-tickets", label: "Champions League", hint: "2026 knockout rounds" },
        { to: "/city-tickets/liverpool", label: "Liverpool events", hint: "All events in Liverpool" },
        { to: "/premier-league", label: "Premier League", hint: "English top-flight matches" },
      ]}
    />
  );
}
