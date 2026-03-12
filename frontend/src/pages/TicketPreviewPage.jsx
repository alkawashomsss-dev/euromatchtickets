import { ProfessionalTicket } from "../components/ProfessionalTicket";

const demoOrder = {
  order_id: "ord-2026-a8f3c9e1",
  ticket_id: "ticket_demo_001",
  ticket_price: 289.00,
  commission: 43.35,
  total_amount: 332.35,
  status: "completed",
  event: {
    title: "Real Madrid vs FC Barcelona - El Clasico",
    subtitle: "LaLiga 2025/26 - Matchday 32",
    event_type: "match",
    event_date: "2026-04-18T21:00:00Z",
    venue: "Santiago Bernabeu Stadium",
    city: "Madrid",
    country: "Spain",
    event_image: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg",
  },
  ticket: {
    category: "cat1",
    section: "North Stand",
    row: "F",
    seat: "24",
  },
};

const demoOrderF1 = {
  order_id: "ord-2026-b7e2d4f0",
  ticket_id: "ticket_demo_002",
  ticket_price: 549.00,
  commission: 82.35,
  total_amount: 631.35,
  status: "completed",
  event: {
    title: "Formula 1 Monaco Grand Prix 2026",
    subtitle: "FIA Formula One World Championship",
    event_type: "f1",
    event_date: "2026-05-24T14:00:00Z",
    venue: "Circuit de Monaco",
    city: "Monte Carlo",
    country: "Monaco",
  },
  ticket: {
    category: "grandstand",
    section: "K",
    row: "12",
    seat: "8",
  },
};

const demoOrderConcert = {
  order_id: "ord-2026-c4a1f8d2",
  ticket_id: "ticket_demo_003",
  ticket_price: 195.00,
  commission: 29.25,
  total_amount: 224.25,
  status: "completed",
  event: {
    title: "The Weeknd - After Hours Til Dawn Tour",
    subtitle: "European Leg 2026",
    event_type: "concert",
    event_date: "2026-07-12T20:00:00Z",
    venue: "Wembley Stadium",
    city: "London",
    country: "United Kingdom",
  },
  ticket: {
    category: "floor",
    section: "A",
    row: "3",
    seat: "15",
  },
};

const TicketPreviewPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 pt-20" data-testid="ticket-preview-page">
      <div className="max-w-[900px] mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Your Ticket Experience</h1>
          <p className="text-zinc-400">Every purchase includes a professional digital ticket with QR code</p>
        </div>

        <div className="space-y-12">
          <div>
            <h2 className="text-lg font-semibold text-zinc-400 mb-4">Football Match Ticket</h2>
            <ProfessionalTicket order={demoOrder} />
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-zinc-400 mb-4">Formula 1 Grand Prix Ticket</h2>
            <ProfessionalTicket order={demoOrderF1} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-zinc-400 mb-4">Concert Ticket</h2>
            <ProfessionalTicket order={demoOrderConcert} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPreviewPage;
