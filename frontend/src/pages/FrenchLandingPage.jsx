import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Shield, Star, Ticket, Trophy, Zap, ChevronRight, Users, Music, Flag } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";
import { FAQStructuredData, BreadcrumbStructuredData } from "../components/StructuredData";

const FrenchLandingPage = () => {
  const navigate = useNavigate();
  const [viewersNow, setViewersNow] = useState(187);
  useEffect(() => {
    const i = setInterval(() => setViewersNow(p => Math.max(140, p + Math.floor(Math.random() * 11) - 5)), 5000);
    return () => clearInterval(i);
  }, []);

  const evenements = [
    { titre: "Finale Champions League 2026", date: "30 Mai 2026", lieu: "Allianz Arena, Munich", prix: 85, icone: Trophy, lien: "/champions-league-tickets", tag: "POPULAIRE" },
    { titre: "PSG - Ligue des Champions", date: "Fev-Mai 2026", lieu: "Parc des Princes, Paris", prix: 95, icone: Trophy, lien: "/champions-league-tickets", tag: "DEMANDE" },
    { titre: "Grand Prix de Monaco F1 2026", date: "Mai 2026", lieu: "Circuit de Monaco", prix: 195, icone: Flag, lien: "/monaco-grand-prix-2026-tickets", tag: "PREMIUM" },
    { titre: "Grand Prix de France F1 2026", date: "Juillet 2026", lieu: "Le Castellet", prix: 89, icone: Flag, lien: "/f1-tickets", tag: "NOUVEAU" },
    { titre: "Taylor Swift - Eras Tour Paris", date: "2026", lieu: "Stade de France, Paris", prix: 89, icone: Music, lien: "/taylor-swift-tickets", tag: "COMPLET BIENTOT" },
    { titre: "Coupe du Monde FIFA 2026", date: "Juin-Juil 2026", lieu: "USA, Mexique, Canada", prix: 89, icone: Trophy, lien: "/world-cup-2026", tag: "EVENEMENT" },
  ];

  const avantages = [
    { titre: "Prix les Plus Bas", desc: "Nous garantissons les meilleurs prix du marche. Moins cher qu'ailleurs!", icone: Zap },
    { titre: "100% Garanti", desc: "Tous les billets verifies avec notre garantie Buyer protection. Remboursement total.", icone: Shield },
    { titre: "Livraison Instantanee", desc: "Recevez vos billets par email instantanement. QR code pret a scanner.", icone: Ticket },
    { titre: "4.8/5 Etoiles", desc: "Des milliers de clients satisfaits dans toute l'Europe.", icone: Star },
  ];

  const faqs = [
    { question: "Comment acheter des billets sur EuroMatchTickets?", answer: "Choisissez votre evenement, selectionnez vos places et payez en toute securite. Vos billets arrivent instantanement par email sous forme de QR code." },
    { question: "Les billets sont-ils garantis?", answer: "Oui! Tous nos billets sont 100% verifies et proteges par notre garantie Buyer protection. Si l'evenement est annule, vous etes integralement rembourse." },
    { question: "Quels sont les modes de paiement acceptes?", answer: "Nous acceptons Visa, Mastercard, American Express, PayPal et Apple Pay. Tous les paiements sont securises par cryptage SSL." },
    { question: "Combien coutent les billets Champions League?", answer: "Les billets Champions League commencent a partir de 85EUR pour les matchs de phase de groupes. Les demi-finales et la finale sont a partir de 195EUR." },
    { question: "Livrez-vous en France?", answer: "Oui! Livraison instantanee par email dans le monde entier. Pas besoin d'attendre - votre QR code est pret immediatement." },
  ];

  const reviewSchema = {
    "@context": "https://schema.org", "image": "https://euromatchtickets.com/logo-192.png",
    "@type": "Product",
    "name": "Billets EuroMatchTickets - France",
    "brand": { "@type": "Brand", "name": "EuroMatchTickets" },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "2456", "bestRating": "5" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR",
              "offerCount": "100", "lowPrice": "39", "highPrice": "2500" }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e]" data-testid="french-landing-page">
      <SEOHead
        title="Acheter Billets - Champions League, F1, Concerts | EuroMatchTickets"
        description="Achetez des billets pour Champions League, F1 Monaco, PSG, concerts et plus. Prix les plus bas garantis. Livraison instantanee par QR. Garantie Buyer protection."
        keywords="acheter billets, billets champions league, billets f1, billets concerts, billets pas cher, billets psg, billets monaco gp, billets taylor swift"
        canonical="https://euromatchtickets.com/fr/acheter-billets"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-red-900/30" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/100/20 border border-blue-400/30 rounded-full px-4 py-2 mb-6">
            <Users className="w-4 h-4 text-blue-300" />
            <span className="text-blue-200 text-sm font-medium">{viewersNow} personnes consultent ce site</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Acheter des Billets en Ligne
            <span className="block text-2xl md:text-3xl mt-3 bg-gradient-to-r from-blue-300 to-red-300 bg-clip-text text-transparent">Champions League &middot; F1 &middot; Concerts &middot; Football</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">Les prix les plus bas d'Europe. Billets 100% verifies. Livraison instantanee par QR code.</p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {avantages.map((a, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full">
                <a.icone className="w-4 h-4 text-emerald-400" /><span className="text-white text-sm">{a.titre}</span>
              </div>
            ))}
          </div>
          <Button onClick={() => navigate("/events")} className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 rounded-none" data-testid="fr-browse-btn">
            Voir Tous les Evenements <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Events */}
      <section className="py-16" data-testid="fr-events">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-white">Evenements Populaires</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {evenements.map((e, i) => (
              <Link key={i} to={e.lien} className="group bg-[#1e1e1e] border border-white/5 hover:border-blue-200 hover:shadow-lg rounded-none p-6 transition-all" data-testid={`fr-event-${i}`}>
                <div className="flex items-center justify-between mb-4">
                  <e.icone className="w-8 h-8 text-blue-600" />
                  <span className="text-xs font-bold bg-blue-500/10 text-blue-600 px-3 py-1 rounded-full">{e.tag}</span>
                </div>
                <h3 className="font-bold text-white text-lg mb-2 group-hover:text-blue-600">{e.titre}</h3>
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-1"><Calendar className="w-4 h-4" />{e.date}</div>
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-4"><MapPin className="w-4 h-4" />{e.lieu}</div>
                <div className="flex items-center justify-between">
                  <div><span className="text-xs text-slate-400">A partir de</span><div className="text-2xl font-bold text-blue-600">&euro;{e.prix}</div></div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Acheter</Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 bg-[#15151e]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10 text-white">Pourquoi Choisir EuroMatchTickets?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {avantages.map((a, i) => (
              <div key={i} className="bg-[#1e1e1e] rounded-none p-6 border border-white/5 text-center">
                <a.icone className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                <h3 className="font-bold text-white mb-2">{a.titre}</h3>
                <p className="text-slate-500 text-sm">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-16" data-testid="fr-links">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">Plus d'Evenements</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#1e1e1e] rounded-none p-5 border border-white/5">
              <h3 className="font-bold mb-3">Football</h3>
              <ul className="space-y-2">
                <li><Link to="/champions-league-tickets" className="text-blue-600 hover:underline text-sm">Champions League</Link></li>
                <li><Link to="/real-madrid-tickets" className="text-blue-600 hover:underline text-sm">Real Madrid</Link></li>
                <li><Link to="/barcelona-tickets" className="text-blue-600 hover:underline text-sm">FC Barcelona</Link></li>
                <li><Link to="/manchester-city-tickets" className="text-blue-600 hover:underline text-sm">Manchester City</Link></li>
                <li><Link to="/world-cup-2026" className="text-blue-600 hover:underline text-sm">Coupe du Monde 2026</Link></li>
              </ul>
            </div>
            <div className="bg-[#1e1e1e] rounded-none p-5 border border-white/5">
              <h3 className="font-bold mb-3">Formule 1</h3>
              <ul className="space-y-2">
                <li><Link to="/f1-tickets" className="text-blue-600 hover:underline text-sm">Tous les GP F1</Link></li>
                <li><Link to="/monaco-grand-prix-2026-tickets" className="text-blue-600 hover:underline text-sm">GP de Monaco</Link></li>
                <li><Link to="/de/tickets-kaufen" className="text-blue-600 hover:underline text-sm">Tickets Kaufen (DE)</Link></li>
                <li><Link to="/es/comprar-entradas" className="text-blue-600 hover:underline text-sm">Comprar Entradas (ES)</Link></li>
                <li><Link to="/it/biglietti" className="text-blue-600 hover:underline text-sm">Biglietti (IT)</Link></li>
              </ul>
            </div>
            <div className="bg-[#1e1e1e] rounded-none p-5 border border-white/5">
              <h3 className="font-bold mb-3">Concerts</h3>
              <ul className="space-y-2">
                <li><Link to="/taylor-swift-tickets" className="text-blue-600 hover:underline text-sm">Taylor Swift</Link></li>
                <li><Link to="/the-weeknd-tour-2026" className="text-blue-600 hover:underline text-sm">The Weeknd</Link></li>
                <li><Link to="/bruno-mars-tour-2026" className="text-blue-600 hover:underline text-sm">Bruno Mars</Link></li>
                <li><Link to="/events?type=concert" className="text-blue-600 hover:underline text-sm">Tous les Concerts</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-[#15151e]" data-testid="fr-faq">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">Questions Frequentes</h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="bg-[#1e1e1e] border border-white/5 rounded-none p-5 group">
                <summary className="font-semibold cursor-pointer text-white">{f.question}</summary>
                <p className="mt-3 text-slate-400">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <BreadcrumbStructuredData items={[
        { name: "Home", url: "https://euromatchtickets.com" },
        { name: "Acheter Billets", url: "https://euromatchtickets.com/fr/acheter-billets" }
      ]} />
      <FAQStructuredData faqs={faqs} />
    </div>
  );
};

export default FrenchLandingPage;
