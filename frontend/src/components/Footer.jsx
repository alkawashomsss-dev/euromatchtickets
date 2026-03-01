import { Link } from "react-router-dom";
import { 
  Ticket, Shield, CreditCard, Mail, MapPin,
  Facebook, Twitter, Instagram, Linkedin,
  CheckCircle, Lock, Globe, Award, Clock
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 border-t border-white/5">
      {/* Price Comparison Banner */}
      <div className="bg-gradient-to-r from-emerald-900/30 to-purple-900/30 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h3 className="text-lg font-bold text-white mb-4">
              💰 Compare Our Prices - Save Up to 15% vs Competitors
            </h3>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm">
              <div className="bg-zinc-800/50 px-4 py-2 rounded-lg">
                <span className="text-zinc-400">StubHub:</span>
                <span className="text-red-400 line-through ml-2">€299</span>
              </div>
              <div className="bg-zinc-800/50 px-4 py-2 rounded-lg">
                <span className="text-zinc-400">Viagogo:</span>
                <span className="text-red-400 line-through ml-2">€285</span>
              </div>
              <div className="bg-zinc-800/50 px-4 py-2 rounded-lg">
                <span className="text-zinc-400">Ticketmaster Resale:</span>
                <span className="text-red-400 line-through ml-2">€279</span>
              </div>
              <div className="bg-emerald-500/20 px-4 py-2 rounded-lg border border-emerald-500/30">
                <span className="text-emerald-400 font-bold">EuroMatchTickets:</span>
                <span className="text-emerald-400 font-bold ml-2">€249</span>
                <span className="text-emerald-300 text-xs ml-1">BEST PRICE</span>
              </div>
            </div>
            <p className="text-zinc-500 text-xs mt-3">*Average prices for Category 1 Champions League tickets. Prices may vary.</p>
          </div>
        </div>
      </div>

      {/* Trust Badges Section */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="flex items-center gap-2 text-zinc-400 bg-zinc-800/30 px-3 py-2 rounded-lg">
              <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="text-xs font-medium">100% Buyer Protection</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 bg-zinc-800/30 px-3 py-2 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="text-xs font-medium">Verified Sellers</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 bg-zinc-800/30 px-3 py-2 rounded-lg">
              <Lock className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="text-xs font-medium">SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 bg-zinc-800/30 px-3 py-2 rounded-lg">
              <CreditCard className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="text-xs font-medium">Secure Stripe Payments</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 bg-zinc-800/30 px-3 py-2 rounded-lg">
              <Ticket className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="text-xs font-medium">Instant QR Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 bg-zinc-800/30 px-3 py-2 rounded-lg">
              <Clock className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="text-xs font-medium">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">EuroMatchTickets</span>
            </Link>
            <p className="text-zinc-500 text-sm mb-4">
              Europe's #1 trusted ticket marketplace for FIFA World Cup 2026, Champions League, Premier League football matches and concerts. 500,000+ tickets sold.
            </p>
            <div className="flex gap-3 mb-4">
              <a href="https://facebook.com/euromatchtickets" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-blue-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://twitter.com/euromatchtickets" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-sky-500 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://instagram.com/euromatchtickets" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-pink-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com/company/euromatchtickets" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-blue-700 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
            {/* Rating Badge */}
            <div className="flex items-center gap-2 bg-zinc-800/50 px-3 py-2 rounded-lg w-fit">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <span className="text-sm text-white font-medium">4.9/5</span>
              <span className="text-xs text-zinc-500">(12,847 reviews)</span>
            </div>
          </div>

          {/* Football Tickets */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Football Tickets</h4>
            <ul className="space-y-2">
              <li><Link to="/events?type=match" className="text-zinc-400 hover:text-white text-sm transition-colors">All Matches</Link></li>
              <li><Link to="/world-cup-2026" className="text-zinc-400 hover:text-white text-sm transition-colors">World Cup 2026</Link></li>
              <li><Link to="/champions-league-tickets" className="text-zinc-400 hover:text-white text-sm transition-colors">Champions League</Link></li>
              <li><Link to="/events?type=match" className="text-zinc-400 hover:text-white text-sm transition-colors">Premier League</Link></li>
              <li><Link to="/events?type=match" className="text-zinc-400 hover:text-white text-sm transition-colors">La Liga</Link></li>
              <li><Link to="/events?type=match" className="text-zinc-400 hover:text-white text-sm transition-colors">Bundesliga</Link></li>
            </ul>
          </div>

          {/* Concert Tickets */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Concert Tickets</h4>
            <ul className="space-y-2">
              <li><Link to="/events?type=concert" className="text-zinc-400 hover:text-white text-sm transition-colors">All Concerts</Link></li>
              <li><Link to="/events?type=concert" className="text-zinc-400 hover:text-white text-sm transition-colors">Coldplay</Link></li>
              <li><Link to="/events?type=concert" className="text-zinc-400 hover:text-white text-sm transition-colors">Ed Sheeran</Link></li>
              <li><Link to="/events?type=concert" className="text-zinc-400 hover:text-white text-sm transition-colors">Taylor Swift</Link></li>
              <li><Link to="/events?type=concert" className="text-zinc-400 hover:text-white text-sm transition-colors">The Weeknd</Link></li>
              <li><Link to="/events?type=concert" className="text-zinc-400 hover:text-white text-sm transition-colors">Bruno Mars</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-zinc-400 hover:text-white text-sm transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="text-zinc-400 hover:text-white text-sm transition-colors">Contact Us</Link></li>
              <li><Link to="/buyer-protection" className="text-zinc-400 hover:text-white text-sm transition-colors">Buyer Protection</Link></li>
              <li><Link to="/sell-tickets" className="text-zinc-400 hover:text-white text-sm transition-colors">Sell Tickets</Link></li>
              <li><a href="mailto:support@euromatchtickets.com" className="text-zinc-400 hover:text-white text-sm transition-colors">Email Support</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-zinc-400 hover:text-white text-sm transition-colors">About Us</Link></li>
              <li><Link to="/impressum" className="text-zinc-400 hover:text-white text-sm transition-colors">Impressum</Link></li>
              <li><Link to="/terms" className="text-zinc-400 hover:text-white text-sm transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy-policy" className="text-zinc-400 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/refund-policy" className="text-zinc-400 hover:text-white text-sm transition-colors">Refund Policy</Link></li>
              <li><a href="/sitemap.xml" className="text-zinc-400 hover:text-white text-sm transition-colors">Sitemap</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Methods & Certifications */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-zinc-500 text-sm">Secure Payments:</span>
              <div className="flex items-center gap-2">
                <div className="bg-white px-2 py-1 rounded text-xs font-bold text-blue-600">VISA</div>
                <div className="bg-white px-2 py-1 rounded text-xs font-bold text-red-500">Mastercard</div>
                <div className="bg-white px-2 py-1 rounded text-xs font-bold text-blue-800">AMEX</div>
                <div className="bg-purple-600 px-2 py-1 rounded text-xs font-bold text-white">Stripe</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-zinc-500 text-xs">
                <Lock className="w-3 h-3" /> SSL Secured
              </div>
              <div className="flex items-center gap-1 text-zinc-500 text-xs">
                <Shield className="w-3 h-3" /> PCI Compliant
              </div>
              <div className="flex items-center gap-1 text-zinc-500 text-xs">
                🇪🇺 GDPR Compliant
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <a href="mailto:support@euromatchtickets.com" className="hover:text-white transition-colors">support@euromatchtickets.com</a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Erzgießereistraße 15, 80335 München, Germany</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>Serving 25+ countries across Europe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="border-t border-white/5 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center space-y-3">
            <p className="text-xs text-zinc-600 leading-relaxed max-w-4xl mx-auto">
              <strong>Legal Disclaimer:</strong> EuroMatchTickets is an independent secondary ticket marketplace operating under German law. 
              We facilitate transactions between buyers and sellers and are not the primary seller of tickets. All tickets sold through our 
              platform are resale tickets and prices may be above or below face value. We are not affiliated with, endorsed by, or officially 
              connected to FIFA, UEFA, the Premier League, La Liga, Bundesliga, Serie A, or any event organizer, sports club, artist, or venue. 
              All trademarks and copyrights are the property of their respective owners.
            </p>
            <p className="text-xs text-zinc-600">
              <strong>Buyer Protection:</strong> All purchases are covered by our 100% Money Back Guarantee. If tickets are invalid, do not 
              arrive, or the event is cancelled without rescheduling, you will receive a full refund. See our <Link to="/terms" className="text-purple-400 hover:underline">Terms of Service</Link> and <Link to="/refund-policy" className="text-purple-400 hover:underline">Refund Policy</Link> for details.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <span>© {currentYear} EuroMatchTickets.com – All Rights Reserved.</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/impressum" className="hover:text-white transition-colors">Impressum</Link>
              <span className="hidden md:inline">•</span>
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
              <span className="hidden md:inline">•</span>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              <span className="hidden md:inline">•</span>
              <Link to="/refund-policy" className="hover:text-white transition-colors">Refunds</Link>
            </div>
          </div>
          <div className="text-center mt-3">
            <p className="text-xs text-zinc-700">
              Owned and operated by Alex Heimbeck • Erzgießereistraße 15, 80335 München, Germany
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
