import { Link } from "react-router-dom";
import { 
  Ticket, Shield, CreditCard, Mail, MapPin, Phone,
  Facebook, Twitter, Instagram, Linkedin,
  CheckCircle, Lock, Globe, Award, Clock, Star
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0f] text-white" data-testid="footer">
      {/* Trust Badges Bar */}
      <div className="border-b border-white/6">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: Shield, label: "100% Buyer Protection" },
              { icon: CheckCircle, label: "Verified Sellers" },
              { icon: Lock, label: "SSL Encrypted" },
              { icon: CreditCard, label: "Secure Payments" },
              { icon: Ticket, label: "Instant QR Delivery" },
              { icon: Clock, label: "24/7 Support" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-400">
                <item.icon className="w-4 h-4 text-[#e10600] flex-shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img 
                src="https://static.prod-images.emergentagent.com/jobs/4a0723d8-569f-4f37-a12d-b96fbae88e33/images/3a68688ecd89eb374164112bbca3b9cc526cf0e98afc1f70225c66468d4b831d.png" 
                alt="EuroMatchTickets" 
                className="w-9 h-9 object-contain"
              />
              <div>
                <span className="text-base font-black uppercase">EuroMatch</span>
                <span className="text-base font-black text-[#e10600] uppercase">Tickets</span>
              </div>
            </Link>
            <p className="text-slate-500 text-xs mb-4 leading-relaxed">
              Europe's #1 trusted ticket marketplace for FIFA World Cup 2026, Champions League, Premier League, F1 and concerts. 500,000+ tickets sold.
            </p>
            <div className="flex gap-1.5 mb-4">
              {[
                { icon: Facebook, href: "https://facebook.com/euromatchtickets" },
                { icon: Twitter, href: "https://twitter.com/euromatchtickets" },
                { icon: Instagram, href: "https://instagram.com/euromatchtickets" },
                { icon: Linkedin, href: "https://linkedin.com/company/euromatchtickets" },
              ].map(({ icon: Icon, href }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-[#e10600] transition-colors duration-150">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
            {/* Trustpilot-style Rating */}
            <div className="flex items-center gap-2 bg-white/5 px-3 py-2 w-fit">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-5 h-5 bg-[#00b67a] flex items-center justify-center">
                    <Star className="w-3 h-3 text-white fill-white" />
                  </div>
                ))}
              </div>
              <span className="text-xs font-bold">4.9/5</span>
              <span className="text-[10px] text-slate-600">(12,847)</span>
            </div>
          </div>

          {/* Football */}
          <div>
            <h4 className="font-black mb-3 text-white text-xs uppercase tracking-wider">Football</h4>
            <ul className="space-y-2">
              {[
                { label: "Champions League", to: "/champions-league-tickets" },
                { label: "Real Madrid", to: "/real-madrid-tickets" },
                { label: "Barcelona", to: "/barcelona-tickets" },
                { label: "Man City", to: "/manchester-city-tickets" },
                { label: "World Cup 2026", to: "/world-cup-2026" },
                { label: "El Clasico", to: "/el-clasico-tickets" },
                { label: "All Matches", to: "/events?type=match" },
              ].map(link => (
                <li key={link.label}><Link to={link.to} className="text-slate-500 hover:text-white text-xs transition-colors duration-150">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Concerts */}
          <div>
            <h4 className="font-black mb-3 text-white text-xs uppercase tracking-wider">Concerts</h4>
            <ul className="space-y-2">
              {[
                { label: "All Concerts", to: "/events?type=concert" },
                { label: "Taylor Swift", to: "/taylor-swift-wembley-2026-tickets" },
                { label: "The Weeknd", to: "/the-weeknd-tour-2026" },
                { label: "Bruno Mars", to: "/bruno-mars-tour-2026" },
                { label: "Metallica", to: "/metallica-sphere-las-vegas-tickets" },
                { label: "Bad Bunny", to: "/bad-bunny-london-2026" },
              ].map(link => (
                <li key={link.label}><Link to={link.to} className="text-slate-500 hover:text-white text-xs transition-colors duration-150">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* More Events */}
          <div>
            <h4 className="font-black mb-3 text-white text-xs uppercase tracking-wider">More Events</h4>
            <ul className="space-y-2">
              {[
                { label: "F1 Tickets", to: "/f1-tickets" },
                { label: "Spa F1 Tickets", to: "/spa-f1-tickets" },
                { label: "Belgian GP", to: "/belgian-grand-prix-tickets" },
                { label: "MotoGP", to: "/motogp-tickets" },
                { label: "World Athletics", to: "/world-athletics-2026-tickets" },
                { label: "Monaco GP", to: "/monaco-grand-prix-tickets" },
                { label: "This Weekend", to: "/events-this-weekend" },
              ].map(link => (
                <li key={link.label}><Link to={link.to} className="text-slate-500 hover:text-white text-xs transition-colors duration-150">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Guides & Blog */}
          <div>
            <h4 className="font-black mb-3 text-white text-xs uppercase tracking-wider">Guides & Blog</h4>
            <ul className="space-y-2">
              {[
                { label: "All Guides", to: "/blog" },
                { label: "Best F1 Circuits 2026", to: "/blog/best-f1-circuits-2026" },
                { label: "Spa Travel Guide", to: "/blog/spa-francorchamps-travel-guide-2026" },
                { label: "How to Buy F1 Tickets", to: "/blog/how-to-buy-f1-tickets-2026" },
                { label: "Taylor Swift London", to: "/blog/taylor-swift-eras-tour-london-guide-2026" },
                { label: "Best Seats Bernabeu", to: "/blog/best-seats-santiago-bernabeu" },
                { label: "Buy UCL Tickets Safely", to: "/blog/how-to-buy-champions-league-tickets-safely" },
              ].map(link => (
                <li key={link.label}><Link to={link.to} className="text-slate-500 hover:text-white text-xs transition-colors duration-150">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-black mb-3 text-white text-xs uppercase tracking-wider">Help & Info</h4>
            <ul className="space-y-2">
              {[
                { label: "About Us", to: "/about" },
                { label: "Buyer Protection", to: "/buyer-protection" },
                { label: "Reviews", to: "/reviews" },
                { label: "FAQ", to: "/faq" },
                { label: "Contact", to: "/contact" },
                { label: "Impressum", to: "/impressum" },
                { label: "Terms", to: "/terms" },
                { label: "Privacy", to: "/privacy-policy" },
                { label: "Refunds", to: "/refund-policy" },
              ].map(link => (
                <li key={link.label}><Link to={link.to} className="text-slate-500 hover:text-white text-xs transition-colors duration-150">{link.label}</Link></li>
              ))}
              <li><a href="/sitemap.xml" className="text-slate-500 hover:text-white text-xs transition-colors duration-150">Sitemap</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment & Security */}
      <div className="border-t border-white/6">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-slate-600 text-xs uppercase tracking-wider font-bold">Secure Payments:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { name: "VISA", bg: "bg-white text-blue-700" },
                  { name: "MC", bg: "bg-white text-red-600" },
                  { name: "AMEX", bg: "bg-white text-blue-900" },
                  { name: "Stripe", bg: "bg-violet-600 text-white" },
                ].map(p => (
                  <div key={p.name} className={`px-2 py-0.5 text-[9px] font-black ${p.bg}`}>{p.name}</div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-slate-600 uppercase tracking-wider font-bold">
              <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> SSL</span>
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> PCI</span>
              <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> GDPR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="border-t border-white/6">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row items-center justify-center gap-5 text-xs text-slate-600">
            <a href="tel:+498920174141" className="flex items-center gap-1.5 hover:text-white transition-colors duration-150">
              <Phone className="w-3.5 h-3.5" /> +49 89 20174141
            </a>
            <a href="mailto:support@euromatchtickets.com" className="flex items-center gap-1.5 hover:text-white transition-colors duration-150">
              <Mail className="w-3.5 h-3.5" /> support@euromatchtickets.com
            </a>
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Munich, Germany</span>
            <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> 25+ Countries</span>
          </div>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="border-t border-white/6">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-[10px] text-slate-700 leading-relaxed text-center max-w-4xl mx-auto">
            <strong className="text-slate-600">Legal:</strong> EuroMatchTickets is an independent secondary ticket marketplace. Prices may be above or below face value. Not affiliated with FIFA, UEFA, or any event organizer.
          </p>
          <p className="text-[10px] text-slate-700 text-center mt-1">
            All purchases covered by <Link to="/refund-policy" className="text-[#e10600] hover:underline">100% Money Back Guarantee</Link>.
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/6">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-[10px] text-slate-700">
            <span>&copy; {currentYear} EuroMatchTickets.com</span>
            <div className="flex items-center gap-4">
              <Link to="/impressum" className="hover:text-white transition-colors duration-150">Impressum</Link>
              <Link to="/privacy-policy" className="hover:text-white transition-colors duration-150">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition-colors duration-150">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
