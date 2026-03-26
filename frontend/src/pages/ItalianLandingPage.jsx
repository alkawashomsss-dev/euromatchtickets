import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Shield, Star, Ticket, Trophy, Zap, ChevronRight, Users, Music, Flag } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";
import { FAQStructuredData, BreadcrumbStructuredData } from "../components/StructuredData";

const ItalianLandingPage = () => {
  const navigate = useNavigate();
  const [viewersNow, setViewersNow] = useState(156);
  useEffect(() => {
    const i = setInterval(() => setViewersNow(p => Math.max(120, p + Math.floor(Math.random() * 11) - 5)), 5000);
    return () => clearInterval(i);
  }, []);

  const eventi = [
    { titolo: "Finale Champions League 2026", data: "30 Maggio 2026", luogo: "Allianz Arena, Monaco", prezzo: 85, icona: Trophy, link: "/champions-league-tickets", tag: "POPOLARE" },
    { titolo: "AC Milan - Champions League", data: "Feb-Mag 2026", luogo: "San Siro, Milano", prezzo: 95, icona: Trophy, link: "/champions-league-tickets", tag: "RICHIESTO" },
    { titolo: "Juventus vs Inter - Derby d'Italia", data: "Aprile 2026", luogo: "Allianz Stadium, Torino", prezzo: 85, icona: Trophy, link: "/events?type=match", tag: "DERBY" },
    { titolo: "Gran Premio d'Italia F1 2026", data: "Settembre 2026", luogo: "Monza, Milano", prezzo: 89, icona: Flag, link: "/f1-tickets", tag: "CLASSICO" },
    { titolo: "Taylor Swift - Eras Tour Milano", data: "2026", luogo: "San Siro, Milano", prezzo: 89, icona: Music, link: "/taylor-swift-tickets", tag: "ESAURITO PRESTO" },
    { titolo: "Coppa del Mondo FIFA 2026", data: "Giu-Lug 2026", luogo: "USA, Messico, Canada", prezzo: 89, icona: Trophy, link: "/world-cup-2026", tag: "EVENTO DELL'ANNO" },
  ];

  const vantaggi = [
    { titolo: "Prezzi Piu Bassi", desc: "Garantiamo i migliori prezzi sul mercato. Se trovi di meno, pareggiamo!", icona: Zap },
    { titolo: "100% Garantiti", desc: "Tutti i biglietti verificati con garanzia FanProtect. Rimborso totale.", icona: Shield },
    { titolo: "Consegna Istantanea", desc: "Ricevi i biglietti via email istantaneamente. QR code pronto.", icona: Ticket },
    { titolo: "4.8/5 Stelle", desc: "Migliaia di clienti soddisfatti in tutta Europa.", icona: Star },
  ];

  const faqs = [
    { question: "Come acquistare biglietti su EuroMatchTickets?", answer: "Scegli il tuo evento, seleziona i posti e paga in sicurezza. I biglietti arrivano istantaneamente via email come QR code." },
    { question: "I biglietti sono garantiti?", answer: "Si! Tutti i nostri biglietti sono verificati al 100% e protetti dalla garanzia FanProtect. Rimborso completo se l'evento viene cancellato." },
    { question: "Quanto costano i biglietti Champions League?", answer: "I biglietti Champions League partono da 85EUR per le partite della fase a gironi. Semifinali e finale da 195EUR." },
    { question: "Consegnate in Italia?", answer: "Si! Consegna istantanea via email in tutto il mondo. Il tuo QR code e pronto immediatamente." },
    { question: "Quali metodi di pagamento accettate?", answer: "Accettiamo Visa, Mastercard, American Express, PayPal e Apple Pay. Pagamenti sicuri con crittografia SSL." },
  ];

  const reviewSchema = {
    "@context": "https://schema.org", "@type": "Product",
    "name": "Biglietti EuroMatchTickets - Italia",
    "brand": { "@type": "Brand", "name": "EuroMatchTickets" },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "1834", "bestRating": "5" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "39", "highPrice": "2500" }
  };

  return (
    <div className="min-h-screen bg-white" data-testid="italian-landing-page">
      <SEOHead
        title="Comprare Biglietti - Champions League, F1, Concerti"
        description="Compra biglietti per Champions League, Serie A, F1 Monza, concerti e altro. Prezzi piu bassi garantiti. Consegna istantanea QR. Garanzia FanProtect."
        keywords="comprare biglietti, biglietti champions league, biglietti f1, biglietti concerti, biglietti economici, biglietti milan, biglietti juventus, biglietti inter"
        canonical="https://euromatchtickets.com/it/biglietti"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-slate-900 to-red-900/30" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-4 py-2 mb-6">
            <Users className="w-4 h-4 text-emerald-300" />
            <span className="text-emerald-200 text-sm font-medium">{viewersNow} persone stanno visitando</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Comprare Biglietti Online
            <span className="block text-2xl md:text-3xl mt-3 bg-gradient-to-r from-green-300 via-white to-red-300 bg-clip-text text-transparent">Champions League &middot; Serie A &middot; F1 &middot; Concerti</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">I prezzi piu bassi d'Europa. Biglietti 100% verificati. Consegna istantanea via QR code.</p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {vantaggi.map((v, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full">
                <v.icona className="w-4 h-4 text-emerald-400" /><span className="text-white text-sm">{v.titolo}</span>
              </div>
            ))}
          </div>
          <Button onClick={() => navigate("/events")} className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-4 rounded-xl" data-testid="it-browse-btn">
            Vedi Tutti gli Eventi <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Events */}
      <section className="py-16" data-testid="it-events">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">Eventi Popolari</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventi.map((e, i) => (
              <Link key={i} to={e.link} className="group bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-lg rounded-2xl p-6 transition-all" data-testid={`it-event-${i}`}>
                <div className="flex items-center justify-between mb-4">
                  <e.icona className="w-8 h-8 text-emerald-600" />
                  <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">{e.tag}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-emerald-600">{e.titolo}</h3>
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-1"><Calendar className="w-4 h-4" />{e.data}</div>
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-4"><MapPin className="w-4 h-4" />{e.luogo}</div>
                <div className="flex items-center justify-between">
                  <div><span className="text-xs text-slate-400">A partire da</span><div className="text-2xl font-bold text-emerald-600">&euro;{e.prezzo}</div></div>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">Acquista</Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10 text-slate-900">Perche Scegliere EuroMatchTickets?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vantaggi.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 text-center">
                <v.icona className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
                <h3 className="font-bold text-slate-900 mb-2">{v.titolo}</h3>
                <p className="text-slate-500 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-16" data-testid="it-links">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-slate-900">Altri Eventi</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <h3 className="font-bold mb-3">Calcio</h3>
              <ul className="space-y-2">
                <li><Link to="/champions-league-tickets" className="text-emerald-600 hover:underline text-sm">Champions League</Link></li>
                <li><Link to="/real-madrid-tickets" className="text-emerald-600 hover:underline text-sm">Real Madrid</Link></li>
                <li><Link to="/barcelona-tickets" className="text-emerald-600 hover:underline text-sm">FC Barcelona</Link></li>
                <li><Link to="/manchester-city-tickets" className="text-emerald-600 hover:underline text-sm">Manchester City</Link></li>
                <li><Link to="/world-cup-2026" className="text-emerald-600 hover:underline text-sm">Coppa del Mondo 2026</Link></li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <h3 className="font-bold mb-3">Formula 1</h3>
              <ul className="space-y-2">
                <li><Link to="/f1-tickets" className="text-emerald-600 hover:underline text-sm">Tutti i GP F1</Link></li>
                <li><Link to="/monaco-grand-prix-2026-tickets" className="text-emerald-600 hover:underline text-sm">GP di Monaco</Link></li>
                <li><Link to="/fr/acheter-billets" className="text-emerald-600 hover:underline text-sm">Acheter Billets (FR)</Link></li>
                <li><Link to="/de/tickets-kaufen" className="text-emerald-600 hover:underline text-sm">Tickets Kaufen (DE)</Link></li>
                <li><Link to="/es/comprar-entradas" className="text-emerald-600 hover:underline text-sm">Comprar Entradas (ES)</Link></li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <h3 className="font-bold mb-3">Concerti</h3>
              <ul className="space-y-2">
                <li><Link to="/taylor-swift-tickets" className="text-emerald-600 hover:underline text-sm">Taylor Swift</Link></li>
                <li><Link to="/the-weeknd-tour-2026" className="text-emerald-600 hover:underline text-sm">The Weeknd</Link></li>
                <li><Link to="/bruno-mars-tour-2026" className="text-emerald-600 hover:underline text-sm">Bruno Mars</Link></li>
                <li><Link to="/events?type=concert" className="text-emerald-600 hover:underline text-sm">Tutti i Concerti</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50" data-testid="it-faq">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-slate-900">Domande Frequenti</h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="bg-white border border-slate-100 rounded-xl p-5 group">
                <summary className="font-semibold cursor-pointer text-slate-900">{f.question}</summary>
                <p className="mt-3 text-slate-600">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <BreadcrumbStructuredData items={[
        { name: "Home", url: "https://euromatchtickets.com" },
        { name: "Comprare Biglietti", url: "https://euromatchtickets.com/it/biglietti" }
      ]} />
      <FAQStructuredData faqs={faqs} />
    </div>
  );
};

export default ItalianLandingPage;
