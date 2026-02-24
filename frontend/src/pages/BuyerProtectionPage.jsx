import { Helmet } from 'react-helmet-async';
import { Shield, CheckCircle, RefreshCw, Clock, Mail, Phone, AlertTriangle, BadgeCheck, Lock, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const BuyerProtectionPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <Helmet>
        <title>Buyer Protection & Ticket Guarantee | EuroMatchTickets</title>
        <meta name="description" content="Learn about EuroMatchTickets buyer protection policy. 100% money-back guarantee if tickets are invalid or not delivered. Secure verified ticket marketplace." />
        <meta name="keywords" content="ticket guarantee, buyer protection, money back guarantee, verified tickets, secure ticket purchase" />
      </Helmet>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-emerald-500/10 to-zinc-950 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <div className="w-20 h-20 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Shield className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            100% Buyer Protection
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Your purchase is protected. If something goes wrong, we've got you covered with our comprehensive guarantee.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        {/* Main Guarantee Box */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-3xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Our Triple Guarantee</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-4">
                <BadgeCheck className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Valid Tickets</h3>
              <p className="text-zinc-400 text-sm">Every ticket is verified before sale. Invalid? Full refund.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">On-Time Delivery</h3>
              <p className="text-zinc-400 text-sm">Tickets not received before the event? Full refund.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-2xl flex items-center justify-center mb-4">
                <RefreshCw className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Event Cancelled</h3>
              <p className="text-zinc-400 text-sm">Event cancelled without reschedule? Full refund.</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            How Buyer Protection Works
          </h2>
          
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "Seller Verification",
                desc: "Every seller on our platform undergoes identity verification. We check their history, reviews, and ticket authenticity before allowing listings."
              },
              {
                step: 2,
                title: "Secure Payment Hold",
                desc: "When you purchase, your payment is held securely by Stripe. The seller doesn't receive funds until you've attended the event."
              },
              {
                step: 3,
                title: "Ticket Validation",
                desc: "We verify ticket authenticity using barcode validation and cross-reference with official sources where possible."
              },
              {
                step: 4,
                title: "Instant Digital Delivery",
                desc: "Once verified, you receive your ticket as a QR code via email. No waiting, no shipping delays."
              },
              {
                step: 5,
                title: "Post-Event Release",
                desc: "After successful event entry, the seller receives payment. If there's any issue, funds are returned to you."
              }
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-zinc-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What's Covered */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Shield className="w-6 h-6 text-emerald-400" />
            What's Covered
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 border border-emerald-500/20 rounded-xl p-6">
              <h3 className="font-bold text-emerald-400 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                You ARE Protected When:
              </h3>
              <ul className="space-y-3 text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>Tickets are not delivered before the event</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>Tickets are invalid or don't work at entry</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>Event is cancelled (not postponed)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>Ticket details don't match the listing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>Duplicate tickets (already used by someone else)</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-zinc-900/50 border border-red-500/20 rounded-xl p-6">
              <h3 className="font-bold text-red-400 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                NOT Covered:
              </h3>
              <ul className="space-y-3 text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>You changed your mind after purchase</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>You can't attend due to personal reasons</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Event is postponed to a new date</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>View obstructions not mentioned in listing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Purchases made outside our platform</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* How to Claim */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <RefreshCw className="w-6 h-6 text-cyan-400" />
            How to Claim a Refund
          </h2>
          
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">1</span>
                <div>
                  <p className="font-semibold">Contact Us Within 48 Hours</p>
                  <p className="text-zinc-400 text-sm">Report the issue within 48 hours of the event date.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">2</span>
                <div>
                  <p className="font-semibold">Provide Evidence</p>
                  <p className="text-zinc-400 text-sm">Share your order number and any relevant proof (screenshots, venue rejection notice, etc.)</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">3</span>
                <div>
                  <p className="font-semibold">Review Process</p>
                  <p className="text-zinc-400 text-sm">Our team reviews your claim within 3-5 business days.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">4</span>
                <div>
                  <p className="font-semibold">Refund Processed</p>
                  <p className="text-zinc-400 text-sm">If approved, refund is issued to your original payment method within 5-10 business days.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* Security Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Lock className="w-6 h-6 text-purple-400" />
            Our Security Measures
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: Lock, title: "SSL Encryption", desc: "256-bit encryption on all transactions" },
              { icon: CreditCard, title: "Stripe Payments", desc: "PCI-compliant payment processing" },
              { icon: BadgeCheck, title: "Seller Verification", desc: "ID check for all sellers" },
              { icon: Shield, title: "Fraud Detection", desc: "AI-powered fraud prevention" }
            ].map((item, idx) => (
              <div key={idx} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-zinc-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="text-zinc-400 mb-6">Our support team is here to help with any issues.</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-zinc-300">
              <Mail className="w-5 h-5 text-purple-400" />
              <a href="mailto:Alkawashoms@gmail.com" className="hover:text-purple-400">Alkawashoms@gmail.com</a>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <Phone className="w-5 h-5 text-purple-400" />
              <span>+49 178 130 4137</span>
            </div>
          </div>
          
          <Link to="/contact">
            <Button className="bg-purple-500 hover:bg-purple-600">
              Contact Support
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default BuyerProtectionPage;
