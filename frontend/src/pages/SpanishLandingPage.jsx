import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Shield, Star, Ticket, Trophy, Zap, ChevronRight, Users, Music, Flag } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";
import BreadcrumbSchema from "../components/BreadcrumbSchema";

const SpanishLandingPage = () => {
  const navigate = useNavigate();
  const [viewersNow, setViewersNow] = useState(243);

  useEffect(() => {
    const i = setInterval(() => setViewersNow(p => Math.max(180, p + Math.floor(Math.random() * 11) - 5)), 5000);
    return () => clearInterval(i);
  }, []);

  const eventos = [
    { titulo: "Final Champions League 2026", fecha: "30 Mayo 2026", lugar: "San Siro, Milán", precio: 89, icono: Trophy, enlace: "/champions-league-tickets", tag: "MUY DEMANDADO" },
    { titulo: "El Clásico - Real Madrid vs Barcelona", fecha: "Abril 2026", lugar: "Santiago Bernabéu, Madrid", precio: 69, icono: Trophy, enlace: "/el-clasico-tickets", tag: "CLÁSICO" },
    { titulo: "Gran Premio de F1 España 2026", fecha: "Junio 2026", lugar: "Circuit de Barcelona", precio: 49, icono: Flag, enlace: "/f1-spanish-grand-prix-barcelona-tickets", tag: "POPULAR" },
    { titulo: "Copa del Mundo FIFA 2026", fecha: "Jun-Jul 2026", lugar: "USA, México, Canadá", precio: 89, icono: Trophy, enlace: "/world-cup-2026", tag: "EVENTO DEL AÑO" },
    { titulo: "Taylor Swift - Eras Tour Europa", fecha: "2026", lugar: "Wembley, Londres", precio: 38, icono: Music, enlace: "/taylor-swift-wembley-2026-tickets", tag: "AGOTÁNDOSE" },
    { titulo: "Gran Premio de Mónaco F1", fecha: "Mayo 2026", lugar: "Circuit de Monaco", precio: 99, icono: Flag, enlace: "/f1-monaco-grand-prix-tickets", tag: "PREMIUM" },
  ];

  const ventajas = [
    { titulo: "Los Precios Más Bajos", desc: "Garantizamos los mejores precios del mercado. Si encuentras más barato, ¡igualamos el precio!", icono: Zap },
    { titulo: "100% Garantizadas", desc: "Todas las entradas verificadas con nuestra garantía Buyer protection. Tu dinero seguro.", icono: Shield },
    { titulo: "Entrega Inmediata", desc: "Recibe tus entradas al instante por email. QR listo para escanear.", icono: Ticket },
    { titulo: "4.8/5 Estrellas", desc: "Miles de clientes satisfechos en toda Europa. Lee nuestras reseñas.", icono: Star },
  ];

  return (
    <div className="min-h-screen bg-[#1e1e1e]" data-testid="spanish-landing-page">
      <BreadcrumbSchema items={[{ name: "Home", url: "https://euromatchtickets.com/" }, { name: "Entradas", url: "https://euromatchtickets.com/es" }]} />
      <SEOHead
        title="Comprar Entradas - Champions League, F1, Conciertos"
        description="Compra entradas para Champions League, F1, La Liga, conciertos y más. Los precios más bajos garantizados. Entrega inmediata por QR. Garantía Buyer protection."
        keywords="comprar entradas, entradas champions league, entradas f1, entradas conciertos, comprar entradas online, entradas baratas europa, entradas real madrid, entradas barcelona"
        canonical="https://euromatchtickets.com/es/comprar-entradas"
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#e10600]/100 rounded-full blur-3xl anim-pulse-slow" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-500 rounded-full blur-3xl anim-pulse-slow" style={{animationDelay: '2s'}} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-full px-4 py-1.5 text-sm mb-6 anim-fade-in">
            <span className="w-2 h-2 bg-[#e10600]/100 rounded-full anim-blink" />
            <span>{viewersNow} personas comprando ahora</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 leading-tight anim-slide-up">
            Comprar Entradas Online<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">Los Mejores Precios de Europa</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-8 anim-slide-up" style={{animationDelay: '0.15s'}}>
            Champions League, F1, La Liga, Premier League, conciertos exclusivos. Precios imbatibles con entrega inmediata y garantía total.
          </p>
          <div className="flex flex-wrap gap-4 anim-slide-up" style={{animationDelay: '0.3s'}}>
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-bold rounded-none" onClick={() => navigate("/events")}>
              Ver Todas las Entradas <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-none" onClick={() => navigate("/world-cup-2026")}>
              Copa del Mundo 2026
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-6 mt-8 text-sm text-slate-400 anim-slide-up" style={{animationDelay: '0.45s'}}>
            <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-green-400" /> Garantía Buyer protection</span>
            <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-yellow-400" /> Entrega Instantánea</span>
            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" /> 4.8/5 ( reseñas)</span>
          </div>
        </div>
      </section>

      {/* Ventajas */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {ventajas.map((v, i) => (
            <div key={i} className="text-center p-5 rounded-none border border-white/5 hover:border-red-200 hover:shadow-lg transition-all anim-fade-in-up" style={{animationDelay: `${i * 0.1}s`}}>
              <v.icono className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <h3 className="font-bold text-white mb-1">{v.titulo}</h3>
              <p className="text-sm text-slate-500">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Eventos Populares */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Eventos Más Populares</h2>
        <p className="text-slate-500 mb-8">Las entradas más buscadas de Europa - precios desde solo €38</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {eventos.map((e, i) => (
            <Link key={i} to={e.enlace} className="group relative bg-[#1e1e1e] rounded-none border border-white/5 hover:border-red-300 hover:shadow-xl transition-all overflow-hidden anim-fade-in-up" style={{animationDelay: `${i * 0.08}s`}}>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#e10600]/10 text-red-600 px-2 py-0.5 rounded-full">{e.tag}</span>
                  <e.icono className="w-5 h-5 text-slate-300 group-hover:text-red-500 transition-colors" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2 group-hover:text-red-600 transition-colors">{e.titulo}</h3>
                <div className="space-y-1 text-sm text-slate-500">
                  <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{e.fecha}</p>
                  <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{e.lugar}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Desde</span>
                    <span className="text-2xl font-black text-white ml-1">€{e.precio}</span>
                  </div>
                  <span className="text-xs font-semibold text-red-600 group-hover:translate-x-1 transition-transform flex items-center">
                    Comprar <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SEO Content */}
      <section className="max-w-4xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-black text-white mb-4">Comprar Entradas Online - La Mejor Plataforma de Europa</h2>
        <div className="prose prose-slate max-w-none text-slate-400 space-y-4">
          <p>
            <strong>EuroMatchTickets</strong> es la plataforma líder para comprar entradas para eventos deportivos y conciertos en Europa. 
            Ofrecemos los <strong>precios más bajos garantizados</strong> para la Champions League, La Liga, Premier League, Formula 1, 
            MotoGP, y los conciertos más exclusivos del mundo.
          </p>
          <p>
            ¿Buscas <strong>entradas para el El Clásico</strong>? ¿<strong>Entradas Champions League Final 2026</strong>? 
            ¿<strong>Entradas F1 Gran Premio de España</strong>? En EuroMatchTickets encontrarás todas las entradas que necesitas 
            con entrega inmediata por QR y nuestra garantía de protección total Buyer protection.
          </p>
          <h3 className="text-xl font-bold text-white">¿Por qué comprar entradas en EuroMatchTickets?</h3>
          <ul>
            <li><strong>Precios imbatibles</strong> - Somos hasta un 40% más baratos que StubHub y Viagogo</li>
            <li><strong>Garantía Buyer protection</strong> - 100% de reembolso si el evento se cancela</li>
            <li><strong>Entrega instantánea</strong> - Recibe tus entradas en segundos por email</li>
            <li><strong>+50,000 entradas</strong> - La mayor selección de entradas en Europa</li>
            <li><strong>Pago seguro</strong> - Visa, Mastercard, AMEX, Apple Pay, Google Pay</li>
          </ul>
          <h3 className="text-xl font-bold text-white">Entradas Disponibles</h3>
          <p>
            Descubre nuestra amplia selección: <Link to="/champions-league-tickets" className="text-red-600 hover:underline">entradas Champions League</Link>, 
            <Link to="/el-clasico-tickets" className="text-red-600 hover:underline"> entradas El Clásico</Link>, 
            <Link to="/f1-tickets" className="text-red-600 hover:underline"> entradas F1</Link>, 
            <Link to="/world-cup-2026" className="text-red-600 hover:underline"> entradas Copa del Mundo 2026</Link>, 
            y <Link to="/events" className="text-red-600 hover:underline">miles de eventos más</Link>.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-black mb-3">¿Listo para vivir la experiencia?</h2>
          <p className="text-red-100 mb-6">Compra tus entradas ahora y ahorra hasta un 40% vs otros sitios</p>
          <Button size="lg" className="bg-[#1e1e1e] text-red-600 hover:bg-[#e10600]/10 font-bold text-lg px-10 py-6 rounded-none" onClick={() => navigate("/events")}>
            Explorar Entradas <Ticket className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default SpanishLandingPage;
