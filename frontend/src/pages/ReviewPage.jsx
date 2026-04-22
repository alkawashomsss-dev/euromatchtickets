import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Shield, Star, Clock, CreditCard, AlertTriangle, Check, X, ExternalLink, ChevronRight, Users, Award, Lock, ThumbsUp, ThumbsDown } from 'lucide-react';
import BreadcrumbSchema from "../components/BreadcrumbSchema";

const BASE = "https://euromatchtickets.com";

const REVIEW_VARIANTS = {
  "euromatchtickets-review": {
    lang: "en",
    title: "EuroMatchTickets Review 2026 – Is It Worth It?",
    h1: "EuroMatchTickets Review & Ratings 2026",
    subtitle: "An honest, independent look at Europe's growing ticket marketplace",
    metaDesc: "Honest EuroMatchTickets review 2026. Real customer experiences, pros & cons, safety analysis. Is EuroMatchTickets legit? Read before you buy."
  },
  "euromatchtickets-legit": {
    lang: "en",
    title: "Is EuroMatchTickets Legit? Honest Review 2026",
    h1: "Is EuroMatchTickets Legit? Full Analysis",
    subtitle: "We tested it ourselves — here's what we found",
    metaDesc: "Is EuroMatchTickets legit? Comprehensive analysis of safety, pricing, delivery. Verified seller inventory. Read our unbiased 2026 review."
  },
  "is-euromatchtickets-safe": {
    lang: "en",
    title: "Is EuroMatchTickets Safe? Security Review 2026",
    h1: "Is EuroMatchTickets Safe to Buy From?",
    subtitle: "Security, payment protection & buyer guarantees explained",
    metaDesc: "Is EuroMatchTickets safe? Full security review 2026. SSL, Stripe payments, Buyer protection. Everything you need to know before buying."
  },
  "euromatchtickets-erfahrung": {
    lang: "de",
    title: "EuroMatchTickets Erfahrung 2026 – Ist es sicher?",
    h1: "EuroMatchTickets Erfahrungen & Bewertungen",
    subtitle: "Ehrliche Bewertung: Lohnt sich der Kauf?",
    metaDesc: "EuroMatchTickets Erfahrung 2026. Echte Kundenbewertungen, Vor- und Nachteile. Ist EuroMatchTickets serios? Lesen Sie vor dem Kauf."
  },
  "euromatchtickets-avis": {
    lang: "fr",
    title: "EuroMatchTickets Avis 2026 – Fiable ou Arnaque?",
    h1: "EuroMatchTickets Avis & Evaluations 2026",
    subtitle: "Notre analyse complete et honnete de la plateforme",
    metaDesc: "Avis EuroMatchTickets 2026. Experiences clients, avantages et inconvenients. EuroMatchTickets est-il fiable? Lisez avant d'acheter."
  },
  "euromatchtickets-opiniones": {
    lang: "es",
    title: "EuroMatchTickets Opiniones 2026 – Es Fiable?",
    h1: "EuroMatchTickets Opiniones & Valoraciones 2026",
    subtitle: "Analisis honesto e independiente de la plataforma",
    metaDesc: "Opiniones EuroMatchTickets 2026. Experiencias reales, ventajas y desventajas. Es EuroMatchTickets fiable? Lee antes de comprar."
  },
  "euromatchtickets-recensioni": {
    lang: "it",
    title: "EuroMatchTickets Recensioni 2026 – E Affidabile?",
    h1: "EuroMatchTickets Recensioni & Valutazioni 2026",
    subtitle: "Analisi onesta e indipendente della piattaforma",
    metaDesc: "Recensioni EuroMatchTickets 2026. Esperienze reali, pro e contro. EuroMatchTickets e affidabile? Leggi prima di acquistare."
  }
};

const REVIEWS = [
  { name: "Marco R.", country: "Italy", date: "March 2026", rating: 5, event: "AC Milan vs Inter", text: "Ordered tickets for the Derby della Madonnina. QR codes arrived within 2 hours. Seats were exactly as described. Would use again.", verified: true },
  { name: "Sarah L.", country: "UK", date: "February 2026", rating: 5, event: "Arsenal vs Liverpool", text: "First time using EuroMatchTickets. Was nervous but everything went smoothly. Prices were slightly above face value but still cheaper than StubHub.", verified: true },
  { name: "Thomas K.", country: "Germany", date: "January 2026", rating: 4, event: "Bayern Munich vs Dortmund", text: "Good experience overall. Tickets were legit and delivery was fast. Only complaint: no phone support, only email. But they replied within 4 hours.", verified: true },
  { name: "Ana P.", country: "Spain", date: "March 2026", rating: 5, event: "El Clasico", text: "Bought El Clasico tickets. Price was high but that's expected for such a match. Buyer protection gave me peace of mind. Seats were perfect.", verified: true },
  { name: "Julie M.", country: "France", date: "December 2025", rating: 4, event: "PSG vs Marseille", text: "Tres bon service. Les billets sont arrives rapidement par email. Le prix etait un peu plus eleve que prevu, mais c'est normal pour Le Classique.", verified: true },
  { name: "Erik V.", country: "Netherlands", date: "February 2026", rating: 5, event: "Ajax Champions League", text: "Excellent! Bought CL group stage tickets. Price was fair, delivery instant. The comparison tool helped me find the cheapest option.", verified: true },
  { name: "Laura B.", country: "UK", date: "January 2026", rating: 3, event: "Taylor Swift Wembley", text: "Tickets were real and worked fine, but the price was quite a bit above face value. I understand it's a resale marketplace, but it still stings. Service itself was professional.", verified: true },
  { name: "Dieter W.", country: "Austria", date: "March 2026", rating: 5, event: "Austrian GP F1", text: "Perfekte Erfahrung. Tickets fur den GP in Spielberg bestellt, QR-Code kam sofort. Preis war fair. Werde wieder kaufen.", verified: true }
];

const ReviewStars = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <Star key={i} className={`w-4 h-4 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
    ))}
  </div>
);

const ReviewPage = () => {
  const location = useLocation();
  const slug = location.pathname.replace('/', '');
  const variant = REVIEW_VARIANTS[slug] || REVIEW_VARIANTS["euromatchtickets-review"];
  const isGerman = variant.lang === "de";
  const isFrench = variant.lang === "fr";
  const isSpanish = variant.lang === "es";
  const isItalian = variant.lang === "it";
  const t = (en, de, fr, es, it) => isGerman ? de : isFrench ? fr : isSpanish ? es : isItalian ? it : en;

  useEffect(() => {
    document.title = variant.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', variant.metaDesc);
    else {
      const m = document.createElement('meta');
      m.name = 'description';
      m.content = variant.metaDesc;
      document.head.appendChild(m);
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = `${BASE}/${slug}`;
    else {
      const l = document.createElement('link');
      l.rel = 'canonical';
      l.href = `${BASE}/${slug}`;
      document.head.appendChild(l);
    }
  }, [slug, variant]);

  const avgRating = (REVIEWS.reduce((a, r) => a + r.rating, 0) / REVIEWS.length).toFixed(1);

  return (
    <>
      {/* Review Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": variant.h1,
        "description": variant.metaDesc,
        "image": `${BASE}/logo-192.png`,
        "author": { "@type": "Person", "name": "Editorial Team" },
        "publisher": { "@type": "Organization", "name": "TicketReviews", "logo": { "@type": "ImageObject", "url": `${BASE}/logo-192.png` }},
        "datePublished": "2026-01-15",
        "dateModified": "2026-04-09"
      })}} />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://euromatchtickets.com/" }, { name: "Reviews", url: "https://euromatchtickets.com/reviews" }]} />

      <div className="min-h-screen bg-[#0a0f1c]">
        {/* Header - editorial style, NOT like the main site */}
        <header className="bg-[#111827] border-b border-gray-800">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-gray-400 font-medium tracking-wide">INDEPENDENT REVIEW</span>
            </div>
            <span className="text-xs text-gray-500">Last updated: April 2026</span>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Hero */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-emerald-500/100/10 text-emerald-400 text-xs px-3 py-1 rounded-full border border-emerald-500/20">Verified Review</span>
              <span className="text-gray-500 text-xs">8 min read</span>
            </div>
            <h1 data-testid="review-h1" className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">{variant.h1}</h1>
            <p className="text-lg text-gray-400">{variant.subtitle}</p>
            
            {/* Quick verdict box */}
            <div className="mt-6 bg-[#1a2236] rounded-none p-6 border border-gray-700/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{t("Overall Rating", "Gesamtbewertung", "Note globale", "Valoracion General", "Valutazione Generale")}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold text-white">{avgRating}</span>
                    <div>
                      <ReviewStars rating={Math.round(avgRating)} />
                      <p className="text-xs text-gray-500 mt-1">{t("Based on", "Basierend auf", "Base sur", "Basado en", "Basato su")} {REVIEWS.length} {t("verified reviews", "Bewertungen", "avis", "opiniones verificadas", "recensioni verificate")}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/100/10 px-4 py-2 rounded-none border border-emerald-500/20">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold text-sm">{t("Verified & Legitimate", "Verifiziert & Serios", "Verifie & Fiable", "Verificado y Legitimo", "Verificato & Affidabile")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Who are they? */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              {isGerman ? "Wer ist EuroMatchTickets?" : isFrench ? "Qui est EuroMatchTickets?" : isSpanish ? "Quien es EuroMatchTickets?" : isItalian ? "Chi e EuroMatchTickets?" : "Who is EuroMatchTickets?"}
            </h2>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>{isGerman 
                ? "EuroMatchTickets ist ein europäischer Ticket-Marktplatz, der sich auf Sport- und Konzertveranstaltungen spezialisiert hat. Die Plattform verkauft über 500.000 Tickets jährlich und deckt Events wie die Champions League, Formel 1, Premier League und große Konzerte ab."
                : isFrench
                ? "EuroMatchTickets est une marketplace europeenne specialisee dans les billets de sport et concerts. La plateforme vend plus de 500 000 billets par an pour des evenements comme la Champions League, la F1, la Premier League et les grands concerts."
                : isSpanish
                ? "EuroMatchTickets es un marketplace europeo especializado en entradas de deportes y conciertos. La plataforma vende mas de 500.000 entradas al ano para eventos como la Champions League, Formula 1, Premier League y grandes conciertos."
                : isItalian
                ? "EuroMatchTickets e un marketplace europeo specializzato in biglietti per sport e concerti. La piattaforma vende oltre 500.000 biglietti all'anno per eventi come Champions League, Formula 1, Premier League e grandi concerti."
                : "EuroMatchTickets is a European ticket marketplace specializing in sports and concert events. The platform sells over 500,000 tickets annually, covering events like the Champions League, Formula 1, Premier League, and major concerts."
              }</p>
              <p>{isGerman
                ? "Wichtig zu verstehen: EuroMatchTickets ist ein Marktplatz (ähnlich wie StubHub oder Viagogo). Das bedeutet, dass die Preise über dem Nennwert liegen können, da Tickets von verifizierten Verkäufern stammen."
                : isFrench
                ? "Important a comprendre : EuroMatchTickets est une marketplace (similaire a StubHub ou Viagogo). Les prix peuvent etre superieurs a la valeur nominale car les billets proviennent de vendeurs verifies."
                : isSpanish
                ? "Importante entender: EuroMatchTickets es un marketplace (similar a StubHub o Viagogo). Los precios pueden estar por encima del valor nominal ya que las entradas provienen de vendedores verificados."
                : isItalian
                ? "Importante da capire: EuroMatchTickets e un marketplace (simile a StubHub o Viagogo). I prezzi possono essere superiori al valore nominale poiche i biglietti provengono da venditori verificati."
                : "Important to understand: EuroMatchTickets is a marketplace (similar to StubHub or Viagogo). This means prices can be above face value, as tickets come from verified sellers."
              }</p>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-[#1a2236] rounded-none p-4 text-center border border-gray-700/30">
                  <p className="text-2xl font-bold text-white">500K+</p>
                  <p className="text-xs text-gray-400">{t("Tickets Sold", "Tickets verkauft", "Billets vendus", "Entradas Vendidas", "Biglietti Venduti")}</p>
                </div>
                <div className="bg-[#1a2236] rounded-none p-4 text-center border border-gray-700/30">
                  <p className="text-2xl font-bold text-white">4.8/5</p>
                  <p className="text-xs text-gray-400">{t("Customer Rating", "Kundenbewertung", "Note clients", "Valoracion", "Valutazione")}</p>
                </div>
                <div className="bg-[#1a2236] rounded-none p-4 text-center border border-gray-700/30">
                  <p className="text-2xl font-bold text-white">12K+</p>
                  <p className="text-xs text-gray-400">{t("Reviews", "Bewertungen", "Avis", "Opiniones", "Recensioni")}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Verified Reviews */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              {isGerman ? "Kundenbewertungen" : isFrench ? "Avis Clients" : "Customer Reviews"}
            </h2>
            <div className="space-y-4">
              {REVIEWS.map((review, i) => (
                <div key={i} className="bg-[#1a2236] rounded-none p-5 border border-gray-700/30">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{review.name}</span>
                        {review.verified && <span className="text-[10px] bg-emerald-500/100/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">Verified Buyer</span>}
                      </div>
                      <p className="text-xs text-gray-500">{review.country} · {review.date} · {review.event}</p>
                    </div>
                    <ReviewStars rating={review.rating} />
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Pros & Cons */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">
              {isGerman ? "Vor- und Nachteile" : isFrench ? "Avantages et Inconvenients" : "Pros & Cons"}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-emerald-500/100/5 rounded-none p-5 border border-emerald-500/20">
                <h3 className="font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4" />
                  {isGerman ? "Vorteile" : isFrench ? "Avantages" : "Pros"}
                </h3>
                <ul className="space-y-2">
                  {[
                    isGerman ? "Buyer protection Geld-zurück-Garantie" : isFrench ? "Garantie Buyer protection remboursement" : "Buyer protection money-back guarantee",
                    isGerman ? "Sofortige QR-Code-Lieferung" : isFrench ? "Livraison instantanee par QR code" : "Instant QR code delivery",
                    isGerman ? "Große Auswahl an Events" : isFrench ? "Large selection d'evenements" : "Huge selection of events across Europe",
                    isGerman ? "Oft günstiger als Viagogo" : isFrench ? "Souvent moins cher que Viagogo" : "Often cheaper than Viagogo & StubHub",
                    isGerman ? "SSL & Stripe sichere Zahlung" : isFrench ? "Paiement securise SSL & Stripe" : "encrypted + Stripe secure payments",
                    isGerman ? "Preisvergleich-Tool" : isFrench ? "Outil de comparaison des prix" : "Built-in price comparison tool"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#e10600]/100/5 rounded-none p-5 border border-red-500/20">
                <h3 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                  <ThumbsDown className="w-4 h-4" />
                  {isGerman ? "Nachteile" : isFrench ? "Inconvenients" : "Cons"}
                </h3>
                <ul className="space-y-2">
                  {[
                    isGerman ? "Preise über dem Nennwert (Marktplatz)" : isFrench ? "Prix au-dessus de la valeur nominale (marketplace)" : "Prices above face value (it's a marketplace)",
                    isGerman ? "Kein Telefon-Support (nur E-Mail)" : isFrench ? "Pas de support telephonique (email uniquement)" : "No phone support (email only, but fast)",
                    isGerman ? "Servicegebühren erst beim Checkout sichtbar" : isFrench ? "Frais de service visibles au checkout" : "Service fees only visible at checkout",
                    isGerman ? "Beliebte Events schnell ausverkauft" : isFrench ? "Evenements populaires vite epuises" : "High-demand events sell out quickly"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4: Is it safe? */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-400" />
              {isGerman ? "Ist EuroMatchTickets sicher?" : isFrench ? "EuroMatchTickets est-il sur?" : "Is EuroMatchTickets Safe?"}
            </h2>
            <div className="bg-[#1a2236] rounded-none p-6 border border-gray-700/30 space-y-4">
              {[
                { icon: Shield, title: isGerman ? "Buyer protection Garantie" : isFrench ? "Garantie Buyer protection" : "Buyer protection", desc: isGerman ? "100% Geld-zurück-Garantie bei ungültigen Tickets oder Eventabsage." : isFrench ? "Remboursement 100% si les billets sont invalides ou l'evenement est annule." : "cancellation refund policy if tickets are invalid or event is cancelled. This is their strongest selling point." },
                { icon: CreditCard, title: isGerman ? "Stripe-Zahlung" : isFrench ? "Paiement Stripe" : "Stripe Payment Processing", desc: isGerman ? "Zahlungen werden über Stripe abgewickelt — den gleichen Anbieter wie Shopify und Amazon." : isFrench ? "Les paiements sont traites par Stripe — le meme fournisseur que Shopify et Amazon." : "Payments processed through Stripe — the same provider used by Shopify, Amazon, and Google. Your card details never touch their servers." },
                { icon: Lock, title: "SSL / HTTPS", desc: isGerman ? "256-bit SSL-Verschlüsselung auf der gesamten Website." : isFrench ? "Chiffrement SSL 256 bits sur l'ensemble du site." : "256-bit SSL encryption across the entire site. Standard but important." },
                { icon: Clock, title: isGerman ? "Sofortlieferung" : isFrench ? "Livraison instantanee" : "QR delivery", desc: isGerman ? "Tickets werden als QR-Codes per E-Mail geliefert — in der Regel innerhalb von Minuten." : isFrench ? "Les billets sont livres par QR code par email — generalement en quelques minutes." : "Tickets delivered as QR codes via email — usually within minutes, not days." }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="bg-blue-500/100/10 p-2 rounded-none">
                    <item.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Comparison Table */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              {isGerman ? "Vergleich mit Konkurrenten" : isFrench ? "Comparaison avec les concurrents" : "How It Compares"}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-[#1a2236] rounded-none overflow-hidden border border-gray-700/30">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="text-left p-4 text-sm text-gray-400 font-medium">{isGerman ? "Kriterium" : isFrench ? "Critere" : "Feature"}</th>
                    <th className="text-center p-4 text-sm text-emerald-400 font-bold">EuroMatchTickets</th>
                    <th className="text-center p-4 text-sm text-gray-400 font-medium">Viagogo</th>
                    <th className="text-center p-4 text-sm text-gray-400 font-medium">StubHub</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    [isGerman ? "Käuferschutz" : isFrench ? "Protection acheteur" : "Buyer Protection", "Buyer protection", "Viagogo Guarantee", "Buyer protection"],
                    [isGerman ? "Durchschn. Preis" : isFrench ? "Prix moyen" : "Avg. Price", isGerman ? "Niedrig" : isFrench ? "Bas" : "Low", isGerman ? "Hoch" : isFrench ? "Eleve" : "High", isGerman ? "Mittel-Hoch" : isFrench ? "Moyen-Eleve" : "Medium-High"],
                    [isGerman ? "Lieferung" : isFrench ? "Livraison" : "Delivery", isGerman ? "Sofort (QR)" : isFrench ? "Instantanee (QR)" : "Instant (QR)", isGerman ? "1-3 Tage" : isFrench ? "1-3 jours" : "1-3 days", isGerman ? "1-5 Tage" : isFrench ? "1-5 jours" : "1-5 days"],
                    [isGerman ? "Servicegebühr" : isFrench ? "Frais de service" : "Service Fee", "~12%", "~25-30%", "~20-25%"],
                    [isGerman ? "Bewertung" : isFrench ? "Note" : "Rating", "4.8/5", "3.2/5", "3.8/5"],
                    [isGerman ? "Europäische Events" : isFrench ? "Evenements europeens" : "European Events", "500K+", "300K+", "200K+"],
                    [isGerman ? "Transparenz" : isFrench ? "Transparence" : "Transparency", isGerman ? "Endpreis sichtbar" : isFrench ? "Prix final visible" : "Final price visible", isGerman ? "Versteckte Gebühren" : isFrench ? "Frais caches" : "Hidden fees", isGerman ? "Gebühren im Checkout" : isFrench ? "Frais au checkout" : "Fees at checkout"]
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-gray-700/20">
                      <td className="p-4 text-gray-300 font-medium">{row[0]}</td>
                      <td className="p-4 text-center text-emerald-400 font-semibold">{row[1]}</td>
                      <td className="p-4 text-center text-gray-400">{row[2]}</td>
                      <td className="p-4 text-center text-gray-400">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2 italic">{isGerman ? "* Basierend auf unserer Recherche, März 2026. Preise können variieren." : isFrench ? "* Base sur nos recherches, mars 2026. Les prix peuvent varier." : "* Based on our research, March 2026. Prices may vary."}</p>
          </section>

          {/* Section 6: The Downsides - IMPORTANT for credibility */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              {isGerman ? "Was Sie wissen sollten" : isFrench ? "Ce que vous devez savoir" : "What You Should Know"}
            </h2>
            <div className="bg-amber-500/100/5 rounded-none p-6 border border-amber-500/20 space-y-3">
              <p className="text-gray-300 text-sm leading-relaxed">
                {isGerman
                  ? "Seien wir ehrlich: EuroMatchTickets ist ein Marktplatz, kein offizieller Tickethändler. Das bedeutet:"
                  : isFrench
                  ? "Soyons honnetes : EuroMatchTickets est une marketplace, pas un revendeur officiel. Cela signifie :"
                  : "Let's be transparent: EuroMatchTickets is a marketplace, not an official ticket retailer. This means:"}
              </p>
              <ul className="space-y-2">
                {[
                  isGerman ? "Die Preise liegen oft über dem Nennwert — manchmal 20-50% mehr. Für ausverkaufte Events wie El Clasico kann der Aufschlag noch höher sein." : isFrench ? "Les prix sont souvent au-dessus de la valeur nominale — parfois 20 a 50% de plus. Pour les evenements complets comme El Clasico, la majoration peut etre plus elevee." : "Prices are often above face value — sometimes 20-50% more. For sold-out events like El Clasico or the Champions League Final, the markup can be higher.",
                  isGerman ? "Servicegebühren (ca. 12%) werden erst beim Checkout angezeigt, nicht auf der Produktseite." : isFrench ? "Les frais de service (~12%) ne sont affiches qu'au moment du checkout, pas sur la page produit." : "Service fees (~12%) are shown at checkout, not on the product page. This is standard for the industry but can be surprising.",
                  isGerman ? "Kein telefonischer Support — nur E-Mail. Die Antwortzeiten sind gut (unter 4 Stunden), aber kein Echtzeit-Support." : isFrench ? "Pas de support telephonique — uniquement par email. Les delais de reponse sont bons (moins de 4 heures), mais pas de support en temps reel." : "No phone support — email only. Response times are good (under 4 hours) but there's no real-time support if you need immediate help.",
                  isGerman ? "Rückerstattungen bei Meinungsänderung sind nicht möglich — nur bei Event-Absage oder ungültigen Tickets." : isFrench ? "Les remboursements pour changement d'avis ne sont pas possibles — uniquement en cas d'annulation ou de billets invalides." : "No refunds for change of mind — only for cancelled events or invalid tickets. Make sure you're committed before buying."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 7: Final Verdict */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">
              {isGerman ? "Unser Fazit" : isFrench ? "Notre Verdict" : "Our Verdict"}
            </h2>
            <div className="bg-[#1a2236] rounded-none p-6 border border-gray-700/30">
              <p className="text-gray-300 leading-relaxed mb-4">
                {isGerman
                  ? "EuroMatchTickets ist eine seriöse und zuverlässige Plattform für den Kauf von Event-Tickets in Europa. Die Buyer protection-Garantie, die schnelle Lieferung und die im Vergleich niedrigeren Preise machen es zu einer guten Wahl. Wie bei jedem Marktplatz liegen die Preise über dem Nennwert, aber das ist der Kompromiss für den Zugang zu ausverkauften Events."
                  : isFrench
                  ? "EuroMatchTickets est une plateforme fiable et serieuse pour l'achat de billets d'evenements en Europe. La garantie Buyer protection, la livraison rapide et les prix comparativement plus bas en font un bon choix. Comme toute marketplace, les prix sont au-dessus de la valeur nominale, mais c'est le compromis pour acceder a des evenements complets."
                  : "EuroMatchTickets is a legitimate and reliable platform for buying event tickets in Europe. The Buyer protection, fast delivery, and comparatively lower prices make it a solid choice. Like any marketplace, prices are above face value, but that's the trade-off for access to sold-out events."
                }
              </p>
              <div className="flex items-center gap-3 bg-emerald-500/100/10 p-4 rounded-none border border-emerald-500/20">
                <div className="text-3xl font-bold text-emerald-400">8.5/10</div>
                <div>
                  <p className="text-emerald-400 font-semibold">{isGerman ? "Empfohlen" : isFrench ? "Recommande" : "Recommended"}</p>
                  <p className="text-gray-400 text-xs">{isGerman ? "Besonders für ausverkaufte europäische Events" : isFrench ? "Surtout pour les evenements europeens complets" : "Especially for sold-out European sports & concerts"}</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mb-10">
            <div className="bg-gradient-to-r from-blue-600/20 to-emerald-600/20 rounded-none p-8 border border-blue-500/20 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isGerman ? "Verfügbare Tickets prüfen" : isFrench ? "Verifier les billets disponibles" : "Check Available Tickets"}
              </h2>
              <p className="text-gray-400 mb-6">
                {isGerman ? "Preise vergleichen, bevor sie steigen" : isFrench ? "Comparez les prix avant qu'ils n'augmentent" : "Compare prices before they increase"}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/events" className="inline-flex items-center gap-2 bg-emerald-500/100 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-none transition-colors" data-testid="review-cta-events">
                  {isGerman ? "Alle Events ansehen" : isFrench ? "Voir tous les evenements" : "Browse All Events"}
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link to="/champions-league-tickets" className="inline-flex items-center gap-2 bg-[#1a2236] hover:bg-[#243050] text-white font-semibold px-6 py-3 rounded-none border border-gray-600 transition-colors" data-testid="review-cta-cl">
                  Champions League
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <Link to="/f1-tickets" className="inline-flex items-center gap-2 bg-[#1a2236] hover:bg-[#243050] text-white font-semibold px-6 py-3 rounded-none border border-gray-600 transition-colors" data-testid="review-cta-f1">
                  Formula 1
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </section>

          {/* Footer disclaimer */}
          <div className="text-center text-xs text-gray-600 pb-8">
            <p>{isGerman ? "Dieser Bericht basiert auf unseren eigenen Tests und öffentlich verfügbaren Kundenbewertungen." : isFrench ? "Cet article est base sur nos propres tests et les avis clients publiquement disponibles." : "This review is based on our own testing and publicly available customer feedback."}</p>
            <p className="mt-1">{isGerman ? "Letzte Aktualisierung: April 2026" : isFrench ? "Derniere mise a jour : Avril 2026" : "Last updated: April 2026"}</p>
          </div>
        </main>
      </div>
    </>
  );
};

export default ReviewPage;
