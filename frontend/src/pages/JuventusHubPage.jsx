import LiveClubHubPage from "../components/LiveClubHubPage";

export default function JuventusHubPage() {
  return (
    <LiveClubHubPage
      club="Juventus"
      slug="juventus-tickets"
      homeTeamKey="juventus"
      stadium="Allianz Stadium"
      city="Turin"
      country="Italy"
      heroStyle="bg-gradient-to-br from-black via-slate-900 to-zinc-950"
      accent="bg-zinc-900"
      faqs={[
        { q: "When do Juventus tickets go on sale?", a: "Serie A and Champions League matches are released 10–21 days before each match on the official Juventus platform and partner resellers. Join the waitlist for alerts within 24 hours of each new Allianz Stadium drop." },
        { q: "What's the best section at the Allianz Stadium Torino?", a: "Tribuna Sud (sections 103–108) sits directly above the halfway line — the cleanest central view. Curva Sud is home to the most active Bianconeri supporters." },
        { q: "How are Juventus tickets delivered?", a: "All listings are delivered as mobile QR codes or via the Lega Serie A digital ticket transfer system. No paper tickets." },
      ]}
      relatedLinks={[
        { to: "/champions-league-tickets", label: "Champions League", hint: "2026 knockout rounds" },
        { to: "/city-tickets/turin", label: "Turin events", hint: "All events in Turin" },
        { to: "/serie-a", label: "Serie A", hint: "Italian league matches" },
      ]}
    />
  );
}
