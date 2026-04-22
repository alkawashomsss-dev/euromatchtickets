import { Link } from "react-router-dom";
import { Shield, Ticket, CreditCard, Clock, CheckCircle, Star, Award, Users, Globe, Headphones, FileCheck, Lock } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";
import BreadcrumbSchema from "../components/BreadcrumbSchema";

const HowToBuyF1TicketsPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Buy Formula 1 Tickets",
    "description": "Complete guide on how to buy F1 tickets safely. Step-by-step instructions for purchasing Formula 1 Grand Prix tickets online.",
    "totalTime": "PT10M",
    "estimatedCost": { "@type": "MonetaryAmount", "currency": "EUR", "value": "99-599" },
    "step": [
      { "@type": "HowToStep", "name": "Choose Your Race", "text": "Select from 23 Grand Prix races worldwide" },
      { "@type": "HowToStep", "name": "Select Tickets", "text": "Choose between General Admission, Grandstand, or VIP" },
      { "@type": "HowToStep", "name": "Secure Checkout", "text": "Pay safely with credit card or PayPal" },
      { "@type": "HowToStep", "name": "Receive Tickets", "text": "Get instant QR code delivery via email" }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "Are F1 tickets refundable?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, full refund if the race is cancelled. Partial refunds available up to 30 days before the event." }},
      { "@type": "Question", "name": "How do I receive my F1 tickets?", "acceptedAnswer": { "@type": "Answer", "text": "Tickets are delivered instantly via email as mobile QR codes. You can also print PDF versions." }},
      { "@type": "Question", "name": "Are online F1 tickets safe to buy?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, when buying from verified sellers like EuroMatchTickets. We offer 100% buyer protection and secure payment." }},
      { "@type": "Question", "name": "What's the cheapest F1 race to attend?", "acceptedAnswer": { "@type": "Answer", "text": "Hungarian GP (€99) and Italian GP Monza (€99) offer the best value for General Admission tickets." }},
      { "@type": "Question", "name": "When should I buy F1 tickets?", "acceptedAnswer": { "@type": "Answer", "text": "Book 3-6 months in advance for best prices and availability. Popular races like Monaco sell out quickly." }}
    ]
  };

  return (
    <div className="min-h-screen bg-[#0e0e14]">
      <BreadcrumbSchema items={[{ name: "Home", url: "https://euromatchtickets.com/" }, { name: "Blog", url: "https://euromatchtickets.com/blog" }, { name: "How to Buy F1 Tickets", url: "https://euromatchtickets.com/how-to-buy-f1-tickets" }]} />
      <SEOHead 
        title="How to Buy F1 Tickets 2026 | Complete Guide"
        description="Learn how to buy Formula 1 tickets safely online. Step-by-step guide for purchasing F1 Grand Prix tickets. Best prices, 100% guarantee, instant delivery."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-slate-900 to-slate-950" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            How to Buy F1 Tickets
            <span className="block text-2xl mt-2 text-slate-500">Complete Guide for 2026 Season</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Your step-by-step guide to purchasing Formula 1 tickets safely and getting the best deals.
          </p>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 border-y border-white/5 bg-[#15151e]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-emerald-600">
              <Shield className="w-5 h-5" /><span>Buyer protection</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600">
              <Lock className="w-5 h-5" /><span>SSL Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600">
              <Users className="w-5 h-5" /><span>50,000+ Happy Customers</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600">
              <Star className="w-5 h-5" /><span>4.9/5 Trustpilot Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Step by Step Guide */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">4 Easy Steps to Buy F1 Tickets</h2>
          
          <div className="space-y-8">
            {[
              {
                step: 1,
                title: "Choose Your F1 Race",
                desc: "Browse our selection of 23 Formula 1 Grand Prix races for the 2026 season. From Monaco to Silverstone, Singapore to Abu Dhabi - we have tickets for every race.",
                icon: Globe,
                tips: ["Popular races sell out fast - book early!", "Night races (Singapore, Bahrain) offer unique experiences", "European races are often more affordable"]
              },
              {
                step: 2,
                title: "Select Your Ticket Type",
                desc: "Choose between General Admission, Grandstand seats, VIP Hospitality, or the exclusive Paddock Club experience.",
                icon: Ticket,
                tips: ["General Admission: Best value, access to multiple areas", "Grandstand: Reserved seating with excellent views", "VIP: Includes food, drinks, and paddock access"]
              },
              {
                step: 3,
                title: "Secure Checkout",
                desc: "Complete your purchase with our SSL-encrypted checkout. We accept all major credit cards, PayPal, and Apple Pay.",
                icon: CreditCard,
                tips: ["256-bit SSL encryption protects your data", "No hidden fees - price includes all taxes", "Multiple payment options available"]
              },
              {
                step: 4,
                title: "Receive Your Tickets Instantly",
                desc: "Your tickets are delivered immediately via email as mobile QR codes. Simply show your phone at the circuit entrance.",
                icon: Clock,
                tips: ["Instant delivery via email", "Mobile QR code - no printing needed", "PDF download also available"]
              }
            ].map((item) => (
              <div key={item.step} className="flex gap-6 bg-[#1e1e1e] border border-white/10 rounded-none p-6">
                <div className="flex-shrink-0 w-16 h-16 bg-[#e10600]/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-red-600">{item.step}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <item.icon className="w-6 h-6 text-red-600" />
                    <h3 className="text-xl font-bold">{item.title}</h3>
                  </div>
                  <p className="text-slate-500 mb-4">{item.desc}</p>
                  <ul className="space-y-1">
                    {item.tips.map((tip, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Buy From Us */}
      <section className="py-16 bg-[#15151e]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Why Buy F1 Tickets From EuroMatchTickets?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "100% Ticket Guarantee", desc: "Every ticket is verified and guaranteed valid. Full refund if any issue." },
              { icon: Award, title: "Best Price Promise", desc: "We're €10+ cheaper than F1.com, StubHub, and Viagogo on average." },
              { icon: Clock, title: "QR delivery", desc: "Receive your mobile QR tickets within seconds of purchase." },
              { icon: Lock, title: "Secure Payment", desc: "256-bit SSL encryption. Accept Visa, Mastercard, PayPal, Apple Pay." },
              { icon: Headphones, title: "24/7 Customer Support", desc: "Our team is available around the clock via chat, email, or phone." },
              { icon: FileCheck, title: "German Company", desc: "Registered in Germany with full legal compliance. Invoice included." }
            ].map((item, i) => (
              <div key={i} className="bg-[#1e1e1e] border border-white/10 rounded-none p-6">
                <item.icon className="w-10 h-10 text-emerald-600 mb-4" />
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Are F1 tickets refundable?", a: "Yes! If the race is cancelled and not rescheduled, you receive a full refund within 14 days. For voluntary cancellations, refunds are available up to 30 days before the event (minus a small admin fee)." },
              { q: "How do I receive my F1 tickets?", a: "Tickets are delivered instantly via email as mobile QR codes. You can show the QR code directly on your phone at the circuit entrance. PDF download is also available if you prefer to print." },
              { q: "Are online F1 tickets safe to buy?", a: "Absolutely! EuroMatchTickets is a verified, registered German company. We use 256-bit SSL encryption, and every ticket comes with our 100% Money Back Guarantee." },
              { q: "What's the cheapest F1 race to attend?", a: "The Hungarian GP and Italian GP (Monza) offer the best value with General Admission from €99. Spanish GP and Austrian GP are also affordable at €119." },
              { q: "When should I buy F1 tickets?", a: "We recommend booking 3-6 months in advance for the best prices and seat selection. Popular races like Monaco, Silverstone, and Singapore sell out fastest." },
              { q: "Can I resell my F1 tickets?", a: "Yes, tickets purchased from EuroMatchTickets are fully transferable. You can resell through our platform or gift them to someone else." }
            ].map((faq, i) => (
              <div key={i} className="bg-[#1e1e1e] border border-white/10 rounded-none p-6">
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-slate-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Price Comparison */}
      <section className="py-16 bg-[#15151e]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">F1 Ticket Price Comparison 2026</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-3 px-4">Race</th>
                  <th className="py-3 px-4">F1.com</th>
                  <th className="py-3 px-4">StubHub</th>
                  <th className="py-3 px-4 text-emerald-600">EuroMatchTickets</th>
                  <th className="py-3 px-4">Savings</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { race: "Monaco GP", f1: "€599", stub: "€579", ours: "€289", save: "€290" },
                  { race: "British GP", f1: "€299", stub: "€289", ours: "€149", save: "€140" },
                  { race: "Italian GP", f1: "€199", stub: "€189", ours: "€99", save: "€90" },
                  { race: "Singapore GP", f1: "€399", stub: "€379", ours: "€189", save: "€190" },
                  { race: "Abu Dhabi GP", f1: "€349", stub: "€329", ours: "€169", save: "€160" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/10">
                    <td className="py-3 px-4 font-medium">{row.race}</td>
                    <td className="py-3 px-4 text-slate-400 line-through">{row.f1}</td>
                    <td className="py-3 px-4 text-slate-400 line-through">{row.stub}</td>
                    <td className="py-3 px-4 text-emerald-600 font-bold">{row.ours}</td>
                    <td className="py-3 px-4 text-emerald-600">Save {row.save}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-slate-400 text-sm text-center mt-4">*Prices for Grandstand tickets. Updated March 2026.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-red-900/30 to-orange-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Buy Your F1 Tickets?</h2>
          <p className="text-slate-500 mb-8">Browse all 23 races and find your perfect F1 experience</p>
          <Link to="/f1-tickets">
            <Button size="lg" className="bg-[#e10600]/100 hover:bg-red-600 px-8">
              <Ticket className="w-5 h-5 mr-2" />
              Browse F1 Tickets 2026
            </Button>
          </Link>
        </div>
      </section>

      {/* Related Searches */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-lg font-bold mb-4">Related Searches:</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "how to buy F1 tickets", "F1 tickets online", "safe F1 ticket sites",
              "best F1 ticket prices", "F1 ticket guarantee", "where to buy F1 tickets",
              "F1 2026 tickets", "Formula 1 ticket guide", "F1 hospitality packages"
            ].map((term, i) => (
              <span key={i} className="px-3 py-1 bg-[#15151e] text-slate-500 rounded-full text-sm">{term}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowToBuyF1TicketsPage;
