import LiveClubHubPage from "../components/LiveClubHubPage";

export default function PSGHubPage() {
  return (
    <LiveClubHubPage
      club="Paris Saint-Germain"
      slug="psg-tickets"
      homeTeamKey="psg"
      stadium="Parc des Princes"
      city="Paris"
      country="France"
      heroStyle="bg-gradient-to-br from-blue-950 via-slate-900 to-red-950"
      accent="bg-blue-700"
      faqs={[
        { q: "When do PSG tickets go on sale?", a: "Ligue 1 and Champions League matches are released in batches 10–21 days before each match, with members/abonnés getting first priority. Join the waitlist for alerts within 24h of each new Parc des Princes listing." },
        { q: "Best sections at Parc des Princes?", a: "Tribune Borelli Centrale (sections A–H, rows 10–25) gives the cleanest central view. For atmosphere, Virage Auteuil and Virage Boulogne are the traditional ultras ends. The compact bowl means every seat feels close to the pitch." },
        { q: "How are PSG tickets delivered?", a: "All listings are delivered as mobile QR codes or via the LFP official transfer system. Confirmation arrives by email the day the ticket drops." },
      ]}
      relatedLinks={[
        { to: "/champions-league-tickets", label: "Champions League", hint: "2026 knockout rounds" },
        { to: "/city-tickets/paris", label: "Paris events", hint: "All events in Paris" },
        { to: "/concerts-in-paris-2026", label: "Paris concerts 2026", hint: "Stade de France, La Défense Arena" },
      ]}
    />
  );
}
