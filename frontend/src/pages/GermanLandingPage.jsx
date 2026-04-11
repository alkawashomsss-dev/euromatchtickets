import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Shield, Star, Ticket, Trophy, Zap, ChevronRight, Music, Flag, Bike } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";

const GermanLandingPage = () => {
  const navigate = useNavigate();
  const [viewersNow, setViewersNow] = useState(198);

  useEffect(() => {
    const i = setInterval(() => setViewersNow(p => Math.max(140, p + Math.floor(Math.random() * 11) - 5)), 5000);
    return () => clearInterval(i);
  }, []);

  const events = [
    { titel: "Champions League Finale 2026", datum: "30. Mai 2026", ort: "San Siro, Mailand", preis: 89, icon: Trophy, link: "/champions-league-tickets", tag: "SEHR BELIEBT" },
    { titel: "Bayern München vs Real Madrid", datum: "April 2026", ort: "Allianz Arena, München", preis: 59, icon: Trophy, link: "/bayern-vs-real-madrid-tickets", tag: "UCL" },
    { titel: "Formel 1 - Großer Preis von Monaco", datum: "Mai 2026", ort: "Circuit de Monaco", preis: 99, icon: Flag, link: "/f1-monaco-grand-prix-tickets", tag: "PREMIUM" },
    { titel: "FIFA Weltmeisterschaft 2026", datum: "Jun-Jul 2026", ort: "USA, Mexiko, Kanada", preis: 89, icon: Trophy, link: "/world-cup-2026", tag: "EVENT DES JAHRES" },
    { titel: "Rammstein Europa Tour 2026", datum: "Sommer 2026", ort: "Verschiedene Städte", preis: 79, icon: Music, link: "/events", tag: "AUSVERKAUFT" },
    { titel: "Bundesliga - BVB vs Bayern", datum: "Saison 2026", ort: "Signal Iduna Park", preis: 49, icon: Trophy, link: "/events", tag: "DER KLASSIKER" },
  ];

  const vorteile = [
    { titel: "Günstigste Preise", desc: "Wir garantieren die besten Preise auf dem Markt. Günstiger als StubHub & Viagogo!", icon: Zap },
    { titel: "100% Garantiert", desc: "Alle Tickets verifiziert mit unserer FanProtect-Garantie. Ihr Geld ist sicher.", icon: Shield },
    { titel: "Sofortige Lieferung", desc: "Erhalten Sie Ihre Tickets sofort per E-Mail. QR-Code bereit zum Scannen.", icon: Ticket },
    { titel: "4,8/5 Sterne", desc: "Tausende zufriedene Kunden in ganz Europa. Lesen Sie unsere Bewertungen.", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-[#1e1e1e]" data-testid="german-landing-page">
      <SEOHead
        title="Tickets Kaufen - Champions League, F1, Bundesliga"
        description="Kaufen Sie Tickets für Champions League, F1, Bundesliga, Konzerte und mehr. Günstigste Preise garantiert. Sofortige Lieferung per QR. FanProtect Garantie."
        keywords="tickets kaufen, champions league tickets, f1 tickets kaufen, bundesliga tickets, konzert tickets, tickets online kaufen, günstige tickets europa, rammstein tickets, bayern münchen tickets"
        canonical="https://euromatchtickets.com/de/tickets-kaufen"
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-950 via-amber-950 to-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-amber-500/100 rounded-full blur-3xl anim-pulse-slow" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-600 rounded-full blur-3xl anim-pulse-slow" style={{animationDelay: '2s'}} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 bg-amber-600/20 border border-amber-500/30 rounded-full px-4 py-1.5 text-sm mb-6 anim-fade-in">
            <span className="w-2 h-2 bg-amber-500/100 rounded-full anim-blink" />
            <span>{viewersNow} Personen kaufen gerade</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 leading-tight anim-slide-up">
            Tickets Online Kaufen<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-red-500">Die Günstigsten Preise Europas</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-8 anim-slide-up" style={{animationDelay: '0.15s'}}>
            Champions League, Bundesliga, Formel 1, MotoGP, exklusive Konzerte. Unschlagbare Preise mit sofortiger Lieferung und voller Garantie.
          </p>
          <div className="flex flex-wrap gap-4 anim-slide-up" style={{animationDelay: '0.3s'}}>
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg font-bold rounded-none" onClick={() => navigate("/events")}>
              Alle Tickets Ansehen <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-none" onClick={() => navigate("/bayern-vs-real-madrid-tickets")}>
              Bayern vs Real Madrid
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-6 mt-8 text-sm text-slate-400 anim-slide-up" style={{animationDelay: '0.45s'}}>
            <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-green-400" /> FanProtect Garantie</span>
            <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-yellow-400" /> Sofortige Lieferung</span>
            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" /> 4,8/5 (2.847 Bewertungen)</span>
          </div>
        </div>
      </section>

      {/* Vorteile */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {vorteile.map((v, i) => (
            <div key={i} className="text-center p-5 rounded-none border border-white/5 hover:border-amber-200 hover:shadow-lg transition-all anim-fade-in-up" style={{animationDelay: `${i * 0.1}s`}}>
              <v.icon className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <h3 className="font-bold text-white mb-1">{v.titel}</h3>
              <p className="text-sm text-slate-500">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Beliebte Events */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Beliebteste Events</h2>
        <p className="text-slate-500 mb-8">Die meistgesuchten Tickets in Europa - Preise ab nur €49</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((e, i) => (
            <Link key={i} to={e.link} className="group relative bg-[#1e1e1e] rounded-none border border-white/5 hover:border-amber-300 hover:shadow-xl transition-all overflow-hidden anim-fade-in-up" style={{animationDelay: `${i * 0.08}s`}}>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/10 text-amber-700 px-2 py-0.5 rounded-full">{e.tag}</span>
                  <e.icon className="w-5 h-5 text-slate-300 group-hover:text-amber-500 transition-colors" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2 group-hover:text-amber-600 transition-colors">{e.titel}</h3>
                <div className="space-y-1 text-sm text-slate-500">
                  <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{e.datum}</p>
                  <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{e.ort}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Ab</span>
                    <span className="text-2xl font-black text-white ml-1">€{e.preis}</span>
                  </div>
                  <span className="text-xs font-semibold text-amber-600 group-hover:translate-x-1 transition-transform flex items-center">
                    Kaufen <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SEO Content */}
      <section className="max-w-4xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-black text-white mb-4">Tickets Kaufen Online - Die Beste Plattform Europas</h2>
        <div className="prose prose-slate max-w-none text-slate-400 space-y-4">
          <p>
            <strong>EuroMatchTickets</strong> ist die führende Plattform zum Kauf von Tickets für Sportveranstaltungen und Konzerte in Europa. 
            Wir bieten die <strong>günstigsten Preise garantiert</strong> für die Champions League, Bundesliga, Premier League, Formel 1, 
            MotoGP und die exklusivsten Konzerte der Welt.
          </p>
          <p>
            Suchen Sie <strong>Tickets für Bayern München</strong>? <strong>Champions League Finale 2026 Tickets</strong>? 
            <strong>Formel 1 Tickets</strong>? Bei EuroMatchTickets finden Sie alle Tickets, die Sie brauchen, 
            mit sofortiger QR-Lieferung und unserer vollständigen FanProtect-Garantie.
          </p>
          <h3 className="text-xl font-bold text-white">Warum bei EuroMatchTickets kaufen?</h3>
          <ul>
            <li><strong>Unschlagbare Preise</strong> - Bis zu 40% günstiger als StubHub und Viagogo</li>
            <li><strong>FanProtect Garantie</strong> - 100% Rückerstattung bei Absage</li>
            <li><strong>Sofortige Lieferung</strong> - Erhalten Sie Ihre Tickets in Sekunden per E-Mail</li>
            <li><strong>+50.000 Tickets</strong> - Die größte Auswahl an Tickets in Europa</li>
            <li><strong>Sichere Zahlung</strong> - Visa, Mastercard, AMEX, Apple Pay, Google Pay</li>
          </ul>
          <h3 className="text-xl font-bold text-white">Verfügbare Tickets</h3>
          <p>
            Entdecken Sie unsere große Auswahl: <Link to="/champions-league-tickets" className="text-amber-600 hover:underline">Champions League Tickets</Link>, 
            <Link to="/bayern-vs-real-madrid-tickets" className="text-amber-600 hover:underline"> Bayern München Tickets</Link>, 
            <Link to="/f1-tickets" className="text-amber-600 hover:underline"> Formel 1 Tickets</Link>, 
            <Link to="/world-cup-2026" className="text-amber-600 hover:underline"> WM 2026 Tickets</Link>, 
            und <Link to="/events" className="text-amber-600 hover:underline">tausende weitere Events</Link>.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-700 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-black mb-3">Bereit für das Erlebnis?</h2>
          <p className="text-amber-100 mb-6">Kaufen Sie jetzt Ihre Tickets und sparen Sie bis zu 40% im Vergleich</p>
          <Button size="lg" className="bg-[#1e1e1e] text-amber-700 hover:bg-amber-500/10 font-bold text-lg px-10 py-6 rounded-none" onClick={() => navigate("/events")}>
            Tickets Entdecken <Ticket className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default GermanLandingPage;
