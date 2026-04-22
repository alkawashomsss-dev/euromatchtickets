import LiveClubHubPage from "../components/LiveClubHubPage";

export default function BarcelonaHubPage() {
  return (
    <LiveClubHubPage
      club="FC Barcelona"
      slug="barcelona-tickets"
      homeTeamKey="barcelona"
      stadium="Spotify Camp Nou"
      city="Barcelona"
      country="Spain"
      heroStyle="bg-gradient-to-br from-blue-900 via-rose-900 to-slate-950"
      accent="bg-rose-700"
      faqs={[
        { q: "When do Barcelona tickets go on sale for 2026?", a: "La Liga and Champions League fixtures are released in staggered windows, usually 14–21 days before the match. Members/socios get priority access, then general on-sale opens on the official FCB and partner platforms. Join the waitlist and we'll alert you within 24h of each new Camp Nou listing." },
        { q: "Which Camp Nou section has the best view?", a: "Tribuna Central (sections 138–142) sits on the halfway line — the classic TV-angle experience. For atmosphere, Gol Nord (traditional home-end) is where the most vocal supporters gather. Construction of the renovated Spotify Camp Nou updated seat-numbering in 2024." },
        { q: "How will Barcelona tickets be delivered?", a: "All listings are delivered as mobile QR codes or via the official La Liga / FCB digital ticket system. You receive confirmation as soon as the ticket drops into your email." },
        { q: "Can I get a refund if the match is rescheduled?", a: "Yes — our cancellation refund policy applies automatically to every purchase. If the match is cancelled or rescheduled without a new confirmed date, you receive a full refund." },
      ]}
      relatedLinks={[
        { to: "/event/el-clasico-2026-tickets", label: "El Clásico 2026", hint: "vs Real Madrid" },
        { to: "/real-madrid-tickets", label: "Real Madrid", hint: "Bernabéu tickets" },
        { to: "/champions-league-tickets", label: "Champions League", hint: "2026 knockout rounds" },
        { to: "/city-tickets/barcelona", label: "Barcelona events", hint: "All events in Barcelona" },
      ]}
    />
  );
}
