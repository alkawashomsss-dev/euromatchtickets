import LiveClubHubPage from "../components/LiveClubHubPage";

export default function RealMadridHubPage() {
  return (
    <LiveClubHubPage
      club="Real Madrid"
      slug="real-madrid-tickets"
      homeTeamKey="real madrid"
      stadium="Santiago Bernabéu"
      city="Madrid"
      country="Spain"
      heroStyle="bg-gradient-to-br from-white via-slate-100 to-white"
      accent="bg-slate-900"
      faqs={[
        {
          q: "When do Real Madrid tickets go on sale for 2026?",
          a: "La Liga and Champions League fixtures are released in batches throughout the season. General on-sale typically opens 10–20 days before each match on the Real Madrid membership portal and partner platforms. Join the free waitlist above and we'll alert you within 24 hours of any new Bernabéu listing going live.",
        },
        {
          q: "What's the best section at Santiago Bernabéu?",
          a: "Lateral Bajo Central (sections 100–108, rows 5–15) offers the cleanest central view with proximity to the pitch. For atmosphere, Fondo Sur (sections 140–148) is traditionally where the most active supporters sit. The newly renovated retractable roof means every seat is now weather-protected.",
        },
        {
          q: "How do Real Madrid matchday tickets get delivered?",
          a: "All listings are delivered as mobile QR codes or via the official Real Madrid/La Liga transfer system. You receive a delivery confirmation the day the ticket drops. No printing required.",
        },
        {
          q: "Is it legal to resell Real Madrid tickets in Spain?",
          a: "Yes — secondary-market resale is legal in Spain for most fixtures, provided the seller is identified and the buyer protected by escrow. Our marketplace operates under full Spanish consumer law with verified-seller ID checks and buyer-protection refunds.",
        },
        {
          q: "Can I get a refund if the match is postponed?",
          a: "Yes. Every EuroMatchTickets purchase includes a cancellation refund policy: if the match is cancelled or rescheduled without a replacement date, you receive a full refund automatically.",
        },
      ]}
      relatedLinks={[
        { to: "/event/el-clasico-2026-tickets", label: "El Clásico 2026", hint: "vs FC Barcelona" },
        { to: "/barcelona-tickets", label: "FC Barcelona", hint: "Camp Nou tickets" },
        { to: "/champions-league-tickets", label: "Champions League", hint: "2026 knockout rounds" },
        { to: "/city-tickets/madrid", label: "Madrid events", hint: "All events in Madrid" },
      ]}
    />
  );
}
