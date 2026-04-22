import LiveClubHubPage from "../components/LiveClubHubPage";

export default function ManCityHubPage() {
  return (
    <LiveClubHubPage
      club="Manchester City"
      slug="manchester-city-tickets"
      homeTeamKey="manchester city"
      stadium="Etihad Stadium"
      city="Manchester"
      country="UK"
      heroStyle="bg-gradient-to-br from-sky-900 via-blue-900 to-slate-950"
      accent="bg-sky-700"
      faqs={[
        { q: "When do Manchester City tickets go on sale?", a: "Premier League and UEFA fixtures at the Etihad are released 14–21 days before each match. Cityzens members get first priority. Join the waitlist for alerts within 24h of each new Etihad listing." },
        { q: "Best sections at the Etihad?", a: "Colin Bell Stand central blocks (West Stand Level 1) give you the purest halfway-line view. For atmosphere, South Stand Level 1 is traditionally the most vocal. The stadium's North Stand expansion adds ~7,900 more seats from the 2025/26 season." },
        { q: "How are Manchester City tickets delivered?", a: "Mobile QR codes via the Premier League digital transfer system. Delivery confirmation arrives the day the ticket drops." },
      ]}
      relatedLinks={[
        { to: "/champions-league-tickets", label: "Champions League", hint: "2026 knockout rounds" },
        { to: "/city-tickets/manchester", label: "Manchester events", hint: "All events in Manchester" },
        { to: "/premier-league", label: "Premier League", hint: "English top-flight matches" },
      ]}
    />
  );
}
