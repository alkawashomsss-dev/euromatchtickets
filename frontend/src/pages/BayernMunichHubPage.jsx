import LiveClubHubPage from "../components/LiveClubHubPage";

export default function BayernMunichHubPage() {
  return (
    <LiveClubHubPage
      club="Bayern Munich"
      slug="bayern-munich-tickets"
      homeTeamKey="bayern"
      stadium="Allianz Arena"
      city="Munich"
      country="Germany"
      heroStyle="bg-gradient-to-br from-red-900 via-red-800 to-slate-950"
      accent="bg-red-700"
      faqs={[
        { q: "When do Bayern Munich tickets go on sale?", a: "Bundesliga and Champions League matches are released 14–30 days before each match. Season-ticket holders get first priority; general public sale opens after. Join the waitlist and we'll alert you within 24h of each new Allianz Arena drop." },
        { q: "What's the best section at Allianz Arena?", a: "Categories 1 and 2 on the long side (sections 112–116 lower / 212–216 upper) are the most balanced views. For atmosphere, the Südkurve (south end) is home to Bayern's most active supporters. The translucent Allianz façade lights red on every matchday." },
        { q: "How will my Bayern Munich tickets be delivered?", a: "All listings are delivered as mobile QR codes or via the official DFL ticket transfer system. No paper tickets needed." },
      ]}
      relatedLinks={[
        { to: "/champions-league-tickets", label: "Champions League", hint: "2026 knockout rounds" },
        { to: "/bundesliga", label: "Bundesliga", hint: "German league matches" },
        { to: "/city-tickets/munich", label: "Munich events", hint: "All events in Munich" },
      ]}
    />
  );
}
