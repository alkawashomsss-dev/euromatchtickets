import { Link } from "react-router-dom";
import { 
  Ticket, Shield, CreditCard, Mail, MapPin,
  Facebook, Twitter, Instagram, Linkedin,
  CheckCircle, Lock, Globe, Award, Clock, Star
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white" data-testid="footer">
      {/* Trust Badges Bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: Shield, label: "100% Buyer Protection", color: "text-emerald-400" },
              { icon: CheckCircle, label: "Verified Sellers", color: "text-emerald-400" },
              { icon: Lock, label: "SSL Encrypted", color: "text-blue-400" },
              { icon: CreditCard, label: "Secure Payments", color: "text-blue-400" },
              { icon: Ticket, label: "Instant QR Delivery", color: "text-amber-400" },
              { icon: Clock, label: "24/7 Support", color: "text-amber-400" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-300">
                <item.icon className={`w-5 h-5 ${item.color} flex-shrink-0`} />
                <span className="text-xs font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <img 
                src="https://static.prod-images.emergentagent.com/jobs/4a0723d8-569f-4f37-a12d-b96fbae88e33/images/3a68688ecd89eb374164112bbca3b9cc526cf0e98afc1f70225c66468d4b831d.png" 
                alt="EuroMatchTickets" 
                className="w-10 h-10 rounded-xl shadow-md object-contain"
              />
              <div>
                <span className="text-lg font-bold">EuroMatch</span>
                <span className="text-lg font-bold text-amber-400">Tickets</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm mb-5 leading-relaxed">
              Europe's #1 trusted ticket marketplace for FIFA World Cup 2026, Champions League, Premier League, F1 and concerts. 500,000+ tickets sold.
            </p>
            <div className="flex gap-2 mb-5">
              {[
                { icon: Facebook, href: "https://facebook.com/euromatchtickets", hoverBg: "hover:bg-blue-600" },
                { icon: Twitter, href: "https://twitter.com/euromatchtickets", hoverBg: "hover:bg-sky-500" },
                { icon: Instagram, href: "https://instagram.com/euromatchtickets", hoverBg: "hover:bg-pink-600" },
                { icon: Linkedin, href: "https://linkedin.com/company/euromatchtickets", hoverBg: "hover:bg-blue-700" },
              ].map(({ icon: Icon, href, hoverBg }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" className={`w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-slate-400 hover:text-white ${hoverBg} transition-all`}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            {/* Rating */}
            <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg w-fit">
              <div className="flex">{[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}</div>
              <span className="text-sm font-medium">4.9/5</span>
              <span className="text-xs text-slate-500">(12,847 reviews)</span>
            </div>
          </div>

          {/* Football */}
          <div>
            <h4 className="font-semibold mb-4 text-white text-sm">Football</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Champions League", to: "/champions-league-tickets" },
                { label: "Real Madrid Tickets", to: "/real-madrid-tickets" },
                { label: "Barcelona Tickets", to: "/barcelona-tickets" },
                { label: "Man City Tickets", to: "/manchester-city-tickets" },
                { label: "World Cup 2026", to: "/world-cup-2026" },
                { label: "El Clasico", to: "/el-clasico-tickets" },
                { label: "All Matches", to: "/events?type=match" },
              ].map(link => (
                <li key={link.label}><Link to={link.to} className="text-slate-400 hover:text-white text-sm transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Concerts */}
          <div>
            <h4 className="font-semibold mb-4 text-white text-sm">Concerts</h4>
            <ul className="space-y-2.5">
              {[
                { label: "All Concerts", to: "/events?type=concert" },
                { label: "Taylor Swift Wembley", to: "/taylor-swift-wembley-2026-tickets" },
                { label: "The Weeknd Tour", to: "/the-weeknd-tour-2026" },
                { label: "Bruno Mars Tour", to: "/bruno-mars-tour-2026" },
                { label: "Metallica Las Vegas", to: "/metallica-sphere-las-vegas-tickets" },
                { label: "Bad Bunny London", to: "/bad-bunny-london-2026" },
              ].map(link => (
                <li key={link.label}><Link to={link.to} className="text-slate-400 hover:text-white text-sm transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-white text-sm">More Events</h4>
            <ul className="space-y-2.5">
              {[
                { label: "F1 Tickets", to: "/f1-tickets" },
                { label: "MotoGP", to: "/motogp-tickets" },
                { label: "World Athletics", to: "/world-athletics-2026-tickets" },
                { label: "Monaco GP", to: "/monaco-grand-prix-tickets" },
                { label: "Events This Weekend", to: "/events-this-weekend" },
              ].map(link => (
                <li key={link.label}><Link to={link.to} className="text-slate-400 hover:text-white text-sm transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-white text-sm">Help & Info</h4>
            <ul className="space-y-2.5">
              {[
                { label: "About Us", to: "/about" },
                { label: "Buyer Protection", to: "/buyer-protection" },
                { label: "Reviews", to: "/reviews" },
                { label: "FAQ", to: "/faq" },
                { label: "Contact Us", to: "/contact" },
                { label: "Impressum", to: "/impressum" },
                { label: "Terms of Service", to: "/terms" },
                { label: "Privacy Policy", to: "/privacy-policy" },
                { label: "Refund Policy", to: "/refund-policy" },
              ].map(link => (
                <li key={link.label}><Link to={link.to} className="text-slate-400 hover:text-white text-sm transition-colors">{link.label}</Link></li>
              ))}
              <li><a href="/sitemap.xml" className="text-slate-400 hover:text-white text-sm transition-colors">Sitemap</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment & Security */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-slate-500 text-sm">Secure Payments:</span>
              <div className="flex items-center gap-2">
                {[
                  { name: "VISA", bg: "bg-white text-blue-700" },
                  { name: "MC", bg: "bg-white text-red-600" },
                  { name: "AMEX", bg: "bg-white text-blue-900" },
                  { name: "Stripe", bg: "bg-violet-600 text-white" },
                ].map(p => (
                  <div key={p.name} className={`px-2.5 py-1 rounded text-[10px] font-bold ${p.bg}`}>{p.name}</div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-5 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> SSL Secured</span>
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> PCI Compliant</span>
              <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> GDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-slate-500">
            <a href="mailto:support@euromatchtickets.com" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail className="w-4 h-4" /> support@euromatchtickets.com
            </a>
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Erzgieereistr. 15, 80335 Munchen, Germany</span>
            <span className="flex items-center gap-2"><Globe className="w-4 h-4" /> Serving 25+ countries across Europe</span>
          </div>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="border-t border-white/10 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-[11px] text-slate-600 leading-relaxed text-center max-w-4xl mx-auto">
            <strong>Legal Disclaimer:</strong> EuroMatchTickets is an independent secondary ticket marketplace operating under German law. We facilitate transactions between buyers and sellers and are not the primary seller of tickets. All tickets sold through our platform are resale tickets and prices may be above or below face value. We are not affiliated with, endorsed by, or officially connected to FIFA, UEFA, the Premier League, La Liga, Bundesliga, Serie A, or any event organizer, sports club, artist, or venue. All trademarks and copyrights are the property of their respective owners.
          </p>
          <p className="text-[11px] text-slate-600 text-center mt-2">
            <strong>Buyer Protection:</strong> All purchases are covered by our 100% Money Back Guarantee. See our <Link to="/terms" className="text-amber-400 hover:underline">Terms</Link> and <Link to="/refund-policy" className="text-amber-400 hover:underline">Refund Policy</Link>.
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>&copy; {currentYear} EuroMatchTickets.com &ndash; All Rights Reserved.</span>
            <div className="flex items-center gap-4">
              <Link to="/impressum" className="hover:text-white transition-colors">Impressum</Link>
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link to="/refund-policy" className="hover:text-white transition-colors">Refunds</Link>
            </div>
          </div>
          <p className="text-center mt-2 text-[10px] text-slate-700">
            Owned and operated by Alex Heimbeck &middot; Erzgieereistr. 15, 80335 Munchen, Germany
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
