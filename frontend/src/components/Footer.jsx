import { Link } from "react-router-dom";
import { 
  Ticket, Shield, CreditCard, Mail, Phone, MapPin,
  Facebook, Twitter, Instagram, Linkedin, Youtube,
  CheckCircle
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 border-t border-white/5">
      {/* Trust Badges Section */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="flex items-center gap-2 text-zinc-400">
              <Shield className="w-6 h-6 text-emerald-400" />
              <span className="text-sm font-medium">100% Buyer Protection</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
              <span className="text-sm font-medium">Verified Sellers</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <CreditCard className="w-6 h-6 text-emerald-400" />
              <span className="text-sm font-medium">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <Ticket className="w-6 h-6 text-emerald-400" />
              <span className="text-sm font-medium">Instant QR Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">EuroMatchTickets</span>
            </Link>
            <p className="text-zinc-500 text-sm mb-4">
              Europe's trusted ticket marketplace for football matches and concerts.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com/euromatchtickets" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://twitter.com/euromatchtickets" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://instagram.com/euromatchtickets" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com/company/euromatchtickets" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Events */}
          <div>
            <h4 className="font-semibold mb-4">Events</h4>
            <ul className="space-y-2">
              <li><Link to="/events" className="text-zinc-400 hover:text-white text-sm transition-colors">All Events</Link></li>
              <li><Link to="/events?type=match" className="text-zinc-400 hover:text-white text-sm transition-colors">Football Matches</Link></li>
              <li><Link to="/events?type=concert" className="text-zinc-400 hover:text-white text-sm transition-colors">Concerts</Link></li>
              <li><Link to="/blog" className="text-zinc-400 hover:text-white text-sm transition-colors">Blog & Guides</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-zinc-400 hover:text-white text-sm transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="text-zinc-400 hover:text-white text-sm transition-colors">Contact Us</Link></li>
              <li><Link to="/reviews" className="text-zinc-400 hover:text-white text-sm transition-colors">Customer Reviews</Link></li>
              <li><a href="mailto:support@euromatchtickets.com" className="text-zinc-400 hover:text-white text-sm transition-colors">Email Support</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-zinc-400 hover:text-white text-sm transition-colors">About Us</Link></li>
              <li><Link to="/terms" className="text-zinc-400 hover:text-white text-sm transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy-policy" className="text-zinc-400 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/refund-policy" className="text-zinc-400 hover:text-white text-sm transition-colors">Refund Policy</Link></li>
              <li><Link to="/payment-info" className="text-zinc-400 hover:text-white text-sm transition-colors">Payment Info</Link></li>
              <li><a href="/api/sitemap.xml" className="text-zinc-400 hover:text-white text-sm transition-colors">Sitemap</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-zinc-400">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a href="mailto:support@euromatchtickets.com" className="hover:text-white transition-colors">support@euromatchtickets.com</a>
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-400">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>+49 30 1234567</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-400">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Berlin, Germany</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center justify-center gap-6 text-zinc-500">
            <span className="text-sm">Secure Payment Methods:</span>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 bg-zinc-800 rounded text-xs font-medium">VISA</div>
              <div className="px-3 py-1 bg-zinc-800 rounded text-xs font-medium">Mastercard</div>
              <div className="px-3 py-1 bg-zinc-800 rounded text-xs font-medium">AMEX</div>
              <div className="px-3 py-1 bg-zinc-800 rounded text-xs font-medium">Apple Pay</div>
              <div className="px-3 py-1 bg-zinc-800 rounded text-xs font-medium">Google Pay</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <span>© {currentYear} EuroMatchTickets GmbH. All rights reserved.</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                SSL Secured
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                PCI Compliant
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                GDPR Compliant
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
